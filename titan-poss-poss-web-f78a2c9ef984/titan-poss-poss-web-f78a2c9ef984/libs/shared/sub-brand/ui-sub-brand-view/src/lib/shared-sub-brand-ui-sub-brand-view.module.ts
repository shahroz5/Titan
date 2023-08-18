import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { SubBrandDetailsViewComponent } from './sub-brand-details-view.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [SubBrandDetailsViewComponent],
  exports: [SubBrandDetailsViewComponent]
})
export class SharedSubBrandUiSubBrandViewModule {}
