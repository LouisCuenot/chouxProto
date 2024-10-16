import './style.css'
import * as THREE from 'three'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Axis from 'axis-api'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Cube
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
//scene.add(cube)


//AXIS SETUP

Axis.registerKeys("a", "a", 1);
Axis.registerKeys("z", "x", 1);
Axis.registerKeys("e", "i", 1);
Axis.registerKeys("r", "s", 1);

const aButton = Axis.buttonManager.getButton('a', 1);
const xButton = Axis.buttonManager.getButton('x', 1);
const iButton = Axis.buttonManager.getButton('i', 1);
const sButton = Axis.buttonManager.getButton('s', 1);

const fontLoader = new FontLoader()

let aLetter
let xLetter
let iLetter
let sLetter
let joystickLetter

fontLoader.load('/PassionOne_Bold.json', (font) => {
    const aGeom = new TextGeometry('A', {
        font,
        size: 1,
        depth: 0.1,
        curveSegments: 5,
    })
    aGeom.center()

    const xGeom = new TextGeometry('X', {
        font,
        size: 1,
        depth: 0.1,
        curveSegments: 5,
    })
    xGeom.center()

    const iGeom = new TextGeometry('I', {
        font,
        size: 1,
        depth: 0.1,
        curveSegments: 5,
    })
    iGeom.center()

    const sGeom = new TextGeometry('S', {
        font,
        size: 1,
        depth: 0.1,
        curveSegments: 5,
    })
    sGeom.center()

    const jGeom = new TextGeometry('O', {
        font,
        size: 1,
        depth: 0.1,
        curveSegments: 5,
    })
    jGeom.center()

    const letterMaterial = new THREE.MeshBasicMaterial({ color: 0xFFD700, wireframe: true })

    aLetter = new THREE.Mesh(aGeom, letterMaterial)
    xLetter = new THREE.Mesh(xGeom, letterMaterial)
    iLetter = new THREE.Mesh(iGeom, letterMaterial)
    sLetter = new THREE.Mesh(sGeom, letterMaterial)
    joystickLetter = new THREE.Mesh(jGeom, letterMaterial)

    aLetter.visible = false
    xLetter.visible = false
    iLetter.visible = false
    sLetter.visible = false

    scene.add(aLetter)
    scene.add(xLetter)
    scene.add(iLetter)
    scene.add(sLetter)
    scene.add(joystickLetter)
})

const handleKeyDown = (e) => {
    if(!aLetter || !xLetter || !iLetter || !sLetter) return

    aLetter.visible = false
    xLetter.visible = false
    iLetter.visible = false
    sLetter.visible = false

    if(e.key === 'a'){
        aLetter.visible = true
    }else if(e.key === 'x'){
        xLetter.visible = true
    }else if(e.key === 'i'){
        iLetter.visible = true
    }else if(e.key === 's'){
        sLetter.visible = true
    }
}

const handleKeyUp = () => {
    if(!aLetter || !xLetter || !iLetter || !sLetter) return

    aLetter.visible = false
    xLetter.visible = false
    iLetter.visible = false
    sLetter.visible = false
}

aButton.addEventListener('keydown',handleKeyDown)
xButton.addEventListener('keydown',handleKeyDown)
iButton.addEventListener('keydown',handleKeyDown)
sButton.addEventListener('keydown',handleKeyDown)

aButton.addEventListener('keyup',handleKeyUp)
xButton.addEventListener('keyup',handleKeyUp)
iButton.addEventListener('keyup',handleKeyUp)
sButton.addEventListener('keyup',handleKeyUp)

let oldAngle
let isRotating

const getAngle = (e) => {
    let newAngle = Math.atan2(e.position.y,e.position.x)
    if(newAngle < 0){
        newAngle += Math.PI * 2
    }
    return newAngle
}

const checkIfRotating = (e) => {

    const sossur = document.getElementById('sossur')
    

    const vector = new THREE.Vector2(e.position.x,e.position.y)
    const vectorLength = vector.distanceTo(new THREE.Vector2(0,0))

    if(vectorLength < 0.6){
        sossur.innerText = `PLUS FORT GAMIN`
        return
    }

    const angle = getAngle(e)

    if(angle > oldAngle){
        sossur.innerText = `CONTINUE GAMIN ${angle}`
    }else{
        sossur.innerText = `MAUVAIS SENS GAMIN ${angle}`
    }


    oldAngle = angle
}


const joystick1MoveHandler = (e) => {
    if(!joystickLetter) return
    const sossur = document.getElementById('sossur')
    sossur.innerText = `${e.position.x}X ${e.position.y}Y`

    joystickLetter.position.x = Math.max(-3,Math.min(3, joystickLetter.position.x + e.position.x * 0.1))
    joystickLetter.position.y = Math.max(-2,Math.min(2, joystickLetter.position.y + e.position.y * 0.1))
}

Axis.joystick1.addEventListener("joystick:move", checkIfRotating);

// Leaderboard

//const leaderboard = Axis.createLeaderboard({
//    id: "choux-game",
//});
//console.log(leaderboard)
//
//const newScore = await leaderboard.getScores().then(response=>{
//    return response.length
//})
//
//
//
//leaderboard
//    .postScore({
//        username: "Loulou",
//        value: newScore,
//    })
    

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()
let lastElapsedTime = 0

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    const deltaTime = elapsedTime - lastElapsedTime
    lastElapsedTime = elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()