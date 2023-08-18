import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FOCBCLItemComponent } from './foc-bcl-item/foc-bcl-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { FOCBCLPopupComponent } from './foc-bcl-popup/foc-bcl-popup.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [FOCBCLItemComponent, FOCBCLPopupComponent],
  exports: [FOCBCLItemComponent, FOCBCLPopupComponent]
})
export class EpossFocBlockingCustomerLevelUiFocBclListModule {}
