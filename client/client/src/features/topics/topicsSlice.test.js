import { configureStore } from '@reduxjs/toolkit'
import { describe, it, expect, vi } from 'vitest'
import topicsReducer, { generateTopics } from './topicsSlice'
import quizReducer from '../quiz/quizSlice'
import api from '../../services/api'

vi.mock('../../services/api', () => ({
  default: {
    post: vi.fn(),
  },
}))

describe('topicsSlice - generateTopics', () => {
  it('generate topics with mocked AI API', async () => {
    api.post.mockResolvedValue({
      data: {
        data: {
          topics: ['Intro React', 'JSX', 'State'],
        },
      },
    })

    const store = configureStore({
      reducer: {
        topics: topicsReducer,
        quiz: quizReducer,
      },
    })

    await store.dispatch(
      generateTopics({ subject: 'React', level: 'beginner' })
    )

    const state = store.getState().topics

    expect(state.list.length).toBe(3)
    expect(state.list).toEqual(['Intro React', 'JSX', 'State'])
    expect(state.isLoading).toBe(false)
  })
})
