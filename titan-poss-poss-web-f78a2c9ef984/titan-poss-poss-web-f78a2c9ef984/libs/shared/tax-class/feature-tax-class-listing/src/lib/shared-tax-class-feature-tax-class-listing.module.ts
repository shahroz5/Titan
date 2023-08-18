import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaxClassListingComponent } from './tax-class-listing.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedTaxClassDataAccessTaxClassModule } from '@poss-web/shared/tax-class/data-access-tax-class';
import { SharedTaxClassUiTaxClassListModule } from '@poss-web/shared/tax-class/ui-tax-class-list';
import { SharedTaxClassUiTaxClassDetailModule } from '@poss-web/shared/tax-class/ui-tax-class-detail';

const routes: Routes = [
  {
    path: '',
    component: TaxClassListingComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedTaxClassDataAccessTaxClassModule,
    SharedTaxClassUiTaxClassListModule,
    SharedTaxClassUiTaxClassDetailModule
  ],
  declarations: [TaxClassListingComponent]
})
export class SharedTaxClassFeatureTaxClassListingModule { }
