import { OptionOptions, Option } from './types'

export const createOption = <TValue>(options: OptionOptions<TValue>): Option => {
  const element = document.createElement('div')
  element.classList.add('com-select__option')
  element.setAttribute('uuid', options.data.uuid)
  element.title = options.data.displayName

  element.textContent = options.data.displayName

  return {
    rendered: { element },
    select: () => {
      element.classList.add('selected')
    },
    unSelect: () => {
      element.classList.remove('selected')
    },
  }
}
