export interface EntityConfig {
  route: string
  logMessage: string
}

export type MonitoredEntities = Record<string, EntityConfig>
