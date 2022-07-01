export type DataType = typeof dataTypes[number]["value"]

export const dataTypes = [
  {
    label: "Manual Data Entry",
    value: "manual",
    disabled: false
  },
  {
    label: "Cursor Selected Cells",
    value: "cells",
    disabled: false
  },
  {
    label: "Selected Table",
    value: "table",
    disabled: false
  },
  {
    label: "Selected View",
    value: "view",
    disabled: false
  }
] as const
