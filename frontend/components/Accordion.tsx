import { Box, Heading, Icon, Link, Text, Tooltip } from "@airtable/blocks/ui"
import React from "react"

interface AccordionProps {
  value: boolean
  onChange: () => void
  title: string
  description: string
  children: React.ReactNode
}

const AccordionComponent: React.FC<AccordionProps> = ({
  value,
  title,
  description,
  onChange,
  children
}) => {
  return (
    <>
      <Box
        className="accordion"
        paddingY="0.3rem"
        paddingX="0.1rem"
        borderRadius="3px"
        display="flex"
        alignItems="center"
        style={{ gap: "0.5rem" }}
        marginBottom="0.5rem"
      >
        <Tooltip
          content={() => (
            <Box
              minWidth="200px"
              padding="0.5rem"
              style={{ whiteSpace: "normal" }}
            >
              <Text textColor="white">{description}</Text>
            </Box>
          )}
          placementX={Tooltip.placements.RIGHT}
          placementY={Tooltip.placements.CENTER}
        >
          <Link href="" variant="dark" margin="0" padding="0">
            <Icon name="info" size={14} />
          </Link>
        </Tooltip>
        <Link
          href=""
          variant="dark"
          display="inline-flex"
          flexGrow={1}
          style={{
            cursor: "pointer",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "0.25rem"
          }}
          onClick={onChange}
        >
          <Heading size="small" marginBottom="0">
            {title}
          </Heading>
          <Icon name={value ? "expand" : "collapse"} />
        </Link>
      </Box>

      {value && <div>{children}</div>}
    </>
  )
}

export const Accordion = AccordionComponent

export default Accordion
