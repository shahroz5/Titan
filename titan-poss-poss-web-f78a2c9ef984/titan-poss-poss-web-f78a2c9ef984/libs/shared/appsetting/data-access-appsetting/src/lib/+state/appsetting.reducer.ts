import { AppsettingAction, AppsettingActionTypes } from './appsetting.actions';
import { AppsettingsState } from '@poss-web/shared/models';
import { LIGHT_THEME } from './appsetting.state';

export const initialState: AppsettingsState = {
  language: 'en-US',
  theme: LIGHT_THEME,
  pageSize: 10,
  pageSizeOptions: [5, 10, 25, 50],
  //storeType: '',
  // status: '',
  dateFormat: 'DD-MMM-YYYY',
  timeFormat: 'HH:mm A',
  storeType: '',
  maxFilterLimit: 10,
  maxSortLimit: 1,
  maxProductInList: 50,
  mobileNoMaxLength: 10,
  maxLimitForCheckboxGrid: 20,
  hostName: '',
  blockSetting: false
};

export function appsettingReducer(
  state: AppsettingsState = initialState,
  action: AppsettingAction
): AppsettingsState {
  switch (action.type) {
    case AppsettingActionTypes.CHANGE_LANGUAGE: {
      state = {
        ...state,
        language: action.payload.language
      };
      break;
    }
    case AppsettingActionTypes.CHANGE_THEME: {
      state = {
        ...state,
        theme: action.payload.theme
      };
      break;
    }
    case AppsettingActionTypes.CHANGE_STORETYPE: {
      state = {
        ...state,
        storeType: action.payload.storetype
      };
      break;
    }
    case AppsettingActionTypes.CHANGE_HOSTNAME: {
      state = {
        ...state,
        hostName: action.payload.hostName
      };
      break;
    }

    case AppsettingActionTypes.CHANGE_COPY_PASTE_SETTING: {
      state = {
        ...state,
        blockSetting: action.payload.value
      };
      break;
    }
  }
  return state;
}
