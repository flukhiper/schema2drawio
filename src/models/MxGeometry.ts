import XMLElement from './XMLElement'

export type MxGeometryAttribute = {
  x?: number
  y?: number
  width?: number
  height?: number
  as?: string
}

export default class MxGeometry extends XMLElement<MxGeometryAttribute> {
  constructor(attributes: MxGeometryAttribute) {
    super('mxGeometry', attributes)
  }

  setX(x: number): void {
    if (this.attributes) {
      this.attributes.x = x
    }
  }

  setY(y: number): void {
    if (this.attributes) {
      this.attributes.y = y
    }
  }

  getHeight(): number {
    return this.attributes?.height || 0
  }

  setHeight(height: number): void {
    if (this.attributes) {
      this.attributes.height = height
    }
  }

  getWidth(): number {
    return this.attributes?.width || 0
  }

  setWidth(width: number): void {
    if (this.attributes) {
      this.attributes.width = width
    }
  }
}
