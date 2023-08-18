import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';


import * as grnInterboutiqueConfigActions from './grn-interboutique-config.actions';
import { GrnInterboutiqueConfigSelectors } from './grn-interboutique-config.selectors';
import { GrnInterboutiqueConfigState } from './grn-interboutique-config.state';
import { GrnInterboutiqueConfig } from '@poss-web/shared/models';

@Injectable()
export class GrnInterboutiqueConfigFacade {
    constructor(private store: Store<GrnInterboutiqueConfigState>) { }

    private grnInterboutiqueConfigDetails$ = this.store.select(
        GrnInterboutiqueConfigSelectors.selectGrnInterboutiqueConfigDetails
    );

    private editGrnInterboutiqueConfigResponses$ = this.store.select(
        GrnInterboutiqueConfigSelectors.selectEditGrnInterboutiqueConfigResponses
    );

    private isLoading$ = this.store.select(
        GrnInterboutiqueConfigSelectors.selectIsLoading
    );

    private error$ = this.store.select(
        GrnInterboutiqueConfigSelectors.selectError
    );

    getError() {
        return this.error$;
    }

    getIsLoading() {
        return this.isLoading$;
    }

    getGrnInterboutiqueConfigDetails() {
        return this.grnInterboutiqueConfigDetails$;
    }

    editEditGrnInterboutiqueConfigResponses() {
        return this.editGrnInterboutiqueConfigResponses$;
    }

    loadGrnInterboutiqueConfigDetails(ruleId: number) {
        this.store.dispatch(new grnInterboutiqueConfigActions.LoadGrnInterboutiqueConfig(ruleId));
    }

    addNewGrnInterboutiqueConfigDetails(grnInterboutiqueConfigForm: GrnInterboutiqueConfig) {
        this.store.dispatch(new grnInterboutiqueConfigActions.AddNewGrnInterboutiqueConfig(grnInterboutiqueConfigForm));
    }

    editGrnInterboutiqueConfigDetails(ruleId: number, grnInterboutiqueConfigForm: GrnInterboutiqueConfig) {
        this.store.dispatch(new grnInterboutiqueConfigActions.EditGrnInterboutiqueConfig({ ruleId, grnInterboutiqueConfig: grnInterboutiqueConfigForm }));
    }

}
