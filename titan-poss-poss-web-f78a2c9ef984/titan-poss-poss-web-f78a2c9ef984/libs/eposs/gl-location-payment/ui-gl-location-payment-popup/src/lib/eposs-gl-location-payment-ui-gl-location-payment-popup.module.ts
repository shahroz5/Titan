import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlLocationPaymentPopupComponent } from './gl-location-payment-popup/gl-location-payment-popup.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [GlLocationPaymentPopupComponent],
  entryComponents: [GlLocationPaymentPopupComponent],
  exports: [GlLocationPaymentPopupComponent]
})
export class EpossGlLocationPaymentUiGlLocationPaymentPopupModule {}
