// import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
// import { OrbitControls } from "./libs/OrbitControls.js";

// Set constraints for the video stream
let track = null;

// Define constants
const cameraView = document.querySelector("#camera--view"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraTrigger = document.querySelector("#camera--trigger");

const modelCanvas = document.getElementById("model-three");

if (navigator.platform === "MacIntel" || navigator.platform === "MacApple") {
    console.log("u're on a Mac!");

    const constraints = { video: {
            width: window.innerWidth,
            height: window.innerHeight,
            frameRate: 15
        } };
    var video = document.querySelector("cameraView");

    // console.log(video);
    // console.log(navigator.mediaDevices);

    function cameraStart() {
        navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
    }

    window.addEventListener("load", cameraStart, false);

    // if (navigator.mediaDevices.getUserMedia) {
    // navigator.mediaDevices.getUserMedia(constraints)
    //     .then(function (stream) {
    //         track = stream.getTracks()[0];
    //         cameraView.srcObject = stream;
    //     })
    //     .catch(function (err0r) {
    //     console.log("Something went wrong! - " + err0r);
    //     });

    //     window.addEventListener("load", cameraStart, false);
    // }

    // window.addEventListener("load", cameraStart, false);

} else if (navigator.platform === "iPhone") {
    console.log("u're on an iPhone!");

    const constraints = { video: { facingMode: { exact: "environment" } }, audio: false };
    // Access the device camera and stream to cameraView
    function cameraStart() {
        navigator.mediaDevices
        .getUserMedia(constraints)
        .then(function(stream) {
            track = stream.getTracks()[0];
            cameraView.srcObject = stream;
        })
        .catch(function(error) {
            console.error("Oops. Something is broken.", error);
        });
    }   

    window.addEventListener("load", cameraStart, false);

} else {
    console.log("unsupported platform" + navigator.platform);
}

const sphereMaterial = new THREE.MeshStandardMaterial({color : "blue", opacity: .9});

const sphere = new THREE.DodecahedronGeometry(.1, 2);

const sphereMesh = new THREE.InstancedMesh( sphere, sphereMaterial, 4 );
const meshHeight = 10.;

let count = 0;

let coordinates = [];

for (var i = 0; i < 2; i++) {
    for (var j = 0; j < 2; j++) {
        var matrix = new THREE.Matrix4().makeTranslation(
            meshHeight * .5,
            meshHeight * (-.5 + i),
            meshHeight * (-.5 + j)
        );

        coordinates.push(new THREE.Vector3(
            meshHeight * .5,
            meshHeight * (-.5 + i),
            meshHeight * (-.5 + j)
        ));

        sphereMesh.setMatrixAt(count, matrix);
        count += 1;
    }
}

console.log(navigator.platform);
console.log(navigator.userAgent);

const threeModel = document.getElementById("model-three");
// var video = document.querySelector("#videoElement");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75, window.innerWidth / window.window.innerHeight, 0.1, 2000);
camera.position.set(0, 10., 50.);

const renderer = new THREE.WebGLRenderer( { canvas: modelCanvas, alpha: true} );
renderer.setSize( window.innerWidth, window.innerHeight);
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setClearColor(0xffffff, 0);
scene.background = null;
// scene.background = new THREE.Color( 0xff0000, 1 );

// console.log(THREE.OrbitControls);
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// scene.background = null;
// renderer.shadowMap.enabled = true;

//Adding Controls
console.log(camera, renderer.domElement);

// adding any object at all
const material = new THREE.MeshStandardMaterial({color : "white", opacity: .5});

// adding a baseplane
const plane = new THREE.BoxGeometry(meshHeight, meshHeight, meshHeight);
const planeMesh = new THREE.Mesh(plane, material);
// planeMesh.rotation.y = .5;
// planeMesh.rotation.x = -.5*Math.Pi;
scene.add(sphereMesh);
scene.add(planeMesh);
scene.add(sphereMesh);

// add light
const light = new THREE.HemisphereLight("white", "blue", 1.);
scene.add(light);
const dirLight = new THREE.DirectionalLight("green", .5);
dirLight.castShadow=true;
scene.add(dirLight);

function animate() {
    requestAnimationFrame(animate);
    renderer.render( scene, camera );
}

let newCoordinates = [];

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    newCoordinates = [];
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");

    console.log(coordinates);

    // getting the vector coordinates
    for (const vector of coordinates) {

        // console.log(vector);
        // const cv = canvas.domElement;
        let v = vector.clone();
    
        v.project(camera);
    
        v.x = Math.round((0.5 + v.x / 2) * (modelCanvas.width / window.devicePixelRatio));
        v.y = Math.round((0.5 - v.y / 2) * (modelCanvas.height / window.devicePixelRatio));

        newCoordinates.push(new THREE.Vector3(v.x, v.y, 0.));
    }

    console.log(newCoordinates);

    // storing the canvas as an image
    let dataURL = cameraSensor.toDataURL("image/png");
    let newTab = window.open('about:blank','image from canvas');
    newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
};

animate();

// Start the video stream when the window loads