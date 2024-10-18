import * as path from 'path'
import * as fs from 'fs'

const readJSONFile = (filePath: string) => {
  const schemaPath = path.resolve(filePath)
  const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf-8'))

  return schema
}

export default readJSONFile
