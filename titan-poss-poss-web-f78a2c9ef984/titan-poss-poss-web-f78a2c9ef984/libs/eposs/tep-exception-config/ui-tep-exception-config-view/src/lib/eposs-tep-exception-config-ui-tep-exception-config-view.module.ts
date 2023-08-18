import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedComponentsUiDynamicFormModule } from '@poss-web/shared/components/ui-dynamic-form';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';

import { TepExceptionConfigViewComponent } from './tep-exception-config-view.component';
import { TepExceptionConfigNameViewComponent } from './tep-exception-config-name-view/tep-exception-config-name-view.component';
import { TepExceptionConfigDetailsViewComponent } from './tep-exception-config-details-view/tep-exception-config-details-view.component';
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
    TepExceptionConfigViewComponent,
    TepExceptionConfigNameViewComponent,
    TepExceptionConfigDetailsViewComponent
  ],
  exports: [TepExceptionConfigViewComponent]
})
export class EpossTepExceptionConfigUiTepExceptionConfigViewModule {}
