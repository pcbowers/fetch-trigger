import Record from "@airtable/blocks/dist/types/src/models/record"
import {
  useBase,
  useCursor,
  useLoadable,
  useRecords,
  useWatchable,
  Box
} from "@airtable/blocks/ui"
import React, { useEffect } from "react"

interface CursorDataComponentProps {
  showHelp: boolean
  setData: (json: string) => void
}

interface SelectRecordsComponentProps {
  setData: (json: string) => void
  viewId: string
  tableId: string
  fieldIds: string[]
  recordIds: string[]
}

const SelectRecordsComponent = ({
  setData,
  viewId,
  tableId,
  fieldIds,
  recordIds
}: SelectRecordsComponentProps) => {
  const isSelected = (record: Record) => recordIds.includes(record.id)

  const base = useBase()
  const table = base.getTableById(tableId)
  const view = table.getViewById(viewId)
  const records = useRecords(view, { fields: fieldIds }).filter(isSelected)

  useEffect(() => {
    setData(
      JSON.stringify({
        Records: records.map((record) => ({
          "Airtable record ID": record.id,
          "Airtable record URL": record.url,
          "Field values": Object.assign(
            {},
            ...fieldIds.map((field) => ({
              [table.getFieldById(field).name]: record.getCellValue(field)
            }))
          )
        }))
      })
    )
  }, [fieldIds, recordIds, records, setData, table])

  return <></>
}

const CursorDataComponent = ({
  showHelp,
  setData
}: CursorDataComponentProps) => {
  const cursor = useCursor()

  useLoadable(cursor)
  useWatchable(cursor, ["selectedRecordIds", "selectedFieldIds"])

  const isCursorSelection =
    cursor.isDataLoaded &&
    !!cursor.activeViewId &&
    !!cursor.activeTableId &&
    !!cursor.selectedRecordIds.length &&
    !!cursor.selectedFieldIds.length

  useEffect(() => {
    if (!isCursorSelection) {
      setData("{}")
    }
  }, [isCursorSelection, setData])

  return (
    <>
      {showHelp && cursor.isDataLoaded && !!cursor.selectedRecordIds.length && (
        <Box>
          <strong>
            {cursor.selectedRecordIds.length} Record
            {cursor.selectedRecordIds.length !== 1 && "s"}
          </strong>{" "}
          and{" "}
          <strong>
            {cursor.selectedFieldIds.length} Field
            {cursor.selectedFieldIds.length !== 1 && "s"}
          </strong>{" "}
          Selected
        </Box>
      )}
      {isCursorSelection && (
        <SelectRecordsComponent
          setData={setData}
          tableId={cursor.activeTableId}
          viewId={cursor.activeViewId}
          fieldIds={cursor.selectedFieldIds}
          recordIds={cursor.selectedRecordIds}
        />
      )}
    </>
  )
}

export const CursorData = CursorDataComponent

export default CursorData
