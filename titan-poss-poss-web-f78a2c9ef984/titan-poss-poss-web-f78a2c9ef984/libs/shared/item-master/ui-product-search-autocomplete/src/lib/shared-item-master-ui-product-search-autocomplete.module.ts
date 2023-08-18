import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductSearchAutocompleteComponent } from './product-search-autocomplete/product-search-autocomplete.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedUtilFieldValidatorsModule } from '@poss-web/shared/util-field-validators';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedUtilFieldValidatorsModule
  ],
  declarations: [ProductSearchAutocompleteComponent],
  exports: [ProductSearchAutocompleteComponent]
})
export class SharedItemMasterUiProductSearchAutocompleteModule {}
