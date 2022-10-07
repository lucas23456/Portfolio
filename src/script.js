import './styles/style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap'
import {ScrollTrigger} from 'gsap/ScrollTrigger'

//Texture Loader
const TextureLoader = new THREE.TextureLoader()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const light = new THREE.AmbientLight( 0x404040 )
scene.add( light );

// TextureLoader
// const loader = new THREE.TextureLoader()
// const cross = loader.load('../style.css')

// Objects
const geometry = new THREE.TorusGeometry( .7, .2, 16, 100 );

const particlesGeometry = new THREE.BufferGeometry;
const particlesCnt = 8000;

const posArray = new Float32Array(particlesCnt * 3);

for(let i = 0; i < particlesCnt * 3; i++){
    // posArray[i] = Math.random()
    // posArray[i] = Math.random() - 0.5
    posArray[i] = (Math.random() - 0.5) * 20
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

// Materials

const material = new THREE.PointsMaterial({
    size: 0.005
})

const particlesMaterial = new THREE.PointsMaterial({
    size: 0.02,
    // map: cross,
    // transparent: true
    blending: THREE.AdditiveBlending
})

// Mesh
const sphere = new THREE.Points(geometry,material)
const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(sphere, particlesMesh)

/******************************************************* Egyptian King ****************************************************************/ 

const loader = new GLTFLoader();

loader.load( 'https://cdn.glitch.global/827c2528-a6de-4dd0-9636-5c5382cd894a/king.glb?v=1658069969168', function ( gltf ) {

	scene.add(gltf.scene);  

    gltf.scene.rotation.y = -3.9;

    gltf.scene.position.y = -19;
    gltf.scene.position.z = -3;
    gltf.scene.position.x = -2;

    // Animate model..

    gsap.from(gltf.scene.rotation, {
      x: 0.5,
      scrollTrigger: {
        trigger: sections[2],
      },
    })

    gsap.to(gltf.scene.position,{
        y:-0.7,
        scrollTrigger: {
          trigger: sections[2],
        },
    });
    

}, undefined, function ( error ) {

	console.error( error );

} );



// ******************************************************************Lights*****************************************************************

const pointLight = new THREE.PointLight(0xffffff, 0.1)
pointLight.position.x = 2
pointLight.position.y = 3
pointLight.position.z = 4
scene.add(pointLight)

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 2
scene.add(camera)

// Controls
 //const controls = new OrbitControls(camera, canvas)
 //controls.enableDamping = true

//*******************************************************Animate camera*************************************************************/

const sections = document.querySelectorAll('.section')

gsap.registerPlugin(ScrollTrigger)
ScrollTrigger.defaults({
  scrub: 3,
  ease: 'none',
})

gsap.from('h1', {
  yPercent: 100,
  autoAlpha: 0,
  ease: 'back',
  delay: 0.3,
})

gsap.to(camera.rotation, {
    x: 0,
    duration: 0.1,
    scrollTrigger: {
      trigger: sections[1],
    },
  })

gsap.to(camera.position,{
    z:2,
    y:-4.5,
    duration: 0.1,
    scrollTrigger: {
      trigger: sections[2],
    },
  }) 

gsap.to(camera.position,{
    z:2,
    y:-8,
    duration: 0.1,
    scrollTrigger: {
      trigger: sections[4],
    },
  }) 

//********************************************************************OH SHIT NIGGA ***************************************************/

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
renderer.setClearColor(new THREE.Color('#21282a'), 1)

//Mouse 

document.addEventListener('mousemove', animateParticles)

let mouseX = 0
let mouseY = 0

function animateParticles(event){
    mouseY = event.clientY
    mouseX = event.clientX 
}

/**
 * Animate
 */

const clock = new THREE.Clock()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = .5 * elapsedTime
    particlesMesh.rotation.y = -.1 * elapsedTime
    
    if (mouseX > 0){
        particlesMesh.rotation.y = -mouseX * (elapsedTime * 0.00008) 
        particlesMesh.rotation.x = -mouseY * (elapsedTime * 0.00008) 
    }

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick();

