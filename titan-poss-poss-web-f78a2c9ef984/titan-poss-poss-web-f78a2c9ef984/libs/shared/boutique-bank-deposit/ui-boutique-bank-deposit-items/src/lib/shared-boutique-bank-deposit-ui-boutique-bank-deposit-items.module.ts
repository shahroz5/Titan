import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { BoutiqueBankDepositItemsComponent } from './boutique-bank-deposit-items/boutique-bank-deposit-items.component';
import { BoutiqueBankDepositPopupComponent } from './boutique-bank-deposit-popup/boutique-bank-deposit-popup.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { BoutiqueBankDepositViewComponent } from './boutique-bank-deposit-view/boutique-bank-deposit-view.component';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [
    BoutiqueBankDepositItemsComponent,
    BoutiqueBankDepositPopupComponent,
    BoutiqueBankDepositViewComponent
  ],
  exports: [BoutiqueBankDepositItemsComponent, BoutiqueBankDepositViewComponent]
})
export class SharedBoutiqueBankDepositUiBoutiqueBankDepositItemsModule {}
