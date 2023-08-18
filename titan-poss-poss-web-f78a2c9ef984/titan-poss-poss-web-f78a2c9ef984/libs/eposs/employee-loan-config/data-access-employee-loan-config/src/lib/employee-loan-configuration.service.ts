import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiService,
  getDeleteEmpLoanConfigUrl,
  getEmpLoanConfigUrl,
} from '@poss-web/shared/util-api-service';
import {
  EmployeeLoanSuccessList,
  ListingPayload,
  SortItem
} from '@poss-web/shared/models';
import { EmployeeLoanConfigurationAdaptor } from '@poss-web/shared/util-adaptors';
@Injectable()
export class EmployeeLoanConfigurationService {
  constructor(private apiService: ApiService) {}

  empLoanConfigList(
    payload: ListingPayload,
    sortField: SortItem,
  ): Observable<EmployeeLoanSuccessList> {
    const url = getEmpLoanConfigUrl(
      payload.pageIndex,
      payload.pageSize,
      sortField,
    );

    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
        EmployeeLoanConfigurationAdaptor.employeeLoanConfigList(data)
        )
      );
  }

  deleteEmpLoanConfig(payload: string): Observable<any> {
    const url = getDeleteEmpLoanConfigUrl(
      payload
    );

    return this.apiService
      .post(url.path,{}, url.params)
      .pipe(
        map((data: any) =>
          data
        )
      );
  }
}
