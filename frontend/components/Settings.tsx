import {
  Box,
  Button,
  ColorPaletteSynced,
  FormField,
  Heading,
  Icon,
  Input,
  InputSynced,
  Link,
  SelectSynced,
  Switch,
  SwitchSynced,
  useBase,
  useGlobalConfig
} from "@airtable/blocks/ui"
import React, { useState, memo } from "react"

import {
  canEdit,
  colors,
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

import CollaboratorComponent from "@components/Collaborator"

import type { CollaboratorData } from "@airtable/blocks/dist/types/src/types/collaborator"

import type { Settings as SettingsProps } from "@utils"

import "@styles/settings.css"

export const SettingsComponent = () => {
  const config = useGlobalConfig()
  const base = useBase()
  const collaborators = base.activeCollaborators
  const disabled = !canEdit(config, base)

  const [search, setSearch] = useState("")

  const [collapseWebhook, setCollapseWebhook] = useState(false)
  const [collapsePermission, setCollapsePermission] = useState(true)
  const [collapseContainer, setCollapseContainer] = useState(true)
  const [collapseTitle, setCollapseTitle] = useState(true)
  const [collapseDescription, setCollapseDescription] = useState(true)
  const [collapseButton, setCollapseButton] = useState(true)

  const [permissionEditor, setPermissionEditor] = useState(
    () => getSettings(config, base).permissionEditor
  )
  const { selectedUsers } = getSettings(config, base)

  const handleClick = () =>
    runIfCanEdit(config, base, () => {
      let key: keyof SettingsProps
      for (key in defaults) {
        config.setAsync(key, defaults[key] as any)
      }
    })

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
      padding="1rem"
      position="absolute"
      top={0}
      bottom={0}
      left={0}
      right={0}
      overflowY="auto"
    >
      <Heading size="xxlarge" marginBottom="0.5rem">
        Webhook Trigger Settings
      </Heading>
      <Button
        icon="redo"
        onClick={handleClick}
        disabled={disabled}
        marginBottom="0.75rem"
      >
        Reset Defaults
      </Button>

      <Link
        href=""
        variant="dark"
        display="flex"
        marginBottom="0.5rem"
        style={{
          cursor: "pointer",
          justifyContent: "start",
          alignItems: "center",
          gap: "0.25rem"
        }}
        onClick={() => setCollapseWebhook((value) => !value)}
      >
        <Icon name={collapseWebhook ? "expand" : "collapse"} />
        <Heading size="small">Webhook Settings</Heading>
      </Link>
      <div style={{ overflow: "hidden" }} data-collapsed={collapseWebhook}>
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
          label="Webhook Data"
          description="The JSON data to pass with your webhook. Leave empty if no body should be passed."
        >
          <InputSynced
            globalConfigKey="webhookData"
            type="text"
            disabled={disabled}
            placeholder={defaults.webhookData}
          />
        </FormField>
        <FormField
          label="Webhook Pathname Only"
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
      </div>

      <Link
        href=""
        variant="dark"
        display="flex"
        marginBottom="0.5rem"
        style={{
          cursor: "pointer",
          justifyContent: "start",
          alignItems: "center",
          gap: "0.25rem"
        }}
        onClick={() => setCollapsePermission((value) => !value)}
      >
        <Icon name={collapsePermission ? "expand" : "collapse"} />
        <Heading size="small">Permission Settings</Heading>
      </Link>
      <div style={{ overflow: "hidden" }} data-collapsed={collapsePermission}>
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
                    <CollaboratorComponent
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
      </div>

      <Link
        href=""
        variant="dark"
        display="flex"
        marginBottom="0.5rem"
        style={{
          cursor: "pointer",
          justifyContent: "start",
          alignItems: "center",
          gap: "0.25rem"
        }}
        onClick={() => setCollapseContainer((value) => !value)}
      >
        <Icon name={collapseContainer ? "expand" : "collapse"} />
        <Heading size="small">Container Settings</Heading>
      </Link>
      <div style={{ overflow: "hidden" }} data-collapsed={collapseContainer}>
        <FormField
          label="Large Width"
          description="The width of the container with a large viewport."
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
          description="The width of the container with a medium viewport."
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
          description="The width of the container with a small viewport."
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
          description="The width of the container with an xsmall viewport."
        >
          <InputSynced
            globalConfigKey="containerWidthXSmall"
            type="text"
            disabled={disabled}
            placeholder={defaults.containerWidthXSmall}
          />
        </FormField>
      </div>

      <Link
        href=""
        variant="dark"
        display="flex"
        marginBottom="0.5rem"
        style={{
          cursor: "pointer",
          justifyContent: "start",
          alignItems: "center",
          gap: "0.25rem"
        }}
        onClick={() => setCollapseTitle((value) => !value)}
      >
        <Icon name={collapseTitle ? "expand" : "collapse"} />
        <Heading size="small">Title Settings</Heading>
      </Link>
      <div style={{ overflow: "hidden" }} data-collapsed={collapseTitle}>
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
      </div>

      <Link
        href=""
        variant="dark"
        display="flex"
        marginBottom="0.5rem"
        style={{
          cursor: "pointer",
          justifyContent: "start",
          alignItems: "center",
          gap: "0.25rem"
        }}
        onClick={() => setCollapseDescription((value) => !value)}
      >
        <Icon name={collapseDescription ? "expand" : "collapse"} />
        <Heading size="small">Description Settings</Heading>
      </Link>
      <div style={{ overflow: "hidden" }} data-collapsed={collapseDescription}>
        <FormField
          label="Description"
          description="The description displayed above the button."
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
      </div>

      <Link
        href=""
        variant="dark"
        display="flex"
        marginBottom="0.5rem"
        style={{
          cursor: "pointer",
          justifyContent: "start",
          alignItems: "center",
          gap: "0.25rem"
        }}
        onClick={() => setCollapseButton((value) => !value)}
      >
        <Icon name={collapseButton ? "expand" : "collapse"} />
        <Heading size="small">Button Settings</Heading>
      </Link>
      <div style={{ overflow: "hidden" }} data-collapsed={collapseButton}>
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
      </div>
    </Box>
  )
}

export const Settings = memo(SettingsComponent)

export default Settings
