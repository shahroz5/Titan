import { Injectable } from '@angular/core';
import { EncircleProductGroupMappingSavePayload } from '@poss-web/shared/models';
import {
  saveEncircleProductGroups,
  ApiService,
  loadEncircleMappings,
  searchProductGroupCode
} from '@poss-web/shared/util-api-service';
import { map } from 'rxjs/operators';
import { EncircleProductGroupMappingAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable({
  providedIn: 'root'
})
export class EncircleProductGroupMappingService {
  constructor(private apiService: ApiService) {}
  saveEncircleProductGroups(payload: EncircleProductGroupMappingSavePayload) {
    const url = saveEncircleProductGroups(payload.paymentCategoryName);
    return this.apiService.patch(url, payload.savePayload);
  }
  loadSelectedProductGroups(
    paymentCategoryName: string,
    pageIndex: number,
    pageSize: number,
    productGroupCode?: string
  ) {
    const url = loadEncircleMappings(paymentCategoryName, pageIndex, pageSize, productGroupCode);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          EncircleProductGroupMappingAdaptor.getSelectedProductGroups(data)
        )
      );
  }
  searchProductGroupCode(productGroupCode: string) {
    const url = searchProductGroupCode(productGroupCode);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data =>
          EncircleProductGroupMappingAdaptor.getSelectedProductGroups(data)
        )
      );
  }
}
