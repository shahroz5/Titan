import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewTepDetailsComponent } from './view-tep-details/view-tep-details.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { TepSearchListComponent } from './tep-search-list/tep-search-list.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [ViewTepDetailsComponent, TepSearchListComponent],
  exports: [ViewTepDetailsComponent, TepSearchListComponent]
})
export class PossTepUiTepDetailsModule {}
