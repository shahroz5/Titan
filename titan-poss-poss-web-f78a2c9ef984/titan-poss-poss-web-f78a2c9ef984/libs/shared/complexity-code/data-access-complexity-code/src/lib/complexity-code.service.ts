import { Injectable } from '@angular/core';
import { ComplexityCodeAdaptor } from '@poss-web/shared/util-adaptors';
import {
  ApiService,
  getComplexityCodeListUrl,
  getComplexityByCodeUrl,
  saveComplexityCodeUrl,
  updateComplexityCodeUrl
} from '@poss-web/shared/util-api-service';
import { ComplexityCode } from '@poss-web/shared/models';
import { map } from 'rxjs/operators';
@Injectable()
export class ComplexityCodeService {
  constructor(public apiService: ApiService) {}
  getComplexityCodeList(pageIndex: number, pageSize: number) {
    const url = getComplexityCodeListUrl(pageIndex, pageSize);
    return this.apiService
      .get(url.path, url.params)
      .pipe(map(data => ComplexityCodeAdaptor.getComplexityCodeList(data)));
  }

  getComplexityByCode(complexityCode: string) {
    const url = getComplexityByCodeUrl(complexityCode);
    return this.apiService
      .get(url)
      .pipe(map(data => ComplexityCodeAdaptor.getComplexityByCode(data)));
  }

  saveComplexityCode(complexityCode: ComplexityCode) {
    const url = saveComplexityCodeUrl();
    return this.apiService.post(url, complexityCode);
  }
  updateComplexityCode(complexityCode: ComplexityCode) {
    const url = updateComplexityCodeUrl(complexityCode.complexityCode);
    return this.apiService.patch(url, {
      description: complexityCode.description,
      isActive: complexityCode.isActive
    });
  }

  searchComplexityCode(complexityCode: string) {
    const url = getComplexityByCodeUrl(complexityCode);
    return this.apiService
      .get(url)
      .pipe(map(data => ComplexityCodeAdaptor.searchComplexityCode(data)));
  }
}
