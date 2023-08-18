import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiService,
  getStateTaxConfigurationListingUrl,
  getStateTaxConfigurationStateDetailsUrl,
  getAllStateListingUrl,
  getStateTaxConfigurationTaxDetailsUrl,
  getAllTaxClassListingUrl,
  getAllTaxListingUrl,
  getStateTaxSaveUrl
} from '@poss-web/shared/util-api-service';
import {
  LoadStateTaxConfigurationListingPayload,
  StateTaxConfigurationListingResult,
  LoadStatesDetailsListingSuccessPayload,
  StateTaxConfigurationStateDetails,
  TaxDetailsConfig,
  TaxsList,
  TaxDetailsSubmit,
  LovMasterEnum
} from '@poss-web/shared/models';
import {
  StateTaxConfigurationAdaptor,
  StateAdaptor
} from '@poss-web/shared/util-adaptors';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';

@Injectable()
export class StateTaxConfigurationService {
  constructor(
    private apiService: ApiService,
    private lovService: LovDataService
  ) {}

  getStateTaxConfigurationList(
    params: LoadStateTaxConfigurationListingPayload,
    stateName?: string
  ): Observable<StateTaxConfigurationListingResult> {
    const url = getStateTaxConfigurationListingUrl(
      params.pageIndex,
      params.pageSize,
      stateName
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          StateTaxConfigurationAdaptor.getStateTaxConfigurationListing(data)
        )
      );
  }

  getStateTaxConfigurationStateDetails(
    configId: string
  ): Observable<StateTaxConfigurationStateDetails> {
    const url = getStateTaxConfigurationStateDetailsUrl(configId);
    return this.apiService
      .get(url.path)
      .pipe(
        map(data =>
          StateTaxConfigurationAdaptor.getStateTaxConfigurationStateDetails(
            data
          )
        )
      );
  }

  getStateTaxConfigurationTaxDetails(
    configId: string
  ): Observable<TaxDetailsConfig[]> {
    const url = getStateTaxConfigurationTaxDetailsUrl(configId);
    return this.apiService
      .get(url.path)
      .pipe(
        map(data =>
          StateTaxConfigurationAdaptor.getStateTaxConfigurationTaxDetails(data)
        )
      );
  }

  getAllStateList(): Observable<LoadStatesDetailsListingSuccessPayload> {
    const url = getAllStateListingUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => StateAdaptor.getStateDetailsListing(data)));
  }

  getAllTaxSystemList(): Observable<string[]> {
    return this.lovService
      .getLov(LovMasterEnum.TAXSYSTEM)
      .pipe(map(data => StateAdaptor.getTaxSystem(data)));

    // return of(['GST']);
  }

  getAllTaxClassList(): Observable<string[]> {
    const url = getAllTaxClassListingUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => StateTaxConfigurationAdaptor.getTaxClassDetails(data)));
  }

  getAllTaxList(): Observable<TaxsList[]> {
    const url = getAllTaxListingUrl();
    return this.apiService
      .get(url.path)
      .pipe(map(data => StateTaxConfigurationAdaptor.getTaxsList(data)));
  }

  saveStateTaxConfigurationStateDetails(
    formData: StateTaxConfigurationStateDetails
  ): Observable<StateTaxConfigurationStateDetails> {
    const url = getStateTaxSaveUrl();
    return this.apiService
      .post(url.path, formData)
      .pipe(
        map(data =>
          StateTaxConfigurationAdaptor.getStateTaxConfigurationStateDetails(
            data
          )
        )
      );
  }

  editStateTaxConfigurationStateDetails(
    formData: StateTaxConfigurationStateDetails,
    configId: string
  ): Observable<StateTaxConfigurationStateDetails> {
    const url = getStateTaxConfigurationStateDetailsUrl(configId);
    return this.apiService
      .patch(url.path, formData)
      .pipe(
        map(data =>
          StateTaxConfigurationAdaptor.getStateTaxConfigurationStateDetails(
            data
          )
        )
      );
  }

  saveStateTaxConfigurationTaxDetails(
    formData: TaxDetailsSubmit,
    configId: string
  ): Observable<TaxDetailsSubmit> {
    const url = getStateTaxConfigurationTaxDetailsUrl(configId);
    return this.apiService.patch(url.path, formData);
  }
}
