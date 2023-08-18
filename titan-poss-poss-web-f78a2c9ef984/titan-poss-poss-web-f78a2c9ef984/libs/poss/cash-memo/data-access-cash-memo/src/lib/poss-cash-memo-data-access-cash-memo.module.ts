import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CashMemoService } from './cash-memo.service';
import { CashMemoEffects } from './+state/cash-memo.effects';
import { CashMemoFacade } from './+state/cash-memo.facade';
import {
  cashMemoReducer,
  cashMemoFeatureKey
} from './+state/cash-memo.reducer';

@NgModule({
  imports: [CommonModule,
    StoreModule.forFeature(cashMemoFeatureKey, cashMemoReducer),
    EffectsModule.forFeature([CashMemoEffects])],
    providers: [CashMemoFacade, CashMemoService]
})
export class PossCashMemoDataAccessCashMemoModule {}
