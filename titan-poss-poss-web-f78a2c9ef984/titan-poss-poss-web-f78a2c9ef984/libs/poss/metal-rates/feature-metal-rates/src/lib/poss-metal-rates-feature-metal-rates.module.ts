import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { MetalRatesComponent } from './metal-rates/metal-rates.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { PossMetalRatesDataAccessMetalRatesModule } from '@poss-web/poss/metal-rates/data-access-metal-rates';
import { PossMetalRatesUiUpdateMetalRatesModule } from '@poss-web/poss/metal-rates/ui-update-metal-rates';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

const routes: Routes = [
  {
    path: '',
    component: MetalRatesComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    CommonCustomMaterialModule,
    PossMetalRatesDataAccessMetalRatesModule,
    PossMetalRatesUiUpdateMetalRatesModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [MetalRatesComponent]
})
export class PossMetalRatesFeatureMetalRatesModule {}
