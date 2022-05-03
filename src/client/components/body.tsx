import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './home'
import Showcase from './showcase'
import MyComponent from './showcase/myComponent'

export const render = () => (
  <div className="body-wrapper">
    <div className="body">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/showcase" element={<Showcase />}>
          <Route path="my-component" element={<MyComponent />} />
        </Route>
      </Routes>
    </div>
  </div>
)

export default render
