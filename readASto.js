const myJson = {"geometry": {"vertices": [[-17.638483047485352, 63.762111663818359, 22.396820068359375], [-17.638483047485352, 49.410800933837891, 0.0], [13.629737854003906, 78.113426208496094, 16.797615051269531], [4.4897956848144531, 71.859779357910156, 0.0], [-17.638483047485352, 71.859779357910156, 19.237491607666016], [13.629737854003906, 49.410800933837891, 16.797615051269531], [4.4897956848144531, 78.113426208496094, 0.0], [-17.638483047485352, 71.859779357910156, 0.0], [4.4897956848144531, 71.859779357910156, 19.237491607666016], [-17.638483047485352, 49.410800933837891, 16.797615051269531], [13.629737854003906, 78.113426208496094, 0.0], [13.629737854003906, 63.762111663818359, 22.396820068359375], [13.629737854003906, 49.410800933837891, 0.0], [4.4897956848144531, 78.113426208496094, 16.797615051269531]], "faceCollections": [{"collectionType": "main", "centroid": [-6.5743436813354492, 71.859779357910156, 9.6187458038330078], "faces": [[[8, 0], [3, 1], [7, 2], [4, 3]]], "texture": null, "textureVs": []}, {"collectionType": "main", "centroid": [-2.0043725967407227, 49.410800933837891, 8.3988075256347656], "faces": [[[9, 0], [1, 1], [12, 2], [5, 3]]], "texture": null, "textureVs": []}, {"collectionType": "main", "centroid": [13.629737854003906, 63.762113189697267, 11.198410034179688], "faces": [[[5, 0], [12, 1], [10, 2], [2, 3]], [[11, 4], [5, 0], [2, 3]]], "texture": null, "textureVs": []}, {"collectionType": "main", "centroid": [4.4897956848144531, 74.986602783203125, 9.0087766647338867], "faces": [[[13, 0], [6, 1], [3, 2], [8, 3]]], "texture": null, "textureVs": []}, {"collectionType": "main", "centroid": [-17.638483047485352, 61.260654449462891, 11.686385345458984], "faces": [[[0, 0], [4, 1], [7, 2]], [[0, 0], [7, 2], [9, 3]], [[1, 4], [9, 3], [7, 2]]], "texture": null, "textureVs": []}, {"collectionType": "main", "centroid": [9.0597667694091797, 78.113426208496094, 8.3988075256347656], "faces": [[[2, 0], [10, 1], [6, 2], [13, 3]]], "texture": null, "textureVs": []}, {"collectionType": "roof", "centroid": [-2.0043725967407227, 56.586456298828125, 19.597217559814453], "faces": [[[9, 0], [5, 1], [11, 2], [0, 3]]], "texture": null, "textureVs": []}, {"collectionType": "roof", "centroid": [0.16035016377766928, 71.245105743408203, 19.477308909098308], "faces": [[[8, 0], [4, 1], [0, 2]], [[11, 3], [2, 4], [8, 0]], [[13, 5], [8, 0], [2, 4]], [[0, 2], [11, 3], [8, 0]]], "texture": null, "textureVs": []}, {"collectionType": "footprint", "centroid": [0.16035016377766928, 66.461335500081375, 0.0], "faces": [[[3, 0], [12, 1], [1, 2], [7, 3]], [[6, 4], [10, 5], [3, 0]], [[12, 1], [3, 0], [10, 5]]], "texture": null, "textureVs": []}]}};

let vertexArray = [];
const vertices = myJson["geometry"]["vertices"];
for (const collection of myJson["geometry"]["faceCollections"]) {
    for (const face of collection["faces"]) {
        console.log(face)
        if (face.length === 3) {
            for (const vI of face) {
                vertexArray.push(vertices[vI[0]][0]*.1);
                vertexArray.push(vertices[vI[0]][1]*.1);
                vertexArray.push(vertices[vI[0]][2]*.1);
            };
        } else if (face.length === 4) {
            for (const subList of [[face[0], face[1], face[2]], [face[0], face[2], face[3]]]) {
                for (const vI of subList) {
                    vertexArray.push(vertices[vI[0]][0]*.1);
                    vertexArray.push(vertices[vI[0]][1]*.1);
                    vertexArray.push(vertices[vI[0]][2]*.1);
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
  
let aCanvas = document.getElementById("aCanvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  35, window.innerWidth / window.innerHeight, .01, 100);
camera.position.set(0, 10., 50.);

const renderer = new THREE.WebGLRenderer( { canvas: aCanvas, alpha: true} );
renderer.setPixelRatio( window.devicePixelRatio );

// adding any object at all
const material = new THREE.MeshStandardMaterial({color : "white", opacity: .5});

// adding a baseplane
const box = new THREE.BoxGeometry(1, 1, 1);
const boxMesh = new THREE.Mesh(aHouse, material);
scene.add(boxMesh);

const controls = new THREE.OrbitControls(camera, renderer.domElement);

function animate() {
    requestAnimationFrame(animate);
    renderer.render( scene, camera );
}

animate();
