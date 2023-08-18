import { inject, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { provideMockStore } from '@ngrx/store/testing';
import { AclUrlPermissionRequestBody } from '@poss-web/shared/models';
import {
  LoadElementPermissionsForUrl,
  LoadUrlPermissions,
  LoadUrlSuggestion
} from './permission.actions';
import { PermissionFacade } from './permission.facade';
import { PermissionState } from './permission.state';

describe('ACL Permission facade Testing Suite', () => {
  const initialState: PermissionState = {
    urls: null,
    elements: [],
    allowedRoutes: null,
    error: null,
    isLoading: null
  };

  let permissionFacade: PermissionFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), PermissionFacade]
    });

    permissionFacade = TestBed.inject(PermissionFacade);
  });

  describe('Load Url level Permissions', () => {
    it('should dispatch LoadUrlPermissions action', inject([Store], store => {
      const requestBody: AclUrlPermissionRequestBody = {
        urls: ['/inventory/home']
      };

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadUrlPermissions(requestBody);
      permissionFacade.loadUrlLevelPermissions(requestBody);
      permissionFacade.getPermissionforURL();
      permissionFacade.isLoading();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Load Element Permissions for Url', () => {
    it('should dispatch LoadElementPermissionsForUrl action', inject(
      [Store],
      store => {
        const url = 'inventory/home';

        const storeSpy = spyOn(store, 'dispatch').and.callThrough();
        const expectedAction = new LoadElementPermissionsForUrl(url);
        permissionFacade.loadElementLevelPermissionForURL(url);
        permissionFacade.getURLPermission();
        expect(storeSpy).toHaveBeenCalledWith(expectedAction);
      }
    ));
  });

  describe('Load Allowed Routes for the mapping Url', () => {
    it('should dispatch LoadUrlSuggestion action', inject([Store], store => {
      const url = 'inventory/home';

      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadUrlSuggestion(url);
      permissionFacade.loadUrlSuggestion(url);
      permissionFacade.getAllowedRoutes();
      permissionFacade.getError();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
