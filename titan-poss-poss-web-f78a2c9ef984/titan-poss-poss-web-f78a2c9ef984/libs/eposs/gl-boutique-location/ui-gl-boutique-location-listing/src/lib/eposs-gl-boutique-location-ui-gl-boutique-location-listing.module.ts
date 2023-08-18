import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlBoutiqueListItemComponent } from './gl-boutique-list-item/gl-boutique-list-item.component';
import { GlBoutiqueListItemsComponent } from './gl-boutique-list-items/gl-boutique-list-items.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiLoaderModule } from '@poss-web/shared/components/ui-loader';
import { SharedComponentsUiFormattersModule } from '@poss-web/shared/components/ui-formatters';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormattersModule,
    SharedComponentsUiLoaderModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [GlBoutiqueListItemComponent, GlBoutiqueListItemsComponent],
  exports: [GlBoutiqueListItemComponent, GlBoutiqueListItemsComponent]
})
export class EpossGlBoutiqueLocationUiGlBoutiqueLocationListingModule {}
