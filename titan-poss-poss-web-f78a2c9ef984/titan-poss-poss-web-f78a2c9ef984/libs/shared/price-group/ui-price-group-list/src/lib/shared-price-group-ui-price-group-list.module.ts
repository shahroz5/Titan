import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PriceGroupListItemsComponent } from './price-group-list-items/price-group-list-items.component';
import { PriceGroupListItemComponent } from './price-group-list-item/price-group-list-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [PriceGroupListItemsComponent, PriceGroupListItemComponent],
  exports: [PriceGroupListItemsComponent, PriceGroupListItemComponent]
})
export class SharedPriceGroupUiPriceGroupListModule {}
