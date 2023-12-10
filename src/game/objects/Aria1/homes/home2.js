import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OctreeHelper } from 'three/addons/helpers/OctreeHelper.js'

export const home2 = (scene, worldOctree) => {
  const modelLoader = new GLTFLoader().setPath('/models/')
  modelLoader.load('Area1/home2.glb', (model) => {
    model.scene.position.set(20, 0, -30)
    scene.add(model.scene)
    worldOctree.fromGraphNode(model.scene)
    model.scene.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
    const helper = new OctreeHelper(worldOctree)
    helper.visible = false
    scene.add(helper)
  })
}
