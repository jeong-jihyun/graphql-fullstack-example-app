import { Arg, Ctx, Field, InputType, Mutation, ObjectType, Query, Resolver } from 'type-graphql';
import User from '../entities/User';
import { IsEmail, IsString } from 'class-validator';
import * as argon2 from 'argon2';
import { AppDataSource } from '../db/db-client';
import { createAccessToken, createRefreshToken, setRefreshTokenHeader } from '../utils/jwt-auth';
import { MyContext } from '../apollo/createApolloServer';

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

@Resolver(User)
export class UserResolver {
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
    await AppDataSource.getRepository(User).insert(newUser);
    return newUser;
  }

  @Mutation(() => LoginResponse)
  public async login(@Arg('loginInput') loginInput: LoginInput, @Ctx() { res }: MyContext): Promise<LoginResponse> {
    const { emailOrUsername, password } = loginInput;
    // id Or email select
    const user = await AppDataSource.getRepository(User).findOne({
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

    setRefreshTokenHeader(res, refreshToken);
    return { user, accessToken };
  }
  /**
   * 로그인한 유저의 정보를 조회하는 쿼리를 구성하여 리졸버 함수 내에서 context에 어떻게 접근하는지,
   * 어떻게 context를 통해 로그인되지 않은 요청을 차단하는지 확인
   * @param ctx
   * @returns
   */
  @Query(() => User, { nullable: true })
  async me(@Ctx() ctx: MyContext): Promise<User | undefined> {
    console.log('ctx.verifiedUser >>>>', ctx.verifiedUser);
    if (!ctx.verifiedUser) {
      return undefined;
    } else {
      console.log('ctx.verifiedUser.userId >>>', ctx.verifiedUser.userId);
      const data = await AppDataSource.getRepository(User).findOne({ where: { id: ctx.verifiedUser.userId } });
      if (data) {
        return data;
      }
    }
  }
}
