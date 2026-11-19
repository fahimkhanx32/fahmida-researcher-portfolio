/* eslint-disable react-refresh/only-export-components */
import { useId, useRef, useState } from 'react'
import {
  Autocomplete, Chip, FormControlLabel, IconButton, InputAdornment, MenuItem, Switch, TextField,
} from '@mui/material'
import { LuEye, LuEyeOff, LuFileText, LuLoaderCircle, LuTrash2, LuUpload } from 'react-icons/lu'
import { api } from '../lib/api'

/* =====================================================================================
   FORM KIT — every form on the site (contact, login, reset, and the whole dashboard) is built from these
   Material UI controls: outlined, floating label, with an icon at the start.
     <Field>        text / email / number / multiline / select (pass `options`) / password (type="password")
     <ChipsField>   a list of short strings (authors, keywords, topics) — type and press Enter
     <SwitchField>  an on/off setting
     <UploadField>  Cloudinary upload for an image or a PDF
   `pill` gives the login screens' black rounded-pill look.
   ===================================================================================== */

const pillSx = {
  '& .MuiOutlinedInput-root': {
    borderRadius: '999px',
    fontFamily: 'inherit',
    color: '#000',
    paddingLeft: '8px',
    '& fieldset': { borderColor: 'rgba(0,0,0,.35)', borderWidth: 2 },
    '&:hover fieldset': { borderColor: 'rgba(0,0,0,.65)' },
    '&.Mui-focused fieldset': { borderColor: '#000' },
    '& input::placeholder': { color: 'rgba(0,0,0,.55)', opacity: 1 },
    '& .MuiInputAdornment-root, & .MuiSvgIcon-root': { color: '#000' },
  },
  '& .MuiInputLabel-root': { fontFamily: 'inherit', color: '#000', fontWeight: 500, '&.Mui-focused': { color: '#000' } },
}

const iconAdornment = (Icon, pill, multiline) =>
  Icon && (
    <InputAdornment position="start" sx={{ color: pill ? '#000' : 'text.secondary', mr: pill ? 0.5 : 1, ...(multiline && { alignSelf: 'flex-start', mt: '12px', height: 'auto', maxHeight: 'none' }) }}>
      <Icon size={18} aria-hidden="true" />
    </InputAdornment>
  )

export function Field({ icon, label, options, type = 'text', pill = false, error, helperText, sx, slotProps, children, ...rest }) {
  const [show, setShow] = useState(false)
  const isPassword = type === 'password'
  const select = Array.isArray(options)

  const endAdornment = isPassword ? (
    <InputAdornment position="end">
      <IconButton
        size="small"
        edge="end"
        onClick={() => setShow((v) => !v)}
        aria-label={show ? 'Hide password' : 'Show password'}
        aria-pressed={show}
        sx={pill ? { color: '#000' } : undefined}
      >
        {show ? <LuEye size={20} /> : <LuEyeOff size={20} />}
      </IconButton>
    </InputAdornment>
  ) : undefined

  return (
    <TextField
      fullWidth
      variant="outlined"
      label={label}
      type={isPassword ? (show ? 'text' : 'password') : type}
      select={select}
      error={Boolean(error)}
      helperText={error || helperText}
      sx={[pill && pillSx, sx].filter(Boolean)}
      slotProps={{
        ...slotProps,
        input: { startAdornment: iconAdornment(icon, pill, rest.multiline), endAdornment, ...(slotProps?.input || {}) },
        inputLabel: { ...(rest.type === 'date' || rest.placeholder ? { shrink: true } : {}), ...(slotProps?.inputLabel || {}) },
      }}
      {...rest}
    >
      {select
        ? options.map((o) => {
            const opt = typeof o === 'string' ? { value: o, label: o } : o
            return <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          })
        : children}
    </TextField>
  )
}

// Press Enter (or comma) to add an item; Backspace removes the last one.
export function ChipsField({ icon, label, value = [], onChange, helperText, placeholder = 'Type and press Enter' }) {
  return (
    <Autocomplete
      multiple
      freeSolo
      options={[]}
      value={value}
      onChange={(_, v) => onChange(v.map((x) => String(x).trim()).filter(Boolean))}
      renderTags={(tags, getProps) =>
        tags.map((t, i) => {
          const { key, ...p } = getProps({ index: i })
          return <Chip key={key} size="small" label={t} {...p} />
        })
      }
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          placeholder={value.length ? '' : placeholder}
          helperText={helperText}
          slotProps={{ ...params.slotProps, input: { ...params.slotProps?.input, startAdornment: (<>{iconAdornment(icon)}{params.slotProps?.input?.startAdornment}</>) } }}
        />
      )}
      onInputChange={(e, text) => {
        // typing a comma commits the item, so "a, b" pastes into two chips
        if (text.includes(',')) {
          const parts = text.split(',').map((s) => s.trim()).filter(Boolean)
          if (parts.length) onChange([...value, ...parts])
        }
      }}
    />
  )
}

export function SwitchField({ label, checked, onChange, hint }) {
  return (
    <div>
      <FormControlLabel control={<Switch checked={!!checked} onChange={(e) => onChange(e.target.checked)} />} label={label} />
      {hint && <p className="ml-1 text-xs text-muted">{hint}</p>}
    </div>
  )
}

/* Uploads to Cloudinary through the API and hands back the stored asset `{ url, publicId, resourceType, name, alt }`.
   Without Cloudinary keys, paste a link to an already-hosted file in the box instead. */
export function UploadField({ label, value, onChange, kind = 'image', folder = 'misc', onError, aspect = 'aspect-[4/3]' }) {
  const input = useRef(null)
  const [busy, setBusy] = useState(false)
  const id = useId()
  const accept = kind === 'pdf' ? 'application/pdf' : 'image/jpeg,image/png,image/webp'

  const pick = async (e) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    setBusy(true)
    try {
      const asset = await api.upload(file, { kind, folder })
      onChange({ ...asset, alt: value?.alt || '' })
    } catch (err) {
      onError?.(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="rounded-xl border border-line p-3">
      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">{label}</p>
      <div className="flex flex-wrap items-center gap-3">
        {value?.url && kind === 'image' && <img src={value.url} alt="" className={`${aspect} h-24 rounded-lg object-cover`} />}
        {value?.url && kind === 'pdf' && (
          <a href={value.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-ink underline">
            <LuFileText aria-hidden="true" /> {value.name || 'View PDF'}
          </a>
        )}
        <input ref={input} id={id} type="file" accept={accept} onChange={pick} className="sr-only" />
        <button
          type="button"
          onClick={() => input.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-line px-4 py-2 text-sm font-medium text-ink transition hover:border-gold disabled:opacity-60"
        >
          {busy ? <LuLoaderCircle className="animate-spin" aria-hidden="true" /> : <LuUpload aria-hidden="true" />}
          {value?.url ? 'Replace' : kind === 'pdf' ? 'Upload PDF' : 'Upload image'}
        </button>
        {value?.url && (
          <button type="button" onClick={() => onChange(null)} className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-ink">
            <LuTrash2 aria-hidden="true" /> Remove
          </button>
        )}
      </div>
      <div className="mt-3">
        <Field
          size="small"
          label={kind === 'pdf' ? 'Or paste a link to the PDF' : 'Or paste an image link'}
          value={value?.url || ''}
          onChange={(e) => {
            const url = e.target.value.trim()
            onChange(url ? { url, publicId: '', resourceType: kind === 'pdf' ? 'raw' : 'image', name: value?.name || '', alt: value?.alt || '' } : null)
          }}
        />
      </div>
      {kind === 'image' && value?.url && (
        <div className="mt-3">
          <Field size="small" label="Image description (for screen readers)" value={value.alt || ''} onChange={(e) => onChange({ ...value, alt: e.target.value })} />
        </div>
      )}
    </div>
  )
}

// Server-side field errors arrive as { field: message }; this reads one safely.
export const fieldError = (errors, name) => errors?.[name]
