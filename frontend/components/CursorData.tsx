import Field from "@airtable/blocks/dist/types/src/models/field"
import Record from "@airtable/blocks/dist/types/src/models/record"
import {
  useBase,
  useCursor,
  useLoadable,
  useRecords,
  useWatchable,
  Box
} from "@airtable/blocks/ui"
import { recordsToJSON } from "@utils"
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
  const base = useBase()
  const table = base.getTableById(tableId)
  const view = table.getViewById(viewId)
  const records = useRecords(view, { fields: fieldIds }).filter(
    (record: Record) => recordIds.includes(record.id)
  )
  const fields = fieldIds
    .map((field) => table.getFieldByIdIfExists(field))
    .filter((field) => field !== null) as Field[]

  useEffect(() => {
    setData(recordsToJSON(records, fields))
  }, [fieldIds, fields, recordIds, records, setData, table])

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
