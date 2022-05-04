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
  uuid: string
  displayName: string
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
  ERROR_MESSAGE,
  ALLOW,
}

export type SelectOptions<TValue = any> = {
  label?: string
  labelPosition?: LabelPosition
  initialOptionDataList: OptionData<TValue>[]
    | ((
      onComplete: (result: OptionData<TValue>[] | { initialValue: TValue, optionDataList: OptionData<TValue>[] }) => void,
      onError: (message: string) => void
    ) => void)
  initialValue: TValue
  openOnInputFocus?: boolean
  unavailableValueHandling: UnavailableValueHandling
  showDirtinessIndicator?: boolean
  events?: {
    onValueChange: (newValue: TValue) => any
  }
}

export type Select<TValue = string> = {
  rendered: Rendered
  isOpen: boolean
  selectedOptionUuid: string
  optionDataList: OptionData<TValue>[]
  value: TValue
  dirty: boolean
  resetDirtiness: () => void
  setValue: (value: TValue) => void
  setValueByOptionUuid: (optionUuid: string) => void
  setOptions: (options: OptionData<TValue>[]) => void
  addOption: (option: OptionData<TValue>) => void
  removeOptionByValue: (optionValue: TValue) => void
  removeOptionByUuid: (optionUuid: string) => void
}
