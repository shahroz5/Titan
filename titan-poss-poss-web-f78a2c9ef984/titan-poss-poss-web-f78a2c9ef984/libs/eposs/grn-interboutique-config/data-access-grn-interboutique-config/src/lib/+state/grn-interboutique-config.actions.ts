import { Action } from '@ngrx/store';
import {
    CustomErrors,
    GrnInterboutiqueConfig
} from '@poss-web/shared/models';

export enum GrnInterboutiqueConfigActionTypes {
    LOAD_GRN_INTERBOUTIQUE_CONFIG = '[GRN interboutique Config] Load GRN interboutique Config',
    LOAD_GRN_INTERBOUTIQUE_CONFIG_SUCCESS = '[GRN interboutique Config] Load GRN interboutique Config Success',
    LOAD_GRN_INTERBOUTIQUE_CONFIG_FAILURE = '[GRN interboutique Config] Load GRN interboutique Config Failure',

    ADDNEW_GRN_INTERBOUTIQUE_CONFIG = '[GRN interboutique Config] Add New GRN interboutique Config',
    ADDNEW_GRN_INTERBOUTIQUE_CONFIG_SUCCESS = '[GRN interboutique Config] Add New GRN interboutique Config Success',
    ADDNEW_GRN_INTERBOUTIQUE_CONFIG_FAILURE = '[GRN interboutique Config] Add New GRN interboutique Config Failure',

    EDIT_GRN_INTERBOUTIQUE_CONFIG = '[GRN interboutique Config] Edit GRN interboutique Config',
    EDIT_GRN_INTERBOUTIQUE_CONFIG_SUCCESS = '[GRN interboutique Config] Edit GRN interboutique Config Success',
    EDIT_GRN_INTERBOUTIQUE_CONFIG_FAILURE = '[GRN interboutique Config] Edit GRN interboutique Config Failure'
}

export class LoadGrnInterboutiqueConfig implements Action {
    readonly type = GrnInterboutiqueConfigActionTypes.LOAD_GRN_INTERBOUTIQUE_CONFIG;
    constructor(public payload: number) { }
}
export class LoadGrnInterboutiqueConfigSuccess implements Action {
    readonly type = GrnInterboutiqueConfigActionTypes.LOAD_GRN_INTERBOUTIQUE_CONFIG_SUCCESS;
    constructor(public payload: GrnInterboutiqueConfig) { }
}
export class LoadGrnInterboutiqueConfigFailure implements Action {
    readonly type = GrnInterboutiqueConfigActionTypes.LOAD_GRN_INTERBOUTIQUE_CONFIG_FAILURE;
    constructor(public payload: CustomErrors) { }
}


export class AddNewGrnInterboutiqueConfig implements Action {
    readonly type = GrnInterboutiqueConfigActionTypes.ADDNEW_GRN_INTERBOUTIQUE_CONFIG;
    constructor(public payload: GrnInterboutiqueConfig) { }
}
export class AddNewGrnInterboutiqueConfigSuccess implements Action {
    readonly type = GrnInterboutiqueConfigActionTypes.ADDNEW_GRN_INTERBOUTIQUE_CONFIG_SUCCESS;
    constructor(public payload: GrnInterboutiqueConfig) { }
}
export class AddNewGrnInterboutiqueConfigFailure implements Action {
    readonly type = GrnInterboutiqueConfigActionTypes.ADDNEW_GRN_INTERBOUTIQUE_CONFIG_FAILURE;
    constructor(public payload: CustomErrors) { }
}


export class EditGrnInterboutiqueConfig implements Action {
    readonly type = GrnInterboutiqueConfigActionTypes.EDIT_GRN_INTERBOUTIQUE_CONFIG;
    constructor(public payload: { ruleId: number; grnInterboutiqueConfig: GrnInterboutiqueConfig }) { }
}
export class EditGrnInterboutiqueConfigSuccess implements Action {
    readonly type = GrnInterboutiqueConfigActionTypes.EDIT_GRN_INTERBOUTIQUE_CONFIG_SUCCESS;
    constructor(public payload: GrnInterboutiqueConfig) { }
}
export class EditGrnInterboutiqueConfigFailure implements Action {
    readonly type = GrnInterboutiqueConfigActionTypes.EDIT_GRN_INTERBOUTIQUE_CONFIG_FAILURE;
    constructor(public payload: CustomErrors) { }
}


export type GrnInterboutuqieConfigActions =
    | LoadGrnInterboutiqueConfig
    | LoadGrnInterboutiqueConfigSuccess
    | LoadGrnInterboutiqueConfigFailure
    | AddNewGrnInterboutiqueConfig
    | AddNewGrnInterboutiqueConfigSuccess
    | AddNewGrnInterboutiqueConfigFailure
    | EditGrnInterboutiqueConfig
    | EditGrnInterboutiqueConfigSuccess
    | EditGrnInterboutiqueConfigFailure