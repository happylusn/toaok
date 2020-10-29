import Koa from 'koa'
import KoaBody from 'koa-body'

export const addKoaBody = (app: Koa) => {
  app.use(KoaBody({
    multipart: true,
    formidable: {
      maxFileSize: 20*1024*1024    // 设置上传文件大小最大限制，默认2M
    }
  }))
}