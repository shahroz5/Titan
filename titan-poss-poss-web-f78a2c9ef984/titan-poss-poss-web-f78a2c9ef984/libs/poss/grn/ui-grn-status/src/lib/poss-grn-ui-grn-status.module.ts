import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GrnStatusItemsComponent } from './grn-status-items/grn-status-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiCardListModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [GrnStatusItemsComponent],
  exports: [GrnStatusItemsComponent]
})
export class PossGrnUiGrnStatusModule {}
