import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { RegularCustomerFormComponent } from './regular-customer-form/regular-customer-form.component';
import { OneTimeCustomerFormComponent } from './one-time-customer-form/one-time-customer-form.component';
import { InternationalCustomerFormComponent } from './international-customer-form/international-customer-form.component';
import { InstitutionalCustomerFormComponent } from './institutional-customer-form/institutional-customer-form.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { EncircleAddressPanelComponent } from './encircle-address-panel/encircle-address-panel.component';
import { SharedComponentsUiAddressPanelModule } from '@poss-web/shared/components/ui-address-panel';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiAddressPanelModule
  ],
  declarations: [
    RegularCustomerFormComponent,
    OneTimeCustomerFormComponent,
    InternationalCustomerFormComponent,
    InstitutionalCustomerFormComponent,
    EncircleAddressPanelComponent
  ],
  exports: [
    RegularCustomerFormComponent,
    OneTimeCustomerFormComponent,
    InternationalCustomerFormComponent,
    InstitutionalCustomerFormComponent
  ],
  providers: []
})
export class SharedCustomerUiCustomerCreateModule {}
