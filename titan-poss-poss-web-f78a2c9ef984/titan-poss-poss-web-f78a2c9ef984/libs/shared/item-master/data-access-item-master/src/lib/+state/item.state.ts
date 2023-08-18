import {
  CustomErrors,
  ListingPageData,
  ItemStones,
  ItemFilter,
  ItemFilterPayload,
  Lov,
  ProductGroup,
  ItemDetails
} from '@poss-web/shared/models';

export interface ItemListingState {
  error: CustomErrors;
  itemListing: ListingPageData[];
  itemDetails: ItemDetails;
  totalItemDetails: number;
  isLoading: boolean;
  itemStones: ItemStones[];
  itemFilter: ItemFilter;
  filterPayload: ItemFilterPayload;
  pricingType: Lov[];
  CFAproductCode: ProductGroup[];
}
