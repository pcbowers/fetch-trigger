import { Link } from "@airtable/blocks/ui"
import React from "react"
import ReactMarkdown from "react-markdown"

interface MarkdownComponentProps {
  data: string
}

const MarkdownComponent = ({ data }: MarkdownComponentProps) => {
  return (
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
      {data.replace(/\\n/g, "\n")}
    </ReactMarkdown>
  )
}

export const Markdown = MarkdownComponent

export default Markdown
