import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConversionConfigProductGroupsComponent } from './conversion-config-product-groups/conversion-config-product-groups.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormattersModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [ConversionConfigProductGroupsComponent],
  exports: [ConversionConfigProductGroupsComponent]
})
export class EpossConversionConfigUiConversionConfigDetailsModule {}
