import { createFeatureSelector } from '@ngrx/store';

import { PrinterConfigurationState } from './printer-config.state';
import {
  PrinterConfigActionTypes,
  PrinterConfigActions
} from './printer-config.actions';
import { PrinterConfigAdapter } from './printer-config.entity';
export const printerConfigurationKey = 'printerConfiguration';

export const printerConfigurationState = createFeatureSelector<
  PrinterConfigurationState
>(printerConfigurationKey);

/**
 * Initial state of the store
 */
export const initialState: PrinterConfigurationState = {
  printer: null,
  printerList: PrinterConfigAdapter.getInitialState(),
  hasError: null,
  docType: [],
  printernameList: [],
  isLoading: false,
  totalCount: 0
};

/**
 * The reducer function which manipulates the store for respective Action
 */
export function printerConfigurationReducer(
  state: PrinterConfigurationState = initialState,
  action: PrinterConfigActions
): PrinterConfigurationState {
  switch (action.type) {
    case PrinterConfigActionTypes.GET_PRINTER_LIST:
    case PrinterConfigActionTypes.ADD_PRINTER:
    case PrinterConfigActionTypes.DELETE_PRINTER:
    case PrinterConfigActionTypes.GET_DOC_TYPE:
  
    case PrinterConfigActionTypes.GET_PRINTER_NAME_LIST:
      return {
        ...state,
        isLoading: true,
        hasError: null
      };

    case PrinterConfigActionTypes.GET_PRINTER_LIST_FAILURE:
    case PrinterConfigActionTypes.GET_DOC_TYPE_FAILURE:

    case PrinterConfigActionTypes.ADD_PRINTER_FAILURE:
    case PrinterConfigActionTypes.GET_PRINTER_NAME_LIST_FAILURE:
    case PrinterConfigActionTypes.DELETE_PRINTER_FAILURE:
      return {
        ...state,
        hasError: action.payload,
        isLoading: false
      };

    case PrinterConfigActionTypes.GET_DOC_TYPE_SUCCESS:
      return {
        ...state,
        isLoading: false,
        docType: action.payload,
        hasError: null
      };
 

    case PrinterConfigActionTypes.GET_PRINTER_NAME_LIST_SUCCESS:
      return {
        ...state,
        printernameList: action.payload,
        isLoading: false,
        hasError: null
      };

    case PrinterConfigActionTypes.GET_PRINTER_LIST_SUCCESS:
      return {
        ...state,
        printerList: PrinterConfigAdapter.setAll(
          action.payload.list,
          state.printerList
        ),
        totalCount: action.payload.count,

        isLoading: false,
        hasError: null
      };

    case PrinterConfigActionTypes.ADD_PRINTER_SUCCESS:
      return {
        ...state,
        printerList: PrinterConfigAdapter.addOne(
          action.payload,
          state.printerList
        ),
        totalCount: +1,

        isLoading: false,
        hasError: null
      };

    case PrinterConfigActionTypes.DELETE_PRINTER_SUCCESS:
      return {
        ...state,
        printerList: PrinterConfigAdapter.updateOne(
          {
            id: action.payload.id,
            changes: {
              printerName: action.payload.printerName
            }
          },

          state.printerList
        ),
        totalCount: -1,

        isLoading: false,
        hasError: null
      };

    case PrinterConfigActionTypes.RESET_RESPONSE:
      return {
        ...state,
        printerList: PrinterConfigAdapter.getInitialState(),
        printer: null,
        hasError: null,
        docType: [],
        isLoading: false,
        totalCount: 0
      };

    default:
      return {
        ...state
      };
  }
}
