import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaginatedSelectionDialogComponent } from './paginated-selection-dialog.component';
import { PaginatedSelectionDialogService } from './paginated-selection-dialog.service';

@NgModule({
  declarations: [PaginatedSelectionDialogComponent],
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFocusableListModule
  ],
  providers: [PaginatedSelectionDialogService],
  entryComponents: [PaginatedSelectionDialogComponent]
})
export class SharedComponentsUiPaginatedSelectionDialognModule {}
