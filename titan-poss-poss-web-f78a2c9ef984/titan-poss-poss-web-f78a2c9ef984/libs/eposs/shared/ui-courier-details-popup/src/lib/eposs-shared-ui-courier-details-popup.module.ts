import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { CourierDetailsPopupComponent } from './courier-details-popup.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
@NgModule({
  declarations: [CourierDetailsPopupComponent],
  imports: [
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  exports: [CourierDetailsPopupComponent]
})
export class EpossSharedUiCourierDetailsPopupModule {}
