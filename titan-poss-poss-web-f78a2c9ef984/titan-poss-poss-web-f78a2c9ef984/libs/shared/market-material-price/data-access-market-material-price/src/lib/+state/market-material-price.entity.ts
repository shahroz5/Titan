import {
  MarketDetails,
  LocationDetails,
  SelectedStock
} from '@poss-web/shared/models';
import { EntityState, createEntityAdapter } from '@ngrx/entity';
export interface MarketDetailsEntity extends EntityState<MarketDetails> { }

export const marketAdaptor = createEntityAdapter<MarketDetails>({
  selectId: marketDetailsBasedOnMaterial =>
    marketDetailsBasedOnMaterial.marketCode
});

export const marketSelector = marketAdaptor.getSelectors();

export interface LocationDetailEntity extends EntityState<LocationDetails> { }

export const locationDetailAdaptor = createEntityAdapter<LocationDetails>({
  selectId: locationDetails => locationDetails.locationCode
});

export const locationDetailSelector = locationDetailAdaptor.getSelectors();

export interface SelectedStockEntity extends EntityState<SelectedStock> { }

export const selectedStockAdaptor = createEntityAdapter<SelectedStock>({
  selectId: selectedStock => selectedStock.id
});

export const selectedStockSelector = selectedStockAdaptor.getSelectors();
