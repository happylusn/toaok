export class HttpException extends Error {
  constructor(public message: string = '服务器异常', public errorCode: number = 10000, public code: number = 400) {
    super()
  }
}

export class ParameterException extends HttpException{
  constructor(message: string = '参数错误', errorCode: number = 10000){
    super(message, errorCode, 400)
  }
}

export class NotFound extends HttpException{
  constructor(message: string = '资源未找到', errorCode: number = 10000) {
    super(message, errorCode, 404)
  }
}

export class Forbbiden extends HttpException{
  constructor(message: string = '禁止访问', errorCode: number = 10006) {
    super(message, errorCode, 403)
  }
}
