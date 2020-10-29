import { ParameterException } from './http-exception'
import { ABSTRACT } from 'sequelize'

const alias = {
  '>': 'gt',
  '>=': 'egt',
  '<': 'lt',
  '<=': 'elt',
  '=': 'eq',
  'same': 'eq',
}
// 验证规则默认提示信息
const typeMsg = {
  'require': ':attribute不能为空',
  'string': ':attribute必须是字符串',
  'number': ':attribute必须是数字',
  'float': ':attribute必须是浮点数',
  "integer": ':attribute必须是整数',
  'boolean': ':attribute必须是布尔值',
  'email': ':attribute格式不符',
  'array': ':attribute必须是数组',
  'accepted': ':attribute必须是yes、on或者1',
  'date': ':attribute格式不符合',
  'alpha': ':attribute只能是字母',
  'alphaNum': ':attribute只能是字母和数字',
  'alphaDash': ':attribute只能是字母、数字和下划线_及破折号-',
  'chs': ':attribute只能是汉字',
  'chsAlpha': ':attribute只能是汉字、字母',
  'chsAlphaNum': ':attribute只能是汉字、字母和数字',
  'chsDash': ':attribute只能是汉字、字母、数字和下划线_及破折号-',
  'in': ':attribute必须在 :rule 范围内',
  'notIn': ':attribute不能在 :rule 范围内',
  'between': ':attribute只能在 :1 - :2 之间',
  'notBetween': ':attribute不能在 :1 - :2 之间',
  'length': ':attribute长度不符合要求 :rule',
  'max': ':attribute长度不能超过 :rule',
  'min': ':attribute长度不能小于 :rule',
  'confirm': ':attribute和字段 :rule 不一致',
  'different': ':attribute和字段 :rule 不能相同',
  'egt': ':attribute必须大于等于 :rule',
  'gt': ':attribute必须大于 :rule',
  'elt': ':attribute必须小于等于 :rule',
  'lt': ':attribute必须小于 :rule',
  'eq': ':attribute必须等于 :rule',
  'eqi': ':attribute必须等于 :rule',
  'regex': ':attribute不符合指定规则',
}
type RuleParam = {
  in: Array<string | number | boolean>;
  notIn: Array<string | number | boolean>;
  between: [number | string, number | string];
  notBetween: [number | string, number | string];
  length: number | [number, number];
  max: number;
  min: number;
  confirm: string;
  different: string;
  gt: number | string;
  egt: number | string;
  lt: number | string;
  elt: number | string;
  eq: number | string | boolean;
  eqi: string;
  regex: RegExp | string;
  // dateFormat: 'YYYY-MM-DD HH:mm:ss' | 'YYYY/MM/DD HH:mm:ss'
  require: undefined;
  string: undefined;
  number: undefined;
  float: undefined;
  integer: undefined;
  boolean: undefined;
  email: undefined;
  array: undefined;
  accepted: undefined;
  isdate: undefined;
  alpha: undefined;
  alphaNum: undefined;
  alphaDash: undefined;
  chs: undefined;
  chsAlpha: undefined;
  chsAlphaNum: undefined;
  chsDash: undefined;
}
type IObj = {[key: string]: any}
export type IRule = keyof RuleParam
interface RuleItem {
  field: string;
  rules: Rule[]
}

export class Rule<T extends string = string, K extends IRule = IRule> {
  constructor(public name: T | K, public msg?: string, public params?: RuleParam[K]) {}
  
}

export class ToaokValidate {
  protected error: {[key: string]: string[]} = {} //错误信息
  constructor(protected rules: RuleItem[] = [], public autoThrow: boolean = true) {}

  async check(data: IObj, singleThrow: boolean = true) {
    for (const key in this.rules) {
      const item = this.rules[key]
      const field = item.field // 要验证的字段名
      const rules = item.rules // 验证的规则数组
      // 获取字段的值
      const value = this.getDataValue(data, field)
      await this.checkItem(field, value, rules, data, singleThrow)
    }
    const result = Object.keys(this.error).length === 0
    if (result === false && this.autoThrow === true) {
      throw new ParameterException();
    }
    return result
  }

  protected async checkItem(field: string, value: any, rules: Rule[], data: IObj, singleThrow: boolean) {
    let result = false
    for (let key in rules) {
      let rule: Rule = rules[key] // 规则对象
      let ruleName = rule.name // 规则名称
      // 判断是否存在别名
      if (alias[ruleName]) {
        ruleName = alias[ruleName]
      }
      let methodName: string =  '' // 验证方法的名称
      if (this[ruleName] && typeof this[ruleName] === 'function') {
        methodName = ruleName
      } else {
        methodName = 'is'
      }
      // 如果不是require 有数据才会行验证 或者自定义方法也会验证
      if (ruleName === 'require' || ruleName.startsWith('validate') || (value != null && '' !== value)) {
        // 执行验证方法
        result = await this[methodName](value, rule, data)
      } else {
        result = true
      }
      if (false === result) {
        let msg = this.getRuleMsg(field, rule)
        if (typeof this.error[field] === 'undefined') {
          this.error[field] = [msg]
        } else {
          this.error[field].push(msg)
        }
        if (singleThrow === true && this.autoThrow === true) {
          throw new ParameterException(msg);
        }
      }
    }
    return this.error[field] ? false : true
  }

  protected getDataValue(data: IObj, key: string): any {
    let value = null;
    if (key.indexOf('.') > 0) {
        // 支持二维数组验证
        let a = key.split('.')
        const k = a.shift()
        value = this.getDataValue(data[k!], a.join('.'))
    } else {
        value = data[key] ? data[key] : null
    }
    return value 
  }
  protected getRuleMsg(field: string, rule: Rule): string {
    let msg = rule.msg;
    let ruleName = rule.name
    let params = rule.params
    if (typeof msg === 'undefined') {
      if (typeMsg[rule.name]) {
        msg = typeMsg[rule.name] as string
      } else {
        msg = field + '规则错误'
      }
    }
    if (ruleName === 'regex') {
      return msg
    }
    if (typeof msg === 'string' && msg.indexOf(':') >= 0) {
      msg = msg.replace(':attribute', field)
      if (typeof params !== 'undefined') {
        msg = msg.replace(':rule', params.toString())
      }
      let array: Array<string | number | boolean> = ['','','']
      if (this.checkedType(params) === 'Array') {
        for (let key in (params as Array<string | number | boolean>)) {
          array[key] = (params as Array<string | number | boolean>)[key]
        }
      }
      msg = msg.replace(':1', array[0].toString())
      msg = msg.replace(':2', array[1].toString())
      msg = msg.replace(':3', array[2].toString())
    }
    return msg;
  }
  getErrorByKey(key: string) {
    return this.error[key]
  }
  getError() {
    return this.error
  }
  getErrorInfo() {
    let msg = '';
    for (const key in this.error) {
        msg += (msg == '') ? this.error[key].join(';') : ('|' + this.error[key].join(';'))
    }
    return msg
  }
  hasParams(rule: Rule): boolean {
    let params = rule.params
    if (typeof params === 'undefined') {
      throw new Error(`${rule.name}验证规则缺少参数`);
    }
    return true
  }

  in(value: any, rule: Rule, data: IObj) {
    this.hasParams(rule)
    return this.inArray(value.toString(), rule.params as RuleParam['in'])
  }

  notIn(value: any, rule: Rule, data: IObj) {
    this.hasParams(rule)
    return this.inArray(value.toString(), rule.params as RuleParam['notIn'])
  }

  between(value: any, rule: Rule, data: IObj) {
    this.hasParams(rule)
    let min = (rule.params as RuleParam['between'])[0]
    let max = (rule.params as RuleParam['between'])[1]
    return value >= min && value <= max
  }

  notBetween(value: any, rule: Rule, data: IObj) {
    this.hasParams(rule)
    let min = (rule.params as RuleParam['notBetween'])[0]
    let max = (rule.params as RuleParam['notBetween'])[1]
    return value < min || value > max
  }

  length(value: any, rule: Rule, data: IObj) {
    this.hasParams(rule)
    let length = 0
    if (value instanceof Array) {
      length = value.length
    } else {
      length = value.toString().length;
    }

    if (rule.params instanceof Array) {
      // 长度区间
      let min = (rule.params as RuleParam['length'])[0]
      let max = (rule.params as RuleParam['length'])[1]
      return length >= min && length <= max
    } else {
      // 指定长度
      return length === (rule.params as number)
    }
  }

  max(value: any, rule: Rule, data: IObj) {
    this.hasParams(rule)
    let length = 0
    if (value instanceof Array) {
        length = value.length
    } else {
        length = value.toString().length
    }
    return length <= (rule.params as number)
  }

  min(value: any, rule: Rule, data: IObj) {
    this.hasParams(rule)
    let length = 0
    if (value instanceof Array) {
        length = value.length
    } else {
        length = value.toString().length
    }
    return length >= (rule.params as number)
  }

  confirm(value: any, rule: Rule, data: IObj) {
    this.hasParams(rule)
    return this.getDataValue(data, (rule.params as string)) == value
  }

  different(value: any, rule: Rule, data: IObj) {
    this.hasParams(rule)
    return this.getDataValue(data, (rule.params as string)) == value
  }

  gt(value: any, rule: Rule, data: IObj) {
    this.hasParams(rule)
    return value > (rule.params as RuleParam['gt'])
  }

  egt(value: any, rule: Rule, data: IObj) {
    this.hasParams(rule)
    return value >= (rule.params as RuleParam['egt'])
  }

  lt(value: any, rule: Rule, data: IObj) {
    this.hasParams(rule)
    return value < (rule.params as RuleParam['lt'])
  }

  elt(value: any, rule: Rule, data: IObj) {
    this.hasParams(rule)
    return value <= (rule.params as RuleParam['elt'])
  }

  eqi(value: any, rule: Rule, data: IObj) {
    this.hasParams(rule)
    return value.toLowerCase() == (rule.params as RuleParam['eqi'])
  }

  regex(value: any, rule: Rule, data: IObj) {
    this.hasParams(rule)
    if (rule.params instanceof RegExp) {
        return rule.params.test(value)
    } else {
        let pre = (rule.params as string).indexOf("/^")
        let last = (rule.params as string).lastIndexOf("$/")
        if (pre === -1 && last === -1) {
            return new RegExp(rule.params as string).test(value)
        } else if (pre >= 0 && last >= 0) {
            let flag = (rule.params as string).substr(last + 2)
            let reg = (rule.params as string).substring(pre + 2, last)
            return new RegExp(reg, flag).test(value)
        }
    }
    return false
  }

  // dateFormat(value: any, rule: Rule, data: IObj) {

  // }

  is(value: any, rule: Rule, data: IObj) {
    let result = false;
    switch (rule.name) {
      case 'require':
        // 必须
        result = (value != null && '' !== value) || '0' === value;
        break;
      case 'accepted':
        // 接受
        result = this.inArray(value, ['1', 'on', 'yes']);
        break;
      case 'date' :
        result = this.isDate(value);
        break;
      case 'alpha':
        // 只允许字母
        result = /^[A-Za-z]+$/.test(value);
        break;
      case 'alphaNum':
        // 只允许字母和数字
        result = /^[A-Za-z0-9]+$/.test(value);
        break;
      case 'alphaDash':
        // 只允许字母、数字和下划线 破折号
        result = /^[A-Za-z0-9\-\\_]+$/.test(value);
        break;
      case 'chs':
        // 只允许汉字
        result = /^[\u4e00-\u9fa5]+$/u.test(value);
        break;
      case 'chsAlpha':
        // 只允许汉字、字母
        result = /^[\u4e00-\u9fa5a-zA-Z]+$/u.test(value);
        break;
      case 'chsAlphaNum':
        // 只允许汉字、字母和数字
        result = /^[\u4e00-\u9fa5a-zA-Z0-9]+$/u.test(value);
        break;
      case 'chsDash':
        // 只允许汉字、字母、数字和下划线_及破折号-
        result = /^[\u4e00-\u9fa5a-zA-Z0-9\\_\-]+$/u.test(value);
        break;
      case 'float':
        // 是否为float
        result = !isNaN(value) && parseFloat(value) === value;
        break;
      case 'number':
        result = !isNaN(value);
        break;
      case 'integer':
        // 是否为整型
        result = !isNaN(value) && parseInt(value) === value;
        break;
      case 'email':
        // 是否为邮箱地址
        result = /^([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\\_|\\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/.test(value)
        break;
      case 'boolean':
        // 是否为布尔值
        result = this.inArray(value, [0, 1, true, false]);
        break;
      case 'array':
        // 是否为数组
        result = value instanceof Array;
        break;
      case 'string':
        // 是否为字符串
        result = typeof value == 'string';
        break;
      default:
        throw new Error(`没有名称为${rule.name}的验证规则`);
        break;
    }
    return result;
  }
  isDate(value: any) {
    let reg = /^(\d+)(?:-|\/)(\d{1,2})(?:-|\/)(\d{1,2})(?:\s+(\d{1,2}):(\d{1,2}):(\d{1,2}))?$/
    let r = reg.exec(value)
    if (r == null) return false
    r['2'] = r['2'] - 1
    let d: Date
    if (r['4'] === undefined) {
      d= new Date(r['1'], r['2'],r['3'])
    } else {
      d= new Date(r['1'], r['2'],r['3'], r['4'],r['5'], r['6'])
      if(d.getHours()!=r['4']) return false
      if(d.getMinutes()!=r['5']) return false
      if(d.getSeconds()!=r['6']) return false
    }
    if(d.getFullYear() != r['1']) return false
    if(d.getMonth() != r['2']) return false
    if(d.getDate() != r['3']) return false
    
    return true;
  }

  protected inArray(search: string | number, array: Array<string | number | boolean>): boolean {
    for (let i in array) {
      if (array[i] === search) {
        return true
      }
    }
    return false
  }
  protected checkedType(target: any) {
    return Object.prototype.toString.call(target).slice(8, -1)
  }
}
