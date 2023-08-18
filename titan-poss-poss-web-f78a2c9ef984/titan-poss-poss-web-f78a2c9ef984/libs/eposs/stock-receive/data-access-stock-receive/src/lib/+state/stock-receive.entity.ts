import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { StockReceiveItem, StockReceiveStock } from '@poss-web/shared/models';

export interface ItemEntity extends EntityState<StockReceiveItem> {}
export const itemAdapter = createEntityAdapter<StockReceiveItem>({
  selectId: item => item.id
});
export const itemSelector = itemAdapter.getSelectors();

export interface StockEntity extends EntityState<StockReceiveStock> {}
export const stockAdapter = createEntityAdapter<StockReceiveStock>({
  selectId: stock => stock.id
});
export const stockSelector = stockAdapter.getSelectors();
