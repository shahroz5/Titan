import {
  CustomErrors,
  MaxFlatTepConfigDetails,
} from '@poss-web/shared/models';

export class MaxFlatTepConfigState {
  errors?: CustomErrors;
  isLoading?: boolean;
  maxFlatTepConfigDetails: MaxFlatTepConfigDetails;
  updateMaxFlatTepConfigResponse: MaxFlatTepConfigDetails;
}
