import { createOption } from './option'
import { Option, OptionData, OptionList, OptionListOptions } from './types'

const createOptions = (
  element: HTMLElement,
  optionDataList: OptionData[],
): { [optionUuid: string]: Option } => {
  const optionsDict: { [optionUuid: string]: Option } = {}

  optionDataList.forEach(optionData => {
    const option = createOption({
      data: optionData,
    })
    optionsDict[optionData.uuid] = option
    element.appendChild(option.rendered.element)
  })

  return optionsDict
}

export const createOptionList = (options: OptionListOptions): OptionList => {
  let selectedOptionUuid: string

  const element = document.createElement('div')
  element.classList.add('com-select__option-list')

  let optionsDict = createOptions(element, options.optionDataList)

  const optionList: OptionList = {
    rendered: { element },
    show: () => {
      document.body.appendChild(optionList.rendered.element)
    },
    hide: () => {
      optionList.rendered.element.remove()
    },
    setSelectedOption: optionUuid => {
      if (optionUuid === selectedOptionUuid)
        return

      optionsDict[selectedOptionUuid]?.unSelect()
      optionsDict[optionUuid]?.select()
    },
    updateOptionDataList: newOptionDataList => {
      Object.values(optionsDict).forEach(o => o.rendered.element.remove())
      optionsDict = createOptions(element, newOptionDataList)
    },
  }
  return optionList
}
