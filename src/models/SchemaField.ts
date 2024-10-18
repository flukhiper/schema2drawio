import type { SchemaFieldObj, SchemaTypeObj } from '../types/schema'
import SchemaType from './SchemaType'

export default class SchemaField {
  private name: string
  private path: string[]
  private count: number
  private type: string | string[]
  private probability: number
  private hasDuplicates: boolean
  private types: SchemaType[]

  constructor(obj: SchemaFieldObj) {
    this.name = obj.name
    this.path = obj.path
    this.count = obj.count
    this.type = obj.type
    this.probability = obj.probability
    this.hasDuplicates = obj.hasDuplicates

    const types = obj.types.map((type: SchemaTypeObj) => {
      return new SchemaType(type)
    })
    this.types = types
  }

  getName(): string {
    return this.name
  }

  getType(): string {
    return this.types.map(type => type.getName()).join(', ')
  }

  hasNestedTypes(): boolean {
    if (this.getType().includes('Document')) {
      return true
    }
    return false
  }

  getNestedFields(): SchemaField[] {
    return this.types.reduce((fields, type) => {
      return [...fields, ...type.getFields()]
    }, [] as SchemaField[])
  }

  getValue(): string {
    return this.types.map(type => type.getValue()).join(', ')
  }

  getCount(): number {
    return this.count
  }
}
