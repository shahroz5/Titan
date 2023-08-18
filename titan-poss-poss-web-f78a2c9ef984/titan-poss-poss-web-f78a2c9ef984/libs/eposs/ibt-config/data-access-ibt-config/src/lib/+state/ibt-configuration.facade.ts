import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { IbtConfigurationState } from './ibt-configuration.state';
import * as IbtConfigurationActions from './ibt-configuration.actions';
import { ibtConfigurationSelectors } from './ibt-configuration.selectors';
import {
  IbtConfigurationListPayload,
  IbtConfiguration
} from '@poss-web/shared/models';

@Injectable()
export class IbtConfigurationFacade {
  constructor(public store: Store<IbtConfigurationState>) {}

  private ibtConfigList$ = this.store.select(
    ibtConfigurationSelectors.selectIbtConfigList
  );
  private ibtConfiguration$ = this.store.select(
    ibtConfigurationSelectors.selectIbtConfig
  );

  private error$ = this.store.select(ibtConfigurationSelectors.selectError);
  private hasSaved$ = this.store.select(
    ibtConfigurationSelectors.selectHassaved
  );
  private hasUpdated$ = this.store.select(
    ibtConfigurationSelectors.selectHasUpdated
  );
  private isLoading$ = this.store.select(
    ibtConfigurationSelectors.selectIsLoading
  );
  private totalElements$ = this.store.select(
    ibtConfigurationSelectors.selectTotalElement
  );

  getError() {
    return this.error$;
  }

  getIsloading() {
    return this.isLoading$;
  }
  getHasSaved() {
    return this.hasSaved$;
  }
  getHasUpdated() {
    return this.hasUpdated$;
  }
  getTotalElement() {
    return this.totalElements$;
  }
  getIbtConfiguration() {
    return this.ibtConfiguration$;
  }
  getIbtConfigurationList() {
    return this.ibtConfigList$;
  }

  loadIbtConfigurationList(
    ibtConfigurationListPayload: IbtConfigurationListPayload
  ) {
    this.store.dispatch(
      new IbtConfigurationActions.LoadIbtConfigurationList(
        ibtConfigurationListPayload
      )
    );
  }

  saveIbtConfiguration(ibtConfiguration: IbtConfiguration) {
    this.store.dispatch(
      new IbtConfigurationActions.SaveIbtConfiguration(ibtConfiguration)
    );
  }
  loadIbtConfigurationByConfigId(configId: string) {
    this.store.dispatch(
      new IbtConfigurationActions.LoadIbtConfigurationByConfigId(configId)
    );
  }

  loadNewIbtConfigurationByConfigId() {
    this.store.dispatch(
      new IbtConfigurationActions.LoadNewIbtConfigurationByConfigId()
    );
  }

  updateIbtConfiguration(updateIbtConfiguration: IbtConfiguration) {
    this.store.dispatch(
      new IbtConfigurationActions.UpdateIbtConfiguration(updateIbtConfiguration)
    );
  }

  searchConfig(configName: string) {
    this.store.dispatch(
      new IbtConfigurationActions.SearchConfigByConfigName(configName)
    );
  }
  clearSearch() {
    this.store.dispatch(new IbtConfigurationActions.ClearSearch());
  }
  loadReset() {
    this.store.dispatch(new IbtConfigurationActions.LoadReset());
  }
}
