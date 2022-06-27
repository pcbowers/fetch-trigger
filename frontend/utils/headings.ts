export type HeadingSize = typeof headingSizes[number]["value"]

export const headingSizes = [
  {
    label: "Default",
    value: "default",
    disabled: false
  },
  {
    label: "XSmall",
    value: "xsmall",
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
  },
  {
    label: "XXLarge",
    value: "xxlarge",
    disabled: false
  }
] as const
