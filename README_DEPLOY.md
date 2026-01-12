# Deployment Guide — thedoctor

This guide explains how to deploy the three parts of the app:

- Frontend (Vite React) → Vercel
- Backend (Node/Express) → Render
- ML service (FastAPI) → Render

Pre-requisites
- Push the repository (or separate repos) to GitHub.
- Do NOT commit secrets in `.env`. Use platform environment variables.

ML service (thedoctor_ml_service) — Render
1. Ensure `artifacts/` (models) and `requirements.txt` are present in the repo.
2. In Render: New → Web Service → Connect repo → select `thedoctor_ml_service` folder.
3. Runtime: Python. Build command: `pip install -r requirements.txt`.
4. Start command: `uvicorn app:app --host 0.0.0.0 --port $PORT`.
5. Set health check path to `/health`.
6. After deploy, copy the public ML URL (e.g., `https://ml-service.onrender.com`).

Backend (backend) — Render
1. In Render: New → Web Service → Connect repo → select `backend` folder.
2. Runtime: Node. Build command: `npm install`. Start command: `npm start`.
3. Environment variables (set in Render UI):
   - `MONGO_URI` — MongoDB Atlas URI
   - `JWT_SECRET` — JWT secret
   - `ML_SERVICE_URL` — set to your ML service URL from previous step
   - `FRONTEND_URL` — your Vercel frontend URL (for CORS)
4. Health check: `/health` (backend exposes this).

Frontend (frontend) — Vercel
1. Connect your GitHub repo on Vercel and select the `frontend` folder as root.
2. Build command: `npm run build`.
3. Output directory: `dist`.
4. Add environment variable in Vercel project settings:
   - `VITE_API_BASE_URL` = `https://<your-backend>.onrender.com/api`
5. Deploy and test the UI.

End-to-end test
1. Register or login via frontend; make a prediction.
2. Verify the backend calls the ML service and a `report` is created in MongoDB.

Troubleshooting
- If Render fails with `Could not import module "main"`, ensure start command references `app:app` (this repo uses `app.py`).
- If model files are large, consider storing them in S3 and downloading at startup.

If you want, I can create `render.yaml` files or push these changes and provide exact Render/Vercel UI steps for each service.
