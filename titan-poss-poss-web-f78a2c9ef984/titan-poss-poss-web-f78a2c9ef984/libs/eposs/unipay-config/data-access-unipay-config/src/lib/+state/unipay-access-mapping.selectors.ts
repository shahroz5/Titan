import { createSelector } from '@ngrx/store';

import { unipayConfigurationState } from './unipay-access-mapping.reducers';
import { unipayAccessMappingSelector } from './unipay-access-mapping.entity';

const selectFileUploadResponse = createSelector(
  unipayConfigurationState,
  state => state.fileUploadResponse
);

const updateResponse = createSelector(
  unipayConfigurationState,
  state => state.updatedAccessList
);
const selectTotalElements = createSelector(
  unipayConfigurationState,
  state => state.totalCount
);

const accesList = createSelector(
  unipayConfigurationState,
  state => state.accessList
);
const selectAccessList = createSelector(
  accesList,
  unipayAccessMappingSelector.selectAll
);

const selectHasError = createSelector(
  unipayConfigurationState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  unipayConfigurationState,
  state => state.isLoading
);

const selectIsErrorLog = createSelector(
  unipayConfigurationState,
  state => state.errorLog
);
export const unipayConfigurationSelectors = {
  selectFileUploadResponse,
  selectHasError,
  selectIsLoading,
  selectAccessList,
  selectTotalElements,
  updateResponse,
  selectIsErrorLog
};
