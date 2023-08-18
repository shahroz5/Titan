import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { EmployeeLoanConfigList } from '@poss-web/shared/models';

export interface EmployeeLoanConfigEntity extends EntityState<EmployeeLoanConfigList> {}
export const empLoanConfigAdapter = createEntityAdapter<EmployeeLoanConfigList>({
  selectId: accessList => accessList.id
});

export const empLoanConfigSelector = empLoanConfigAdapter.getSelectors();
