import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbToleranceConfigItemsListComponent } from './ab-tolerance-config-items-list/ab-tolerance-config-items-list.component';
import { AbToleranceConfigItemComponent } from './ab-tolerance-config-item/ab-tolerance-config-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [
    AbToleranceConfigItemsListComponent,
    AbToleranceConfigItemComponent
  ],
  exports: [AbToleranceConfigItemsListComponent, AbToleranceConfigItemComponent]
})
export class EpossAbToleranceConfigUiAbToleranceConfigListingModule {}
