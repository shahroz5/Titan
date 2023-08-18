import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbCoPopupComponent } from './ab-co-popup/ab-co-popup.component';

@NgModule({
  imports: [CommonModule, CommonCustomMaterialModule],
  declarations: [AbCoPopupComponent],
  entryComponents: [AbCoPopupComponent]
})
export class EpossDiscountConfigUiDiscountConfigAbCoPopupModule {}
