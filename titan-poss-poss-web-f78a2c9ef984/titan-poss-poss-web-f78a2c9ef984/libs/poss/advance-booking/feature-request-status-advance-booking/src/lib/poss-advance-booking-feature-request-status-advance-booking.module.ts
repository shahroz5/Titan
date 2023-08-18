import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestStatusAdvanceBookingComponent } from './request-status-advance-booking/request-status-advance-booking.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { RouterModule, Routes } from '@angular/router';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedCommonDataAccessCommonModule } from '@poss-web/shared/common/data-access-common';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { PossAdvanceBookingDataAccessAdvanceBookingModule } from '@poss-web/poss/advance-booking/data-access-advance-booking';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const routes: Routes = [
  {
    path: '',
    component: RequestStatusAdvanceBookingComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(routes),
    SharedComponentsUiLoaderModule,
    SharedComponentsUiCardListModule,
    SharedComponentsUiFormattersModule,
    SharedCommonDataAccessCommonModule,
    SharedUtilFieldValidatorsModule,
    PossAdvanceBookingDataAccessAdvanceBookingModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [RequestStatusAdvanceBookingComponent]
})
export class PossAdvanceBookingFeatureRequestStatusAdvanceBookingModule {}
