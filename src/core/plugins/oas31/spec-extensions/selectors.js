/**
 * @prettier
 */
import { Map } from "immutable"
import { createSelector } from "reselect"

import { safeBuildUrl } from "core/utils/url"
import { isOAS31 as isOAS31Helper, onlyOAS31 } from "../helpers"

const map = Map()

export const makeIsOAS31 = (system) =>
  createSelector(() => system.specSelectors.specJson(), isOAS31Helper)

export const webhooks = onlyOAS31(() => (system) => {
  return system.specSelectors.specJson().get("webhooks", map)
})

export const license = () => (system) => {
  return system.specSelectors.info().get("license", map)
}

export const selectLicenseNameField = () => (system) => {
  return system.specSelectors.license().get("name", "License")
}

export const selectLicenseUrlField = () => (system) => {
  return system.specSelectors.license().get("url")
}

export const selectLicenseIdentifierField = onlyOAS31(() => (system) => {
  return system.specSelectors.license().get("identifier")
})

export const makeSelectLicenseUrl = (system) =>
  createSelector(
    () => system.specSelectors.url(),
    () => system.oas3Selectors.selectedServer(),
    () => system.specSelectors.selectLicenseUrlField(),
    (specUrl, selectedServer, url) => {
      if (url) {
        return safeBuildUrl(url, specUrl, { selectedServer })
      }

      return undefined
    }
  )