import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { DiscountDetailsHeaderComponent } from './discount-details-header/discount-details-header.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFileUploadModule } from '@poss-web/shared/components/ui-file-upload';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFileUploadModule
  ],
  declarations: [DiscountDetailsHeaderComponent],
  exports: [DiscountDetailsHeaderComponent]
})
export class EpossDiscountConfigUiDiscountConfigHeaderModule {}
