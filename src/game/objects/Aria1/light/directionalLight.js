import * as THREE from 'three'

export const directionalLightFn = (scene) => {
  const directionalLight = new THREE.DirectionalLight(0xffe8db, 3)
  directionalLight.position.set(-25, 25, 10)
  directionalLight.castShadow = true
  directionalLight.shadow.camera.near = 0.01
  directionalLight.shadow.camera.far = 500
  directionalLight.shadow.camera.right = 30
  directionalLight.shadow.camera.left = -30
  directionalLight.shadow.camera.top = 30
  directionalLight.shadow.camera.bottom = -30
  directionalLight.shadow.mapSize.width = 1024
  directionalLight.shadow.mapSize.height = 1024
  directionalLight.shadow.radius = 4
  directionalLight.shadow.bias = 0
  scene.add(directionalLight)
}
