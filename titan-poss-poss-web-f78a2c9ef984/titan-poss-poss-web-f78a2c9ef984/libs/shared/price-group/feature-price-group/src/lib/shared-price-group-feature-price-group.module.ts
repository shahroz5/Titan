import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceGroupListingComponent } from './price-group-listing/price-group-listing.component';
import { SharedPriceGroupDataAccessPriceGroupModule } from '@poss-web/shared/price-group/data-access-price-group';
import { SharedPriceGroupUiPriceGroupDetailModule } from '@poss-web/shared/price-group/ui-price-group-detail';
import { SharedPriceGroupUiPriceGroupListModule } from '@poss-web/shared/price-group/ui-price-group-list';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RouterModule, Route } from '@angular/router';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
const routes: Route[] = [{ path: '', component: PriceGroupListingComponent }];
@NgModule({
  imports: [
    CommonModule,
    SharedPriceGroupDataAccessPriceGroupModule,
    SharedPriceGroupUiPriceGroupDetailModule,
    SharedPriceGroupUiPriceGroupListModule,
    SharedComponentsUiLoaderModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedComponentsUiDynamicFormModule
  ],
  declarations: [PriceGroupListingComponent]
})
export class SharedPriceGroupFeaturePriceGroupModule {}
