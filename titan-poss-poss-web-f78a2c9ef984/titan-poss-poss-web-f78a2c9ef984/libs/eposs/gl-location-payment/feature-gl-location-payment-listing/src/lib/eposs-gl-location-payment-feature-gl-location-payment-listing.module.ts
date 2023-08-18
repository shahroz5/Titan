import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { GlLocationPaymentListComponent } from './gl-location-payment-list/gl-location-payment-list.component';
import { EpossGlLocationPaymentDataAccessGlLocationPaymentModule } from '@poss-web/eposs/gl-location-payment/data-access-gl-location-payment';
import { EpossGlLocationPaymentUiGlLocationPaymentListingModule } from '@poss-web/eposs/gl-location-payment/ui-gl-location-payment-listing';
import { EpossGlLocationPaymentUiGlLocationFormModule } from '@poss-web/eposs/gl-location-payment/ui-gl-location-form';

const route: Routes = [{ path: '', component: GlLocationPaymentListComponent }];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    EpossGlLocationPaymentDataAccessGlLocationPaymentModule,
    EpossGlLocationPaymentUiGlLocationPaymentListingModule,
    EpossGlLocationPaymentUiGlLocationFormModule
  ],
  declarations: [GlLocationPaymentListComponent]
})
export class EpossGlLocationPaymentFeatureGlLocationPaymentListingModule {}
