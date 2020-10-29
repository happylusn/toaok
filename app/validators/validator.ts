import { ToaokValidate, Rule } from '../../core/toaok-validate-v2'

export class TestValidator extends ToaokValidate {
  constructor() {
    super()
    this.rules = [
      {field: 'name', rules: [new Rule('require', '名称不能为空'), new Rule('length', '长度必须在3-4', [3, 4])]}
    ]
  }
}