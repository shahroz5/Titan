import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ErrorGridPopupComponent } from './error-grid-popup/error-grid-popup.component';
import { AgGridModule } from 'ag-grid-angular';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    //SharedComponentsUiAgGridModule,
    AgGridModule.withComponents([])
  ],
  declarations: [ErrorGridPopupComponent],
  exports: [ErrorGridPopupComponent]
})
export class SharedComponentsUiErrorGridPopupModule {}
