import { Injectable } from '@angular/core';
import {
  getValidateItemEndpointUrl,
  ApiService,
  getWeightToleranceEndpointUrl
} from '@poss-web/shared/util-api-service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InventoryValidationService {
  constructor(private apiService: ApiService) {}

  validateWeightTolerance(
    productGroupCode: string,
    availableWeight: number,
    measuredWeight: number,
    measuredQuantity: number,
    availableQuantity: number
  ): Observable<any> {
    const url = getWeightToleranceEndpointUrl(
      productGroupCode,
      availableWeight,
      measuredWeight,
      measuredQuantity,
      availableQuantity,
      'WEIGHT_TOLERANCE'
    );
    return this.apiService.get(url.path, url.params);
  }

  validateConversionRestriction(
    productGroupCode: string,
    availableWeight: number,
    measuredWeight: number,
    measuredQuantity: number,
    availableQuantity: number
  ): Observable<any> {
    const url = getValidateItemEndpointUrl(
      productGroupCode,
      availableWeight,
      measuredWeight,
      measuredQuantity,
      availableQuantity,
      'CONVERSION_RESTRICTION'
    );
    return this.apiService.get(url.path, url.params);
  }
}
