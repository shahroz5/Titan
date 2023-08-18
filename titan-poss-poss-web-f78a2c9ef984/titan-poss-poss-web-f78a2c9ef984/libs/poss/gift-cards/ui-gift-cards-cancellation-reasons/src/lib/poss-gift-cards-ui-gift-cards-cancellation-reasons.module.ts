import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CommonCustomMaterialModule } from '@poss-web/common/custom-material';
import { GiftCardsCancellationReasonsComponent } from './gift-cards-cancellation-reasons/gift-cards-cancellation-reasons.component';
import { SharedComponentsUiFormFieldControlsModule } from '@poss-web/shared/components/ui-form-field-controls';

@NgModule({
  imports: [
    CommonModule,
    CommonCustomMaterialModule,
    SharedComponentsUiFormFieldControlsModule
  ],
  declarations: [GiftCardsCancellationReasonsComponent],
  exports: [GiftCardsCancellationReasonsComponent]
})
export class PossGiftCardsUiGiftCardsCancellationReasonsModule {}
