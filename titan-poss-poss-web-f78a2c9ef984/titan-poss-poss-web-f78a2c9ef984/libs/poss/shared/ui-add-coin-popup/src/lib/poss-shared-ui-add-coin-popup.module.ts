import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddCoinPopupComponent } from './add-coin-popup/add-coin-popup.component';
import { AddCoinPopupItemComponent } from './add-coin-popup-item/add-coin-popup-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedToolbarUiToolbarModule } from '@poss-web/shared/toolbar/ui-toolbar';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedToolbarUiToolbarModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [AddCoinPopupComponent, AddCoinPopupItemComponent]
})
export class PossSharedUiAddCoinPopupModule {}
