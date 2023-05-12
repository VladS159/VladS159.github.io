import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js';

let root, root2, isIndependentMove, originalPosition, originalRotation, root3, root4, car, car2;

const canvas = document.querySelector('.webgl')
const scene = new THREE.Scene()

const bgTexture = new THREE.TextureLoader().load('./cer.jpg');
bgTexture.wrapS = THREE.RepeatWrapping;
bgTexture.wrapT = THREE.RepeatWrapping;
bgTexture.repeat.set(1, 1);

const bgGeometry = new THREE.BoxGeometry(100, 100, 100);
const bgMaterial = new THREE.MeshBasicMaterial({
  map: bgTexture,
  side: THREE.BackSide
});
const bgCube = new THREE.Mesh(bgGeometry, bgMaterial);
scene.add(bgCube);

const groundGeometry = new THREE.PlaneGeometry(7, 150, 32, 32);

const textureLoader = new THREE.TextureLoader();
const groundTexture = textureLoader.load('./lines.jpg');

const groundMaterial = new THREE.MeshStandardMaterial({
  map: groundTexture,
  roughness: 1,
  metalness: 0
});

const groundMesh = new THREE.Mesh(groundGeometry, groundMaterial);

groundMesh.rotation.x = -Math.PI / 2;

const groundMesh2 = groundMesh.clone()

groundMesh2.position.set(31.35, -10, -10);

groundMesh.position.set(-31.35, -10, -10);
scene.add(groundMesh);
scene.add(groundMesh2);

const groundMesh3 = groundMesh.clone();
groundMesh3.rotation.z = Math.PI / 2;
groundMesh3.position.set(-10, -10.1, -31.35);
scene.add(groundMesh3);

const groundMesh4 = groundMesh3.clone();
groundMesh4.position.set(-10, -10.1, 31.35);
scene.add(groundMesh4);

const loader = new GLTFLoader()
loader.load('./paper_plane.glb', function(glb){
    console.log(glb)
    root = glb.scene;

    const box = new THREE.Box3().setFromObject(root);
    const center = box.getCenter(new THREE.Vector3());
    root.position.sub(center);
    root.position.y += 10;
    root.rotation.set(0, Math.PI, 0);

    root.scale.set(0.5,0.5,0.5)

    scene.add(root);
}, function(xhr){
    console.log((xhr.loaded/xhr.total * 100) + "% loaded")
}, function(error) {
console.log('An error occurred')
})

loader.load('./city.glb', function(glb){
  console.log(glb)
  root2 = glb.scene;

  const box = new THREE.Box3().setFromObject(root2);
  const center = box.getCenter(new THREE.Vector3());
  root2.position.sub(center);

  root2.scale.set(1.5,1.5,1.5)

  scene.add(root2);
}, function(xhr){
  console.log((xhr.loaded/xhr.total * 100) + "% loaded")
}, function(error) {
console.log('An error occurred')
})

loader.load('./car.glb', function(glb){
  console.log(glb)
  car = glb.scene;

  car.position.set(31.45, -9, 0);

  car.scale.set(0.75,0.75,0.75)

  scene.add(car);
}, function(xhr){
  console.log((xhr.loaded/xhr.total * 100) + "% loaded")
}, function(error) {
console.log('An error occurred')
})

loader.load('./car2.glb', function(glb){
  console.log(glb)
  car2 = glb.scene;

  car2.position.set(-31.45, -10.85, 0);

  car2.scale.set(2,2,2)

  scene.add(car2);
}, function(xhr){
  console.log((xhr.loaded/xhr.total * 100) + "% loaded")
}, function(error) {
console.log('An error occurred')
})

loader.load('./cloud.glb', function(glb){
  console.log(glb)
  root3 = glb.scene;

  root3.position.set(17, 17, 17)

  root3.scale.set(2,1,1)

  root3.rotation.y = Math.PI / 2;
  root3.position.z = -65;

  root4 = root3.clone()
  root4.position.set(-15, 13, -20)
  
  scene.add(root3);
  scene.add(root4);
}, function(xhr){
  console.log((xhr.loaded/xhr.total * 100) + "% loaded")
}, function(error) {
console.log('An error occurred')
})

const pointLight1 = new THREE.PointLight(0xffffff, 1, 0);
const pointLight3 = new THREE.PointLight(0xffffff, 1, 0);

pointLight1.position.set(-50, 50, -50);
pointLight3.position.set(50, 50, 50);
scene.add(pointLight1);
scene.add(pointLight3);

const sizes = {
    width: window.innerWidth, 
    height: window.innerHeight
}
const camera = new THREE.PerspectiveCamera(75, sizes.width/sizes.height, 0.1, 150)
camera.position.set(0, 10, 7);
camera.rotation.set(-Math.PI/4, 0, 0);
camera.position.y += 10;
scene.add(camera)

const renderer = new THREE.WebGL1Renderer({
    canvas: canvas
})

const Input = {
  GetKey: function(keyCode) {
    return keyState[keyCode] || false;
  }
};

const keyState = {};

window.addEventListener('keydown', function(event) {
  keyState[event.code] = true;
  if (event.code === 'Space') {
    velocity.z = 0;
  }
});

window.addEventListener('keyup', function(event) {
  keyState[event.code] = false;
});

let isDragging = false;
let previousMousePosition = {
  x: 0,
  y: 0
};

window.addEventListener('mousedown', function(event) {
  isDragging = true;
});

window.addEventListener('mousemove', function(event) {
  if (isDragging) {
    let deltaX = event.clientX - previousMousePosition.x;
    let deltaY = event.clientY - previousMousePosition.y;
    
    if(isIndependentMove == false){
    root.rotation.y += deltaX * 0.01;
    root.rotation.x += deltaY * 0.01;}

    else
    {
      camera.rotation.y += deltaX * 0.01;
      camera.rotation.x += deltaY * 0.01;
    }
  }

  previousMousePosition = {
    x: event.clientX,
    y: event.clientY
  };
});

window.addEventListener('mouseup', function(event) {
  isDragging = false;
});

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.shadowMap.enabled = true
renderer.gammaOutput = true

let velocity = new THREE.Vector3();

window.addEventListener('keydown', function(event) {
  switch (event.key) {
    case 'w':
      if(isIndependentMove == false)velocity.z = -2;
      break;
  }
});

window.addEventListener('keyup', function(event) {
  switch (event.key) {
    case 'w':
      velocity.z = 0;
      break;
  }
});

const clock = new THREE.Clock();

function update() {
  const deltaTime = clock.getDelta();
  
  if (root) {
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(root.quaternion);
    const forward2 = new THREE.Vector3(0, 0, 1).applyQuaternion(root.quaternion);

    const xLimit = 45;
    const yLimit = 25;
    const zLimit = 45;

    if (Input.GetKey('Space')) {
      if(isIndependentMove == false)
      {
        originalPosition = camera.position.clone();
        originalRotation = camera.rotation.clone();

        camera.position.set(root.position.x, root.position.y + 2, root.position.z);
        camera.rotation.copy(root.rotation.clone());
        camera.rotation.y += Math.PI;
      }
      
      isIndependentMove = true;
    }
    else {
      if(isIndependentMove == true){
        camera.position.copy(originalPosition);
        camera.rotation.copy(originalRotation);
        }

      isIndependentMove = false;
    }
    root.position.addScaledVector(forward.multiplyScalar(velocity.z), deltaTime * 5);
    root.position.addScaledVector(new THREE.Vector3(1, 0, 0).multiplyScalar(velocity.x), deltaTime * 5);

    root.position.clamp(new THREE.Vector3(-xLimit, -8, -zLimit), new THREE.Vector3(xLimit, yLimit, zLimit));
    camera.position.clamp(new THREE.Vector3(-xLimit, 2, -zLimit+7), new THREE.Vector3(xLimit, yLimit+10, zLimit+7));

    camera.position.addScaledVector(forward2.multiplyScalar(-velocity.z), deltaTime * 5);
  }
}


function animate() {
    requestAnimationFrame(animate)
    
    update()

    if(car && car2)
    {
      if(car.rotation.y == 0)
      {
        car.position.z -= 0.1;
        if(car.position.z < -31)
        {
          console.log(car.rotation.y);
          car.rotation.y = Math.PI/2;
        }
      }

      if(car.rotation.y == Math.PI/2)
      {
        car.position.x -= 0.1;
        if(car.position.x < -31)
        {
          car.rotation.y = Math.PI;
        }
      }

      if(car.rotation.y == Math.PI)
      {
        car.position.z += 0.1;
        if(car.position.z > 31)
        {
          car.rotation.y = 3 * Math.PI / 2;
        }
      }

      if(car.rotation.y == 3 * Math.PI / 2)
      {
        car.position.x += 0.1;
        if(car.position.x > 31)
        {
          car.rotation.y = 0;
        }
      }

    if(car2.rotation.y == 0)
      {
        car2.position.z += 0.1;
        if(car2.position.z > 31)
        {
          car2.rotation.y = Math.PI / 2;
        }
      }

      if(car2.rotation.y == Math.PI / 2)
      {
        car2.position.x += 0.1;
        if(car2.position.x > 31)
        {
          car2.rotation.y = Math.PI;
        }
      }

    if(car2.rotation.y == Math.PI)
      {
        car2.position.z -= 0.1;
        if(car2.position.z < -31)
        {
          console.log(car.rotation.y);
          car2.rotation.y = 3 * Math.PI / 2;
        }
      }

      if(car2.rotation.y == 3 * Math.PI / 2)
      {
        car2.position.x -= 0.1;
        if(car2.position.x < -31)
        {
          car2.rotation.y = 0;
        }
      }
    }

    if(root3 && root4){
    root3.position.z += 0.05;
    if(root3.position.z > 65)
    {
      root3.position.z = -65;
    }

    root4.position.z += 0.05;
    if(root4.position.z > 65)
    {
      root4.position.z = -65;
    }
  }
    
    renderer.shadowMap.enabled = true;
    if(root && root2 && car && car2)renderer.render(scene, camera)
    }
    
    animate()
