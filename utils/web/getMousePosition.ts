export const getMousePosition = (target:HTMLElement,e:MouseEvent) => {
  const rect = target.getBoundingClientRect()
  const theta = Math.atan2(rect.height,rect.width)
  const x = e.offsetX - rect.width / 2
  const y = rect.height / 2 - e.offsetY
  const angle = Math.atan2(y,x)
  if (angle < theta && angle >=-theta){
    return 'right'
  }else if (angle < -theta && angle >= -Math.PI + theta){
    return 'bottom'
  }else if (angle < Math.PI - theta && angle >= theta){
    return 'top'
  }else {
    return 'left'
  }
}