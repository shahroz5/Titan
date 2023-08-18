import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CoePopupComponent } from './coe-popup/coe-popup.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule
  ],
  declarations: [CoePopupComponent],
  exports: [CoePopupComponent],
  entryComponents: [CoePopupComponent]
})
export class PossCashMemoUiCoePopupModule {}
