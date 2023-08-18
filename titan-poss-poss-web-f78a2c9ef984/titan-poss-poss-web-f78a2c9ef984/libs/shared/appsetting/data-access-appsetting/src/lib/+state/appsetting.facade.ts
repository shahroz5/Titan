import { Injectable } from '@angular/core';

import { Store } from '@ngrx/store';

import { appQuery } from './appsetting.selectors';
import { Observable } from 'rxjs';
import {
  ActionSettingChangeStoreType,
  ActionSettingChangeHostName,
  ActionSettingChangeCopyPaste
} from './appsetting.actions';
import { Language, AppsettingsState } from '@poss-web/shared/models';

@Injectable()
export class AppsettingFacade {
  selectedSetting$: Observable<AppsettingsState> = this.store.select(
    appQuery.selectSettings
  );
  selectedLanguage$: Observable<Language> = this.store.select(
    appQuery.selectLanguage
  );
  currentStoreType$: Observable<string> = this.store.select(
    appQuery.selectStoreType
  );

  pageSize$: Observable<number> = this.store.select(appQuery.selectPageSize);
  pageSizeOptions$: Observable<number[]> = this.store.select(
    appQuery.selectPageSizeOptions
  );

  maxFilterLimit$: Observable<number> = this.store.select(
    appQuery.selectMaxFilterLimit
  );

  maxSortLimit$: Observable<number> = this.store.select(
    appQuery.selectMaxSortLimit
  );

  maxProductInList$: Observable<number> = this.store.select(
    appQuery.selectMaxProductInList
  );

  dateFormat$: Observable<string> = this.store.select(
    appQuery.selectDateFormat
  );

  mobileMaxLength$: Observable<number> = this.store.select(
    appQuery.selectMobileMaxlength
  );

  maxLimitForCheckboxGrid$: Observable<number> = this.store.select(
    appQuery.selectmaxLimitForCheckboxGrid
  );

  timeFormat$: Observable<string> = this.store.select(
    appQuery.selectTimeFormat
  );

  blockCopyPasteSetting$: Observable<boolean> = this.store.select(
    appQuery.selectBlockSetting
  );
  getHostName$: Observable<string> = this.store.select(appQuery.selectHostName);

  constructor(private store: Store<AppsettingsState>) {}

  getTimeFormat(): Observable<string> {
    return this.timeFormat$;
  }

  getLanguage(): Observable<Language> {
    return this.selectedLanguage$;
  }
  getSetting(): Observable<AppsettingsState> {
    return this.selectedSetting$;
  }
  getStoreType(): Observable<string> {
    return this.currentStoreType$;
  }

  getPageSize(): Observable<number> {
    return this.pageSize$;
  }
  getPageSizeOptions(): Observable<number[]> {
    return this.pageSizeOptions$;
  }

  getMaxFilterLimit(): Observable<number> {
    return this.maxFilterLimit$;
  }

  getMaxSortLimit(): Observable<number> {
    return this.maxSortLimit$;
  }

  getMaxProductInList(): Observable<number> {
    return this.maxProductInList$;
  }

  getDateFormat(): Observable<string> {
    return this.dateFormat$;
  }

  getMobileMaxLength(): Observable<number> {
    return this.mobileMaxLength$;
  }

  getmaxLimitForCheckboxGrid(): Observable<number> {
    return this.maxLimitForCheckboxGrid$;
  }

  getHostName(): Observable<string> {
    return this.getHostName$;
  }

  setHostName(hostName: string): void {
    this.store.dispatch(new ActionSettingChangeHostName({ hostName }));
  }

  changeStoreType(storetype: string): void {
    this.store.dispatch(new ActionSettingChangeStoreType({ storetype }));
  }

  setBlockCopyPasteSetting(value: boolean) {
    this.store.dispatch(new ActionSettingChangeCopyPaste({ value }));
  }

  getBlockCopyPasteSetting() {
    return this.blockCopyPasteSetting$;
  }
  // changeLoginStatus(status: string): void {
  //   this.store.dispatch(new ActionSettingChangeStatus({ status }));
  // }
}
