import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ReportListItemComponent } from './report-list-item/report-list-itemcomponent';
import { ReportListComponent } from './report-list/report-list.component';
import { ReportAutoComponent } from './report-auto/report-auto.component';
import { ReportRoleMappingItemsComponent } from './report-role-mapping-items/report-role-mapping-items.component';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { DiscountLocReportFilterBtqUserComponent } from './report-filters/discount-report-filter/discount-location-report/discount-loc-report-filter-btq-user/discount-loc-report-filter-btq-user.component';
import { DiscountLocReportFilterRegUserComponent } from './report-filters/discount-report-filter/discount-location-report/discount-loc-report-filter-reg-user/discount-loc-report-filter-reg-user.component';
import { DiscountLocReportFilterCorpUserComponent } from './report-filters/discount-report-filter/discount-location-report/discount-loc-report-filter-corp-user/discount-loc-report-filter-corp-user.component';
import { DiscountTxnReportFilterBtqUserComponent } from './report-filters/discount-report-filter/discount-transaction-report/discount-txn-report-filter-btq-user/discount-txn-report-filter-btq-user.component';
import { DiscountTxnReportFilterCorpUserComponent } from './report-filters/discount-report-filter/discount-transaction-report/discount-txn-report-filter-corp-user/discount-txn-report-filter-corp-user.component';
import { DiscountTxnReportFilterRegUserComponent } from './report-filters/discount-report-filter/discount-transaction-report/discount-txn-report-filter-reg-user/discount-txn-report-filter-reg-user.component';
import { DiscountCommonFilterBtqUserComponent } from './report-filters/discount-report-filter/discount-common-report/discount-common-filter-btq-user/discount-common-filter-btq-user.component';
import { DiscountCommonFilterCorpUserComponent } from './report-filters/discount-report-filter/discount-common-report/discount-common-filter-corp-user/discount-common-filter-corp-user.component';
import { DiscountCommonFilterRegUserComponent } from './report-filters/discount-report-filter/discount-common-report/discount-common-filter-reg-user/discount-common-filter-reg-user.component';
import { PaymentFilterBtqUserComponent } from './report-filters/payment-report-filter/payment-common-report/payment-filter-btq-user/payment-filter-btq-user.component';
import { PaymentFilterCorpUserComponent } from './report-filters/payment-report-filter/payment-common-report/payment-filter-corp-user/payment-filter-corp-user.component';
import { PaymentFilterRegUserComponent } from './report-filters/payment-report-filter/payment-common-report/payment-filter-reg-user/payment-filter-reg-user.component';
import { PaymentDetailFilterRegUserComponent } from './report-filters/payment-report-filter/payment-detail-report/payment-detail-filter-reg-user/payment-detail-filter-reg-user.component';
import { PaymentDetailFilterCorpUserComponent } from './report-filters/payment-report-filter/payment-detail-report/payment-detail-filter-corp-user/payment-detail-filter-corp-user.component';
import { PaymentDetailFilterBtqUserComponent } from './report-filters/payment-report-filter/payment-detail-report/payment-detail-filter-btq-user/payment-detail-filter-btq-user.component';
import { CnRegisterFilterBtqUserComponent } from './report-filters/cn-report-filter/cn-register-report/cn-register-filter-btq-user/cn-register-filter-btq-user.component';
import { CnRegisterFilterCorpUserComponent } from './report-filters/cn-report-filter/cn-register-report/cn-register-filter-corp-user/cn-register-filter-corp-user.component';
import { CnRegisterFilterRegUserComponent } from './report-filters/cn-report-filter/cn-register-report/cn-register-filter-reg-user/cn-register-filter-reg-user.component';
import { CnFilterRegUserComponent } from './report-filters/cn-report-filter/cn-common-report/cn-filter-reg-user/cn-filter-reg-user.component';
import { CnFilterCorpUserComponent } from './report-filters/cn-report-filter/cn-common-report/cn-filter-corp-user/cn-filter-corp-user.component';
import { CnFilterBtqUserComponent } from './report-filters/cn-report-filter/cn-common-report/cn-filter-btq-user/cn-filter-btq-user.component';
import { InventoryOtherIssueBtqUserComponent } from './report-filters/inventory-report-filter/inventory-other-issue/inventory-other-issue-btq-user/inventory-other-issue-btq-user.component';
import { InventoryOtherIssueCorpUserComponent } from './report-filters/inventory-report-filter/inventory-other-issue/inventory-other-issue-corp-user/inventory-other-issue-corp-user.component';
import { InventoryOtherIssueRegUserComponent } from './report-filters/inventory-report-filter/inventory-other-issue/inventory-other-issue-reg-user/inventory-other-issue-reg-user.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { InventoryOtherReceiptBtqUserComponent } from './report-filters/inventory-report-filter/inventory-other-receipt/inventory-other-receipt-btq-user/inventory-other-receipt-btq-user.component';
import { InventoryOtherReceiptCorpUserComponent } from './report-filters/inventory-report-filter/inventory-other-receipt/inventory-other-receipt-corp-user/inventory-other-receipt-corp-user.component';
import { InventoryOtherReceiptRegUserComponent } from './report-filters/inventory-report-filter/inventory-other-receipt/inventory-other-receipt-reg-user/inventory-other-receipt-reg-user.component';
import { InventoryStockDetailsBtqUserComponent } from './report-filters/inventory-report-filter/inventory-stock-receive-details/inventory-stock-details-btq-user/inventory-stock-details-btq-user.component';
import { InventoryStockDetailsRegUserComponent } from './report-filters/inventory-report-filter/inventory-stock-receive-details/inventory-stock-details-reg-user/inventory-stock-details-reg-user.component';
import { InventoryStockDetailsCorpUserComponent } from './report-filters/inventory-report-filter/inventory-stock-receive-details/inventory-stock-details-corp-user/inventory-stock-details-corp-user.component';
import { InventoryStockSummaryBtqUserComponent } from './report-filters/inventory-report-filter/inventory-stock-receive-summary/inventory-stock-summary-btq-user/inventory-stock-summary-btq-user.component';
import { InventoryStockSummaryCorpUserComponent } from './report-filters/inventory-report-filter/inventory-stock-receive-summary/inventory-stock-summary-corp-user/inventory-stock-summary-corp-user.component';
import { InventoryStockSummaryRegUserComponent } from './report-filters/inventory-report-filter/inventory-stock-receive-summary/inventory-stock-summary-reg-user/inventory-stock-summary-reg-user.component';
import { InventoryFilterBtqUserComponent } from './report-filters/inventory-report-filter/inventory-common-report/inventory-filter-btq-user/inventory-filter-btq-user.component';
import { InventoryFilterCorpUserComponent } from './report-filters/inventory-report-filter/inventory-common-report/inventory-filter-corp-user/inventory-filter-corp-user.component';
import { InventoryFilterRegUserComponent } from './report-filters/inventory-report-filter/inventory-common-report/inventory-filter-reg-user/inventory-filter-reg-user.component';
import { SalesReportCommonRegUserComponent } from './report-filters/sales-report-filter/sales-report-common/sales-report-common-reg-user/sales-report-common-reg-user.component';
import { SalesReportCommonBtqUserComponent } from './report-filters/sales-report-filter/sales-report-common/sales-report-common-btq-user/sales-report-common-btq-user.component';
import { SalesReportCommonCorpUserComponent } from './report-filters/sales-report-filter/sales-report-common/sales-report-common-corp-user/sales-report-common-corp-user.component';
import { SalesReportFilterCorpUserComponent } from './report-filters/sales-report-filter/sales-report/sales-report-filter-corp-user/sales-report-filter-corp-user.component';
import { SalesReportFilterBtqUserComponent } from './report-filters/sales-report-filter/sales-report/sales-report-filter-btq-user/sales-report-filter-btq-user.component';
import { SalesReportFilterRegUserComponent } from './report-filters/sales-report-filter/sales-report/sales-report-filter-reg-user/sales-report-filter-reg-user.component';
import { InventoryStockIssueDetailsBtqUserComponent } from './report-filters/inventory-report-filter/inventory-stock-issue-details/inventory-stock-issue-details-btq-user/inventory-stock-issue-details-btq-user.component';
import { InventoryStockIssueDetailsCorpUserComponent } from './report-filters/inventory-report-filter/inventory-stock-issue-details/inventory-stock-issue-details-corp-user/inventory-stock-issue-details-corp-user.component';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { InventoryStockIssueDetailsRegUserComponent } from './report-filters/inventory-report-filter/inventory-stock-issue-details/inventory-stock-issue-details-reg-user/inventory-stock-issue-details-reg-user.component';
// import { DiscountsReportFilterComponent } from './discounts-report-filter/discounts-report-filter.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    SharedPermissionUiPermissionModule
  ],
  declarations: [
    ReportListItemComponent,
    ReportListComponent,
    ReportAutoComponent,
    ReportRoleMappingItemsComponent,
    DiscountLocReportFilterCorpUserComponent,
    DiscountLocReportFilterBtqUserComponent,
    DiscountLocReportFilterRegUserComponent,
    SalesReportFilterCorpUserComponent,
    SalesReportFilterBtqUserComponent,
    SalesReportFilterRegUserComponent,
    DiscountTxnReportFilterBtqUserComponent,
    DiscountTxnReportFilterCorpUserComponent,
    DiscountTxnReportFilterRegUserComponent,
    // DiscountCommonReportComponent,
    DiscountCommonFilterBtqUserComponent,
    DiscountCommonFilterCorpUserComponent,
    DiscountCommonFilterRegUserComponent,
    PaymentFilterBtqUserComponent,
    PaymentFilterCorpUserComponent,
    PaymentFilterRegUserComponent,
    PaymentDetailFilterRegUserComponent,
    PaymentDetailFilterCorpUserComponent,
    PaymentDetailFilterBtqUserComponent,
    CnRegisterFilterBtqUserComponent,
    CnRegisterFilterCorpUserComponent,
    CnRegisterFilterRegUserComponent,
    CnFilterRegUserComponent,
    CnFilterCorpUserComponent,
    CnFilterBtqUserComponent,
    InventoryOtherIssueBtqUserComponent,
    InventoryOtherIssueCorpUserComponent,
    InventoryOtherIssueRegUserComponent,
    InventoryOtherReceiptBtqUserComponent,
    InventoryOtherReceiptCorpUserComponent,
    InventoryOtherReceiptRegUserComponent,

    InventoryStockDetailsRegUserComponent,
    InventoryStockDetailsCorpUserComponent,
    InventoryStockDetailsBtqUserComponent,
    InventoryStockSummaryBtqUserComponent,
    InventoryStockSummaryCorpUserComponent,
    InventoryStockSummaryRegUserComponent,
    InventoryFilterBtqUserComponent,
    InventoryFilterCorpUserComponent,
    InventoryFilterRegUserComponent,
    SalesReportCommonRegUserComponent,
    SalesReportCommonBtqUserComponent,
    SalesReportCommonCorpUserComponent,
    InventoryStockIssueDetailsBtqUserComponent,
    InventoryStockIssueDetailsCorpUserComponent,
    InventoryStockIssueDetailsRegUserComponent
    // DiscountsReportFilterComponent
  ],
  exports: [
    ReportListItemComponent,
    ReportListComponent,
    ReportAutoComponent,
    ReportRoleMappingItemsComponent,
    DiscountLocReportFilterCorpUserComponent,
    DiscountLocReportFilterBtqUserComponent,
    DiscountLocReportFilterRegUserComponent,
    SalesReportFilterCorpUserComponent,
    SalesReportFilterBtqUserComponent,
    SalesReportFilterRegUserComponent,
    DiscountTxnReportFilterBtqUserComponent,
    DiscountTxnReportFilterCorpUserComponent,
    DiscountTxnReportFilterRegUserComponent,
    DiscountCommonFilterBtqUserComponent,
    DiscountCommonFilterCorpUserComponent,
    DiscountCommonFilterRegUserComponent,
    PaymentFilterBtqUserComponent,
    PaymentFilterCorpUserComponent,
    PaymentFilterRegUserComponent,
    PaymentDetailFilterRegUserComponent,
    PaymentDetailFilterCorpUserComponent,
    PaymentDetailFilterBtqUserComponent,
    CnRegisterFilterBtqUserComponent,
    CnRegisterFilterCorpUserComponent,
    CnRegisterFilterRegUserComponent,
    CnFilterRegUserComponent,
    CnFilterCorpUserComponent,
    CnFilterBtqUserComponent,
    InventoryOtherIssueBtqUserComponent,
    InventoryOtherIssueCorpUserComponent,
    InventoryOtherIssueRegUserComponent,
    InventoryOtherReceiptBtqUserComponent,
    InventoryOtherReceiptCorpUserComponent,
    InventoryOtherReceiptRegUserComponent,
    InventoryStockDetailsRegUserComponent,
    InventoryStockDetailsCorpUserComponent,
    InventoryStockDetailsBtqUserComponent,
    InventoryStockSummaryBtqUserComponent,
    InventoryStockSummaryCorpUserComponent,
    InventoryStockSummaryRegUserComponent,
    InventoryFilterBtqUserComponent,
    InventoryFilterCorpUserComponent,
    InventoryFilterRegUserComponent,
    SalesReportCommonRegUserComponent,
    SalesReportCommonBtqUserComponent,
    SalesReportCommonCorpUserComponent,
    InventoryStockIssueDetailsBtqUserComponent,
    InventoryStockIssueDetailsCorpUserComponent,
    InventoryStockIssueDetailsRegUserComponent
  ]
})
export class SharedReportsUiReportsModule {}
