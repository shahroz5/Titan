import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LotBinAgeConfigComponent } from './lot-bin-age-config/lot-bin-age-config.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [LotBinAgeConfigComponent],
  exports: [LotBinAgeConfigComponent]
})
export class EpossDiscountConfigUiDiscountLotBinAgeConfigModule {}
