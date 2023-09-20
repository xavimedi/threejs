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

//MATERIALS
const colors = [
    0x0088FF, 0x4066EE, 0x8044DD, 0xC022CC, 0xFF00BB,
    0xFF795E, 0xFFCA1F, 0xFFF200, 0x00D12D, 0x0D98BA
];

const icos = [];
for (let i = 0; i < colors.length; i++) {
    const color = new THREE.MeshLambertMaterial({ color: colors[i] });
    const ico = new THREE.Mesh(icosahedron, color);
    const rotation = 0.03;
    ico.rotation.set(rotation * i, rotation * i, rotation * i);
    scene.add(ico);
    icos.push(ico);
}

const render = function () {
    requestAnimationFrame(render);
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

    renderer.render(scene, camera);
}

window.addEventListener( 'pointermove', onPointerMove );

render();