import { Injectable } from '@angular/core';

import { MetalTypeActions } from './metal-type.actions';
import * as MetalTypeAction from './metal-type.actions';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggerService } from '@poss-web/shared/util-logger';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';

import { MetalTypeService } from '../metal-type.service';
import {
  MetalTypeListing,
  MaterialType,
  CustomErrors,
  Lov
} from '@poss-web/shared/models';

import { map } from 'rxjs/operators';
import { DataPersistence } from '@nrwl/angular';
import { Effect } from '@ngrx/effects';
import { LovDataService } from '@poss-web/shared/masters/data-access-masters';
@Injectable()
export class MetalTypeEffect {
  constructor(
    public dataPersistence: DataPersistence<any>,
    public metalTypeService: MetalTypeService,
    private loggerService: LoggerService,
    private lovService: LovDataService
  ) {}

  @Effect()
  loadMetalTypeList$ = this.dataPersistence.fetch(
    MetalTypeActions.LOAD_METAL_TYPE_LISTING,
    {
      run: (action: MetalTypeAction.LoadMetalTypeList) => {
        return this.metalTypeService
          .getAllMetalTypeList(
            action.payload.pageIndex,
            action.payload.pageSize
          )
          .pipe(
            map(
              (metalTypeList: MetalTypeListing) =>
                new MetalTypeAction.LoadMetalTypeListSuccess(metalTypeList)
            )
          );
      },

      onError: (
        action: MetalTypeAction.LoadMetalTypeList,
        error: HttpErrorResponse
      ) => {
        return new MetalTypeAction.LoadMetalTypeListFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  searchMetalTypeList$ = this.dataPersistence.fetch(
    MetalTypeActions.SEARCH_METAL_TYPE_BY_MATERIAL_CODE,
    {
      run: (action: MetalTypeAction.SearchMetalTypeByMaterialCode) => {
        return this.metalTypeService
          .searchMetalTypeList(action.payload)
          .pipe(
            map(
              (searchResult: MetalTypeListing) =>
                new MetalTypeAction.SearchMetalTypeByMaterialCodeSuccess(
                  searchResult
                )
            )
          );
      },
      onError: (
        action: MetalTypeAction.SearchMetalTypeByMaterialCode,
        error: HttpErrorResponse
      ) => {
        return new MetalTypeAction.SearchMetalTypeByMaterialCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  createMetalType$ = this.dataPersistence.fetch(
    MetalTypeActions.CREATE_METAL_TYPE,
    {
      run: (action: MetalTypeAction.CreateMetalType) => {
        return this.metalTypeService
          .saveMetalType(action.payload)
          .pipe(map(() => new MetalTypeAction.CreateMetalTypeSuccess()));
      },
      onError: (
        action: MetalTypeAction.CreateMetalType,
        error: HttpErrorResponse
      ) => {
        return new MetalTypeAction.CreateMetalTypeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  updateMetalTypeDetail$ = this.dataPersistence.fetch(
    MetalTypeActions.UPDATE_METAL_TYPE_DETAIL,
    {
      run: (action: MetalTypeAction.UpdateMetalTypeDeatil) => {
        return this.metalTypeService
          .updateMetalTypeDetail(action.payload)
          .pipe(
            map(
              (data: MaterialType) =>
                new MetalTypeAction.UpdateMetalTypeDeatilSuccess(data)
            )
          );
      },
      onError: (
        action: MetalTypeAction.UpdateMetalTypeDeatil,
        error: HttpErrorResponse
      ) => {
        return new MetalTypeAction.UpdateMetalTypeDeatilFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadMetalTypeByMaterialCodeDetail$ = this.dataPersistence.fetch(
    MetalTypeActions.LOAD_METAL_TYPE_DETAIL_BY_MATERIAL_CODE,
    {
      run: (action: MetalTypeAction.LoadMetalTypeDetailByMaterialCode) => {
        return this.metalTypeService
          .loadMetalTypeByMaterialCode(action.payload)
          .pipe(
            map(
              (data: MaterialType) =>
                new MetalTypeAction.LoadMetalTypeDetailByMaterialCodeSuccess(
                  data
                )
            )
          );
      },
      onError: (
        action: MetalTypeAction.LoadMetalTypeDetailByMaterialCode,
        error: HttpErrorResponse
      ) => {
        return new MetalTypeAction.LoadMetalTypeDetailByMaterialCodeFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  @Effect()
  loadMaterialTypeLov$ = this.dataPersistence.fetch(
    MetalTypeActions.LOAD_MATERIAL_TYPE_LOV,
    {
      run: (action: MetalTypeAction.LoadMaterialTypeLov) => {
        return this.lovService
          .getProductLovs('MATERIALTYPE')
          .pipe(
            map(
              (data: Lov[]) =>
                new MetalTypeAction.LoadMaterialTypeLovSuccess(data)
            )
          );
      },
      onError: (
        action: MetalTypeAction.LoadMaterialTypeLov,
        error: HttpErrorResponse
      ) => {
        return new MetalTypeAction.LoadMaterialTypeLovFailure(
          this.errorHandler(error)
        );
      }
    }
  );

  errorHandler(error: HttpErrorResponse): CustomErrors {
    const customError: CustomErrors = CustomErrorAdaptor.fromJson(error);
    this.loggerService.error(customError);
    return customError;
  }
}
