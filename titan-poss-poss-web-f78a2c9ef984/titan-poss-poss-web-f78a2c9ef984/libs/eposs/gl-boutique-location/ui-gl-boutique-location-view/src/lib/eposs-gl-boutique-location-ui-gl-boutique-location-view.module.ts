import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlBoutiqueLocationViewComponent } from './gl-boutique-location-view/gl-boutique-location-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SharedComponentsUiAgGridModule } from '@poss-web/shared/components/ui-ag-grid';
import { SharedComponentsUiToggleButtonModule } from '@poss-web/shared/components/ui-toggle-button';
@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiAgGridModule,
    SharedComponentsUiToggleButtonModule
  ],
  declarations: [GlBoutiqueLocationViewComponent],
  exports: [GlBoutiqueLocationViewComponent]
})
export class EpossGlBoutiqueLocationUiGlBoutiqueLocationViewModule {}
