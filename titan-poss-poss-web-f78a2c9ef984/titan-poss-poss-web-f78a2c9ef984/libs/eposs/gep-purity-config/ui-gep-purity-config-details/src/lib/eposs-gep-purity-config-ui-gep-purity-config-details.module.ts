import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { EpossGepPurityConfigUiGepPurityConfigPopupModule } from '@poss-web/eposs/gep-purity-config/ui-gep-purity-config-popup';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { ExcludeThemeItemCodesComponent } from './exclude-theme-item-codes/exclude-theme-item-codes.component';
import { GepDetailsComponent } from './gep-details/gep-details.component';
import { ProductGroupMappingComponent } from './product-group-mapping/product-group-mapping.component';
import { PurityDetailsComponent } from './purity-details/purity-details.component';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    EpossGepPurityConfigUiGepPurityConfigPopupModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [
    GepDetailsComponent,
    PurityDetailsComponent,
    ProductGroupMappingComponent,
    ExcludeThemeItemCodesComponent
  ],
  exports: [
    GepDetailsComponent,
    PurityDetailsComponent,
    ProductGroupMappingComponent,
    ExcludeThemeItemCodesComponent
  ]
})
export class EpossGepPurityConfigUiGepPurityConfigDetailsModule {}
