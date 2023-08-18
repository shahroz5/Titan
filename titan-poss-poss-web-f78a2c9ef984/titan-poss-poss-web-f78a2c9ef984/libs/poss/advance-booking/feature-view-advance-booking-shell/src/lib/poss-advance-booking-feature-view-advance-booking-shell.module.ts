import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossAdvanceBookingFeatureAbRequestingModule } from '@poss-web/poss/advance-booking/feature-ab-requesting';
import { PossAdvanceBookingFeatureViewAdvanceBookingModule } from '@poss-web/poss/advance-booking/feature-view-advance-booking';
import { PossSharedProductFeatureProductModule } from '@poss-web/poss/shared/product/feature-product';
import { SharedCustomerFeatureCustomerSearchModule } from '@poss-web/shared/customer/feature-customer-search';
import { SharedPaymentFeatureCreditNoteModule } from '@poss-web/shared/payment/feature-credit-note';
import { SharedPaymentFeaturePaymentModule } from '@poss-web/shared/payment/feature-payment';
import { SharedToolbarFeatureToolbarModule } from '@poss-web/shared/toolbar/feature-toolbar';
import { ViewAdvanceBookingComponent } from './view-advance-booking/view-advance-booking.component';
import { SharedFileUploadFeatureFileMultiUploadModule } from '@poss-web/shared/file-upload/feature-file-multi-upload';
const route: Route[] = [{ path: '', component: ViewAdvanceBookingComponent }];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedCustomerFeatureCustomerSearchModule,
    SharedPaymentFeaturePaymentModule,
    SharedPaymentFeatureCreditNoteModule,
    SharedToolbarFeatureToolbarModule,
    PossSharedProductFeatureProductModule,
    PossAdvanceBookingFeatureViewAdvanceBookingModule,
    PossAdvanceBookingFeatureAbRequestingModule,
    SharedFileUploadFeatureFileMultiUploadModule
  ],
  declarations: [ViewAdvanceBookingComponent]
})
export class PossAdvanceBookingFeatureViewAdvanceBookingShellModule {}
