import Table from '../../aggregates/Table'
import type SchemaField from '../../models/SchemaField'

const convertMongoSchemaToTable = (name: string, fields: SchemaField[]): Table => {
  const table = new Table({ name })
  fields.forEach((field) => {
    const name = field.getName()
    const type = field.getType()
    const value = field.getValue()
    const description = ''

    table.addField({ name, type, value, description })
    const hasNestedTypes = field.hasNestedTypes()
    if (hasNestedTypes) {
      const nestedFields = field.getNestedFields()
      const nestedTable = convertMongoSchemaToTable(name, nestedFields)
      table.addCompletedSubTable(name, nestedTable)
    }
  })

  return table
}

export default convertMongoSchemaToTable
