import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import {
  CreditNoteReducer,
  CREDIT_NOTE_FEATURE_KEY
} from './+state/cn.reducer';
import { EffectsModule } from '@ngrx/effects';
import { CreditNoteEffects } from './+state/cn.effects';
import { CreditNoteFacade } from './+state/cn.facade';
import { CreditNoteService } from './cn.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(CREDIT_NOTE_FEATURE_KEY, CreditNoteReducer),
    EffectsModule.forFeature([CreditNoteEffects])
  ],
  providers: [CreditNoteFacade, CreditNoteService]
})
export class PossCreditNoteDataAccessCnModule {}
