import { render, screen } from '@testing-library/react'
import { Provider, useDispatch } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, it, expect, vi } from 'vitest'

import ProgressDetail from './ProgressDetail'
import progressReducer from '../features/progress/progressSlice'

vi.mock('react-redux', async () => {
  const actual = await vi.importActual('react-redux')
  return {
    ...actual,
    useDispatch: () => vi.fn(),
  }
})

function renderPage(preloadedProgress) {
  const store = configureStore({
    reducer: {
      progress: progressReducer,
    },
    preloadedState: {
      progress: preloadedProgress,
    },
  })

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/progress/1']}>
        <Routes>
          <Route path="/progress/:topicId" element={<ProgressDetail />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

describe('ProgressDetail Page', () => {
  it('renders progress detail', async () => {
    renderPage({
      detail: {
        topicId: '1',
        title: 'Intro React',
        attempts: 3,
        bestScore: 90,
        averageScore: 80,
        status: 'completed',
      },
      history: [{ score: 90 }],
      videos: [],
      loadingDetail: false,
      loadingHistory: false,
      loadingVideos: false,
    })

    expect(await screen.findByText('Intro React')).toBeInTheDocument()
    expect(screen.getByText('Attempts')).toBeInTheDocument()
    expect(screen.getByText('Best Score')).toBeInTheDocument()
  })

  it('shows empty state if no progress history', async () => {
    renderPage({
      detail: {
        topicId: '1',
        title: 'Intro React',
        attempts: 0,
        bestScore: 0,
        averageScore: 0,
        status: 'not_started',
      },
      history: [],
      videos: [],
      loadingDetail: false,
      loadingHistory: false,
      loadingVideos: false,
    })

    expect(
      await screen.findByText(/no quiz attempts yet/i)
    ).toBeInTheDocument()
  })
})
