import { Field, Int, ObjectType } from 'type-graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CutVote } from './CutVote';
import { CutReview } from './CutReview';
//import Notification from './Notification';

@ObjectType()
@Entity()
export default class User extends BaseEntity {
  @Field(() => Int, { description: '사용자ID' })
  @PrimaryGeneratedColumn()
  id!: number;

  @Field({ description: '유저 이름' })
  @Column({ comment: '유저 이름' })
  username!: string;

  @Field({ description: '유저 이메일' })
  @Column({ unique: true, comment: '유저 이메일' })
  email!: string;

  @Field({ description: '비밀번호' })
  @Column({ comment: '비밀번호' })
  password!: string;

  @Column({ comment: '프로필 사진 경로', nullable: true })
  @Field({ description: '프로필 사진 경로', nullable: true })
  profileImage: string;

  @Field(() => String, { description: '생성 일자' })
  @CreateDateColumn({ comment: '생성 일자' })
  createdAt!: Date;

  @Field(() => String, { description: '업데이트 일자' })
  @UpdateDateColumn({ comment: '업데이트 일자' })
  updatedAt!: Date;

  @OneToMany(() => CutVote, (cutVote) => cutVote.user)
  cutVotes: CutVote[];

  @OneToMany(() => CutReview, (cutReview) => cutReview.user)
  cutReviews: CutReview[];

  // @OneToMany(() => Notification, (noti) => noti.user)
  // notifications: Notification[];
}
