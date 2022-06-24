import type { Color } from "@airtable/blocks/dist/types/src/colors"
import GlobalConfig from "@airtable/blocks/dist/types/src/global_config"
import Base from "@airtable/blocks/dist/types/src/models/base"
import { CollaboratorData } from "@airtable/blocks/dist/types/src/types/collaborator"
import type { IconName } from "@airtable/blocks/dist/types/src/ui/icon_config"
import { colors } from "@airtable/blocks/ui"

export type HeadingSize =
  | "small"
  | "default"
  | "large"
  | "xsmall"
  | "xlarge"
  | "xxlarge"

export type TextSize = "small" | "default" | "large" | "xlarge"

export type Method =
  | "GET"
  | "HEAD"
  | "POST"
  | "PUT"
  | "DELETE"
  | "CONNECT"
  | "OPTIONS"
  | "TRACE"
  | "PATCH"

export type Permission =
  | "Creator"
  | "Editor"
  | "Commenter"
  | "Read-only"
  | "Specific"

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
]

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
]

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
]

export const permissions = [
  {
    label: "Creators and up",
    value: "Creator",
    disabled: false
  },
  {
    label: "Editors and up",
    value: "Editor",
    disabled: false
  },
  // Currently no way to differentiate between commenter and read-only.
  // {
  //   label: "Commenters and up",
  //   value: "Commenter",
  //   disabled: false
  // },
  {
    label: "Read-only and up (Everyone)",
    value: "Read-only",
    disabled: false
  },
  {
    label: "Specific users",
    value: "Specific",
    disabled: false
  }
]

const convertObjectToArray = (obj: Record<string, any>) => {
  const res = []
  for (let key in obj) {
    res.push(obj[key])
  }

  return res
}

export const allColors = convertObjectToArray(colors)

const camelToTitle = (camelCase: string) =>
  camelCase
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim()

const iconNamesArray = [
  "android",
  "apple",
  "apps",
  "ascending",
  "attachment",
  "automations",
  "autonumber",
  "barcode",
  "bell",
  "blocks",
  "bold",
  "bolt",
  "boltList",
  "book",
  "calendar",
  "caret",
  "chart",
  "chat",
  "check",
  "checkbox",
  "checkboxChecked",
  "checkboxUnchecked",
  "checklist",
  "chevronDown",
  "chevronLeft",
  "chevronRight",
  "chevronUp",
  "clipboard",
  "code",
  "cog",
  "collapse",
  "collapseSidebar",
  "contacts",
  "count",
  "count1",
  "cube",
  "cursor",
  "day",
  "dayAuto",
  "dedent",
  "descending",
  "dollar",
  "down",
  "download",
  "dragHandle",
  "drive",
  "duplicate",
  "edit",
  "envelope",
  "envelope1",
  "expand",
  "expand1",
  "expandSidebar",
  "feed",
  "file",
  "filter",
  "flag",
  "form",
  "formula",
  "fullscreen",
  "gallery",
  "gantt",
  "gift",
  "grid",
  "grid1",
  "group",
  "heart",
  "help",
  "hide",
  "hide1",
  "history",
  "home",
  "hyperlink",
  "hyperlinkCancel",
  "indent",
  "info",
  "italic",
  "kanban",
  "laptop",
  "left",
  "lightbulb",
  "link",
  "link1",
  "lock",
  "logout",
  "lookup",
  "mapPin",
  "markdown",
  "megaphone",
  "menu",
  "minus",
  "mobile",
  "multicollaborator",
  "multiselect",
  "number",
  "ol",
  "overflow",
  "paint",
  "paragraph",
  "paragraph1",
  "pause",
  "percent",
  "personal",
  "personalAuto",
  "phone",
  "pivot",
  "play",
  "plus",
  "plusFilled",
  "premium",
  "print",
  "public",
  "publish",
  "quote",
  "quote1",
  "radio",
  "radioSelected",
  "redo",
  "redo1",
  "richText",
  "right",
  "rollup",
  "rollup1",
  "rowHeightSmall",
  "rowHeightMedium",
  "rowHeightLarge",
  "rowHeightExtraLarge",
  "search",
  "select",
  "selectCaret",
  "settings",
  "shapes",
  "share",
  "share1",
  "shareWithBolt",
  "show",
  "show1",
  "slack",
  "smiley",
  "sort",
  "stack",
  "star",
  "strikethrough",
  "switcher",
  "tabs",
  "team",
  "teamLocked",
  "text",
  "thumbsUp",
  "time",
  "timeline",
  "toggle",
  "trash",
  "twitter",
  "ul",
  "underline",
  "undo",
  "up",
  "upload",
  "video",
  "view",
  "warning",
  "windows",
  "x"
]

export const iconNames = iconNamesArray.map((icon) => ({
  label: camelToTitle(icon),
  value: icon,
  disabled: false
}))

export const hasConfigPermissions = (config: GlobalConfig, base: Base) => {
  const permissionEditor =
    config.get("permissionEditor") === undefined
      ? !!defaults.permissionEditor
      : !!config.get("permissionEditor")

  return (
    config.hasPermissionToSet() &&
    (base.hasPermissionToCreateTable() || permissionEditor)
  )
}

export interface Settings {
  permissionRun: Permission
  permissionEditor: boolean
  selectedUsers: CollaboratorData[]
  containerWidthLarge: string
  containerWidthMedium: string
  containerWidthSmall: string
  containerWidthXSmall: string
  title: string
  titleCenter: boolean
  titleSize: HeadingSize
  description: string
  descriptionCenter: boolean
  descriptionSize: TextSize
  button: string
  buttonScale: string
  buttonBlock: boolean
  buttonCenter: boolean
  buttonColor: Color
  buttonIcon: IconName
  webhookLink: string
  webhookProxy: string
  webhookData: string
  webhookPath: boolean
  webhookMethod: Method
  webhookHeaders: string
}

export const defaults: Settings = {
  permissionRun: "Editor",
  permissionEditor: true,
  selectedUsers: [],
  containerWidthLarge: "50%",
  containerWidthMedium: "70%",
  containerWidthSmall: "80%",
  containerWidthXSmall: "100%",
  title: "",
  titleCenter: false,
  titleSize: "default",
  description: "",
  descriptionCenter: false,
  descriptionSize: "default",
  button: "Trigger Webhook",
  buttonScale: "1.5",
  buttonBlock: false,
  buttonCenter: true,
  buttonColor: colors.BLUE_BRIGHT,
  buttonIcon: "automations",
  webhookProxy: "",
  webhookLink: "",
  webhookData: "{}",
  webhookPath: true,
  webhookMethod: "POST",
  webhookHeaders: ""
}
