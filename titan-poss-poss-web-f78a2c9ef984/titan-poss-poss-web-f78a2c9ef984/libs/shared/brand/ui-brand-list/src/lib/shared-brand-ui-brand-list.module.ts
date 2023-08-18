import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { BrandListngItemComponent } from './brand-listng-item/brand-listng-item.component';
import { BrandListngItemsComponent } from './brand-listng-items/brand-listng-items.component';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
import { BrandListSearchComponent } from './brand-list-search/brand-list-search.component';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [
    BrandListngItemComponent,
    BrandListngItemsComponent,
    BrandListSearchComponent
  ],
  exports: [
    BrandListngItemComponent,
    BrandListngItemsComponent,
    BrandListSearchComponent
  ]
})
export class SharedBrandUiBrandListModule {}
