import { ScrollService } from '@poss-web/shared/util-common';
import {
  getBankingAndRevenueHomeRouteUrl,
  getCashMemoUrl,
  getMonitoringDashboardAllowedRouteUrl,
  getOfflineMetalRatesUpdateRouteUrl
} from '@poss-web/shared/util-site-routes';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject, Observable, combineLatest } from 'rxjs';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { ConnectionService } from 'ng-connection-service';

import {
  PossHomeKeyEnum,
  CardMenu,
  Command,
  AppTypesEnum,
  ShortcutServiceAbstraction,
  BodEodEnum,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  BodEodStatusEnum
} from '@poss-web/shared/models';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { TranslateService } from '@ngx-translate/core';

const cashMemoKey = 'CustomerTransactionHomeComponent.MENU1';

@Component({
  selector: 'poss-web-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  permissions$: Observable<any[]>;
  destroy$: Subject<null> = new Subject<null>();

  metalRateStatus = false;
  menu: CardMenu[] = [];
  status = 'ONLINE';

  menuPrimary: CardMenu[] = [
    {
      menuKey: PossHomeKeyEnum.UAM_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.userManagement',
      hasChild: false,
      appType: AppTypesEnum.EPOSS,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'POSS Home - UAM Menu',
      path: 'uam/home',
      isOffline: 'OFFLINE'
    },
    {
      menuKey: PossHomeKeyEnum.INVENTORY_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.inventory',
      hasChild: false,
      appType: AppTypesEnum.EPOSS,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'POSS Home - Inventory Menu',
      path: 'inventory/home',
      isOffline: 'OFFLINE'
    },
    {
      menuKey: PossHomeKeyEnum.APPROVALS_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.approvals',
      hasChild: false,
      iconClass: 'pw-i-64 pw-approvals-icon-64',
      elementName: 'POSS Home - Approvals Menu',
      path: 'approvals/home',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.CONFIGURATION_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.configuration',
      hasChild: false,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'POSS Home - Configuration Menu',
      path: 'configuration/home',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.MASTER_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.master',
      hasChild: false,
      iconClass: 'pw-i-64 pw-boutique-master-icon-64',
      elementName: 'POSS Home - Master Menu',
      path: 'master/home',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.SALES_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.salesLabel',
      hasChild: false,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'POSS Home - Sales Menu',
      path: 'sales/home',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.DIGITAL_SIGNATURE,
      titleTranslationKey: 'pw.possHomeDashboard.digitalSignature',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'POSSHome_DigitalSignature_Menu',
      path: 'digital-signature',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.UPDATE_E_INVOICE,
      titleTranslationKey: 'pw.possHomeDashboard.updateEInvoice',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-report-icon-64',
      elementName: 'homePage E-Invoice',
      path: 'update-e-invoice',
      isOffline: 'OFFLINE'
    },
    {
      menuKey: PossHomeKeyEnum.BANKING_AND_REVENUE_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.bankingAndRevenueLabel',
      hasChild: false,
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      elementName: 'PossHome_BankingAndRevenue_Menu',
      path: getBankingAndRevenueHomeRouteUrl(),
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.REPORTS_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.reportsLabel',
      hasChild: false,
      appType: AppTypesEnum.EPOSS,
      iconClass: 'pw-i-64 pw-report-icon-64',
      elementName: 'homePage_Reports_Menu',
      path: 'reports/home',
      isOffline: 'OFFLINE'
    },
    {
      menuKey: PossHomeKeyEnum.FILES_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.files',
      hasChild: false,
      appType: AppTypesEnum.EPOSS,
      iconClass: 'pw-i-64 pw-lov-icon-64',
      elementName: 'POSS Home - Files Menu',
      path: 'files/home',
      isOffline: 'OFFLINE'
    },
    {
      menuKey: PossHomeKeyEnum.BOD_EOD_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.bodEodLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'PossHome_bodEodMenu',
      path: 'home/banking-revenue/bod-eod',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.bankDepositLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      elementName: 'PossHome_BankDepositMenu',
      path: 'home/banking-revenue/bank-deposit',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.PIF_SERIES,
      titleTranslationKey: 'pw.possHomeDashboard.pifSeriesLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_PIFSeriesMenu',
      iconClass: 'pw-i-64 pw-lov-icon-64',
      path: 'home/banking-revenue/pif-series',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.EGHS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.eghsBankDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_EghsBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-eGHS',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.SERVICE_POSS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.servicePossDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_ServicePossBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-service-poss',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.MONITORING_DASHBOARD,
      titleTranslationKey: 'pw.possHomeDashboard.monitoringDashboard',
      hasChild: false,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'POSS Home - MonitoringDashboard Menu',
      path: getMonitoringDashboardAllowedRouteUrl(),
      isOffline: ''
    },
    // {
    //   menuKey: PossHomeKeyEnum.FIND_PRICE,
    //   titleTranslationKey: 'pw.possHomeDashboard.findPrice',
    //   hasChild: false,
    //   appType: AppTypesEnum.POSS,
    //   iconClass: 'pw-i-64 pw-find-price-icon-64',
    //   elementName: 'PossHome_FindPrice_Menu',
    //   path: 'find-price',
    //   isOffline: ''
    // },
    {
      menuKey: PossHomeKeyEnum.UPGRADE_VERSION,
      titleTranslationKey: 'pw.possHomeDashboard.upgradeVersion',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-report-icon-64',
      elementName: 'PossHome_UpgradeVersion_Menu',
      path: 'upgrade-version',
      isOffline: 'OFFLINE'
    },
    {
      menuKey: PossHomeKeyEnum.HELP,
      titleTranslationKey: 'pw.possHomeDashboard.help',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-report-icon-64',
      elementName: 'POSS Home - Help Menu',
      path: 'help/home',
      isOffline: ''
    }
  ];

  menuWithBodAndNoMetalRate: CardMenu[] = [
    {
      menuKey: PossHomeKeyEnum.UAM_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.userManagement',
      hasChild: false,
      appType: AppTypesEnum.EPOSS,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'POSS Home - UAM Menu',
      path: 'uam/home',
      isOffline: 'OFFLINE'
    },
    {
      menuKey: PossHomeKeyEnum.INVENTORY_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.inventory',
      hasChild: false,
      appType: AppTypesEnum.EPOSS,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'POSS Home - Inventory Menu',
      path: 'inventory/home',
      isOffline: 'OFFLINE'
    },
    {
      menuKey: PossHomeKeyEnum.GIFT_CARDS,
      titleTranslationKey: 'pw.possHomeDashboard.giftCards',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'homePage_GiftCards_Menu',
      path: 'sales/gift-cards/sale/new',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.ACCEPT_ADVANCE,
      titleTranslationKey: 'pw.possHomeDashboard.acceptAdvanceLabel',
      hasChild: false,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'homePage_AcceptAdvance_Menu',
      appType: AppTypesEnum.POSS,
      path: 'sales/ct-advance/accept-advance/new',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.CONFIGURATION_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.configuration',
      hasChild: false,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'POSS Home - Configuration Menu',
      path: 'configuration/home',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.MASTER_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.master',
      hasChild: false,
      iconClass: 'pw-i-64 pw-boutique-master-icon-64',
      elementName: 'POSS Home - Master Menu',
      path: 'master/home',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.REPORTS_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.reportsLabel',
      hasChild: false,
      appType: AppTypesEnum.EPOSS,
      iconClass: 'pw-i-64 pw-report-icon-64',
      elementName: 'homePage_Reports_Menu',
      path: 'reports/home',
      isOffline: 'OFFLINE'
    },
    {
      menuKey: PossHomeKeyEnum.BANKING_AND_REVENUE_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.bankingAndRevenueLabel',
      hasChild: false,
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      elementName: 'PossHome_BankingAndRevenue_Menu',
      path: getBankingAndRevenueHomeRouteUrl(),
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.REQUEST_APPROVALS_STATUS,
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
          path: 'sales/cm-requests/list'
        },
        {
          elementName:
            'HomePage_RequestApprovalsStatus_RoRequestsStatus_SubMenu',
          titleTranslationKey: 'pw.salesDashboard.roRequestsStatusLabel',
          hasChild: false,
          path: 'sales/ro-request/list'
        },
        {
          elementName:
            'HomePage_RequestApprovalsStatus_AirpayRequestsStatus_SubMenu',
          titleTranslationKey: 'pw.salesDashboard.airpayRequestsStatusLabel',
          hasChild: false,
          path: 'sales/airpayRequests/list'
        },
        {
          elementName:
            'HomePage_RequestApprovalsStatus_AirpayRequestsHistory_SubMenu',
          titleTranslationKey: 'pw.salesDashboard.airpayRequestsHistoryLabel',
          hasChild: false,
          path: 'sales/airpayRequests/history'
        },
        {
          elementName:
            'HomePage_RequestApprovalsStatus_AdvanceBookingRequestsStatus_SubMenu',
          titleTranslationKey:
            'pw.salesDashboard.advanceBookingRequestsStatusLabel',
          hasChild: false,
          path: 'sales/advance-booking/request-status'
        }
      ],
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.BOD_EOD_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.bodEodLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'PossHome_bodEodMenu',
      path: 'home/banking-revenue/bod-eod',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.DIGITAL_SIGNATURE,
      titleTranslationKey: 'pw.possHomeDashboard.digitalSignature',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'PossHome_DigitalSignature',
      path: 'digital-signature',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.bankDepositLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      elementName: 'PossHome_BankDepositMenu',
      path: 'home/banking-revenue/bank-deposit',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.PIF_SERIES,
      titleTranslationKey: 'pw.possHomeDashboard.pifSeriesLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_PIFSeriesMenu',
      iconClass: 'pw-i-64 pw-lov-icon-64',
      path: 'home/banking-revenue/pif-series',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.EGHS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.eghsBankDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_EghsBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-eGHS',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.SERVICE_POSS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.servicePossDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_ServicePossBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-service-poss',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.METAL_RATE,
      titleTranslationKey: 'pw.possHomeDashboard.metalRateUpdate',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'POSS Home - Metal Rate Menu',
      path: getOfflineMetalRatesUpdateRouteUrl(),
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.VIEW_OFFLINE_EGHS,
      titleTranslationKey:
        'pw.possHomeDashboard.viewGenerateEghsOfflineBodPassword',
      elementName: 'POSS Home - View Eghs Offline Bod Menu',
      hasChild: false,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      path: 'banking-revenue/eghs-offline-bod-list',
      appType: AppTypesEnum.POSS,
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.MONITORING_DASHBOARD,
      titleTranslationKey: 'pw.possHomeDashboard.monitoringDashboard',
      hasChild: false,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'POSS Home - MonitoringDashboard Menu',
      path: getMonitoringDashboardAllowedRouteUrl(),
      isOffline: ''
    },
    // {
    //   menuKey: PossHomeKeyEnum.FIND_PRICE,
    //   titleTranslationKey: 'pw.possHomeDashboard.findPrice',
    //   hasChild: false,
    //   appType: AppTypesEnum.POSS,
    //   iconClass: 'pw-i-64 pw-find-price-icon-64',
    //   elementName: 'PossHome_FindPrice',
    //   path: 'find-price',
    //   isOffline: ''
    // },

    // TODO: To be added in Side Nav POSS for Find Price Menu to show in Side Nav, to be added in Side Nav EPOSS later
    // {
    //   "external": false,
    //   "name": "Find Price",
    //   "icon": "pw-i-36 pw-master-icon-36",
    //   "translatedName": "pw.navigation.findPrice",
    //   "url": "find-price",
    //   "isOffline": "",
    //   "permission": {
    //     "transactionCodes": ["M3", "M146"],
    //     "authorisedStrategy": "",
    //     "unauthorisedStrategy": ""
    //   }
    // },
    {
      menuKey: PossHomeKeyEnum.UPGRADE_VERSION,
      titleTranslationKey: 'pw.possHomeDashboard.upgradeVersion',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-report-icon-64',
      elementName: 'PossHome_UpgradeVersion_Menu',
      path: 'upgrade-version',
      isOffline: 'OFFLINE'
    },
    {
      menuKey: PossHomeKeyEnum.HELP,
      titleTranslationKey: 'pw.possHomeDashboard.help',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-report-icon-64',
      elementName: 'POSS Home - Help Menu',
      path: 'help/home',
      isOffline: ''
    }
  ];

  menuDuringEodInProgressStatus: CardMenu[] = [
    {
      menuKey: PossHomeKeyEnum.UAM_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.userManagement',
      hasChild: false,
      appType: AppTypesEnum.EPOSS,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'POSS Home - UAM Menu',
      path: 'uam/home',
      isOffline: 'OFFLINE'
    },
    {
      menuKey: PossHomeKeyEnum.BANKING_AND_REVENUE_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.bankingAndRevenueLabel',
      hasChild: false,
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      elementName: 'PossHome_BankingAndRevenue_Menu',
      path: getBankingAndRevenueHomeRouteUrl(),
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.BOD_EOD_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.bodEodLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'PossHome_bodEodMenu',
      path: 'home/banking-revenue/bod-eod',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.bankDepositLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      elementName: 'PossHome_BankDepositMenu',
      path: 'home/banking-revenue/bank-deposit',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.PIF_SERIES,
      titleTranslationKey: 'pw.possHomeDashboard.pifSeriesLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_PIFSeriesMenu',
      iconClass: 'pw-i-64 pw-lov-icon-64',
      path: 'home/banking-revenue/pif-series',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.EGHS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.eghsBankDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_EghsBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-eGHS',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.SERVICE_POSS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.servicePossDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_ServicePossBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-service-poss',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.VIEW_OFFLINE_EGHS,
      titleTranslationKey:
        'pw.possHomeDashboard.viewGenerateEghsOfflineBodPassword',
      elementName: 'POSS Home - View Eghs Offline Bod Menu',
      hasChild: false,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      path: 'banking-revenue/eghs-offline-bod-list',
      appType: AppTypesEnum.POSS,
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.REPORTS_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.reportsLabel',
      hasChild: false,
      appType: AppTypesEnum.EPOSS,
      iconClass: 'pw-i-64 pw-report-icon-64',
      elementName: 'homePage_Reports_Menu',
      path: 'reports/home',
      isOffline: 'OFFLINE'
    },

    {
      menuKey: PossHomeKeyEnum.MONITORING_DASHBOARD,
      titleTranslationKey: 'pw.possHomeDashboard.monitoringDashboard',
      hasChild: false,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'POSS Home - MonitoringDashboard Menu',
      path: getMonitoringDashboardAllowedRouteUrl(),
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.UPGRADE_VERSION,
      titleTranslationKey: 'pw.possHomeDashboard.upgradeVersion',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-report-icon-64',
      elementName: 'PossHome_UpgradeVersion_Menu',
      path: 'upgrade-version',
      isOffline: 'OFFLINE'
    }
  ];

  menuDuringBodInProgressStatus: CardMenu[] = [
    {
      menuKey: PossHomeKeyEnum.UAM_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.userManagement',
      hasChild: false,
      appType: AppTypesEnum.EPOSS,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'POSS Home - UAM Menu',
      path: 'uam/home',
      isOffline: 'OFFLINE'
    },
    {
      menuKey: PossHomeKeyEnum.BOD_EOD_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.bodEodLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'PossHome_bodEodMenu',
      path: 'home/banking-revenue/bod-eod',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.EGHS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.eghsBankDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_EghsBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-eGHS',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.SERVICE_POSS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.servicePossDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_ServicePossBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-service-poss',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.METAL_RATE,
      titleTranslationKey: 'pw.possHomeDashboard.metalRateUpdate',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'POSS Home - Metal Rate Menu',
      path: getOfflineMetalRatesUpdateRouteUrl(),
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.REPORTS_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.reportsLabel',
      hasChild: false,
      appType: AppTypesEnum.EPOSS,
      iconClass: 'pw-i-64 pw-report-icon-64',
      elementName: 'homePage_Reports_Menu',
      path: 'reports/home',
      isOffline: 'OFFLINE'
    },
    {
      menuKey: PossHomeKeyEnum.MONITORING_DASHBOARD,
      titleTranslationKey: 'pw.possHomeDashboard.monitoringDashboard',
      hasChild: false,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'POSS Home - MonitoringDashboard Menu',
      path: getMonitoringDashboardAllowedRouteUrl(),
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.UPGRADE_VERSION,
      titleTranslationKey: 'pw.possHomeDashboard.upgradeVersion',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-report-icon-64',
      elementName: 'PossHome_UpgradeVersion_Menu',
      path: 'upgrade-version',
      isOffline: 'OFFLINE'
    }
  ];

  menuDuringClosedStatus: CardMenu[] = [
    {
      menuKey: PossHomeKeyEnum.UAM_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.userManagement',
      hasChild: false,
      appType: AppTypesEnum.EPOSS,
      iconClass: 'pw-i-64 pw-customer-icon-64',
      elementName: 'POSS Home - UAM Menu',
      path: 'uam/home',
      isOffline: 'OFFLINE'
    },
    {
      menuKey: PossHomeKeyEnum.BOD_EOD_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.bodEodLabel',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-ct-icon-64',
      elementName: 'PossHome_bodEodMenu',
      path: 'home/banking-revenue/bod-eod',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.EGHS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.eghsBankDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_EghsBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-eGHS',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.SERVICE_POSS_BANK_DEPOSIT,
      titleTranslationKey: 'pw.possHomeDashboard.servicePossDeposit',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      elementName: 'PossHome_ServicePossBankDepositMenu',
      iconClass: 'pw-i-64 pw-banking-revenue-icon-64',
      path: 'home/banking/upload-service-poss',
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.REPORTS_MENU_KEY,
      titleTranslationKey: 'pw.possHomeDashboard.reportsLabel',
      hasChild: false,
      appType: AppTypesEnum.EPOSS,
      iconClass: 'pw-i-64 pw-report-icon-64',
      elementName: 'homePage_Reports_Menu',
      path: 'reports/home',
      isOffline: 'OFFLINE'
    },
    {
      menuKey: PossHomeKeyEnum.MONITORING_DASHBOARD,
      titleTranslationKey: 'pw.possHomeDashboard.monitoringDashboard',
      hasChild: false,
      iconClass: 'pw-i-64 pw-inv-mangmt-icon-64',
      elementName: 'POSS Home - MonitoringDashboard Menu',
      path: getMonitoringDashboardAllowedRouteUrl(),
      isOffline: ''
    },
    {
      menuKey: PossHomeKeyEnum.UPGRADE_VERSION,
      titleTranslationKey: 'pw.possHomeDashboard.upgradeVersion',
      hasChild: false,
      appType: AppTypesEnum.POSS,
      iconClass: 'pw-i-64 pw-report-icon-64',
      elementName: 'PossHome_UpgradeVersion_Menu',
      path: 'upgrade-version',
      isOffline: 'OFFLINE'
    }
  ];

  constructor(
    private router: Router,
    private shortcutService: ShortcutServiceAbstraction,
    private translate: TranslateService,
    private permissionfacade: PermissionFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    public scrollService: ScrollService,
    private sharedBodEodFacade: SharedBodEodFacade,
    private connectionService: ConnectionService
  ) {}

  ngOnInit() {
    this.overlayNotification.close();
    this.permissions$ = this.permissionfacade.getPermissionforURL();
    this.sharedBodEodFacade.loadLatestBusinessDay();

    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });

    combineLatest([
      this.sharedBodEodFacade
        .getBodEodStatus()
        .pipe(filter(bodEodStatus => bodEodStatus !== null)),
      this.sharedBodEodFacade.getGoldRateAvailablityStatus()
    ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(([bodEodStatus, goldRateStatus]) => {
        this.metalRateStatus = goldRateStatus;

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
      });

    this.connectionService.monitor().subscribe((isConnected: any) => {
      if (isConnected?.hasNetworkConnection) {
        this.status = 'ONLINE';
      } else {
        this.status = 'OFFLINE';
      }
      if (this.menu.length > 0) {
        this.menu = this.menu.filter(
          eachVal => eachVal?.isOffline !== this.status
        );
      }
    });

    this.sharedBodEodFacade
      .getError()
      .pipe(
        filter(data => !!data),
        takeUntil(this.destroy$)
      )
      .subscribe((error: CustomErrors) => {
        if (
          error &&
          error.code &&
          (error.code === BodEodEnum.ERR_SALE_113 ||
            error.code === BodEodEnum.ERR_ENG_003)
        ) {
          // this.showNotifications('pw.bodEod.noBusinessDay');
        } else {
          this.errorHandler(error);
        }
      });

    this.sharedBodEodFacade
      .getBodEodStatus()
      .pipe(
        filter(bodEodStatus => !!bodEodStatus),
        takeUntil(this.destroy$)
      )
      .subscribe(bodEodStatus => {
        switch (bodEodStatus) {
          case BodEodStatusEnum.CLOSED:
            this.showNotifications('pw.bodEod.noBusinessDayIsOpenErrorMessage');
            break;
          case BodEodStatusEnum.BOD_IN_PROGRESS:
            this.showNotifications('pw.bodEod.bodInProgress');
            break;
          case BodEodStatusEnum.EOD_IN_PROGRESS:
            this.showNotifications('pw.bodEod.eodInProgress');
            break;
          default:
            break;
        }
      });
  }

  showNotifications(key: string) {
    this.translate
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true, // optional
            hasBackdrop: true
          })
          .events.pipe(takeUntil(this.destroy$))
          .subscribe();
      });
  }

  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        message: error.message,
        hasClose: true, // optional
        error: error,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }

  cashMemoUrl() {
    this.router.navigate([getCashMemoUrl()]);
  }
  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  private shortcutEventHandler(command: Command) {
    if (command.name === cashMemoKey) {
      this.cashMemoUrl();
    }
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
