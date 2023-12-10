export const controls = (
  deltaTime,
  keyStates,
  playerVelocity,
  playerOnFloor,
  getForwardVector,
  getSideVector,
) => {
  const speedDelta = deltaTime * (playerOnFloor ? 25 : 8)
  if (keyStates['KeyW']) {
    playerVelocity.add(getForwardVector().multiplyScalar(speedDelta))
  }
  if (keyStates['KeyS']) {
    playerVelocity.add(getForwardVector().multiplyScalar(-speedDelta))
  }
  if (keyStates['KeyA']) {
    playerVelocity.add(getSideVector().multiplyScalar(-speedDelta))
  }
  if (keyStates['KeyD']) {
    playerVelocity.add(getSideVector().multiplyScalar(speedDelta))
  }
  if (playerOnFloor) {
    if (keyStates['Space']) {
      playerVelocity.y = 8
    }
  }
}
