# SkillBridge — AI-Powered Interview Preparation Platform

SkillBridge is a full-stack web application that helps job seekers prepare for interviews.
A candidate uploads their **resume (PDF)** or writes a short **self-description**, pastes a
**target job description**, and the app uses **Google Gemini** to generate a personalized
interview report containing:

- A **match score** (0–100) between the candidate's profile and the role
- **Technical questions** with the interviewer's intention and a model answer
- **Behavioral questions** with intention and a model answer
- **Skill gaps** ranked by severity (low / medium / high)
- A **day-by-day preparation road map**
- A downloadable, **ATS-friendly tailored resume PDF**

---

## Tech Stack

**Frontend**
- React 19 + Vite
- React Router 7
- Axios
- SCSS (Sass)

**Backend**
- Node.js + Express 5
- MongoDB + Mongoose
- JWT authentication (httpOnly cookies) + bcrypt password hashing
- Multer (in-memory file uploads) + pdf-parse (resume text extraction)
- Google Gemini (`@google/genai`) with Zod-validated structured output
- Puppeteer (HTML → PDF resume generation)

---

## Project Structure

```
SkillBridge/
├── Backend/
│   ├── server.js
│   └── src/
│       ├── app.js
│       ├── config/database.js
│       ├── controllers/        # auth + interview controllers
│       ├── middlewares/        # auth (JWT) + file upload
│       ├── models/             # user, blacklist token, interview report
│       ├── routes/             # /api/auth, /api/interview
│       └── services/ai.service.js   # Gemini + Puppeteer
└── Frontend/
    └── src/
        ├── app.routes.jsx
        └── features/
            ├── auth/           # context, hooks, pages, api
            └── interview/      # context, hooks, pages, api, styles
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB connection string (e.g. [MongoDB Atlas](https://www.mongodb.com/atlas))
- A free Google Gemini API key from [Google AI Studio](https://aistudio.google.com/apikey)

### 1. Backend

```bash
cd Backend
npm install
cp .env.example .env   # then fill in the values
npm run dev            # starts on http://localhost:3000
```

`.env` values:

| Variable                | Description                                     |
| ----------------------- | ----------------------------------------------- |
| `MONGO_URI`             | MongoDB connection string                       |
| `PORT`                  | Server port (default `3000`)                    |
| `CLIENT_URL`            | Frontend origin for CORS (`http://localhost:5173`) |
| `JWT_SECRET`            | Long random string used to sign JWTs            |
| `GOOGLE_GENAI_API_KEY`  | Google Gemini API key                           |
| `GEMINI_MODEL`          | Gemini model id (default `gemini-flash-lite-latest`) |
| `GEMINI_THINKING_BUDGET`| Model reasoning budget; `0` = fastest (default) |

### 2. Frontend

```bash
cd Frontend
npm install
cp .env.example .env   # VITE_API_URL defaults to http://localhost:3000
npm run dev            # starts on http://localhost:5173
```

Open **http://localhost:5173**, register an account, and generate your first interview plan.

---

## API Reference

### Auth — `/api/auth`
| Method | Endpoint     | Access  | Description                        |
| ------ | ------------ | ------- | ---------------------------------- |
| POST   | `/register`  | Public  | Register a new user, sets cookie   |
| POST   | `/login`     | Public  | Log in, sets auth cookie           |
| GET    | `/logout`    | Public  | Clears cookie & blacklists token   |
| GET    | `/get-me`    | Private | Get the current logged-in user     |

### Interview — `/api/interview`
| Method | Endpoint                        | Access  | Description                                   |
| ------ | ------------------------------- | ------- | --------------------------------------------- |
| POST   | `/`                             | Private | Generate a report (resume PDF + job desc)     |
| GET    | `/`                             | Private | List the user's reports                       |
| GET    | `/report/:interviewId`          | Private | Get a single report by id                     |
| POST   | `/resume/pdf/:interviewReportId`| Private | Generate & download a tailored resume PDF     |

---

## How It Works

1. The user submits a job description plus a resume PDF and/or self-description.
2. `pdf-parse` extracts text from the uploaded resume.
3. `ai.service.js` sends the details to **Gemini** with a **Zod → JSON schema** so the model
   returns strictly-typed structured output (questions, skill gaps, prep plan, match score).
4. The report is persisted in MongoDB and rendered in a clean three-column dashboard.
5. On request, Gemini writes a tailored resume as HTML which **Puppeteer** converts to a PDF.

---

## Author

**Anubhav Rajput**
