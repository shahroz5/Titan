import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortDialogComponent } from './sort-dialog.component';
import { SortDialogService } from './sort-dialog.service';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

@NgModule({
  declarations: [SortDialogComponent],
  imports: [CommonModule, CommonCustomMaterialModule],
  providers: [SortDialogService],
  entryComponents: [SortDialogComponent]
})
export class SharedComponentsUiSortDialogModule {}
