import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

import { TepValidationListItemsComponent } from './tep-validation-list-items/tep-validation-list-items.component';
import { TepValidationListingItemComponent } from './tep-validation-listing-item/tep-validation-listing-item.component';
import { TepValidationSearchComponent } from './tep-validation-search/tep-validation-search.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    TepValidationListItemsComponent,
    TepValidationListingItemComponent,
    TepValidationSearchComponent
  ],
  exports: [
    TepValidationListItemsComponent,
    TepValidationListingItemComponent,
    TepValidationSearchComponent
  ]
})
export class EpossTepValidationConfigUiTepValidationConfigListModule {}
