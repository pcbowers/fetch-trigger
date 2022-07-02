import GlobalConfig from "@airtable/blocks/dist/types/src/global_config"
import Base from "@airtable/blocks/dist/types/src/models/base"
import Field from "@airtable/blocks/dist/types/src/models/field"
import ATRecord from "@airtable/blocks/dist/types/src/models/record"
import { runIfCanEdit } from "./permissions"

import { defaults, Settings } from "./settings"

export interface FetchWebhookProps {
  proxy: string
  path: string
  body: string
  method: string
  headers: string
}

/**
 * A function that calls a webhook with the provided proxy, path, body, method, and headers.
 */
export const fetchWebhook = async ({
  proxy = "",
  path = "",
  body = "",
  method = "POST",
  headers = ""
}: FetchWebhookProps): Promise<
  { response: string; error: false } | { error: unknown; response: false }
> => {
  try {
    const fetchResults = await fetch(proxy + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(headers ? JSON.parse(headers) : {})
      },
      ...(body ? { body } : {})
    })

    if (!fetchResults.ok) throw fetchResults

    const text = await fetchResults.text()

    return {
      response: text,
      error: false
    }
  } catch (error) {
    return { error: error, response: false }
  }
}

/**
 * Get all of the settings or their respective defaults if not set.
 */
export const getSettings = (
  config: GlobalConfig,
  base: Base,
  updateConfig: boolean = false
): Settings => {
  let settings: Record<string, any> = {}

  let key: keyof Settings
  for (key in defaults) {
    const newValue = config.get(key)
    if (newValue !== undefined) {
      settings[key] = newValue
    } else {
      settings[key] = defaults[key]
      if (updateConfig) {
        runIfCanEdit(config, base, () => {
          config.setAsync(key, settings[key])
        })
      }
    }
  }

  return settings as Settings
}

/**
 * Extracts the pathname from the webhook so it can be attached directly to the proxy without edits.
 */
export const extractPathname = (url: string, remove: boolean) => {
  try {
    return remove ? new URL(url).pathname : url
  } catch (error) {
    return url
  }
}

/**
 * Convert a list of records and fields into a JSON object
 */
export const recordsToJSON = (records: ATRecord[], fields: Field[]) =>
  JSON.stringify({
    Records: records.map((record) => ({
      "Airtable record ID": record.id,
      "Airtable record URL": record.url,
      "Field values": Object.assign(
        {},
        ...fields.map((field) => ({
          [field.name]: record.getCellValue(field)
        }))
      )
    }))
  })
