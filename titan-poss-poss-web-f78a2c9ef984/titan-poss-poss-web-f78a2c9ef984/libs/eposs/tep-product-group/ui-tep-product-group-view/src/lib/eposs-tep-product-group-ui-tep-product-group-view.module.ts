import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

import { TepProductGroupViewComponent } from './tep-product-group-view.component';
import { TepProductGroupNameViewComponent } from './tep-product-group-name-view/tep-product-group-name-view.component';
import { TepProductGroupDetailsViewComponent } from './tep-product-group-details-view/tep-product-group-details-view.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiSortDialogModule } from '@poss-web/shared/components/ui-sort-dialog';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiDynamicFormModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiSortDialogModule
  ],
  declarations: [
    TepProductGroupViewComponent,
    TepProductGroupNameViewComponent,
    TepProductGroupDetailsViewComponent
  ],
  exports: [TepProductGroupViewComponent]
})
export class EpossTepProductGroupUiTepProductGroupViewModule {}
