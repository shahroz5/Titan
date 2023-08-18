import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { AddCnPopupComponent } from './add-cn-popup/add-cn-popup.component';
import { ViewCnPopupComponent } from './view-cn-popup/view-cn-popup.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [AddCnPopupComponent, ViewCnPopupComponent]
})
export class PossSharedUiAddCnPopupModule {}
