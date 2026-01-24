# 🤖 AI Learning Companion

AI Learning Companion adalah platform pembelajaran berbasis AI yang membantu pengguna belajar secara **terstruktur, aman, dan terkontrol** melalui:
- Pembuatan topik belajar berbasis AI
- Kuis per topik dengan penilaian otomatis
- Tracking progress belajar pengguna
- Rekomendasi video pembelajaran dari YouTube

AI pada aplikasi ini **BUKAN chatbot bebas**.  
Semua prompt AI **dikontrol penuh oleh backend** dan hanya digunakan untuk konteks edukasi.

---
URL : (https://ai-learning-bay.vercel.app/)

## 🚀 Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT Authentication
- Google OAuth
- OpenAI / Gemini API
- YouTube Data API

### Frontend
- React (Vite)
- Redux Toolkit
- React Router
- Bootstrap
- Vitest
- React Testing

---

### Authentication Flow

User login menggunakan Google OAuth
Backend memverifikasi Google token
Backend membuat JWT
JWT digunakan untuk mengakses semua endpoint terproteksi

### AI Design Rules 
❌ Tidak ada chat AI bebas
❌ User tidak mengirim prompt langsung ke AI
✅ Semua prompt AI dibuat di backend
✅ AI hanya untuk konteks edukasi
✅ Output AI divalidasi sebelum disimpan
✅ Third-party API tidak pernah dipanggil langsung dari frontend

### Testing Strategy
Backend Testing
Jest
Supertest
Semua endpoint diuji
Database di-reset sebelum test
Semua third-party API DIMOCK
Google OAuth
OpenAI / Gemini
YouTube API
Frontend Testing
Vitest
React Testing Library
Redux slice testing
Async thunk testing
UI interaction testing
Loading & empty state testing