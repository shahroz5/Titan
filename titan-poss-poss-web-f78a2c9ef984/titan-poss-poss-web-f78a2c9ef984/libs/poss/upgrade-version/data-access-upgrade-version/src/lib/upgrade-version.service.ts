import { Injectable } from '@angular/core';
import {
  UpgradeVersion,
  UpgradeVersionResponse
} from '@poss-web/shared/models';
import {
  ApiService,
  getIsUpgradeAvailableUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UpgradeVersionService {
  constructor(private apiService: ApiService) {}

  getIsUpgradeAvailable(): Observable<UpgradeVersion> {
    const IsUpdateAvailableUrl = getIsUpgradeAvailableUrl();
    return this.apiService
      .get(IsUpdateAvailableUrl)
      .pipe(map((data: UpgradeVersion) => data));
  }

  sendRequestToUpgrade(): Observable<UpgradeVersionResponse> {
    const IsUpdateAvailableUrl = getIsUpgradeAvailableUrl();
    return this.apiService
      .put(IsUpdateAvailableUrl)
      .pipe(map((data: UpgradeVersionResponse) => data));
  }
}
