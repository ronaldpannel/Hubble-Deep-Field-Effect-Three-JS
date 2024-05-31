import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { GLTFLoader } from "three/addons/loaders/GLTFLoader.js";

let numOfStars = 5000;
let star;
let geoArray = [];
let starGeo;

//create renderer
let renderer = new THREE.WebGLRenderer({ antialize: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

//append render to body
document.body.appendChild(renderer.domElement);

//create scene
var scene = new THREE.Scene();

//create camera
var camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 0, 1);
camera.rotation.x = Math.PI / 2;
// camera.lookAt(0,0,0)

//create controls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true;
// controls.enablePan = false;
// controls.ninDistance = 5;
// controls.maxDistance = 20;
// controls.maxPolarAngle = 0.5;
// controls.maxPolarAngle = 2;
// controls.autoRotate = false;
// controls.target = new THREE.Vector3(0, 1, 0);
// controls.update();

//create lights
// const spotLight = new THREE.SpotLight("0xffffff", 8, 100, 2.2, 0.5);
// spotLight.position.set(0, 2, 5);
// spotLight.castShadow = true;
// scene.add(spotLight);
// // const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// // scene.add(spotLightHelper);
// const ambientLight = new THREE.AmbientLight("white", 0.4);
// scene.add(ambientLight);

for (let i = 0; i < numOfStars; i++) {
  star = new THREE.Vector3(
    Math.random() * 600 - 300,
    Math.random() * 600 - 300,
    Math.random() * 600 - 300
  );
  star.velocity = 0;
  star.acceleration = 0.001;
  geoArray.push(star);
}
starGeo = new THREE.BufferGeometry().setFromPoints(geoArray);

let sprite = new THREE.TextureLoader().load("circle.png");
let starMat = new THREE.PointsMaterial({
  color: "silver",
  size: 1.1,
  map: sprite,
});
let stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

function animate() {
  const positions = starGeo.attributes.position.array;

  for (let i = 0; i < geoArray.length; i++) {
    geoArray[i].velocity += geoArray[i].acceleration;
    positions[i * 3 + 1] -= geoArray[i].velocity;
    if (positions[i * 3 + 1] < -200) {
      positions[i * 3 + 1] = 200;
      geoArray[i].velocity = 0;
    }
  }
  starGeo.attributes.position.needsUpdate = true;
  stars.rotation.y += 0.002;
  renderer.render(scene, camera);
  // controls.update();
  requestAnimationFrame(animate);
}
animate();

// rescale on window resize
window.addEventListener("resize", function () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});
