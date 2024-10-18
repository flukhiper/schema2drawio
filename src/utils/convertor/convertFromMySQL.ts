import * as fs from 'fs'
import * as path from 'path'

import Database from '../../aggregates/Database'
import Table from '../../aggregates/Table'
import type { MySQLSchemaFieldObj } from '../../types/schema'
import MySQLSchema from '../../models/mysql/MySQLSchema'
import type { MySQLSchemaField } from '../../models/mysql/MySQLSchemaField'

const convertMySQLSchemaToTable = (name: string, fields: MySQLSchemaField[]): Table => {
  const table = new Table({ name })
  fields.forEach((field) => {
    const name = field.getName()
    const type = field.getType()
    const nullable = field.getNullable()
    const indexed = field.getIndexed()
    const defaultVal = field.getDefault()
    const extra = field.getExtra()
    const value = field.getValue()
    const description = ''

    table.addField({ name, type, nullable, indexed, default: defaultVal, extra, value, description })
  })

  return table
}

const convertFromMySQL = (directoryPath: string, files: string[]) => {
  const database = new Database()

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file)
    const schemaRawTxt = fs.readFileSync(filePath, 'utf-8')

    const lines = schemaRawTxt.split('\n')
    const schemaFieldObjs = lines.map((line) => {
      const [fieldName, type, isNullable, key, defaultValue, extra, ...valueExamples] = line.split(',')
      const field: MySQLSchemaFieldObj = {
        fieldName,
        type,
        isNullable,
        key,
        default: defaultValue,
        extra,
        valueExamples,
      }
      return field
    })
    const mysqlSchema = MySQLSchema.parseMySQLSchemaFieldObj(schemaFieldObjs)
    const tableName = path.basename(filePath, path.extname(filePath))
    const result = convertMySQLSchemaToTable(tableName, mysqlSchema.getFields())

    database.addCollection(result)
  })

  const xmlString = database.toXMLString()
  const outDir = path.join('output')
  const outputFilePath = path.join(outDir, `${path.basename(directoryPath)}.xml`)

  fs.writeFileSync(outputFilePath, xmlString)
  console.log(`XML has been written to ${outputFilePath}`)
}

export default convertFromMySQL
