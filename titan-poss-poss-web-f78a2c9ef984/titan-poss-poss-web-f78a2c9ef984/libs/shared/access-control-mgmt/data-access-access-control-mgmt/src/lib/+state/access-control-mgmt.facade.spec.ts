import { Store } from '@ngrx/store';
import { TestBed, inject } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { AccessControlManagementState } from './access-control-mgmt.state';
import { AccessControlManagementFacade } from './access-control-mgmt.facade';
import {
  ClearAcl,
  LoadAcl,
  LoadFeatures,
  LoadModules,
  LoadRoles,
  LoadSubModules,
  ResetError,
  UpdateAcl
} from './access-control-mgmt.actions';

describe('Access Control Management facade Testing Suite', () => {
  const initialState: AccessControlManagementState = {
    error: null,
    modules: [],
    roles: [],
    isLoading: false,
    subModules: [],
    features: [],
    acl: [],
    isACLUpdateSuccess: false
  };
  let accessControlManagementFacade: AccessControlManagementFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideMockStore({ initialState }),
        AccessControlManagementFacade
      ]
    });

    accessControlManagementFacade = TestBed.inject(
      AccessControlManagementFacade
    );
  });

  describe('Reset Error', () => {
    it('should dispatch ResetError action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ResetError();
      accessControlManagementFacade.resetError();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Load Roles', () => {
    it('should dispatch LoadRoles action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new LoadRoles();
      accessControlManagementFacade.loadRoles();
      accessControlManagementFacade.getRolesList();
      accessControlManagementFacade.getIsLoading();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('load Modules', () => {
    it('should dispatch LoadModules action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const role = 'ORG';
      const expectedAction = new LoadModules(role);
      accessControlManagementFacade.loadModules(role);
      accessControlManagementFacade.getModulesList();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('load SubModules', () => {
    it('should dispatch LoadSubModules action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const groupCode = 'GC';
      const role = 'ORG';
      const expectedAction = new LoadSubModules({ groupCode, role });
      accessControlManagementFacade.loadSubModules(groupCode, role);
      accessControlManagementFacade.getSubModulesList();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('load Features', () => {
    it('should dispatch LoadFeatures action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const groupCode = 'GC';
      const role = 'ORG';
      const expectedAction = new LoadFeatures({ groupCode, role });
      accessControlManagementFacade.loadFeatures(groupCode, role);
      accessControlManagementFacade.getFeatures();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('load ACL', () => {
    it('should dispatch LoadAcl action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const data = {
        aclGroupCode: 'U',
        roleCode: 'U'
      };
      const expectedAction = new LoadAcl(data);
      accessControlManagementFacade.loadACL(data);
      accessControlManagementFacade.getACLList();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Update ACL', () => {
    it('should dispatch UpdateAcl action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const data = {
        addedAclCodes: ['A0', 'A1'],
        removedAclCodes: [],
        roleCode: 'ORG'
      };
      const expectedAction = new UpdateAcl(data);
      accessControlManagementFacade.updateAcl(data);
      accessControlManagementFacade.getIsACLUpdateSuccess();
      accessControlManagementFacade.getError();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });

  describe('Clear ACL', () => {
    it('should dispatch ClearAcl action', inject([Store], store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ClearAcl();
      accessControlManagementFacade.clearACL();
      // accessControlManagementFacade.getIsACLUpdateSuccess();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }));
  });
});
