import {Table, Column, Model, HasMany, DataType, CreatedAt, UpdatedAt, DeletedAt} from 'sequelize-typescript'
import BookComment from './BookComment'

@Table({
  tableName: 'book'
})
export default class Book extends Model<Book> {

  @Column
  book_name!: string;
  
  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;

  @DeletedAt
  @Column
  deleted_at!: Date;

  @HasMany(() => BookComment)
  bookComments?: BookComment[]
}