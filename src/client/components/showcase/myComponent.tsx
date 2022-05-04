import React from 'react'
import { Select, SelectOptions, UnavailableValueHandling } from '../../../component/types'
import SelectWithReact from '../common/generic/myComponent'
import ItemBase from './itemBase'

const COMPONENT_OPTIONS: SelectOptions = {
  initialValue: 'America',
  initialOptionDataList: [
    { uuid: '1', value: 'america', displayName: 'America' },
    { uuid: '2', value: 'united-kingdom', displayName: 'UK' },
    { uuid: '3', value: 'france', displayName: 'France' },
    { uuid: '4', value: 'spain', displayName: 'Spain' },
    { uuid: '5', value: 'germany', displayName: 'Germany' }
  ],
  unavailableValueHandling: UnavailableValueHandling.ALLOW,
  label: 'Country of Origin',
}

const Operations = (props: { component: Select }) => (
  <>
    <button
      type="button"
      className="button--white"
      onClick={() => props.component.setValue('united-kingdom')}
    >
      Update the value
    </button>
  </>
)

export const render = () => (
  <ItemBase component={SelectWithReact} componentOptions={COMPONENT_OPTIONS} operationsComponent={Operations} />
)

export default render
