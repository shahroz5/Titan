import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubbrandListItemsComponent } from './subbrand-list-items/subbrand-list-items.component';
import { SubbrandListItemComponent } from './subbrand-list-item/subbrand-list-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [SubbrandListItemsComponent, SubbrandListItemComponent],
  exports: [SubbrandListItemsComponent, SubbrandListItemComponent]
})
export class SharedSubBrandUiSubBrandListModule {}
