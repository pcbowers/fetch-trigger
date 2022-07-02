import Table from "@airtable/blocks/dist/types/src/models/table"
import { useBase, useRecords } from "@airtable/blocks/ui"
import React, { useEffect } from "react"

interface TableDataComponentProps {
  tableId: string | null
  setData: (json: string) => void
}

interface SelectRecordsComponentProps {
  setData: (json: string) => void
  table: Table
}

const SelectRecords = ({ setData, table }: SelectRecordsComponentProps) => {
  const records = useRecords(table)

  useEffect(() => {
    setData(
      JSON.stringify({
        Records: records.map((record) => ({
          "Airtable record ID": record.id,
          "Airtable record URL": record.url,
          "Field values": Object.assign(
            {},
            ...table.fields.map((field) => ({
              [field.name]: record.getCellValue(field)
            }))
          )
        }))
      })
    )
  }, [records, setData, table])
  return <></>
}

const TableDataComponent = ({ tableId, setData }: TableDataComponentProps) => {
  const base = useBase()
  const table = base.getTableByIdIfExists(tableId || "")

  useEffect(() => {
    if (!table) {
      setData("{}")
    }
  }, [table, setData])

  return <>{table && <SelectRecords setData={setData} table={table} />}</>
}

export const TableData = TableDataComponent

export default TableData
