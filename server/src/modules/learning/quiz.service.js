const Quiz = require('./quiz.model')
const QuizResult = require('./quiz-result.model')

async function saveQuiz({ topicId, level, quiz }) {
  return Quiz.create({
    topicId,
    level,
    questions: quiz,
    totalQuestions: quiz.length,
  })
}

async function submitQuiz({ quizId, userId, answers }) {
  const quiz = await Quiz.findByPk(quizId)
  if (!quiz) throw new Error('Quiz not found')

  if (!Array.isArray(answers)) {
    throw new Error('Invalid answers format')
  }

  if (answers.length !== quiz.questions.length) {
    throw new Error('Incomplete quiz answers')
  }

  const exists = await QuizResult.findOne({
    where: { quizId, userId },
  })
  if (exists) {
    throw new Error('Quiz already submitted')
  }

  let correctCount = 0
  const details = []

  quiz.questions.forEach((q, index) => {
    const userAnswer = answers[index]
    const selectedOption = userAnswer?.selectedOption ?? null
    const correctOption = q.answer

    const isCorrect =
      selectedOption &&
      selectedOption.trim() === correctOption.trim()

    if (isCorrect) correctCount++

    details.push({
      questionIndex: index,
      question: q.question,
      options: q.options,
      selectedOption,
      correctOption,
      isCorrect,
    })
  })

  const score = Math.round(
    (correctCount / quiz.questions.length) * 100
  )

  const result = await QuizResult.create({
    quizId,
    userId,
    answers,
    score,
  })

  return {
    totalQuestions: quiz.questions.length,
    correct: correctCount,
    score,
    details,
    resultId: result.id,
  }
}

async function getQuizHistoryByTopic({ topicId, userId }) {
  const quizzes = await Quiz.findAll({
    where: { topicId },
    include: [
      {
        model: QuizResult,
        as: 'results',
        where: { userId },
        required: false,
      },
    ],
    order: [[{ model: QuizResult, as: 'results' }, 'created_at', 'DESC']],
  })

  const history = []

  quizzes.forEach(q => {
    q.results.forEach(r => {
      history.push({
        score: r.score,
        submittedAt: r.created_at,
      })
    })
  })

  return history
}

module.exports = {
  saveQuiz,
  submitQuiz,
  getQuizHistoryByTopic,
}
