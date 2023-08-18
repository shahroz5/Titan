import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

import { BrandDetailsViewComponent } from './brand-details-view.component';
import { BrandViewComponent } from './brand-view/brand-view.component';
import { PancardConfigViewComponent } from './pancard-config-view/pancard-config-view.component';
import { TcsConfigViewComponent } from './tcs-config-view/tcs-config-view.component';
import { CmSmsTypeViewComponent } from './cm-sms-type-view/cm-sms-type-view.component';
import { CustomerConfigViewComponent } from './customer-config-view/customer-config-view.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiDynamicFormModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiFormattersModule
  ],
  declarations: [
    BrandDetailsViewComponent,
    BrandViewComponent,
    PancardConfigViewComponent,
    TcsConfigViewComponent,
    CmSmsTypeViewComponent,
    CustomerConfigViewComponent
  ],
  exports: [BrandDetailsViewComponent]
})
export class SharedBrandUiBrandViewModule {}
