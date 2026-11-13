const base =
  'inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60'

const variants = {
  primary: 'bg-primary text-on-primary shadow-card hover:-translate-y-0.5 hover:shadow-lift hover:brightness-110',
  secondary: 'border border-line bg-surface text-ink hover:-translate-y-0.5 hover:border-gold hover:shadow-card',
  ghost: 'text-ink hover:bg-sage/70',
}
const sizes = { sm: 'px-4 py-2 text-sm', md: 'px-5 py-2.5 text-sm', lg: 'px-6 py-3 text-[0.95rem]' }

// Renders an <a> when `href` is supplied, otherwise a <button>.
export default function Button({ href, variant = 'primary', size = 'md', className = '', children, ...rest }) {
  const classes = `${base} ${variants[variant]} ${sizes[size]} ${className}`
  if (href) {
    return (
      <a href={href} className={classes} {...rest}>
        {children}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...rest}>
      {children}
    </button>
  )
}
