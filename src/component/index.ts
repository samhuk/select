import { createTextInput } from '@samhuk/text-input'
import { LabelPosition } from '@samhuk/text-input/dist/types'
import { setRect } from './helpers/elements'
import { createOptionList } from './optionList'
import { determineRect } from './placement'
import { OptionData, OptionList, Rect, Select, SelectOptions, UnavailableValueHandling } from './types'

const renderDisplayNameToInput = (inputElement: HTMLInputElement, displayName: string) => {
  const _displayName = displayName ?? ''

  inputElement.value = _displayName
  inputElement.title = _displayName
}

const findOptionDataByUuid = (optionDataList: OptionData[], uuid: string): OptionData => (
  optionDataList.find(od => od.uuid === uuid)
)

const findOptionDataByValue = <TValue>(optionDataList: OptionData[], value: TValue): OptionData => (
  optionDataList.find(od => od.value === value)
)

const searchOptionDataListByDisplayName = (optionDataList: OptionData[], searchString: string): OptionData[] => (
  searchString == null || searchString.length === 0
    ? optionDataList
    : optionDataList.filter(od => od.displayName.toLowerCase().indexOf(searchString.toLowerCase()) !== -1)
)

export const createSelect = <TValue>(options: SelectOptions<TValue>): Select<TValue> => {
  let select: Select<TValue>
  let optionList: OptionList
  let searchString: string
  let onAnywhereClick: (e: MouseEvent) => void
  let onWindowResize: () => void

  const element = document.createElement('div')
  element.classList.add('com-select')

  const openOnInputFocus = options.openOnInputFocus ?? true

  let label: HTMLElement
  if (options.label != null) {
    label = document.createElement('label')
    label.textContent = options.label
  }

  if (options.labelPosition === LabelPosition.LEFT)
    element.classList.add('left-label-position')

  const textInput = createTextInput({
    label: options.label,
    labelPosition: options.labelPosition,
    initialValue: '',
    showDirtinessIndicator: options.showDirtinessIndicator,
  })
  const expandButton = document.createElement('button')
  expandButton.type = 'button'
  expandButton.classList.add('button--white')
  const caretIcon = document.createElement('div')
  caretIcon.classList.add('com-select__caret-icon')
  caretIcon.textContent = '▼'

  element.appendChild(textInput.rendered.element)
  expandButton.appendChild(caretIcon)
  textInput.rendered.element.appendChild(expandButton)

  const close = () => {
    select.isOpen = false
    document.removeEventListener('click', onAnywhereClick)
    window.removeEventListener('resize', onWindowResize)
    optionList.hide()
    caretIcon.textContent = '▼'
  }

  const onOptionListChildElementClick = (el: HTMLElement) => {
    const optionUuid = el.getAttribute('uuid')
    const optionData = findOptionDataByUuid(select.optionDataList, optionUuid)
    select.setValueByOptionUuid(optionUuid)
    options.events?.onValueChange?.(optionData.value)
    close()
  }

  const endSearch = () => {
    if (searchString != null) {
      // Revert state to current value (cancel the search)
      select.setValue(select.value)
      searchString = null
    }
  }

  onAnywhereClick = e => {
    const target = e.target as HTMLElement

    // If click was inside select
    if (target === optionList.rendered.element || target === textInput.rendered.input)
      return

    // If click was expand button
    if (target === expandButton || expandButton.contains(target)) {
      endSearch()
      close()
      return
    }

    // If click was one of the options
    if (optionList.rendered.element.contains(target))
      onOptionListChildElementClick(target)

    endSearch()
    close()
  }
  onWindowResize = close

  const updateOptionListRect = () => {
    optionList.show()
    optionList.rendered.element.style.width = ''
    optionList.rendered.element.style.height = ''
    const paddedWindowRect: Rect = { x: 5, y: 5, height: window.innerHeight - 10, width: window.innerWidth - 10 }
    const optionListRect = determineRect(optionList.rendered.element.getBoundingClientRect(), element.getBoundingClientRect(), paddedWindowRect)
    setRect(optionList.rendered.element, optionListRect)
  }

  const addWhileOpenEventListeners = () => {
    document.removeEventListener('click', onAnywhereClick)
    window.removeEventListener('resize', onWindowResize)

    setTimeout(() => {
      document.addEventListener('click', onAnywhereClick)
    }, 100)
    window.addEventListener('resize', onWindowResize)
  }

  const open = () => {
    if (select.isOpen)
      return

    select.isOpen = true
    caretIcon.textContent = '▲'
    if (optionList == null)
      optionList = createOptionList({ optionDataList: select.optionDataList })
    optionList.updateOptionDataList(select.optionDataList)
    optionList.setSelectedOption(select.selectedOptionUuid)
    updateOptionListRect()
    addWhileOpenEventListeners()
  }

  expandButton.addEventListener('click', open)

  textInput.rendered.input.addEventListener('input', () => {
    // Update search string
    searchString = textInput.rendered.input.value
    // Find matching option data items
    const matchingOptionDataList = searchOptionDataListByDisplayName(select.optionDataList, searchString)
    // Update visible options
    optionList.updateOptionDataList(matchingOptionDataList)
    // Update size and positioning of options list element
    updateOptionListRect()
  })

  if (openOnInputFocus)
    textInput.rendered.input.addEventListener('focus', open)

  const addUnavailableValueAppearance = () => {
    element.classList.add('unavailable-value-selected')
  }

  const removeUnavailableValueAppearance = () => {
    element.classList.remove('unavailable-value-selected')
  }

  // Setting initial options and value
  let initialSelectedOptionData: OptionData<TValue>
  let initialValue: TValue
  if (typeof options.initialOptionDataList === 'function') {
    options.initialOptionDataList(
      result => {
        const _optionDataList = Array.isArray(result) ? result : result.optionDataList
        initialValue = options.initialValue ?? Array.isArray(result) ? null : result.initialValue
        initialSelectedOptionData = findOptionDataByValue(_optionDataList, initialValue)
        renderDisplayNameToInput(textInput.rendered.input, initialSelectedOptionData?.displayName ?? options.initialValue?.toString?.() ?? '')

        if (initialSelectedOptionData == null && options.unavailableValueHandling === UnavailableValueHandling.ERROR_MESSAGE)
          addUnavailableValueAppearance()

        if (select != null) {
          select.value = initialValue
          select.selectedOptionUuid = initialSelectedOptionData?.uuid
          select.optionDataList = _optionDataList
        }
      },
      message => {
        console.log('SELECT GET OPTION DATA LIST ERROR: ', message)
      },
    )
  }
  else {
    initialValue = options.initialValue
    initialSelectedOptionData = findOptionDataByValue(options.initialOptionDataList, initialValue)
    if (initialSelectedOptionData == null && options.unavailableValueHandling === UnavailableValueHandling.ERROR_MESSAGE)
      addUnavailableValueAppearance()
    renderDisplayNameToInput(textInput.rendered.input, initialSelectedOptionData?.displayName ?? initialValue?.toString?.() ?? '')
  }

  select = {
    rendered: { element },
    isOpen: false,
    optionDataList: typeof options.initialOptionDataList !== 'function' ? options.initialOptionDataList : null,
    selectedOptionUuid: initialSelectedOptionData?.uuid,
    value: initialValue,
    dirty: false,
    resetDirtiness: () => {
      select.dirty = false
      textInput.resetDirtiness()
    },
    addOption: optionData => {
      select.optionDataList.push(optionData)
    },
    removeOptionByUuid: optionUuid => {
      const index = select.optionDataList.findIndex(od => od.uuid === optionUuid)
      select.optionDataList.splice(index, 1)
    },
    removeOptionByValue: value => {
      const index = select.optionDataList.findIndex(od => od.value === value)
      select.optionDataList.splice(index, 1)
    },
    setOptions: newOptionDataList => {
      select.optionDataList = newOptionDataList
    },
    setValue: newValue => {
      const optionData = findOptionDataByValue(select.optionDataList, newValue)
      // If option of given value found, set value by the found option
      if (optionData != null) {
        select.setValueByOptionUuid(optionData.uuid)
      }
      else if (options.unavailableValueHandling === UnavailableValueHandling.ERROR_MESSAGE) {
        select.value = newValue
        select.selectedOptionUuid = null
        renderDisplayNameToInput(textInput.rendered.input, newValue?.toString?.() ?? '')
        optionList?.setSelectedOption(null)
        addUnavailableValueAppearance()
      }
      else if (options.unavailableValueHandling === UnavailableValueHandling.ALLOW) {
        select.value = newValue
        select.selectedOptionUuid = null
        renderDisplayNameToInput(textInput.rendered.input, newValue?.toString?.() ?? '')
        optionList?.setSelectedOption(null)
        removeUnavailableValueAppearance()
      }
    },
    setValueByOptionUuid: optionUuid => {
      const optionData = findOptionDataByUuid(select.optionDataList, optionUuid)
      // If option is not found from given uuid, don't do anything
      if (optionData == null)
        return

      select.value = optionData.value
      renderDisplayNameToInput(textInput.rendered.input, optionData.displayName)
      select.selectedOptionUuid = optionData.uuid
      optionList.setSelectedOption(optionData.uuid)
      removeUnavailableValueAppearance()
    },
  }
  return select
}
