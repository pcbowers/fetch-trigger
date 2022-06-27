import {
  Box,
  CollaboratorToken,
  Switch,
  useBase,
  useGlobalConfig
} from "@airtable/blocks/ui"
import React, { memo } from "react"

import { canEdit, runIfCanEdit } from "@utils"

import type { CollaboratorData } from "@airtable/blocks/dist/types/src/types/collaborator"

export interface CollaboratorProps {
  collaborator: CollaboratorData
  active: boolean
  setActive: (collaborator: CollaboratorData) => void
}

const CollaboratorComponent = ({
  collaborator,
  active,
  setActive
}: CollaboratorProps) => {
  const config = useGlobalConfig()
  const base = useBase()

  const disabled = !canEdit(config, base)

  const handleClick = () =>
    runIfCanEdit(config, base, () => {
      setActive(collaborator)
    })

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
          disabled={disabled}
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

export const Collaborator = memo(CollaboratorComponent)

export default Collaborator
