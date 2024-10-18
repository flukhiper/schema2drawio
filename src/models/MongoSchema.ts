import type { MongoSchemaObj, SchemaFieldObj } from '../types/schema'
import SchemaField from './SchemaField'

export default class MongoSchema {
  count: number
  fields: SchemaField[]

  constructor(count: number, fields: SchemaField[] = []) {
    this.count = count
    this.fields = fields
  }

  static parseMongoSchemaObj(obj: MongoSchemaObj): MongoSchema {
    const schema = new MongoSchema(obj.count)

    obj.fields.forEach((field: SchemaFieldObj) => {
      schema.addField(new SchemaField(field))
    })
    return schema
  }

  addField(field: SchemaField): void {
    this.fields.push(field)
  }

  getFieldByName(name: string): SchemaField | undefined {
    return this.fields.find(field => field.getName() === name)
  }

  getTotalCount(): number {
    return this.fields.reduce((total, field) => total + field.getCount(), this.count)
  }
}
