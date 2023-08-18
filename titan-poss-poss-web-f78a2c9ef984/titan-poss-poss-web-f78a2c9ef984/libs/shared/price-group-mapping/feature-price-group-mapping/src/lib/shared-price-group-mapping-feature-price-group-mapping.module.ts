import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

import { SharedPriceGroupMappingDataAccessPriceGroupMappingModule } from '@poss-web/shared/price-group-mapping/data-access-price-group-mapping';
import { SharedPriceGroupMappingUiPriceGroupMappingModule } from '@poss-web/shared/price-group-mapping/ui-price-group-mapping';

import { PriceGroupMappingComponent } from './price-group-mapping.component';
import { SelectionDialogService } from '@poss-web/shared/components/ui-selection-dialog';

const routes: Routes = [
  {
    path: '',
    component: PriceGroupMappingComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedPriceGroupMappingDataAccessPriceGroupMappingModule,
    SharedPriceGroupMappingUiPriceGroupMappingModule
  ],
  declarations: [PriceGroupMappingComponent],
  providers: [SelectionDialogService]
})
export class SharedPriceGroupMappingFeaturePriceGroupMappingModule {}
