import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, getTaxClassListingUrl, getTaxClassDetailsUrl, getSaveTaxClassFormUrl } from '@poss-web/shared/util-api-service';
import { LoadTaxClassListingPayload, LoadTaxClassListingSuccessPayload, TaxClassDetails } from '@poss-web/shared/models';
import { TaxClassAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class TaxClassService {
  constructor(private apiService: ApiService) {}

  getTaxClassList(
    loadTaxClassListingPayload: LoadTaxClassListingPayload
  ): Observable<LoadTaxClassListingSuccessPayload> {
    const url = getTaxClassListingUrl(
      loadTaxClassListingPayload.pageIndex,
      loadTaxClassListingPayload.pageSize
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => TaxClassAdaptor.getTaxClassDetailsListing(data))
      );
  }

  getTaxClassDetailsByTaxClassCode(
    taxClassCode: string
  ): Observable<TaxClassDetails> {
    const url = getTaxClassDetailsUrl(taxClassCode);
    return this.apiService.get(url.path).pipe(
      map(data => TaxClassAdaptor.getTaxClassDetails(data))
    );
  }

  saveTaxClassFormDetails(
    taxClassForm: TaxClassDetails
  ): Observable<TaxClassDetails> {
    const url = getSaveTaxClassFormUrl();
    return this.apiService.post(url.path, taxClassForm).pipe(
      map(data => TaxClassAdaptor.getTaxClassDetails(data))
    );
  }

  editTaxClassFormDetails(
    taxClassForm: TaxClassDetails
  ): Observable<TaxClassDetails> {
    const edit = {
      description: taxClassForm.description,
      isActive: taxClassForm.isActive
    };
    const url = getTaxClassDetailsUrl(taxClassForm.taxClassCode);
    return this.apiService.patch(url.path, edit).pipe(
      map(data => TaxClassAdaptor.getTaxClassDetails(data))
    );
  }
}
