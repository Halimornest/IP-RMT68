import { configureStore } from '@reduxjs/toolkit'
import { describe, it, expect, vi } from 'vitest'
import progressReducer, {
  fetchTopicProgress,
  fetchQuizHistory,
  fetchTopicVideos,
} from './progressSlice'
import * as api from './progressService'

vi.mock('./progressService', () => ({
  getTopicProgressAPI: vi.fn(),
  getQuizHistoryAPI: vi.fn(),
  getTopicVideosAPI: vi.fn(),
}))

describe('progressSlice', () => {
  it('fetchTopicProgress success', async () => {
    api.getTopicProgressAPI.mockResolvedValue({
      topicId: '1',
      title: 'Intro React',
      attempts: 3,
      bestScore: 90,
      averageScore: 80,
      status: 'completed',
    })

    const store = configureStore({
      reducer: { progress: progressReducer },
    })

    await store.dispatch(fetchTopicProgress('1'))

    const state = store.getState().progress
    expect(state.detail.title).toBe('Intro React')
    expect(state.detail.bestScore).toBe(90)
  })

  it('fetchQuizHistory success', async () => {
    api.getQuizHistoryAPI.mockResolvedValue([
      { score: 80 },
      { score: 90 },
    ])

    const store = configureStore({
      reducer: { progress: progressReducer },
    })

    await store.dispatch(fetchQuizHistory('1'))

    const state = store.getState().progress
    expect(state.history.length).toBe(2)
  })

  it('fetchTopicVideos success', async () => {
    api.getTopicVideosAPI.mockResolvedValue({
      videos: [
        {
          videoId: 'abc',
          title: 'React Basics',
          channel: 'YouTube',
          thumbnail: 'img.jpg',
        },
      ],
    })

    const store = configureStore({
      reducer: { progress: progressReducer },
    })

    await store.dispatch(fetchTopicVideos('1'))

    const state = store.getState().progress
    expect(state.videos.length).toBe(1)
    expect(state.videos[0].title).toBe('React Basics')
  })
})
