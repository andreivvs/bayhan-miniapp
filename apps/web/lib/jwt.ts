import jwt from 'jsonwebtoken'
const JWT_SECRET = process.env.JWT_SECRET!
export function sign(payload: object, expiresIn = '15m') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn })
}
export function verify<T = any>(token: string): T {
  return jwt.verify(token, JWT_SECRET) as T
}
