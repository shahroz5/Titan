import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  getDayWiseRevenueRouteUrl,
  getGhsOfflineBodRouteUrl,
  getTodayRevenueRouteUrl,
  getViewBankDepositRouteUrl,
  getWalkInsRouteUrl
} from '@poss-web/shared/util-site-routes';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { takeUntil } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import {
  AppTypesEnum,
  BankingAndRevenueMenuKeyEnum,
  CardMenu,
  CardSubMenu
} from '@poss-web/shared/models';
import { ScrollService } from '@poss-web/shared/util-common';

@Component({
  selector: 'poss-web-revenue-home',
  templateUrl: './revenue-home.component.html'
})
export class RevenueHomeComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  permissions$: Observable<any[]>;
  isBTQUser: boolean;

  menu: CardMenu[] = [];

  subMenu: CardSubMenu[] = [];

  constructor(
    private permissionfacade: PermissionFacade,
    public scrollService: ScrollService,
    private profileDataFacade: ProfileDataFacade
  ) {
    this.profileDataFacade
      .isBTQUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isBTQUser => {
        this.isBTQUser = isBTQUser;

        this.loadMenuData();
      });
  }

  ngOnInit(): void {
    this.permissions$ = this.permissionfacade.getPermissionforURL();
  }

  loadMenuData() {
    this.menu = [
      {
        menuKey: BankingAndRevenueMenuKeyEnum.BANKING_REVENUE_MENU_KEY,
        titleTranslationKey: 'pw.bankingAndRevenue.bankingAndRevenueLabel',
        hasChild: true,
        iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
        elementName: 'BankingRevenueHome_BankingAndRevenue_Menu',
        child: [
          {
            elementName: 'BankingRevenueHome_ViewTodaysRevenue_SubMenu',
            titleTranslationKey: 'pw.bankingAndRevenue.viewTodaysRevenueLabel',
            hasChild: false,
            appType: this.isBTQUser ? AppTypesEnum.POSS : AppTypesEnum.EPOSS,
            path: getTodayRevenueRouteUrl()
          },
          {
            elementName: 'BankingRevenueHome_ViewDayWise_SubMenu',
            titleTranslationKey: 'pw.bankingAndRevenue.viewDayWiseRevenueLabel',
            hasChild: false,
            appType: AppTypesEnum.POSS,
            path: getDayWiseRevenueRouteUrl()
          },
          // {
          //   elementName: 'BankingRevenueHome_PIFSeriesMenu',
          //   titleTranslationKey: 'pw.bankingAndRevenue.pifSeriesLabel',
          //   hasChild: false,
          //   appType: AppTypesEnum.POSS,
          //   path: getPIFSeriesRouteUrl()
          // },
          {
            elementName: 'BankingRevenueHome_Walkins_SubMenu',
            titleTranslationKey: 'pw.bankingAndRevenue.walkInsLabel',
            hasChild: false,
            appType: AppTypesEnum.POSS,
            path: getWalkInsRouteUrl()
          },
          {
            elementName: 'BankingRevenueHome_BankDeposit_SubMenu',
            titleTranslationKey: 'pw.bankingAndRevenue.viewBankDepositLabel',
            hasChild: false,
            appType: AppTypesEnum.POSS,
            path: getViewBankDepositRouteUrl()
          },
          // {
          //   elementName: 'BankingRevenueHome_BankDepositAtBoutiqueLevel_SubMenu',
          //   titleTranslationKey:
          //     'pw.bankingAndRevenue.bankDepositAtBoutiqueLevel',
          //   hasChild: false,
          //   appType: AppTypesEnum.POSS,
          //   path: getBankDepositRouteUrl()
          // },
          // {
          //   elementName: 'BankingRevenueHome_eGHSUpload_SubMenu',
          //   titleTranslationKey: 'pw.bankingAndRevenue.eGhsUploadLabel',
          //   hasChild: false,
          //   appType: AppTypesEnum.POSS,
          //   path: 'home/banking/upload-eGHS'
          // },
          {
            elementName: 'BankingRevenueHome_GhsOfflineBod_SubMenu',
            titleTranslationKey:
              'pw.bankingAndRevenue.viewGenerateEghsOfflineBodPassword',
            hasChild: false,
            appType: AppTypesEnum.POSS,
            path: getGhsOfflineBodRouteUrl()
          }
        ]
      }
    ];
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
