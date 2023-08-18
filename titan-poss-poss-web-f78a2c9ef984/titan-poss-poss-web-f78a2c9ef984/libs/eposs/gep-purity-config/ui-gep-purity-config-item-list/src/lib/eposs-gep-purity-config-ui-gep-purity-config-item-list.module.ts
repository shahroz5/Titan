import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { GepPurityConfigItemComponent } from './gep-purity-config-item/gep-purity-config-item.component';
import { GepPurityConfigItemsComponent } from './gep-purity-config-items/gep-purity-config-items.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [GepPurityConfigItemsComponent, GepPurityConfigItemComponent],
  exports: [GepPurityConfigItemsComponent, GepPurityConfigItemComponent]
})
export class EpossGepPurityConfigUiGepPurityConfigItemListModule {}
