import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import {
  SharedMarketMaterialPriceDataAccessMarketMaterialPriceModule,
} from '@poss-web/shared/market-material-price/data-access-market-material-price';

import { SharedMarketMaterialPriceUiMarketMaterialPriceListModule } from '@poss-web/shared/market-material-price/ui-market-material-price-list';
import { MaterialPriceListingComponent } from './material-price-listing/material-price-listing.component';

const routes: Routes = [
  {
    path: '',
    component: MaterialPriceListingComponent
  }
];
@NgModule({
  declarations: [MaterialPriceListingComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiLoaderModule,
    SharedMarketMaterialPriceDataAccessMarketMaterialPriceModule,
    SharedMarketMaterialPriceUiMarketMaterialPriceListModule,
    SharedMarketMaterialPriceDataAccessMarketMaterialPriceModule
  ],
  providers: []
})
export class SharedMarketMaterialPriceFeatureMarketMaterialPriceListingModule {}
