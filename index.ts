import * as fs from 'fs'
import * as path from 'path'

import convertFromMongo from './src/utils/convertor/convertFromMongo'
import convertFromMySQL from './src/utils/convertor/convertFromMySQL'

const main = () => {
  const args = process.argv.slice(2)
  if (args.length == 0) {
    console.error('Please provide a file path as an argument.')
    process.exit(1)
  }

  if (args.length == 1) {
    console.error('Please provide a command(mongo|mysql) as the second argument.')
    process.exit(1)
  }

  const directoryPath = args[0]
  if (!fs.existsSync(directoryPath)) {
    console.error(`Directory not found: ${directoryPath}`)
    process.exit(1)
  }
  const files = fs.readdirSync(directoryPath)
  let filterFiles

  const command = args[1]
  switch (command) {
    case 'mongo':
      filterFiles = files.filter(file => path.extname(file) === '.json')
      if (filterFiles.length === 0) {
        console.error(`No JSON files found in directory: ${directoryPath}`)
        process.exit(1)
      }
      convertFromMongo(directoryPath, filterFiles)
      break
    case 'mysql':
      filterFiles = files.filter(file => path.extname(file) === '.txt')
      if (filterFiles.length === 0) {
        console.error(`No TXT files found in directory: ${directoryPath}`)
        process.exit(1)
      }
      convertFromMySQL(directoryPath, filterFiles)
      break
    default:
      console.error(`Unknown command: ${command}`)
      process.exit(1)
  }
}

main()
