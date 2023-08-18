import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CnValidationListingItemsComponent } from './cn-validation-listing-items/cn-validation-listing-items.component';
import { CnValidationListingItemComponent } from './cn-validation-listing-item/cn-validation-listing-item.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedPermissionUiPermissionModule } from '@poss-web/shared/permission/ui-permission';
import { CnValidationSearchComponent } from './cn-validation-search/cn-validation-search.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedPermissionUiPermissionModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [
    CnValidationListingItemsComponent,
    CnValidationListingItemComponent,
    CnValidationSearchComponent
  ],
  exports: [
    CnValidationListingItemsComponent,
    CnValidationListingItemComponent,
    CnValidationSearchComponent
  ]
})
export class EpossCnValidationUiCnValidationListingModule {}
