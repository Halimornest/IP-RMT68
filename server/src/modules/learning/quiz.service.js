const Quiz = require('./quiz.model')
const QuizResult = require('./quiz-result.model')

async function saveQuiz({ topicId, level, quiz }) {
  return Quiz.create({
    topicId,
    level,
    questions: quiz,
  })
}

async function submitQuiz({ quizId, userId, answers }) {
  const quiz = await Quiz.findByPk(quizId)
  if (!quiz) throw new Error('Quiz not found')

  if (!Array.isArray(answers) || answers.length === 0) {
    throw new Error('No answers submitted')
  }

  if (answers.length !== quiz.questions.length) {
    throw new Error('Incomplete quiz answers')
  }

  const existing = await QuizResult.findOne({
    where: { quizId, userId },
  })
  if (existing) {
    throw new Error('Quiz already submitted')
  }

  let correctCount = 0
  const details = []

  quiz.questions.forEach((q, index) => {
    const userAnswer = answers[index]

    const isCorrect =
      userAnswer &&
      userAnswer.selectedOption?.trim() === q.answer.trim()

    if (isCorrect) correctCount++

    details.push({
      questionIndex: index,
      question: q.question,
      options: q.options,
      selectedOption: userAnswer?.selectedOption ?? null,
      correctOption: q.answer,
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


module.exports = {
  saveQuiz,
  submitQuiz,
}
