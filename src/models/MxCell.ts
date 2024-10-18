import XMLElement from './XMLElement'

export type MxCellAttribute = {
  parent?: MxCell
  source?: MxCell
  target?: MxCell
  value?: string
  style?: MxCellStyle
  vertex?: boolean
  edge?: boolean
}

export type MxCellStyle = {
  shape?: 'table' | 'tableRow' | 'partialRectangle'
  startSize?: number
  container?: boolean
  collapsible?: boolean
  childLayout?: 'tableLayout'
  strokeColor?: '#6c8ebf' | '#666666' | 'inherit'
  fontSize?: number
  rowLines?: boolean
  fillColor?: '#dae8fc' | '#f5f5f5' | 'none'
  arcSize?: number
  align?: 'center' | 'left' | 'right'
  fontStyle?: number
  horizontal?: boolean
  swimlaneHead?: boolean
  swimlaneBody?: boolean
  top?: number
  left?: number
  bottom?: number
  right?: number
  dropTarget?: boolean
  points?: string
  portConstraint?: string
  html?: boolean
  whiteSpace?: 'wrap' | 'nowrap'
  connectable?: boolean
  overflow?: 'hidden' | 'visible'
  pointerEvents?: number
  spacingLeft?: number
  spacingRight?: number
  endArrow?: ArrowType
  edgeStyle?: 'orthogonalEdgeStyle'
  dashed?: boolean
  rounded?: boolean
  endFill?: boolean
  entryX?: number
  entryY?: number
  entryDx?: number
  entryDy?: number
}

export type ArrowType = 'ERmandOne' | 'ERoneToMany' | 'ERzeroToMany'

export default class MxCell extends XMLElement<MxCellAttribute> {
  constructor(attributes?: MxCellAttribute) {
    super('mxCell', attributes)
  }

  private formatStyle(style: MxCellStyle): string {
    return Object.entries(style)
      .map(([key, value]) => `${key}=${this.formatValue(value)}`)
      .join(';')
  }

  private formatAttributes(attributes: MxCellAttribute): string {
    return Object.entries(attributes)
      .map(([key, value]) => {
        if (key === 'parent') {
          return `${key}="${(value as MxCell).id}"`
        }
        else if (key === 'source') {
          return `${key}="${(value as MxCell).id}"`
        }
        else if (key === 'target') {
          return `${key}="${(value as MxCell).id}"`
        }
        else if (key === 'style') {
          return `${key}="${this.formatStyle(value as MxCellStyle)}"`
        }
        return `${key}="${this.formatValue(value)}"`
      })
      .join(' ')
  }

  toXMLString(): string {
    const id = `id="${this.id}"`
    const attributes = this.attributes ? this.formatAttributes(this.attributes) : ''
    const children = this.children.map(child => child.toXMLString()).join('\n')
    return `<${this.tagName} ${id} ${attributes}>${children}</${this.tagName}>`
  }
}
