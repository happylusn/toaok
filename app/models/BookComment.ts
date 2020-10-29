import {Table, Column, Model, BelongsTo, CreatedAt, UpdatedAt, Index, ForeignKey, DeletedAt} from 'sequelize-typescript'
import Book from './Book'

@Table({
  tableName: 'book_comment'
})
export default class BookComment extends Model<BookComment> {

  @Column
  content!: string;
  
  @ForeignKey(() => Book)
  @Column
  book_id!: number;

  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;

  @DeletedAt
  @Column
  deleted_at!: Date;

  @BelongsTo(() => Book)
  book?: Book;
}
