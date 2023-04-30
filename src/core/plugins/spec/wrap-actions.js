import get from "lodash/get"

export const updateSpec = (ori, {specActions}) => (...args) => {
  ori(...args)
  specActions.parseToJson(...args)
}

export const updateJsonSpec = (ori, {authActions, specActions}) => (...args) => {
  ori(...args)

  specActions.invalidateResolvedSubtreeCache()

  // Trigger resolution of any path-level $refs.
  const [json] = args
  const pathItems = get(json, ["paths"])
  const pathItemKeys = Object.keys(pathItems)

  // cloud auth
  const securityDefinitions = get(json, "securityDefinitions")
  if( securityDefinitions ){
    var authName = undefined
    Object.keys(securityDefinitions).forEach(name => {
      const securityDefinition = securityDefinitions[name]
      if( securityDefinition.type === "oauth2" ){
        authName = name
      }
    })
    if( authName ){
      authActions.tryAuthorizeFromLocalStorage(authName)
    }
  }

  pathItemKeys.forEach(k => {
    const val = get(pathItems, [k])

    if(val.$ref) {
      specActions.requestResolvedSubtree(["paths", k])
    }
  })
}

// Log the request ( just for debugging, shouldn't affect prod )
export const executeRequest = (ori, { specActions }) => (req) => {
  specActions.logRequest(req)
  return ori(req)
}

export const validateParams = (ori, { specSelectors }) => (req) => {
  return ori(req, specSelectors.isOAS3())
}
