import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocBllItemComponent } from './foc-bll-item/foc-bll-item.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { FocBllPopupComponent } from './foc-bll-popup/foc-bll-popup.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiAgGridModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [FocBllItemComponent, FocBllPopupComponent],
  exports: [FocBllItemComponent]
})
export class EpossFocBlockingLocationLevelUiFocBllListModule {}
