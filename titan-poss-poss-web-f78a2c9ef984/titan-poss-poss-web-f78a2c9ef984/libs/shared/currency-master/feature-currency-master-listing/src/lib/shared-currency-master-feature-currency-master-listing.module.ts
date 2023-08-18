import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyListingComponent } from './currency-listing/currency-listing.component';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedCurrencyMasterUiCurrencyMasterListModule } from '@poss-web/shared/currency-master/ui-currency-master-list';
import { SharedCurrencyMasterDataAccessCurrencyMasterModule } from '@poss-web/shared/currency-master/data-access-currency-master';
import {
  CurrencyDetailsComponent,
  SharedCurrencyMasterUiCurrencyMasterDetailModule
} from '@poss-web/shared/currency-master/ui-currency-master-detail';
import { SharedCurrencyMasterUiCurrencyViewModule } from '@poss-web/shared/currency-master/ui-currency-view';

const route = [
  { path: '', component: CurrencyListingComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedCurrencyMasterUiCurrencyMasterListModule,
    SharedCurrencyMasterDataAccessCurrencyMasterModule,
    SharedCurrencyMasterUiCurrencyMasterDetailModule,
    SharedCurrencyMasterUiCurrencyViewModule
  ],
  declarations: [CurrencyListingComponent],
  entryComponents: [CurrencyDetailsComponent]
})
export class SharedCurrencyMasterFeatureCurrencyMasterListingModule {}
