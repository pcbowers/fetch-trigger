import GlobalConfig from "@airtable/blocks/dist/types/src/global_config"
import Base from "@airtable/blocks/dist/types/src/models/base"
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
  { success: unknown; error: false } | { error: unknown; success: false }
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

    const json = await fetchResults.json()

    return {
      success: json?.success !== undefined ? json.success : json,
      error: false
    }
  } catch (error) {
    return { error: error, success: false }
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
