import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { BgrConfigDetailComponent } from './bgr-config-detail/bgr-config-detail.component';
import { EpossBgrConfigUiBgrConfigViewModule } from '@poss-web/eposs/bgr-config/ui-bgr-config-view';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiAgGridModule,
    SharedUtilFieldValidatorsModule,
    EpossBgrConfigUiBgrConfigViewModule
  ],
  declarations: [BgrConfigDetailComponent],
  exports: [BgrConfigDetailComponent]
})
export class EpossBgrConfigUiBgrConfigDetailModule {}
