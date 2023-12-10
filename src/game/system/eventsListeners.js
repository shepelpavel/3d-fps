export const onWindowResize = (camera, renderer) => {
  window.addEventListener('resize', () => {
    windowResize(camera, renderer)
  })
  const windowResize = (camera, renderer) => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
}
