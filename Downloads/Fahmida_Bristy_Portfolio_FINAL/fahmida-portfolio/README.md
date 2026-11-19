# Dr. Fahmida Bristy — Portfolio (MERN)

> Quick start: see **HOW_TO_RUN.md**. `server/.env` is already filled in.

A React website, an Express + MongoDB API, and an owner dashboard. **Every section of the website is controlled from the dashboard** (`/admin`): profile and hero, about, section order/visibility/headings, the top menu, research, publications, projects, experience, education, achievements, contact details, profile links, footer, and the contact-form inbox.

```
client/   React 19 + Vite + Tailwind (site) + Material UI (all forms) + Framer Motion (animations)
server/   Express 5 + Mongoose 7 + JWT cookie login + Cloudinary uploads + tests
```

## 1. Set up (about 10 minutes)

Requires Node 20+.

```bash
npm run install:all
cp server/.env.example server/.env      # then edit server/.env (see below)
```

Fill in `server/.env`:

| Setting | What to put |
|---|---|
| `MONGODB_URI` | Your Atlas string with the **real password** replacing `<db_password>`. If the password has `@ : / ? # %`, URL-encode it (`@` → `%40`). |
| `JWT_SECRET` | 32+ random characters: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Your dashboard login (password: 10+ characters, letters and a number). Created on first start; delete `ADMIN_PASSWORD` afterwards. |
| `CLOUDINARY_*` | Cloud name, API key and secret from your Cloudinary dashboard (photo, CV, images). |
| `SMTP_*`, `NOTIFY_EMAIL` | Optional. Without SMTP, reset links and "new message" alerts print in the server console. |

**Atlas:** in *Network Access*, allow your IP address (or `0.0.0.0/0` while testing). The database `fahmida_portfolio` is created automatically; the first start fills it with the content already on the site (research areas, education, experience) so nothing starts empty.

## 2. Run

```bash
npm run dev        # API on :5000, website on http://localhost:5173
```

Open `http://localhost:5173/login`, sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD`, and you land on the dashboard.

## 3. Deploy as one server

```bash
npm run build      # builds client/dist
NODE_ENV=production npm start
```

In production the Express server also serves the built website, so the site, API and dashboard share one origin. Set `NODE_ENV=production`, `CLIENT_ORIGIN` and `PUBLIC_SITE_URL` to your real address (https), and all `.env` values on your host (Render, Railway, a VPS…). Works behind a proxy (`trust proxy` is on in production).

## How the dashboard works

* **Sections & menu** — switch sections on/off, drag to reorder, rename headings/intro text, choose what is in the menu and under “More”. “Home” always stays first.
* **Content lists** — add / edit / delete / hide (eye) / reorder (drag or arrows). Hidden entries stay saved but do not show.
* **Unsaved changes bar** appears on settings pages; nothing changes on the site until you press Save.
* **Messages** — everything sent through the contact form, with unread count, archive, reply by e-mail.
* **Uploads** — images and PDFs go to Cloudinary (type is checked from the file itself). Replaced or deleted files are removed from Cloudinary. No Cloudinary keys? Paste a link instead.
* **Account** — change your username (an email, a user id, anything), the optional reset email, the display name and the password at any time; changing the password signs out other devices. “Forgot password” e-mails a 30-minute single-use link (or prints it in the server console if no email/SMTP is set).

## Security notes

httpOnly session cookie, bcrypt passwords, rate-limited login/reset/contact, same-origin check on writes, helmet CSP, http(s)-only links, honeypot on the contact form, no account-existence leaks on login/forgot.

## Tests

```bash
TEST_MONGODB_URI=mongodb://127.0.0.1:27017/fahmida_test npm test
```
The API tests (login, reset, CRUD, reorder, visibility, uploads, contact form) run against a real MongoDB. The database name must end in `_test` because the tests wipe it.

## Notes

* Mongoose 7 is used (works with every current Atlas version).
* The Research section still shows a small “suggested, not confirmed” note in the code (`client/src/components/Research.jsx`); remove it when the research areas are final.
