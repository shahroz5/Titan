import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
// import { PossGiftCardsFeatureGiftCardsSaleModule } from '@poss-web/poss/gift-cards/feature-gift-cards-sale';
// import { PossGiftCardsFeatureGiftCardsBalanceInquiryModule } from '@poss-web/poss/gift-cards/feature-gift-cards-balance-inquiry';
// import { PossGiftCardsFeatureGiftCardsCancellationModule } from '@poss-web/poss/gift-cards/feature-gift-cards-cancellation';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { SharedPaymentFeaturePaymentModule } from '@poss-web/shared/payment/feature-payment';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { GiftCardsShellComponent } from './gift-cards-shell/gift-cards-shell.component';
import { PossSharedFeatureCommonModule } from '@poss-web/poss/shared/feature-common';
import { PossGiftCardsDataAccessGiftCardsModule } from '@poss-web/poss/gift-cards/data-access-gift-cards';
import { PossSharedProductFeatureProductModule } from '@poss-web/poss/shared/product/feature-product';
import { SharedOrderDetailFeatureOrderDetailModule } from '@poss-web/shared/order-detail/feature-order-detail';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const routes: Routes = [
  {
    path: '',
    component: GiftCardsShellComponent,
    children: [
      {
        path: 'sale/:_id',
        loadChildren: () =>
          import('@poss-web/poss/gift-cards/feature-gift-cards-sale').then(
            m => {
              return m.PossGiftCardsFeatureGiftCardsSaleModule;
            }
          )
      },
      {
        path: 'balance-inquiry',
        loadChildren: () =>
          import(
            '@poss-web/poss/gift-cards/feature-gift-cards-balance-inquiry'
          ).then(m => {
            return m.PossGiftCardsFeatureGiftCardsBalanceInquiryModule;
          })
      },
      {
        path: 'cancellation',
        loadChildren: () =>
          import(
            '@poss-web/poss/gift-cards/feature-gift-cards-cancellation'
          ).then(m => {
            return m.PossGiftCardsFeatureGiftCardsCancellationModule;
          })
      },
      {
        path: 'history',
        loadChildren: () =>
          import('@poss-web/poss/gift-cards/feature-gift-cards-history').then(
            m => {
              return m.PossGiftCardsFeatureGiftCardsHistoryModule;
            }
          )
      }
    ]
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedCustomerFeatureCustomerSearchModule,
    CommonCustomMaterialModule,
    // PossGiftCardsFeatureGiftCardsSaleModule,
    // PossGiftCardsFeatureGiftCardsBalanceInquiryModule,
    // PossGiftCardsFeatureGiftCardsCancellationModule,
    SharedPaymentFeaturePaymentModule,
    PossSharedFeatureCommonModule,
    SharedToolbarFeatureToolbarModule,
    PossGiftCardsDataAccessGiftCardsModule,
    // PossGiftCardsFeatureGcMenuModule,
    PossSharedProductFeatureProductModule,
    SharedOrderDetailFeatureOrderDetailModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [GiftCardsShellComponent]
})
export class PossGiftCardsFeatureGcShellModule {}
