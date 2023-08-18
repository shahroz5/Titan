import {
  CustomErrors,
  UpgradeVersion,
  UpgradeVersionResponse
} from '@poss-web/shared/models';

export const UpgradeVersionKey = 'upgrade-version';

export class UpgradeversionState {
  upgradeVersion: UpgradeVersion;
  upgradeVersionResponse: UpgradeVersionResponse;
  errors?: CustomErrors;
  isLoading?: boolean;
}
