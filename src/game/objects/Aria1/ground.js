import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js'

export const ground = (scene, worldOctree) => {
  const modelLoader = new GLTFLoader().setPath('/models/')
  const textureLoader = new THREE.TextureLoader()
  textureLoader.load('/textures/Area1/ground.png', function (texture) {
    texture.colorSpace = THREE.SRGBColorSpace
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping
    texture.offset.set(0, 0)
    texture.repeat.set(50, 50)
    modelLoader.load('Area1/ground.glb', (gltf) => {
      scene.add(gltf.scene)
      worldOctree.fromGraphNode(gltf.scene)
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.castShadow = true
          child.receiveShadow = true
          child.material.map = texture
        }
      })
      const helper = new OctreeHelper(worldOctree)
      helper.visible = false
      scene.add(helper)
    })
  })
}
