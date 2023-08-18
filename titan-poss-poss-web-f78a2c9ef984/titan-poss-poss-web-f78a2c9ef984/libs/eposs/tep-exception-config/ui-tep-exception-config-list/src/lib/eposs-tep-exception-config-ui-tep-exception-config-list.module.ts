import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

import { TepExceptionListItemsComponent } from './tep-exception-list-items/tep-exception-list-items.component';
import { TepExceptionListingItemComponent } from './tep-exception-listing-item/tep-exception-listing-item.component';
import { TepExceptionFilterComponent } from './tep-exception-filter/tep-exception-filter.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule,
    SharedComponentsUiFormFieldControlsModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [
    TepExceptionListItemsComponent,
    TepExceptionListingItemComponent,
    TepExceptionFilterComponent
  ],
  exports: [
    TepExceptionListItemsComponent,
    TepExceptionListingItemComponent,
    TepExceptionFilterComponent
  ],
  entryComponents: [TepExceptionFilterComponent]
})
export class EpossTepExceptionConfigUiTepExceptionConfigListModule {}
