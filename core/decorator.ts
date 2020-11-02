import Koa from 'koa'
import Router from 'koa-router'
import path from 'path'
import glob from 'glob'
import _ from 'lodash'

interface RouterConf {
  method: 'get' | 'post' | 'put' | 'delete' | 'all' | 'use';
  path: string | RegExp;
  REG_EXP: boolean;
}
interface RouterMapKey extends RouterConf {
  target: any;
}

// ES6引入了一种新的原始数据类型Symbol，表示独一无二的值
const symbolPrefix = Symbol('prefix')
const routerMap: Map<RouterMapKey, Function | Function[]> = new Map()
//定义一个函数，如果c是数组，返回这个数组，如果不是，封装成数组，再返回,  isArray是lodash的内置函数
const isArray = (c: any) => _.isArray(c) ? c : [c]

export class AutoLoadController {
  public router: Router
  constructor(public app: Koa, public apiPath: string) {
    this.router = new Router()
  }
  init () {
    //将所有api目录下的路由文件引用进来
    glob.sync(path.resolve(this.apiPath, './**/*.js')).forEach(require)
    for (let [conf, controller] of routerMap) {
      const controllers = isArray(controller)
      let routerPath: string | RegExp = ''
      if (conf.REG_EXP === true) { // 正则路由
        routerPath = conf.path
      } else {
        let prefixPath = conf.target[symbolPrefix]

        if (prefixPath) prefixPath = normalizePath(prefixPath)

        if (prefixPath == '/') prefixPath = '';
        routerPath = prefixPath + conf.path
      }
      this.router[conf.method](routerPath, ...controllers)
    }
    
    this.app.use(this.router.routes())
    this.app.use(this.router.allowedMethods())
  }
}

const normalizePath = (path: string) => path.startsWith('/') ? path : `/${path}`

function router(conf: RouterConf) {
  return function(target: any, key: string, descriptor: PropertyDescriptor) {
    if (conf.REG_EXP !== true) { // 非正则路由
      conf.path = normalizePath(conf.path as string);
    }
    routerMap.set({
        target: target,
        ...conf
    }, target[key]);
  }
}

export function controller(path: string) {
  return function(target: Function) {
    target.prototype[symbolPrefix] = path;
  }
}

//定义router中常见的六个方法，并暴露出去,这里对应的是方法的装饰器
export function get(path: string | RegExp, REG_EXP: boolean = false) {
  return router({
    method: 'get',
    path: path,
    REG_EXP 
  })
} 

export function post(path: string | RegExp, REG_EXP: boolean = false) {
  return router({
    method: 'post',
    path: path,
    REG_EXP
  });
}

export function put(path: string | RegExp, REG_EXP: boolean = false) {
  return router({
    method: 'put',
    path: path,
    REG_EXP
  });
}

export function del(path: string | RegExp, REG_EXP: boolean = false) {
  return router({
    method: 'delete',
    path: path,
    REG_EXP
  });
}

export function use(path: string | RegExp, REG_EXP: boolean = false) {
  return router({
    method: 'use',
    path: path,
    REG_EXP
  });
}

export function all(path: string | RegExp, REG_EXP: boolean = false) {
  return router({  
    method: 'all',
    path: path,
    REG_EXP
  })
}

const decorate = (middleware: Function, ...args: any[]) => {
  let [ target, key, descriptor ] = args

  target[key] = isArray(target[key])
  target[key].unshift(middleware)
}

function convert(middleware: Function): Function {
  return function(target: any, key: string, descriptor: PropertyDescriptor) {
    return decorate(middleware, target, key, descriptor)
  }
}

const authMiddleWare =  (level?: number) => async (ctx: Koa.Context, next: Koa.Next) => {
  console.log('auth middlewares')
  await next()
}

//是否登录
export  function auth(level: number): Function;
export  function auth(target: any, key: string, propertyDescriptor?: PropertyDescriptor): void;
export  function auth(...args: any[]) {
  if (args.length >= 2) {
    decorate(authMiddleWare(), args[0], args[1], args[2])
  } else {
    return convert(authMiddleWare(args[0]))
  }
}

//是否登录
// export const auth = convert(async (ctx: Koa.Context, next: Koa.Next) => {
//   console.log('auth middlewares')
//   await next()
// })
