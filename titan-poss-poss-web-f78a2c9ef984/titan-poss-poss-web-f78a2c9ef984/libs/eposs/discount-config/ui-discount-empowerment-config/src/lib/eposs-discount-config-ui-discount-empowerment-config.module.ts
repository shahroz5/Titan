import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountEmpowermentConfigComponent } from './discount-empowerment-config/discount-empowerment-config.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { DiscountEmpowermentPopupComponent } from './discount-empowerment-popup/discount-empowerment-popup.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [
    DiscountEmpowermentConfigComponent,
    DiscountEmpowermentPopupComponent
  ],
  exports: [
    DiscountEmpowermentConfigComponent,
    DiscountEmpowermentPopupComponent
  ],
  entryComponents: [DiscountEmpowermentPopupComponent]
})
export class EpossDiscountConfigUiDiscountEmpowermentConfigModule {}
