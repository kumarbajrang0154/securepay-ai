/**
 * Utility Functions
 */

import crypto from 'crypto'

/**
 * Generate SHA256 hash
 */
export const generateHash = (data) => {
  return crypto.createHash('sha256').update(data).digest('hex')
}

/**
 * Validate email format
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validate UPI format
 */
export const isValidUPI = (upi) => {
  const upiRegex = /^[a-zA-Z0-9.\-_]+@[a-zA-Z]{3,}$/
  return upiRegex.test(upi)
}

/**
 * Format currency
 */
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount)
}

/**
 * Get IP address from request
 */
export const getIPAddress = (req) => {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.socket.remoteAddress ||
    'Unknown'
  )
}

/**
 * Sanitize input string
 */
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input
  return input.trim().replace(/[<>]/g, '')
}

export default {
  generateHash,
  isValidEmail,
  isValidUPI,
  formatCurrency,
  getIPAddress,
  sanitizeInput,
}
