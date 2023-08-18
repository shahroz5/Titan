import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { LocationDetailsViewComponent } from './location-details-view.component';
import { LocationViewComponent } from './location-view/location-view.component';
import { PrintViewComponent } from './print-view/print-view.component';
import { TransactionTypeViewComponent } from './transaction-type-view/transaction-type-view.component';
import { GhsViewComponent } from './ghs-view/ghs-view.component';
import { InventoryViewComponent } from './inventory-view/inventory-view.component';
import { BankingViewComponent } from './banking-view/banking-view.component';
import { OtpViewComponent } from './otp-view/otp-view.component';
import { CustomerViewComponent } from './customer-view/customer-view.component';
import { PaymentsViewComponent } from './payments-view/payments-view.component';
import { FocViewComponent } from './foc-view/foc-view.component';
import { DigigoldViewComponent } from './digigold-view/digigold-view.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { ServicePossViewComponent } from './service-poss-view/service-poss-view/service-poss-view.component';
@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiDynamicFormModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [
    LocationDetailsViewComponent,
    LocationViewComponent,
    PrintViewComponent,
    TransactionTypeViewComponent,
    GhsViewComponent,
    InventoryViewComponent,
    BankingViewComponent,
    OtpViewComponent,
    CustomerViewComponent,
    PaymentsViewComponent,
    FocViewComponent,
    DigigoldViewComponent,
    ServicePossViewComponent
  ],
  exports: [LocationDetailsViewComponent]
})
export class SharedLocationMasterUiLocationMasterViewModule {}
