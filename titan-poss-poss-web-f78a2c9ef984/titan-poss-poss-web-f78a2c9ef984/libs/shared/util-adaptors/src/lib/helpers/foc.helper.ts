import {
  PendingCMResponsePayload,
  FocItemDetailsResponsePayload,
  AvailableSchemesPayload,
  FocSchemeDetailsDto,
  AddFocToCmResponsePayload,
  PendingFocSchemesPayload,
  PendingFocSchemesResponsePayload,
  ABFocSchemeDetailsDto
} from '@poss-web/shared/models';
import { FocAdaptor } from '../foc/foc.adaptor';

export class FocHelper {
  static getPendingCM(data: any): PendingCMResponsePayload[] {
    const response: PendingCMResponsePayload[] = [];
    for (const cm of data.results) {
      response.push(FocAdaptor.pendingCm(cm));
    }
    return response;
  }

  static getFOCItemsDetails(data: any): FocItemDetailsResponsePayload[] {
    const response: FocItemDetailsResponsePayload[] = [];
    for (const details of data) {
      response.push(FocAdaptor.focItemDetails(details));
    }
    return response;
  }

  static getFocConfiguredSchemes(data: any): AvailableSchemesPayload[] {
    const response: AvailableSchemesPayload[] = [];
    for (const details of data) {
      response.push(FocAdaptor.availableSchemesFromJson(details));
    }
    return response;
  }

  static getFOCSchemesAndItemsFromJson(data: any): FocSchemeDetailsDto[] {
    const response: FocSchemeDetailsDto[] = [];
    for (const details of data) {
      response.push(FocAdaptor.focSchemesAndItemsFromJson(details));
    }
    return response;
  }

  static getFocListAddedtoCmFromJson(data: any): AddFocToCmResponsePayload[] {
    const payload: AddFocToCmResponsePayload[] = [];
    for (const response of data) {
      payload.push(FocAdaptor.focItemListAddedtoCmFromJson(response));
    }
    return payload;
  }

  static getPendingFocResponseFormJson(
    data: any
  ): PendingFocSchemesResponsePayload {
    const payload: PendingFocSchemesPayload[] = [];
    for (const response of data.focSchemes) {
      payload.push(FocAdaptor.pendingFocResponseFromJson(response));
    }
    return { focSchemes: payload };
  }

  static getABFOCSchemesDetailsFromJson(data: any): ABFocSchemeDetailsDto[] {
    const response: ABFocSchemeDetailsDto[] = [];
    for (const details of data) {
      response.push(FocAdaptor.ABfocSchemesDetailssFromJson(details));
    }
    return response;
  }
}
