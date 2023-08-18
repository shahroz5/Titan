import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CpgQcgcMapItemsComponent } from './cpg-qcgc-map-items/cpg-qcgc-map-items.component';
import { CpgQcgcMapListingItemComponent } from './cpg-qcgc-map-listing-item/cpg-qcgc-map-listing-item.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { CpgQcgcMapSearchComponent } from './cpg-qcgc-map-search/cpg-qcgc-map-search.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    CpgQcgcMapItemsComponent,
    CpgQcgcMapListingItemComponent,
    CpgQcgcMapSearchComponent
  ],
  exports: [
    CpgQcgcMapItemsComponent,
    CpgQcgcMapListingItemComponent,
    CpgQcgcMapSearchComponent
  ]
})
export class SharedCpgQcgcMapUiCpgQcgcMapListModule {}
