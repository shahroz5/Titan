import { createSelector } from '@ngrx/store';

import { printerConfigurationState } from './printer-config.reducers';
import { PrinterConfigSelector } from './printer-config.entity';

const selectDocTypes = createSelector(
  printerConfigurationState,
  state => state.docType
);

const selectTotalElements = createSelector(
  printerConfigurationState,
  state => state.totalCount
);

const printerList = createSelector(
  printerConfigurationState,
  state => state.printerList
);

const printerNames = createSelector(
  printerConfigurationState,
  state => state.printernameList
);
const selectPrinterList = createSelector(
  printerList,
  PrinterConfigSelector.selectAll
);

const selectHasError = createSelector(
  printerConfigurationState,
  state => state.hasError
);

const selectIsLoading = createSelector(
  printerConfigurationState,
  state => state.isLoading
);

export const printerConfigurationSelectors = {
  selectDocTypes,
  selectHasError,
  printerNames,
  selectIsLoading,
  selectPrinterList,
  selectTotalElements
};
