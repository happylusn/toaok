import { ToaokValidator, Rule } from '../../core/toaok-validator-v2'

export class TestValidator extends ToaokValidator {
  constructor() {
    super()
    this.rules = [
      {field: 'name', rules: [new Rule('require', '名称不能为空'), new Rule('length', '长度必须在3-4', [3, 4])]}
    ]
  }
}