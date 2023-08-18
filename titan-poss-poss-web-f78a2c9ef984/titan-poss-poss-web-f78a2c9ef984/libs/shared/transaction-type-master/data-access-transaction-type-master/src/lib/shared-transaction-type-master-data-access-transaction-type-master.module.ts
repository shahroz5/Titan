import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { TRANSACTION_TYPE_MASTER_FEATURE_KEY, TransactionTypeMasterReducer } from './+state/transaction-type-master.reducer';
import { TransactionTypeMasterEffect } from './+state/transaction-type-master.effect';
import { TransactionTypeMasterFacade } from './+state/transaction-type-master.facade';
import { TransactionTypeMasterService } from './transaction-type-master.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(TRANSACTION_TYPE_MASTER_FEATURE_KEY, TransactionTypeMasterReducer),
    EffectsModule.forFeature([TransactionTypeMasterEffect])
  ],
  providers: [TransactionTypeMasterFacade, TransactionTypeMasterService]
})
export class SharedTransactionTypeMasterDataAccessTransactionTypeMasterModule { }
