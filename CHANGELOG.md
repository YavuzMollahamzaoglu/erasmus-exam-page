# Changelog

## Unreleased - 2025-11-10

- Inserted full topic content for multiple A1/A2/B1/B2 topics in `frontend/src/pages/TopicsPage.tsx` (including A2 "Have to / Need to" modal guide).
- Fixed ESLint/TypeScript issues across several game pages:
  - `FillInTheBlanksGame.tsx`, `WordHuntGame.tsx`, `WritingGame.tsx`, `ReadingGame.tsx`, `EssayGame.tsx`.
  - Removed unused variables/imports and adjusted useEffect dependency arrays where appropriate.
- Styling adjustments to Topics page to match site theme.

Notes:
- Build passes with warnings (non-blocking). Warnings left are mostly unused variables in some pages; these can be cleaned up later if desired.
