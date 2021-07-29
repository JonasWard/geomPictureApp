// import { OrbitControls } from "https://threejs.org/examples/jsm/controls/OrbitControls.js";
// import { OrbitControls } from "./libs/OrbitControls.js";

// loading in a house
let myJson = {"geometry": {"vertices": [[-17.638483047485352, 63.762111663818359, 22.396820068359375], [-17.638483047485352, 49.410800933837891, 0.0], [13.629737854003906, 78.113426208496094, 16.797615051269531], [4.4897956848144531, 71.859779357910156, 0.0], [-17.638483047485352, 71.859779357910156, 19.237491607666016], [13.629737854003906, 49.410800933837891, 16.797615051269531], [4.4897956848144531, 78.113426208496094, 0.0], [-17.638483047485352, 71.859779357910156, 0.0], [4.4897956848144531, 71.859779357910156, 19.237491607666016], [-17.638483047485352, 49.410800933837891, 16.797615051269531], [13.629737854003906, 78.113426208496094, 0.0], [13.629737854003906, 63.762111663818359, 22.396820068359375], [13.629737854003906, 49.410800933837891, 0.0], [4.4897956848144531, 78.113426208496094, 16.797615051269531]], "faceCollections": [{"collectionType": "main", "centroid": [-6.5743436813354492, 71.859779357910156, 9.6187458038330078], "faces": [[[8, 0], [3, 1], [7, 2], [4, 3]]], "texture": null, "textureVs": []}, {"collectionType": "main", "centroid": [-2.0043725967407227, 49.410800933837891, 8.3988075256347656], "faces": [[[9, 0], [1, 1], [12, 2], [5, 3]]], "texture": null, "textureVs": []}, {"collectionType": "main", "centroid": [13.629737854003906, 63.762113189697267, 11.198410034179688], "faces": [[[5, 0], [12, 1], [10, 2], [2, 3]], [[11, 4], [5, 0], [2, 3]]], "texture": null, "textureVs": []}, {"collectionType": "main", "centroid": [4.4897956848144531, 74.986602783203125, 9.0087766647338867], "faces": [[[13, 0], [6, 1], [3, 2], [8, 3]]], "texture": null, "textureVs": []}, {"collectionType": "main", "centroid": [-17.638483047485352, 61.260654449462891, 11.686385345458984], "faces": [[[0, 0], [4, 1], [7, 2]], [[0, 0], [7, 2], [9, 3]], [[1, 4], [9, 3], [7, 2]]], "texture": null, "textureVs": []}, {"collectionType": "main", "centroid": [9.0597667694091797, 78.113426208496094, 8.3988075256347656], "faces": [[[2, 0], [10, 1], [6, 2], [13, 3]]], "texture": null, "textureVs": []}, {"collectionType": "roof", "centroid": [-2.0043725967407227, 56.586456298828125, 19.597217559814453], "faces": [[[9, 0], [5, 1], [11, 2], [0, 3]]], "texture": null, "textureVs": []}, {"collectionType": "roof", "centroid": [0.16035016377766928, 71.245105743408203, 19.477308909098308], "faces": [[[8, 0], [4, 1], [0, 2]], [[11, 3], [2, 4], [8, 0]], [[13, 5], [8, 0], [2, 4]], [[0, 2], [11, 3], [8, 0]]], "texture": null, "textureVs": []}, {"collectionType": "footprint", "centroid": [0.16035016377766928, 66.461335500081375, 0.0], "faces": [[[3, 0], [12, 1], [1, 2], [7, 3]], [[6, 4], [10, 5], [3, 0]], [[12, 1], [3, 0], [10, 5]]], "texture": null, "textureVs": []}]}};

let vertexArray = [];
const vertices = myJson["geometry"]["vertices"];
for (const collection of myJson["geometry"]["faceCollections"]) {
    for (const face of collection["faces"]) {
        console.log(face)
        if (face.length === 3) {
            for (const vI of face) {
                vertexArray.push(vertices[vI[0]][0]);
                vertexArray.push(vertices[vI[0]][1]);
                vertexArray.push(vertices[vI[0]][2]);
            };
        } else if (face.length === 4) {
            for (const subList of [[face[0], face[1], face[2]], [face[0], face[2], face[3]]]) {
                for (const vI of subList) {
                    vertexArray.push(vertices[vI[0]][0]);
                    vertexArray.push(vertices[vI[0]][1]);
                    vertexArray.push(vertices[vI[0]][2]);
                };
            }
        } else {
            console.log(face.length);
        }
    };
};

let houseGeo;
const aHouse = new THREE.BufferGeometry();
const positionNumComponents = 3;
aHouse.setAttribute(
  'position',
  new THREE.BufferAttribute(new Float32Array(vertexArray), positionNumComponents));

// selecting face(s)

let coordinates = [];

let coordinateMap = {};

const activeFaceList = [1, 2];
let coordCount = 0;
let localCount = 0;
for (const faceIdx of activeFaceList) {
    localCount = 0;
    for (const face of myJson["geometry"]["faceCollections"][faceIdx]["faces"]){
        for (const vI of face) {
            coordinateMap[coordCount] = [faceIdx, localCount];

            coordinates.push(new THREE.Vector3(
                vertices[vI[0]][0],
                vertices[vI[0]][1],
                vertices[vI[0]][2]
            ));
            coordCount += 1;
            localCount += 1;
        };
    }
}

console.log(coordinateMap);

// ending loading in of a house

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

const sphere = new THREE.DodecahedronGeometry(1., 2);

const sphereMesh = new THREE.InstancedMesh( sphere, sphereMaterial, coordinates.length );
const meshHeight = 10.;

let count = 0;

// let coordinates = [
//     new THREE.Vector3(meshHeight * .5, meshHeight * (-.5), meshHeight * (-.5)),
//     new THREE.Vector3(meshHeight * .5, meshHeight * (-.5), meshHeight * (.5)),
//     new THREE.Vector3(meshHeight * .5, meshHeight * (.5), meshHeight * (.5)),
//     new THREE.Vector3(meshHeight * .5, meshHeight * (.5), meshHeight * (-.5))
// ];

for (const c of coordinates) {
    let matrix = new THREE.Matrix4().makeTranslation(c.x, c.y, c.z);

    sphereMesh.setMatrixAt(count, matrix);

    count += 1;
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
// const plane = new THREE.BoxGeometry(meshHeight, meshHeight, meshHeight);
const planeMesh = new THREE.Mesh(aHouse, material);
// planeMesh.rotation.y = .5;
// planeMesh.rotation.x = -.5*Math.Pi;
scene.add(sphereMesh);
scene.add(planeMesh);

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

let vString;
let tString;
let fString;

// Take a picture when cameraTrigger is tapped
cameraTrigger.onclick = function() {
    vString = "";
    tString = "";
    fString = "f 1/1 2/2 3/3 4/4";

    newCoordinates = [];
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    cameraOutput.src = cameraSensor.toDataURL("image/webp");
    cameraOutput.classList.add("taken");

    console.log(coordinates);

    // getting the vector coordinates
    let localCount = 0;
    for (const vector of coordinates) {

        vString += 'v ' + vector.x.toString() + ' ' + vector.y.toString() + ' ' + vector.z.toString() + '\n';

        // console.log(vector);
        // const cv = canvas.domElement;
        let v = vector.clone();
    
        v.project(camera);
    
        v.x = (0.5 + v.x / 2) * (1. / window.devicePixelRatio);
        v.y = (0.5 + v.y / 2) * (1. / window.devicePixelRatio);
        tString += 'vt ' + v.x.toString() + ' ' + v.y.toString() + ' 0\n';
        
        // vertexCoordinates.push(new THREE.Vector3(v.x, v.y, 0.));
        newCoordinates.push(new THREE.Vector3(v.x * modelCanvas.width, v.y * modelCanvas.height, 0.));
        
        myJson["geometry"]["faceCollections"][coordinateMap[localCount][0]]["texture"] = "this_image.png";
        myJson["geometry"]["faceCollections"][coordinateMap[localCount][0]]["textureVs"].push([v.x, v.y]);
        
        localCount += 1;
    }

    // console.log(newCoordinates);

    // console.log(vString+tString+fString);
    console.log(myJson);

    // storing the canvas as an image
    let dataURL = cameraSensor.toDataURL("image/png");
    let newTab = window.open('about:blank','image from canvas');
    newTab.document.write("<img src='" + dataURL + "' alt='from canvas'/>");
};

animate();

// Start the video stream when the window loads