import { Injectable } from '@angular/core';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProfileFeatureService {
  constructor(private profileDataFacade: ProfileDataFacade) {}

  isBTQUser(): Observable<boolean> {
    return this.profileDataFacade.isBTQUser();
  }
}
