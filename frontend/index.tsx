import { settingsButton } from "@airtable/blocks"
import {
  initializeBlock,
  useBase,
  useGlobalConfig,
  useWatchable
} from "@airtable/blocks/ui"
import React, { useEffect, useState } from "react"

import { canEdit } from "@utils"

import App from "@components/App"
import Settings from "@components/Settings"

const Root = () => {
  const [isShowingSettings, setIsShowingSettings] = useState(() => true)
  const base = useBase()
  const config = useGlobalConfig()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (canEdit(config, base) && !settingsButton.isVisible) {
      settingsButton.show()
    } else if (!canEdit(config, base) && settingsButton.isVisible) {
      settingsButton.hide()
      if (isShowingSettings) setIsShowingSettings(false)
    }
  })

  useWatchable(settingsButton, "click", () => {
    if (settingsButton.isVisible) setIsShowingSettings((value) => !value)
  })

  // TODO: AT seems to have a bug that causes scroll issues when flip-flopping between settings. Causes a component to scroll to the bottom

  if (isShowingSettings) {
    return <Settings />
  }
  return <App />
}

initializeBlock(() => <Root />)
