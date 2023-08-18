import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { MarketCodeListingItemComponent } from './market-code-listing-item/market-code-listing-item.component';
import { MarketCodeListingItemsComponent } from './market-code-listing-items/market-code-listing-items.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
@NgModule({
  declarations: [
    MarketCodeListingItemComponent,
    MarketCodeListingItemsComponent
  ],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedPermissionUiPermissionModule
  ],
  exports: [MarketCodeListingItemComponent, MarketCodeListingItemsComponent]
})
export class SharedMarketCodeUiMarketCodeListModule {}
