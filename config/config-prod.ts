import path from 'path'
import { IConfig } from './interface'

const config: IConfig = {
  apiPath: path.resolve(__dirname, '../app/api'), //接口路由（控制器）目录
  db: {
    dialect: 'mysql',
    database: 'island',
    username: 'root',
    password: '123456',
    host: 'localhost',
    port: 3306
  }
}

export default config
