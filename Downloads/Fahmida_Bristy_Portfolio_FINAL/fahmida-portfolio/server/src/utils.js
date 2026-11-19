import crypto from 'node:crypto'

export class HttpError extends Error {
  constructor(status, message, fields) {
    super(message)
    this.status = status
    this.fields = fields
  }
}

export const sha256 = (value) => crypto.createHash('sha256').update(value).digest('hex')

// Find every uploaded-file record ({ url, publicId, resourceType }) anywhere inside a document.
export function collectAssets(value, found = []) {
  if (!value || typeof value !== 'object') return found
  if (Array.isArray(value)) {
    value.forEach((v) => collectAssets(v, found))
    return found
  }
  if (typeof value.publicId === 'string' && value.publicId) found.push({ publicId: value.publicId, resourceType: value.resourceType || 'image' })
  Object.values(value).forEach((v) => collectAssets(v, found))
  return found
}

// Files that were in `before` but are no longer in `after` (replaced or deleted).
export function removedAssets(before, after) {
  const keep = new Set(collectAssets(after).map((a) => a.publicId))
  return collectAssets(before).filter((a) => !keep.has(a.publicId))
}

// Plain object copy of a mongoose document (or plain value).
export const plain = (doc) => (doc && typeof doc.toObject === 'function' ? doc.toObject() : doc)
