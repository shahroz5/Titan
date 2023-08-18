import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerSearchComponent } from './customer-search.component';
import { CustomerUlpIdSearchComponent } from './customer-ulp-id-search/customer-ulp-id-search.component';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { CustomerMobileNoSearchComponent } from './customer-mobile-no-search/customer-mobile-no-search.component';
import { CustomerPanNoSearchComponent } from './customer-pan-no-search/customer-pan-no-search.component';
import { CustomerGstNoSearchComponent } from './customer-gst-no-search/customer-gst-no-search.component';
import { CustomerPassportNoSearchComponent } from './customer-passport-no-search/customer-passport-no-search.component';
import { CustomerEmailIdSearchComponent } from './customer-email-id-search/customer-email-id-search.component';
import { CustomerNameSearchComponent } from './customer-name-search/customer-name-search/customer-name-search.component';
import { UlpIdPopupComponent } from './ulp-id-popup/ulp-id-popup.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFormattersModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [
    CustomerSearchComponent,
    CustomerUlpIdSearchComponent,
    CustomerMobileNoSearchComponent,
    CustomerPanNoSearchComponent,
    CustomerGstNoSearchComponent,
    CustomerPassportNoSearchComponent,
    CustomerEmailIdSearchComponent,
    CustomerNameSearchComponent,
    UlpIdPopupComponent
  ],
  exports: [CustomerSearchComponent],
  entryComponents: [UlpIdPopupComponent]
})
export class SharedCustomerUiCustomerSearchModule {}
