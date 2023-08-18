import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { MarketCodeListingComponent } from './market-code-listing/market-code-listing.component';
import { Routes, RouterModule } from '@angular/router';
import { SharedMarketCodeUiMarketCodeListModule } from '@poss-web/shared/market-code/ui-market-code-list';
import { SharedMarketCodeDataAccessMarketCodeModule } from '@poss-web/shared/market-code/data-access-market-code';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import {
  MarketCodeDetailsComponent,
  SharedMarketCodeUiMarketCodeDetailModule
} from '@poss-web/shared/market-code/ui-market-code-detail';
import { SharedMarketCodeUiMarketCodeViewModule } from '@poss-web/shared/market-code/ui-market-code-view';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
const routes: Routes = [
  {
    path: '',
    component: MarketCodeListingComponent
  }
];
@NgModule({
  declarations: [MarketCodeListingComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(routes),
    SharedMarketCodeDataAccessMarketCodeModule,
    SharedMarketCodeUiMarketCodeListModule,
    SharedMarketCodeUiMarketCodeDetailModule,
    SharedComponentsUiDynamicFormModule,
    SharedMarketCodeUiMarketCodeViewModule,
    SharedPermissionUiPermissionModule
  ],
  entryComponents: [MarketCodeDetailsComponent],
  providers: [MarketCodeDetailsComponent]
})
export class SharedMarketCodeFeatureMarketCodeListingModule {}
