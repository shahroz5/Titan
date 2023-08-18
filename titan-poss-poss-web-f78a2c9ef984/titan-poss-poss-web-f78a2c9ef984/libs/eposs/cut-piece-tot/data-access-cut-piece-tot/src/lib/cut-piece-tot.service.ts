import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiService,
  getCutPieceTotDetailsUrl,
  getCutPieceTotListUrl
} from '@poss-web/shared/util-api-service';
import { CutPieceTot } from '@poss-web/shared/models';
import {
  CutPieceTotAdaptor
} from '@poss-web/shared/util-adaptors';

@Injectable()
export class CutPieceTotService {
  constructor(private apiService: ApiService) {}

  getCutPieceTotDetails(): Observable<CutPieceTot[]> {
    const url = getCutPieceTotListUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => CutPieceTotAdaptor.getCutPieceTotDetails(data)));
  }

  editCashPaymentConfigurationDetails(
    configId: string,
    cutPieceTot: Partial<CutPieceTot>
  ): Observable<CutPieceTot> {
    const url = getCutPieceTotDetailsUrl(configId);

    return this.apiService
      .patch(url.path, cutPieceTot, url.params)
      .pipe(map(data => CutPieceTotAdaptor.getCutPieceTotDetail(data)));
  }
}
