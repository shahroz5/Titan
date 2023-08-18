export interface UpgradeVersion {
  id: string;
  locationCode: string;
  status: string;
  possUiVersion: string;
  possServiceVersion: string;
  databaseVersion: string;
  upgradeAvailable: boolean;
}

export interface UpgradeVersionResponse {
  versionId: string;
  versionUpgradeMessage: string;
}
