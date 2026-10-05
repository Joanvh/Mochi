import type { ButtonHTMLAttributes, ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'destructive'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: ButtonVariant
  fullWidth?: boolean
}

export function Button({ children, className = '', fullWidth = false, type = 'button', variant = 'primary', ...buttonProps }: ButtonProps) {
  const classes = ['button', `button--${variant}`, fullWidth ? 'button--full-width' : '', className].filter(Boolean).join(' ')
  return <button className={classes} type={type} {...buttonProps}>{children}</button>
}
