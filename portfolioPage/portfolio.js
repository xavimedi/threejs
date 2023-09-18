"use strict";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(25, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 10;

var renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setClearColor("#000000");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var light = new THREE.DirectionalLight(0xFFFFFF, 1);
light.position.set(-1, 2, 1);
scene.add(light);

window.addEventListener("resize", () => {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
});

let icosahedron = new THREE.IcosahedronGeometry(1, 0);

const colors = [
    0x0088FF, 0x4066EE, 0x8044DD, 0xC022CC, 0xFF00BB,
    0xFF795E, 0xFFCA1F, 0xFFF200, 0x00D12D, 0x0D98BA
];

const isos = [];

for (let i = 0; i < colors.length; i++) {
    const color = new THREE.MeshLambertMaterial({ color: colors[i] });
    const iso = new THREE.Mesh(icosahedron, color);
    const rotation = 0.03;
    iso.rotation.set(rotation * i, rotation * i, rotation * i);
    scene.add(iso);
    isos.push(iso);
}

var render = function () {
    requestAnimationFrame(render);
    isos.forEach((iso, i) => {
        const rotationSpeed = 0.0002 * (i + 1);

        iso.rotation.x += rotationSpeed;
        iso.rotation.y += rotationSpeed;
        iso.rotation.z += rotationSpeed;

        if (camera.position.z > 2){
            const zoomSpeed = 0.001;
            camera.position.z -= (zoomSpeed * (camera.position.z - 1.9))
        }
    });
    renderer.render(scene, camera);
}

render();