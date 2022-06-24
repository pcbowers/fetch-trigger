import React, { useState } from "react"
import {
  Box,
  Button,
  colors,
  Heading,
  Text,
  useGlobalConfig,
  colorUtils,
  useSession,
  useBase
} from "@airtable/blocks/ui"
import type GlobalConfig from "@airtable/blocks/dist/types/src/global_config"
import type Session from "@airtable/blocks/dist/types/src/models/session"
import type { CollaboratorData } from "@airtable/blocks/dist/types/src/types/collaborator"
import type Base from "@airtable/blocks/dist/types/src/models/base"

import { defaults, hasConfigPermissions, Permission, Settings } from "@utils"

const color = colorUtils.getHexForColor
const isLightColor = colorUtils.shouldUseLightTextOnColor

const submitHook = async (
  proxy: string,
  params: string,
  body: string,
  method: string,
  headers: string
) => {
  let results

  try {
    const fetchResults = await fetch(proxy + params, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(headers ? JSON.parse(headers) : {})
      },
      ...(body ? { body } : {})
    })
    if (!fetchResults.ok) throw fetchResults

    results = await fetchResults.json()
  } catch (error) {
    results = { error: error }
  }

  return results
}

export const getSettings = (config: GlobalConfig, base: Base): Settings => {
  let settings: Record<string, any> = {}

  let key: keyof Settings
  for (key in defaults) {
    const newValue = config.get(key)
    if (newValue !== undefined) {
      settings[key] = newValue
    } else {
      settings[key] = defaults[key]
      if (hasConfigPermissions(config, base))
        config.setAsync(key, settings[key])
    }
  }

  return settings as Settings
}

const hasPermissions = (
  permission: Permission,
  session: Session,
  base: Base,
  activeCollaborators: CollaboratorData[],
  selectedCollaborators: CollaboratorData[]
) => {
  switch (permission) {
    case "Creator":
      return base.hasPermissionToCreateTable()
    case "Editor":
      return session.hasPermissionToUpdateRecords()
    case "Commenter": //currently no way to differentiate between commenter and read-only
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

const removeOrigin = (url: string, remove: boolean) => {
  try {
    return remove ? new URL(url).pathname : url
  } catch (error) {
    return url
  }
}

let timeout: NodeJS.Timeout

export const AppComponent = () => {
  const config = useGlobalConfig()
  const session = useSession()
  const base = useBase()

  const collaborators = base.activeCollaborators

  const {
    button,
    buttonBlock,
    buttonCenter,
    buttonColor,
    buttonIcon,
    buttonScale,
    containerWidthLarge,
    containerWidthMedium,
    containerWidthSmall,
    containerWidthXSmall,
    description,
    descriptionCenter,
    descriptionSize,
    title,
    titleCenter,
    titleSize,
    webhookProxy,
    webhookLink,
    webhookData,
    webhookPath,
    webhookMethod,
    webhookHeaders,
    permissionRun,
    selectedUsers
  } = getSettings(config, base)

  const enabled = hasPermissions(
    permissionRun,
    session,
    base,
    collaborators,
    selectedUsers
  )

  let [message, setMessage] = useState("")

  const handleClick = () => {
    if (enabled) {
      submitHook(
        webhookProxy,
        removeOrigin(webhookLink, webhookPath),
        webhookData,
        webhookMethod,
        webhookHeaders
      ).then((res) => {
        clearTimeout(timeout)

        if (res && res.success) setMessage("Webhook Triggered Successfully!")
        else
          setMessage(
            "Failed to Trigger Webhook. Try Again?\nPlease ensure your webhook settings are accurate and that your extension has network access."
          )

        timeout = setTimeout(() => setMessage(""), 3000)
      })
    }
  }

  return (
    <Box
      minHeight="100vh"
      padding="1rem"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="row"
    >
      <Box
        width={{
          largeViewport: containerWidthLarge + " !important",
          mediumViewport: containerWidthMedium + " !important",
          smallViewport: containerWidthSmall + " !important",
          xsmallViewport: containerWidthXSmall + " !important"
        }}
        display="flex"
        flexDirection="column"
        style={{ gap: "0.5rem", width: "100%" }}
      >
        {title && (
          <Box
            width="100%"
            display="flex"
            flexDirection="row"
            justifyContent={titleCenter ? "center" : "start"}
          >
            <Heading
              textAlign={titleCenter ? "center" : "left"}
              size={titleSize}
              marginBottom="0"
            >
              {title}
            </Heading>
          </Box>
        )}
        {description && (
          <Box
            width="100%"
            display="flex"
            flexDirection="row"
            justifyContent={descriptionCenter ? "center" : "start"}
          >
            <Text
              size={descriptionSize}
              textAlign={descriptionCenter ? "center" : "left"}
              textColor={color(colors.GRAY_BRIGHT)}
            >
              {description}
            </Text>
          </Box>
        )}
        <Box
          width="100%"
          display="flex"
          flexDirection="row"
          flexWrap={"wrap"}
          justifyContent={buttonCenter ? "center" : "start"}
          marginTop={`calc(18px * ${buttonScale} - 18px + 0.2rem)`}
        >
          <Button
            icon={buttonIcon}
            flexShrink={1}
            variant="default"
            type="button"
            size="large"
            disabled={!enabled}
            maxWidth={`calc(100% / ${buttonScale})`}
            width={buttonBlock ? `calc(100% / ${buttonScale})` : "auto"}
            onClick={handleClick}
            style={{
              transformOrigin: "center center",
              transform: `scale(${buttonScale})`,
              backgroundColor: color(buttonColor),
              color: isLightColor(buttonColor) ? "#ffffff" : "#000000"
            }}
          >
            {button}
          </Button>
          {message && (
            <Text
              flexShrink={0}
              width="100%"
              size="small"
              textColor={color(colors.GRAY_BRIGHT)}
              textAlign="center"
              marginTop={`calc(18px * ${buttonScale} - 18px + 0.2rem)`}
            >
              {message.split("\n").map((line, index, { length }) => (
                <>
                  {line}
                  {index < length - 1 && <br />}
                </>
              ))}
            </Text>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default AppComponent
