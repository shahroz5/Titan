import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { DiscountConfigListComponent } from './discount-config-list/discount-config-list.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { DiscountConfigListItemComponent } from './discount-config-list-item/discount-config-list-item.component';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [DiscountConfigListComponent, DiscountConfigListItemComponent],
  exports: [DiscountConfigListComponent, DiscountConfigListItemComponent]
})
export class EpossDiscountConfigUiDiscountConfigListModule {}
