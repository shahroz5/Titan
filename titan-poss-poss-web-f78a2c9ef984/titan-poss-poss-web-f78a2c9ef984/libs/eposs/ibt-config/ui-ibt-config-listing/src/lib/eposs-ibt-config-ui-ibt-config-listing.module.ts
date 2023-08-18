import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IbtConfigurationItemsComponent } from './ibt-configuration-items/ibt-configuration-items.component';
import { IbtConfigurationItemComponent } from './ibt-configuration-item/ibt-configuration-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [IbtConfigurationItemsComponent, IbtConfigurationItemComponent],
  exports: [IbtConfigurationItemsComponent, IbtConfigurationItemComponent]
})
export class EpossIbtConfigUiIbtConfigListingModule {}
