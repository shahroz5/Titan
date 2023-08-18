import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiFileUploadModule } from '@poss-web/shared/components/ui-file-upload';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { AbRequestsDetailsComponent } from './ab-requests-details/ab-requests-details.component';
import { FreezeAdvanceBookingComponent } from './freeze-advance-booking/freeze-advance-booking.component';
import { ManualAbApprovalDetailsComponent } from './manual-ab-approval-details/manual-ab-approval-details.component';
import { ManualAbValidateDetailsComponent } from './manual-ab-validate-details/manua-ab-validate-details.component';
import { RegularizeAdvanceBookingDetailsComponent } from './regularize-advance-booking-details/regularize-advance-booking-details.component';
import { SearchAdvanceBookingDetailsComponent } from './search-advance-booking-details/search-advance-booking-details.component';
import { SearchListAdvanceBookingComponent } from './search-list-advance-booking/search-list-advance-booking.component';
import { ViewDetailsAdvanceBookingComponent } from './view-details-advance-booking/view-details-advance-booking.component';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiAgGridModule,
    SharedUtilFieldValidatorsModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedComponentsUiFileUploadModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [
    FreezeAdvanceBookingComponent,
    SearchListAdvanceBookingComponent,
    SearchAdvanceBookingDetailsComponent,
    AbRequestsDetailsComponent,
    ViewDetailsAdvanceBookingComponent,
    RegularizeAdvanceBookingDetailsComponent,
    ManualAbApprovalDetailsComponent,
    ManualAbValidateDetailsComponent
  ],
  exports: [
    FreezeAdvanceBookingComponent,
    SearchListAdvanceBookingComponent,
    SearchAdvanceBookingDetailsComponent,
    AbRequestsDetailsComponent,
    ViewDetailsAdvanceBookingComponent,
    RegularizeAdvanceBookingDetailsComponent,
    ManualAbApprovalDetailsComponent,
    ManualAbValidateDetailsComponent
  ]
})
export class PossAdvanceBookingUiAdvanceBookingModule {}
