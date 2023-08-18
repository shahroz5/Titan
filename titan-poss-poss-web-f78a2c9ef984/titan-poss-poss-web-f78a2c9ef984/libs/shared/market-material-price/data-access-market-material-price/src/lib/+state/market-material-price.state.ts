import {
  CustomErrors,
  MaterialPricepType,
  MaterialTypes,
  MaterialPriceList
} from '@poss-web/shared/models';
import {
  MarketDetailsEntity,
  LocationDetailEntity,
  SelectedStockEntity
} from './market-material-price.entity';

export interface MarketMaterialPriceState {
  error: CustomErrors;
  materialPriceType: MaterialPricepType[];
  materialTypes: MaterialTypes[];
  metalPriceDetails: MaterialPriceList[];
  totalMetalTypePriceCount: number;
  isLoading: boolean;
  totalElements: number;
  marketDetailsBasedOnMaterial: MarketDetailsEntity;
  locationDetails: LocationDetailEntity;
  computedPriceSearchResult: LocationDetailEntity;
  computedPriceSearchResultCount: number;
  hasSaved: boolean;
  hasNewViewLocationPriceSuccess: boolean;
  locationDetailsCount: number;
  date: any;
  selectedStock: SelectedStockEntity;
  hasMarketDetailsBasedOnMaterialLoaded: boolean;
  allSelected: boolean;
  isValueResetToZero: boolean;
}
