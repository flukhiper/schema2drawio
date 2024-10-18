import MxCell from '../models/MxCell'
import XMLElement from '../models/XMLElement'
import type Table from './Table'

export default class Database {
  private xmlDocument: XMLElement
  private rootElement: XMLElement
  private blankCell: MxCell
  private canvasCell: MxCell

  private collections: Table[]

  private padding: number = 30

  constructor() {
    this.xmlDocument = new XMLElement('mxGraphModel')
    this.rootElement = new XMLElement('root')
    this.xmlDocument.addChild(this.rootElement)

    this.blankCell = new MxCell()
    this.canvasCell = new MxCell({ parent: this.blankCell })

    this.collections = []
  }

  addCollection(collection: Table): void {
    this.collections.push(collection)
  }

  toXMLString(): string {
    this.rootElement.clearChildren()
    this.rootElement.addChild(this.blankCell)
    this.rootElement.addChild(this.canvasCell)

    let y = 0
    this.collections.forEach((collection) => {
      collection.updatePosition(0, y)
      collection.toMxCell(this.canvasCell).forEach((cell) => {
        this.rootElement.addChild(cell)
      })

      y += collection.getTotalHeight() + this.padding
    })
    return this.xmlDocument.toXMLString()
  }
}
