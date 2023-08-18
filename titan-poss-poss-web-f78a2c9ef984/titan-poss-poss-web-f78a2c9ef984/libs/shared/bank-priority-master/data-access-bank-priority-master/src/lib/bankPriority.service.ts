import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, concatMap } from 'rxjs/operators';
import {
  LoadBankPriorityListingSuccessPayload,
  SaveBankPriorityFormDetailsPayload
} from '@poss-web/shared/models';
import { BankPriorityAdaptor } from '@poss-web/shared/util-adaptors';

import {
  ApiService,
  getPayeeBanksListingUrl,
  getBankPriorityListingUrl,
  getBankPrioritySaveFormDetailsUrl
} from '@poss-web/shared/util-api-service';

@Injectable()
export class BankPriorityService {
  constructor(private apiService: ApiService) {}
  getBankPriority(): Observable<LoadBankPriorityListingSuccessPayload> {
    const url1 = getPayeeBanksListingUrl();
    const url2 = getBankPriorityListingUrl();
    const url3 = getBankPrioritySaveFormDetailsUrl();
    let newPayeeBanks;
    return this.apiService
      .get(url1)
      .pipe(
        map(res => {
          newPayeeBanks = res;
        })
      )
      .pipe(
        concatMap(res =>
          this.apiService.get(url2).pipe(
            map(data => {
              newPayeeBanks = BankPriorityAdaptor.getBankPriority(
                data,
                newPayeeBanks
              );
            })
          )
        )
      )
      .pipe(
        concatMap(res =>
          this.apiService.patch(url3, newPayeeBanks).pipe(
            map(data => {
              return BankPriorityAdaptor.getSavedBank(data);
            })
          )
        )
      );
  }
  saveBankPriorityFormDetails(saveForm: SaveBankPriorityFormDetailsPayload) {
    const url = getBankPrioritySaveFormDetailsUrl();
    return this.apiService
      .patch(url, saveForm)
      .pipe(map(data => BankPriorityAdaptor.getSavedBank(data)));
  }
}
