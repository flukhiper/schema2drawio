import * as path from 'path'
import * as fs from 'fs'
import { XMLParser, XMLValidator, type X2jOptions } from 'fast-xml-parser'
import type { XMLObj } from '../../types/xml'

const readXMLFile = (filePath: string) => {
  const xmlPath = path.resolve(filePath)
  const xmlRaw = fs.readFileSync(xmlPath, 'utf-8')

  if (XMLValidator.validate(xmlRaw)) {
    const options: X2jOptions = {
      ignoreAttributes: false,
      attributeNamePrefix: '',
      attributesGroupName: 'attributes',
    }
    const parser = new XMLParser(options)
    const xml: XMLObj = parser.parse(xmlRaw)

    return xml
  }

  return null
}

export default readXMLFile
