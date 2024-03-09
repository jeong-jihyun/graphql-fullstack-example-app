import { Field, Int, ObjectType } from 'type-graphql';
import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import User from './User';

@ObjectType()
@Entity()
export default class Notification extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: 'varchar' })
  text: string;

  @Field(() => String)
  @CreateDateColumn()
  createdAt: Date;

  @Field(() => String)
  @CreateDateColumn()
  updatedAt: Date;

  @Field()
  @Column()
  userId!: number;

  @ManyToOne(() => User, (user) => user.notifications)
  @Field(() => User)
  user: User;
}
