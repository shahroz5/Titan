import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFocusableListModule } from '@poss-web/shared/components/ui-focusable-list';

import { TableViewDialogComponent } from './table-view-dialog.component';
import { TableViewDialogService } from './table-view-dialog.service';

@NgModule({
  imports: [CommonCustomMaterialModule, SharedComponentsUiFocusableListModule],
  providers: [TableViewDialogService],
  declarations: [TableViewDialogComponent]
})
export class SharedComponentsUiTableViewDialogModule {}
