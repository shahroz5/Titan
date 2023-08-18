import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { LocationFormComponent } from './location-form.component';
import { PrintFormComponent } from './print-form.component';
import { TransactionTypeFormComponent } from './transaction-type-form.component';
import { GhsFormComponent } from './ghs-form.component';
import { InventoryFormComponent } from './inventory-form.component';
import { BankingFormComponent } from './banking-form.component';
import { OtpFormComponent } from './otp-form.component';
import { CustomerFormComponent } from './customer-form.component';
import { PaymentsFormComponent } from './payments-form.component';
import { FocFormComponent } from './foc-form.component';
import { DigigoldFormComponent } from './digigold-form.component';
import { TcsFormComponent } from './tcs-form.component';
import { ServicePossFormComponent } from './service-poss-form.component';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiDynamicFormModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule
  ],
  declarations: [
    LocationFormComponent,
    PrintFormComponent,
    TransactionTypeFormComponent,
    GhsFormComponent,
    InventoryFormComponent,
    BankingFormComponent,
    OtpFormComponent,
    CustomerFormComponent,
    PaymentsFormComponent,
    FocFormComponent,
    DigigoldFormComponent,
    TcsFormComponent,
    ServicePossFormComponent
  ],
  exports: [
    LocationFormComponent,
    PrintFormComponent,
    TransactionTypeFormComponent,
    GhsFormComponent,
    InventoryFormComponent,
    BankingFormComponent,
    OtpFormComponent,
    CustomerFormComponent,
    PaymentsFormComponent,
    FocFormComponent,
    DigigoldFormComponent,
    TcsFormComponent,
    ServicePossFormComponent
  ]
})
export class SharedLocationMasterUiLocationMasterDetailModule {}
