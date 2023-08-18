import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TepRequestStatusComponent } from './tep-request-status/tep-request-status.component';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RouterModule } from '@angular/router';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { PossTepDataAccessTepModule } from '@poss-web/poss/tep/data-access-tep';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule,
    PossTepDataAccessTepModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedComponentsUiFormattersModule,
    SharedCommonDataAccessCommonModule,
    SharedUtilFieldValidatorsModule,

    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [TepRequestStatusComponent],
  exports: [TepRequestStatusComponent]
})
export class PossTepFeatureTepRequestModule {}
