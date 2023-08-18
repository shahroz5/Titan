import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PurityListItemComponent } from './purity-list-item/purity-list-item.component';
import { PurityListItemsComponent } from './purity-list-items/purity-list-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],

  declarations: [PurityListItemComponent, PurityListItemsComponent],
  exports: [PurityListItemComponent, PurityListItemsComponent]
})
export class SharedPurityUiPurityListModule {}
