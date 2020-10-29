import Koa from 'koa'
import path from 'path'
import R from 'ramda'
import db from './core/db'

const app = new Koa()
const middlewares = ['handle-exception', 'common', 'controller']

const useMiddlewares = (app: Koa) => {
  R.map(
      R.compose(
          R.forEachObjIndexed(
            (initWith: Function) => initWith(app)
          ),
          require,
          (name: string) => path.resolve(__dirname, `./middlewares/${name}`)
      )
  )(middlewares)
}
db.initSequelize()
//db.sync()
useMiddlewares(app)
app.listen(4000, () => {
  console.log('服务器已启动，监听4000端口')
})
