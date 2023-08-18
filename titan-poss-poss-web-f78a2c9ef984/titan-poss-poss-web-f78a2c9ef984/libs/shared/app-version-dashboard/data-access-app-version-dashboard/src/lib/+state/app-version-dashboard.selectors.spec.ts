import {
  AllAppVersionsList,
  AppVersionDataByStatusResponse,
  AppVersionsList,
  CustomErrors,
  SelectDropDownOption
} from '@poss-web/shared/models';
import { initialState } from './app-version-dashboard.reducer';
import { AppVersionDashboardState } from './app-version-dashboard.state';
import * as selectors from './app-version-dashboard.selectors';

describe('App Version Dashboard Selector Testing Suite', () => {
  it('Testing isLoading selector', () => {
    const state: AppVersionDashboardState = {
      ...initialState,
      isLoading: true
    };
    expect(
      selectors.AppVersionDashboardSelectors.isLoading.projector(state)
    ).toEqual(true);
  });
  it('Testing selectError selector', () => {
    const error: Error = {
      name: 'Name',
      message: 'error message',
      stack: 'stack'
    };
    const customErrors: CustomErrors = {
      code: 'EC2',
      message: 'error occured',
      traceId: 'abcdefghijk',
      timeStamp: '',
      error: error
    };

    const state: AppVersionDashboardState = {
      ...initialState,
      error: customErrors
    };
    expect(
      selectors.AppVersionDashboardSelectors.selectError.projector(state)
    ).toEqual(customErrors);
  });
  it('Testing appVersions selector', () => {
    const responsePayload: AppVersionsList = {
      appVersionData: [
        {
          databaseVersion: '1.0',

          possServiceVersion: '1.0',
          possUiVersion: '1.0'
        }
      ],
      possUiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      apiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      dbVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ]
    };

    const state: AppVersionDashboardState = {
      ...initialState,
      appVersions: responsePayload.appVersionData
    };
    expect(
      selectors.AppVersionDashboardSelectors.appVersions.projector(state)
    ).toEqual(responsePayload.appVersionData);
  });
  it('Testing possUiVersionsList selector', () => {
    const responsePayload: AppVersionsList = {
      appVersionData: [
        {
          databaseVersion: '1.0',

          possServiceVersion: '1.0',
          possUiVersion: '1.0'
        }
      ],
      possUiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      apiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      dbVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ]
    };

    const state: AppVersionDashboardState = {
      ...initialState,
      possUiVersionsList: responsePayload.possUiVersionsList
    };
    expect(
      selectors.AppVersionDashboardSelectors.possUiVersionsList.projector(state)
    ).toEqual(responsePayload.possUiVersionsList);
  });
  it('Testing apiVersionsList selector', () => {
    const responsePayload: AppVersionsList = {
      appVersionData: [
        {
          databaseVersion: '1.0',

          possServiceVersion: '1.0',
          possUiVersion: '1.0'
        }
      ],
      possUiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      apiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      dbVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ]
    };

    const state: AppVersionDashboardState = {
      ...initialState,
      apiVersionsList: responsePayload.apiVersionsList
    };
    expect(
      selectors.AppVersionDashboardSelectors.apiVersionsList.projector(state)
    ).toEqual(responsePayload.apiVersionsList);
  });
  it('Testing dbVersionsList selector', () => {
    const responsePayload: AppVersionsList = {
      appVersionData: [
        {
          databaseVersion: '1.0',

          possServiceVersion: '1.0',
          possUiVersion: '1.0'
        }
      ],
      possUiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      apiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      dbVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ]
    };

    const state: AppVersionDashboardState = {
      ...initialState,
      dbVersionsList: responsePayload.dbVersionsList
    };
    expect(
      selectors.AppVersionDashboardSelectors.dbVersionsList.projector(state)
    ).toEqual(responsePayload.dbVersionsList);
  });
  it('Testing appVersionDataByStatus selector', () => {
    const responsePayload: AppVersionDataByStatusResponse = {
      appVersionDataByStatus: [
        {
          databaseVersion: '1.0',
          downloadUrl: null,
          id: '1',
          locationCode: 'CPD',
          possServiceVersion: '1.0',
          possUiVersion: '1.0',
          status: 'OPEN',
          published: true
        }
      ],
      count: 1
    };

    const state: AppVersionDashboardState = {
      ...initialState,
      appVersionDataByStatus: responsePayload.appVersionDataByStatus
    };
    expect(
      selectors.AppVersionDashboardSelectors.appVersionDataByStatus.projector(
        state
      )
    ).toEqual(responsePayload.appVersionDataByStatus);
  });
  it('Testing appVersionListCount selector', () => {
    const responsePayload: AppVersionDataByStatusResponse = {
      appVersionDataByStatus: [
        {
          databaseVersion: '1.0',
          downloadUrl: null,
          id: '1',
          locationCode: 'CPD',
          possServiceVersion: '1.0',
          possUiVersion: '1.0',
          status: 'OPEN',
          published: true
        }
      ],
      count: 1
    };

    const state: AppVersionDashboardState = {
      ...initialState,
      totalElements: responsePayload.count
    };
    expect(
      selectors.AppVersionDashboardSelectors.appVersionListCount.projector(
        state
      )
    ).toEqual(responsePayload.count);
  });
  it('Testing isNewAppVersionAdded selector', () => {
    const state: AppVersionDashboardState = {
      ...initialState,
      newAppVersionAdded: true
    };
    expect(
      selectors.AppVersionDashboardSelectors.isNewAppVersionAdded.projector(
        state
      )
    ).toEqual(true);
  });
  it('Testing appVersionStatusList selector', () => {
    const responsePayload: SelectDropDownOption[] = [
      {
        value: '1.0',
        description: '1.0'
      }
    ];
    const state: AppVersionDashboardState = {
      ...initialState,
      appVersionStatusList: responsePayload
    };
    expect(
      selectors.AppVersionDashboardSelectors.appVersionStatusList.projector(
        state
      )
    ).toEqual(responsePayload);
  });
  it('Testing isAppVersionsPublished selector', () => {
    const state: AppVersionDashboardState = {
      ...initialState,
      appVersionsPublished: true
    };
    expect(
      selectors.AppVersionDashboardSelectors.isAppVersionsPublished.projector(
        state
      )
    ).toEqual(true);
  });
  it('Testing isAppVersionDeleted selector', () => {
    const state: AppVersionDashboardState = {
      ...initialState,
      appVersionDeleted: true
    };
    expect(
      selectors.AppVersionDashboardSelectors.isAppVersionDeleted.projector(
        state
      )
    ).toEqual(true);
  });
  it('Testing allPossUiVersionsList selector', () => {
    const responsePayload: AllAppVersionsList = {
      allPossUiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      allEpossUiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      allApiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      allDbVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ]
    };
    const state: AppVersionDashboardState = {
      ...initialState,
      allPossUiVersionsList: responsePayload.allPossUiVersionsList
    };
    expect(
      selectors.AppVersionDashboardSelectors.allPossUiVersionsList.projector(
        state
      )
    ).toEqual(responsePayload.allPossUiVersionsList);
  });
  it('Testing allEpossUiVersionsList selector', () => {
    const responsePayload: AllAppVersionsList = {
      allPossUiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      allEpossUiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      allApiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      allDbVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ]
    };
    const state: AppVersionDashboardState = {
      ...initialState,
      allEpossUiVersionsList: responsePayload.allEpossUiVersionsList
    };
    expect(
      selectors.AppVersionDashboardSelectors.allEpossUiVersionsList.projector(
        state
      )
    ).toEqual(responsePayload.allEpossUiVersionsList);
  });
  it('Testing allApiVersionsList selector', () => {
    const responsePayload: AllAppVersionsList = {
      allPossUiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      allEpossUiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      allApiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      allDbVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ]
    };
    const state: AppVersionDashboardState = {
      ...initialState,
      allApiVersionsList: responsePayload.allApiVersionsList
    };
    expect(
      selectors.AppVersionDashboardSelectors.allApiVersionsList.projector(state)
    ).toEqual(responsePayload.allApiVersionsList);
  });
  it('Testing allDbVersionsList selector', () => {
    const responsePayload: AllAppVersionsList = {
      allPossUiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      allEpossUiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      allApiVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ],
      allDbVersionsList: [
        {
          value: '1.0',
          description: '1.0'
        }
      ]
    };
    const state: AppVersionDashboardState = {
      ...initialState,
      allDbVersionsList: responsePayload.allDbVersionsList
    };
    expect(
      selectors.AppVersionDashboardSelectors.allDbVersionsList.projector(state)
    ).toEqual(responsePayload.allDbVersionsList);
  });
});
