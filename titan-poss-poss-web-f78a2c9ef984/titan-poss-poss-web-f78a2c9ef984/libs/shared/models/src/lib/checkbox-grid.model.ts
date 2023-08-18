import { EntityState, createEntityAdapter } from '@ngrx/entity';

export interface CheckBoxHeader {
  title: string;
  key: string;
}

export interface CheckBoxSelectedOption {
  id: string;
  rowHeaderKey: string;
  columnHeaderKey: string;
}

export interface CheckBoxOption {
  rowHeaderKey: string;
  columnHeaderKey: string;
}

export interface CheckBoxState {
  added: OptionEntity;
  removed: string[];
}

export interface CheckBoxResponse {
  added: CheckBoxOption[];
  removed: string[];
}

export interface OptionEntity extends EntityState<CheckBoxOption> {}
export const optionAdapter = createEntityAdapter<CheckBoxOption>({
  selectId: option => option.rowHeaderKey + option.columnHeaderKey
});
export const optionSelector = optionAdapter.getSelectors();
