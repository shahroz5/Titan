import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedUtilApiServiceModule } from '@poss-web/shared/util-api-service';
import { StoreModule } from '@ngrx/store';
import { empLoanConfigurationKey, EmployeeLoanConfigurationReducer } from './+state/employee-loan-configuration.reducer';
import { EffectsModule } from '@ngrx/effects';
import { EmployeeLoanConfigurationEffect } from './+state/employee-loan-configuration.effects';
import { EmployeeLoanConfigurationFacade } from './+state/employee-loan-configuration.facade';
import { EmployeeLoanConfigurationService } from './employee-loan-configuration.service';

@NgModule({
  imports: [
    CommonModule,
    SharedUtilApiServiceModule,
    StoreModule.forFeature(
      empLoanConfigurationKey,
      EmployeeLoanConfigurationReducer
    ),
    EffectsModule.forFeature([EmployeeLoanConfigurationEffect])
  ],
  providers: [EmployeeLoanConfigurationFacade, EmployeeLoanConfigurationService]
})
export class EpossEmployeeLoanConfigDataAccessEmployeeLoanConfigModule {}
