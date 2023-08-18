import { createSelector } from '@ngrx/store';

import { razorpayConfigurationState } from './razorpay-access-mapping.reducers';
import { razorpayAccessMappingSelector } from './razorpay-access-mapping.entity';

const selectFileUploadResponse = createSelector(
  razorpayConfigurationState,
  state => state.fileUploadResponse
);

const updateResponse = createSelector(
  razorpayConfigurationState,
  state => state.updatedAccessList
);
const selectTotalElements = createSelector(
  razorpayConfigurationState,
  state => state.totalCount
);

const accesList = createSelector(
  razorpayConfigurationState,
  state => state.accessList
);
const selectAccessList = createSelector(
  accesList,
  razorpayAccessMappingSelector.selectAll
);

const selectHasError = createSelector(
  razorpayConfigurationState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  razorpayConfigurationState,
  state => state.isLoading
);

const selectIsErrorLog = createSelector(
  razorpayConfigurationState,
  state => state.errorLog
);
export const razorpayConfigurationSelectors = {
  selectFileUploadResponse,
  selectHasError,
  selectIsLoading,
  selectAccessList,
  selectTotalElements,
  updateResponse,
  selectIsErrorLog
};
