/**
 * Authentication Middleware
 * Verify JWT tokens and protect routes
 */

import jwt from 'jsonwebtoken'
import { config } from '../config/constants.js'

export const authMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]

    if (!token) {
      return res.status(401).json({ error: 'No token provided' })
    }

    const decoded = jwt.verify(token, config.jwtSecret)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

/**
 * Role-based Authorization
 */
export const requireRole = (role) => {
  return (req, res, next) => {
    if (req.user?.role !== role) {
      return res.status(403).json({ error: 'Insufficient permissions' })
    }
    next()
  }
}

/**
 * Rate Limiting Middleware (simple)
 */
const requestCounts = new Map()

export const rateLimitMiddleware = (limit = 100, window = 15 * 60 * 1000) => {
  return (req, res, next) => {
    const key = req.ip
    const now = Date.now()

    if (!requestCounts.has(key)) {
      requestCounts.set(key, [])
    }

    let requests = requestCounts.get(key)
    requests = requests.filter(timestamp => now - timestamp < window)

    if (requests.length >= limit) {
      return res.status(429).json({ error: 'Too many requests' })
    }

    requests.push(now)
    requestCounts.set(key, requests)
    next()
  }
}

export default {
  authMiddleware,
  requireRole,
  rateLimitMiddleware,
}
