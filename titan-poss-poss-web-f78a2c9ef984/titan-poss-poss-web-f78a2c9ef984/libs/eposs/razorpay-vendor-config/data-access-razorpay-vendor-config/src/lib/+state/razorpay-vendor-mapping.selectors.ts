import { createSelector } from '@ngrx/store';

import { razorpayVendorMappingSelector } from './razorpay-vendor-mapping.entity';
import { razorpayVendorConfigurationState } from './razorpay-vendor-mapping.reducers';

const selectFileUploadResponse = createSelector(
  razorpayVendorConfigurationState,
  state => state.fileUploadResponse
);

const updateResponse = createSelector(
  razorpayVendorConfigurationState,
  state => state.updatedVendorList
);
const selectTotalElements = createSelector(
  razorpayVendorConfigurationState,
  state => state.totalCount
);

const accesList = createSelector(
  razorpayVendorConfigurationState,
  state => state.vendorList
);
const selectVendorList = createSelector(
  accesList,
  razorpayVendorMappingSelector.selectAll
);

const selectHasError = createSelector(
  razorpayVendorConfigurationState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  razorpayVendorConfigurationState,
  state => state.isLoading
);

const selectIsErrorLog = createSelector(
  razorpayVendorConfigurationState,
  state => state.errorLog
);
export const razorpayVendorConfigurationSelectors = {
  selectFileUploadResponse,
  selectHasError,
  selectIsLoading,
  selectVendorList,
  selectTotalElements,
  updateResponse,
  selectIsErrorLog
};
