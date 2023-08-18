import { ScrollService } from '@poss-web/shared/util-common';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import {
  getFileStatusRouteUrl
} from '@poss-web/shared/util-site-routes';

import {
  CardMenu,
  FileMenuKeyEnum
} from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-file-home',
  templateUrl: './file-home.component.html'
})
export class FileHomeComponent implements OnInit, OnDestroy {
  permissions$: Observable<any[]>;
  destroy$: Subject<null> = new Subject<null>();
  constructor(
    private permissionfacade: PermissionFacade,
    public scrollService: ScrollService
  ) {}
  menu: CardMenu[] = [
    {
      menuKey: FileMenuKeyEnum.FILE_UPLOAD_MENU_KEY,
      titleTranslationKey: 'pw.fileStatus.fileMenuTitle',
      subTitleTranslationKey: 'pw.fileStatus.fileUploadMenuTitle',
      hasChild: false,
      iconClass: 'pw-i-64 pw-lov-icon-64',
      elementName: 'File Home - File Upload Menu',
      path: 'files/data-upload'
    },
    {
      menuKey: FileMenuKeyEnum.FILE_STATUS_MENU_KEY,
      titleTranslationKey: 'pw.fileStatus.fileMenuTitle',
      subTitleTranslationKey: 'pw.fileStatus.fileStatusMenuTitle',
      hasChild: false,
      iconClass: 'pw-i-64 pw-lov-icon-64',
      elementName: 'File Home - File Status Menu',
      path: getFileStatusRouteUrl()
    }
    // {
    //   menuKey: ReportHomeKeyEnum.REPORT_SETTING,
    //   titleTranslationKey: 'pw.reports.reportListMenuTitle',
    //   subTitleTranslationKey: 'pw.reports.reportSettingMenuSubTitle',
    //   hasChild: false,
    //   iconClass: 'pw-i-64 pw-company-icon-64',
    //   elementName: 'Report Home - Report Setting Menu',
    //   path: getReportSettingsRouteUrl()
    // }
  ];
  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
