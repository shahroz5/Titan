import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlBtqLocListingComponent } from './gl-btq-loc-listing/gl-btq-loc-listing.component';
import { Routes, RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossGlBoutiqueLocationUiGlBoutiqueLocationListingModule } from '@poss-web/eposs/gl-boutique-location/ui-gl-boutique-location-listing';
import { EpossGlBoutiqueLocationDataAccessGlBoutiqueLocationModule } from '@poss-web/eposs/gl-boutique-location/data-access-gl-boutique-location';

const route: Routes = [{ path: '', component: GlBtqLocListingComponent }];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(route),
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    EpossGlBoutiqueLocationDataAccessGlBoutiqueLocationModule,
    EpossGlBoutiqueLocationUiGlBoutiqueLocationListingModule
  ],
  declarations: [GlBtqLocListingComponent]
})
export class EpossGlBoutiqueLocationFeatureGlBoutiqueLocationListingModule {}
