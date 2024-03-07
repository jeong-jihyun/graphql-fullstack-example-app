import { Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import jwt from 'jsonwebtoken';
import User from '../entities/User';

export const DEFAULT_SECRET_KEY = 'secret-key';
// 리프레시 토큰 발급
export const REFRESH_JWT_SECRET_KEY = 'secret-key';

export interface JwtVerifiedUser {
  userId: User['id'];
}

// 엑세스 토큰 발급
// 아래와 같이 구성을 한다면, Context에 삽입이 가능한가? Request, Response 영역에 생성이 되었지만
// 값이 유실되는 현상이 발생
export const createAccessToken = (user: User): string => {
  // const userData: JwtVerifiedUser = { userId: user.id };
  // jwt의 sign메소드는 토큰을 만들어 주어 클라이언트에 발급해주는 메소드
  // payload 는 전송되는 데이터 이값에는 자신을 식별할 수 있게 해주는 유니크한 값이 삽입되어야 한다.
  // secretOrPrivateKey 토큰 값을 난해하게 생성 규칙을 가지고 있다.
  return jwt.sign(
    {
      userId: user.id,
    },
    process.env.JWT_SECRET_KEY || DEFAULT_SECRET_KEY,
    {
      expiresIn: '10m', //expiresIn: '30m', → 10s
    },
  );
};

// request header로 부터 엑세스 토큰 검증
export const verifyAccessTokenFromRequestHeaders = (headers: IncomingHttpHeaders): JwtVerifiedUser | null => {
  const { authorization } = headers;
  if (!authorization) return null;
  const accessToken = authorization?.split(' ')[1];
  try {
    return verifyAccessToken(accessToken);
  } catch {
    return null;
  }
};

// 리프레시 토큰 발급
export const createRefreshToken = (user: User): string => {
  //const userData: JwtVerifiedUser = ;
  return jwt.sign({ userId: user.id }, process.env.JWT_REFRESH_SECRET_KEY || REFRESH_JWT_SECRET_KEY, {
    expiresIn: '10s',
  });
};

// 리프레시 쿠키 발급
export const setRefreshTokenHeader = (res: Response, refreshToken: string): void => {
  res.cookie('refreshtoken', refreshToken, {
    httpOnly: true,
    secure: true, //process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
};

// 엑세스 토큰 검증
export const verifyAccessToken = (accessToken?: string): JwtVerifiedUser | null => {
  if (!accessToken) return null;
  //try {
  const verified = jwt.verify(accessToken, process.env.JWT_SECRET_KEY || DEFAULT_SECRET_KEY);
  return verified as JwtVerifiedUser;
  // } catch (err) {
  //   console.error(`access token expired: ${err}`);
  //   throw new AuthenticationError('access token expired');
  // }
};
