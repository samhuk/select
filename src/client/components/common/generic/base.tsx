import React, { useEffect, useRef } from 'react'

export type Props<TComponent extends { rendered: { element: HTMLElement } }, TComponentOptions> = {
  createComponent: (options: TComponentOptions) => TComponent
  componentOptions: TComponentOptions
  containerElementFullSize?: boolean
  setComponent?: (table: TComponent) => void
  name?: string
}

/**
 * Wraps a vanilla js ui component with a thin react shim layer.
 */
export const render = <TComponent extends { rendered: { element: HTMLElement } }, TComponentOptions>(props: Props<TComponent, TComponentOptions>) => {
  const componentContainer = useRef<HTMLDivElement>()
  const component = useRef<TComponent>()

  useEffect(() => {
    if (componentContainer == null || props.componentOptions == null)
      return

    component.current = props.createComponent(props.componentOptions)
    props.setComponent?.(component.current)
    componentContainer.current.appendChild(component.current.rendered.element)
    if (props.containerElementFullSize) {
      componentContainer.current.style.width = '100%'
      componentContainer.current.style.height = '100%'
    }
  }, [])

  return (
    <div className={`com-wrapper ${props.name ? `com-wrapper--${props.name}` : ''}`} ref={componentContainer} />
  )
}

export default render
