import { Injectable } from '@angular/core';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { Observable } from 'rxjs';
import { Language, AppsettingsState } from '@poss-web/shared/models';

@Injectable({
  providedIn: 'root'
})
export class AppSettingService {
  constructor(private appSettingFacade: AppsettingFacade) {}

  getLanguage(): Observable<Language> {
    return this.appSettingFacade.getLanguage();
  }
  getSetting(): Observable<AppsettingsState> {
    return this.appSettingFacade.getSetting();
  }
  getStoreType(): Observable<string> {
    return this.appSettingFacade.currentStoreType$;
  }

  getPageSize(): Observable<number> {
    return this.appSettingFacade.pageSize$;
  }
  getPageSizeOptions(): Observable<number[]> {
    return this.appSettingFacade.pageSizeOptions$;
  }

  getMaxFilterLimit(): Observable<number> {
    return this.appSettingFacade.maxFilterLimit$;
  }

  getMaxSortLimit(): Observable<number> {
    return this.appSettingFacade.maxSortLimit$;
  }

  getBlockCopyPasteSetting() {
    return this.appSettingFacade.blockCopyPasteSetting$;
  }

  getMaxProductInList(): Observable<number> {
    return this.appSettingFacade.maxProductInList$;
  }

  getDateFormat(): Observable<string> {
    return this.appSettingFacade.dateFormat$;
  }

  getMobileMaxLength(): Observable<number> {
    return this.appSettingFacade.mobileMaxLength$;
  }

  changeStoreType(storetype: string): void {
    this.appSettingFacade.changeStoreType(storetype);
  }
  //[TODO: To be removed as this logic should be Auth Service responsibility]
  // changeLoginStatus(status: string): void {
  //   this.appSettingFacade.changeLoginStatus(status);
  // }
}
