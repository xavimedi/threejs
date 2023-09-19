"use strict";

//SCENE
const scene = new THREE.Scene();

//CAMERA
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 7;

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

//RENDERER
var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#000000");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

//RAYCASTER
const pointer = new THREE.Vector2();
const raycaster = new THREE.Raycaster();

function onPointerMove( event ) {
    pointer.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    pointer.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

//LIGHT
const light = new THREE.PointLight(0xffffff, 2, 100, 1)
const ambientLight = new THREE.AmbientLight(0x000000);

light.position.set(0,10,0);
ambientLight.position.set(0, 0, 0);

scene.add(light);
scene.add(ambientLight);

//SHAPE
let icosahedron = new THREE.IcosahedronGeometry(10, 0);

let sphere1 = new THREE.OctahedronGeometry(.7, 2)
let sphere2 = new THREE.OctahedronGeometry(.7, 2)
let sphere3 = new THREE.OctahedronGeometry(.7, 2)

let highlightedObject = null;

//MATERIALS
const colors = [
    0x0088FF, 0x4066EE, 0x8044DD, 0xC022CC, 0xFF00BB,
    0xFF795E, 0xFFCA1F, 0xFFF200, 0x00D12D, 0x0D98BA
];

const material1 = new THREE.MeshLambertMaterial({color: 0x00FFFF});
const material2 = new THREE.MeshLambertMaterial({color: 0x00FFFF})
const material3 = new THREE.MeshLambertMaterial({color: 0x00FFFF})

//SCENE.ADD
const gem1 = new THREE.Mesh(sphere1, material1);
const gem2 = new THREE.Mesh(sphere2, material2);
const gem3 = new THREE.Mesh(sphere3, material3);
scene.add(gem1);
scene.add(gem2);
scene.add(gem3);

const icos = [];
for (let i = 0; i < colors.length; i++) {
    const color = new THREE.MeshLambertMaterial({ color: colors[i] });
    const ico = new THREE.Mesh(icosahedron, color);
    const rotation = 0.03;
    ico.rotation.set(rotation * i, rotation * i, rotation * i);
    scene.add(ico);
    icos.push(ico);
}

//MOVEMENT

gem1.position.set(-2, -4, 0)
gem2.position.set(0, -4, 0)
gem3.position.set(2, -4, 0)

const render = function () {
    requestAnimationFrame(render);
    // OCTA ROTATION

    if (highlightedObject) {
        highlightedObject.rotation.y += 0.01;
    }
    // ICOS ROTATION
    icos.forEach((ico, i) => {
        const rotationSpeed = 0.0001 * (i + 1);
        ico.rotation.x += rotationSpeed;
        ico.rotation.y += rotationSpeed;
        ico.rotation.z += rotationSpeed;

        if (ico.position.z > -9.9){
            const icoMoveScale = 0.05;
            ico.position.z -= (icoMoveScale * (ico.position.z + 10))
        }
    });

    // RAYCASTER

    document.addEventListener('click', function(event) {
        raycaster.setFromCamera(pointer, camera);
        let intersects = raycaster.intersectObjects(scene.children);

        if (intersects.length > 0) {
            const firstIntersected = intersects[0].object;

            if (firstIntersected.geometry instanceof THREE.OctahedronGeometry) {
                if (highlightedObject) {
                    highlightedObject.material.color.set(highlightedObject.userData.originalColor);
                }

                if (!firstIntersected.userData.originalColor) {
                    firstIntersected.userData.originalColor = firstIntersected.material.color.clone();
                }

                firstIntersected.material.color.set(0xFF00FF);
                firstIntersected.rotation.y += 0.01;

                highlightedObject = firstIntersected;
            }
        } else {
            if (highlightedObject) {
                highlightedObject.material.color.set(highlightedObject.userData.originalColor);
                highlightedObject = null;
            }
        }
    });

    renderer.render(scene, camera);
}

window.addEventListener( 'pointermove', onPointerMove );

render();