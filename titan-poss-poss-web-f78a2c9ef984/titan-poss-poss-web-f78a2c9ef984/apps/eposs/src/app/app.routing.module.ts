import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import {
  AuthnGuard,
  AuthzGuard,
  LoginGuard
} from '@poss-web/shared/auth/feature-auth';
import { ProfileComponent } from '@poss-web/shared/profile/feature-profile';
import { EpossBodCheckGuard } from '@poss-web/shared/bod-eod/feature-bod-eod';
import { ErrorPageComponent } from './error-page/error-page.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  // { path: 'home', pathMatch: 'full', redirectTo: 'inventory/home' },
  {
    path: 'home',
    loadChildren: () =>
      import('@poss-web/eposs/home/feature-home').then(
        m => m.EpossHomeFeatureEpossHomeModule
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
  {
    path: 'product-search',
    loadChildren: () =>
      import(
        '@poss-web/shared/item-master/ui-product-search-autocomplete'
      ).then(m => m.SharedItemMasterUiProductSearchAutocompleteModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'reports/home',
    loadChildren: () =>
      import('@poss-web/shared/reports/feature-reports-home').then(
        m => m.SharedReportsFeatureReportsHomeModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'reports/settings/:_type',
    loadChildren: () =>
      import('@poss-web/shared/reports/feature-report-settings').then(
        m => m.SharedReportsFeatureReportSettingsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'reports/list',
    loadChildren: () =>
      import('@poss-web/shared/reports/feature-report-list').then(
        m => m.SharedReportsFeatureReportListModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'reports/role-mapping',
    loadChildren: () =>
      import('@poss-web/shared/reports/feature-report-role-maping').then(
        m => m.SharedReportsFeatureReportRoleMapingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },

  {
    path: 'reports/auto-generation',
    loadChildren: () =>
      import('@poss-web/shared/reports/feature-report-auto').then(
        m => m.SharedReportsFeatureReportAutoModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'reports',
    loadChildren: () =>
      import('@poss-web/shared/reports/feature-reports').then(
        m => m.SharedReportsFeatureReportsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },

  {
    path: 'documents/search',
    loadChildren: () =>
      import(
        '@poss-web/eposs/digitization-documents-search/feature-digitization-documents-search'
      ).then(
        m =>
          m.EpossDigitizationDocumentsSearchFeatureDigitizationDocumentsSearchModule
      ),
    canActivate: [AuthnGuard]
  },

  // Inventory Routes
  {
    path: 'inventory/home',
    loadChildren: () =>
      import('@poss-web/eposs/inventory-home/feature-inventory-home').then(
        m => m.EpossInventoryHomeFeatureInventoryHomeModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'inventory/instock/home',
    loadChildren: () =>
      import('@poss-web/eposs/instock-home/feature-instock-home-shell').then(
        m => m.EpossInstockHomeFeatureInstockHomeShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'inventory/stockreceive',
    loadChildren: () =>
      import('@poss-web/eposs/stock-receive/feature-stock-receive-shell').then(
        m => m.EpossStockReceiveFeatureStockReceiveShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/stockreceive/:type',
    loadChildren: () =>
      import('@poss-web/eposs/stock-receive/feature-stock-receive-shell').then(
        m => m.EpossStockReceiveFeatureStockReceiveShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
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
    path: 'inventory/stockreceive/:type/:requestType',
    loadChildren: () =>
      import('@poss-web/eposs/stock-receive/feature-stock-receive-shell').then(
        m => m.EpossStockReceiveFeatureStockReceiveShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/stockreceive/history/:requestType/:_id',
    loadChildren: () =>
      import(
        '@poss-web/eposs/stock-receive/feature-stock-receive-history-details'
      ).then(m => m.EpossStockReceiveFeatureStockReceiveHistoryDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'inventory/stockreceive/:type/:_id/:tab',
    loadChildren: () =>
      import(
        '@poss-web/eposs/stock-receive/feature-stock-receive-details'
      ).then(m => m.EpossStockReceiveFeatureStockReceiveDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'inventory/stockissue/invoice/history/:invoiceType',
    loadChildren: () =>
      import(
        '@poss-web/eposs/stock-return/feature-stock-return-history-list'
      ).then(m => m.EpossStockReturnFeatureStockReturnHistoryListModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'inventory/stockissue/cfa',
    loadChildren: () =>
      import('@poss-web/eposs/stock-return/feature-stock-return-details').then(
        m => m.EpossStockReturnFeatureStockReturnDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'inventory/stockissue/directtransfer',
    loadChildren: () =>
      import('@poss-web/eposs/stock-return/feature-stock-return-details').then(
        m => m.EpossStockReturnFeatureStockReturnDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'inventory/stockissue/factory/tep-gep/:transferType',
    loadChildren: () =>
      import(
        '@poss-web/eposs/stock-issue-tep-gep/feature-stock-issue-tep-gep-details'
      ).then(m => m.EpossStockIssueTepGepFeatureStockIssueTepGepDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'inventory/stockissue',
    loadChildren: () =>
      import('@poss-web/eposs/stock-issue/feature-stock-issue-shell').then(
        m => m.EpossStockIssueFeatureStockIssueShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'inventory/stockissue/:type',
    loadChildren: () =>
      import('@poss-web/eposs/stock-issue/feature-stock-issue-shell').then(
        m => m.EpossStockIssueFeatureStockIssueShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/stockissue/:type/:requestType',
    loadChildren: () =>
      import('@poss-web/eposs/stock-issue/feature-stock-issue-shell').then(
        m => m.EpossStockIssueFeatureStockIssueShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'inventory/stockissue/details/cancel/boutique/:_reqDocNo',
    loadChildren: () =>
      import(
        '@poss-web/eposs/stock-issue/feature-stock-issue-cancel-details'
      ).then(m => m.EpossStockIssueFeatureStockIssueCancelDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'inventory/stockissue/details/:type/:requestType/:_reqDocNo',
    loadChildren: () =>
      import(
        '@poss-web/eposs/stock-issue/feature-stock-issue-history-details'
      ).then(m => m.EpossStockIssueFeatureStockIssueHistoryDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'approvals/bill-cancellation-requests/:tab',
    loadChildren: () =>
      import('@poss-web/shared/bc-requests/feature-bc-shell').then(
        m => m.SharedBcRequestsFeatureBcShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/advance-booking/cancellation/:tab',
    loadChildren: () =>
      import(
        '@poss-web/eposs/ab-cancellation-requests/ab-cancellation-requests-shell'
      ).then(
        m => m.EpossAbCancellationRequestsAbCancellationRequestsShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/advance-booking/activation/:tab',
    loadChildren: () =>
      import(
        '@poss-web/eposs/ab-activation-requests/ab-activation-requests-shell'
      ).then(m => m.EpossAbActivationRequestsAbActivationRequestsShellModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/advance-booking/manual/:tab',
    loadChildren: () =>
      import(
        '@poss-web/eposs/ab-manual-requests/ab-manual-requests-feature'
      ).then(m => m.EpossAbManualRequestsAbManualRequestsFeatureModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/advance-booking/manual/requests/:_taskId/:_processId',
    loadChildren: () =>
      import(
        '@poss-web/eposs/ab-manual-requests/ab-manual-requests-shell'
      ).then(m => m.EpossAbManualRequestsAbManualRequestsShellModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/stockissue/details/:type/:_reqDocNo',
    loadChildren: () =>
      import('@poss-web/eposs/stock-issue/feature-stock-issue-details').then(
        m => m.EpossStockIssueFeatureStockIssueDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/instock/inter-boutique-transfer/create-request',
    loadChildren: () =>
      import('@poss-web/eposs/ibt/feature-ibt-create-request').then(
        m => m.EpossIbtFeatureIbtCreateRequestModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'inventory/instock/inter-boutique-transfer/:requestType',
    loadChildren: () =>
      import('@poss-web/eposs/ibt/feature-ibt-list').then(
        m => m.EpossIbtFeatureIbtListModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/instock/inter-boutique-transfer',
    loadChildren: () =>
      import('@poss-web/eposs/ibt/feature-ibt-details').then(
        m => m.EpossIbtFeatureIbtDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/instock/conversion/requests/:_id',
    loadChildren: () =>
      import('@poss-web/eposs/conversion/feature-conversion-details').then(
        m => m.EpossConversionFeatureConversionDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'inventory/instock/conversion/:type',
    loadChildren: () =>
      import('@poss-web/eposs/conversion/feature-conversion').then(
        m => m.EpossConversionFeatureConversionModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/instock/conversion/:type/:requestType',
    loadChildren: () =>
      import('@poss-web/eposs/conversion/feature-conversion').then(
        m => m.EpossConversionFeatureConversionModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/instock/conversion/:type/:requestType/:_id',
    loadChildren: () =>
      import(
        '@poss-web/eposs/conversion/feature-conversion-history-details'
      ).then(m => m.EpossConversionFeatureConversionHistoryDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'inventory/instock/bintobinTransfer/:type',
    loadChildren: () =>
      import(
        '@poss-web/eposs/bin-bin-transfer/feature-bin-bin-transfer-list'
      ).then(m => m.EpossBinBinTransferFeatureBinBinTransferListModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/instock/binCreation/:type',
    loadChildren: () =>
      import('@poss-web/eposs/new-bin-request/feature-bin-details').then(
        m => m.EpossNewBinRequestFeatureBinDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/instock/bintobinTransfer',
    loadChildren: () =>
      import(
        '@poss-web/eposs/bin-bin-transfer/feature-bin-bin-transfer-details'
      ).then(m => m.EpossBinBinTransferFeatureBinBinTransferDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/instock/update-item-hallmark-details',
    loadChildren: () =>
      import(
        '@poss-web/eposs/update-hallmark/feature-update-hallmark'
      ).then(m => m.EpossUpdateHallmarkFeatureUpdateHallmarkModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'inventory/instock/other-receipts-issues-list/:listType/:tabType/:type',
    loadChildren: () =>
      import(
        '@poss-web/eposs/other-receipt-issue/feature-other-receipt-issue-list'
      ).then(m => m.EpossOtherReceiptIssueFeatureOtherReceiptIssueListModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'inventory/instock/other-receipts-issues-list/history/details/:tabType/:type/:_id',
    loadChildren: () =>
      import(
        '@poss-web/eposs/other-receipt-issue/feature-other-receipt-issue-history-details'
      ).then(
        m =>
          m.EpossOtherReceiptIssueFeatureOtherReceiptIssueHistoryDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/instock/:type/create/:transferType/:tab',
    loadChildren: () =>
      import(
        '@poss-web/eposs/other-issue/feature-other-issue-exh-create-request'
      ).then(m => m.EpossOtherIssueFeatureOtherIssueExhCreateRequestModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/instock/:tabType/:type/:_reqDocNo',
    loadChildren: () =>
      import(
        '@poss-web/eposs/other-issue/feature-other-issue-exh-details'
      ).then(m => m.EpossOtherIssueFeatureOtherIssueExhDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/instock/otherissues/Adjustment',
    loadChildren: () =>
      import(
        '@poss-web/eposs/other-issue/feature-other-issue-adj-details'
      ).then(m => m.EpossOtherIssueFeatureOtherIssueAdjDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/instock/otherissues/PSV',
    loadChildren: () =>
      import(
        '@poss-web/eposs/other-issue/feature-other-issue-psv-details'
      ).then(m => m.EpossOtherIssueFeatureOtherIssuePsvDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/instock/otherissues/FOC',
    loadChildren: () =>
      import(
        '@poss-web/eposs/other-issue/feature-other-issue-foc-details'
      ).then(m => m.EpossOtherIssueFeatureOtherIssueFocDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'inventory/instock/other-receipts-issues-list/:tabType/:type/:_id/:tab',
    loadChildren: () =>
      import(
        '@poss-web/eposs/other-receipt/feature-other-receipt-details'
      ).then(m => m.EpossOtherReceiptFeatureOtherReceiptDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/instock/otherreceipts/Adjustment',
    loadChildren: () =>
      import(
        '@poss-web/eposs/other-receipt/feature-other-receipt-adj-details'
      ).then(m => m.EpossOtherReceiptFeatureOtherReceiptAdjDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'inventory/instock/otherreceipts/PSV',
    loadChildren: () =>
      import(
        '@poss-web/eposs/other-receipt/feature-other-receipt-psv-details'
      ).then(m => m.EpossOtherReceiptFeatureOtherReceiptPsvDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'approvals/inventory-approvals/conversion/:tab',
    loadChildren: () =>
      import(
        '@poss-web/eposs/conversion-approvals/feature-conversion-approvals'
      ).then(m => m.EpossConversionApprovalsFeatureConversionApprovalsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/inventory-approvals/conversion-details/:_id',
    loadChildren: () =>
      import(
        '@poss-web/eposs/conversion-approvals/feature-conversion-approval-details'
      ).then(
        m => m.EpossConversionApprovalsFeatureConversionApprovalDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/inventory-approvals/IbtRequest/:_id',
    loadChildren: () =>
      import(
        '@poss-web/eposs/request-approvals/feature-ibt-request-approval-details'
      ).then(
        m => m.EpossRequestApprovalsFeatureIbtRequestApprovalDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/inventory-approvals/IbtCancellationRequest/:_id',
    loadChildren: () =>
      import(
        '@poss-web/eposs/request-approvals/feature-ibt-cancel-request-approval-details'
      ).then(
        m => m.EpossRequestApprovalsFeatureIbtCancelRequestApprovalDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/inventory-approvals/OtherIssuesRequest/:tab/:_id',
    loadChildren: () =>
      import(
        '@poss-web/eposs/request-approvals/feature-other-issues-approval-details'
      ).then(
        m => m.EpossRequestApprovalsFeatureOtherIssuesApprovalDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/inventory-approvals/OtherIssuesRequest/:tab',
    loadChildren: () =>
      import(
        '@poss-web/eposs/request-approvals/feature-request-approval-listing'
      ).then(m => m.EpossRequestApprovalsFeatureRequestApprovalListingModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'approvals/inventory-approvals/:type',
    loadChildren: () =>
      import(
        '@poss-web/eposs/request-approvals/feature-request-approval-listing'
      ).then(m => m.EpossRequestApprovalsFeatureRequestApprovalListingModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'files/data-upload',
    loadChildren: () =>
      import('@poss-web/eposs/data-upload/feature-data-upload').then(
        m => m.EpossDataUploadFeatureDataUploadModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  // UAM Routes
  {
    path: 'uam/users',
    loadChildren: () =>
      import('@poss-web/shared/user-mgmt/feature-user-listing').then(
        m => m.SharedUserMgmtFeatureUserListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'uam/access-control',
    loadChildren: () =>
      import(
        '@poss-web/shared/access-control-mgmt/feature-access-control'
      ).then(m => m.SharedAccessControlMgmtFeatureAccessControlModule),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'uam/users/:_id',
    loadChildren: () =>
      import('@poss-web/shared/user-mgmt/feature-user-detail').then(
        m => m.SharedUserMgmtFeatureUserDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'uam/home',
    loadChildren: () =>
      import('@poss-web/shared/uam-home/feature-uam-home').then(
        m => m.SharedUamHomeFeatureUamHomeModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
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
  {
    path: 'uam/role-limit-requests/:_requestid',
    loadChildren: () =>
      import('@poss-web/shared/role-config/feature-request-detail').then(
        m => m.SharedRoleConfigFeatureRequestDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'uam',
    loadChildren: () =>
      import('@poss-web/shared/role-mgmt-shell/feature-shell-role-mgmt').then(
        m => m.SharedRoleMgmtShellFeatureShellRoleMgmtModule
      ),
    canActivate: [AuthnGuard, AuthzGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'user-profile',
    component: ProfileComponent,
    canActivate: [AuthnGuard]
  },

  // MASTER Routes
  {
    path: 'master/product-masters/item-list',
    loadChildren: () =>
      import('@poss-web/shared/item-master/feature-item-listing').then(
        m => m.SharedItemMasterFeatureItemListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/lov-master-list',
    loadChildren: () =>
      import('@poss-web/shared/list-of-values/feature-lov-listing').then(
        m => m.SharedListOfValuesFeatureLovListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/location-masters/price-group-mapping',
    loadChildren: () =>
      import(
        '@poss-web/shared/price-group-mapping/feature-price-group-mapping'
      ).then(m => m.SharedPriceGroupMappingFeaturePriceGroupMappingModule),
    // loadChildren: () =>
    //   import('@poss-web/shared/location-setup/feature-location-detail').then(
    //     m => m.SharedLocationSetupFeatureLocationDetailModule
    //   ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'master/:subMenu',
    loadChildren: () =>
      import('@poss-web/shared/master-home/feature-master-home').then(
        m => m.SharedMasterHomeFeatureMasterHomeModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'master/product-masters/item-master/:_itemCode/item-details',
    loadChildren: () =>
      import('@poss-web/shared/item-master/feature-item-detail').then(
        m => m.SharedItemMasterFeatureItemDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'master/product-masters/product-category-list',
    loadChildren: () =>
      import(
        '@poss-web/shared/product-category/feature-product-category-listing'
      ).then(m => m.SharedProductCategoryFeatureProductCategoryListingModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/product-masters/stone-list',
    loadChildren: () =>
      import('@poss-web/shared/stone/feature-stone-listing').then(
        m => m.SharedStoneFeatureStoneListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'master/product-attributes/stone-type-list',
    loadChildren: () =>
      import('@poss-web/shared/stone-type/feature-stone-type-listing').then(
        m => m.SharedStoneTypeFeatureStoneTypeListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/location-masters/location-list',
    loadChildren: () =>
      import(
        '@poss-web/shared/location-master/feature-location-master-listing'
      ).then(m => m.SharedLocationMasterFeatureLocationMasterListingModule),
    // loadChildren: () =>
    //   import('@poss-web/shared/location-setup/feature-location-listing').then(
    //     m => m.SharedLocationSetupFeatureLocationListingModule
    //   ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/location-masters/location/:_locCode',
    loadChildren: () =>
      import(
        '@poss-web/shared/location-master/feature-location-master-detail'
      ).then(m => m.SharedLocationMasterFeatureLocationMasterDetailModule),
    // loadChildren: () =>
    //   import('@poss-web/shared/location-setup/feature-location-detail').then(
    //     m => m.SharedLocationSetupFeatureLocationDetailModule
    //   ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard],
    runGuardsAndResolvers: 'always'
  },
  {
    path: 'master/location-masters/price-group-mapping/:_locCode',
    loadChildren: () =>
      import(
        '@poss-web/shared/price-group-mapping/feature-price-group-mapping'
      ).then(m => m.SharedPriceGroupMappingFeaturePriceGroupMappingModule),
    // loadChildren: () =>
    //   import('@poss-web/shared/location-setup/feature-location-detail').then(
    //     m => m.SharedLocationSetupFeatureLocationDetailModule
    //   ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard],
    runGuardsAndResolvers: 'always'
  },

  {
    path: 'master/location-masters/market-code-list',
    loadChildren: () =>
      import('@poss-web/shared/market-code/feature-market-code-listing').then(
        m => m.SharedMarketCodeFeatureMarketCodeListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/inventory-masters/courier-list',
    loadChildren: () =>
      import('@poss-web/shared/courier/feature-courier-listing').then(
        m => m.SharedCourierFeatureCourierListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'master/inventory-masters/courier',
    loadChildren: () =>
      import('@poss-web/shared/courier/feature-courier-detail').then(
        m => m.SharedCourierFeatureCourierDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/product-masters/product-group-list',
    loadChildren: () =>
      import('@poss-web/shared/cfa-product/feature-cfa-product-listing').then(
        m => m.SharedCfaProductFeatureCfaProductListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/product-masters/product-group',
    loadChildren: () =>
      import('@poss-web/shared/cfa-product/feature-cfa-product-detail').then(
        m => m.SharedCfaProductFeatureCfaProductDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'master/product-masters/sub-brand-list',
    loadChildren: () =>
      import('@poss-web/shared/sub-brand/feature-sub-brand').then(
        m => m.SharedSubBrandFeatureSubBrandModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'master/product-masters/brand-list',
    loadChildren: () =>
      import('@poss-web/shared/brand/feature-brand-listing').then(
        m => m.SharedBrandFeatureBrandListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'master/product-masters/brand-master/:_brand-code',
    loadChildren: () =>
      import('@poss-web/shared/brand/feature-brand-detail').then(
        m => m.SharedBrandFeatureBrandDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard],
    runGuardsAndResolvers: 'always'
  },

  {
    path: 'master/product-attributes/purity',
    loadChildren: () =>
      import('@poss-web/shared/purity/feature-purity-listing').then(
        m => m.SharedPurityFeaturePurityListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'master/product-attributes/material-type-list',
    loadChildren: () =>
      import('@poss-web/shared/metal-type/feature-metal-type-listing').then(
        m => m.SharedMetalTypeFeatureMetalTypeListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'master/product-attributes/purity-list',
    loadChildren: () =>
      import('@poss-web/shared/purity/feature-purity-listing').then(
        m => m.SharedPurityFeaturePurityListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'master/product-attributes/vendor-master-list',
    loadChildren: () =>
      import('@poss-web/shared/vendor-master/feature-vendor-master').then(
        m => m.SharedVendorMasterFeatureVendorMasterModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/inventory-masters/bin-group-list',
    loadChildren: () =>
      import('@poss-web/shared/bin-group/feature-bin-group').then(
        m => m.SharedBinGroupFeatureBinGroupModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'master/inventory-masters/bin-code-list',
    loadChildren: () =>
      import('@poss-web/shared/bin/feature-bin-listing').then(
        m => m.SharedBinFeatureBinListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'master/location-masters/corporate-town-list',
    loadChildren: () =>
      import(
        '@poss-web/shared/corporate-town/feature-corporate-town-listing'
      ).then(m => m.SharedCorporateTownFeatureCorporateTownListingModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'configuration/inventory-configuration/weight-tolerance-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/weight-tolerance/feature-weight-tolerance-listing'
      ).then(m => m.EpossWeightToleranceFeatureWeightToleranceListingModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/inventory-configuration/weight-tolerance-config/:_configId',
    loadChildren: () =>
      import(
        '@poss-web/eposs/weight-tolerance/feature-weight-tolerance-detail'
      ).then(m => m.EpossWeightToleranceFeatureWeightToleranceDetailModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/bgr-configuration/bgr-config-list',
    loadChildren: () =>
      import('@poss-web/eposs/bgr-config/feature-bgr-config-listing').then(
        m => m.EpossBgrConfigFeatureBgrConfigListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/bgr-configuration/bgr-config/:_configId/:_ruleType',
    loadChildren: () =>
      import('@poss-web/eposs/bgr-config/feature-bgr-config-detail').then(
        m => m.EpossBgrConfigFeatureBgrConfigDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/location-masters/region-list',
    loadChildren: () =>
      import('@poss-web/shared/region/feature-region-listing').then(
        m => m.SharedRegionFeatureRegionListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'master/location-masters/sub-region-list',
    loadChildren: () =>
      import('@poss-web/shared/sub-region/feature-sub-region-listing').then(
        m => m.SharedSubRegionFeatureSubRegionListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/location-masters/state-list',
    loadChildren: () =>
      import('@poss-web/shared/state/feature-state-listing').then(
        m => m.SharedStateFeatureStateListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/location-masters/country-list',
    loadChildren: () =>
      import(
        '@poss-web/shared/country-master/feature-country-master-listing'
      ).then(m => m.SharedCountryMasterFeatureCountryMasterListingModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/location-masters/currency-list',
    loadChildren: () =>
      import(
        '@poss-web/shared/currency-master/feature-currency-master-listing'
      ).then(m => m.SharedCurrencyMasterFeatureCurrencyMasterListingModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/product-pricing/complexity-price-group-list',
    loadChildren: () =>
      import(
        '@poss-web/shared/complexity-pricegroup-map/feature-complexity-pricegroup-map-listing'
      ).then(
        m =>
          m.SharedComplexityPricegroupMapFeatureComplexityPricegroupMapListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'master/product-pricing/price-group-list',
    loadChildren: () =>
      import('@poss-web/shared/price-group/feature-price-group').then(
        m => m.SharedPriceGroupFeaturePriceGroupModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/product-pricing/market-price-list/:_materialType',
    loadChildren: () =>
      import(
        '@poss-web/shared/market-material-price/feature-market-material-price-listing'
      ).then(
        m => m.SharedMarketMaterialPriceFeatureMarketMaterialPriceListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/product-pricing/market-price/:_materialType/:type/:_mode',
    loadChildren: () =>
      import(
        '@poss-web/shared/market-material-price/feature-market-material-price-detail'
      ).then(
        m => m.SharedMarketMaterialPriceFeatureMarketMaterialPriceDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'master/product-pricing/f2-margin-list',
    loadChildren: () =>
      import('@poss-web/shared/f2-margin/feature-f2-margin').then(
        m => m.SharedF2MarginFeatureF2MarginModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/product-pricing/ucp-market-code-list',
    loadChildren: () =>
      import(
        '@poss-web/shared/ucp-market-code-factor/feature-ucp-market-code-factor'
      ).then(m => m.SharedUcpMarketCodeFactorFeatureUcpMarketCodeFactorModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/tax-masters/tax-master-list',
    loadChildren: () =>
      import('@poss-web/shared/tax-master/feature-tax-master-listing').then(
        m => m.SharedTaxMasterFeatureTaxMasterListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/tax-masters/tax-class-list',
    loadChildren: () =>
      import('@poss-web/shared/tax-class/feature-tax-class-listing').then(
        m => m.SharedTaxClassFeatureTaxClassListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'master/payment-masters/transaction-type-list',
    loadChildren: () =>
      import(
        '@poss-web/shared/transaction-type-master/feature-transaction-type-master-listing'
      ).then(
        m =>
          m.SharedTransactionTypeMasterFeatureTransactionTypeMasterListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'master/payment-masters/payment-mode-list',
    loadChildren: () =>
      import('@poss-web/shared/payment-master/feature-payment-master').then(
        m => m.SharedPaymentMasterFeaturePaymentMasterModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
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

  {
    path: 'master/product-attributes/complexity-list',
    loadChildren: () =>
      import('@poss-web/shared/complexity-code/feature-complexity-code').then(
        m => m.SharedComplexityCodeFeatureComplexityCodeModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/inventory-configuration/conversion-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/conversion-config/feature-conversion-config-list'
      ).then(m => m.EpossConversionConfigFeatureConversionConfigListModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/inventory-configuration/conversion-config/:_configId',
    loadChildren: () =>
      import(
        '@poss-web/eposs/conversion-config/feature-conversion-config-details'
      ).then(m => m.EpossConversionConfigFeatureConversionConfigDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'configuration/banking-revenue/payee-bank-list',
    loadChildren: () =>
      import('@poss-web/shared/payee-bank/feature-payee-bank-listing').then(
        m => m.SharedPayeeBankFeaturePayeeBankListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/banking-revenue/payee-bank/:_bankName/:type',
    loadChildren: () =>
      import('@poss-web/shared/payee-bank/feature-payee-bank-detail').then(
        m => m.SharedPayeeBankFeaturePayeeBankDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  //configuration
  {
    path: 'configuration/inventory-configuration/ibt-config-list',
    loadChildren: () =>
      import('@poss-web/eposs/ibt-config/feature-ibt-config-listing').then(
        m => m.EpossIbtConfigFeatureIbtConfigListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'configuration/inventory-configuration/ibt-config/:_configId',
    loadChildren: () =>
      import('@poss-web/eposs/ibt-config/feature-ibt-config-detail').then(
        m => m.EpossIbtConfigFeatureIbtConfigDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/payment-configuration/cash-payment-config',
    loadChildren: () =>
      import(
        '@poss-web/eposs/cash-payment-config/feature-cash-payment-config-detail'
      ).then(m => m.EpossCashPaymentConfigFeatureCashPaymentConfigDetailModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/grn-configuration/grn-interboutique-config',
    loadChildren: () =>
      import(
        '@poss-web/eposs/grn-interboutique-config/feature-grn-interboutique-config'
      ).then(
        m => m.EpossGrnInterboutiqueConfigFeatureGrnInterboutiqueConfigModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/global-configuration/password-config',
    loadChildren: () =>
      import('@poss-web/eposs/password-config/feature-generate-password').then(
        m => m.EpossPasswordConfigFeatureGeneratePasswordModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'configuration/global-configuration/amendment-config',
    loadChildren: () =>
      import('@poss-web/eposs/amendment-config/feature-amendment-config').then(
        m => m.EpossAmendmentConfigFeatureAmendmentConfigModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/global-configuration/employee-loan-config',
    loadChildren: () =>
      import(
        '@poss-web/eposs/employee-loan-config/feature-employee-loan-config'
      ).then(m => m.EpossEmployeeLoanConfigFeatureEmployeeLoanConfigModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'configuration/inventory-configuration/inv-global-config/:_configId',
    loadChildren: () =>
      import(
        '@poss-web/eposs/inventory-global-config/feature-inv-global-config-detail'
      ).then(
        m => m.EpossInventoryGlobalConfigFeatureInvGlobalConfigDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/inventory-configuration/inv-global-config',
    redirectTo: 'configuration/inventory-configuration/inv-global-config/',
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/ab-configuration/residual-weight-tolerance-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/residual-weight-config/feature-residual-weight-config-listing'
      ).then(
        m => m.EpossResidualWeightConfigFeatureResidualWeightConfigListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/exchange-configuration/max-flat-tep-configuration',
    loadChildren: () =>
      import(
        '@poss-web/eposs/max-flat-tep-config/feature-max-flat-tep-config'
      ).then(m => m.EpossMaxFlatTepConfigFeatureMaxFlatTepConfigModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/ab-configuration/residual-weight-tolerance/:_configId',
    loadChildren: () =>
      import(
        '@poss-web/eposs/residual-weight-config/feature-residual-weight-config-details'
      ).then(
        m => m.EpossResidualWeightConfigFeatureResidualWeightConfigDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/ab-configuration/:orderType/ab-tolerance-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/ab-tolerance-config/feature-ab-tolerance-config-listing'
      ).then(
        m => m.EpossAbToleranceConfigFeatureAbToleranceConfigListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/ab-configuration/:orderType/ab-tolerance-config/:_configId',
    loadChildren: () =>
      import(
        '@poss-web/eposs/ab-tolerance-config/feature-ab-tolerance-config-details'
      ).then(
        m => m.EpossAbToleranceConfigFeatureAbToleranceConfigDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/bgr-configuration/bgr-tolerance-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/bgr-tolerance-config/feature-bgr-tolerance-config-listing'
      ).then(
        m => m.EpossBgrToleranceConfigFeatureBgrToleranceConfigListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/bgr-configuration/bgr-tolerance-config/:_configId/:_ruleType',
    loadChildren: () =>
      import(
        '@poss-web/eposs/bgr-tolerance-config/feature-bgr-tolerance-config-details'
      ).then(
        m => m.EpossBgrToleranceConfigFeatureBgrToleranceConfigDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/discount-configuration/discount/list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/discount-config/feature-discount-config-list'
      ).then(m => m.EpossDiscountConfigFeatureDiscountConfigListModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  // {
  //   path: 'configuration/discount-request-configuration/:type/:_configId',
  //   loadChildren: () =>
  //     import('@poss-web/eposs/discount-config/feature-discount-config').then(
  //       m => m.EpossDiscountConfigFeatureDiscountConfigModule
  //     ),
  //   canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  // },

  {
    path: 'configuration/discount-configuration/discount/request',
    loadChildren: () =>
      import(
        '@poss-web/eposs/discount-config/feature-discount-config-request'
      ).then(m => m.EpossDiscountConfigFeatureDiscountConfigRequestModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/discount-configuration/rivaah-eligibility',
    loadChildren: () =>
      import(
        '@poss-web/eposs/rivaah-eligibility-config/feature-rivaah-eligibility-config-shell'
      ).then(
        m =>
          m.EpossRivaahEligibilityConfigFeatureRivaahEligibilityConfigShellModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/discount-configuration/:tab/:_configId',
    loadChildren: () =>
      import('@poss-web/eposs/discount-config/feature-discount-config').then(
        m => m.EpossDiscountConfigFeatureDiscountConfigModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path:
      'configuration/customer-transaction-configuration/payment-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/payment-configuration/feature-payment-configuration-listing'
      ).then(
        m => m.EpossPaymentConfigurationFeaturePaymentConfigurationListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/customer-transaction-configuration/payment-config/:_configId',
    loadChildren: () =>
      import(
        '@poss-web/eposs/payment-configuration/feature-payment-configuration-detail'
      ).then(
        m => m.EpossPaymentConfigurationFeaturePaymentConfigurationDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/global-configuration/ranges',
    loadChildren: () =>
      import('@poss-web/eposs/range/feature-range-details').then(
        m => m.EpossRangeFeatureRangeDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/tax-configuration/state-tax-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/state-tax-config/feature-state-tax-config-listing'
      ).then(m => m.EpossStateTaxConfigFeatureStateTaxConfigListingModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/tax-configuration/state-tax-config-details',
    loadChildren: () =>
      import(
        '@poss-web/eposs/state-tax-config/feature-state-tax-config-detail'
      ).then(m => m.EpossStateTaxConfigFeatureStateTaxConfigDetailModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/tax-configuration/state-tax-config-details/:_configId',
    loadChildren: () =>
      import(
        '@poss-web/eposs/state-tax-config/feature-state-tax-config-detail'
      ).then(m => m.EpossStateTaxConfigFeatureStateTaxConfigDetailModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/customer-transaction-configuration/cpg-qcgc-map-config-list',
    loadChildren: () =>
      import('@poss-web/shared/cpg-qcgc-map/feature-cpg-qcgc-map-listing').then(
        m => m.SharedCpgQcgcMapFeatureCpgQcgcMapListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/customer-transaction-configuration/cpg-qcgc-map-config-details/:_id',
    loadChildren: () =>
      import('@poss-web/shared/cpg-qcgc-map/feature-cpg-qcgc-map-detail').then(
        m => m.SharedCpgQcgcMapFeatureCpgQcgcMapDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/exchange-configuration/tep-exchange-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/tep-exception-config/feature-tep-exception-config-listing'
      ).then(
        m => m.EpossTepExceptionConfigFeatureTepExceptionConfigListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/exchange-configuration/tep-exchange-config-details/:_id',
    loadChildren: () =>
      import(
        '@poss-web/eposs/tep-exception-config/feature-tep-exception-config-detail'
      ).then(
        m => m.EpossTepExceptionConfigFeatureTepExceptionConfigDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/exchange-configuration/tep-product-group-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/tep-product-group/feature-tep-product-group-listing'
      ).then(m => m.EpossTepProductGroupFeatureTepProductGroupListingModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/exchange-configuration/tep-product-group-config-details/:_id',
    loadChildren: () =>
      import(
        '@poss-web/eposs/tep-product-group/feature-tep-product-group-detail'
      ).then(m => m.EpossTepProductGroupFeatureTepProductGroupDetailModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/exchange-configuration/tep-validation-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/tep-validation-config/feature-tep-validation-config-listing'
      ).then(
        m => m.EpossTepValidationConfigFeatureTepValidationConfigListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/exchange-configuration/tep-validation-config-details/:_id',
    loadChildren: () =>
      import(
        '@poss-web/eposs/tep-validation-config/feature-tep-validation-config-detail'
      ).then(
        m => m.EpossTepValidationConfigFeatureTepValidationConfigDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/exchange-configuration/tep-stone-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/tep-stone-config/feature-tep-stone-config-listing'
      ).then(m => m.EpossTepStoneConfigFeatureTepStoneConfigListingModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/exchange-configuration/tep-stone-config-details/:_id',
    loadChildren: () =>
      import(
        '@poss-web/eposs/tep-stone-config/feature-tep-stone-config-detail'
      ).then(m => m.EpossTepStoneConfigFeatureTepStoneConfigDetailModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/customer-transaction-configuration/grf-tolerance-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/grf-tolerance-config/feature-grf-tolerance-config-listing'
      ).then(
        m => m.EpossGrfToleranceConfigFeatureGrfToleranceConfigListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/customer-transaction-configuration/grf-tolerance-config/:_id',
    loadChildren: () =>
      import(
        '@poss-web/eposs/grf-tolerance-config/feature-grf-tolerance-config-detail'
      ).then(
        m => m.EpossGrfToleranceConfigFeatureGrfToleranceConfigDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/grn-configuration/grn-tolerance-config/list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/grn-tolerance-config/feature-grn-tolerance-config-listing'
      ).then(
        m => m.EpossGrnToleranceConfigFeatureGrnToleranceConfigListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/grn-configuration/grn-tolerance-config/:_id',
    loadChildren: () =>
      import(
        '@poss-web/eposs/grn-tolerance-config/feature-grn-tolerance-config-detail'
      ).then(
        m => m.EpossGrnToleranceConfigFeatureGrnToleranceConfigDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'configuration/payment-configuration/cashback-offer-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/cashback-offer-config/feature-cashback-offer-config-list'
      ).then(
        m => m.EpossCashbackOfferConfigFeatureCashbackOfferConfigListModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/payment-configuration/cashback-offer-config/:_configId',
    loadChildren: () =>
      import(
        '@poss-web/eposs/cashback-offer-config/feature-cashback-offer-config-detail'
      ).then(
        m => m.EpossCashbackOfferConfigFeatureCashbackOfferConfigDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/banking-revenue/gl-boutique-location-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/gl-boutique-location/feature-gl-boutique-location-listing'
      ).then(
        m => m.EpossGlBoutiqueLocationFeatureGlBoutiqueLocationListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/banking-revenue/gl-boutique-location/:_loc/details',
    loadChildren: () =>
      import(
        '@poss-web/eposs/gl-boutique-location/feature-gl-boutique-location-detail'
      ).then(
        m => m.EpossGlBoutiqueLocationFeatureGlBoutiqueLocationDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/banking-revenue/gl-location-payment-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/gl-location-payment/feature-gl-location-payment-listing'
      ).then(
        m => m.EpossGlLocationPaymentFeatureGlLocationPaymentListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/:subMenu',
    loadChildren: () =>
      import(
        '@poss-web/eposs/configuration-home/feature-configuration-home'
      ).then(m => m.EpossConfigurationHomeFeatureConfigurationHomeModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  //approvals
  {
    path: 'approvals/:subMenu',
    loadChildren: () =>
      import('@poss-web/eposs/approvals-home/feature-approvals-home').then(
        m => m.EpossApprovalsHomeFeatureApprovalsHomeModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/grn-requests/:type',
    loadChildren: () =>
      import(
        '@poss-web/eposs/grn-request-approvals/feature-grn-request-approvals'
      ).then(m => m.EpossGrnRequestApprovalsFeatureGrnRequestApprovalsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/ro-request/:type',
    loadChildren: () =>
      import(
        '@poss-web/shared/ro-request-approvals/feature-ro-request-approvals'
      ).then(m => m.SharedRoRequestApprovalsFeatureRoRequestApprovalsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'approvals/cn-requests/:type',
    loadChildren: () =>
      import('@poss-web/eposs/cn-approvals/feature-cn-approvals').then(
        m => m.EpossCnApprovalsFeatureCnApprovalsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/tep-requests/:type',
    loadChildren: () =>
      import('@poss-web/eposs/tep-approval/feature-regular-tep-approval').then(
        m => m.EpossTepApprovalFeatureRegularTepApprovalModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/tep-exception-requests/list',
    loadChildren: () =>
      import('@poss-web/eposs/tep-approval/feature-tep-exception-approval').then(
        m => m.EpossTepApprovalFeatureTepExceptionApprovalModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/tep-refund-status/cheque',
    loadChildren: () =>
      import('@poss-web/eposs/tep-approval/feature-refund-list').then(
        m => m.EpossTepApprovalFeatureRefundListModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/full-value-tep-requests/list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/tep-approval/feature-full-value-tep-approval'
      ).then(m => m.EpossTepApprovalFeatureFullValueTepApprovalModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/tep-refund-status/rtgs',
    loadChildren: () =>
      import('@poss-web/eposs/tep-approval/feature-refund-list').then(
        m => m.EpossTepApprovalFeatureRefundListModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/uam/role-limit-requests',
    loadChildren: () =>
      import('@poss-web/eposs/approvals/feature-request-listing').then(
        m => m.EpossApprovalsFeatureRequestListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/uam/role-limit-requests/:_requestId',
    loadChildren: () =>
      import('@poss-web/eposs/approvals/feature-request-details').then(
        m => m.EpossApprovalsFeatureRequestDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/customer-transaction-configuration/unipay-access-mapping-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/unipay-config/feature-unipay-access-mapping'
      ).then(m => m.EpossUnipayConfigurationFeatureUnipayAccessMappingModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/customer-transaction-configuration/gv-status-update-list',
    loadChildren: () =>
      import('@poss-web/eposs/gv-status-update/feature-gv-status-update').then(
        m => m.EpossGvStatusUpdateFeatureGvStatusUpdateModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path:
      'configuration/customer-transaction-configuration/product-group-mapping-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/encircle-product-group-mapping/feature-encircle-product-group-mapping'
      ).then(
        m =>
          m.EpossEncircleProductGroupMappingFeatureEncircleProductGroupMappingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/banking-revenue/payer-bank-config/:_configName',
    loadChildren: () =>
      import(
        '@poss-web/eposs/payer-bank-config/feature-payer-bank-config-details'
      ).then(m => m.EpossPayerBankConfigFeaturePayerBankConfigDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/banking-revenue/payer-bank-list',
    loadChildren: () =>
      import('@poss-web/shared/payer-bank/feature-payer-bank-list').then(
        m => m.SharedPayerBankFeaturePayerBankListModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/banking-revenue/payer-bank-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/payer-bank-config/feature-payer-bank-config-list'
      ).then(m => m.EpossPayerBankConfigFeaturePayerBankConfigListModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/customer-transaction-configuration/airpay-host-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/airpay-host-config/feature-airpay-host-config'
      ).then(m => m.EpossAirpayHostConfigFeatureAirpayHostConfigModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/customer-transaction-configuration/razorpay-host-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/razorpay-hostname-config/feature-razorpay-hostname-config-mapping'
      ).then(
        m =>
          m.EpossRazorpayHostnameConfigFeatureRazorpayHostnameConfigMappingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/customer-transaction-configuration/razorpay-vendor-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/razorpay-vendor-config/feature-razorpay-vendor-config-mapping'
      ).then(
        m => m.EpossRazorpayVendorConfigFeatureRazorpayVendorConfigMappingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/global-configuration/airpay-config-list',
    loadChildren: () =>
      import('@poss-web/eposs/airpay-config/feature-airpay-config').then(
        m => m.EpossAirpayConfigFeatureAirpayConfigModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  // {
  //   path: 'boutique-master/:subMenu',
  //   loadChildren: () =>
  //     import('@poss-web/shared/master-home/feature-master-home').then(
  //       m => m.SharedMasterHomeFeatureMasterHomeModule
  //     ),
  //   canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  // },
  {
    path: 'approvals/grf-request/list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/grf-manual-request/feature-grf-request-listing'
      ).then(m => m.EpossGrfManualRequestFeatureGrfRequestListingModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/grf-request/details/:_taskId/:_processId',
    loadChildren: () =>
      import(
        '@poss-web/eposs/grf-manual-request/feature-grf-request-shell'
      ).then(m => m.EpossGrfManualRequestFeatureGrfRequestShellModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/:tab/list',
    loadChildren: () =>
      import(
        '@poss-web/shared/manual-cm-request/feature-cm-request-listing'
      ).then(m => m.SharedManualCmRequestFeatureCmRequestListingModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'approvals/cm-requests/details/:_taskId/:_processId',
    loadChildren: () =>
      import(
        '@poss-web/shared/manual-cm-request/feature-cm-request-shell'
      ).then(m => m.SharedManualCmRequestFeatureCmRequestShellModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/foc-configuration/foc-blocking-location-level',
    loadChildren: () =>
      import(
        '@poss-web/eposs/foc-blocking-location-level/feature-foc-bll-list'
      ).then(m => m.EpossFocBlockingLocationLevelFeatureFocBllListModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/customer-transaction-configuration/customer-transaction-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/customer-transaction-config/feature-customer-transaction-config-list'
      ).then(
        m =>
          m.EpossCustomerTransactionConfigFeatureCustomerTransactionConfigListModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/customer-transaction-configuration/customer-transaction-config/:_configName',
    loadChildren: () =>
      import(
        '@poss-web/eposs/customer-transaction-config/feature-customer-transaction-details'
      ).then(
        m =>
          m.EpossCustomerTransactionConfigFeatureCustomerTransactionDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/gep-configuration/geppurity-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/gep-purity-config/feature-gep-purity-config-list'
      ).then(m => m.EpossGepPurityConfigFeatureGepPurityConfigListModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/gep-configuration/geppurity-config/:_configName/view',
    loadChildren: () =>
      import(
        '@poss-web/eposs/gep-purity-config/feature-gep-purity-config-view'
      ).then(m => m.EpossGepPurityConfigFeatureGepPurityConfigViewModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/gep-configuration/geppurity-config/:_configName/:_tabType',
    loadChildren: () =>
      import(
        '@poss-web/eposs/gep-purity-config/feature-gep-purity-config-details'
      ).then(m => m.EpossGepPurityConfigFeatureGepPurityConfigDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/gep-configuration/gep-purity-configuration/:_configName',
    loadChildren: () =>
      import(
        '@poss-web/eposs/gep-purity-config/feature-gep-purity-config-details'
      ).then(m => m.EpossGepPurityConfigFeatureGepPurityConfigDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/customer-transaction-configuration/gst-mapping',
    loadChildren: () =>
      import('@poss-web/eposs/gst-mapping/feature-gst-mapping').then(
        m => m.EpossGstMappingFeatureGstMappingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/credit-note-configuration/credit-note-master-list',
    loadChildren: () =>
      import('@poss-web/eposs/cn-master/feature-cn-master-listing').then(
        m => m.EpossCnMasterFeatureCnMasterListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/credit-note-configuration/credit-note-master/:_cnType',
    loadChildren: () =>
      import('@poss-web/eposs/cn-master/feature-cn-master-detail').then(
        m => m.EpossCnMasterFeatureCnMasterDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/credit-note-configuration/credit-note-master-view/:_cnType',
    loadChildren: () =>
      import('@poss-web/eposs/cn-master/feature-cn-master-view-detail').then(
        m => m.EpossCnMasterFeatureCnMasterViewDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/credit-note-configuration/credit-note-validation-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/cn-validation/feature-cn-validation-listing'
      ).then(m => m.EpossCnValidationFeatureCnValidationListingModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/credit-note-configuration/credit-note-validation/:_ruleId/:_ruleType',
    loadChildren: () =>
      import('@poss-web/eposs/cn-validation/feature-cn-validation-detail').then(
        m => m.EpossCnValidationFeatureCnValidationDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/credit-note-configuration/credit-note-validation-view/:_ruleId/:_ruleType',
    loadChildren: () =>
      import(
        '@poss-web/eposs/cn-validation/feature-cn-validation-view-detail'
      ).then(m => m.EpossCnValidationFeatureCnValidationViewDetailModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/credit-note-configuration/credit-note-direct',
    loadChildren: () =>
      import(
        '@poss-web/eposs/credit-note-direct/feature-credit-note-direct'
      ).then(m => m.EpossCreditNoteDirectFeatureCreditNoteDirectModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
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
    path: 'banking-revenue/today',
    loadChildren: () =>
      import('@poss-web/shared/revenue/feature-today-revenue').then(
        m => m.SharedRevenueFeatureTodayRevenueModule
      ),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'configuration/foc-configuration/foc-blocking-customer-level',
    loadChildren: () =>
      import(
        '@poss-web/eposs/foc-blocking-customer-level/feature-foc-bcl-list'
      ).then(m => m.EpossFocBlockingCustomerLevelFeatureFocBclListModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/foc-configuration/foc-config/:_configId/view',
    loadChildren: () =>
      import('@poss-web/eposs/foc-config/feature-foc-config-view').then(
        m => m.EpossFocConfigFeatureFocConfigViewModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/foc-configuration/foc-config/:_configId/variant-details',
    loadChildren: () =>
      import('@poss-web/eposs/foc-config/feature-foc-variant-details').then(
        m => m.EpossFocConfigFeatureFocVariantDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/foc-configuration/foc-config/:_configId',
    loadChildren: () =>
      import('@poss-web/eposs/foc-config/feature-foc-config-detail').then(
        m => m.EpossFocConfigFeatureFocConfigDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/foc-configuration/foc-config-list',
    loadChildren: () =>
      import('@poss-web/eposs/foc-config/feature-foc-config-list').then(
        m => m.EpossFocConfigFeatureFocConfigListModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/ab-configuration/order-payment-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/order-payment-config/feature-order-payment-config-listing'
      ).then(
        m => m.EpossOrderPaymentConfigFeatureOrderPaymentConfigListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/ab-configuration/order-payment-config/:_configId',
    loadChildren: () =>
      import(
        '@poss-web/eposs/order-payment-config/feature-order-payment-config-detail'
      ).then(
        m => m.EpossOrderPaymentConfigFeatureOrderPaymentConfigDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/discount-configuration/clubbing-discount-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/clubbing-discount-config/feature-clubbing-discount-config'
      ).then(
        m => m.EpossClubbingDiscountConfigFeatureClubbingDiscountConfigModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/credit-note-configuration/cn-priority-config/:_configId',
    loadChildren: () =>
      import(
        '@poss-web/eposs/cn-priority-config/feature-cn-priority-config-detail'
      ).then(m => m.EpossCnPriorityConfigFeatureCnPriorityConfigDetailModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/credit-note-configuration/cn-priority-config-view/:_configId',
    loadChildren: () =>
      import(
        '@poss-web/eposs/cn-priority-config/feature-cn-priority-config-view-detail'
      ).then(
        m => m.EpossCnPriorityConfigFeatureCnPriorityConfigViewDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/credit-note-configuration/cn-priority-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/cn-priority-config/feature-cn-priority-config-listing'
      ).then(m => m.EpossCnPriorityConfigFeatureCnPriorityConfigListingModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/grn-configuration/grn-approval-access-listing',
    loadChildren: () =>
      import(
        '@poss-web/eposs/grn-approval-config/feature-grn-approval-config-listing'
      ).then(
        m => m.EpossGrnApprovalConfigFeatureGrnApprovalConfigListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/grn-configuration/grn-approval-access/:_ruleId/:_ruleType',
    loadChildren: () =>
      import(
        '@poss-web/eposs/grn-approval-config/feature-grn-approval-config-detail'
      ).then(m => m.EpossGrnApprovalConfigFeatureGrnApprovalConfigDetailModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/grn-configuration/grn-approval-access/view/:_ruleId/:_ruleType',
    loadChildren: () =>
      import(
        '@poss-web/eposs/grn-approval-config/feature-grn-approval-config-view-detail'
      ).then(
        m => m.EpossGrnApprovalConfigFeatureGrnApprovalConfigViewDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },

  {
    path: 'files/file-status-list',
    loadChildren: () =>
      import('@poss-web/shared/file-upload/feature-file-status').then(
        m => m.SharedFileUploadFeatureFileStatusModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'files/home',
    loadChildren: () =>
      import('@poss-web/shared/file-upload/feature-file-home').then(
        m => m.SharedFileUploadFeatureFileHomeModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/exchange-configuration/cut-piece-tot',
    loadChildren: () =>
      import('@poss-web/eposs/cut-piece-tot/feature-cut-piece-tot-detail').then(
        m => m.EpossCutPieceTotFeatureCutPieceTotDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/customer-transaction-configuration/cut-piece-config',
    loadChildren: () =>
      import(
        '@poss-web/eposs/cut-piece-config/feature-cut-piece-config-details'
      ).then(m => m.EpossCutPieceConfigFeatureCutPieceConfigDetailsModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/customer-transaction/ftep-approval-access-listing',
    loadChildren: () =>
      import(
        '@poss-web/eposs/ftep-approval-config/feature-ftep-approval-config-listing'
      ).then(
        m => m.EpossFtepApprovalConfigFeatureFtepApprovalConfigListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/customer-transaction/ftep-approval-access/:_ruleId/:_ruleType',
    loadChildren: () =>
      import(
        '@poss-web/eposs/ftep-approval-config/feature-ftep-approval-config-detail'
      ).then(
        m => m.EpossFtepApprovalConfigFeatureFtepApprovalConfigDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/customer-transaction/ftep-approval-access/view/:_ruleId/:_ruleType',
    loadChildren: () =>
      import(
        '@poss-web/eposs/ftep-approval-config/feature-ftep-approval-config-view-detail'
      ).then(
        m => m.EpossFtepApprovalConfigFeatureFtepApprovalConfigViewDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/discount-configuration/:tab/:_configId/view',
    loadChildren: () =>
      import(
        '@poss-web/eposs/discount-config/feature-discount-config-view'
      ).then(m => m.EpossDiscountConfigFeatureDiscountConfigViewModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'home/app-version-dashboard',
    loadChildren: () =>
      import(
        '@poss-web/shared/app-version-dashboard/feature-app-version-dashboard'
      ).then(m => m.SharedAppVersionDashboardFeatureAppVersionDashboardModule),
    canActivate: [AuthnGuard, AuthzGuard]
  },
  {
    path: 'configuration/co-configuration/residual-weight-tolerance-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/co-residual-weight-config/feature-co-residual-weight-config-listing'
      ).then(
        m =>
          m.EpossCoResidualWeightConfigFeatureCoResidualWeightConfigListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/co-configuration/residual-weight-tolerance/:_configId',
    loadChildren: () =>
      import(
        '@poss-web/eposs/co-residual-weight-config/feature-co-residual-weight-config-details'
      ).then(
        m =>
          m.EpossCoResidualWeightConfigFeatureCoResidualWeightConfigDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/co-configuration/:orderType/co-tolerance-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/co-tolerance-config/feature-co-tolerance-config-listing'
      ).then(
        m => m.EpossCoToleranceConfigFeatureCoToleranceConfigListingModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path:
      'configuration/co-configuration/:orderType/co-tolerance-config/:_configId',
    loadChildren: () =>
      import(
        '@poss-web/eposs/co-tolerance-config/feature-co-tolerance-config-details'
      ).then(
        m => m.EpossCoToleranceConfigFeatureCoToleranceConfigDetailsModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/co-configuration/order-payment-config-list',
    loadChildren: () =>
      import(
        '@poss-web/eposs/co-order-payment-config/feature-co-order-payment-config'
      ).then(m => m.EpossCoOrderPaymentConfigFeatureCoOrderPaymentConfigModule),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  {
    path: 'configuration/co-configuration/order-payment-config/:_configId',
    loadChildren: () =>
      import(
        '@poss-web/eposs/co-order-payment-config/feature-co-order-payment-config-detail'
      ).then(
        m => m.EpossCoOrderPaymentConfigFeatureCoOrderPaymentConfigDetailModule
      ),
    canActivate: [AuthnGuard, AuthzGuard, EpossBodCheckGuard]
  },
  // {
  //   path: '500',
  //   component: ErrorPageComponent
  // },
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
