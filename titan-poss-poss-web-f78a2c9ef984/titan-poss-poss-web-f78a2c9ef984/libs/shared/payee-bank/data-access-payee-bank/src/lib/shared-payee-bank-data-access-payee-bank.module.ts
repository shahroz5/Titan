import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { PayeeBankEffect } from './+state/payee-bank.effect';
import { PAYEE_BANK_FEATURE_KEY, PayeeBankReducer } from './+state/payee-bank.reducer';
import { PayeeBankFacade } from './+state/payee-bank.facade';
import { PayeeBankService } from './payee-bank.service';
@NgModule({
  imports: [CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(PAYEE_BANK_FEATURE_KEY, PayeeBankReducer),
    EffectsModule.forFeature([PayeeBankEffect])],
    providers: [PayeeBankFacade, PayeeBankService]
})
export class SharedPayeeBankDataAccessPayeeBankModule {}
