# SETU Portal (frontend)
1. `npm install`
2. `npm run dev` — API base is already set to https://paimana-h7e4.onrender.com in `.env`.
   To point elsewhere, edit `.env` (`VITE_API_BASE_URL`).
3. `npm run build` for a production build in `dist/`.

## Roles
- **Ministry Official** — real backend auth (register/login). Projects, Sectors, Ministries, Prediction,
  AI Assistant and Mitigation call the live API. New projects/ministries/sectors you add are saved to the database
  and shown alongside a set of sample PAIMANA-style projects (marked with a "saved" tag when they're real).
- **Field Engineer** and **Administrator** — placeholder logins (any details work). Their screens
  (video/questionnaire submission, user approval, assignments) are frontend-only until the backend adds
  roles, ministry linkage and video storage.

## Notes
- Sample project/ministry data lives in `src/data.js`.
- `src/pages/Prediction.jsx` reads both the raw pass-through shape from `POST /risk/generate`
  ({predictions, project_data}) and the stored `RiskScoreDTO` shape from `GET /risk/latest`.
- CORS on the backend must allow the origin you deploy this to.
