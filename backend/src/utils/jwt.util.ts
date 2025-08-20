import jwt, { Secret } from 'jsonwebtoken';

export function signToken(payload: object) {
  return jwt.sign(payload, (process.env.JWT_SECRET || 'secret') as Secret, { expiresIn: '1h' });
}

export function verifyToken(token: string) {
  return jwt.verify(token, process.env.JWT_SECRET || 'secret');
}
