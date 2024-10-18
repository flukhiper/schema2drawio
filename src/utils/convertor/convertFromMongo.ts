import * as fs from 'fs'
import * as path from 'path'

import Database from '../../aggregates/Database'
import Table from '../../aggregates/Table'
import type SchemaField from '../../models/SchemaField'
import MongoSchema from '../../models/MongoSchema'
import type { MongoSchemaObj } from '../../types/schema'

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

const convertFromMongo = (directoryPath: string, files: string[]) => {
  const database = new Database()

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file)
    const schemaJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const mongoSchema = MongoSchema.parseMongoSchemaObj(schemaJson as MongoSchemaObj)
    const tableName = path.basename(filePath, path.extname(filePath))
    const result = convertMongoSchemaToTable(tableName, mongoSchema.fields)

    database.addCollection(result)
  })

  const xmlString = database.toXMLString()
  const outDir = path.join('output')
  const outputFilePath = path.join(outDir, `${path.basename(directoryPath)}.xml`)

  fs.writeFileSync(outputFilePath, xmlString)
  console.log(`XML has been written to ${outputFilePath}`)
}

export default convertFromMongo
