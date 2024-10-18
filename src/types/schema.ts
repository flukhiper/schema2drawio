export type SchemaTypeObj = {
  name: string
  path: string[]
  count: number
  probability: number
  unique?: number
  hasDuplicates: boolean
  values?: (string | number | null)[]
  bsonType: string
  fields?: SchemaFieldObj[]
  types?: SchemaTypeObj[]
}

export type SchemaFieldObj = {
  name: string
  path: string[]
  count: number
  type: string | string[]
  probability: number
  hasDuplicates: boolean
  types: SchemaTypeObj[]
}

export type MongoSchemaObj = {
  count: number
  fields: SchemaFieldObj[]
}
