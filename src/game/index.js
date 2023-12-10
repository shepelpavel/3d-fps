import * as THREE from 'three'
import { Octree } from 'three/addons/math/Octree.js'
import { Capsule } from 'three/addons/math/Capsule.js'

import { textureLoader } from './loader/textureLoader'
import {
  directionalLightFn,
  fillLightFn,
  ground,
  home1,
  home2,
  home3,
} from './objects'
import { controls } from './controls/controls'
import { onWindowResize } from './system'

export const Game = () => {
  const clock = new THREE.Clock()
  const scene = new THREE.Scene()

  textureLoader('/textures/Area1/bck.jpg', (texture) => {
    scene.background = texture
  })
  fillLightFn(scene)
  directionalLightFn(scene)

  scene.fog = new THREE.Fog(0x000000, 0, 50)
  const camera = new THREE.PerspectiveCamera(
    70,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  )
  camera.rotation.order = 'YXZ'

  const container = document.getElementById('container')
  const renderer = new THREE.WebGLRenderer({ antialias: true })
  renderer.setPixelRatio(window.devicePixelRatio)
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.VSMShadowMap
  renderer.toneMapping = THREE.ACESFilmicToneMapping
  container.appendChild(renderer.domElement)
  const GRAVITY = 30
  const NUM_SPHERES = 100
  const SPHERE_RADIUS = 0.2
  const STEPS_PER_FRAME = 5
  const sphereGeometry = new THREE.IcosahedronGeometry(SPHERE_RADIUS, 5)
  const sphereMaterial = new THREE.MeshLambertMaterial({ color: 0xdede8d })
  const spheres = []
  let sphereIdx = 0
  for (let i = 0; i < NUM_SPHERES; i++) {
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial)
    sphere.castShadow = true
    sphere.receiveShadow = true
    scene.add(sphere)
    spheres.push({
      mesh: sphere,
      collider: new THREE.Sphere(new THREE.Vector3(0, -100, 0), SPHERE_RADIUS),
      velocity: new THREE.Vector3(),
    })
  }
  const worldOctree = new Octree()
  const playerCollider = new Capsule(
    new THREE.Vector3(0, 0.35, 0),
    new THREE.Vector3(0, 1, 0),
    0.35,
  )
  const playerVelocity = new THREE.Vector3()
  const playerDirection = new THREE.Vector3()
  let playerOnFloor = false
  let mouseTime = 0
  const keyStates = {}
  const vector1 = new THREE.Vector3()
  const vector2 = new THREE.Vector3()
  const vector3 = new THREE.Vector3()
  document.addEventListener('keydown', (event) => {
    keyStates[event.code] = true
  })
  document.addEventListener('keyup', (event) => {
    keyStates[event.code] = false
  })
  container.addEventListener('mousedown', () => {
    document.body.requestPointerLock()
    mouseTime = performance.now()
  })
  document.addEventListener('mouseup', () => {
    if (document.pointerLockElement !== null) throwBall()
  })
  document.body.addEventListener('mousemove', (event) => {
    if (document.pointerLockElement === document.body) {
      camera.rotation.y -= event.movementX / 500
      camera.rotation.x -= event.movementY / 500
    }
  })
  onWindowResize(camera, renderer)

  function throwBall() {
    const sphere = spheres[sphereIdx]
    camera.getWorldDirection(playerDirection)
    sphere.collider.center
      .copy(playerCollider.end)
      .addScaledVector(playerDirection, playerCollider.radius * 1.5)

    const impulse =
      15 + 30 * (1 - Math.exp((mouseTime - performance.now()) * 0.001))
    sphere.velocity.copy(playerDirection).multiplyScalar(impulse)
    sphere.velocity.addScaledVector(playerVelocity, 2)
    sphereIdx = (sphereIdx + 1) % spheres.length
  }
  function playerCollisions() {
    const result = worldOctree.capsuleIntersect(playerCollider)
    playerOnFloor = false
    if (result) {
      playerOnFloor = result.normal.y > 0
      if (!playerOnFloor) {
        playerVelocity.addScaledVector(
          result.normal,
          -result.normal.dot(playerVelocity),
        )
      }
      playerCollider.translate(result.normal.multiplyScalar(result.depth))
    }
  }
  function updatePlayer(deltaTime) {
    let damping = Math.exp(-4 * deltaTime) - 1
    if (!playerOnFloor) {
      playerVelocity.y -= GRAVITY * deltaTime

      damping *= 0.1
    }
    playerVelocity.addScaledVector(playerVelocity, damping)
    const deltaPosition = playerVelocity.clone().multiplyScalar(deltaTime)
    playerCollider.translate(deltaPosition)
    playerCollisions()
    camera.position.copy(playerCollider.end)
  }
  function playerSphereCollision(sphere) {
    const center = vector1
      .addVectors(playerCollider.start, playerCollider.end)
      .multiplyScalar(0.5)
    const sphere_center = sphere.collider.center
    const r = playerCollider.radius + sphere.collider.radius
    const r2 = r * r

    for (const point of [playerCollider.start, playerCollider.end, center]) {
      const d2 = point.distanceToSquared(sphere_center)
      if (d2 < r2) {
        const normal = vector1.subVectors(point, sphere_center).normalize()
        const v1 = vector2
          .copy(normal)
          .multiplyScalar(normal.dot(playerVelocity))
        const v2 = vector3
          .copy(normal)
          .multiplyScalar(normal.dot(sphere.velocity))
        playerVelocity.add(v2).sub(v1)
        sphere.velocity.add(v1).sub(v2)
        const d = (r - Math.sqrt(d2)) / 2
        sphere_center.addScaledVector(normal, -d)
      }
    }
  }
  function spheresCollisions() {
    for (let i = 0, length = spheres.length; i < length; i++) {
      const s1 = spheres[i]
      for (let j = i + 1; j < length; j++) {
        const s2 = spheres[j]
        const d2 = s1.collider.center.distanceToSquared(s2.collider.center)
        const r = s1.collider.radius + s2.collider.radius
        const r2 = r * r
        if (d2 < r2) {
          const normal = vector1
            .subVectors(s1.collider.center, s2.collider.center)
            .normalize()
          const v1 = vector2
            .copy(normal)
            .multiplyScalar(normal.dot(s1.velocity))
          const v2 = vector3
            .copy(normal)
            .multiplyScalar(normal.dot(s2.velocity))
          s1.velocity.add(v2).sub(v1)
          s2.velocity.add(v1).sub(v2)
          const d = (r - Math.sqrt(d2)) / 2
          s1.collider.center.addScaledVector(normal, d)
          s2.collider.center.addScaledVector(normal, -d)
        }
      }
    }
  }
  function updateSpheres(deltaTime) {
    spheres.forEach((sphere) => {
      sphere.collider.center.addScaledVector(sphere.velocity, deltaTime)
      const result = worldOctree.sphereIntersect(sphere.collider)
      if (result) {
        sphere.velocity.addScaledVector(
          result.normal,
          -result.normal.dot(sphere.velocity) * 1.5,
        )
        sphere.collider.center.add(result.normal.multiplyScalar(result.depth))
      } else {
        sphere.velocity.y -= GRAVITY * deltaTime
      }
      const damping = Math.exp(-1.5 * deltaTime) - 1
      sphere.velocity.addScaledVector(sphere.velocity, damping)
      playerSphereCollision(sphere)
    })
    spheresCollisions()
    for (const sphere of spheres) {
      sphere.mesh.position.copy(sphere.collider.center)
    }
  }
  function getForwardVector() {
    camera.getWorldDirection(playerDirection)
    playerDirection.y = 0
    playerDirection.normalize()
    return playerDirection
  }
  function getSideVector() {
    camera.getWorldDirection(playerDirection)
    playerDirection.y = 0
    playerDirection.normalize()
    playerDirection.cross(camera.up)
    return playerDirection
  }
  function teleportPlayerIfOob() {
    if (camera.position.y <= -50) {
      playerCollider.start.set(0, 0.35, 0)
      playerCollider.end.set(0, 1, 0)
      playerCollider.radius = 0.35
      camera.position.copy(playerCollider.end)
      camera.rotation.set(0, 0, 0)
    }
  }

  function animate() {
    const deltaTime = Math.min(0.05, clock.getDelta()) / STEPS_PER_FRAME
    for (let i = 0; i < STEPS_PER_FRAME; i++) {
      controls(
        deltaTime,
        keyStates,
        playerVelocity,
        playerOnFloor,
        getForwardVector,
        getSideVector,
      )
      updatePlayer(deltaTime)
      updateSpheres(deltaTime)
      teleportPlayerIfOob()
    }
    renderer.render(scene, camera)
    requestAnimationFrame(animate)
  }
  ground(scene, worldOctree)
  home1(scene, worldOctree)
  home2(scene, worldOctree)
  home3(scene, worldOctree)

  animate()
}
