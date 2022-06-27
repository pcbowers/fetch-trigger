import { getSettings } from "./helpers"

import type GlobalConfig from "@airtable/blocks/dist/types/src/global_config"
import type Base from "@airtable/blocks/dist/types/src/models/base"
import type Session from "@airtable/blocks/dist/types/src/models/session"
import type { CollaboratorData } from "@airtable/blocks/dist/types/src/types/collaborator"

export type Permission = typeof permissions[number]["value"]

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
  // * Currently no way to differentiate between commenter and read-only.
  // {
  //    label: "Commenters and up",
  //    value: "Commenter",
  //    disabled: false
  //  },
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
] as const

export const isCreator = (base: Base) => {
  return base.hasPermissionToCreateTable()
}

export const runIfCreator = (base: Base, callback: () => unknown) => {
  if (!base.hasPermissionToCreateTable()) return false

  callback()
  return true
}

export const isEditor = (session: Session, base: Base) => {
  return (
    !base.hasPermissionToCreateTable() && session.hasPermissionToUpdateRecords()
  )
}

export const canEdit = (config: GlobalConfig, base: Base) => {
  const { permissionEditor } = getSettings(config, base)

  return (
    config.hasPermissionToSet() &&
    (base.hasPermissionToCreateTable() || permissionEditor)
  )
}

export const runIfCanEdit = (
  config: GlobalConfig,
  base: Base,
  callback: () => unknown
) => {
  if (!canEdit(config, base)) return false

  callback()
  return true
}

export const canTrigger = (
  permission: Permission,
  session: Session,
  base: Base,
  activeCollaborators: CollaboratorData[],
  selectedCollaborators: CollaboratorData[]
) => {
  switch (permission) {
    case "Creator":
      return isCreator(base)
    case "Editor":
      return isEditor(session, base) || isCreator(base)
    // * Currently no way to differentiate between commenter and read-only.
    // case "Commenter":
    case "Read-only":
      return true
    case "Specific":
    default:
      return (
        selectedCollaborators.some((c) => c.id === session.currentUser?.id) &&
        activeCollaborators.some((c) => c.id === session.currentUser?.id)
      )
  }
}

export const runIfCanTrigger = (
  permission: Permission,
  session: Session,
  base: Base,
  activeCollaborators: CollaboratorData[],
  selectedCollaborators: CollaboratorData[],
  callback: () => unknown
) => {
  if (
    !canTrigger(
      permission,
      session,
      base,
      activeCollaborators,
      selectedCollaborators
    )
  )
    return false

  callback()
  return true
}
