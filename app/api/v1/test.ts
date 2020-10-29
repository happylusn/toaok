import Koa from 'koa'
import { controller, get, auth, all } from '../../../core/decorator'
import { TestValidator } from '../../validators/validator'
// import User from '../../models/User'
// import Book from '../../models/Book'
// import BookComment from '../../models/BookComment'


@controller('/v1/test')
export class TestController {
  @all('/test1')
  @auth
  async test1(ctx: Koa.Context, next: Koa.Next) {
    console.log(ctx.query.name)
    //console.log(ctx.request.body)
    // const validate =  new TestValidator()
    // if (await validate.check(ctx.query)) {
    //   // console.log(validate.getErrorInfo())
    // }
    //const user = new User({nickname: 'luu', email: '1239@qq.com', password: '1111'})
    // const res1 = await user.save()
    // console.log(111, user)
    // const user = await User.create({nickname: 'luu', email: '1239@qq.com', password: '1111'})
    // console.log(1111, user)
    // const res = await User.findAll({raw: true})
    // const res = await Book.findAll({
    //   where: {
    //     id: 1
    //   },
    //   include: [BookComment],
    //   raw: true
    // })
    // console.log(res)
    ctx.body = {data: 'uuuuu'}
  }
}