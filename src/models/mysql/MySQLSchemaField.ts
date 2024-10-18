import type { MySQLSchemaFieldObj } from '../../types/schema'

export class MySQLSchemaField {
  fieldName: string
  type: string
  isNullable: string
  key: string
  default: string
  extra: string
  valueExamples: string[]

  constructor({
    fieldName,
      type,
      isNullable,
      key,
      extra,
      valueExamples,
      default: defaultVal,
  }: MySQLSchemaFieldObj) {
    this.fieldName = fieldName
    this.type = type
    this.isNullable = isNullable
    this.key = key
    this.default = defaultVal
    this.extra = extra
    this.valueExamples = valueExamples
  }

  getName(): string {
    return this.fieldName
  }

  getType(): string {
    return this.type
  }

  getNullable(): string {
    return this.isNullable
  }

  getIndexed(): string {
    return this.key
  }

  getDefault(): string {
    return this.default
  }

  getExtra(): string {
    return this.extra
  }

  getValue(): string {
    return this.valueExamples.join(', ')
  }
}
