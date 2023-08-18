import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import {
  STOCK_RETURN_FEATURE_KEY,
  stockReturnReducer
} from './+state/stock-return.reducers';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StockReturnEffect } from './+state/stock-return.effects';
import { StockReturnFacade } from './+state/stock-return.facade';
import { StockReturnService } from './stock-return.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(STOCK_RETURN_FEATURE_KEY, stockReturnReducer),
    EffectsModule.forFeature([StockReturnEffect])
  ],
  providers: [StockReturnFacade, StockReturnService]
})
export class EpossStockReturnDataAccessStockReturnModule {}
