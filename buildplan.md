# **Quiz App Blueprint** (Complete)

## Overview
Client-only quiz/exam application. No server, no database. All data persists to localStorage. Import questions from JSON, configure exam settings, take quiz, view results with stats.

---

## Screen Flow (UI User Sees)

```
ImportScreen → DeckScreen → ConfigScreen → QuizScreen → ResultsScreen
                                                              ↓
                                                       HistoryScreen
```

---

## Data Flow (Backend Mechanism)

```
Raw JSON File
    ↓ parser.ts: validate & extract
Question[] (with id, text, options[], correctIndex)
    ↓ deckStore: CRUD + persist to localStorage
Deck[] in localStorage
    ↓ (user selects + starts)
Session state: answers[], confidence[], flagged[], startedAt, timeLimit
    ↓ scorer.ts: calculate score, wrongIds
Result: { deckId, score, total, timeTaken, date, wrongIds }
    ↓ historyStore: append + persist
History[] in localStorage
    ↓ export.ts: download as JSON
File download (browser)
```

---

## Tech Stack (Detailed)

| Component | Tech | Why |
|-----------|------|-----|
| **Runtime** | Vite + React 18 + TS | Fast, modern, no SSR needed |
| **State** | 3x Zustand + persist | Simple, performant, local storage |
| **Styling** | Tailwind CSS | Mobile-first, responsive, dark mode |
| **Animation** | Framer Motion | Smooth transitions, professional UX |
| **Charts** | Recharts | Lightweight, React-native integration |
| **File I/O** | Browser File API | No library needed, privacy-first |
| **Deploy** | Vite → Vercel static | $0 cost, auto CI/CD |

---

## File Structure

```
src/
├── types/index.ts                ← Question, Deck, Session, Result
├── utils/
│   ├── parser.ts                 ← JSON → Question[]
│   ├── scorer.ts                 ← calculate score + wrong IDs
│   ├── io.ts                     ← import/export
│   └── constants.ts              ← labels, defaults
├── store/
│   ├── deckStore.ts              ← Zustand + persist
│   ├── sessionStore.ts           ← current quiz state
│   ├── historyStore.ts           ← past sessions
│   └── index.ts                  ← export all
├── components/
│   ├── MotionWrapper.tsx          ← Framer Motion screen transitions
│   ├── QuestionCard.tsx           ← single Q + options
│   ├── ResultsChart.tsx           ← Recharts visualization
│   ├── Timer.tsx                  ← countdown
│   └── Navbar.tsx                 ← header nav
├── screens/
│   ├── ImportScreen.tsx           ← upload JSON
│   ├── DeckScreen.tsx             ← CRUD decks
│   ├── ConfigScreen.tsx           ← settings before quiz
│   ├── QuizScreen.tsx             ← main quiz
│   ├── ResultsScreen.tsx          ← score + stats
│   └── HistoryScreen.tsx          ← past sessions
├── App.tsx                        ← screen dispatcher
├── App.css                        ← global + Tailwind
└── main.tsx                       ← entry
```

---

## Core Types

```typescript
// Question
{
  id: string
  text: string
  options: { label: string; text: string }[]
  correctIndex: number
}

// Deck
{
  id: string
  name: string
  questions: Question[]
  createdAt: number
}

// Session (active)
{
  deckId: string
  questions: Question[]
  answers: (number | null)[]
  confidence: ('sure' | 'guess' | null)[]
  flagged: boolean[]
  startedAt: number
  timeLimit: number | null
  mode: 'exam' | 'review'
}

// Result
{
  deckId: string
  score: number
  total: number
  timeTaken: number
  date: number
  wrongIds: string[]
}
```

---

## Zustand Stores

**deckStore** — CRUD decks, persist to localStorage  
**sessionStore** — active quiz state, persist to localStorage (hỗ trợ resumable session - tự động lưu tiến trình làm bài)  
**historyStore** — past results, persist to localStorage  

---

## Tính Năng & Cấu Hình Mở Rộng
- **Shuffle**: Trộn ngẫu nhiên câu hỏi và vị trí các đáp án (Cấu hình trước khi thi tại ConfigScreen).
- **Auto-save Session**: Tiến trình làm bài bảo lưu liên tục. Reload không mất bài.

---

## JSON Import Format

```json
{
  "name": "Chemistry Quiz",
  "questions": [
    {
      "text": "What is H2O?",
      "options": ["Water", "Hydrogen", "Oxygen", "Salt"],
      "correctIndex": 0
    }
  ]
}
```

Parser validates, generates IDs, creates Deck.

---

## Key Points

✅ **Client-only** — No server, no database, $0 cost  
✅ **Persist** — localStorage auto-sync via Zustand  
✅ **Mobile-first** — Tailwind responsive  
✅ **Smooth UX** — Framer Motion transitions  
✅ **Export** — Download decks, results, history as JSON  
✅ **Dark mode** — Built-in, persistent  
✅ **Deploy** — Static to Vercel, instant  
