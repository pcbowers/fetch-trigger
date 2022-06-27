import {
  Box,
  Button,
  colors,
  colorUtils,
  Heading,
  Text,
  useBase,
  useGlobalConfig,
  useSession
} from "@airtable/blocks/ui"
import React, { memo, useState } from "react"

import { canTrigger, extractPathname, fetchWebhook, getSettings } from "@utils"

const color = colorUtils.getHexForColor
const isLightColor = colorUtils.shouldUseLightTextOnColor

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
    permissionTrigger,
    selectedUsers
  } = getSettings(config, base, true)

  const enabled =
    canTrigger(
      permissionTrigger,
      session,
      base,
      collaborators,
      selectedUsers
    ) && webhookLink

  let [message, setMessage] = useState("")

  const handleClick = () => {
    if (enabled) {
      fetchWebhook({
        proxy: webhookProxy,
        body: webhookData,
        headers: webhookHeaders,
        method: webhookMethod,
        path: extractPathname(webhookLink, webhookPath)
      }).then((res) => {
        clearTimeout(timeout)

        if (res && res.success) {
          setMessage("Webhook Triggered Successfully!")
        } else {
          setMessage(
            "Failed to Trigger Webhook. Try Again?\nPlease ensure your webhook settings are accurate and that your extension has network access."
          )
        }
        timeout = setTimeout(() => setMessage(""), 5000)
      })
    }
  }

  return (
    <Box
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
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
          display="block"
          textAlign={buttonCenter ? "center" : "left"}
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
              // Ensures proper alignment with scale
              transform: `translateX(calc(((${buttonScale} - 1) / 2) * ${
                !buttonCenter || (buttonBlock && Number(buttonScale) < 1)
                  ? "100"
                  : "0"
              }%)) scale(${buttonScale})`,
              backgroundColor: color(buttonColor),
              color: isLightColor(buttonColor) ? "#ffffff" : "#000000"
            }}
          >
            {button}
          </Button>
          {message && (
            <Box>
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
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export const App = memo(AppComponent)

export default App
