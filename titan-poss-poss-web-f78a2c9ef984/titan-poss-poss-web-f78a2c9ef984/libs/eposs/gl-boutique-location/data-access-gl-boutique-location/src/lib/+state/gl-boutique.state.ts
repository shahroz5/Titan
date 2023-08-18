import { CustomErrors,GlBoutiqueLocationList } from '@poss-web/shared/models';


export interface GlBoutiqueLocationState {
  error: CustomErrors;
  glBoutiqueLocationList: GlBoutiqueLocationList[];
  glBoutiqueLocationDetails: GlBoutiqueLocationList;
  totalGlBoutiqueLocation: number;
  isLoading: boolean;
  hasSaved: boolean;
  hasUpdated: boolean;
  saveGlBoutiqueLocation: GlBoutiqueLocationList;
  editGlBoutiqueLocation: GlBoutiqueLocationList;
}
