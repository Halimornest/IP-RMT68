# 📑 AI Learning Companion – API Documentation

Dokumentasi ini menjelaskan seluruh API Backend dan kontrak API Frontend
untuk aplikasi **AI Learning Companion**.

---

## Base URL
http://localhost:3000/api

---

## 🔐 Authentication

Semua endpoint (kecuali login) **WAJIB** menggunakan JWT.

**Header**
Authorization: Bearer <jwt_token>

---

# AUTH MODULE

## POST `/auth/google`

### Description
Login menggunakan Google OAuth.

---

### ✅ Success Response (200)
```json
{
  "token": "jwt_token",
  "user": {
    "id": "uuid",
    "email": "user@email.com",
    "role": "student"
  }
}

❌ Error Responses
400 – Invalid OAuth Token
{
  "success": false,
  "message": "Invalid Google token"
}

500 – OAuth Service Error
{
  "success": false,
  "message": "Authentication service error"
}

GET /auth/me
✅ Success Response (200)
{
  "user": {
    "id": "uuid",
    "email": "user@email.com",
    "role": "student"
  }
}

❌ Error Responses
401 – Unauthorized
{
  "success": false,
  "message": "Unauthorized"
}

AI MODULE
POST /ai/generate-and-save-topics
Description

Generate topik belajar menggunakan AI.

Request Body
{
  "subject": "React",
  "level": "beginner"
}

✅ Success Response (201)
{
  "topics": ["Intro React", "JSX Basics", "State"]
}

❌ Error Responses
400 – Validation Error
{
  "success": false,
  "message": "Subject and level are required"
}

401 – Unauthorized
{
  "success": false,
  "message": "Unauthorized"
}

500 – AI Generation Failed
{
  "success": false,
  "message": "Failed to generate topics"
}

TOPIC MODULE
GET /learning/topics
✅ Success Response (200)
{
  "topics": [
    {
      "id": "uuid",
      "title": "Intro React",
      "subject": "React",
      "level": "beginner"
    }
  ]
}

❌ Error Responses
401 – Unauthorized
{
  "success": false,
  "message": "Unauthorized"
}

DELETE /learning/topics/:id
✅ Success Response (200)
{
  "success": true
}

❌ Error Responses
401 – Unauthorized
{
  "success": false,
  "message": "Unauthorized"
}

404 – Topic Not Found
{
  "success": false,
  "message": "Topic not found"
}

QUIZ MODULE
POST /quiz/generate-and-save
Request Body
{
  "topicId": "uuid",
  "level": "beginner",
  "count": 5
}

✅ Success Response (201)
{
  "quizId": "uuid",
  "totalQuestions": 5,
  "quiz": []
}

❌ Error Responses
400 – Invalid Request
{
  "success": false,
  "message": "Invalid topicId"
}

401 – Unauthorized
{
  "success": false,
  "message": "Unauthorized"
}

500 – AI Generation Failed
{
  "success": false,
  "message": "Failed to generate quiz"
}

POST /quiz/submit
Request Body
{
  "quizId": "uuid",
  "answers": [{ "selectedOption": "Library" }]
}

✅ Success Response (200)
{
  "score": 80,
  "correct": 4,
  "totalQuestions": 5
}

❌ Error Responses
400 – Incomplete Answers
{
  "success": false,
  "message": "Incomplete quiz answers"
}

401 – Unauthorized
{
  "success": false,
  "message": "Unauthorized"
}

409 – Quiz Already Submitted
{
  "success": false,
  "message": "Quiz already submitted"
}

POST /quiz/explain
✅ Success Response (200)
{
  "explanation": "React adalah library JavaScript..."
}

❌ Error Responses
400 – Invalid Payload
{
  "success": false,
  "message": "Invalid explanation request"
}

GET /quiz/history/:topicId
❌ Error Responses
401 – Unauthorized
{
  "success": false,
  "message": "Unauthorized"
}

PROGRESS MODULE
GET /progress/my
❌ Error Responses
401 – Unauthorized
{
  "success": false,
  "message": "Unauthorized"
}

GET /progress/topic/:topicId
❌ Error Responses
404 – Progress Not Found
{
  "success": false,
  "message": "Progress not found"
}

GET /progress/videos/:topicId
❌ Error Responses
500 – YouTube API Error
{
  "success": false,
  "message": "Failed to load videos"
}

Standard Error Format
{
  "success": false,
  "message": "Error description"
}