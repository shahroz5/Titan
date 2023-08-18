import { ActionReducer, MetaReducer } from '@ngrx/store';

export const metaReducers: MetaReducer<any>[] = [debug];

export function debug(reducer: ActionReducer<any>): ActionReducer<any> {
  return function(state, action) {
    const newState = reducer(state, action);
    console.log(`[DEBUG] action: ${action.type}`, {
      payload: (<any>action).payload,
      oldState: state,
      newState
    });
    return newState;
  };
}
