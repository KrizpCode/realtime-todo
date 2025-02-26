import { Request } from 'express'

export const getResourceNameFromPath = (req: Request) => {
  const pathParts = req.path.split('/').filter(Boolean)

  if (pathParts.length < 2) return 'Resource'

  let resourceName = pathParts[1].replace(/-/g, ' ')

  if (resourceName.endsWith('s')) {
    resourceName = resourceName.slice(0, -1)
  }

  return resourceName.charAt(0).toUpperCase() + resourceName.slice(1)
}
