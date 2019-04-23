import 'semantic-ui-css/semantic.min.css'

import React from 'react'
import ReactDOM from 'react-dom'
import App from '../components/App'

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App/>,
    document.body.appendChild(document.createElement('div')),
  )
})
