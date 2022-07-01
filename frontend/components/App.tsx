import {
  Box,
  Button,
  colors,
  colorUtils,
  Heading,
  Link,
  Text,
  useBase,
  useGlobalConfig,
  useSession
} from "@airtable/blocks/ui"
import ReactMarkdown from "react-markdown"
import React, { memo, useEffect, useState } from "react"

import { canTrigger, extractPathname, fetchWebhook, getSettings } from "@utils"

import CursorData from "@components/CursorData"
import TableData from "@components/TableData"

import "@styles/app.css"
import ViewData from "./ViewData"

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
    selectedUsers
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
              width="100%"
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
              width="100%"
              size={descriptionSize}
              textAlign={descriptionCenter ? "center" : "left"}
              textColor={color(colors.GRAY_BRIGHT)}
            >
              <ReactMarkdown
                allowedElements={["hr", "em", "strong", "code", "br", "a", "p"]}
                skipHtml={true}
                unwrapDisallowed={true}
                linkTarget={"_blank"}
                components={{
                  a({ className, children, href, ...props }) {
                    return (
                      <Link className={className} href={href || ""} {...props}>
                        {children}
                      </Link>
                    )
                  }
                }}
              >
                {description.replace(/\\n/g, "\n")}
              </ReactMarkdown>
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
            {button}
          </Button>

          <Box marginTop={`calc(18px * ${buttonScale} - 18px + 0.2rem)`}>
            <Text
              flexShrink={0}
              width="100%"
              size="small"
              textColor={color(colors.GRAY_BRIGHT)}
              textAlign={buttonCenter ? "center" : "left"}
              style={{ whiteSpace: "pre-line" }}
            >
              {webhookDataType === "cells" && (
                <CursorData setData={setBody} showHelp={webhookDataCells} />
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
              {message && <Box marginTop="0.2rem">{message}</Box>}
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export const App = memo(AppComponent)

export default App
