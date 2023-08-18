import { ScrollService } from '@poss-web/shared/util-common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { combineLatest, Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import {
  EpossHomeKeyEnum,
  CardMenu,
  Command,
  AppTypesEnum,
  ShortcutServiceAbstraction,
  BodEodStatusEnum
} from '@poss-web/shared/models';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { filter, takeUntil } from 'rxjs/operators';
import {
  getAppVersionDashboardRouteUrl,
  getBankingAndRevenueHomeRouteUrl,
  getMonitoringDashboardAllowedRouteUrl,
  getOfflineMetalRatesUpdateRouteUrl
} from '@poss-web/shared/util-site-routes';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';

@Component({
  selector: 'poss-web-eposs-home',
  templateUrl: './eposs-home.component.html'
})
export class EpossHomeComponent implements OnInit, OnDestroy {
  permissions$: Observable<any[]>;
  destroy$: Subject<null> = new Subject<null>();

  metalRateStatus = false;
  menu: CardMenu[] = [];

  menuPrimary: CardMenu[] = [
    {
      menuKey: EpossHomeKeyEnum.UAM_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.userManagement',
      hasChild: false,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'EPOSS Home - UAM Menu',
      path: 'uam/home'
    },
    {
      menuKey: EpossHomeKeyEnum.INVENTORY_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.inventory',
      hasChild: false,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'EPOSS Home - Inventory Menu',
      path: 'inventory/home'
    },
    {
      menuKey: EpossHomeKeyEnum.APPROVALS_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.approvals',
      hasChild: false,
      iconClass: 'pw-i-64 pw-approvals-icon-64',
      elementName: 'EPOSS Home - Approvals Menu',
      path: 'approvals/home'
    },
    {
      menuKey: EpossHomeKeyEnum.CONFIGURATION_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.configuration',
      hasChild: false,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'EPOSS Home - Configuration Menu',
      path: 'configuration/home'
    },
    {
      menuKey: EpossHomeKeyEnum.OCG_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.ocg',
      hasChild: false,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'EPOSS Home - OCG Menu',
      path: 'documents/search'
    },
    {
      menuKey: EpossHomeKeyEnum.MASTER_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.master',
      hasChild: false,
      iconClass: 'pw-i-64 pw-boutique-master-icon-64',
      elementName: 'EPOSS Home - Master Menu',
      path: 'master/home'
    },
    {
      menuKey: EpossHomeKeyEnum.SALES_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.sales',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'EPOSS Home - Sales Menu',
      path: 'sales/home'
    },
    {
      menuKey: EpossHomeKeyEnum.BANKING_AND_REVENUE_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.bankingAndRevenueLabel',
      hasChild: false,
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      elementName: 'PossHome_BankingAndRevenue_Menu',
      path: getBankingAndRevenueHomeRouteUrl()
    },
    {
      menuKey: EpossHomeKeyEnum.REPORTS_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.reports',
      hasChild: false,
      iconClass: 'pw-i-64 pw-report-icon-64',
      elementName: 'homePage_Reports_Menu',
      path: 'reports/home'
    },
    {
      menuKey: EpossHomeKeyEnum.FILES_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.files',
      hasChild: false,
      appType: AppTypesEnum.EPOSS,
      iconClass: 'pw-i-64 pw-lov-icon-64',
      elementName: 'EPOSS Home - Files Menu',
      path: 'files/home'
    },
    {
      menuKey: EpossHomeKeyEnum.BOD_EOD_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.bodEodLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'PossHome_bodEodMenu',
      path: 'home/banking-revenue/bod-eod'
    },
    {
      menuKey: EpossHomeKeyEnum.BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.bankDepositLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      elementName: 'PossHome_BankDepositMenu',
      path: 'home/banking-revenue/bank-deposit'
    },
    {
      menuKey: EpossHomeKeyEnum.PIF_SERIES,
      titleTranslationKey: 'pw.possHomeDashboard.pifSeriesLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_PIFSeriesMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking-revenue/pif-series'
    },
    {
      menuKey: EpossHomeKeyEnum.EGHS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.epossHomeDashboard.eghsBankDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_EghsBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-eGHS'
    },
    {
      menuKey: EpossHomeKeyEnum.SERVICE_POSS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.servicePossDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_ServicePossBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-service-poss',
    },
    {
      menuKey: EpossHomeKeyEnum.MONITORING_DASHBOARD,
      titleTranslationKey: 'pw.epossHomeDashboard.monitoringDashboard',
      hasChild: false,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'EPOSS Home - MonitoringDashboard Menu',
      path: getMonitoringDashboardAllowedRouteUrl()
    },
    {
      menuKey: EpossHomeKeyEnum.APPVERSION_DASHBOARD,
      titleTranslationKey: 'pw.epossHomeDashboard.appVersionDashboard',
      hasChild: false,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'HomePage_AppVersionDashboard_Menu',
      path: getAppVersionDashboardRouteUrl()
    }
  ];

  menuWithBodAndNoMetalRate: CardMenu[] = [
    {
      menuKey: EpossHomeKeyEnum.UAM_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.userManagement',
      hasChild: false,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'EPOSS Home - UAM Menu',
      path: 'uam/home'
    },
    {
      menuKey: EpossHomeKeyEnum.INVENTORY_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.inventory',
      hasChild: false,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'EPOSS Home - Inventory Menu',
      path: 'inventory/home'
    },
    {
      menuKey: EpossHomeKeyEnum.GIFT_CARDS,
      titleTranslationKey: 'pw.epossHomeDashboard.giftCards',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'homePage_GiftCards_Menu',
      path: 'sales/gift-cards/sale'
    },
    {
      menuKey: EpossHomeKeyEnum.ACCEPT_ADVANCE,
      titleTranslationKey: 'pw.epossHomeDashboard.acceptAdvanceLabel',
      hasChild: false,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'homePage_AcceptAdvance_Menu',
      appType: AppTypesEnum.POSS,
      path: 'sales/ct-advance/accept-advance'
    },
    {
      menuKey: EpossHomeKeyEnum.CONFIGURATION_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.configuration',
      hasChild: false,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'EPOSS Home - Configuration Menu',
      path: 'configuration/home'
    },
    {
      menuKey: EpossHomeKeyEnum.OCG_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.ocg',
      hasChild: false,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'EPOSS Home - OCG Menu',
      path: 'documents/search'
    },
    {
      menuKey: EpossHomeKeyEnum.MASTER_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.master',
      hasChild: false,
      iconClass: 'pw-i-64 pw-boutique-master-icon-64',
      elementName: 'EPOSS Home - Master Menu',
      path: 'master/home'
    },
    {
      menuKey: EpossHomeKeyEnum.REPORTS_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.reports',
      hasChild: false,
      iconClass: 'pw-i-64 pw-report-icon-64',
      elementName: 'homePage_Reports_Menu',
      path: 'reports/home'
    },
    {
      menuKey: EpossHomeKeyEnum.BANKING_AND_REVENUE_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.bankingAndRevenueLabel',
      hasChild: false,
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      elementName: 'PossHome_BankingAndRevenue_Menu',
      path: getBankingAndRevenueHomeRouteUrl()
    },

    // {
    //   menuKey: EpossHomeKeyEnum.BANKING_AND_REVENUE_MENU_KEY,
    //   titleTranslationKey: 'pw.epossHomeDashboard.bankingAndRevenueLabel',
    //   hasChild: true,
    //   iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
    //   elementName: 'PossHome_BankingAndRevenue_Menu',
    //   child: [
    //     {
    //       elementName: 'PossHome_BankingAndRevenue_BankDeposit_SubMenu',
    //       titleTranslationKey: 'pw.possHomeDashboard.viewBankDepositLabel',
    //       hasChild: false,
    //       appType: AppTypesEnum.POSS,
    //       path: 'banking-revenue/view-bank-deposit'
    //     },
    //     {
    //       elementName: 'PossHome_BankingAndRevenue_ViewTodaysRevenue_SubMenu',
    //       titleTranslationKey: 'pw.possHomeDashboard.viewTodaysRevenueLabel',
    //       hasChild: false,
    //       appType: AppTypesEnum.POSS,
    //       path: 'banking-revenue/today'
    //     },
    //     {
    //       elementName: 'PossHome_BankingAndRevenue_ViewDayWise_SubMenu',
    //       titleTranslationKey: 'pw.possHomeDashboard.viewDayWiseRevenueLabel',
    //       hasChild: false,
    //       appType: AppTypesEnum.POSS,
    //       path: 'banking-revenue/day-wise'
    //     },
    //     // {
    //     //   elementName: 'PossHome_BankingAndRevenue_PIFSeries_SubMenu',
    //     //   titleTranslationKey: 'pw.possHomeDashboard.pifSeriesLabel',
    //     //   hasChild: false,
    //     //   appType: AppTypesEnum.POSS,
    //     //   path: 'home/banking-revenue/pif-series'
    //     // },
    //     // {
    //     //   elementName: 'PossHome_BankingAndRevenue_eGHSUpload_SubMenu',
    //     //   titleTranslationKey: 'pw.possHomeDashboard.eGhsUploadLabel',
    //     //   hasChild: false,
    //     //   appType: AppTypesEnum.POSS,
    //     //   path: 'home/banking/upload-eGHS'
    //     // },
    //     {
    //       elementName: 'PossHome_BankingAndRevenue_Walkins_SubMenu',
    //       titleTranslationKey: 'pw.possHomeDashboard.walkInsLabel',
    //       hasChild: false,
    //       appType: AppTypesEnum.POSS,
    //       path: 'banking-revenue/walk-ins-record'
    //     },
    //     {
    //       elementName: 'PossHome_BankingAndRevenue_GhsOfflineBod_SubMenu',
    //       titleTranslationKey:
    //         'pw.epossHomeDashboard.viewGenerateEghsOfflineBodPassword',
    //       hasChild: false,
    //       appType: AppTypesEnum.POSS,
    //       path: 'banking-revenue/eghs-offline-bod-list'
    //     }
    //   ]
    // },
    {
      menuKey: EpossHomeKeyEnum.REQUEST_APPROVALS_STATUS,
      titleTranslationKey: 'pw.salesDashboard.requestApprovalsStatusLabel',
      hasChild: true,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'HomePage_RequestApprovalsStatus_Menu',
      child: [
        {
          elementName:
            'HomePage_RequestApprovalsStatus_ManualbillRequestsStatus_SubMenu',
          titleTranslationKey:
            'pw.salesDashboard.manualBillRequestsStatusLabel',
          hasChild: false,
          appType: AppTypesEnum.POSS,
          path: 'sales/cm-requests/list'
        },
        {
          elementName:
            'HomePage_RequestApprovalsStatus_RoRequestsStatus_SubMenu',
          titleTranslationKey: 'pw.salesDashboard.roRequestsStatusLabel',
          hasChild: false,
          appType: AppTypesEnum.POSS,
          path: 'sales/ro-request/list'
        },
        {
          elementName:
            'HomePage_RequestApprovalsStatus_AirpayRequestsStatus_SubMenu',
          titleTranslationKey: 'pw.salesDashboard.airpayRequestsStatusLabel',
          hasChild: false,
          appType: AppTypesEnum.POSS,
          path: 'sales/airpayRequests/list'
        },
        {
          elementName:
            'HomePage_RequestApprovalsStatus_AirpayRequestsHistory_SubMenu',
          titleTranslationKey: 'pw.salesDashboard.airpayRequestsHistoryLabel',
          hasChild: false,
          appType: AppTypesEnum.POSS,
          path: 'sales/airpayRequests/history'
        },
        {
          elementName:
            'HomePage_RequestApprovalsStatus_AdvanceBookingRequestsStatus_SubMenu',
          titleTranslationKey:
            'pw.salesDashboard.advanceBookingRequestsStatusLabel',
          hasChild: false,
          appType: AppTypesEnum.POSS,
          path: 'sales/advance-booking/request-status'
        }
      ]
    },
    {
      menuKey: EpossHomeKeyEnum.BOD_EOD_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.bodEodLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'PossHome_bodEodMenu',
      path: 'home/banking-revenue/bod-eod'
    },
    {
      menuKey: EpossHomeKeyEnum.BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.bankDepositLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      elementName: 'PossHome_BankDepositMenu',
      path: 'home/banking-revenue/bank-deposit'
    },
    {
      menuKey: EpossHomeKeyEnum.PIF_SERIES,
      titleTranslationKey: 'pw.possHomeDashboard.pifSeriesLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_PIFSeriesMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking-revenue/pif-series'
    },
    {
      menuKey: EpossHomeKeyEnum.EGHS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.epossHomeDashboard.eghsBankDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_EghsBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-eGHS'
    },
    {
      menuKey: EpossHomeKeyEnum.SERVICE_POSS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.servicePossDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_ServicePossBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-service-poss',
    },
    {
      menuKey: EpossHomeKeyEnum.METAL_RATE,
      titleTranslationKey: 'pw.epossHomeDashboard.metalRateUpdate',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'POSS Home - Metal Rate Menu',
      path: getOfflineMetalRatesUpdateRouteUrl()
    },
    {
      menuKey: EpossHomeKeyEnum.VIEW_OFFLINE_EGHS,
      titleTranslationKey:
        'pw.epossHomeDashboard.viewGenerateEghsOfflineBodPassword',
      elementName: 'POSS Home - View Eghs Offline Bod Menu',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      path: 'banking-revenue/eghs-offline-bod-list'
    },
    {
      menuKey: EpossHomeKeyEnum.MONITORING_DASHBOARD,
      titleTranslationKey: 'pw.epossHomeDashboard.monitoringDashboard',
      hasChild: false,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'EPOSS Home - MonitoringDashboard Menu',
      path: getMonitoringDashboardAllowedRouteUrl()
    },
    {
      menuKey: EpossHomeKeyEnum.APPVERSION_DASHBOARD,
      titleTranslationKey: 'pw.epossHomeDashboard.appVersionDashboard',
      hasChild: false,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'HomePage_AppVersionDashboard_Menu',
      path: getAppVersionDashboardRouteUrl()
    }
  ];

  menuDuringEodInProgressStatus: CardMenu[] = [
    {
      menuKey: EpossHomeKeyEnum.UAM_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.userManagement',
      hasChild: false,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'EPOSS Home - UAM Menu',
      path: 'uam/home'
    },
    {
      menuKey: EpossHomeKeyEnum.BANKING_AND_REVENUE_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.bankingAndRevenueLabel',
      hasChild: false,
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      elementName: 'PossHome_BankingAndRevenue_Menu',
      path: getBankingAndRevenueHomeRouteUrl()
    },
    {
      menuKey: EpossHomeKeyEnum.BOD_EOD_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.bodEodLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'PossHome_bodEodMenu',
      path: 'home/banking-revenue/bod-eod'
    },
    {
      menuKey: EpossHomeKeyEnum.BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.bankDepositLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      elementName: 'PossHome_BankDepositMenu',
      path: 'home/banking-revenue/bank-deposit'
    },
    {
      menuKey: EpossHomeKeyEnum.PIF_SERIES,
      titleTranslationKey: 'pw.possHomeDashboard.pifSeriesLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_PIFSeriesMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking-revenue/pif-series'
    },
    {
      menuKey: EpossHomeKeyEnum.EGHS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.epossHomeDashboard.eghsBankDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_EghsBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-eGHS'
    },
    {
      menuKey: EpossHomeKeyEnum.SERVICE_POSS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.servicePossDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_ServicePossBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-service-poss',
    },
    {
      menuKey: EpossHomeKeyEnum.VIEW_OFFLINE_EGHS,
      titleTranslationKey:
        'pw.epossHomeDashboard.viewGenerateEghsOfflineBodPassword',
      elementName: 'POSS Home - View Eghs Offline Bod Menu',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      path: 'banking-revenue/eghs-offline-bod-list'
    },
    {
      menuKey: EpossHomeKeyEnum.REPORTS_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.reports',
      hasChild: false,
      iconClass: 'pw-i-64 pw-report-icon-64',
      elementName: 'homePage_Reports_Menu',
      path: 'reports/home'
    },
    {
      menuKey: EpossHomeKeyEnum.MONITORING_DASHBOARD,
      titleTranslationKey: 'pw.epossHomeDashboard.monitoringDashboard',
      hasChild: false,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'EPOSS Home - MonitoringDashboard Menu',
      path: getMonitoringDashboardAllowedRouteUrl()
    },
    {
      menuKey: EpossHomeKeyEnum.APPVERSION_DASHBOARD,
      titleTranslationKey: 'pw.epossHomeDashboard.appVersionDashboard',
      hasChild: false,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'HomePage_AppVersionDashboard_Menu',
      path: getAppVersionDashboardRouteUrl()
    }
  ];

  menuDuringBodInProgressStatus: CardMenu[] = [
    {
      menuKey: EpossHomeKeyEnum.UAM_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.userManagement',
      hasChild: false,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'EPOSS Home - UAM Menu',
      path: 'uam/home'
    },
    {
      menuKey: EpossHomeKeyEnum.BOD_EOD_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.bodEodLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'PossHome_bodEodMenu',
      path: 'home/banking-revenue/bod-eod'
    },
    // {
    //   menuKey: EpossHomeKeyEnum.BANK_DEPOSIT,
    //   titleTranslationKey: 'pw.possHomeDashboard.bankDepositLabel',
    //   hasChild: false,
    //   appType: AppTypesEnum.POSS,
    //   iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
    //   elementName: 'PossHome_BankDepositMenu',
    //   path: 'home/banking-revenue/bank-deposit'
    // },
    // {
    //   menuKey: EpossHomeKeyEnum.PIF_SERIES,
    //   titleTranslationKey: 'pw.possHomeDashboard.pifSeriesLabel',
    //   hasChild: false,
    //   appType: AppTypesEnum.POSS,
    //   elementName: 'PossHome_PIFSeriesMenu',
    //   iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
    //   path: 'home/banking-revenue/pif-series'
    // },
    {
      menuKey: EpossHomeKeyEnum.EGHS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.epossHomeDashboard.eghsBankDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_EghsBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-eGHS'
    },
    {
      menuKey: EpossHomeKeyEnum.SERVICE_POSS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.servicePossDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_ServicePossBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-service-poss',
    },
    {
      menuKey: EpossHomeKeyEnum.METAL_RATE,
      titleTranslationKey: 'pw.epossHomeDashboard.metalRateUpdate',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'POSS Home - Metal Rate Menu',
      path: getOfflineMetalRatesUpdateRouteUrl()
    },
    // {
    //   menuKey: EpossHomeKeyEnum.VIEW_OFFLINE_EGHS,
    //   titleTranslationKey:
    //     'pw.epossHomeDashboard.viewGenerateEghsOfflineBodPassword',
    //   elementName: 'POSS Home - View Eghs Offline Bod Menu',
    //   hasChild: false,
    //   appType: AppTypesEnum.POSS,
    //   iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
    //   path: 'banking-revenue/eghs-offline-bod-list'
    // },
    {
      menuKey: EpossHomeKeyEnum.REPORTS_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.reports',
      hasChild: false,
      iconClass: 'pw-i-64 pw-report-icon-64',
      elementName: 'homePage_Reports_Menu',
      path: 'reports/home'
    },
    {
      menuKey: EpossHomeKeyEnum.MONITORING_DASHBOARD,
      titleTranslationKey: 'pw.epossHomeDashboard.monitoringDashboard',
      hasChild: false,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'EPOSS Home - MonitoringDashboard Menu',
      path: getMonitoringDashboardAllowedRouteUrl()
    },
    {
      menuKey: EpossHomeKeyEnum.APPVERSION_DASHBOARD,
      titleTranslationKey: 'pw.epossHomeDashboard.appVersionDashboard',
      hasChild: false,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'HomePage_AppVersionDashboard_Menu',
      path: getAppVersionDashboardRouteUrl()
    }
  ];

  menuDuringClosedStatus: CardMenu[] = [
    {
      menuKey: EpossHomeKeyEnum.UAM_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.userManagement',
      hasChild: false,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'EPOSS Home - UAM Menu',
      path: 'uam/home'
    },
    {
      menuKey: EpossHomeKeyEnum.BOD_EOD_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.bodEodLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'PossHome_bodEodMenu',
      path: 'home/banking-revenue/bod-eod'
    },
    {
      menuKey: EpossHomeKeyEnum.EGHS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.epossHomeDashboard.eghsBankDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_EghsBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-eGHS'
    },
    {
      menuKey: EpossHomeKeyEnum.SERVICE_POSS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.servicePossDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_ServicePossBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-service-poss',
    },
    {
      menuKey: EpossHomeKeyEnum.REPORTS_MENU_KEY,
      titleTranslationKey: 'pw.epossHomeDashboard.reports',
      hasChild: false,
      iconClass: 'pw-i-64 pw-report-icon-64',
      elementName: 'homePage_Reports_Menu',
      path: 'reports/home'
    },
    {
      menuKey: EpossHomeKeyEnum.MONITORING_DASHBOARD,
      titleTranslationKey: 'pw.epossHomeDashboard.monitoringDashboard',
      hasChild: false,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'EPOSS Home - MonitoringDashboard Menu',
      path: getMonitoringDashboardAllowedRouteUrl()
    },
    {
      menuKey: EpossHomeKeyEnum.APPVERSION_DASHBOARD,
      titleTranslationKey: 'pw.epossHomeDashboard.appVersionDashboard',
      hasChild: false,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'HomePage_AppVersionDashboard_Menu',
      path: getAppVersionDashboardRouteUrl()
    }
  ];

  constructor(
    private router: Router,
    private shortcutService: ShortcutServiceAbstraction,
    private permissionfacade: PermissionFacade,
    private sharedBodEodFacade: SharedBodEodFacade,
    private profileDataFacade: ProfileDataFacade,
    public scrollService: ScrollService
  ) {}

  ngOnInit() {
    this.permissions$ = this.permissionfacade.getPermissionforURL();

    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });

    combineLatest([
      this.profileDataFacade
        .isBTQUser()
        .pipe(filter(isBTQUser => isBTQUser !== null)),
      this.sharedBodEodFacade.getBodEodStatus(),
      this.sharedBodEodFacade.getGoldRateAvailablityStatus()
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([isBTQUser, bodEodStatus, goldRateStatus]) => {
        this.metalRateStatus = goldRateStatus;

        if (!isBTQUser) {
          this.menu = this.menuPrimary;
        } else if (isBTQUser && bodEodStatus !== null) {
          switch (bodEodStatus) {
            case BodEodStatusEnum.OPEN:
              this.menu = this.metalRateStatus
                ? this.menuPrimary
                : this.menuWithBodAndNoMetalRate;
              break;
            case BodEodStatusEnum.EOD_IN_PROGRESS:
              this.menu = this.menuDuringEodInProgressStatus;
              break;
            case BodEodStatusEnum.BOD_IN_PROGRESS:
              this.menu = this.menuDuringBodInProgressStatus;
              break;
            default:
              this.menu = this.menuDuringClosedStatus;
              break;
          }
        }
      });
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  private shortcutEventHandler(command: Command) {
    // Todo: uncomment Below code block for shortcut keys
    // if (command.name === cashMemoKey) {
    //   this.cashMemoUrl();
    // }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
