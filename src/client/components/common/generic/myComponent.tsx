import React from 'react'
import { createSelect } from '../../../../component'
import { SelectOptions, Select } from '../../../../component/types'
import Com from './base'

/**
 * Thin wrapper around the Select component
 */
export const render = (props: { options: SelectOptions, setComponent?: (component: Select) => void }) => (
  <Com
    componentOptions={props.options}
    createComponent={createSelect}
    setComponent={props.setComponent}
    name="component"
  />
)

export default render
