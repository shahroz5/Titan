import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiService, getCatchmentListingUrl, getCatchmentDetailsUrl, getSaveCatchmentFormUrl, searchCatchmentListingUrl } from '@poss-web/shared/util-api-service';
import { CatchmentDetails, LoadCatchmentListingPayload, LoadCatchmentListingSuccessPayload } from '@poss-web/shared/models';
import { CatchmentAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class CatchmentService {

  constructor(private apiService: ApiService) { }

  getCatchmentListing(payload: LoadCatchmentListingPayload): Observable<LoadCatchmentListingSuccessPayload> {
    const url = getCatchmentListingUrl(payload.pageIndex, payload.pageSize);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => CatchmentAdaptor.getCatchmentListing(data))
      );
  }


  searchCatchmentDetails(payload: string): Observable<LoadCatchmentListingSuccessPayload> {
    const url = searchCatchmentListingUrl(payload);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => CatchmentAdaptor.getCatchmentListing(data))
      );
  }

  getCatchmentDetails(payload: string): Observable<CatchmentDetails> {
    if (payload === 'NEW') {
      const newFormData: CatchmentDetails = {
        catchmentCode: 'NEW',
        description: '',
        isActive: false
      };

      return of(newFormData).pipe(
        map(data => CatchmentAdaptor.getCatchmentDetails(data)));
    } else {
      const url = getCatchmentDetailsUrl(payload);
      return this.apiService.get(url.path).pipe(
        map(data => CatchmentAdaptor.getCatchmentDetails(data))
      );
    }
  }

  saveCatchmentFormDetails(form: CatchmentDetails): Observable<CatchmentDetails> {
    const url = getSaveCatchmentFormUrl();
    return this.apiService.post(url.path, form).pipe(
      map(data => CatchmentAdaptor.getCatchmentDetails(data))
    );
  }

  editCatchmentFormDetails(form: CatchmentDetails): Observable<CatchmentDetails> {
    const edit = {
      description: form.description,
      isActive: form.isActive
    }
    const url = getCatchmentDetailsUrl(form.catchmentCode);
    return this.apiService.patch(url.path, edit).pipe(
      map(data => CatchmentAdaptor.getCatchmentDetails(data))
    );
  }
}
