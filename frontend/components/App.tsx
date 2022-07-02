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
import React, { memo, useEffect, useState } from "react"

import { canTrigger, extractPathname, fetchWebhook, getSettings } from "@utils"

import CursorData from "@components/CursorData"
import TableData from "@components/TableData"
import ViewData from "@components/ViewData"
import Markdown from "@components/Markdown"

import "@styles/app.css"

const color = colorUtils.getHexForColor
const isLightColor = colorUtils.shouldUseLightTextOnColor

let timeout: NodeJS.Timeout

export const AppComponent = () => {
  const config = useGlobalConfig()
  const session = useSession()
  const base = useBase()
  const [body, setBody] = useState<string>("{}")

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
    webhookDataType,
    webhookDataManual,
    webhookDataCells,
    webhookDataTable,
    webhookDataView,
    webhookPath,
    webhookMethod,
    webhookHeaders,
    permissionTrigger,
    selectedUsers,
    responseLength,
    responseFail,
    responseSuccess
  } = getSettings(config, base, true)

  useEffect(() => {
    if (webhookDataType === "manual") setBody(webhookDataManual)
  }, [webhookDataManual, webhookDataType])

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
        body: body,
        headers: webhookHeaders,
        method: webhookMethod,
        path: extractPathname(webhookLink, webhookPath)
      }).then((res) => {
        clearTimeout(timeout)

        if (res && res.response) {
          setMessage(responseSuccess.replace(/\[response\]/g, res.response))
        } else {
          setMessage(responseFail)
        }

        timeout = setTimeout(
          () => setMessage(""),
          Number(responseLength) || 5000
        )
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
              width="100%"
              textAlign={titleCenter ? "center" : "left"}
              size={titleSize}
              marginBottom="0"
            >
              <Markdown data={title} />
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
              width="100%"
              size={descriptionSize}
              textAlign={descriptionCenter ? "center" : "left"}
              textColor={color(colors.GRAY_BRIGHT)}
            >
              <Markdown data={description} />
            </Text>
          </Box>
        )}
        <Box
          width="100%"
          display="block"
          textAlign={buttonCenter ? "center" : "left"}
          marginY={`calc(18px * ${buttonScale} - 18px + 0.2rem)`}
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
            <Markdown data={button} />
          </Button>

          <Box
            flexShrink={0}
            marginTop={`calc(18px * ${buttonScale} - 18px + 0.2rem)`}
            width="100%"
            textColor={color(colors.GRAY_BRIGHT)}
            textAlign={buttonCenter ? "center" : "left"}
            fontSize="11px"
          >
            {webhookDataType === "cells" && (
              <Box>
                <CursorData setData={setBody} showHelp={webhookDataCells} />
              </Box>
            )}
            {webhookDataType === "table" && (
              <TableData setData={setBody} tableId={webhookDataTable} />
            )}
            {webhookDataType === "view" && (
              <ViewData
                setData={setBody}
                tableId={webhookDataTable}
                viewId={webhookDataView}
              />
            )}
            {message && (
              <Box
                marginTop={
                  webhookDataType === "cells" && webhookDataCells
                    ? "0.2rem"
                    : "0"
                }
              >
                <Markdown data={message} />
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export const App = memo(AppComponent)

export default App
