import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockReceiveService } from './stock-receive.service';
import { StockReceiveFacade } from './+state/stock-receive.facade';
import { StockReceiveEffect } from './+state/stock-receive.effect';
import { StockReceiveReducer } from './+state/stock-receive.reducer';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { stockReceiveFeatureKey } from './+state/stock-receive.state';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(stockReceiveFeatureKey, StockReceiveReducer),
    EffectsModule.forFeature([StockReceiveEffect])
  ],
  providers: [StockReceiveFacade, StockReceiveService]
})
export class EpossStockReceiveDataAccessStockReceiveModule {}
