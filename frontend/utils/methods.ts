export type Method = typeof methods[number]["value"]

export const methods = [
  {
    label: "GET",
    value: "GET",
    disabled: false
  },
  {
    label: "HEAD",
    value: "HEAD",
    disabled: false
  },
  {
    label: "POST",
    value: "POST",
    disabled: false
  },
  {
    label: "PUT",
    value: "PUT",
    disabled: false
  },
  {
    label: "DELETE",
    value: "DELETE",
    disabled: false
  },
  {
    label: "CONNECT",
    value: "CONNECT",
    disabled: false
  },
  {
    label: "OPTIONS",
    value: "OPTIONS",
    disabled: false
  },
  {
    label: "TRACE",
    value: "TRACE",
    disabled: false
  },
  {
    label: "PATCH",
    value: "PATCH",
    disabled: false
  }
] as const
