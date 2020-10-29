import Koa from 'koa'
import { HttpException } from '../core/http-exception'

// 开发环境
const isDev = process.env.NODE_ENV == 'development' ? true : false

export const handleException = (app: Koa) => {
  app.use(async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      if (error instanceof HttpException) {
        ctx.body = {
          msg: error.message,
          errorCode: error.errorCode,
          request:`${ctx.method} ${ctx.path}`
        }
        ctx.status = error.code
      } else {
        // if (isDev) throw error
        ctx.body = {
          msg: isDev ? error.message : 'we made a mistake O(∩_∩)O~~',
          errorCode: 999,
          request:`${ctx.method} ${ctx.path}`
        }
        ctx.status = 500
      }
    }
  })
}