import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressPanelComponent } from './address-panel.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [AddressPanelComponent],
  exports: [AddressPanelComponent]
})
export class SharedComponentsUiAddressPanelModule {}
