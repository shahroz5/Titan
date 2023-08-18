import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { TableViewDialogService } from '@poss-web/shared/components/ui-table-view-dialog';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { ConfigurationComponent } from './configuration/configuration.component';
import { GepDetailsViewComponent } from './gep-details-view/gep-details-view.component';
import { ProductGroupMappingViewComponent } from './product-group-mapping-view/product-group-mapping-view.component';
import { PurityDetailsViewComponent } from './purity-details-view/purity-details-view.component';
import { ThemeItemcodeViewComponent } from './theme-itemcode-view/theme-itemcode-view.component';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    PurityDetailsViewComponent,
    GepDetailsViewComponent,
    ThemeItemcodeViewComponent,
    ProductGroupMappingViewComponent,
    ConfigurationComponent
  ],
  exports: [
    PurityDetailsViewComponent,
    GepDetailsViewComponent,
    ThemeItemcodeViewComponent,
    ProductGroupMappingViewComponent,
    ConfigurationComponent
  ],
  providers: [TableViewDialogService]
})
export class EpossGepPurityConfigUiGepPurityConfigViewModule {}
