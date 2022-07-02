import { CollaboratorData } from "@airtable/blocks/dist/types/src/types/collaborator"

import type { Permission } from "./permissions"
import type { HeadingSize } from "./headings"
import type { TextSize } from "./texts"
import type { Color } from "./colors"
import type { Icon } from "./icons"
import type { Method } from "./methods"
import type { DataType } from "./dataTypes"

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
  webhookDataType: DataType
  webhookDataTable: string | null
  webhookDataView: string | null
  webhookDataManual: string
  webhookDataCells: boolean
  webhookPath: boolean
  webhookMethod: Method
  webhookHeaders: string
  responseSuccess: string
  responseFail: string
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
  webhookDataManual: "{}",
  webhookDataTable: null,
  webhookDataView: null,
  webhookDataType: "manual",
  webhookDataCells: true,
  webhookPath: true,
  webhookMethod: "POST",
  webhookHeaders: "",
  responseSuccess: "Webhook Triggered Successfully!",
  responseFail:
    "Failed to Trigger Webhook. Try Again?\nPlease ensure your webhook settings are accurate and that your extension has network access."
}
