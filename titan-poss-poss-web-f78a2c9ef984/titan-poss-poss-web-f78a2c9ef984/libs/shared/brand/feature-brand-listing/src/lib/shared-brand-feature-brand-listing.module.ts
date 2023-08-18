import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrandListingComponent } from './brand-listing/brand-listing.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedBrandUiBrandListModule } from '@poss-web/shared/brand/ui-brand-list';
import {
  BrandMasterFacade,
  SharedBrandDataAccessBrandModule
} from '@poss-web/shared/brand/data-access-brand';
import { Route, RouterModule } from '@angular/router';

const routes: Route[] = [{ path: '', component: BrandListingComponent }];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    RouterModule.forChild(routes),
    SharedBrandUiBrandListModule,
    SharedBrandDataAccessBrandModule
  ],
  declarations: [BrandListingComponent],
  providers: [BrandMasterFacade]
})
export class SharedBrandFeatureBrandListingModule {}
