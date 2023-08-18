import { Observable } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { DataPersistence } from '@nrwl/angular';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import { ProfileDataEffect } from './profile-data.effect';
import { ProfileDataService } from '../profile-data.service';
import {
  LoadProfileData,
  LoadProfileDataFailure,
  LoadProfileDataSuccess
} from './profile-data.actions';
import { ProfileData } from '@poss-web/shared/models';

describe('User Profile Effects Testing Suite', () => {
  let actions$: Observable<any>;
  let effect: ProfileDataEffect;
  // const httpClientSpy: jasmine.SpyObj<HttpClient> = jasmine.createSpyObj(
  //   'httpClient',
  //   ['get', 'post', 'patch']
  // );
  const initialState = {};
  const profileDataServiceSpy = jasmine.createSpyObj<ProfileDataService>(
    'ProfileDataService',
    ['loadUserProfile']
  );

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProfileDataEffect,
        DataPersistence,
        provideMockStore({ initialState }),
        provideMockActions(() => actions$),
        // {
        //   provide: HttpClient,
        //   useValue: httpClientSpy
        // },
        {
          provide: ProfileDataService,
          useValue: profileDataServiceSpy
        }
      ]
    });
    effect = TestBed.inject(ProfileDataEffect);
  });

  describe('loadUserProfile', () => {
    it('should load User Profile', () => {
      const payload: ProfileData = {
        empName: 'System Admin',
        email: 'abcd@titan.com',
        userType: 'CORP',
        boutiqueType: 'ORG',
        boutiqueCode: '',
        boutiqueDesc: '',
        isBTQUser: false,
        isCorpUser: true,
        isRegUser: false,
        regionCode: null,
        isL1Boutique: false,
        isL2Boutique: false,
        isL3Boutique: false,
        orgCode: 'TJ',
        address: null
      };

      const action = new LoadProfileData();
      const outCome = new LoadProfileDataSuccess(payload);
      actions$ = hot('-a', { a: action });
      const response$ = cold('-a|', { a: payload });
      profileDataServiceSpy.loadUserProfile.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.userProfile$).toBeObservable(expected$);
    });

    it('should fail and return an action with the error', () => {
      const action = new LoadProfileData();
      const error = new Error('some error');
      const outCome = new LoadProfileDataFailure(
        CustomErrorAdaptor.fromJson(error)
      );
      actions$ = hot('-a', { a: action });
      const response$ = cold('-#|', {}, error);
      profileDataServiceSpy.loadUserProfile.and.returnValue(response$);
      const expected$ = cold('--b', { b: outCome });
      expect(effect.userProfile$).toBeObservable(expected$);
    });
  });
});
