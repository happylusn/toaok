import { Sequelize } from 'sequelize-typescript'
import config from '../config'

const init = () => {
  return  new Sequelize({
    database: config.db.database,
    host: config.db.host,
    dialect: config.db.dialect,
    port: config.db.port,
    username: config.db.username,
    password: config.db.password,
    pool: {
      max: 5,
      min: 0,
      idle: 10000
    },
    define: {
      // timestamps: true,//开启时间戳 create_at delete_at update_at
      // paranoid: true,//开启假删除
      // createdAt:'created_at',
      // updatedAt:'updated_at',
      // deletedAt:'deleted_at',
      underscored: true,//下划线
      charset: 'utf8',
      freezeTableName: true//固定表名为单数  默认表名是xxxs
    },
    timezone: '+08:00',//更改为北京时区
    models: [__dirname + '/../app/models'], //模型文件地址
    logging: false
  })
}
let sequelize = init()

const initSequelize = () => {
  if (!(sequelize instanceof Sequelize)) {
    sequelize = init()
  }
}

const sync = () => {
  // only allow create ddl in non-production environment:
  if (process.env.NODE_ENV !== 'production' && sequelize instanceof Sequelize) {
    sequelize.sync({ force: true })
  } else {
    throw new Error('Cannot sync() when NODE_ENV is set to \'production\'.')
  }
}

export default {
  initSequelize,
  sequelize,
  sync
}
