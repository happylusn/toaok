import {Table, Column, Model, Scopes, PrimaryKey, AutoIncrement, Unique, DataType, CreatedAt, UpdatedAt, Index, DeletedAt} from 'sequelize-typescript'

@Table({
  tableName: 'user',
})
export default class User extends Model<User> {
  @PrimaryKey
  @AutoIncrement
  @Column
  id!: number;

  @Index
  @Column
  nickname!: string;
  
  @Unique
  @Column(DataType.STRING(128))
  email!: string;

  @Column
  password!: string;
  
  @CreatedAt
  @Column
  created_at!: Date;

  @UpdatedAt
  @Column
  updated_at!: Date;

  @DeletedAt
  @Column
  deleted_at!: Date;
}

// import Sequelize ,{ Model } from 'sequelize'
// import db from '../../core/db'

// class User extends Model {
  
// }

// User.init({
//   id: {
//     type: Sequelize.INTEGER,
//     primaryKey: true,
//     autoIncrement: true
//   },
//   nickname: Sequelize.STRING,
//   email: {
//     type: Sequelize.STRING(128),
//     unique: true
//   },
//   password: Sequelize.STRING,
//   openid: {
//     type: Sequelize.STRING(64),
//     unique: true
//   }
// }, {sequelize: db.sequelize, tableName: 'user'})

// // db.sync()

// export default User
