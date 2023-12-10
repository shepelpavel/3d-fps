import * as THREE from 'three'

export const textureLoader = (path, callback) => {
  const loader = new THREE.TextureLoader()
  loader.load(path, function (texture) {
    texture.mapping = THREE.EquirectangularReflectionMapping
    texture.colorSpace = THREE.SRGBColorSpace
    callback(texture)
  })
}
