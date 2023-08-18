import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import {
  CREDIT_NOTE_TRANSFER_FEATURE_KEY,
  CreditNoteTransferReducer
} from './+state/cn-transfer.reducer';
import { CreditNotetransferEffects } from './+state/cn-transfer.effects';
import { CreditNoteTransferFacade } from './+state/cn-transfer.facade';
import { CreditNoteTransferService } from './credit-note-transfer.service';
@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      CREDIT_NOTE_TRANSFER_FEATURE_KEY,
      CreditNoteTransferReducer
    ),
    EffectsModule.forFeature([CreditNotetransferEffects])
  ],
  providers: [CreditNoteTransferFacade, CreditNoteTransferService]
})
export class PossCnTransferDataAccessCnTransferModule {}
