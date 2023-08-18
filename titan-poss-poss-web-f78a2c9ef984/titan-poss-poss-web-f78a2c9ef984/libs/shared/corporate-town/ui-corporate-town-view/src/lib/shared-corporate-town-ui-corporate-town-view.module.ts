import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CorporateTownViewComponent } from './corporate-town-view/corporate-town-view/corporate-town-view.component';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [CorporateTownViewComponent],
  exports: [CorporateTownViewComponent]
})
export class SharedCorporateTownUiCorporateTownViewModule {}
