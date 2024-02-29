import { Field, Int, ObjectType } from 'type-graphql';
import { Film } from './Film';

@ObjectType()
export class PaginatedFilms {
  @Field(() => [Film])
  films!: Film[];

  @Field(() => Int, { nullable: true })
  cursor?: Film['id'] | null;
}
