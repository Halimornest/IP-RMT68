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

  let score = 0
  const details = []

  quiz.questions.forEach((q, index) => {
    const userAnswer = answers.find(a => a.questionIndex === index)

    const correctOptionIndex = q.options.findIndex(
      opt => opt.trim() === q.answer.trim()
    )

    const selectedOptionIndex =
      userAnswer?.optionIndex ?? null

    const isCorrect =
      selectedOptionIndex === correctOptionIndex

    if (isCorrect) score += 1

    details.push({
      questionIndex: index,
      question: q.question,
      options: q.options,
      selectedOptionIndex,
      correctOptionIndex,
      isCorrect,
    })
  })

  const result = await QuizResult.create({
    quizId,
    userId,
    answers,
    score,
  })

  return {
    totalQuestions: quiz.questions.length,
    correct: score,
    score,
    details,
    resultId: result.id,
  }
}

module.exports = {
  saveQuiz,
  submitQuiz,
}
