import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import { configureStore } from '@reduxjs/toolkit'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import Quiz from './Quiz'
import quizReducer from '../features/quiz/quizSlice'
import * as api from '../features/quiz/quizService'
import { vi } from 'vitest'

vi.mock('../features/quiz/quizService', () => ({
  getQuizAPI: vi.fn(),
  submitQuizAPI: vi.fn(),
}))

function renderQuiz() {
  const store = configureStore({
    reducer: { quiz: quizReducer },
  })

  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/quiz/topic-1']}>
        <Routes>
          <Route path="/quiz/:topicId" element={<Quiz />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  )
}

describe('Quiz Page Flow', () => {
    test('user can select answer and submit quiz', async () => {
  api.getQuizAPI.mockResolvedValue({
    data: {
      quizId: 'quiz-123',
      quiz: [
        {
          question: 'Apa itu React?',
          options: ['Library', 'Framework', 'DB', 'OS'],
        },
      ],
    },
  })

  api.submitQuizAPI.mockResolvedValue({
    data: {
      score: 100,
      details: [],
    },
  })

  renderQuiz()

  await screen.findByText((text) =>
    text.includes('Apa itu React')
  )

  const radios = screen.getAllByRole('radio')
    fireEvent.click(radios[0])

  fireEvent.click(
    screen.getByRole('button', { name: /submit quiz/i })
  )

  await waitFor(() => {
    expect(api.submitQuizAPI).toHaveBeenCalledTimes(1)
  })

  expect(await screen.findByText('100')).toBeInTheDocument()
})

})
