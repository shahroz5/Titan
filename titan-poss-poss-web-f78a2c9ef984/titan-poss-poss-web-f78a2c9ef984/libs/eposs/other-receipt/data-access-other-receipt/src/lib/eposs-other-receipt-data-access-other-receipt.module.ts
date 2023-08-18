import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OtherReceiptsFacade } from './+state/other-receipts.facade';
import { OtherReceiptService } from './other-receipts.service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { OTHER_RECEIPT_FEATURE_KEY, OtherReceiptsReducer } from './+state/other-receipts.reducer';
import { OtherReceiptsEffect } from './+state/other-receipts.effects';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(OTHER_RECEIPT_FEATURE_KEY, OtherReceiptsReducer),
    EffectsModule.forFeature([OtherReceiptsEffect])
  ],
  providers: [OtherReceiptsFacade, OtherReceiptService]
})
export class EpossOtherReceiptDataAccessOtherReceiptModule {}
