import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillCancelStatusComponent } from './bill-cancel-status/bill-cancel-status.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedBcRequestsUiBcModule } from '@poss-web/shared/bc-requests/ui-bc';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedBcRequestsDataAccessBcModule } from '@poss-web/shared/bc-requests/data-access-bc';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedBcRequestsUiBcModule,
    SharedComponentsUiFormattersModule,
    SharedBcRequestsDataAccessBcModule,
    SharedCommonDataAccessCommonModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [BillCancelStatusComponent],
  exports: [BillCancelStatusComponent]
})
export class SharedBcRequestsFeatureBcStatusModule {}
