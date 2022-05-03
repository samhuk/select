
/* This is the entrypoint ts file for the component. The component should return an object
 * that extends { element: HTMLElement }.
 */

/**
 * Options for the creation of MyComponent
 */
export type MyComponentOptions = {
  initialText: string
}

export type MyComponent = {
  /**
   * The root element of the component
   */
  element: HTMLElement
  /**
   * Updates the text that is shown within the component
   */
  updateText: (newText: string) => string
}

export const createMyComponent = (options: MyComponentOptions): MyComponent => {
  const element = document.createElement('div')
  element.classList.add('com-my-component')

  element.textContent = options.initialText

  return {
    element,
    updateText: newText => element.textContent = newText,
  }
}
