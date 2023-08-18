import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerCreateComponent } from './customer-create.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RouterModule } from '@angular/router';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import {
  CustomerServiceAbstraction,
  PanCardPopupAbstraction
} from '@poss-web/shared/models';
import { CustomerCreateService } from './customer-create.service';
import { SharedCustomerDataAccessCustomerModule } from '@poss-web/shared/customer/data-access-customer';
import { SharedCustomerUiCustomerCreateModule } from '@poss-web/shared/customer/ui-customer-create';
import { PanCardPopupComponent } from './pan-card-popup/pan-card-popup.component';
import { PanCardPopupService } from './pan-card-popup/pan-card-popup.service';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule,
    SharedComponentsUiLoaderModule,
    SharedCustomerDataAccessCustomerModule,
    SharedCustomerUiCustomerCreateModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [CustomerCreateComponent, PanCardPopupComponent],
  exports: [CustomerCreateComponent, PanCardPopupComponent],
  entryComponents: [CustomerCreateComponent, PanCardPopupComponent],
  providers: [
    {
      provide: CustomerServiceAbstraction,
      useClass: CustomerCreateService
    },
    {
      provide: PanCardPopupAbstraction,
      useClass: PanCardPopupService
    }
  ]
})
export class SharedCustomerFeatureCustomerCreateModule {}
