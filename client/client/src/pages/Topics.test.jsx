import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'

import Topics from './Topics'
import topicsReducer, { deleteTopic } from '../features/topics/topicsSlice'
import quizReducer from '../features/quiz/quizSlice'

function renderTopics(preloadedTopics = []) {
  const store = configureStore({
    reducer: {
      topics: topicsReducer,
      quiz: quizReducer,
    },
    preloadedState: {
      topics: {
        list: preloadedTopics,
        isLoading: false,
        isFetched: true,
        error: null,
      },
      quiz: {
        history: [],
      },
    },
  })

  const utils = render(
    <Provider store={store}>
      <MemoryRouter>
        <Topics />
      </MemoryRouter>
    </Provider>
  )

  return { store, ...utils }
}

describe('Topics Page', () => {
  it('renders topics from API', async () => {
    renderTopics([{ id: '1', title: 'Intro React' }])

    expect(
      await screen.findByText('Intro React')
    ).toBeInTheDocument()
  })

  it('can generate topics (UI interaction)', async () => {
    renderTopics([])

    fireEvent.change(
      screen.getByPlaceholderText(/react/i),
      { target: { value: 'React' } }
    )

    fireEvent.change(
      screen.getByRole('combobox'),
      { target: { value: 'beginner' } }
    )

    fireEvent.click(
      screen.getByRole('button', { name: /generate/i })
    )

    await waitFor(() => {
      expect(
        screen.getByText(/your learning topics/i)
      ).toBeInTheDocument()
    })
  })

  it('can delete topic', async () => {
    const { store } = renderTopics([
      { id: '1', title: 'Intro React' },
    ])

    const buttons = screen.getAllByRole('button')
    fireEvent.click(buttons[1])

    store.dispatch(deleteTopic.fulfilled('1'))

    await waitFor(() => {
      expect(
        screen.queryByText('Intro React')
      ).not.toBeInTheDocument()
    })
  })
})
