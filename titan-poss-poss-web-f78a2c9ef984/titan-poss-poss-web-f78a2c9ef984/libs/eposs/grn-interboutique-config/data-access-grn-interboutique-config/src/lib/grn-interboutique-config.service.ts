import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  ApiService,
  getGrnInterboutiqueConfigUrl,
  getAddNewGrnInterboutiqueConfigUrl
} from '@poss-web/shared/util-api-service';
import { GrnInterboutiqueConfig } from '@poss-web/shared/models';
import { GrnInterboutiqueConfigAdaptor } from '@poss-web/shared/util-adaptors';

@Injectable()
export class GrnInterboutiqueConfigService {
  constructor(private apiService: ApiService) {}

  getGrnInterboutiqueConfigDetails(
    ruleId: number
  ): Observable<GrnInterboutiqueConfig> {
    const url = getGrnInterboutiqueConfigUrl(ruleId);
    return this.apiService
      .get(url.path)
      .pipe(
        map(data =>
          GrnInterboutiqueConfigAdaptor.getGrnInterboutiqueConfigDetails(data)
        )
      );
  }

  addNewGrnInterboutiqueConfigDetails(
    formData: GrnInterboutiqueConfig
  ): Observable<GrnInterboutiqueConfig> {
    const url = getAddNewGrnInterboutiqueConfigUrl();

    return this.apiService
      .post(url.path, formData)
      .pipe(
        map(data =>
          GrnInterboutiqueConfigAdaptor.getGrnInterboutiqueConfigDetails(data)
        )
      );
  }

  editGrnInterboutiqueConfigDetails(
    ruleId: number,
    grnInterboutiqueConfigForm: GrnInterboutiqueConfig
  ): Observable<GrnInterboutiqueConfig> {
    const url = getGrnInterboutiqueConfigUrl(ruleId);

    const formData = {
      isActive: grnInterboutiqueConfigForm.isActive,
      ruleDetails: {
        data: grnInterboutiqueConfigForm.ruleDetails.data,
        type: grnInterboutiqueConfigForm.ruleDetails.type
      }
    };

    return this.apiService
      .patch(url.path, formData)
      .pipe(
        map(data =>
          GrnInterboutiqueConfigAdaptor.getGrnInterboutiqueConfigDetails(data)
        )
      );
  }
}
