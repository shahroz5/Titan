import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SelectionDialogGridComponent } from './selection-dialog-grid.component';
import { SelectionDialogGridService } from './selection-dialog-grid.service';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';

@NgModule({
  declarations: [SelectionDialogGridComponent],
  imports: [
    CommonCustomMaterialModule,
    SharedComponentsUiFocusableListModule,
    SharedComponentsUiAgGridModule
  ],
  providers: [SelectionDialogGridService],
  entryComponents: [SelectionDialogGridComponent]
})
export class SharedComponentsUiSelectionDialogGridModule {}
