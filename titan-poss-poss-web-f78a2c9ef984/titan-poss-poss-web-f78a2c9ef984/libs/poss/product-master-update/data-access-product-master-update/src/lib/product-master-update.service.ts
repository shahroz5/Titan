import { Injectable } from '@angular/core';
import {
  ApiService,
  loadProductMasterUpdateUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductMasterUpdateService {
  constructor(private apiService: ApiService) {}

  loadProductMasterUpdate(
    itemCode: string,
    lotNumber: string
  ): Observable<any> {
    const loadProductMasterUrl = loadProductMasterUpdateUrl(
      itemCode,
      lotNumber
    );
    return this.apiService
      .post(loadProductMasterUrl.path, {}, loadProductMasterUrl.params)
      .pipe(map((data: any) => data));
  }
}
