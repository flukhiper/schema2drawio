import type { XMLAttribute, XMLObj } from '../types/xml'

export default class XMLElement<A = XMLAttribute> {
  id: number
  tagName: string
  children: XMLElement<unknown>[] = []
  attributes?: A

  constructor(tagName: string = 'unknow', attributes?: A) {
    this.id = 0
    this.tagName = tagName
    this.attributes = attributes
  }

  static parseXMLObj(tagName: string, xmlObj: XMLObj): XMLElement {
    const xmlElem = new XMLElement(tagName)
    const { attributes, ...children } = xmlObj

    if (attributes) {
      xmlElem.setAttributes(attributes)
    }

    Object.entries(children).forEach(([key, value]) => {
      const childTagName = key
      const childNodes = Array.isArray(value) ? value : [value]
      childNodes.forEach((child) => {
        const childXmlElem = XMLElement.parseXMLObj(childTagName, child as XMLObj)
        xmlElem.addChild(childXmlElem)
      })
    })

    return xmlElem
  }

  setID(id: number) {
    this.id = id
  }

  addChild<B = XMLAttribute>(child: XMLElement<B>) {
    child.setID(this.children.length)
    this.children.push(child)
  }

  clearChildren() {
    this.children.length = 0
  }

  setAttributes(attributes: A) {
    this.attributes = attributes
  }

  protected formatValue(value: unknown): string {
    return `${typeof value === 'boolean' ? (value ? 1 : 0) : value}`
  }

  toXMLString(): string {
    const attributes = this.attributes ? Object.entries(this.attributes).map(([key, value]) => `${key}="${this.formatValue(value)}"`).join(' ') : ''
    const children = this.children.map(child => child.toXMLString()).join('\n')
    return `<${this.tagName} ${attributes}>${children}</${this.tagName}>`
  }
}
