import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as cutPieceTotActions from './cut-piece-tot.actions';
import { CutPieceTotSelectors } from './cut-piece-tot.selectors';
import { CutPieceTotState } from './cut-piece-tot.state';
import { CutPieceTot } from '@poss-web/shared/models';

@Injectable()
export class CutPieceTotFacade {
  constructor(private store: Store<CutPieceTotState>) {}

  private cutPieceTotDetails$ = this.store.select(
    CutPieceTotSelectors.selectCutPieceTotDetails
  );

  private updateCutPieceTotResponses$ = this.store.select(
    CutPieceTotSelectors.selectUpdateCutPieceTotResponses
  );

  private isLoading$ = this.store.select(CutPieceTotSelectors.selectIsLoading);

  private error$ = this.store.select(CutPieceTotSelectors.selectError);

  getError() {
    return this.error$;
  }

  getIsLoading() {
    return this.isLoading$;
  }

  getCutPieceTotDetails() {
    return this.cutPieceTotDetails$;
  }

  editUpdateCutPieceTotResponses() {
    return this.updateCutPieceTotResponses$;
  }

  loadCutPieceTotDetails() {
    this.store.dispatch(new cutPieceTotActions.LoadCutPieceTot());
  }

  updateCutPieceTotDetails(
    configId: string,
    cutPieceTot: Partial<CutPieceTot>
  ) {
    this.store.dispatch(
      new cutPieceTotActions.UpdateCutPieceTot({
        configId,
        cutPieceTot
      })
    );
  }
}
