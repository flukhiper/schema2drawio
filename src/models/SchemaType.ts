import type { SchemaFieldObj, SchemaTypeObj } from '../types/schema'
import SchemaField from './SchemaField'

export default class SchemaType {
  private name: string
  private path: string[]
  private count: number
  private probability: number
  private unique?: number
  private hasDuplicates: boolean
  private values?: (string | number | null)[]
  private bsonType: string
  private fields?: SchemaField[]
  private types?: SchemaType[]

  constructor(obj: SchemaTypeObj) {
    this.name = obj.name
    this.path = obj.path
    this.count = obj.count
    this.probability = obj.probability
    this.unique = obj.unique
    this.hasDuplicates = obj.hasDuplicates
    this.values = obj.values
    this.bsonType = obj.bsonType

    const fields = obj.fields?.map((field: SchemaFieldObj) => {
      return new SchemaField(field)
    })
    this.fields = fields
    const types = obj.types?.map((type: SchemaTypeObj) => {
      return new SchemaType(type)
    })
    this.types = types
  }

  getName(): string {
    if (this.name === 'Array') {
      return `[${this.types?.map(type => type.getName()).join(', ') || ''}]`
    }
    return this.name
  }

  getFields(): SchemaField[] {
    if (this.types) {
      return this.types.reduce((fields, type) => {
        return [...fields, ...type.getFields()]
      }, [] as SchemaField[])
    }
    return this.fields || []
  }

  getValue(): string {
    if (this.name === 'Document') {
      return `{${this.path[this.path.length - 1]}}`
    }
    if (this.name === 'Null') {
      return 'null'
    }
    if (this.name === 'Array') {
      return `[${this.types?.map(type => type.getValue()).join(', ')}]`
    }
    return [...new Set(this.values)].slice(0, 5).map((value) => {
      if (typeof value === 'string') {
        return value.replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;')
          .replace(/'/g, '&apos;')
          .replace(/\n/g, '&#10;')
      }
      return value
    }).join(', ') || ''
  }
}
