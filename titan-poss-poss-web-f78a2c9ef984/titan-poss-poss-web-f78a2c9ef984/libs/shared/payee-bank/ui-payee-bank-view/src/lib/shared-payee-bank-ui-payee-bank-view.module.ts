import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BankDetailsViewComponent } from './view/bank-details-view/bank-details-view.component';
import { GlCodeDetailsViewComponent } from './view/gl-code-details-view/gl-code-details-view.component';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiAgGridModule,
    CommonCustomMaterialModule
  ],
  declarations: [BankDetailsViewComponent, GlCodeDetailsViewComponent],
  exports: [BankDetailsViewComponent, GlCodeDetailsViewComponent]
})
export class SharedPayeeBankUiPayeeBankViewModule {}
