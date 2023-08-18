import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlLocationPaymentListItemComponent } from './gl-location-payment-list-item/gl-location-payment-list-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { EpossGlLocationPaymentUiGlLocationPaymentPopupModule } from '@poss-web/eposs/gl-location-payment/ui-gl-location-payment-popup';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiAgGridModule,
    EpossGlLocationPaymentUiGlLocationPaymentPopupModule
  ],
  declarations: [GlLocationPaymentListItemComponent],
  exports: [GlLocationPaymentListItemComponent]
})
export class EpossGlLocationPaymentUiGlLocationPaymentListingModule {}
