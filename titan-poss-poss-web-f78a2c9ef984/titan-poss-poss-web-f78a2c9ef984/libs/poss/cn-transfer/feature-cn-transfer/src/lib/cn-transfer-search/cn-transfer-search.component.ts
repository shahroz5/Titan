import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import * as moment from 'moment';
import { Router } from '@angular/router';

import { ToolbarFacade } from '@poss-web/shared/toolbar/data-access-toolbar';
import {
  ToolbarConfig,
  LocationSummaryList,
  CnTransferSearchResult,
  OverlayNotificationEventRef,
  OverlayNotificationType,
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  CNStatusEnum,
  CNSearchEnum,
  LegacyCNTransferPayload,
  LegacyOutwardTransferResponsePayload,
  LegacyInwardTransferResponsePayload
} from '@poss-web/shared/models';
import {
  SelectionDailogOption,
  SelectionDialogService
} from '@poss-web/shared/components/ui-selection-dialog';
import { getCreditNoteTransferSearchDetailsUrl } from '@poss-web/shared/util-site-routes';
import { FieldValidatorsService, fieldValidation } from '@poss-web/shared/util-field-validators';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { LocationSettingsFacade } from '@poss-web/shared/location-settings/data-access-location-settings';
import { SharedBodEodFacade } from '@poss-web/shared/bod-eod/data-access-bod-eod';
import { PermissionFacade } from '@poss-web/shared/permission/data-access-permission';
import { ProfileDataFacade } from '@poss-web/shared/profile/data-access-profile';
import { CreditNoteTransferFacade } from '@poss-web/poss/cn-transfer/data-access-cn-transfer';
@Component({
  selector: 'poss-web-cn-transfer-search',
  templateUrl: './cn-transfer-search.component.html'
})
export class CnTransferSearchComponent implements OnInit, OnDestroy {
  toolbarData: ToolbarConfig = {
    txnType: null,
    subTxnType: null,
    loadMetalPrices: true,
    loadHoldPopup: false,
    loadOpenOrdersPopup: false
  };

  searchFormGroup: FormGroup;
  locationForSelection: SelectionDailogOption[] = [];
  selectedLocationDetails: SelectionDailogOption;
  selectedDestiLocationDetails: SelectionDailogOption;
  currentYear = moment().year();
  cnSearchResults: CnTransferSearchResult[];
  cnSearchResultsCount$: Observable<number>;
  isLoading$: Observable<boolean>;
  currentFiscalYear: string;
  locationCode = '';
  locationDesc = '';

  destroy$: Subject<null> = new Subject<null>();
  cnSearchEnumRef = CNSearchEnum;
  srcLocationText: string;
  destLocationText: string;
  CNNumText: string;
  permission$: Observable<any[]>;

  //#region 'resource file literla keys/field names
  readonly CNOpenStatusMsgKey: string = 'pw.creditNote.CNOpenStatusMsg';
  readonly CreditNoteNotAvaibleMsgKey: string =
    'pw.creditNote.CreditNoteNotAvaibleMsg';
  readonly selectSourceLocationLabelKey: string =
    'pw.creditNote.selectSourceLocationLabel';
  readonly OutwardingTransferSuccessMsgKey: string =
    'pw.creditNote.OutwardingTransferSuccessMsg';
  readonly InwardingTransferSuccessMsgKey: string =
    'pw.creditNote.InwardingTransferSuccessMsg';
  readonly CNStatusSimpleMsgKey: string = 'pw.creditNote.CNStatusSimpleMsg';
  readonly searchByLocationPlaceHolderKey: string =
    'pw.creditNote.searchByLocationPlaceHolder';
  readonly selectDestinationLocationLabelKey: string =
    'pw.creditNote.selectDestinationLocationLabel';
  readonly srcLocationTextKey: string = 'pw.creditNote.srcLocationText';
  readonly destLocationTextKey: string = 'pw.creditNote.destLocationText';
  readonly CNNumberLabelKey: string = 'pw.creditNote.cnNumberLabel';
  readonly CNWithEGHSNotificationMsgKey: string =
    'pw.creditNote.CNWithEGHSNotificationMsg';
  readonly srcLocationField: string = 'srcLocation';
  readonly destLocationField: string = 'destinationLocation';
  readonly transferModeField: string = 'transferMode';
  readonly CNNumField: string = 'cnNumber';
  readonly fiscalYearField: string = 'fiscalYear';
  //#endregion

  constructor(
    private fieldValidatorsService: FieldValidatorsService,
    private toolbarFacade: ToolbarFacade,
    private translate: TranslateService,
    private dialog: MatDialog,
    private router: Router,
    private appSettingFacade: AppsettingFacade,
    private selectionDialog: SelectionDialogService,
    private cnTransferFacade: CreditNoteTransferFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private locationSettingsFacade: LocationSettingsFacade,
    private bodeodFacade: SharedBodEodFacade,
    private profileDataFacade: ProfileDataFacade,
    private permissionfacade: PermissionFacade
  ) {
    this.translate
      .get([
        this.srcLocationTextKey,
        this.destLocationTextKey,
        this.CNNumberLabelKey
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        (this.srcLocationText = translatedMessages[this.srcLocationTextKey])
          (this.destLocationText =
            translatedMessages[this.destLocationTextKey]),
          (this.CNNumText = translatedMessages[this.CNNumberLabelKey]);
      });
  }

  ngOnInit(): void {
    this.bodeodFacade.loadLatestBusinessDay();
    this.cnTransferFacade.resetSearch();
    this.toolbarFacade.setToolbarConfig(this.toolbarData);
    this.cnTransferFacade.loadLocationCodes();
    this.isLoading$ = this.cnTransferFacade.getIsLoading();
    this.permission$ = this.permissionfacade.getPermissionforURL();
    this.profileDataFacade
      .getBoutiqueCode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.locationCode = data;
      });
    this.profileDataFacade
      .getBoutiqueDesc()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.locationDesc = data;
      });
    this.createForm();
    this.resetLocation(this.srcLocationField, this.destLocationField);
    this.selectedDestiLocationDetails = this.defaultLocation();
    this.bodeodFacade
      .getFiscalYear()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fiscalYear: number) => {
        if (fiscalYear) {
          this.currentFiscalYear = fiscalYear.toString();
        }
      });
    this.cnTransferFacade
      .getLocationCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((locations: LocationSummaryList[]) => {
        if (locations) {
          this.locationForSelection = locations.map(location => ({
            id: location.locationCode,
            description: location.locationCode + ' - ' + location.description,
            additionalProperty: location.isMigrated
          }));
        }
      });
    this.cnTransferFacade
      .getCreditNoteSearchResult()
      .pipe(takeUntil(this.destroy$))
      .subscribe((results: CnTransferSearchResult[]) => {
        if (results?.some(x => x.status !== CNStatusEnum.OPEN)) {
          this.cnSearchResults = [];
          this.translate
            .get(this.CNOpenStatusMsgKey, {
              docNo: results[0].docNo,
              status: results[0].status
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(translatedMsg => {
              this.messageNotification(
                translatedMsg,
                OverlayNotificationType.SIMPLE
              );
            });
        } else if (results?.some(x => x.isPaymentForEGHS)) {
          this.cnSearchResults = [];
          this.translate
            .get(this.CNWithEGHSNotificationMsgKey)
            .pipe(takeUntil(this.destroy$))
            .subscribe(translatedMsg => {
              this.messageNotification(
                translatedMsg,
                OverlayNotificationType.SIMPLE
              );
            });
        } else if (results.length < 1 && this.searchFormGroup.valid) {
          this.cnSearchResults = [];
          this.translate
            .get(this.CreditNoteNotAvaibleMsgKey)
            .pipe(takeUntil(this.destroy$))
            .subscribe(translatedMsg => {
              this.messageNotification(
                translatedMsg,
                OverlayNotificationType.SIMPLE
              );
            });
        } else {
          this.cnSearchResults = results;
        }
      });
    this.cnSearchResultsCount$ = this.cnTransferFacade.getCreditNoteSearchResultCount();
    this.cnTransferFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });
    this.cnTransferFacade
      .getLegacyOutwardTransferResponsePayload()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: LegacyOutwardTransferResponsePayload) => {
        if (response?.status) {
          this.translate
            .get(this.OutwardingTransferSuccessMsgKey, {
              destiLocation: this.searchFormGroup.get(this.destLocationField)
                .value
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(translatedMsg => {
              this.messageNotification(
                translatedMsg,
                OverlayNotificationType.SUCCESS
              );
            });
        } else if (response?.errorMessage) {
          this.messageNotification(
            response?.errorMessage,
            OverlayNotificationType.SIMPLE
          );
        }
      });
    this.cnTransferFacade
      .getLegacyInwardTransferResponsePayload()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: LegacyInwardTransferResponsePayload) => {
        if (response?.docNo) {
          this.translate
            .get(this.InwardingTransferSuccessMsgKey, {
              destiLocation: this.searchFormGroup.get(this.destLocationField)
                .value,
              docNo: response.docNo
            })
            .pipe(takeUntil(this.destroy$))
            .subscribe(translatedMsg => {
              this.messageNotification(
                translatedMsg,
                OverlayNotificationType.SUCCESS
              );
            });
        }
      });
  }
  //fiscal year logic todo
  createForm() {
    this.searchFormGroup = new FormGroup({
      transferMode: new FormControl(this.cnSearchEnumRef.CN_INWARDING, []),
      srcLocation: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.srcLocationText)
      ]),
      destinationLocation: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.destLocationText)
      ]),
      cnNumber: new FormControl('', [
        this.fieldValidatorsService.requiredField(this.CNNumText),
        this.fieldValidatorsService.numbersField(this.CNNumText)
      ]),
      fiscalYear: new FormControl('', [
        // this.fieldValidatorsService.requiredField('Fiscal Year'),
        // this.fieldValidatorsService.numbersField('Fiscal Year'),
        // this.fieldValidatorsService.maxLength(4, 'Fiscal Year'),
        // this.fieldValidatorsService.minLength(4, 'Fiscal Year'),
        // this.fieldValidatorsService.max(this.currentYear, 'Fiscal Year')
      ])
    });
  }

  search() {
    const searchValue = this.searchFormGroup.get(this.CNNumField).value;
    if (searchValue !== '') {
      if (this.validateSearch(searchValue)) {
        this.cnTransferFacade.loadSearchResulut({
          docNo: this.searchFormGroup.get(this.CNNumField).value,
          fiscalYear: this.searchFormGroup.get(this.fiscalYearField).value,
          srcBtqCode: this.searchFormGroup.get(this.srcLocationField).value
        });
      } else {
        this.cnTransferFacade.resetSearch();
      }
    } else {
      this.cnTransferFacade.resetSearch();
    }
  }
  validateSearch(searchValue: string): boolean {
    return fieldValidation.requestNumberField.pattern.test(searchValue);
  }
  loadDetails($event: CnTransferSearchResult) {
    if ($event.status === CNStatusEnum.OPEN) {
      if (
        this.searchFormGroup.get(this.transferModeField).value ===
        this.cnSearchEnumRef.CN_INWARDING
      ) {
        if (this.selectedLocationDetails.additionalProperty) {
          this.router.navigate([
            getCreditNoteTransferSearchDetailsUrl(
              $event.locationCode,
              $event.id
            )
          ]);
        } else {
          let payload = new Object() as LegacyCNTransferPayload;
          payload.id = $event.id;
          payload.locationCode = this.searchFormGroup.get(
            this.srcLocationField
          ).value;
          this.cnTransferFacade.LegacyCNInwardTransfer(payload);
        }
      } else if (
        this.searchFormGroup.get(this.transferModeField).value ===
        this.cnSearchEnumRef.CN_OUTWARDING
      ) {
        let payload = new Object() as LegacyCNTransferPayload;
        payload.id = $event.id;
        payload.locationCode = this.searchFormGroup.get(
          this.destLocationField
        ).value;
        this.cnTransferFacade.LegacyCNOutwardTransfer(payload);
      }
    } else {
      this.translate
        .get(this.CNStatusSimpleMsgKey)
        .pipe(takeUntil(this.destroy$))
        .subscribe(translatedMsg => {
          this.messageNotification(
            translatedMsg,
            OverlayNotificationType.SIMPLE
          );
        });
    }
  }
  // switching among radio buttons
  onSelectTransferMode() {
    if (
      this.searchFormGroup.get(this.transferModeField).value ===
      this.cnSearchEnumRef.CN_INWARDING
    ) {
      this.cnTransferFacade.loadLocationCodes();
      this.resetLocation(this.srcLocationField, this.destLocationField);
      this.selectedLocationDetails = null;
      this.selectedDestiLocationDetails = this.defaultLocation();
    } else if (
      this.searchFormGroup.get(this.transferModeField).value ===
      this.cnSearchEnumRef.CN_OUTWARDING
    ) {
      this.cnTransferFacade.loadLegacyLocationCodes();
      this.resetLocation(this.destLocationField, this.srcLocationField);
      this.selectedDestiLocationDetails = null;
      this.selectedLocationDetails = this.defaultLocation();
    }
  }
  resetFrom(control: AbstractControl) {
    this.searchFormGroup.get(this.CNNumField).reset();
    control.reset();
    this.cnTransferFacade.resetSearch();
  }
  resetLocation(firstLocField: string, secLocField: string) {
    this.resetFrom(this.searchFormGroup.get(firstLocField));
    this.searchFormGroup.get(firstLocField).enable();
    this.searchFormGroup.get(secLocField).setValue(this.locationCode);
    this.searchFormGroup.get(secLocField).disable();
  }
  defaultDestLocation() {

    this.selectedDestiLocationDetails = new Object() as SelectionDailogOption;
    this.selectedDestiLocationDetails.id = this.locationCode;
    this.selectedDestiLocationDetails.description =
      this.locationCode + ' - ' + this.locationDesc;
  }
  defaultSrcLocation() {

    this.selectedLocationDetails = new Object() as SelectionDailogOption;
    this.selectedLocationDetails.id = this.locationCode;
    this.selectedLocationDetails.description =
      this.locationCode + ' - ' + this.locationDesc;
  }

  defaultLocation(): SelectionDailogOption {
    let selectedlocationDetails = new Object() as SelectionDailogOption;
    selectedlocationDetails.id = this.locationCode;
    selectedlocationDetails.description =
      this.locationCode + ' - ' + this.locationDesc;
    return selectedlocationDetails;
  }
  // open location selection popup
  openLocationSelectionPopup() {
    this.dialog.closeAll();
    let titleLabel = '';
    let placeHolderLabel = '';
    this.translate
      .get([
        this.selectSourceLocationLabelKey,
        this.searchByLocationPlaceHolderKey
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        (titleLabel = translatedMsg[this.selectSourceLocationLabelKey])
          (placeHolderLabel =
            translatedMsg[this.searchByLocationPlaceHolderKey]);
      });

    this.selectionDialog
      .open({
        title: titleLabel,
        placeholder: placeHolderLabel,
        options: this.locationForSelection.filter(
          location => location.id !== this.locationCode
        )
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.selectedLocationDetails = selectedOption;
          this.searchFormGroup
            .get([this.srcLocationField])
            .patchValue(selectedOption.id);
        }
      });
  }
  openDestiLocationSelectionPopup() {
    this.dialog.closeAll();
    let titleLabel = '';
    let placeHolderLabel = '';
    this.translate
      .get([
        this.selectDestinationLocationLabelKey,
        this.searchByLocationPlaceHolderKey
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe(translatedMsg => {
        (titleLabel = translatedMsg[this.selectDestinationLocationLabelKey])
          (placeHolderLabel =
            translatedMsg[this.searchByLocationPlaceHolderKey]);
      });
    this.selectionDialog
      .open({
        title: titleLabel,
        placeholder: placeHolderLabel,
        options: this.locationForSelection.filter(
          location => location.id !== this.locationCode
        )
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((selectedOption: SelectionDailogOption) => {
        if (selectedOption) {
          this.selectedDestiLocationDetails = selectedOption;
          this.searchFormGroup
            .get([this.destLocationField])
            .patchValue(selectedOption.id);
        }
      });
  }
  // message notification
  messageNotification(message: string, messageType: number) {
    this.overlayNotification
      .show({
        type: messageType,
        hasClose: true,
        message: message
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        if (messageType === OverlayNotificationType.SUCCESS) {
          this.onSelectTransferMode();
          this.cnTransferFacade.resetSearch();
        }
      });
  }
  /**
   * Error handler method
   * @param error:error Object
   */
  errorHandler(error: any) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe();
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
