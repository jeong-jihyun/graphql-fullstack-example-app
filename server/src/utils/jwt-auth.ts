import { verifyAccessToken } from '../apollo/createApolloServer';
import User from '../entities/User';
import jwt from 'jsonwebtoken';
import { IncomingHttpHeaders } from 'http';
import { Response } from 'express';

export const DEFAULT_SECRET_KEY = 'secret-key';
export const REFRESH_JWT_SECRET_KEY = 'secret-key2';

export interface JwtVerifiedUser {
  userId: User['id'];
}

// 엑세스 토큰 발급
export const createAccessToken = (user: User): string => {
  const userData: JwtVerifiedUser = { userId: user.id };
  return jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET_KEY || DEFAULT_SECRET_KEY,
    {
      expiresIn: '30m',
    },
  );
};

// request header로 부터 엑세스 토큰 검증
export const verifyAccessTokenFromRequestHeaders = (headers: IncomingHttpHeaders): JwtVerifiedUser | null => {
  const { authorization } = headers;
  if (authorization) return null;
  const accessToken = authorization?.split(' ')[1];
  try {
    return verifyAccessToken(accessToken);
  } catch {
    return null;
  }
};

// 리프레시 토큰 발급
export const createRefreshToken = (user: User): string => {
  const userData: JwtVerifiedUser = { userId: user.id };
  return jwt.sign(userData, process.env.JWT_REFRESH_SECRET_KEY || REFRESH_JWT_SECRET_KEY, { expiresIn: '14d' });
};

export const setRefreshTokenHeader = (res: Response, refreshToken: string): void => {
  res.cookie('refreshtoken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
};
