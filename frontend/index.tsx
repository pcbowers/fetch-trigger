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

  // A bug (that to my knowledge resides with AT's extension implementation) causes everything to scroll to the bottom on render.
  // This fixes it, though isn't perfect. It causes a slight flash of content.
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)
  }, [])

  useWatchable(settingsButton, "click", () => {
    if (settingsButton.isVisible) setIsShowingSettings((value) => !value)
  })

  if (isShowingSettings) {
    return <Settings />
  }
  return <App />
}

initializeBlock(() => <Root />)
