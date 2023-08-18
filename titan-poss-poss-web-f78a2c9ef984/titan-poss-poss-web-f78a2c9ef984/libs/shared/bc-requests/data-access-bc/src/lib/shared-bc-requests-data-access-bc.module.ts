import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';

import { EffectsModule } from '@ngrx/effects';

import { BillCancellationRequestsFacade } from './+state/bill-cancellation-requests.facade';
import {
  BillCancellationRequestsReducer,
  BILL_CANCELLATION_REQUESTS_FEATURE_KEY
} from './+state/bill-cancellation-requests.reducer';
import { BillCancellationRequestsService } from './bill-cancellation-requests.service';
import { BillCancellationRequestsEffects } from './+state/bill-cancellation-requests.effects';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      BILL_CANCELLATION_REQUESTS_FEATURE_KEY,
      BillCancellationRequestsReducer
    ),
    EffectsModule.forFeature([BillCancellationRequestsEffects])
  ],

  providers: [BillCancellationRequestsFacade, BillCancellationRequestsService]
})
export class SharedBcRequestsDataAccessBcModule {}
