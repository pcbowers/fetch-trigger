export type TextSize = typeof textSizes[number]["value"]

export const textSizes = [
  {
    label: "Default",
    value: "default",
    disabled: false
  },
  {
    label: "Small",
    value: "small",
    disabled: false
  },
  {
    label: "Large",
    value: "large",
    disabled: false
  },
  {
    label: "XLarge",
    value: "xlarge",
    disabled: false
  }
] as const
