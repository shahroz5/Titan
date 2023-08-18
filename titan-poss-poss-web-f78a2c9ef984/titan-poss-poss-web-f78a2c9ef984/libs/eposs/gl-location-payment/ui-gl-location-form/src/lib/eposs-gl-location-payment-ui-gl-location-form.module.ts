import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlLocationPaymentFormComponent } from './gl-location-payment-form/gl-location-payment-form.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [GlLocationPaymentFormComponent],
  exports: [GlLocationPaymentFormComponent]
})
export class EpossGlLocationPaymentUiGlLocationFormModule {}
