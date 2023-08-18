import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { BrandDetailsFormComponent } from './brand-details-form.component';
import { PancardConfigFormComponent } from './pancard-config-form.component';
import { TcsConfigFormComponent } from './tcs-config-form.component';
import { CmSmsFormComponent } from './cm-sms-form.component';
import { CustomerConfigFormComponent } from './customer-config-form.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiDynamicFormModule
  ],
  declarations: [
    BrandDetailsFormComponent,
    PancardConfigFormComponent,
    TcsConfigFormComponent,
    CmSmsFormComponent,
    CustomerConfigFormComponent
  ],
  exports: [
    BrandDetailsFormComponent,
    PancardConfigFormComponent,
    TcsConfigFormComponent,
    CmSmsFormComponent,
    CustomerConfigFormComponent
  ]
})
export class SharedBrandUiBrandDetailModule {}
