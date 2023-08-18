import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnMasterItemsComponent } from './cn-master-items/cn-master-items.component';
import { CnMasterItemComponent } from './cn-master-item/cn-master-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { CnMasterSearchComponent } from './cn-master-search/cn-master-search.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    CnMasterItemsComponent,
    CnMasterItemComponent,
    CnMasterSearchComponent
  ],
  exports: [
    CnMasterItemsComponent,
    CnMasterItemComponent,
    CnMasterSearchComponent
  ]
})
export class EpossCnMasterUiCnMasterListingModule {}
