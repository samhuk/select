import { LabelPosition } from '@samhuk/text-input/dist/types'

export type Rendered = { element: HTMLElement }

export type Position = { x: number, y: number }

export type Size = { height: number, width: number }

export type Rect = Position & Size

export enum VerticalDirection {
  UP = 'up',
  DOWN = 'down',
}

export type OptionData<TValue = any> = {
  /**
   * The unique identifier of the option.
   */
  uuid: string
  /**
   * The display name of the option (how it shows in the drop down).
   */
  displayName: string
  /**
   * The unshown "internal value" of the option.
   */
  value: TValue
}

export type OptionOptions<TValue> = {
  data: OptionData<TValue>
}

export type Option = {
  rendered: Rendered
  select: () => void
  unSelect: () => void
}

export type OptionListOptions = {
  optionDataList: OptionData[]
}

export type OptionList = {
  rendered: Rendered
  show: () => void
  hide: () => void
  setSelectedOption: (optionUuid: string) => void
  updateOptionDataList: (newOptionDataList: OptionData[]) => void
}

export enum UnavailableValueHandling {
  /**
   * Show an error message that explains that the current value is not one of the
   * available values.
   */
  ERROR_MESSAGE,
  /**
   * Allow current values that are not one of the available values
   */
  ALLOW,
}

/**
 * Options for creating a select.
 */
export type SelectOptions<TValue = any> = {
  /**
   * The label text.
   */
  label?: string
  /**
   * The position of the label.
   */
  labelPosition?: LabelPosition
  /**
   * The initial option data list. This can either be a list, or a function that asynchronously
   * returns the option data list.
   */
  initialOptionDataList: OptionData<TValue>[]
    | ((
      onComplete: (result: OptionData<TValue>[] | { initialValue: TValue, optionDataList: OptionData<TValue>[] }) => void,
      onError: (message: string) => void
    ) => void)
  /**
   * The initial value.
   */
  initialValue: TValue
  /**
   * True to open the select box drop down when the select's input element is focused.
   */
  openOnInputFocus?: boolean
  /**
   * Controls how the select behaves when the current value is not in the available options.
   */
  unavailableValueHandling: UnavailableValueHandling
  /**
   * True to show the dirtiness indicator.
   */
  showDirtinessIndicator?: boolean
  events?: {
    /**
     * Called when the value of the select changes.
     */
    onValueChange: (newValue: TValue) => any
  }
}

/**
 * A select component
 */
export type Select<TValue = string> = {
  /**
   * The rendered elements of the component.
   */
  rendered: Rendered
  /**
   * True if the select dropdown has been expanded.
   */
  isOpen: boolean
  /**
   * The currently selected option uuid.
   */
  selectedOptionUuid: string
  /**
   * The list of available options.
   */
  optionDataList: OptionData<TValue>[]
  /**
   * The current value of the select.
   */
  value: TValue
  /**
   * True if the value of the select has been changed since the dirtiness was last reset.
   */
  dirty: boolean
  /**
   * Resets the dirtiness, i.e. sets `dirty` to `false`.
   */
  resetDirtiness: () => void
  /**
   * Updates the value of the select
   */
  setValue: (value: TValue) => void
  /**
   * Updates the value of the select to the value of the option of the given uuid
   */
  setValueByOptionUuid: (optionUuid: string) => void
  /**
   * Updates the available options
   */
  setOptions: (options: OptionData<TValue>[]) => void
  /**
   * Adds a new available option
   */
  addOption: (option: OptionData<TValue>) => void
  /**
   * Removes the option with the given value
   */
  removeOptionByValue: (optionValue: TValue) => void
  /**
   * Removes the option with the given uuid
   */
  removeOptionByUuid: (optionUuid: string) => void
}
