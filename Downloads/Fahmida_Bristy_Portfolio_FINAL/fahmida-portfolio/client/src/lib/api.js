/* API client — one place that talks to the server. Errors carry the server's message and per-field messages. */

export class ApiError extends Error {
  constructor(status, message, fields) {
    super(message)
    this.status = status
    this.fields = fields || {}
  }
}

async function request(method, path, body) {
  const isForm = body instanceof FormData
  let res
  try {
    res = await fetch(`/api${path}`, {
      method,
      credentials: 'include',
      headers: body && !isForm ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? (isForm ? body : JSON.stringify(body)) : undefined,
    })
  } catch {
    throw new ApiError(0, 'Cannot reach the server. Check your connection and try again.')
  }
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new ApiError(res.status, data.error || 'Something went wrong', data.fields)
  return data
}

export const api = {
  get: (p) => request('GET', p),
  post: (p, b) => request('POST', p, b ?? {}),
  put: (p, b) => request('PUT', p, b ?? {}),
  patch: (p, b) => request('PATCH', p, b ?? {}),
  del: (p) => request('DELETE', p),
  upload: (file, { kind = 'image', folder = 'misc' } = {}) => {
    const f = new FormData()
    f.append('kind', kind)
    f.append('folder', folder)
    f.append('file', file)
    return request('POST', '/admin/upload', f)
  },
}
