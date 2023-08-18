import { CustomErrors, LovMasterType, LovMaster, LovMasterTypeMain } from '@poss-web/shared/models';



export interface LovMasterState {
  error: CustomErrors;
  lovMasterTypes: LovMasterType[];
  lovMasterListing: LovMaster[];
  lovMasterDetails: LovMaster;
  saveLovMasterDetails: LovMaster;
  editLovMasterDetails: LovMaster[];
  totalMasterDetails: number;
  isLoading: boolean;
  lovMasterTypesMain: LovMasterTypeMain[];
}
