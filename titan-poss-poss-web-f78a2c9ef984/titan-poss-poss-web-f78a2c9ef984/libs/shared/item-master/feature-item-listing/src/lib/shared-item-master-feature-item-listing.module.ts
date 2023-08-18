import { SharedLocationSettingsDataAccessLocationSettingsModule } from '@poss-web/shared/location-settings/data-access-location-settings';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemListingComponent } from './item-listing/item-listing.component';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedItemMasterDataAccessItemMasterModule } from '@poss-web/shared/item-master/data-access-item-master';
import { SharedItemMasterUiItemListModule } from '@poss-web/shared/item-master/ui-item-list';
import { SharedItemMasterUiItemHeaderFormModule } from '@poss-web/shared/item-master/ui-item-header-form';
const route = [
  { path: '', component: ItemListingComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedItemMasterDataAccessItemMasterModule,
    SharedItemMasterUiItemListModule,
    SharedLocationSettingsDataAccessLocationSettingsModule,
    SharedItemMasterUiItemHeaderFormModule
  ],

  declarations: [ItemListingComponent]
})
export class SharedItemMasterFeatureItemListingModule {}
