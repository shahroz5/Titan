import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { FilterDialogComponent } from './filter-dialog.component';
import { FilterService } from './filter.service';

@NgModule({
  declarations: [FilterDialogComponent],
  imports: [CommonModule, CommonCustomMaterialModule],
  providers: [FilterService],
  entryComponents: [FilterDialogComponent]
})
export class SharedComponentsUiFilterDialogModule {}
