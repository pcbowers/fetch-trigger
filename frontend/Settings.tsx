import {
  Box,
  Button,
  CollaboratorToken,
  ColorPaletteSynced,
  FormField,
  Heading,
  Input,
  InputSynced,
  Link,
  SelectSynced,
  Switch,
  SwitchSynced,
  useBase,
  useGlobalConfig
} from "@airtable/blocks/ui"
import React, { useEffect, useState } from "react"
import {
  allColors,
  defaults,
  hasConfigPermissions,
  headingSizes,
  iconNames,
  methods,
  permissions,
  Settings,
  textSizes
} from "@utils"
import type { CollaboratorData } from "@airtable/blocks/dist/types/src/types/collaborator"

import "./settings.css"

interface CollaboratorProps {
  collaborator: CollaboratorData
  active: boolean
  setActive: (collaborator: CollaboratorData) => void
}
const Collaborator = ({
  collaborator,
  active,
  setActive
}: CollaboratorProps) => {
  const config = useGlobalConfig()
  const base = useBase()

  const handleClick = () => {
    if (hasConfigPermissions(config, base)) {
      setActive(collaborator)
    }
  }
  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        alignItems="center"
        className="collaborator"
        borderRadius="3px"
        paddingY="1px"
        style={{ gap: "0.3rem", cursor: "pointer" }}
        onClick={handleClick}
      >
        <Switch
          id={collaborator.id}
          size="small"
          value={active}
          disabled={!hasConfigPermissions(config, base)}
          label=""
          backgroundColor="transparent"
          width="auto"
          style={{ boxShadow: "none", transform: "scale(0.8)" }}
        />
        <CollaboratorToken
          collaborator={collaborator}
          style={{ transform: "scale(1.1)" }}
        />
      </Box>
    </>
  )
}

export const SettingsComponent = () => {
  const config = useGlobalConfig()
  const base = useBase()
  const collaborators = base.activeCollaborators

  // A bug (that to my knowledge resides with AT's extension implementation) causes everything to scroll to the bottom on render.
  // This fixes it, though isn't perfect. It causes a slight flash of content.
  useEffect(() => {
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 0)
  }, [])

  const [search, setSearch] = useState("")
  const [permissionEditor, setPermissionEditor] = useState(
    () => config.get("permissionEditor") as boolean
  )
  const selectedUsers = (config.get("selectedUsers") ||
    []) as CollaboratorData[]

  const handleClick = () => {
    if (hasConfigPermissions(config, base)) {
      let key: keyof Settings
      for (key in defaults) {
        config.setAsync(key, defaults[key] as any)
      }
    }
  }

  const setActiveUsers = (collaborator: CollaboratorData) => {
    if (hasConfigPermissions(config, base)) {
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
    }
  }

  const selectAllUsers = () => {
    if (hasConfigPermissions(config, base)) {
      config.setAsync("selectedUsers", collaborators as any)
    }
  }

  const clearAllUsers = () => {
    if (hasConfigPermissions(config, base)) {
      config.setAsync("selectedUsers", undefined)
    }
  }

  const onPermissionEditorToggle = (value: boolean) => {
    if (base.hasPermissionToCreateTable()) {
      setPermissionEditor(value)
      config.setAsync("permissionEditor", value)
    }
  }

  return (
    <Box padding="1rem">
      <Heading size="xxlarge" marginBottom="0.5rem">
        Settings
      </Heading>
      <Button
        icon="redo"
        onClick={handleClick}
        disabled={!hasConfigPermissions(config, base)}
        marginBottom="0.75rem"
      >
        Reset Defaults
      </Button>

      <Heading size="small" marginBottom="0.5rem">
        Webhook Settings
      </Heading>
      <FormField
        label="Webhook Link"
        description="The airtable webhook (or any other webhook) to pass to the webhook proxy. This will be appended to the proxy link."
      >
        <InputSynced
          globalConfigKey="webhookLink"
          type="text"
          disabled={!hasConfigPermissions(config, base)}
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
          disabled={!hasConfigPermissions(config, base)}
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
          disabled={!hasConfigPermissions(config, base)}
          placeholder={defaults.webhookData}
        />
      </FormField>
      <FormField
        label="Webhook Pathname Only"
        description="Some CORS proxies are set up with an explicit upstream and thus do not accept the origin of the URL. While the webhook can be modified, this setting allows you to easily remove 'https://hooks.airtable.com' or any origin from the link so just the path is appended to the proxy."
      >
        <SwitchSynced
          globalConfigKey="webhookPath"
          disabled={!hasConfigPermissions(config, base)}
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
          disabled={!hasConfigPermissions(config, base)}
          placeholder={defaults.webhookHeaders}
        />
      </FormField>
      <FormField
        label="Webhook Method"
        description="The HTTP request method to use when calling the webhook."
      >
        <SelectSynced
          options={methods}
          globalConfigKey="webhookMethod"
          disabled={!hasConfigPermissions(config, base)}
        />
      </FormField>

      <Heading size="small" marginBottom="0.5rem">
        Permission Settings
      </Heading>
      <FormField
        label="Run Permissions"
        description="Who has the ability to run the webhook. Note that this is inclusive (i.e. choosing Editor includes Editors and Creators)."
      >
        <SelectSynced
          options={permissions}
          globalConfigKey="permissionRun"
          disabled={!hasConfigPermissions(config, base)}
        />
      </FormField>
      {config.get("permissionRun") === "Specific" && (
        <FormField
          label="Specific Users"
          description="Only these users will be able to run the webhook from this extension."
        >
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value.toLowerCase())}
            type="search"
            disabled={!hasConfigPermissions(config, base)}
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
            {hasConfigPermissions(config, base) &&
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
                    active={selectedUsers.some((c) => c.id === collaborator.id)}
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
      <FormField
        label="Editor Permissions"
        description="Allow editors to make changes to this extension's settings. Only creators are able to disable this setting."
      >
        <Switch
          value={permissionEditor}
          onChange={onPermissionEditorToggle}
          disabled={!base.hasPermissionToCreateTable()}
          label="Whether or not editors are able to view and edit this extension's settings."
        />
      </FormField>

      <Heading size="small" marginBottom="0.5rem">
        Container Settings
      </Heading>
      <FormField
        label="Large Width"
        description="The width of the container with a large viewport."
      >
        <InputSynced
          globalConfigKey="containerWidthLarge"
          type="text"
          disabled={!hasConfigPermissions(config, base)}
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
          disabled={!hasConfigPermissions(config, base)}
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
          disabled={!hasConfigPermissions(config, base)}
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
          disabled={!hasConfigPermissions(config, base)}
          placeholder={defaults.containerWidthXSmall}
        />
      </FormField>

      <Heading size="small" marginBottom="0.5rem">
        Title Settings
      </Heading>
      <FormField
        label="Title"
        description="The title displayed above the button."
      >
        <InputSynced
          globalConfigKey="title"
          type="text"
          disabled={!hasConfigPermissions(config, base)}
          placeholder={defaults.title}
        />
      </FormField>
      <FormField label="Title Centered">
        <SwitchSynced
          globalConfigKey="titleCenter"
          disabled={!hasConfigPermissions(config, base)}
          label="Whether or not the title is centered."
        />
      </FormField>
      <FormField label="Title Size" description="The size of the title.">
        <SelectSynced
          options={headingSizes}
          globalConfigKey="titleSize"
          disabled={!hasConfigPermissions(config, base)}
        />
      </FormField>

      <Heading size="small" marginBottom="0.5rem">
        Description Settings
      </Heading>
      <FormField
        label="Description"
        description="The description displayed above the button."
      >
        <InputSynced
          globalConfigKey="description"
          type="text"
          disabled={!hasConfigPermissions(config, base)}
          placeholder={defaults.description}
        />
      </FormField>
      <FormField label="Description Centered">
        <SwitchSynced
          globalConfigKey="descriptionCenter"
          disabled={!hasConfigPermissions(config, base)}
          label="Whether or not the description is centered."
        />
      </FormField>
      <FormField
        label="Description Size"
        description="The size of the description."
      >
        <SelectSynced
          options={textSizes}
          globalConfigKey="descriptionSize"
          disabled={!hasConfigPermissions(config, base)}
        />
      </FormField>

      <Heading size="small" marginBottom="0.5rem">
        Button Settings
      </Heading>
      <FormField
        label="Button"
        description="The text displayed within the button."
      >
        <InputSynced
          globalConfigKey="button"
          type="text"
          disabled={!hasConfigPermissions(config, base)}
          placeholder={defaults.button}
        />
      </FormField>
      <FormField label="Button Block Width">
        <SwitchSynced
          globalConfigKey="buttonBlock"
          disabled={!hasConfigPermissions(config, base)}
          label="Whether or not the button takes up the entire width."
        />
      </FormField>
      <FormField label="Button Centered">
        <SwitchSynced
          globalConfigKey="buttonCenter"
          disabled={!hasConfigPermissions(config, base)}
          label="Whether or not the button is centered."
        />
      </FormField>
      <FormField
        label="Button Icon"
        description="The icon displayed within the button."
      >
        <SelectSynced
          options={iconNames}
          globalConfigKey="buttonIcon"
          disabled={!hasConfigPermissions(config, base)}
        />
      </FormField>
      <FormField label="Button Color" description="The color of the button.">
        <ColorPaletteSynced
          globalConfigKey="buttonColor"
          disabled={!hasConfigPermissions(config, base)}
          allowedColors={allColors}
        />
      </FormField>
      <FormField
        label="Button Scale"
        description="The amount by which the button should be scaled in size."
      >
        <InputSynced
          globalConfigKey="buttonScale"
          disabled={!hasConfigPermissions(config, base)}
          type="number"
          min="0.5"
          step="0.1"
          placeholder={defaults.buttonScale}
        />
      </FormField>
    </Box>
  )
}

export default SettingsComponent
