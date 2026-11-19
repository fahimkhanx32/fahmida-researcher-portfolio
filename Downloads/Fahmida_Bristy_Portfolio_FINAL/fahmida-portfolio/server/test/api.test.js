process.env.NODE_ENV = 'test'
process.env.MONGODB_URI = process.env.TEST_MONGODB_URI || 'mongodb://127.0.0.1:27017/fahmida_test'
if (!/_test(\?|$)/.test(process.env.MONGODB_URI)) throw new Error('TEST_MONGODB_URI must point to a database whose name ends in _test (the tests wipe it)')
process.env.JWT_SECRET = 'x'.repeat(48)
process.env.ADMIN_EMAIL = 'owner@example.com'
process.env.ADMIN_PASSWORD = 'Sup3rSecret99'
process.env.CLIENT_DIST = '/nonexistent'

import test, { before, after } from 'node:test'
import assert from 'node:assert/strict'
import request from 'supertest'
const { connectDb, disconnectDb } = await import('../src/db.js')
const { createApp } = await import('../src/app.js')
const { ensureAdmin, ensureContent } = await import('../src/services.js')
const mongoose = (await import('mongoose')).default

const sent = []
const destroyed = []
const uploader = {
  configured: () => true,
  upload: async (_b, { folder, kind, filename }) => ({ url: `https://res.cloudinary.com/x/${folder}/${filename}`, publicId: `${folder}/${filename}`, resourceType: kind === 'pdf' ? 'raw' : 'image', name: filename }),
  destroy: async (a) => { destroyed.push(...a) },
}
const mailer = { send: async (m) => { sent.push(m) } }
let app, agent
const png = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(32)])

before(async () => {
  await connectDb(process.env.MONGODB_URI)
  await mongoose.connection.dropDatabase()
  await ensureContent()
  await ensureAdmin({ info() {}, warn() {} })
  app = createApp({ uploader, mailer, limits: { login: 1000, contact: 1000, forgot: 1000 } })
  agent = request.agent(app)
})
after(async () => { await mongoose.connection.dropDatabase(); await disconnectDb() })

const login = (a = agent, password = 'Sup3rSecret99') => a.post('/api/auth/login').send({ email: 'owner@example.com', password, remember: true })

test('public site returns defaults', async () => {
  const r = await request(app).get('/api/site').expect(200)
  assert.equal(r.body.research.length, 6)
  assert.equal(r.body.education.length, 3)
  assert.ok(r.body.settings.sections.length >= 10)
})

test('admin routes need auth', async () => {
  await request(app).get('/api/admin/settings').expect(401)
  await request(app).post('/api/admin/projects').send({}).expect(401)
})

test('login rejects bad credentials, accepts good ones', async () => {
  await login(request(app), 'wrong-password').expect(401)
  await request(app).post('/api/auth/login').send({ email: 'nobody@example.com', password: 'whatever1234' }).expect(401)
  const r = await login().expect(200)
  assert.equal(r.body.admin.email, 'owner@example.com')
  assert.equal(r.body.admin.passwordHash, undefined)
  assert.match(r.headers['set-cookie'][0], /HttpOnly/i)
  await agent.get('/api/auth/me').expect(200)
})

test('cross-origin writes are refused', async () => {
  await agent.put('/api/admin/settings').set('Origin', 'https://evil.example').send({ navCta: { label: 'x', target: 'contact' } }).expect(403)
})

test('settings: hiding a section and renaming heading shows on public site', async () => {
  const cur = (await agent.get('/api/admin/settings').expect(200)).body
  const sections = cur.sections.map((s) => (s.key === 'projects' ? { ...s, visible: false } : s))
  await agent.put('/api/admin/settings').send({ sections }).expect(200)
  const pub = (await request(app).get('/api/site')).body
  assert.equal(pub.settings.sections.find((s) => s.key === 'projects').visible, false)
  // home may never be hidden
  await agent.put('/api/admin/settings').send({ sections: cur.sections.map((s) => (s.key === 'home' ? { ...s, visible: false } : s)) }).expect(400)
})

test('CRUD, reorder and visibility on projects', async () => {
  const a = (await agent.post('/api/admin/projects').send({ title: 'Alpha', overview: 'First project', status: 'ongoing' }).expect(201)).body
  const b = (await agent.post('/api/admin/projects').send({ title: 'Beta', overview: 'Second project', status: 'completed' }).expect(201)).body
  await agent.post('/api/admin/projects').send({ title: '' }).expect(400)
  await agent.post('/api/admin/publications').send({ title: 'Bad link', url: 'javascript:alert(1)' }).expect(400)
  await agent.post('/api/admin/publications').send({ title: 'Good link', url: 'https://doi.org/10.1/x' }).expect(201)
  const re = await agent.patch('/api/admin/projects/reorder').send({ ids: [b.id, a.id] }).expect(200)
  assert.deepEqual(re.body.map((p) => p.title), ['Beta', 'Alpha'])
  await agent.patch(`/api/admin/projects/${a.id}/visibility`).send({ visible: false }).expect(200)
  const pub = (await request(app).get('/api/site')).body
  assert.deepEqual(pub.projects.map((p) => p.title), ['Beta'])
  await agent.put(`/api/admin/projects/${b.id}`).send({ title: 'Beta 2' }).expect(200)
  await agent.get('/api/admin/projects/notanid').expect(404)
  await agent.delete(`/api/admin/projects/${a.id}`).expect(200)
  await agent.get(`/api/admin/projects/${a.id}`).expect(404)
})

test('experience and education are separated by kind', async () => {
  const e = (await agent.post('/api/admin/experience').send({ title: 'Lecturer', organization: 'Uni', period: '2024 - Present' }).expect(201)).body
  assert.equal(e.kind, 'experience')
  const list = (await agent.get('/api/admin/education')).body
  assert.ok(list.every((x) => x.kind === 'education'))
  await agent.get(`/api/admin/education/${e.id}`).expect(404)
})

test('upload checks real file type and replaced assets are removed', async () => {
  await agent.post('/api/admin/upload').field('kind', 'image').attach('file', Buffer.from('not an image at all'), 'x.png').expect(400)
  const up = (await agent.post('/api/admin/upload').field('kind', 'image').field('folder', 'profile').attach('file', png, 'me.png').expect(201)).body
  assert.equal(up.resourceType, 'image')
  await agent.put('/api/admin/settings').send({ profile: { ...(await agent.get('/api/admin/settings')).body.profile, photo: { ...up, alt: 'me' } } }).expect(200)
  destroyed.length = 0
  const cur = (await agent.get('/api/admin/settings')).body
  await agent.put('/api/admin/settings').send({ profile: { ...cur.profile, photo: null } }).expect(200)
  assert.equal(destroyed.length, 1)
})

test('contact form: validation, honeypot, saved, notified, toggle', async () => {
  const body = { name: 'Reader', email: 'reader@example.com', subject: 'Hello', message: 'I would like to collaborate.' }
  await request(app).post('/api/contact').send({ ...body, email: 'bad' }).expect(400)
  await request(app).post('/api/contact').send({ ...body, website: 'http://spam' }).expect(201)
  assert.equal((await agent.get('/api/admin/messages')).body.length, 0)
  await request(app).post('/api/contact').send(body).expect(201)
  const msgs = (await agent.get('/api/admin/messages')).body
  assert.equal(msgs.length, 1)
  assert.equal(msgs[0].status, 'new')
  await new Promise((r) => setTimeout(r, 50))
  assert.ok(sent.some((m) => m.replyTo === 'reader@example.com'))
  const st = (await agent.get('/api/admin/stats')).body
  assert.equal(st.unreadMessages, 1)
  assert.equal(st.messagesPerDay.length, 14)
  await agent.patch(`/api/admin/messages/${msgs[0].id}`).send({ status: 'read' }).expect(200)
  const cur = (await agent.get('/api/admin/settings')).body
  await agent.put('/api/admin/settings').send({ contact: { ...cur.contact, formEnabled: false } }).expect(200)
  await request(app).post('/api/contact').send(body).expect(403)
})

test('password reset flow and token invalidation', async () => {
  sent.length = 0
  const r1 = await request(app).post('/api/auth/forgot').send({ email: 'nobody@example.com' }).expect(200)
  const r2 = await request(app).post('/api/auth/forgot').send({ email: 'owner@example.com' }).expect(200)
  assert.equal(r1.body.message, r2.body.message)
  assert.equal(sent.length, 1)
  const token = /token=([a-f0-9]+)/.exec(sent[0].text)[1]
  await request(app).post('/api/auth/reset').send({ token: 'f'.repeat(64), email: 'owner@example.com', password: 'NewPassw0rd!!' }).expect(400)
  await request(app).post('/api/auth/reset').send({ token, email: 'owner@example.com', password: 'short' }).expect(400)
  await request(app).post('/api/auth/reset').send({ token, email: 'owner@example.com', password: 'NewPassw0rd!!' }).expect(200)
  await request(app).post('/api/auth/reset').send({ token, email: 'owner@example.com', password: 'Another0ne!!' }).expect(400) // single use
  await agent.get('/api/auth/me').expect(401) // old session is dead
  await login(request(app)).expect(401)
  await login(request(app), 'NewPassw0rd!!').expect(200)
})

test('change password signs out other devices but not this one', async () => {
  const a = request.agent(app), b = request.agent(app)
  await login(a, 'NewPassw0rd!!').expect(200)
  await login(b, 'NewPassw0rd!!').expect(200)
  await a.post('/api/auth/change-password').send({ currentPassword: 'bad', newPassword: 'Third0ne!!!!' }).expect(400)
  await a.post('/api/auth/change-password').send({ currentPassword: 'NewPassw0rd!!', newPassword: 'Third0ne!!!!' }).expect(200)
  await a.get('/api/auth/me').expect(200)
  await b.get('/api/auth/me').expect(401)
  await a.post('/api/auth/logout').expect(200)
  await a.get('/api/auth/me').expect(401)
})

test('owner can change username and email (needs current password) and then log in with the new name', async () => {
  const a = request.agent(app)
  await a.post('/api/auth/login').send({ username: 'owner@example.com', password: 'Third0ne!!!!' }).expect(200)
  // renaming only the display name needs no password
  await a.put('/api/admin/account').send({ name: 'Dr. Test' }).expect(200)
  // changing the login name does
  await a.put('/api/admin/account').send({ name: 'Dr. Test', username: 'bristy' }).expect(400)
  await a.put('/api/admin/account').send({ name: 'Dr. Test', username: 'bristy', currentPassword: 'wrong' }).expect(400)
  await a.put('/api/admin/account').send({ name: 'Dr. Test', username: 'ab', currentPassword: 'Third0ne!!!!' }).expect(400) // too short
  const ok = await a.put('/api/admin/account').send({ name: 'Dr. Test', username: 'Bristy', email: 'new@example.com', currentPassword: 'Third0ne!!!!' }).expect(200)
  assert.equal(ok.body.admin.username, 'bristy')
  assert.equal(ok.body.admin.email, 'new@example.com')
  await a.get('/api/auth/me').expect(200) // still signed in
  await request(app).post('/api/auth/login').send({ username: 'bristy', password: 'Third0ne!!!!' }).expect(200)
  await request(app).post('/api/auth/login').send({ username: 'new@example.com', password: 'Third0ne!!!!' }).expect(200) // the saved e-mail works too
  await request(app).post('/api/auth/login').send({ username: 'owner@example.com', password: 'Third0ne!!!!' }).expect(401) // the old name is gone
  // reset link goes to the saved e-mail and works with the username
  sent.length = 0
  await request(app).post('/api/auth/forgot').send({ username: 'bristy' }).expect(200)
  assert.equal(sent[0].to, 'new@example.com')
  const token = /token=([a-f0-9]+)&username=bristy/.exec(sent[0].text)[1]
  await request(app).post('/api/auth/reset').send({ token, username: 'bristy', password: 'Fourth0ne!!!' }).expect(200)
  // an e-mail can be removed; the username still works
  const b = request.agent(app)
  await b.post('/api/auth/login').send({ username: 'bristy', password: 'Fourth0ne!!!' }).expect(200)
  const gone = await b.put('/api/admin/account').send({ name: 'Dr. Test', email: '', currentPassword: 'Fourth0ne!!!' }).expect(200)
  assert.equal(gone.body.admin.email, undefined)
})

test('unknown api route is JSON 404; health works', async () => {
  const r = await request(app).get('/api/nope').expect(404)
  assert.ok(r.body.error)
  assert.equal((await request(app).get('/api/health')).body.db, 'connected')
})
