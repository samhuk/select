import { VerticalDirection, Rect, Size } from "./types"

type DirectionInfo = { direction: VerticalDirection, availableHeight: number }

const getAvailableSpace = (parentRect: Rect, boundingRect: Rect): { [d in VerticalDirection]: number } => ({
  up: parentRect.y - boundingRect.y,
  down: boundingRect.y + boundingRect.height - parentRect.y - parentRect.height,
})

const availableSpaceToDirection = (
  rectSize: Size,
  availableSpace: { [d in VerticalDirection]: number },
) => (availableSpace.down >= rectSize.height
  ? VerticalDirection.DOWN
  : availableSpace.up >= rectSize.height
    ? VerticalDirection.UP
    : availableSpace.down >= availableSpace.up
      ? VerticalDirection.DOWN
      : VerticalDirection.UP)

const determineDirectionInfo = (rect: Size, parentRect: Rect, boundingRect: Rect): DirectionInfo => {
  const availableSpace = getAvailableSpace(parentRect, boundingRect)
  const direction = availableSpaceToDirection(rect, availableSpace)
  return { direction, availableHeight: availableSpace[direction] }
}

const _determineRect = (rectSize: Size, parentRect: Rect, boundingRect: Rect, directionInfo: DirectionInfo): Rect => {
  // Handle the common case specially for performance
  if (rectSize.width <= parentRect.width && rectSize.height <= directionInfo.availableHeight) {
    return directionInfo.direction === VerticalDirection.DOWN
      ? { x: parentRect.x, y: parentRect.y + parentRect.height, height: rectSize.height, width: parentRect.width }
      : { x: parentRect.x, y: parentRect.y, height: rectSize.height, width: parentRect.width }
  }

  const rightOverrun = Math.max(0, parentRect.x + rectSize.width - boundingRect.x - boundingRect.width)
  const x = Math.max(boundingRect.x, parentRect.x - rightOverrun)
  const width = Math.max(parentRect.width, Math.min(boundingRect.width, rectSize.width))
  const height = Math.min(directionInfo.availableHeight, rectSize.height)
  const y = directionInfo.direction === VerticalDirection.DOWN
    ? parentRect.y + parentRect.height
    : parentRect.y - height

  return { x, y, height, width }
}

export const determineRect = (
  rectSize: Size,
  parentRect: Rect,
  boundingRect?: Rect,
) => {
  const _boundingRect = boundingRect ?? { x: 0, y: 0, height: window.innerHeight, width: window.innerWidth }
  const directionInfo = determineDirectionInfo(rectSize, parentRect, _boundingRect)
  return _determineRect(rectSize, parentRect, _boundingRect, directionInfo)
}
