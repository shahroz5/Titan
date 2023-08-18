import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { Routes, RouterModule } from '@angular/router';
import { MaterialPriceDetailsComponent } from './material-price-details/material-price-details.component';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import {
  SharedMarketMaterialPriceDataAccessMarketMaterialPriceModule,
  MarketMaterialPriceFacade
} from '@poss-web/shared/market-material-price/data-access-market-material-price';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import {
  SharedMarketCodeDataAccessMarketCodeModule,
  MarketCodeFacade
} from '@poss-web/shared/market-code/data-access-market-code';

import { SharedMarketMaterialPriceUiMarketMaterialPriceListModule } from '@poss-web/shared/market-material-price/ui-market-material-price-list';
import { SharedMarketMaterialPriceUiMarketMaterialPriceDetailModule } from '@poss-web/shared/market-material-price/ui-market-material-price-detail';
const routes: Routes = [
  {
    path: '',
    component: MaterialPriceDetailsComponent
  }
];
@NgModule({
  declarations: [MaterialPriceDetailsComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedComponentsUiLoaderModule,
    SharedMarketMaterialPriceDataAccessMarketMaterialPriceModule,
    SharedMarketCodeDataAccessMarketCodeModule,
    SharedMarketMaterialPriceUiMarketMaterialPriceListModule,
    SharedMarketMaterialPriceUiMarketMaterialPriceDetailModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  providers: [MarketMaterialPriceFacade, MarketCodeFacade]
})
export class SharedMarketMaterialPriceFeatureMarketMaterialPriceDetailModule {}
