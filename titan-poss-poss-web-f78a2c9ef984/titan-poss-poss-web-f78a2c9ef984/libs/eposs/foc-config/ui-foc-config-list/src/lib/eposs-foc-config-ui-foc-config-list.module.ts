import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FocConfigListItemsComponent } from './foc-config-list-items/foc-config-list-items.component';
import { FocConfigListItemComponent } from './foc-config-list-item/foc-config-list-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [FocConfigListItemsComponent, FocConfigListItemComponent],
  exports: [FocConfigListItemsComponent, FocConfigListItemComponent]
})
export class EpossFocConfigUiFocConfigListModule {}
