import XMLElement from './XMLElement'

export type MxRectangleAttribute = {
  x?: number
  y?: number
  width?: number
  height?: number
  as?: string
}

export default class MxRectangle extends XMLElement<MxRectangleAttribute> {
  constructor(attributes?: MxRectangleAttribute) {
    super('mxRectangle', attributes)
  }
}
