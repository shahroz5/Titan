
import { Injectable } from '@angular/core';
import { ApiService, getTcsDetailUrl } from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { TcsList, TcsRequestParam } from '@poss-web/shared/models';
import { CashMemoAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable({
  providedIn: 'root'
})
export class ViewTcsDataService {
  constructor(private apiService: ApiService) {}

  getTcsDetail(requestParam: TcsRequestParam): Observable<TcsList[]> {
    const url = getTcsDetailUrl(requestParam);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map((data: any) => CashMemoAdaptor.getTcsFromJson(data)));
  }
}
