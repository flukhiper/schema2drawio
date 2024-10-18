export type MxRectangleAttribute = {
  width: string
  height: string
  as: string
}

export type XMLObj = {
  [tagName: string]: XMLObj | XMLObj[] | XMLAttribute | undefined
  attributes?: XMLAttribute
}
export type XMLAttribute = Record<string, XMLAttributeValue>
export type XMLAttributeValue = string | number | boolean | null | undefined
