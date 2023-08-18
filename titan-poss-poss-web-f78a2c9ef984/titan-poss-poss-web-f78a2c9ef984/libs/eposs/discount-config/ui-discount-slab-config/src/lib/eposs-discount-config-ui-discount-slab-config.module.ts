import { EpossDiscountConfigUiDiscountValuePercentagePopupModule } from '@poss-web/eposs/discount-config/ui-discount-value-percentage-popup';

import { SharedComponentsUiFilterDialogModule } from '@poss-web/shared/components/ui-filter-dialog';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiscountSlabConfigMappingComponent } from './discount-slab-config/discount-slab-config.component';
import { EpossDiscountConfigUiDiscountConfigAbCoPopupModule } from '@poss-web/eposs/discount-config/ui-discount-config-ab-co-popup';
import { AddSlabPopupComponent } from './add-slab-popup/add-slab-popup.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFilterDialogModule,
    EpossDiscountConfigUiDiscountConfigAbCoPopupModule,
    EpossDiscountConfigUiDiscountValuePercentagePopupModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [DiscountSlabConfigMappingComponent, AddSlabPopupComponent],
  exports: [DiscountSlabConfigMappingComponent],
  entryComponents: [AddSlabPopupComponent]
})
export class EpossDiscountConfigUiDiscountSlabConfigModule {}
