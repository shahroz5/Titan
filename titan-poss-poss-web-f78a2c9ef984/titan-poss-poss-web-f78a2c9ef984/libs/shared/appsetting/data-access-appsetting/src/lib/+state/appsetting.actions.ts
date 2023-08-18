import { Action } from '@ngrx/store';
import { Language } from '@poss-web/shared/models';

export enum AppsettingActionTypes {
  CHANGE_LANGUAGE = '[Settings] Change Language',
  CHANGE_THEME = '[Settings] Change Theme',
  CHANGE_STORETYPE = '[Settings] Change StoreType',
  CHANGE_HOSTNAME = '[Settings] Change Hostname',
  CHANGE_STATUS = '[Settings] Change Status',
  CHANGE_COPY_PASTE_SETTING = '[Settings] Change Copy Paste Setting'
}

export class ActionSettingsChangeLanguage implements Action {
  readonly type = AppsettingActionTypes.CHANGE_LANGUAGE;
  constructor(readonly payload: { language: Language }) {}
}

export class ActionSettingsChangeTheme implements Action {
  readonly type = AppsettingActionTypes.CHANGE_THEME;
  constructor(readonly payload: { theme: string }) {}
}
export class ActionSettingChangeStoreType implements Action {
  readonly type = AppsettingActionTypes.CHANGE_STORETYPE;
  constructor(readonly payload: { storetype: string }) {}
}

export class ActionSettingChangeHostName implements Action {
  readonly type = AppsettingActionTypes.CHANGE_HOSTNAME;
  constructor(readonly payload: { hostName: string }) {}
}

export class ActionSettingChangeStatus implements Action {
  readonly type = AppsettingActionTypes.CHANGE_STATUS;
  constructor(readonly payload: { status: string }) {}
}
export class ActionSettingChangeCopyPaste {
  readonly type = AppsettingActionTypes.CHANGE_COPY_PASTE_SETTING;
  constructor(readonly payload: { value: boolean }) {}
}

export type AppsettingAction =
  | ActionSettingsChangeLanguage
  | ActionSettingsChangeTheme
  | ActionSettingChangeCopyPaste
  | ActionSettingChangeStoreType
  | ActionSettingChangeHostName
  | ActionSettingChangeStatus;
