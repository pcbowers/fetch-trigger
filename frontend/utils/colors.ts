import { colors as colorsObject } from "@airtable/blocks/ui"

export type Color = typeof colors[number]

export const colors = Object.values(colorsObject)
