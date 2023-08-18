import {
  CustomErrors,
  ProductType,
  CFAProductsResponse,
  ItemTypesResponse,
  ProductGroupDetails
} from '@poss-web/shared/models';
export interface CFAProductCodeState {
  error: CustomErrors;
  CFAProductCodeListing: CFAProductsResponse[];
  totalElements: number;
  CFAProduct: ProductGroupDetails;
  isLoading: boolean;
  hasSaved: boolean;
  hasUpdated: boolean;
  productType: ProductType[];
  itemTypes: ItemTypesResponse[];
  plainStuddedType: { id: string; name: string }[];
  hallmarkingExcludeKaratType: {id:string; name:string}[];
  pricingType: { id: string; name: string }[];
}
