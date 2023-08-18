import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';

import { SharedItemUiItemSearchModule } from '@poss-web/shared/item/ui-item-search';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiCardListModule } from '@poss-web/shared/components/ui-card-list';
import { MainItemContainerComponent } from './main-item-container/main-item-container.component';
import { ItemContainerComponent } from './item-container/item-container.component';
import { SharedItemMasterUiItemListModule } from '@poss-web/shared/item-master/ui-item-list';
import { SharedItemMasterUiItemDetailModule } from '@poss-web/shared/item-master/ui-item-detail';
import { SharedItemMasterDataAccessItemMasterModule } from '@poss-web/shared/item-master/data-access-item-master';
const route = [
  {
    path: '',
    component: MainItemContainerComponent,
    children: [{ path: '', component: ItemContainerComponent }]
  }
];
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    RouterModule.forChild(route),
    SharedComponentsUiLoaderModule,
    SharedItemMasterDataAccessItemMasterModule,
    SharedComponentsUiCardListModule,
    SharedItemUiItemSearchModule,
    SharedItemMasterUiItemListModule,
    SharedItemMasterUiItemDetailModule
  ],
  declarations: [MainItemContainerComponent, ItemContainerComponent]
})
export class SharedItemMasterFeatureItemDetailModule {}
