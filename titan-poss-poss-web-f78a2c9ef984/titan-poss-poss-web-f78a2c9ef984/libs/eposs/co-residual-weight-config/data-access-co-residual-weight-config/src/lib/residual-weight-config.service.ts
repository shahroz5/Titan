import { Injectable } from '@angular/core';
import {
  ApiService,
  getConfigurationListUrl,
  getUpdateConfigurationUrl,
  getSaveConfigurationUrl,
  getSearchConfigByConfigNameUrl,
  getResidualWeightRangeUrl,
  getRangeMappingRulesUrl,
  geResidualRangeMappingRulesUrl
} from '@poss-web/shared/util-api-service';
import { ResidualCoWeightConfigAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ResidualWeightConfigResponse,
  RangeConfigRequest,
  LoadResidualToleranceByConfigidPayload,
  ResidualWeightToleranceResponse
} from '@poss-web/shared/models';
import { map, concatMap } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ResidualWeightConfigService {
  constructor(private apiService: ApiService) {}

  getResidualWeightConfigList(
    pageIndex: number,
    pageSize: number,
    description?: string
  ) {
    const url = getConfigurationListUrl(pageIndex, pageSize);
    return this.apiService
      .post(
        url.path,
        {
          description: description ? description : null,
          ruleType: 'ORDER_CO_RESIDUAL_TOLERANCE_CONFIG'
        },
        url.params
      )
      .pipe(
        map(data =>
          ResidualCoWeightConfigAdaptor.getResidualWeightConfigListData(data)
        )
      );
  }

  searchConfigByConfigName(configName: string) {
    const url = getSearchConfigByConfigNameUrl();
    return this.apiService
      .post(url, {
        description: configName,
        ruleType: 'ORDER_CO_RESIDUAL_TOLERANCE_CONFIG'
      })
      .pipe(
        map(data =>
          ResidualCoWeightConfigAdaptor.getResidualWeightConfigListData(data)
        )
      );
  }
  saveResidualWeightConfig(configDetails, payload: RangeConfigRequest) {
    const saveUrl = getSaveConfigurationUrl(
      'ORDER_CO_RESIDUAL_TOLERANCE_CONFIG'
    );
    // return this.apiService
    //   .post(saveUrl, payload)
    //   .pipe(
    //     map(data =>
    //       ResidualWeightConfigAdaptor.getResidualWeightConfiguration(data)
    //     )
    //   );
    return this.apiService
      .post(saveUrl, configDetails)
      .pipe(map(details => details))
      .pipe(
        concatMap(configs => {
          return this.apiService
            .patch(
              getRangeMappingRulesUrl(
                configs.ruleId,
                'ORDER_CO_RESIDUAL_TOLERANCE_CONFIG'
              ),
              payload
            )
            .pipe(map(data => data.ruleId));
        })
      );
  }
  updateResidualWeightConfig(payload: ResidualWeightConfigResponse) {
    const url = getUpdateConfigurationUrl(
      payload.ruleId.toString(),
      'ORDER_CO_RESIDUAL_TOLERANCE_CONFIG'
    );
    return this.apiService
      .patch(url, payload)
      .pipe(
        map(data =>
          ResidualCoWeightConfigAdaptor.getResidualWeightConfiguration(data)
        )
      );
  }

  loadRangeWeight() {
    const url = getResidualWeightRangeUrl();
    return this.apiService
      .get(url.path, url.params)
      .pipe(
        map(data => ResidualCoWeightConfigAdaptor.getResidualRangeWeight(data))
      );
  }
  selectedConfigDetails(configId: string): any {
    // return of({
    //   description: 'test',
    //   isActive: true,
    //   ruleDetails: {},
    //   ruleId: 6,
    //   ruleType: 'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG'
    // });
    const url = getUpdateConfigurationUrl(
      configId,
      'ORDER_CO_RESIDUAL_TOLERANCE_CONFIG'
    );
    return this.apiService
      .get(url)
      .pipe(
        map(data =>
          ResidualCoWeightConfigAdaptor.getResidualWeightConfiguration(data)
        )
      );
  }

  getRangeMapping(
    payload: LoadResidualToleranceByConfigidPayload
  ): Observable<ResidualWeightToleranceResponse> {
    // return of({
    //   ruleId: 6,
    //   ruleType: 'ORDER_AB_RESIDUAL_TOLERANCE_CONFIG',
    //   rules: [
    //     {
    //       id: '18AD3368-5130-4E32-9E88-2EBABA9A7E86',
    //       rangeId: '6609D6E8-213F-4054-AF2A-9B0015FFA310',
    //       ruleDetails: {
    //         type: 'ORDER_AB_TOLERANCE_CONFIG',
    //         data: {
    //           configPercent: 0.243,
    //           configValue: null,
    //           metalType: 'GOLD'
    //         }
    //       }
    //     },
    //     {
    //       id: '2BB2A6F1-D1EB-4DC8-83AA-4DD42897168D',
    //       rangeId: '7F2C7ADA-5C57-47CB-848B-659DDEA24810',
    //       ruleDetails: {
    //         type: 'ORDER_AB_TOLERANCE_CONFIG',
    //         data: {
    //           configPercent: 0.03,
    //           configValue: null,
    //           metalType: 'GOLD'
    //         }
    //       }
    //     }
    //   ]
    // });

    const url = geResidualRangeMappingRulesUrl(
      payload,
      'ORDER_CO_RESIDUAL_TOLERANCE_CONFIG'
    );
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => ResidualCoWeightConfigAdaptor.getRangeMapping(data)));
  }

  UpdateRangeMapping(
    configId: string,
    weightToleranceRequest: RangeConfigRequest
  ) {
    const url = getRangeMappingRulesUrl(
      configId,
      'ORDER_CO_RESIDUAL_TOLERANCE_CONFIG'
    );

    return this.apiService
      .patch(url, weightToleranceRequest)
      .pipe(map(data => ResidualCoWeightConfigAdaptor.getRangeMapping(data)));
  }
}
// }
