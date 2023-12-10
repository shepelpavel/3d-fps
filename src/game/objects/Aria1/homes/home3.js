import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js'

export const home3 = (scene, worldOctree) => {
  const modelLoader = new GLTFLoader().setPath('./models/')
  const texture = new THREE.TextureLoader().load('./textures/Area1/home1.jpg')
  // texture.colorSpace = THREE.SRGBColorSpace
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.offset.set(0, 0)
  texture.repeat.set(10, 10)
  const normalTexture = new THREE.TextureLoader().load(
    './textures/Area1/home1_normal.jpg',
  )
  normalTexture.wrapS = THREE.RepeatWrapping
  normalTexture.wrapT = THREE.RepeatWrapping
  normalTexture.offset.set(0, 0)
  normalTexture.repeat.set(10, 10)
  modelLoader.load('Area1/home1.glb', (model) => {
    model.scene.position.set(-20, 0, -20)
    scene.add(model.scene)
    worldOctree.fromGraphNode(model.scene)
    model.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
        child.material.map = texture
        child.material.normalMap = normalTexture
        child.material.normalScale.set(2, 2)
      }
    })
    let helper = new OctreeHelper(worldOctree)
    helper.visible = false
    scene.add(helper)
  })
}
