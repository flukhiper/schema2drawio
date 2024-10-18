import type { ArrowType, MxCellStyle } from '../models/MxCell'
import MxCell from '../models/MxCell'
import MxGeometry from '../models/MxGeometry'

export type Field = {
  name: string
  type: string
  nullable?: string
  indexed?: string
  default?: string
  extra?: string
  value?: string
  description?: string
}

export interface TableProps {
  name: string
  x?: number
  y?: number
  width?: number
  height?: number
}

export default class Table {
  private name: string
  private fields: Record<string, Field>
  private x: number
  private y: number
  private width: number
  private height: number
  private subTables?: Record<string, Table>
  private referrerField?: string
  private referrerType?: ArrowType

  private rowWidth: number = 800
  private rowHeight: number = 30
  private padding: number = 100

  constructor({ name, x = 0, y = 0, width = this.rowWidth, height = this.rowHeight }: TableProps) {
    this.name = name
    this.fields = {}
    this.x = x
    this.y = y
    this.width = width
    this.height = height
  }

  getName(): string {
    return this.name
  }

  setReferrerField(fieldName: string): void {
    this.referrerField = fieldName
  }

  setReffererType(type: ArrowType): void {
    this.referrerType = type
  }

  addField(field: Field): void {
    this.fields[field.name] = field
    this.height += this.rowHeight
  }

  addSubTable(fieldName: string, tableName: string, referrerType: ArrowType = 'ERmandOne'): void {
    if (!this.subTables) {
      this.subTables = {}
    }
    this.subTables[fieldName] = new Table({
      name: tableName,
      x: this.x + this.width + this.padding,
      y: this.y,
      width: this.rowWidth,
      height: this.rowHeight,
    })
    this.subTables[fieldName].setReferrerField(fieldName)
    this.subTables[fieldName].setReffererType(referrerType)
  }

  addCompletedSubTable(fieldName: string, table: Table, referrerType: ArrowType = 'ERmandOne'): void {
    if (!this.subTables) {
      this.subTables = {}
    }
    this.subTables[fieldName] = table
    this.subTables[fieldName].setReferrerField(fieldName)
    this.subTables[fieldName].setReffererType(referrerType)
  }

  getSubTable(fieldName: string): Table | undefined {
    return this.subTables?.[fieldName]
  }

  getTotalHeight(): number {
    let totalHeight = this.height
    if (this.subTables) {
      const subTableValues = Object.values(this.subTables)
      const totalSubTablesHeight = subTableValues.reduce((acc, table) => acc + table.getTotalHeight(), 0) + ((subTableValues.length - 1) * this.padding)
      if (totalSubTablesHeight > totalHeight) {
        totalHeight = totalSubTablesHeight
      }
    }
    return totalHeight
  }

  updatePosition(x: number = 0, y: number = 0): void {
    this.x = x
    this.y = y
    if (this.subTables) {
      let latestY = this.y
      Object.values(this.subTables).forEach((table) => {
        const x = this.x + this.width + this.padding
        table.updatePosition(x, latestY)

        latestY += table.getTotalHeight() + this.padding
      })
    }
  }

  toMxCell(canvasCell?: MxCell): MxCell[] {
    const cells: MxCell[] = []
    const headingStyle: MxCellStyle = {
      shape: 'table',
      startSize: 30,
      container: true,
      collapsible: true,
      childLayout: 'tableLayout',
      strokeColor: this.referrerField ? '#666666' : '#6c8ebf',
      fontSize: 12,
      rowLines: false,
      fillColor: this.referrerField ? '#f5f5f5' : '#dae8fc',
      arcSize: 15,
      align: 'center',
      fontStyle: 1,
    }
    const headingCell = new MxCell({ value: this.name, vertex: true, style: headingStyle, parent: canvasCell })
    headingCell.addChild(new MxGeometry({ x: this.x, y: this.y, width: this.width, height: this.height, as: 'geometry' }))
    cells.push(headingCell)

    Object.values(this.fields).forEach((field, index) => {
      const rowStyle: MxCellStyle = {
        shape: 'tableRow',
        horizontal: false,
        startSize: 0,
        swimlaneHead: false,
        swimlaneBody: false,
        strokeColor: 'inherit',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        collapsible: false,
        dropTarget: false,
        fillColor: 'none',
        points: '[[0,0.5],[1,0.5]]',
        portConstraint: 'eastwest',
        fontSize: 16,
      }
      const rowCell = new MxCell({ value: '', vertex: true, style: rowStyle, parent: headingCell })
      rowCell.addChild(new MxGeometry({ y: this.rowHeight * (index + 1), width: this.rowWidth, height: this.rowHeight, as: 'geometry' }))
      cells.push(rowCell)

      const fieldStyle: MxCellStyle = {
        shape: 'partialRectangle',
        html: true,
        whiteSpace: 'wrap',
        connectable: true,
        strokeColor: 'inherit',
        overflow: 'hidden',
        fillColor: 'none',
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        pointerEvents: 1,
        fontSize: 12,
        align: 'left',
        spacingLeft: 5,
        spacingRight: 5,
      }
      const collumnWidth = this.rowWidth / Object.keys(field).length
      Object.values(field).forEach((value, index) => {
        const fieldCell = new MxCell({ value, vertex: true, style: fieldStyle, parent: rowCell })
        fieldCell.addChild(new MxGeometry({ x: collumnWidth * index, width: collumnWidth, height: this.rowHeight, as: 'geometry' }))
        cells.push(fieldCell)
      })

      const subTable = this.subTables?.[field.name]
      if (subTable) {
        const subTableCells = subTable.toMxCell(canvasCell)
        const lineStyle: MxCellStyle = {
          endArrow: subTable.referrerType,
          edgeStyle: 'orthogonalEdgeStyle',
          dashed: true,
          html: true,
          rounded: false,
          endFill: false,
          entryX: 0,
          entryY: 0.1,
          entryDx: 0,
          entryDy: 0,
        }
        const lineCell = new MxCell({ value: '', edge: true, style: lineStyle, parent: canvasCell, source: cells[cells.length - 1], target: subTableCells[0] })
        lineCell.addChild(new MxGeometry({ width: this.width, height: this.height, as: 'geometry' }))
        cells.push(...subTableCells, lineCell)
      }
    })

    return cells
  }
}
