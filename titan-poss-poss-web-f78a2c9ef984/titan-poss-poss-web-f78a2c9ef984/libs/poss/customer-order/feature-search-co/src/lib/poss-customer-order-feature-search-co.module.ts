import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchCustomerOrderComponent } from './search-customer-order/search-customer-order.component';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { PossCustomerOrderUiCoModule } from '@poss-web/poss/customer-order/ui-co';
import { SharedBodEodDataAccessBodEodModule } from '@poss-web/shared/bod-eod/data-access-bod-eod';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: SearchCustomerOrderComponent }
    ]),
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    PossCustomerOrderUiCoModule,
    SharedBodEodDataAccessBodEodModule
  ],
  declarations: [SearchCustomerOrderComponent]
})
export class PossCustomerOrderFeatureSearchCoModule {}
