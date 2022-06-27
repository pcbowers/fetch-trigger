import { Box, Heading, Icon, Link, Text, Tooltip } from "@airtable/blocks/ui"
import React, { useState } from "react"

interface AccordionProps {
  open?: boolean
  title: string
  description: string
  children: React.ReactNode
}

const AccordionComponent: React.FC<AccordionProps> = ({
  open = false,
  title,
  description,
  children
}) => {
  const [visible, setVisible] = useState(open)
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
          onClick={() => setVisible((value) => !value)}
        >
          <Heading size="small" marginBottom="0">
            {title}
          </Heading>
          <Icon name={visible ? "expand" : "collapse"} />
        </Link>
      </Box>

      {visible && <div>{children}</div>}
    </>
  )
}

export const Accordion = AccordionComponent

export default Accordion
