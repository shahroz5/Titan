import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Zone } from '@poss-web/shared/models';

@Injectable({
  providedIn: 'root'
})
export class ZoneDataService {

  getZones(): Observable<Zone[]> {
    return of([
      {
        description: 'Zone1',
        zoneCode: 1
      },
      {
        description: 'Zone2',
        zoneCode: 2
      },
      {
        description: 'Zone3',
        zoneCode: 3
      },
      {
        description: 'Zone4',
        zoneCode: 4
      }
    ]);
  }
}
