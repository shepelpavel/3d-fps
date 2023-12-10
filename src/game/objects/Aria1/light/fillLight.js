import * as THREE from 'three'

export const fillLightFn = (scene) => {
  const fillLight = new THREE.HemisphereLight(0x8dc1de, 0x00668d, 1.5)
  fillLight.position.set(2, 1, 1)
  scene.add(fillLight)
}
