import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetalTypeItemComponent } from './metal-type-item/metal-type-item.component';
import { MetalTypeItemsComponent } from './metal-type-items/metal-type-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [MetalTypeItemComponent, MetalTypeItemsComponent],
  exports: [MetalTypeItemComponent, MetalTypeItemsComponent]
})
export class SharedMetalTypeUiMetalTypeListModule {}
