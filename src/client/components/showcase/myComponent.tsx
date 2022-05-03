import React from 'react'
import { MyComponent, MyComponentOptions } from '../../../component'
import MyComponentWithReact from '../common/generic/myComponent'
import ItemBase from './itemBase'

const COMPONENT_OPTIONS: MyComponentOptions = {
  initialText: 'Hello, World!'
}

const Operations = (props: { component: MyComponent }) => (
  <>
    <button
      type="button"
      className="button--white"
      onClick={() => props.component.updateText('New text!')}
    >
      Update the text of the component
    </button>
  </>
)

export const render = () => (
  <ItemBase component={MyComponentWithReact} componentOptions={COMPONENT_OPTIONS} operationsComponent={Operations} />
)

export default render
