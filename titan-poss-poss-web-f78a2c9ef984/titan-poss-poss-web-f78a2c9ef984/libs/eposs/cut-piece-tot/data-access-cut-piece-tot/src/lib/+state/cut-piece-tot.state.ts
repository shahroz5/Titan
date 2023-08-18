import { CustomErrors, CutPieceTot } from '@poss-web/shared/models';

export interface CutPieceTotState {
  error: CustomErrors;
  cutPieceTotDetails: CutPieceTot[];
  isLoading: boolean;
  updateCutPieceTot: CutPieceTot;
}
