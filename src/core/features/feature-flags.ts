import { appConfig } from '@/core/config/app.config'

export function isFeatureEnabled(feature: string): boolean {
  return Boolean(appConfig.features[feature])
}

export function getEnabledModules(): string[] {
  return appConfig.enabledModules.filter((moduleId) => {
    const flag = appConfig.features[`${moduleId}Module`]
    return flag === undefined ? true : Boolean(flag)
  })
}

export function getAppName(): string {
  return appConfig.name
}
