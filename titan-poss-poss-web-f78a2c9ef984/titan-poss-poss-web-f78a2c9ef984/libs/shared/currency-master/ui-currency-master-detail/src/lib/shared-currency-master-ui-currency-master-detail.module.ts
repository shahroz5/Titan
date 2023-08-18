import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CurrencyDetailsComponent } from './currency-details/currency-details.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule
  ],
  declarations: [CurrencyDetailsComponent]
})
export class SharedCurrencyMasterUiCurrencyMasterDetailModule {}
