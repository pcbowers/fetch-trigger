import View from "@airtable/blocks/dist/types/src/models/view"
import { useBase, useRecords, useViewMetadata } from "@airtable/blocks/ui"
import { recordsToJSON } from "@utils"
import React, { useEffect } from "react"

interface TableDataComponentProps {
  tableId: string | null
  viewId: string | null
  setData: (json: string) => void
}

interface SelectRecordsComponentProps {
  setData: (json: string) => void
  view: View
}

const SelectRecords = ({ setData, view }: SelectRecordsComponentProps) => {
  const viewMetaData = useViewMetadata(view)
  const fields = viewMetaData.visibleFields
  const records = useRecords(view, { fields })

  useEffect(() => {
    setData(recordsToJSON(records, fields))
  }, [fields, records, setData])

  return <></>
}

const TableDataComponent = ({
  tableId,
  setData,
  viewId
}: TableDataComponentProps) => {
  const base = useBase()
  const table = base.getTableByIdIfExists(tableId || "")
  const view = table?.getViewByIdIfExists(viewId || "")

  useEffect(() => {
    if (!table || !view) {
      setData("{}")
    }
  }, [table, view, setData])

  return <>{table && view && <SelectRecords setData={setData} view={view} />}</>
}

export const ViewData = TableDataComponent

export default ViewData
