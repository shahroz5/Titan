import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoToleranceConfigItemsListComponent } from './co-tolerance-config-items-list/co-tolerance-config-items-list.component';
import { CoToleranceConfigItemComponent } from './co-tolerance-config-item/co-tolerance-config-item.component';
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
    CoToleranceConfigItemsListComponent,
    CoToleranceConfigItemComponent
  ],
  exports: [CoToleranceConfigItemsListComponent, CoToleranceConfigItemComponent]
})
export class EpossCoToleranceConfigUiCoToleranceConfigListingModule {}
