import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxMasterListingComponent } from './tax-master-listing.component';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { RouterModule, Routes } from '@angular/router';

import { SharedTaxMasterDataAccessTaxMasterModule } from '@poss-web/shared/tax-master/data-access-tax-master';
import { SharedTaxMasterUiTaxMasterListModule } from '@poss-web/shared/tax-master/ui-tax-master-list';
import { SharedTaxMasterUiTaxMasterDetailModule } from '@poss-web/shared/tax-master/ui-tax-master-detail';
import { SharedTaxMasterUiTaxMasterViewModule } from '@poss-web/shared/tax-master/ui-tax-master-view';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';

const routes: Routes = [
  {
    path: '',
    component: TaxMasterListingComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedTaxMasterDataAccessTaxMasterModule,
    SharedTaxMasterUiTaxMasterListModule,
    SharedTaxMasterUiTaxMasterDetailModule,
    SharedTaxMasterUiTaxMasterViewModule,
    SharedComponentsUiDynamicFormModule
  ],
  declarations: [TaxMasterListingComponent]
})
export class SharedTaxMasterFeatureTaxMasterListingModule {}
