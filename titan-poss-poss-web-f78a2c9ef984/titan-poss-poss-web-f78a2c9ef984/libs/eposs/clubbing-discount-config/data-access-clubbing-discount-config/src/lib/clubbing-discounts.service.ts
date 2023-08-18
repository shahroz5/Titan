import { Injectable } from '@angular/core';
import {
  ClubDiscountsSuccessList,
  SaveRulesPayload
} from '@poss-web/shared/models';
import { ClubbingDiscountsAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getSaveClubbedDiscountsUrl,
  getClubbedDiscountsUrl,
  getDiscountsUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
@Injectable()
export class ClubbingDiscountsService {
  constructor(private apiService: ApiService) {}
  loadClubbingDiscountConfigList(
    pageIndex?: number,
    pageSize?: number,
    discountCode?: string
  ): Observable<ClubDiscountsSuccessList> {
    const url = getClubbedDiscountsUrl(pageIndex, pageSize, discountCode);
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map((data: any) =>
          ClubbingDiscountsAdaptor.getClubbedDiscountList(data)
        )
      );
  }
  saveClubbedDiscounts(saveData: SaveRulesPayload) {
    const url = getSaveClubbedDiscountsUrl();
    return this.apiService.patch(url, saveData);
  }
  getDiscountCodesByType(type?: string) {
    const url = getDiscountsUrl(type);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => ClubbingDiscountsAdaptor.getDiscountCodes(data)));
  }
}
