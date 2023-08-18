import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UiDiscountRivaahAshirwaadProductGroupMappingComponent } from './ui-discount-rivaah-ashirwaad-product-group-mapping/ui-discount-rivaah-ashirwaad-product-group-mapping.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { UiProductGroupUcpMcComponent } from './ui-product-group-ucp-mc/ui-product-group-ucp-mc.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [UiDiscountRivaahAshirwaadProductGroupMappingComponent,
    UiProductGroupUcpMcComponent],
  exports: [UiDiscountRivaahAshirwaadProductGroupMappingComponent,
    UiProductGroupUcpMcComponent]
})
export class EpossDiscountConfigUiDiscountRivaahAshirwaadPgMapModule {}
