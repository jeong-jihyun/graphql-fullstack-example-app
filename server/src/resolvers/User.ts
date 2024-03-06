import * as argon2 from 'argon2';
import { IsEmail, IsString } from 'class-validator';
import jwt from 'jsonwebtoken';
import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver, UseMiddleware } from 'type-graphql';
import { MyContext } from '../apollo/createApolloServer';
import { AppDataSource } from '../db/db-client';
import User from '../entities/User';
import { isAuthenticated } from '../middlewares/isAuthenticated';
import {
  REFRESH_JWT_SECRET_KEY,
  createAccessToken,
  createRefreshToken,
  setRefreshTokenHeader,
} from '../utils/jwt-auth';

@InputType()
export class SignUpInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsString()
  username!: string;

  @Field()
  @IsString()
  password!: string;
}

@InputType({ description: '로그인 인풋 데이타' })
export class LoginInput {
  @Field()
  @IsString()
  emailOrUsername!: string;

  @Field()
  @IsString()
  password!: string;
}

@ObjectType({ description: '필드에러 타입' })
class FieldError {
  @Field()
  field!: string;

  @Field()
  message!: string;
}

@ObjectType({ description: '로그인 반환 데이터' })
class LoginResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field({ nullable: true })
  accessToken?: string;
}

@ObjectType({ description: '액세스 토큰 새로고침 반환데이터' })
class RefreshAccessTokenResponse {
  @Field()
  accessToken: string;
}

@Resolver(User)
export class UserResolver {
  /**
   * 로그아웃
   * @param param0
   * @returns
   */
  @Mutation(() => Boolean)
  @UseMiddleware(isAuthenticated)
  async logout(@Ctx() { verifiedUser, res, redis }: MyContext): Promise<boolean> {
    if (verifiedUser) {
      setRefreshTokenHeader(res, '');
      await redis.del(String(verifiedUser.userId));
    }
    return true;
  }

  /**
   * 회원가입
   * @param signUpInput
   * @returns
   */
  @Mutation(() => User)
  async signUp(@Arg('signUpInput') signUpInput: SignUpInput): Promise<User> {
    const { email, username, password } = signUpInput;
    const hashedPw = await argon2.hash(password);
    const newUser = AppDataSource.getRepository(User).create({
      email,
      username,
      password: hashedPw,
    });
    // const newUser = User.create({});
    await User.insert(newUser);
    return newUser;
  }

  /**
   * 회원 로그인
   * @param loginInput
   * @param param1
   * @returns
   * @description
   * 로그인 뮤테이션으로 이동해 생성된 리프레시 토큰을 레디스 저장소에 저장하도록 구성
   */
  @Mutation(() => LoginResponse)
  public async login(
    @Arg('loginInput') loginInput: LoginInput,
    // 데코레이터를 통해 접근한 context중 redis를 비구조화 할당하도록 구성
    @Ctx() { res, redis }: MyContext,
  ): Promise<LoginResponse> {
    const { emailOrUsername, password } = loginInput;
    // id or email select
    const user = await User.findOne({
      where: [{ email: emailOrUsername }, { username: emailOrUsername }],
    });

    if (!user) {
      return {
        errors: [{ field: 'email', message: '해당하는 유저가 없습니다.' }],
      };
    }
    const isValid = await argon2.verify(user?.password, password);
    if (!isValid) {
      return {
        errors: [{ field: 'password', message: '비밀번호를 올바르게 입력해주세요' }],
      };
    }

    // 액세스 토큰 발급
    const accessToken = createAccessToken(user);
    const refreshToken = createRefreshToken(user);

    // 리프레쉬 토큰 레디스 적재
    await redis.set(String(user.id), refreshToken);

    // 쿠키로 리프레쉬 토큰 전송
    setRefreshTokenHeader(res, refreshToken);

    return { user, accessToken };
  }

  /**
   * 리플래쉬 및 토큰 재발행
   * @description
   * 로그인한 유저의 정보를 조회하는 쿼리를 구성하여 리졸버 함수 내에서 context에 어떻게 접근하는지,
   * 어떻게 context를 통해 로그인되지 않은 요청을 차단하는지 확인
   * @param ctx
   * @returns
   */
  @UseMiddleware(isAuthenticated)
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | null> {
    if (!ctx.verifiedUser) return null;
    const data = await User.findOne({ where: { id: ctx.verifiedUser.userId } });

    console.log(data);
    if (data) {
      return data;
    } else {
      return null;
    }
  }

  /**
   * 새로고침 토큰 정보
   * @param param0
   * @returns
   */
  @Mutation(() => RefreshAccessTokenResponse, { nullable: true })
  async refreshAccessToken(@Ctx() { req, redis, res }: MyContext): Promise<RefreshAccessTokenResponse | null> {
    const refreshToken = req.cookies.refreshtoken;
    console.log('refreshAccessToken >>>', refreshToken);

    if (!refreshToken) return null;

    let tokenData: any = null;
    try {
      tokenData = jwt.verify(refreshToken, REFRESH_JWT_SECRET_KEY);
    } catch (e) {
      console.error(e);
      return null;
    }

    if (!tokenData) return null;

    // 래디스 user.id로 저장된 토큰을 조회
    const storeRefreshToken = await redis.get(String(tokenData.userId));
    if (!storeRefreshToken) return null;
    if (!(storeRefreshToken === refreshToken)) return null;
    // 토큰 유저정보 조회
    const user = await User.findOne({ where: { id: tokenData.userId } });
    if (!user) return null;
    // 액세스 토큰 생성
    const newAccessToken = createAccessToken(user);
    // 리프레시 토큰 생성
    const newRefreshToken = createRefreshToken(user);
    // 리프레시 토큰 래디스 저장
    await redis.set(String(user.id), refreshToken);
    // 쿠키로 리프레시 토큰 전송
    setRefreshTokenHeader(res, newRefreshToken);
    //setRefreshTokenHeader(res, newRefreshToken);
    return { accessToken: newAccessToken };
  }
}
