# LearnHub — Online Learning Management System

A full-stack LMS built with React, Node.js/Express, MongoDB, JWT auth, and
Cloudinary for video/image storage.

## Architecture

```
online-learning-management-system/
├── client/                      React (Vite) frontend
│   └── src/
│       ├── api/axios.js         Single axios instance (attaches JWT)
│       ├── context/AuthContext.jsx
│       ├── components/          Navbar, Sidebar, CourseCard, ProgressBar, ...
│       └── pages/
│           ├── public/          Home, Courses, CourseDetails, Login, Register
│           ├── student/         Dashboard, MyCourses, CourseLearning, Quiz,
│           │                    Progress, Certificates, Profile
│           └── instructor/      Dashboard, CreateCourse, EditCourse,
│                                ManageCourses, ViewStudents, Profile
│
├── server/                      Express REST API
│   ├── config/                  MongoDB + Cloudinary connection setup
│   ├── models/                  Mongoose schemas (see below)
│   ├── controllers/             Business logic per resource
│   ├── routes/                  REST endpoint wiring + middleware
│   ├── middleware/               auth (JWT), authorize (RBAC), upload (Cloudinary), errorHandler
│   ├── services/                 Cloudinary cleanup, progress recalculation + auto certificate issuance
│   ├── utils/                    asyncHandler, generateToken, certificateId, seed script
│   └── server.js
│
└── README.md (this file)
```

### Data flow
- **Enrolling / browsing**: `React → REST API (/api/courses) → Express → MongoDB`
- **Uploading a thumbnail or lecture video**: `React (multipart form) → Express (multer) → Cloudinary → MongoDB stores the returned URL + publicId` (the binary file itself never touches MongoDB or disk storage on the server; Cloudinary streams it directly).
- **Auth**: `POST /api/auth/login` returns a JWT. The frontend stores it in `localStorage` and the axios interceptor attaches it as `Authorization: Bearer <token>` on every request. `middleware/auth.js`'s `protect` verifies it and loads `req.user`; `authorize('instructor')` / `authorize('student')` then enforces role-based access control.

### MongoDB models
`User`, `Course`, `Module` (a course "section"), `Lecture` (video within a module), `Quiz` + `Question`, `QuizAttempt` (every submission, for history), `Enrollment` (student↔course), `Progress` (per student/course: completed lectures, quiz results, completion %), `Certificate`.

### Progress & certificates
`services/progressService.js` recalculates `completionPercent` for a student/course every time a lecture is marked complete or a quiz is submitted (lectures completed + quizzes passed, divided by total items in the course). The moment it hits 100%, a `Certificate` document is created automatically (idempotent — running it again won't duplicate).

## Setup

### 1. Prerequisites
- Node.js 18+
- A MongoDB instance — either [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) (free tier) or a local `mongod`
- A free [Cloudinary](https://cloudinary.com/users/register/free) account (for thumbnails + lecture videos)

### 2. Backend
```bash
cd server
cp .env.example .env
# edit .env: set MONGO_URI, JWT_SECRET, CLOUDINARY_* values
npm install
npm run seed     # optional: creates test accounts + a sample course
npm run dev       # starts on http://localhost:5000
```

### 3. Frontend
```bash
cd client
cp .env.example .env    # VITE_API_URL=http://localhost:5000/api
npm install
npm run dev              # starts on http://localhost:5173
```

Open http://localhost:5173.

### 4. Environment variables

**server/.env**
| Variable | Description |
|---|---|
| `PORT` | Express port (default 5000) |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string used to sign tokens |
| `JWT_EXPIRES_IN` | e.g. `7d` |
| `CLOUDINARY_CLOUD_NAME` / `CLOUDINARY_API_KEY` / `CLOUDINARY_API_SECRET` | From your Cloudinary dashboard |
| `CLIENT_URL` | Frontend origin, for CORS |

**client/.env**
| Variable | Description |
|---|---|
| `VITE_API_URL` | Base URL of the API, e.g. `http://localhost:5000/api` |

Cloudinary/JWT secrets live only in `server/.env` and are never sent to the browser — the frontend only ever talks to your own Express API.

## Test accounts (after `npm run seed`)
| Role | Email | Password |
|---|---|---|
| Instructor | instructor@example.com | password123 |
| Student | student@example.com | password123 |

The seeded course has no lecture videos yet (that requires real Cloudinary credentials) — log in as the instructor and upload one from **Manage Courses → Edit** to see the full flow end-to-end.

## API reference (all prefixed with `/api`)

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/auth/register` | Public | Create account (`role`: student/instructor) |
| POST | `/auth/login` | Public | Returns JWT |
| GET | `/auth/me` | Private | Current user |
| PUT | `/auth/me` | Private | Update name/bio/avatar |
| GET | `/courses` | Public | List/search/filter published courses |
| GET | `/courses/:id` | Public | Course + modules + lectures + quiz |
| GET | `/courses/instructor/mine` | Instructor | Courses you created |
| POST | `/courses` | Instructor | Create course (multipart: thumbnail) |
| PUT | `/courses/:id` | Instructor (owner) | Edit course |
| DELETE | `/courses/:id` | Instructor (owner) | Delete course + all children |
| POST | `/courses/:id/modules` | Instructor (owner) | Add a module/section |
| GET | `/courses/:id/students` | Instructor (owner) | Enrolled students + progress |
| POST | `/courses/:id/enroll` | Student | Enroll |
| GET | `/users/enrolled-courses` | Student | My courses + progress |
| POST | `/lectures` | Instructor | Upload video lecture (multipart: video) |
| PUT | `/lectures/:id` | Instructor (owner) | Edit lecture / replace video |
| DELETE | `/lectures/:id` | Instructor (owner) | Delete lecture |
| POST | `/quizzes` | Instructor | Create quiz + questions |
| GET | `/quizzes/:id` | Enrolled student / owner | Fetch quiz (answers stripped for students) |
| POST | `/quizzes/:id/submit` | Student | Submit answers, get scored |
| GET | `/progress/:courseId` | Student | My progress in a course |
| POST | `/progress/:courseId` | Student | Mark lecture complete / update position |
| GET | `/certificates` | Student | My certificates |
| GET | `/certificates/:id` | Private | Fetch by Mongo id or certificateId (verification) |

## Common errors & fixes

- **"MongoDB connection error"** — check `MONGO_URI` in `server/.env`; for Atlas, whitelist your IP.
- **CORS errors in the browser console** — make sure `CLIENT_URL` in `server/.env` matches the frontend's actual origin (`http://localhost:5173` in dev).
- **Video upload hangs or 401s from Cloudinary** — double check `CLOUDINARY_CLOUD_NAME/API_KEY/API_SECRET`; they must be from the same Cloudinary account.
- **"Not authorized, no token provided"** — the JWT wasn't attached; make sure you're logged in and `VITE_API_URL` is reachable (check the Network tab).
- **413 / file too large on video upload** — lecture videos are capped at 500MB and thumbnails at 5MB in `server/middleware/upload.js`; adjust `limits.fileSize` if you need more.
- **`npm install` fails on `multer-storage-cloudinary`** — make sure you're on Node 18+; older Node versions can have peer-dependency issues.

## Notes on scope
This is a complete, working reference implementation covering every feature in the spec (auth, RBAC, course/module/lecture/quiz CRUD, Cloudinary video/image upload, enrollment, progress tracking, auto-issued certificates). For a production deployment you'd want to add: refresh tokens, rate limiting, server-side pagination on `/courses`, resumable/chunked video uploads for very large files, and automated tests.

## UI/UX design system
The frontend uses a consistent design system defined in `client/tailwind.config.js` and `client/src/styles/index.css`:
- **Typography**: Plus Jakarta Sans (headings) + Inter (body), loaded via Google Fonts in `index.html`.
- **Color**: a brand blue→violet→magenta gradient family, plus a neutral slate scale for text/surfaces.
- **Reusable classes**: `.btn-primary/secondary/ghost/danger`, `.card`/`.card-hover`, `.input`/`.select`, `.badge-*`, `.progress-track/fill`, `.table-clean`, `.nav-link`.
- **Icons**: [lucide-react](https://lucide.dev) is used everywhere instead of emoji/Unicode symbols, for a consistent icon set.
- Course cards intentionally don't show a star rating — the data model has no rating field, and rather than fabricate one, that's left as a future enhancement (would need a `Review` model + endpoint).
