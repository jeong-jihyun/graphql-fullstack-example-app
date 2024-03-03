import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

@ObjectType()
@Entity()
class User {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field({ description: '사용자명' })
  @Column({ unique: true, comment: '사용자명' })
  username!: string;

  @Field({ description: '이메일' })
  @Column({ unique: true, comment: '이메일' })
  email!: string;

  @Column({ comment: '비밀번호' })
  password!: string;

  @Field(() => String, { description: '생성일자' })
  @CreateDateColumn({ comment: '생성일자' })
  createdAt!: Date;

  @Field(() => String, { description: '갱신일자' })
  @UpdateDateColumn({ comment: '갱신일자' })
  updatedAt!: Date;
}
export default User;
