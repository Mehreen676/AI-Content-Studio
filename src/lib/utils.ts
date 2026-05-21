import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date))
}

export function generateInvoiceNumber(): string {
  const prefix = 'INV'
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `${prefix}-${timestamp}-${random}`
}

export const EXPENSE_CATEGORIES = [
  { value: 'office', label: 'Office Supplies', color: '#6366f1' },
  { value: 'travel', label: 'Travel', color: '#f59e0b' },
  { value: 'food', label: 'Food & Dining', color: '#ef4444' },
  { value: 'software', label: 'Software & Tools', color: '#8b5cf6' },
  { value: 'marketing', label: 'Marketing', color: '#ec4899' },
  { value: 'utilities', label: 'Utilities', color: '#14b8a6' },
  { value: 'salary', label: 'Salary & Wages', color: '#f97316' },
  { value: 'other', label: 'Other', color: '#64748b' },
] as const

export const INVOICE_STATUSES = [
  { value: 'draft', label: 'Draft', color: '#64748b' },
  { value: 'sent', label: 'Sent', color: '#3b82f6' },
  { value: 'paid', label: 'Paid', color: '#22c55e' },
  { value: 'overdue', label: 'Overdue', color: '#ef4444' },
  { value: 'cancelled', label: 'Cancelled', color: '#94a3b8' },
] as const

export function getStatusInfo(status: string) {
  return INVOICE_STATUSES.find(s => s.value === status) || INVOICE_STATUSES[0]
}

export function getCategoryInfo(category: string) {
  return EXPENSE_CATEGORIES.find(c => c.value === category) || EXPENSE_CATEGORIES[7]
}
