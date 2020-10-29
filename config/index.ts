import { IConfig } from './interface'
// 配置文件名
const devConfig = './config-dev'
const prodConfig = './config-prod'

// 开发环境
const isDev = process.env.NODE_ENV == 'development' ? true : false

let config: IConfig
if (isDev) {
  config = {...require(devConfig).default}
} else {
  config = {...require(prodConfig).default}
}

export default config
