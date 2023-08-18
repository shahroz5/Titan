import { Store } from '@ngrx/store';
import { inject, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { AppVersionDashboardState } from './app-version-dashboard.state';
import { AppVersionDashboardFacade } from './app-version-dashboard.facade';
import {
  AddApplicationVersion,
  DeleteAppVersionById,
  GetAppVersions,
  GetAppVersionsByStatus,
  GetStatusList,
  ListAllApplicationVersions,
  PublishAllAppVersions,
  Reset
} from './app-version-dashboard.actions';
import {
  AddVersionRequestModel,
  AppVersionByStatusRequestPayload,
  AppVersionByStatusRequestPayloadWithQueryParams
} from '@poss-web/shared/models';

describe('App Version Dashboard Facade Testing Suite', () => {
  const initialState: AppVersionDashboardState = {
    isLoading: false,
    error: null,
    appVersions: null,
    possUiVersionsList: null,
    apiVersionsList: null,
    dbVersionsList: null,
    appVersionDataByStatus: null,
    totalElements: null,
    newAppVersionAdded: false,
    appVersionStatusList: null,
    appVersionsPublished: null,
    appVersionDeleted: null,
    allPossUiVersionsList: null,
    allEpossUiVersionsList: null,
    allApiVersionsList: null,
    allDbVersionsList: null
  };

  let appVersionDashboardFacade: AppVersionDashboardFacade;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideMockStore({ initialState }), AppVersionDashboardFacade]
    });

    appVersionDashboardFacade = TestBed.inject(AppVersionDashboardFacade);
  });

  it('should dispatch GetAppVersions action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new GetAppVersions();

    appVersionDashboardFacade.loadApplicationVersions();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));
  it('should dispatch ListAllApplicationVersions action', inject(
    [Store],
    store => {
      const storeSpy = spyOn(store, 'dispatch').and.callThrough();
      const expectedAction = new ListAllApplicationVersions();

      appVersionDashboardFacade.loadAllApplicationVersionsList();
      expect(storeSpy).toHaveBeenCalledWith(expectedAction);
    }
  ));
  it('should dispatch GetAppVersionsByStatus action', inject([Store], store => {
    const appVersionByStatusRequestPayload: AppVersionByStatusRequestPayload = {
      status: 'OPEN',
      location: 'CPD',
      databaseVersion: '1.0',
      epossUiVersion: '1.0',
      possServiceVersion: '1.0',
      possUiVersion: '1.0'
    };

    const appVersionByStatusRequestPayloadWithQueryParams: AppVersionByStatusRequestPayloadWithQueryParams = {
      appVersionByStatusRequestPayload: appVersionByStatusRequestPayload,
      queryParams: null
    };

    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new GetAppVersionsByStatus(
      appVersionByStatusRequestPayloadWithQueryParams
    );

    appVersionDashboardFacade.loadAllApplicationVersionsByStatus(
      appVersionByStatusRequestPayloadWithQueryParams
    );
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));
  it('should dispatch GetStatusList action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new GetStatusList();

    appVersionDashboardFacade.loadStatusList();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));
  it('should dispatch AddApplicationVersion action', inject([Store], store => {
    const addVersionRequestModel: AddVersionRequestModel = {
      databaseVersion: '1.0',
      downloadUrl: '1.0',
      locationCode: ['CPD'],
      possServiceVersion: '1.0',
      possUiVersion: '1.0'
    };

    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new AddApplicationVersion(addVersionRequestModel);

    appVersionDashboardFacade.addApplicationVersion(addVersionRequestModel);
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));
  it('should dispatch PublishAllAppVersions action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new PublishAllAppVersions();

    appVersionDashboardFacade.publishAllAppVersions();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));
  it('should dispatch DeleteAppVersionById action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new DeleteAppVersionById(1);

    appVersionDashboardFacade.deleteAppVersionById(1);
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));
  it('should dispatch Reset action', inject([Store], store => {
    const storeSpy = spyOn(store, 'dispatch').and.callThrough();
    const expectedAction = new Reset();

    appVersionDashboardFacade.resetState();
    expect(storeSpy).toHaveBeenCalledWith(expectedAction);
  }));

  it('should access getIsLoading() selector action', () => {
    expect(appVersionDashboardFacade.getIsLoading()).toEqual(
      appVersionDashboardFacade['isLoading$']
    );
  });
  it('should access getError() selector action', () => {
    expect(appVersionDashboardFacade.getError()).toEqual(
      appVersionDashboardFacade['selectError$']
    );
  });
  it('should access getAppVersionData() selector action', () => {
    expect(appVersionDashboardFacade.getAppVersionData()).toEqual(
      appVersionDashboardFacade['getAppVersionData$']
    );
  });
  it('should access getPossUiVersionsList() selector action', () => {
    expect(appVersionDashboardFacade.getPossUiVersionsList()).toEqual(
      appVersionDashboardFacade['possUiVersionsList$']
    );
  });
  it('should access getApiVersionsList() selector action', () => {
    expect(appVersionDashboardFacade.getApiVersionsList()).toEqual(
      appVersionDashboardFacade['apiVersionsList$']
    );
  });
  it('should access getDbVersionsList() selector action', () => {
    expect(appVersionDashboardFacade.getDbVersionsList()).toEqual(
      appVersionDashboardFacade['dbVersionsList$']
    );
  });
  it('should access getAppVersionDataByStatus() selector action', () => {
    expect(appVersionDashboardFacade.getAppVersionDataByStatus()).toEqual(
      appVersionDashboardFacade['appVersionDataByStatus$']
    );
  });
  it('should access getAppVersionListCount() selector action', () => {
    expect(appVersionDashboardFacade.getAppVersionListCount()).toEqual(
      appVersionDashboardFacade['appVersionListCount$']
    );
  });
  it('should access getIsNewAppVersionAdded() selector action', () => {
    expect(appVersionDashboardFacade.getIsNewAppVersionAdded()).toEqual(
      appVersionDashboardFacade['isNewAppVersionAdded$']
    );
  });
  it('should access getAppVersionStatusList() selector action', () => {
    expect(appVersionDashboardFacade.getAppVersionStatusList()).toEqual(
      appVersionDashboardFacade['appVersionStatusList$']
    );
  });
  it('should access getIsAppVersionsPublished() selector action', () => {
    expect(appVersionDashboardFacade.getIsAppVersionsPublished()).toEqual(
      appVersionDashboardFacade['isAppVersionsPublished$']
    );
  });
  it('should access getIsAppVersionDeleted() selector action', () => {
    expect(appVersionDashboardFacade.getIsAppVersionDeleted()).toEqual(
      appVersionDashboardFacade['isAppVersionDeleted$']
    );
  });
  it('should access getAllPossUiVersionsList() selector action', () => {
    expect(appVersionDashboardFacade.getAllPossUiVersionsList()).toEqual(
      appVersionDashboardFacade['allPossUiVersionsList$']
    );
  });
  it('should access getAllApiVersionsList() selector action', () => {
    expect(appVersionDashboardFacade.getAllApiVersionsList()).toEqual(
      appVersionDashboardFacade['allApiVersionsList$']
    );
  });
  it('should access getAllDbVersionsList() selector action', () => {
    expect(appVersionDashboardFacade.getAllDbVersionsList()).toEqual(
      appVersionDashboardFacade['allDbVersionsList$']
    );
  });
});
