import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnValidationListingComponent } from './cn-validation-listing/cn-validation-listing.component';
import { RouterModule, Route } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { EpossCnValidationDataAccessCnValidationModule } from '@poss-web/eposs/cn-validation/data-access-cn-validation';
import { EpossCnValidationUiCnValidationListingModule } from '@poss-web/eposs/cn-validation/ui-cn-validation-listing';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { SharedPermissionDataAccessPermissionModule } from '@poss-web/shared/permission/data-access-permission';

const route: Route[] = [{ path: '', component: CnValidationListingComponent }];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    EpossCnValidationDataAccessCnValidationModule,
    EpossCnValidationUiCnValidationListingModule,
    SharedPermissionUiPermissionModule,
    SharedPermissionDataAccessPermissionModule
  ],
  declarations: [CnValidationListingComponent]
})
export class EpossCnValidationFeatureCnValidationListingModule {}
