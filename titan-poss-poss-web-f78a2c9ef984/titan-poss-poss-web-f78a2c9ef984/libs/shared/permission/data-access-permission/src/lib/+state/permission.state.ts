import {
  CustomErrors,
  ElementLevelPermissionItemModel,
  TransactionCodesModel
} from '@poss-web/shared/models';

export const PERMISSION_FEATURE_KEY = 'permissions';

export interface PermissionState {
  urls: TransactionCodesModel[] | any;
  elements: ElementLevelPermissionItemModel[] | any;
  allowedRoutes: any;
  error: CustomErrors;
  isLoading: boolean;
}
