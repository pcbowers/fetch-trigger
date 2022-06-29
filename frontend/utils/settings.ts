import { CollaboratorData } from "@airtable/blocks/dist/types/src/types/collaborator"

import type { Permission } from "./permissions"
import type { HeadingSize } from "./headings"
import type { TextSize } from "./texts"
import type { Color } from "./colors"
import type { Icon } from "./icons"
import type { Method } from "./methods"

export interface Settings {
  permissionTrigger: Permission
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
  buttonIcon: Icon
  webhookLink: string
  webhookProxy: string
  webhookData: string
  webhookPath: boolean
  webhookMethod: Method
  webhookHeaders: string
}

export const defaults: Settings = {
  permissionTrigger: "Editor",
  permissionEditor: true,
  selectedUsers: [],
  containerWidthLarge: "50%",
  containerWidthMedium: "70%",
  containerWidthSmall: "80%",
  containerWidthXSmall: "100%",
  title: "",
  titleCenter: false,
  titleSize: "xlarge",
  description: "",
  descriptionCenter: false,
  descriptionSize: "default",
  button: "Trigger Webhook",
  buttonScale: "1.5",
  buttonBlock: false,
  buttonCenter: true,
  buttonColor: "blueBright",
  buttonIcon: "automations",
  webhookProxy: "",
  webhookLink: "",
  webhookData: "{}",
  webhookPath: true,
  webhookMethod: "POST",
  webhookHeaders: ""
}
