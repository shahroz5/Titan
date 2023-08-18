import { AgGridModule } from 'ag-grid-angular';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorItemListComponent } from './error-item-list.component';
import { ErrorItemListService } from './error-item-list-popup.service';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    AgGridModule.withComponents([])
  ],
  declarations: [ErrorItemListComponent],
  providers: [ErrorItemListService],
  entryComponents: [ErrorItemListComponent]
})
export class SharedItemUiErrorItemListPopupModule {}
