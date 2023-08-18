import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StockIssueEffect } from './+state/stock-issue.effects';
import {
  stockIssueFeatureKey,
  StockIssueReducer
} from './+state/stock-issue.reducer';
import { StockIssueFacade } from './+state/stock-issue.facade';
import { StockIssueService } from './stock-issue.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(stockIssueFeatureKey, StockIssueReducer),
    EffectsModule.forFeature([StockIssueEffect])
  ],
  providers: [StockIssueFacade, StockIssueService]
})
export class EpossStockIssueDataAccessStockIssueModule {}
