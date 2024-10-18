// import Database from './src/aggregates/Database'

import Database from './src/aggregates/Database'
// import Table from './src/aggregates/Table'
import * as fs from 'fs'
import * as path from 'path'

// import schemaJson from './schema/shop/media_types.json'
import MongoSchema from './src/models/MongoSchema'
import type { MongoSchemaObj } from './src/types/schema'
import convertor from './src/utils/convertor'
// import type SchemaField from './src/models/SchemaField'

// const mongoSchema = MongoSchema.parseMongoSchemaObj(schemaJson as MongoSchemaObj)
// // console.log(mongoSchema)

// const convertMongoSchemaToTable = (name: string, fields: SchemaField[]): Table => {
//   const table = new Table({ name })
//   fields.forEach((field) => {
//     const name = field.getName()
//     const type = field.getType()
//     const value = field.getValue()
//     const description = ''

//     table.addField({ name, type, value, description })
//     const hasNestedTypes = field.hasNestedTypes()
//     if (hasNestedTypes) {
//       const nestedFields = field.getNestedFields()
//       const nestedTable = convertMongoSchemaToTable(name, nestedFields)
//       table.addCompletedSubTable(name, nestedTable)
//     }
//   })

//   return table
// }

// const result = convertMongoSchemaToTable('MediaTypes', mongoSchema.fields)
// console.log(result)

// // const database = new Database()
// // database.addCollection('Users')
// // database.addField('Users', 'id', 'int', '1', 'The unique identifier for the user')
// // database.addField('Users', 'name', 'string', 'Alice', 'The name of the user')

// // database.addCollection('Posts')
// // database.addField('Posts', 'id', 'int', '1', 'The unique identifier for the post')
// // database.addField('Posts', 'title', 'string', 'Hello, World!', 'The title of the post')

// // console.log(database.toXMLString())

// const table = new Table({ name: 'Users' })
// table.addField({ name: 'id', type: 'int', value: '1', description: 'The unique identifier for the user' })
// table.addField({ name: 'name', type: 'string', value: 'Alice', description: 'The name of the user' })
// table.addSubTable('id', 'Posts')
// table.getSubTable('id')?.addField({ name: 'id', type: 'int', value: '1', description: 'The unique identifier for the post' })
// table.getSubTable('id')?.addField({ name: 'title', type: 'string', value: 'Hello, World!', description: 'The title of the post' })
// table.addSubTable('name', 'Comments')
// table.getSubTable('name')?.addField({ name: 'id', type: 'int', value: '1', description: 'The unique identifier for the comment' })
// table.getSubTable('name')?.addField({ name: 'body', type: 'string', value: 'Hello, World!', description: 'The body of the comment' })
// table.getSubTable('name')?.addField({ name: 'author', type: 'string', value: 'Alice', description: 'The author of the comment' })
// const table2 = new Table({ name: 'Posts' })
// table2.addField({ name: 'id', type: 'int', value: '1', description: 'The unique identifier for the post' })
// table2.addField({ name: 'title', type: 'string', value: 'Hello, World!', description: 'The title of the post' })
// table2.addField({ name: 'body', type: 'string', value: 'Hello, World!', description: 'The body of the post' })
// table2.addSubTable('id', 'Comments')
// table2.getSubTable('id')?.addField({ name: 'id', type: 'int', value: '1', description: 'The unique identifier for the comment' })
// table2.getSubTable('id')?.addSubTable('id', 'Users')
// table2.getSubTable('id')?.getSubTable('id')?.addField({ name: 'id', type: 'int', value: '1', description: 'The unique identifier for the user' })
// table2.getSubTable('id')?.getSubTable('id')?.addField({ name: 'name', type: 'string', value: 'Alice', description: 'The name of the user' })
// table2.getSubTable('id')?.getSubTable('id')?.addField({ name: 'email', type: 'string', value: '' })
// table2.getSubTable('id')?.getSubTable('id')?.addField({ name: 'password', type: 'string', value: '' })
// table2.getSubTable('id')?.getSubTable('id')?.addField({ name: 'created_at', type: 'datetime', value: '' })
// table2.getSubTable('id')?.getSubTable('id')?.addField({ name: 'updated_at', type: 'datetime', value: '' })
// const table3 = new Table({ name: 'Comments' })
// table3.addField({ name: 'id', type: 'int', value: '1', description: 'The unique identifier for the comment' })

// // console.log(table.toMxCell())

// const database = new Database()
// database.addCollection(result)
// // database.addCollection(table)
// // database.addCollection(table2)
// // database.addCollection(table3)

// // console.log(database.toXMLString())

// const xmlString = database.toXMLString()
// const filePath = path.join(__dirname, 'output.xml')

// fs.writeFileSync(filePath, xmlString)
// console.log(`XML has been written to ${filePath}`)
// // console.log(table)

const main = () => {
  const args = process.argv.slice(2)
  if (args.length === 0) {
    console.error('Please provide a file path as an argument.')
    process.exit(1)
  }

  const directoryPath = args[0]
  if (!fs.existsSync(directoryPath)) {
    console.error(`Directory not found: ${directoryPath}`)
    process.exit(1)
  }

  const files = fs.readdirSync(directoryPath).filter(file => path.extname(file) === '.json')
  if (files.length === 0) {
    console.error(`No JSON files found in directory: ${directoryPath}`)
    process.exit(1)
  }

  const database = new Database()

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file)
    const schemaJson = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    const mongoSchema = MongoSchema.parseMongoSchemaObj(schemaJson as MongoSchemaObj)
    const tableName = path.basename(filePath, path.extname(filePath))
    const result = convertor.convertMongoSchemaToTable(tableName, mongoSchema.fields)

    database.addCollection(result)
  })

  const xmlString = database.toXMLString()
  const outputFilePath = path.join(__dirname, `${path.basename(directoryPath)}.xml`)

  fs.writeFileSync(outputFilePath, xmlString)
  console.log(`XML has been written to ${outputFilePath}`)
}

main()
