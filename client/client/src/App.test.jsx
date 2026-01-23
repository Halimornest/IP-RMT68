import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { describe, it, expect } from 'vitest'

import App from './App'

const authReducer = (
  state = {
    token: null,
    isAuth: false,
    user: null,
  }
) => state

describe('App', () => {
  it('renders without crashing', () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
      },
    })

    render(
      <Provider store={store}>
        <App /> 
      </Provider>
    )

    expect(document.body).toBeInTheDocument()
  })
})
