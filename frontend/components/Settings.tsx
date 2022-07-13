import {
  Box,
  Button,
  ColorPaletteSynced,
  Dialog,
  FormField,
  Heading,
  Input,
  InputSynced,
  Link,
  SelectSynced,
  Switch,
  SwitchSynced,
  TablePickerSynced,
  Text,
  useBase,
  useGlobalConfig,
  ViewPickerSynced
} from "@airtable/blocks/ui"
import React, { useState, memo, useEffect, useRef } from "react"

import {
  canEdit,
  colors,
  dataTypes,
  defaults,
  getSettings,
  headingSizes,
  icons,
  isCreator,
  methods,
  permissions,
  runIfCanEdit,
  runIfCreator,
  textSizes
} from "@utils"

import Collaborator from "@components/Collaborator"
import Logo from "@components/Logo"

import type { CollaboratorData } from "@airtable/blocks/dist/types/src/types/collaborator"

import type { Settings as SettingsProps } from "@utils"

import "@styles/settings.css"
import Accordion from "./Accordion"

interface SettingsComponentProps {
  setScroll: React.Dispatch<React.SetStateAction<number>>
  scroll: number
  setAccordions: React.Dispatch<
    React.SetStateAction<{ [key: string]: boolean }>
  >
  accordions: { [key: string]: boolean }
}

export const SettingsComponent = ({
  setScroll,
  scroll,
  setAccordions,
  accordions
}: SettingsComponentProps) => {
  const config = useGlobalConfig()
  const base = useBase()
  const collaborators = base.activeCollaborators
  const disabled = !canEdit(config, base)

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [search, setSearch] = useState("")
  const container = useRef<HTMLElement>(null)

  const [permissionEditor, setPermissionEditor] = useState(
    () => getSettings(config, base).permissionEditor
  )
  const { selectedUsers, webhookDataType, webhookDataTable } = getSettings(
    config,
    base
  )

  const handleClick = () => {
    setIsDialogOpen(false)
    runIfCanEdit(config, base, () => {
      let key: keyof SettingsProps
      for (key in defaults) {
        config.setAsync(key, defaults[key] as any)
      }
    })
  }

  const getAccordion = (id: string, initial: boolean = false) =>
    accordions[id] === undefined ? initial : !!accordions[id]

  const handleAccordion =
    (id: string, initial: boolean = false) =>
    () => {
      setAccordions((accordions) => ({
        ...accordions,
        [id]: accordions[id] === undefined ? !initial : !accordions[id]
      }))
    }

  useEffect(() => {
    const curContainer = container.current
    curContainer?.scrollTo(0, scroll)

    return () => {
      setScroll(curContainer?.scrollTop || 0)
    }
  }, [scroll, setScroll])

  const setActiveUsers = (collaborator: CollaboratorData) =>
    runIfCanEdit(config, base, () => {
      if (selectedUsers.some((c) => c.id === collaborator.id)) {
        config.setAsync(
          "selectedUsers",
          selectedUsers.filter((c) => c.id !== collaborator.id) as any
        )
      } else {
        config.setAsync("selectedUsers", [
          ...selectedUsers,
          collaborator
        ] as any)
      }
    })

  const selectAllUsers = () =>
    runIfCanEdit(config, base, () => {
      config.setAsync("selectedUsers", collaborators as any)
    })

  const clearAllUsers = () =>
    runIfCanEdit(config, base, () => {
      config.setAsync("selectedUsers", undefined)
    })

  const onPermissionEditorToggle = (value: boolean) =>
    runIfCreator(base, () => {
      setPermissionEditor(value)
      config.setAsync("permissionEditor", value)
    })

  return (
    <Box
      ref={container}
      padding="1rem"
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      overflowY="auto"
      overflowX="hidden"
    >
      <Box
        display="flex"
        justifyContent="start"
        alignItems="center"
        style={{ gap: "0.5rem" }}
        marginBottom="1rem"
      >
        <Logo style={{ height: "2.5rem", flexShrink: 0 }} />
        <Heading size="xlarge" marginBottom="0">
          Fetch Trigger Settings
        </Heading>
      </Box>
      <Text marginBottom="1rem" textColor="light">
        Change the <strong>Webhook Options</strong> to apply functionality to
        the trigger button. Change setting and trigger permissions using the{" "}
        <strong>Permission Options</strong>. All other options change the layout
        and look of the extension.
      </Text>
      <Button
        icon="redo"
        onClick={() => setIsDialogOpen(true)}
        disabled={disabled}
        marginBottom="1.5rem"
      >
        Reset Defaults
      </Button>

      {isDialogOpen && (
        <Dialog onClose={() => setIsDialogOpen(false)} width="320px">
          <Dialog.CloseButton />
          <Heading>Reset Defaults</Heading>
          <Text variant="paragraph">
            Are you sure you want to reset the extension&apos;s settings? This
            will erase any changes you have made to this extension.
          </Text>
          <Box display="flex" style={{ gap: "0.5rem" }}>
            <Button onClick={() => setIsDialogOpen(false)} variant="default">
              Close
            </Button>
            <Button onClick={handleClick} variant="danger">
              Reset All Settings
            </Button>
          </Box>
        </Dialog>
      )}

      <Accordion
        value={getAccordion("webhook", true)}
        onChange={handleAccordion("webhook", true)}
        title="Webhook Options"
        description="Change these settings to set the webhook request that is triggered by
        this extension when run."
      >
        <FormField
          label="Webhook Link"
          description="The airtable webhook (or any other webhook) to pass to the webhook proxy. This will be appended to the proxy link."
        >
          <InputSynced
            globalConfigKey="webhookLink"
            type="text"
            disabled={disabled}
            placeholder={defaults.webhookLink}
          />
        </FormField>
        <FormField
          label="Webhook Proxy"
          description="Airtable Webhooks currently require a CORS proxy. Define the proxy endpoint here. If you are using other webhooks, feel free to leave this empty."
        >
          <InputSynced
            globalConfigKey="webhookProxy"
            type="text"
            disabled={disabled}
            placeholder={defaults.webhookProxy}
          />
        </FormField>
        <FormField
          label="Webhook Data Type"
          description="The type of data that will be passed to the webhook."
        >
          <SelectSynced
            options={dataTypes as any}
            globalConfigKey="webhookDataType"
            disabled={disabled}
          />
        </FormField>
        {webhookDataType === "manual" && (
          <FormField
            label="Manual Data"
            description="The JSON data to pass with your webhook. Leave empty if no body should be passed."
          >
            <InputSynced
              globalConfigKey="webhookDataManual"
              type="text"
              disabled={disabled}
              placeholder={defaults.webhookDataManual}
            />
          </FormField>
        )}
        {webhookDataType === "cells" && (
          <FormField
            label="Display Cursor Selection"
            description="This data type allows you to convert the current cursor selection into JSON and send it with the webhook request. Toggle this on to display a visual representation of the selection under the button."
          >
            <SwitchSynced
              globalConfigKey="webhookDataCells"
              disabled={disabled}
              label="Wether or not the current selection should be displayed."
            />
          </FormField>
        )}
        {(webhookDataType === "table" || webhookDataType === "view") && (
          <FormField
            label="Table Data"
            description={
              webhookDataType === "table" ? (
                <>
                  The Table that will be converted into JSON to pass with your
                  webhook. Select none if no body should be passed. This could
                  be very large, so use at your own risk.
                </>
              ) : (
                <>
                  The Table that will filter the available views that can be
                  selected. Select none if no body should be passed. This could
                  be very large, so use at your own risk.
                </>
              )
            }
          >
            <TablePickerSynced
              globalConfigKey="webhookDataTable"
              shouldAllowPickingNone={true}
              disabled={disabled}
            />
          </FormField>
        )}
        {webhookDataType === "view" && webhookDataTable && (
          <FormField
            label="View Data"
            description="The View that will be converted into JSON to pass with your webhook. Select none if no body should be passed."
          >
            <ViewPickerSynced
              table={base.getTableByIdIfExists(webhookDataTable)}
              globalConfigKey="webhookDataView"
              shouldAllowPickingNone={true}
              disabled={disabled}
            />
          </FormField>
        )}
        <FormField
          label="Pathname Only"
          description="Some CORS proxies are set up with an explicit upstream and thus do not accept the origin of the URL. While the webhook can be modified, this setting allows you to easily remove 'https://hooks.airtable.com' or any origin from the link so just the path is appended to the proxy."
        >
          <SwitchSynced
            globalConfigKey="webhookPath"
            disabled={disabled}
            label="Wether or not the origin of the webhook link should be removed."
          />
        </FormField>
        <FormField
          label="Webhook Headers"
          description="By default, the only header that is passed is the Content-Type header set to 'application/json'. Override this with your own header object using this setting."
        >
          <InputSynced
            globalConfigKey="webhookHeaders"
            type="text"
            disabled={disabled}
            placeholder={defaults.webhookHeaders}
          />
        </FormField>
        <FormField
          label="Webhook Method"
          description="The HTTP request method to use when calling the webhook."
        >
          <SelectSynced
            options={methods as any}
            globalConfigKey="webhookMethod"
            disabled={disabled}
          />
        </FormField>
      </Accordion>

      <Accordion
        value={getAccordion("response")}
        onChange={handleAccordion("response")}
        title="Response Options"
        description="Change these settings to make changes to the response after the webhook is triggered."
      >
        <FormField
          label="Response Length"
          description="The number of milliseconds before the message displayed after the trigger should disappear."
        >
          <InputSynced
            globalConfigKey="responseLength"
            disabled={disabled}
            type="number"
            min="100"
            step="100"
            placeholder={defaults.responseLength}
          />
        </FormField>
        <FormField
          label="Successful Message"
          description={
            <>
              The text displayed after the webhook triggers successfully. Use
              the string <code>[response]</code> to embed the body of the
              webhook response within the message. If the data is JSON, it will
              be converted into a string.
            </>
          }
        >
          <InputSynced
            globalConfigKey="responseSuccess"
            type="text"
            disabled={disabled}
            placeholder={defaults.responseSuccess}
          />
        </FormField>
        <FormField
          label="Failure Message"
          description="The text displayed if the webhook trigger fails."
        >
          <InputSynced
            globalConfigKey="responseFail"
            type="text"
            disabled={disabled}
            placeholder={defaults.responseFail}
          />
        </FormField>
      </Accordion>

      <Accordion
        value={getAccordion("permission")}
        onChange={handleAccordion("permission")}
        title="Permission Options"
        description="Change these settings to make changes to the setting and trigger permissions."
      >
        <FormField
          label="Editor Permissions"
          description="Allow editors to make changes to this extension's settings. Only creators are able to disable this setting."
        >
          <Switch
            value={permissionEditor}
            onChange={onPermissionEditorToggle}
            disabled={!isCreator(base)}
            label="Whether or not editors are able to view and edit this extension's settings."
          />
        </FormField>
        <FormField
          label="Trigger Permissions"
          description="Who has the ability to run the webhook. Note that this is inclusive (i.e. choosing Editor includes Editors and Creators)."
        >
          <SelectSynced
            options={permissions as any}
            globalConfigKey="permissionTrigger"
            disabled={disabled}
          />
        </FormField>
        {config.get("permissionTrigger") === "Specific" && (
          <FormField
            label="Specific Users"
            description="Only these users will be able to run the webhook from this extension."
          >
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value.toLowerCase())}
              type="search"
              disabled={disabled}
              placeholder={"Find a user"}
            />
            <Box
              display="flex"
              maxHeight="80vh"
              overflowY="auto"
              flexDirection="column"
              marginTop="0.5rem"
              style={{ gap: "0.2rem" }}
            >
              {canEdit(config, base) &&
                collaborators
                  .filter(
                    (collaborator) =>
                      collaborator.email.toLowerCase().includes(search) ||
                      collaborator.name?.toLowerCase().includes(search) ||
                      !search
                  )
                  .map((collaborator) => (
                    <Collaborator
                      key={collaborator.id}
                      collaborator={collaborator}
                      active={selectedUsers.some(
                        (c) => c.id === collaborator.id
                      )}
                      setActive={setActiveUsers}
                    />
                  ))}
            </Box>
            <Box display="flex" style={{ gap: "1rem" }} marginTop="0.5rem">
              <Link
                size="small"
                href=""
                variant="dark"
                style={{ cursor: "pointer" }}
                onClick={selectAllUsers}
              >
                Select All
              </Link>
              <Link
                size="small"
                href=""
                variant="dark"
                style={{ cursor: "pointer" }}
                onClick={clearAllUsers}
              >
                Clear All
              </Link>
            </Box>
          </FormField>
        )}
      </Accordion>

      <Accordion
        value={getAccordion("button")}
        onChange={handleAccordion("button")}
        title="Button Options"
        description="Change these settings to alter the trigger button's text and styles."
      >
        <FormField
          label="Button"
          description="The text displayed within the button."
        >
          <InputSynced
            globalConfigKey="button"
            type="text"
            disabled={disabled}
            placeholder={defaults.button}
          />
        </FormField>
        <FormField label="Button Block Width">
          <SwitchSynced
            globalConfigKey="buttonBlock"
            disabled={disabled}
            label="Whether or not the button takes up the entire width."
          />
        </FormField>
        <FormField label="Button Centered">
          <SwitchSynced
            globalConfigKey="buttonCenter"
            disabled={disabled}
            label="Whether or not the button is centered."
          />
        </FormField>
        <FormField
          label="Button Icon"
          description="The icon displayed within the button."
        >
          <SelectSynced
            options={icons}
            globalConfigKey="buttonIcon"
            disabled={disabled}
          />
        </FormField>
        <FormField label="Button Color" description="The color of the button.">
          <ColorPaletteSynced
            globalConfigKey="buttonColor"
            disabled={disabled}
            allowedColors={colors}
          />
        </FormField>
        <FormField
          label="Button Scale"
          description="The amount by which the button should be scaled in size."
        >
          <InputSynced
            globalConfigKey="buttonScale"
            disabled={disabled}
            type="number"
            min="0.5"
            step="0.1"
            placeholder={defaults.buttonScale}
          />
        </FormField>
      </Accordion>

      <Accordion
        value={getAccordion("container")}
        onChange={handleAccordion("container")}
        title="Container Options"
        description="Change these settings to alter the container's padding."
      >
        <FormField
          label="Large Width"
          description="The width of the container when the extension has a large viewport."
        >
          <InputSynced
            globalConfigKey="containerWidthLarge"
            type="text"
            disabled={disabled}
            placeholder={defaults.containerWidthLarge}
          />
        </FormField>
        <FormField
          label="Medium Width"
          description="The width of the container when the extension has a medium viewport."
        >
          <InputSynced
            globalConfigKey="containerWidthMedium"
            type="text"
            disabled={disabled}
            placeholder={defaults.containerWidthMedium}
          />
        </FormField>
        <FormField
          label="Small Width"
          description="The width of the container when the extension has a small viewport."
        >
          <InputSynced
            globalConfigKey="containerWidthSmall"
            type="text"
            disabled={disabled}
            placeholder={defaults.containerWidthSmall}
          />
        </FormField>
        <FormField
          label="XSmall Width"
          description="The width of the container when the extension has an xsmall viewport."
        >
          <InputSynced
            globalConfigKey="containerWidthXSmall"
            type="text"
            disabled={disabled}
            placeholder={defaults.containerWidthXSmall}
          />
        </FormField>
      </Accordion>

      <Accordion
        value={getAccordion("title")}
        onChange={handleAccordion("title")}
        title="Title Options"
        description="Change these settings to alter the title's text and styles."
      >
        <FormField
          label="Title"
          description="The title displayed above the button."
        >
          <InputSynced
            globalConfigKey="title"
            type="text"
            disabled={disabled}
            placeholder={defaults.title}
          />
        </FormField>
        <FormField label="Title Centered">
          <SwitchSynced
            globalConfigKey="titleCenter"
            disabled={disabled}
            label="Whether or not the title is centered."
          />
        </FormField>
        <FormField label="Title Size" description="The size of the title.">
          <SelectSynced
            options={headingSizes as any}
            globalConfigKey="titleSize"
            disabled={disabled}
          />
        </FormField>
      </Accordion>

      <Accordion
        value={getAccordion("description")}
        onChange={handleAccordion("description")}
        title="Description Options"
        description="Change these settings to alter the description's text and styles."
      >
        <FormField
          label="Description"
          description={
            <>
              The description displayed above the button. Supports a limited set
              of markdown (bold, italic, code, link, hr, and \n conversion). If
              you are unfamiliar with markdown, you may want to try this{" "}
              <Link
                href="https://commonmark.org/help/tutorial/index.html"
                target="_blank"
              >
                Markdown Tutorial
              </Link>
              .
            </>
          }
        >
          <InputSynced
            globalConfigKey="description"
            type="text"
            disabled={disabled}
            placeholder={defaults.description}
          />
        </FormField>
        <FormField label="Description Centered">
          <SwitchSynced
            globalConfigKey="descriptionCenter"
            disabled={disabled}
            label="Whether or not the description is centered."
          />
        </FormField>
        <FormField
          label="Description Size"
          description="The size of the description."
        >
          <SelectSynced
            options={textSizes as any}
            globalConfigKey="descriptionSize"
            disabled={disabled}
          />
        </FormField>
      </Accordion>
    </Box>
  )
}

export const Settings = memo(SettingsComponent)

export default Settings
