import { NgModule } from '@angular/core';

import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { ItemSearchListComponent } from './item-search-list/item-search-list.component';
import { ItemSearchComponent } from './item-search/item-search.component';
@NgModule({
  declarations: [ItemSearchComponent, ItemSearchListComponent],
  imports: [CommonCustomMaterialModule],
  exports: [ItemSearchComponent, ItemSearchListComponent]
})
export class SharedItemUiItemSearchModule {}
