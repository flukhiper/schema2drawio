import type { MySQLSchemaFieldObj } from '../../types/schema'
import { MySQLSchemaField } from './MySQLSchemaField'

export default class MySQLSchema {
  private fields: MySQLSchemaField[] = []

  constructor(fields: MySQLSchemaField[] = []) {
    this.fields = fields
  }

  static parseMySQLSchemaFieldObj(obj: MySQLSchemaFieldObj[]): MySQLSchema {
    const schema = new MySQLSchema()

    obj.forEach((field: MySQLSchemaFieldObj) => {
      schema.addField(new MySQLSchemaField(field))
    })

    return schema
  }

  addField(field: MySQLSchemaField): void {
    this.fields.push(field)
  }

  getFieldByName(name: string): MySQLSchemaField | undefined {
    return this.fields.find(field => field.getName() === name)
  }

  getFields(): MySQLSchemaField[] {
    return this.fields
  }
}
