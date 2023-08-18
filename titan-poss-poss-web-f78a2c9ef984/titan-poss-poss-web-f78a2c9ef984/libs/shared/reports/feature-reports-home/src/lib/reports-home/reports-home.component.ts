import { ScrollService } from '@poss-web/shared/util-common';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';

import {
  getReportSettingsRouteUrl,
  getReportListRouteUrl,
  getReportRoleMappingRouteUrl,
  getReportAutoGenerationRouteUrl,
  getGenerateReportRouteUrl
} from '@poss-web/shared/util-site-routes';

import { CardMenu, ReportHomeKeyEnum } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-reports-home',
  templateUrl: './reports-home.component.html',
  styleUrls: ['./reports-home.component.scss']
})
export class ReportsHomeComponent implements OnInit, OnDestroy {
  // showSettingOption: boolean;
  // constructor(
  //   private router: Router,
  //   private profiledatafacade: ProfileDataFacade
  // ) {
  //   this.profiledatafacade
  //     .getUserType()
  //     .pipe(
  //       filter((val: string) => !!val),
  //       withLatestFrom(this.profiledatafacade.isCorpUser()),
  //       take(1)
  //     )
  //     .subscribe(([_, isCorpUser]) => {
  //       this.showSettingOption = isCorpUser;
  //     });
  // }

  permissions$: Observable<any[]>;
  destroy$: Subject<null> = new Subject<null>();
  menu: CardMenu[] = [
    {
      menuKey: ReportHomeKeyEnum.INVENTORY_REPORT,
      titleTranslationKey: 'pw.reports.generateReport',
      subTitleTranslationKey: 'pw.reports.inventoryReportMenuSubTitle',
      hasChild: false,
      iconClass: 'pw-i-64 pw-lov-icon-64',
      elementName: 'Report Home - Report Menu',
      path: getGenerateReportRouteUrl()
    },
    {
      menuKey: ReportHomeKeyEnum.REPORT_LIST,
      titleTranslationKey: 'pw.reports.reportListMenuTitle',
      subTitleTranslationKey: 'pw.reports.reportListMenuSubTitle',
      hasChild: false,
      iconClass: 'pw-i-64 pw-lov-icon-64',
      elementName: 'Report Home - Report Listing Menu',
      path: getReportListRouteUrl()
    },
    {
      menuKey: ReportHomeKeyEnum.ROLE_MAPPING,
      titleTranslationKey: 'pw.reports.reportListMenuTitle',
      subTitleTranslationKey: 'pw.reports.reportRoleMappingMenuSubTitle',
      hasChild: false,
      iconClass: 'pw-i-64 pw-company-icon-64',
      elementName: 'Report Home - Report Role Mapping Menu',
      path: getReportRoleMappingRouteUrl()
    },
    {
      menuKey: ReportHomeKeyEnum.REPORT_SETTING,
      titleTranslationKey: 'pw.reports.reportListMenuTitle',
      subTitleTranslationKey: 'pw.reports.reportSettingMenuSubTitle',
      hasChild: false,
      iconClass: 'pw-i-64 pw-company-icon-64',
      elementName: 'Report Home - Report Setting Menu',
      path: getReportSettingsRouteUrl('role')
    },

    {
      menuKey: ReportHomeKeyEnum.AUTO_GENERATION,
      titleTranslationKey: 'pw.reports.reportListMenuTitle',
      subTitleTranslationKey: 'pw.reports.autoGeneration',
      hasChild: false,
      iconClass: 'pw-i-64 pw-company-icon-64',
      elementName: 'Report Home - Report Auto Generation Menu',
      path: getReportAutoGenerationRouteUrl()
    }
  ];

  constructor(
    private permissionfacade: PermissionFacade,
    public scrollService: ScrollService
  ) {}

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
