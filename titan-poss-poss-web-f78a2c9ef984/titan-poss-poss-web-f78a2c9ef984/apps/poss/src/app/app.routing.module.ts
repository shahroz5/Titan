import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  AuthnGuard,
  AuthzGuard,
  LoginGuard
} from '@poss-web/shared/auth/feature-auth';
import { ErrorPageComponent } from './error-page/error-page.component';
import { ProfileComponent } from '@poss-web/shared/profile/feature-profile';
import {
  PossBodCheckGuard,
  PossBodAndGoldRateCheckGuard
} from '@poss-web/shared/bod-eod/feature-bod-eod';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  // { path: 'home', pathMatch: 'full', redirectTo: 'sales' },
  {
    path: 'home',
    loadChildren: () =>
      import('@poss-web/poss/home/feature-home').then(
        m => m.PossHomeFeatureHomeModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'login',
    loadChildren: () =>
      import('@poss-web/shared/login/feature-login').then(
        m => m.SharedLoginFeatureLoginModule
      ),
    canActivate: [LoginGuard]
  },
  // Customer Transaction Routes
  {
    path: 'sales/home',
    loadChildren: () =>
      import('@poss-web/poss/sales-home/feature-sales-home').then(
        m => m.PossSalesHomeFeatureSalesHomeModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/gift-cards/history/:_id',
    loadChildren: () =>
      import(
        '@poss-web/poss/gift-cards/feature-gift-cards-history-details-shell'
      ).then(m => m.PossGiftCardsFeatureGiftCardsHistoryDetailsShellModule),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'sales/gift-cards',
    loadChildren: () =>
      import('@poss-web/poss/gift-cards/feature-gc-shell').then(
        m => m.PossGiftCardsFeatureGcShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'update-e-invoice',
    loadChildren: () =>
      import('@poss-web/poss/e-invoice/feature-update-invoice').then(
        m => m.PossEInvoiceFeatureUpdateInvoiceModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'sales/advance-booking/request-status',
    loadChildren: () =>
      import(
        '@poss-web/poss/advance-booking/feature-request-status-advance-booking'
      ).then(m => m.PossAdvanceBookingFeatureRequestStatusAdvanceBookingModule),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'configuration/printer-config',
    loadChildren: () =>
      import('@poss-web/poss/printer-config/feature-printer-config').then(
        m => m.PossPrinterConfigFeaturePrinterConfigModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'help/product-master-update',
    loadChildren: () =>
      import(
        '@poss-web/poss/product-master-update/feature-product-master-update'
      ).then(m => m.PossProductMasterUpdateFeatureProductMasterUpdateModule),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'configuration/:subMenu',
    loadChildren: () =>
      import(
        '@poss-web/poss/configuration-home/feature-configuration-home'
      ).then(m => m.PossConfigurationHomeFeatureConfigurationHomeModule),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'help/:subMenu',
    loadChildren: () =>
      import('@poss-web/poss/help-menu/feature-help-menu').then(
        m => m.PossHelpMenuFeatureHelpMenuModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'sales/advance-booking',
    loadChildren: () =>
      import(
        '@poss-web/poss/advance-booking/feature-advance-booking-shell'
      ).then(m => m.PossAdvanceBookingFeatureAdvanceBookingShellModule),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'monitoring-dashboard/:tab',
    loadChildren: () =>
      import(
        '@poss-web/shared/monitoring-dashboard/feature-monitoring-dashboard'
      ).then(m => m.SharedMonitoringDashboardFeatureMonitoringDashboardModule),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'sales/grf/history/:grfType/:_id',
    loadChildren: () =>
      import('@poss-web/poss/grf/feature-grf-history-detail-shell').then(
        m => m.PossGrfFeatureGrfHistoryDetailShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/grf',
    loadChildren: () =>
      import('@poss-web/poss/grf/feature-grf-shell').then(
        m => m.PossGrfFeatureGrfShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },

  {
    path: 'sales/grf-status/list',
    loadChildren: () =>
      import(
        '@poss-web/poss/grf-request-status/feature-grf-status-listing'
      ).then(m => m.PossGrfRequestStatusFeatureGrfStatusListingModule),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'sales/grf-status/details/:_taskId/:_processId',
    loadChildren: () =>
      import('@poss-web/poss/grf-request-status/feature-grf-status-shell').then(
        m => m.PossGrfRequestStatusFeatureGrfStatusShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'sales/ct-advance/history/:_id',
    loadChildren: () =>
      import(
        '@poss-web/poss/ct-advance/feature-advance-history-detail-shell'
      ).then(m => m.PossCtAdvanceFeatureAdvanceHistoryDetailShellModule),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'sales/ct-advance',
    loadChildren: () =>
      import('@poss-web/poss/ct-advance/feature-ct-advance-shell').then(
        m => m.PossCtAdvanceFeatureCtAdvanceShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'sales/tep',
    loadChildren: () =>
      import('@poss-web/poss/tep/feature-tep-shell').then(
        m => m.PossTepFeatureTepShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/tep-request/:tab',
    loadChildren: () =>
      import('@poss-web/poss/tep/feature-tep-request-shell').then(
        m => m.PossTepFeatureTepRequestShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/tep-request/view/:_id',
    loadChildren: () =>
      import('@poss-web/poss/tep/feature-tep-view-shell').then(
        m => m.PossTepFeatureTepViewShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/tep-request/:_action/:_txntype/:_id',
    loadChildren: () =>
      import('@poss-web/poss/tep/feature-tep-view-shell').then(
        m => m.PossTepFeatureTepViewShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/tep-request/view/:_txntype/:_id/:_processId',
    loadChildren: () =>
      import('@poss-web/poss/tep/feature-tep-view-shell').then(
        m => m.PossTepFeatureTepViewShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },

  {
    path: 'sales/advance-booking/:_tab/:_txntype/:_id/:_processId',
    loadChildren: () =>
      import(
        '@poss-web/poss/advance-booking/feature-view-advance-booking-shell'
      ).then(m => m.PossAdvanceBookingFeatureViewAdvanceBookingShellModule),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/advance-booking/:_tab/:_txntype/:_id',
    loadChildren: () =>
      import(
        '@poss-web/poss/advance-booking/feature-view-advance-booking-shell'
      ).then(m => m.PossAdvanceBookingFeatureViewAdvanceBookingShellModule),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/bill-cancellation/:type/:_id',
    loadChildren: () =>
      import('@poss-web/poss/bc/feature-bc-detail-shell').then(
        m => m.PossBcFeatureBcDetailShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/bill-cancellation/history',
    loadChildren: () =>
      import('@poss-web/poss/bc/feature-bc-history').then(
        m => m.PossBcFeatureBcHistoryModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/bill-cancellation/history/:_subTxnType/:_id',
    loadChildren: () =>
      import('@poss-web/poss/bc/feature-bc-history-details-shell').then(
        m => m.PossBcFeatureBcHistoryDetailsShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },

  {
    path: 'sales/bill-cancellation/requests/:type/:_id/:_processId',
    loadChildren: () =>
      import('@poss-web/shared/bc-requests/feature-bc-status-detail').then(
        m => m.SharedBcRequestsFeatureBcStatusDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/bill-cancellation/:tab',
    loadChildren: () =>
      import('@poss-web/poss/bc/feature-bc-shell').then(
        m => m.PossBcFeatureBcShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/bill-cancellation',
    loadChildren: () =>
      import('@poss-web/poss/bc/feature-bc-shell').then(
        m => m.PossBcFeatureBcShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },

  {
    path: 'sales/gep',
    loadChildren: () =>
      import('@poss-web/poss/gep/feature-gep-shell').then(
        m => m.PossGepFeatureGepShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/airpayRequests/:type',
    loadChildren: () =>
      import('@poss-web/poss/airpay-requests/feature-airpay-requests').then(
        m => m.PossAirpayRequestsFeatureAirpayRequestsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'sales/razorpayRequests/:type',
    loadChildren: () =>
      import(
        '@poss-web/poss/razorpay-status-check/feature-razorpay-requests'
      ).then(m => m.PossRazorpayStatusCheckFeatureRazorpayRequestsModule),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },

  // {
  //   path: 'sales/advance-booking/:tab/:_id',
  //   loadChildren: () =>
  //     import(
  //       '@poss-web/poss/advance-booking/feature-advance-booking-shell'
  //     ).then(m => m.PossAdvanceBookingFeatureAdvanceBookingShellModule),
  //   canActivate: [AuthnGuard, AuthzGuard]
  // },
  {
    path: 'sales/pendingFoc',
    loadChildren: () =>
      import('@poss-web/poss/foc/feature-foc-shell').then(
        m => m.PossFocFeatureFocShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/credit-notes/transfer',
    loadChildren: () =>
      import('@poss-web/poss/cn-transfer/feature-cn-transfer-shell').then(
        m => m.PossCnTransferFeatureCnTransferShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/credit-notes/transfer/:tab/details/:_id',
    loadChildren: () =>
      import(
        '@poss-web/poss/cn-transfer/feature-cn-transfer-details-shell'
      ).then(m => m.PossCnTransferFeatureCnTransferDetailsShellModule),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'home/banking-revenue/bank-deposit',
    loadChildren: () =>
      import(
        '@poss-web/shared/boutique-bank-deposit/feature-boutique-bank-deposit-listing'
      ).then(
        m => m.SharedBoutiqueBankDepositFeatureBoutiqueBankDepositListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'sales/credit-notes/transfer/:tab/details/:_id/:_taskId/:_taskName',
    loadChildren: () =>
      import(
        '@poss-web/poss/cn-transfer/feature-cn-transfer-details-shell'
      ).then(m => m.PossCnTransferFeatureCnTransferDetailsShellModule),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/credit-notes/transfer/:tab/details/:_locationCode/:_id',
    loadChildren: () =>
      import(
        '@poss-web/poss/cn-transfer/feature-cn-transfer-details-shell'
      ).then(m => m.PossCnTransferFeatureCnTransferDetailsShellModule),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'banking-revenue/walk-ins-record',
    loadChildren: () =>
      import('@poss-web/poss/walk-ins/feature-walk-ins-record').then(
        m => m.PossWalkInsFeatureWalkInsRecordModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'banking-revenue/eghs-offline-bod-list',
    loadChildren: () =>
      import('@poss-web/poss/bod-eod/feature-view-eghs-offline-bod').then(
        m => m.PossBodEodFeatureViewEghsOfflineBodModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'sales/credit-notes/:_tabType',
    loadChildren: () =>
      import('@poss-web/poss/credit-note/feature-cn-search').then(
        m => m.PossCreditNoteFeatureCnSearchModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'banking-revenue/view-bank-deposit',
    loadChildren: () =>
      import('@poss-web/shared/bank-deposit/feature-bank-deposit').then(
        m => m.SharedBankDepositFeatureBankDepositModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'banking-revenue/day-wise',
    loadChildren: () =>
      import('@poss-web/shared/revenue/feature-day-wise-revenue').then(
        m => m.SharedRevenueFeatureDayWiseRevenueModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'banking-revenue/today',
    loadChildren: () =>
      import('@poss-web/shared/revenue/feature-today-revenue').then(
        m => m.SharedRevenueFeatureTodayRevenueModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'home/banking-revenue/pif-series',
    loadChildren: () =>
      import('@poss-web/poss/pif-series/feature-pif-series-list').then(
        m => m.PossPifSeriesFeaturePifSeriesListModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'home/banking-revenue/bod-eod',
    loadChildren: () =>
      import('@poss-web/poss/bod-eod/feature-bod-eod').then(
        m => m.PossBodEodFeatureBodEodModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'sales/grn/:type',
    loadChildren: () =>
      import('@poss-web/poss/grn/feature-grn-status').then(
        m => m.PossGrnFeatureGrnStatusModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/grn/:type/:_grnId',
    loadChildren: () =>
      import('@poss-web/poss/grn/feature-grn-details-shell').then(
        m => m.PossGrnFeatureGrnDetailsShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },

  {
    path: 'sales/cash-memo/history/:_subTxnType/:_id',
    loadChildren: () =>
      import(
        '@poss-web/poss/cash-memo/feature-cash-memo-history-details-shell'
      ).then(m => m.PossCashMemoFeatureCashMemoHistoryDetailsShellModule),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/cash-memo',
    loadChildren: () =>
      import('@poss-web/poss/cash-memo/feature-cm-shell').then(
        m => m.PossCashMemoFeatureCmShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/customer-order',
    loadChildren: () =>
      import('@poss-web/poss/customer-order/feature-co-shell').then(
        m => m.PossCustomerOrderFeatureCoShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'sales/ro-request/list',
    loadChildren: () =>
      import(
        '@poss-web/shared/ro-request-approvals/feature-ro-request-approvals-status'
      ).then(
        m => m.SharedRoRequestApprovalsFeatureRoRequestApprovalsStatusModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'sales/:tab/list',
    loadChildren: () =>
      import(
        '@poss-web/shared/manual-cm-request/feature-cm-request-listing'
      ).then(m => m.SharedManualCmRequestFeatureCmRequestListingModule),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },

  {
    path: 'sales/:tab/details/:_txnType/:_id',
    loadChildren: () =>
      import(
        '@poss-web/shared/manual-cm-request/feature-cm-request-shell'
      ).then(m => m.SharedManualCmRequestFeatureCmRequestShellModule),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'banking-revenue/home',
    loadChildren: () =>
      import('@poss-web/shared/revenue/feature-revenue-home').then(
        m => m.SharedRevenueFeatureRevenueHomeModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'master/boutique-masters/update-metal-rates',
    loadChildren: () =>
      import('@poss-web/poss/metal-rates/feature-metal-rates').then(
        m => m.PossMetalRatesFeatureMetalRatesModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'master/:subMenu',
    loadChildren: () =>
      import('@poss-web/shared/master-home/feature-master-home').then(
        m => m.SharedMasterHomeFeatureMasterHomeModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'master/boutique-masters/item-list',
    loadChildren: () =>
      import('@poss-web/shared/item-master/feature-item-listing').then(
        m => m.SharedItemMasterFeatureItemListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'master/boutique-masters/item-master/:_itemCode/item-details',
    loadChildren: () =>
      import('@poss-web/shared/item-master/feature-item-detail').then(
        m => m.SharedItemMasterFeatureItemDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'master/boutique-masters/stone-list',
    loadChildren: () =>
      import('@poss-web/shared/stone/feature-stone-listing').then(
        m => m.SharedStoneFeatureStoneListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'master/company-related/bank-priority-list',
    loadChildren: () =>
      import(
        '@poss-web/shared/bank-priority-master/feature-bank-priority-master-listing'
      ).then(
        m => m.SharedBankPriorityMasterFeatureBankPriorityMasterListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },

  {
    path: 'home/banking/upload-eGHS',
    loadChildren: () =>
      import(
        '@poss-web/shared/upload-eghs-bank-deposit/feature-upload-eghs'
      ).then(m => m.SharedUploadEghsBankDepositFeatureUploadEghsModule),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'master/boutique-masters/customer-town-list',
    loadChildren: () =>
      import('@poss-web/poss/customer-town/feature-customer-town-listing').then(
        m => m.PossCustomerTownFeatureCustomerTownListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'master/boutique-masters/catchment-list',
    loadChildren: () =>
      import(
        '@poss-web/shared/catchment-master/feature-catchment-master-listing'
      ).then(m => m.SharedCatchmentMasterFeatureCatchmentMasterListingModule),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },
  {
    path: 'boutique-master/banking/payer-banks',
    loadChildren: () =>
      import('@poss-web/shared/payer-bank/feature-payer-bank-list').then(
        m => m.SharedPayerBankFeaturePayerBankListModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodCheckGuard]
  },

  {
    path: 'user-profile',
    component: ProfileComponent,
    canActivate: [AuthnGuard]
  },
  {
    path: 'activate-user',
    loadChildren: () =>
      import('@poss-web/shared/activate-user/feature-activate-user').then(
        m => m.SharedActivateUserFeatureActivateUserModule
      )
  },
  {
    path: 'forgot-password',
    loadChildren: () =>
      import('@poss-web/shared/forgot-password/feature-forgot-password').then(
        m => m.SharedForgotPasswordFeatureForgotPasswordModule
      )
  },
  // yet to change
  {
    path: 'sales/credit-note/:_tabType/:_requestType/:_id',
    loadChildren: () =>
      import('@poss-web/poss/credit-note/feature-cn-shell').then(
        m => m.PossCreditNoteFeatureCnShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },

  {
    path:
      'sales/credit-note/:_tabType/:_requestType/:_docNo/:_fiscalYear/:_ghsDocNo',
    loadChildren: () =>
      import('@poss-web/poss/credit-note/feature-cn-shell').then(
        m => m.PossCreditNoteFeatureCnShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'digital-signature',
    loadChildren: () =>
      import('@poss-web/poss/digital-signature/feature-digital-signature').then(
        m => m.PossDigitalSignatureFeatureDigitalSignatureModule
      ),
    canActivate: [AuthnGuard]
  },
  {
    path: 'sales/gep/history/:_subTxntype/:_id',
    loadChildren: () =>
      import('@poss-web/poss/gep/feature-gep-view-shell').then(
        m => m.PossGepFeatureGepViewShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'find-price',
    loadChildren: () =>
      import('@poss-web/poss/find-price/feature-find-price').then(
        m => m.PossFindPriceFeatureFindPriceModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, PossBodAndGoldRateCheckGuard]
  },
  {
    path: 'upgrade-version',
    loadChildren: () =>
      import('@poss-web/poss/upgrade-version/feature-upgrade-version').then(
        m => m.PossUpgradeVersionFeatureUpgradeVersionModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'home/banking/upload-service-poss',
    loadChildren: () =>
      import(
        '@poss-web/shared/upload-service-poss-bank-deposit/feature-upload-service-poss'
      ).then(
        m => m.SharedUploadServicePossBankDepositFeatureUploadServicePossModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  // {
  //   path: 'home/app-version-dashboard',
  //   loadChildren: () =>
  //     import(
  //       '@poss-web/shared/app-version-dashboard/feature-app-version-dashboard'
  //     ).then(m => m.SharedAppVersionDashboardFeatureAppVersionDashboardModule),
  //   canActivate: [AuthnGuard, AuthzGuard]
  // },

  {
    path: '404',
    component: ErrorPageComponent
  },
  {
    path: '503',
    component: ErrorPageComponent
  },

  {
    path: '500',
    component: ErrorPageComponent
  },
  { path: '**', pathMatch: 'full', component: ErrorPageComponent }
];

@NgModule({
  // useHash supports github.io demo page, remove in your app
  imports: [
    RouterModule.forRoot(routes, {
      enableTracing: false
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
