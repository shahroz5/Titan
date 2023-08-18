import { Injectable } from '@angular/core';
import { UpdateHallmarkDetails } from '@poss-web/shared/models';

import { ApiService, getUpdateHallmarkDetailsUrl } from '@poss-web/shared/util-api-service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UpdateItemHallmarkDetailsService {

  constructor(private apiService: ApiService) {}

  updateHallmarkDetails(
    requestBody: UpdateHallmarkDetails
  ): Observable<boolean> {

    const url = getUpdateHallmarkDetailsUrl(requestBody);

    return this.apiService
      .patch(url)
      .pipe(map((data: any) => data));

  }

}
