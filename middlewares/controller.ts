import Koa from 'koa'
import { AutoLoadController } from '../core/decorator'
import config from '../config/index'

export const controller = (app: Koa) => {
  const autoLoadController = new AutoLoadController(app, config.apiPath)
  autoLoadController.init()
}