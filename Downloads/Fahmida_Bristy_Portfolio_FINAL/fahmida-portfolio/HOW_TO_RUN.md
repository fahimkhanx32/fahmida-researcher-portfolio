# How to run the project (client + server)

Your `.env` is already filled in at `server/.env` (database, dashboard login, secret).

## 1. One-time setup
1. Install **Node.js 20 or newer** from https://nodejs.org (check with `node -v`).
2. Unzip, then open a terminal **inside the `fahmida-portfolio` folder**.
3. Run:  `npm run install:all`

## 2. MongoDB Atlas (one-time)
Atlas > **Network Access** > **Add IP Address** > "Add current IP address" (or `0.0.0.0/0` while testing). Without this the server cannot connect.

## 3. Start BOTH client and server together
    npm run dev

Wait for `API ready on http://localhost:5000`.

| What | Address |
|---|---|
| Website (client) | http://localhost:5173 |
| Login | http://localhost:5173/login |
| Dashboard | http://localhost:5173/admin |

**Dashboard login:** username `bristy@demo.com`, password `Bristy123` (from `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `server/.env`). The account is created the first time the server starts.

**Change your username and password any time:** Dashboard > **Account & password**. The username can be an email, a user id or any name (3-60 characters). Changing the username or email asks for your current password. The optional email is where password-reset links are sent. After the first start, `.env` no longer controls the login; the dashboard does.

## Run them separately (optional)
    npm --prefix server run dev      # API on :5000
    npm --prefix client run dev      # website on :5173  (open a second terminal)

## Using the dashboard
- **Sections & menu**: show/hide sections, drag to reorder, rename headings.
- **Profile & hero, About, Contact & links**: edit, then press **Save changes**.
- **Research, Publications, Projects, Experience, Education, Achievements**: add, edit, hide (eye icon), delete, reorder.
- **Messages**: contact-form inbox. **Account & password**: change password.
- Uploads (photo, CV, images) need the three `CLOUDINARY_*` lines in `server/.env`; until then paste a link instead.

## Put it online (one server)
    npm run build
    npm start
In `server/.env` set `NODE_ENV=production`, and `CLIENT_ORIGIN` / `PUBLIC_SITE_URL` to your real https address; add the same values in your host (Render, Railway, VPS).

## Problems
- **Could not connect to MongoDB**: your IP is not allowed in Atlas (step 2), or the password in `MONGODB_URI` is wrong.
- **Port already in use**: change `PORT` in `server/.env`.
- **Login says incorrect**: the account is only created on the first start; changing `ADMIN_EMAIL` / `ADMIN_PASSWORD` in `.env` later does not change an existing account. Use Account & password in the dashboard, or "Forgot password" (needs an email saved on the account and SMTP set up; otherwise the reset link is printed in the server terminal).

## Keep private
`server/.env` contains your database password and secrets. Do not upload it to GitHub or send it to anyone (it is already in `.gitignore`).
