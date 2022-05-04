import { Rect } from "../types"

export const setRect = (element: HTMLElement, rect: Rect) => {
  element.style.left = `${rect.x}px`
  element.style.top = `${rect.y}px`
  element.style.height = `${rect.height}px`
  element.style.width = `${rect.width}px`
}
