import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

import { TepValidationConfigViewComponent } from './tep-validation-config-view.component';
import { TepValidationConfigNameViewComponent } from './tep-validation-config-name-view/tep-validation-config-name-view.component';
import { TepValidationConfigDetailsViewComponent } from './tep-validation-config-details-view/tep-validation-config-details-view.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  imports: [
    CommonModule,
    SharedComponentsUiDynamicFormModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    TepValidationConfigViewComponent,
    TepValidationConfigNameViewComponent,
    TepValidationConfigDetailsViewComponent
  ],
  exports: [TepValidationConfigViewComponent]
})
export class EpossTepValidationConfigUiTepValidationConfigViewModule {}
