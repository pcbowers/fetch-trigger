import React, { useEffect, useState } from "react"
import {
  initializeBlock,
  useBase,
  useGlobalConfig,
  useSession,
  useWatchable
} from "@airtable/blocks/ui"
import { settingsButton } from "@airtable/blocks"

import Settings from "./Settings"
import App, { getSettings } from "./App"

const Root = () => {
  const [isShowingSettings, setIsShowingSettings] = useState(false)
  const base = useBase()
  const session = useSession()
  const config = useGlobalConfig()
  const { permissionEditor } = getSettings(config, base)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (
      (base.hasPermissionToCreateTable() ||
        (permissionEditor && session.hasPermissionToUpdateRecords())) &&
      !settingsButton.isVisible
    ) {
      settingsButton.show()
    } else if (
      !base.hasPermissionToCreateTable() &&
      ((!session.hasPermissionToCreateRecords() && permissionEditor) ||
        !permissionEditor) &&
      settingsButton.isVisible
    ) {
      settingsButton.hide()
      if (isShowingSettings) setIsShowingSettings(false)
    }
  })

  //TODO: AT seems to have a bug that causes scroll issues when flip-flopping between settings. Causes a component to scroll to the bottom

  useWatchable(settingsButton, "click", () => {
    if (settingsButton.isVisible) setIsShowingSettings((value) => !value)
  })

  if (isShowingSettings) {
    return <Settings />
  }
  return <App />
}

initializeBlock(() => <Root />)
