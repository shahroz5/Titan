import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpDiscountLocationComponent } from './emp-discount-location/emp-discount-location.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ConfigDetailsComponent } from './config-details/config-details.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [EmpDiscountLocationComponent, ConfigDetailsComponent],
  exports: [EmpDiscountLocationComponent]
})
export class EpossDiscountConfigUiEmpDiscountLocationModule {}
