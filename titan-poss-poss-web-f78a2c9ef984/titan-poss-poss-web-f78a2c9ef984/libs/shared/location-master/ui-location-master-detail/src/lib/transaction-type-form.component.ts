import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  HelperFunctions,
  TEMPLATE19
} from '@poss-web/shared/components/ui-dynamic-form';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  LocationApiKeyEnum,
  LocationMasterDetails,
  LocationTypeLists,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType
} from '@poss-web/shared/models';
import {
  TransactionTypeAdvanceBookingModel,
  TransactionTypeBillCancellationModel,
  TransactionTypeCashMemoModel,
  TransactionTypeCreditNotesModel,
  TransactionTypeCustomerOrderModel,
  TransactionTypeGEPModel,
  TransactionTypeGiftCardModel,
  TransactionTypeGRFModel,
  TransactionTypeGRNModel,
  TransactionTypeMainFormModel,
  TransactionTypeTaxModel
} from '@poss-web/shared/ui-master-form-models';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TransactionTypeTepModel } from 'libs/shared/ui-master-form-models/src/lib/location-master/transactionType-tep.model';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-transaction-type-form',
  template: `
    <poss-web-dynamic-form
      *ngIf="formFields"
      [style]="currentStyle"
      [formFields]="formFields"
      [disabled]="false"
      [enableSubmitOnInvalid]="true"
      [buttonNames]="['pw.locationMaster.cancel', 'pw.locationMaster.save']"
      (onFormSubmit)="addButton($event)"
      (onFormCancel)="deleteButton($event)"
      (invalidForm)="invalidForm($event)"
      (formGroupCreated)="formGroupCreated($event)"
    >
    </poss-web-dynamic-form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TransactionTypeFormComponent implements OnInit, OnDestroy {
  constructor(
    private translateService: TranslateService,
    public dialog: MatDialog,
    public cdr: ChangeDetectorRef,
    private helperFunctions: HelperFunctions,
    private fieldValidatorsService: FieldValidatorsService,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {}

  @Input() locationDetails: LocationMasterDetails;
  @Output() formOutput = new EventEmitter<LocationMasterDetails>();

  destroy$: Subject<null> = new Subject<null>();

  public formFields: any;
  public currentStyle: string[];

  ngOnInit(): void {
    const form = this.prepareSet();
    this.formFields = this.getInputs(form);
    this.currentStyle = this.getCssProp();
  }

  prepareSet() {
    const employeeLoanCheckbox = [
      {
        id: '1',
        name: 'pw.locationMaster.employeeLoanCNcancellationAllowed',
        checked: this.locationDetails.cnDetails
          ? this.locationDetails.cnDetails.data.isEmployeeLoanCNCancel
            ? this.locationDetails.cnDetails.data.isEmployeeLoanCNCancel
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.employeeLoanCNtransferAllowed',
        checked: this.locationDetails.cnDetails
          ? this.locationDetails.cnDetails.data.isEmployeeLoanCNTransfer
            ? this.locationDetails.cnDetails.data.isEmployeeLoanCNTransfer
            : false
          : false
      },
      {
        id: '3',
        name: 'pw.locationMaster.isEVoucherCnCancellationAllowed',
        checked: this.locationDetails.cnDetails
          ? this.locationDetails.cnDetails.data.isEVoucherCnCancellationAllowed
            ? this.locationDetails.cnDetails.data
                .isEVoucherCnCancellationAllowed
            : false
          : false
      },
      {
        id: '4',
        name: 'pw.locationMaster.isEVoucherCnTransferAllowed',
        checked: this.locationDetails.cnDetails
          ? this.locationDetails.cnDetails.data.isEVoucherCnTransferAllowed
            ? this.locationDetails.cnDetails.data.isEVoucherCnTransferAllowed
            : false
          : false
      },
      {
        id: '5',
        name: 'pw.locationMaster.isQcgcCnCancellationAllowed',
        checked: this.locationDetails.cnDetails
          ? this.locationDetails.cnDetails.data.isQcgcCnCancellationAllowed
            ? this.locationDetails.cnDetails.data.isQcgcCnCancellationAllowed
            : false
          : false
      },
      {
        id: '6',
        name: 'pw.locationMaster.isQcgcCnTransferAllowed',
        checked: this.locationDetails.cnDetails
          ? this.locationDetails.cnDetails.data.isQcgcCnTransferAllowed
            ? this.locationDetails.cnDetails.data.isQcgcCnTransferAllowed
            : false
          : false
      },
      {
        id: '7',
        name: 'pw.locationMaster.isGvCnCancellationAllowed',
        checked: this.locationDetails.cnDetails
          ? this.locationDetails.cnDetails.data.isGvCnCancellationAllowed
            ? this.locationDetails.cnDetails.data.isGvCnCancellationAllowed
            : false
          : false
      },
      {
        id: '8',
        name: 'pw.locationMaster.isGvCnTransferAllowed',
        checked: this.locationDetails.cnDetails
          ? this.locationDetails.cnDetails.data.isGvCnTransferAllowed
            ? this.locationDetails.cnDetails.data.isGvCnTransferAllowed
            : false
          : false
      },
      {
        id: '9',
        name: 'pw.locationMaster.isGhsCnCancellationAllowed',
        checked: this.locationDetails.cnDetails
          ? this.locationDetails.cnDetails.data.isGhsCnCancellationAllowed
            ? this.locationDetails.cnDetails.data.isGhsCnCancellationAllowed
            : false
          : false
      },
      {
        id: '10',
        name: 'pw.locationMaster.isGhsCnTransferAllowed',
        checked: this.locationDetails.cnDetails
          ? this.locationDetails.cnDetails.data.isGhsCnTransferAllowed
            ? this.locationDetails.cnDetails.data.isGhsCnTransferAllowed
            : false
          : false
      },
      {
        id: '11',
        name: 'pw.locationMaster.isUploadMandatoryforThirdPartyCNWithoutOTP',
        checked: this.locationDetails.cnDetails
          ? this.locationDetails.cnDetails.data
              .isUploadMandatoryforThirdPartyCNWithoutOTP
            ? this.locationDetails.cnDetails.data
                .isUploadMandatoryforThirdPartyCNWithoutOTP
            : false
          : false
      }
    ];

    const transactionTypeCreditNotesModel = new TransactionTypeCreditNotesModel(
      1,
      this.locationDetails.cnDetails
        ? this.locationDetails.cnDetails.data.suspendingCNs
          ? this.locationDetails.cnDetails.data.suspendingCNs
          : ''
        : '',
      this.locationDetails.cnDetails
        ? this.locationDetails.cnDetails.data.transferredCNs
          ? this.locationDetails.cnDetails.data.transferredCNs
          : ''
        : '',
      this.locationDetails.cnDetails
        ? this.locationDetails.cnDetails.data.activatedCNs
          ? this.locationDetails.cnDetails.data.activatedCNs
          : ''
        : '',
      this.locationDetails.cnDetails
        ? this.locationDetails.cnDetails.data.maxNoOfCN
          ? this.locationDetails.cnDetails.data.maxNoOfCN
          : ''
        : '',
      this.locationDetails.cnDetails
        ? this.locationDetails.cnDetails.data.otpForMinCN
          ? this.locationDetails.cnDetails.data.otpForMinCN
          : ''
        : '',
      // this.locationDetails.cnDetails
      //   ? this.locationDetails.cnDetails.data.maxNoOfTimesCNinEGHS
      //     ? this.locationDetails.cnDetails.data.maxNoOfTimesCNinEGHS
      //     : ''
      //   : '',
      employeeLoanCheckbox,
      this.fieldValidatorsService,
      this.translateService
    );

    // ---------------------
    const isGSTEnabled: { id: string; name: string; checked?: boolean }[] = [
      {
        id: '1',
        name: 'pw.locationMaster.IsGSTenabled',
        checked: this.locationDetails.taxDetails
          ? this.locationDetails.taxDetails.data.isGST
            ? this.locationDetails.taxDetails.data.isGST
            : false
          : false
      }
    ];

    const transactionTypeTaxModel = new TransactionTypeTaxModel(
      1,
      isGSTEnabled,
      this.locationDetails.taxDetails
        ? this.locationDetails.taxDetails.data.gstRegisterationNo
          ? this.locationDetails.taxDetails.data.gstRegisterationNo
          : ''
        : '',
      this.locationDetails.taxDetails
        ? this.locationDetails.taxDetails.data.gstValidFrom
          ? this.locationDetails.taxDetails.data.gstValidFrom
          : ''
        : '',
      this.locationDetails.taxDetails
        ? this.locationDetails.taxDetails.data.gstPrintValidFrom
          ? this.locationDetails.taxDetails.data.gstPrintValidFrom
          : ''
        : '',
      this.fieldValidatorsService,
      this.translateService
    );
    // -----------------

    // ---------------------
    const billCancellationApproval: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.locationMaster.Billcancellationapprovalrequired',
        checked: this.locationDetails.cmDetails
          ? this.locationDetails.cmDetails.data.isBillCancelApprovalRequired
            ? this.locationDetails.cmDetails.data.isBillCancelApprovalRequired
            : false
          : false
      }
    ];

    const transactionTypeBillCancellationModel = new TransactionTypeBillCancellationModel(
      1,
      billCancellationApproval,
      this.locationDetails.cmDetails
        ? this.locationDetails.cmDetails.data.maxNoOfHoursForBillCancel
        : '',
      this.fieldValidatorsService,
      this.translateService
    );
    // -----------------

    // ---------------------
    const titlePrintCustomerTransactionCheckbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.locationMaster.TitlePrintCustomerTransactions',
        checked: this.locationDetails.cmDetails
          ? this.locationDetails.cmDetails.data.isTitle
            ? this.locationDetails.cmDetails.data.isTitle
            : false
          : false
      }
    ];

    const transactionTypeCheckbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.locationMaster.MobileEmailMandatoryCorrection',
        checked: this.locationDetails.cmDetails
          ? this.locationDetails.cmDetails.data
              .isMobileAndEmailMandatoryForCorrection
            ? this.locationDetails.cmDetails.data
                .isMobileAndEmailMandatoryForCorrection
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.Allowedtoeditweight',
        checked: this.locationDetails.cmDetails
          ? this.locationDetails.cmDetails.data.isEditWeightAllowed
            ? this.locationDetails.cmDetails.data.isEditWeightAllowed
            : false
          : false
      },
      {
        id: '3',
        name: 'pw.locationMaster.MobileEmailMandatory',
        checked: this.locationDetails.cmDetails
          ? this.locationDetails.cmDetails.data.isMobileAndEmail
            ? this.locationDetails.cmDetails.data.isMobileAndEmail
            : false
          : false
      }
    ];

    const transactionTypeCashMemoModel = new TransactionTypeCashMemoModel(
      1,
      titlePrintCustomerTransactionCheckbox,
      transactionTypeCheckbox,
      this.locationDetails.cmDetails?.data
        ? this.locationDetails.cmDetails.data.cmHoldTimeInMinutes
          ? this.locationDetails.cmDetails.data.cmHoldTimeInMinutes
          : ''
        : '',
      this.locationDetails.cmDetails?.data
        ? this.locationDetails.cmDetails.data.noOfHoursForOpenTaskDeletionCM
          ? this.locationDetails.cmDetails.data.noOfHoursForOpenTaskDeletionCM
          : ''
        : '',
      this.fieldValidatorsService,
      this.translateService
    );
    // -----------------

    // ---------------------
    const innerBoutiqueGRNAllowed: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.locationMaster.isInterBoutiqueGRNAllowed',
        checked: this.locationDetails.grnDetails
          ? this.locationDetails.grnDetails.data.isInterBoutiqueGRNAllowed
            ? this.locationDetails.grnDetails.data.isInterBoutiqueGRNAllowed
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.isGrnAllowedInCm',
        checked: this.locationDetails.grnDetails
          ? this.locationDetails.grnDetails.data.isGrnAllowedInCm
            ? this.locationDetails.grnDetails.data.isGrnAllowedInCm
            : false
          : false
      },
      {
        id: '3',
        name: 'pw.locationMaster.isGrnAllowedInAdvanceBooking',
        checked: this.locationDetails.grnDetails
          ? this.locationDetails.grnDetails.data.isGrnAllowedInAdvanceBooking
            ? this.locationDetails.grnDetails.data.isGrnAllowedInAdvanceBooking
            : false
          : false
      },
      {
        id: '4',
        name: 'pw.locationMaster.isGrnAllowedInCustomerOrder',
        checked: this.locationDetails.grnDetails
          ? this.locationDetails.grnDetails.data.isGrnAllowedInCustomerOrder
            ? this.locationDetails.grnDetails.data.isGrnAllowedInCustomerOrder
            : false
          : false
      }
    ];

    const transactionTypeGRNModel = new TransactionTypeGRNModel(
      1,
      this.locationDetails.cmDetails
        ? this.locationDetails.grnDetails?.data?.noOfDaysGRNAllowed
          ? this.locationDetails.grnDetails.data.noOfDaysGRNAllowed
          : ''
        : '',
      this.locationDetails.cmDetails
        ? this.locationDetails.grnDetails?.data?.maximumNoOfDaysForApprovedGRN
          ? this.locationDetails.grnDetails.data.maximumNoOfDaysForApprovedGRN
          : ''
        : '',
      this.locationDetails.cmDetails
        ? this.locationDetails.grnDetails?.data?.noOfDaysToProtectGoldRateForGRN
          ? this.locationDetails.grnDetails.data.noOfDaysToProtectGoldRateForGRN
          : ''
        : '',
      this.locationDetails.cmDetails
        ? this.locationDetails.grnDetails?.data?.minUtilizationPercentForGRN
          ? this.locationDetails.grnDetails.data.minUtilizationPercentForGRN
          : ''
        : '',
      innerBoutiqueGRNAllowed,
      this.fieldValidatorsService,
      this.translateService
    );
    // -----------------

    // ---------------------
    const transactionTypeGRFCheckBox: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.locationMaster.isGRFAllowed',
        checked: this.locationDetails.grfDetails
          ? this.locationDetails.grfDetails?.data?.isGRFAllowed
            ? this.locationDetails.grfDetails.data.isGRFAllowed
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.isGRFAllowdInCM',
        checked: this.locationDetails.grfDetails
          ? this.locationDetails?.grfDetails.data?.isGRFAllowedInCM
            ? this.locationDetails.grfDetails.data.isGRFAllowedInCM
            : false
          : false
      },
      {
        id: '3',
        name: 'pw.locationMaster.isGRFAllowedInAdvanceBooking',
        checked: this.locationDetails.grfDetails
          ? this.locationDetails?.grfDetails?.data.isGRFAllowedInAdvanceBooking
            ? this.locationDetails.grfDetails.data.isGRFAllowedInAdvanceBooking
            : false
          : false
      },
      {
        id: '4',
        name: 'pw.locationMaster.isGRFAllowedIncustomerOrder',
        checked: this.locationDetails.grfDetails
          ? this.locationDetails.grfDetails?.data?.isGRFAllowedInCustomerOrder
            ? this.locationDetails.grfDetails.data.isGRFAllowedInCustomerOrder
            : false
          : false
      },
      {
        id: '5',
        name: 'pw.locationMaster.MergingoffrozenCreditNoteAllowed',
        checked: this.locationDetails.grfDetails
          ? this.locationDetails?.grfDetails?.data?.isMergeCNAllowed
            ? this.locationDetails.grfDetails.data.isMergeCNAllowed
            : false
          : false
      },
      {
        id: '6',
        name: 'pw.locationMaster.resultantCreditNote',
        checked: this.locationDetails.grfDetails
          ? this.locationDetails.grfDetails?.data?.currentOwner
            ? this.locationDetails.grfDetails.data.currentOwner
            : false
          : false
      },
      {
        id: '7',
        name: 'pw.locationMaster.resultantCreditNoteThird',
        checked: this.locationDetails.grfDetails
          ? this.locationDetails.grfDetails?.data?.thirdPerson
            ? this.locationDetails.grfDetails.data.thirdPerson
            : false
          : false
      }
    ];

    const transactionTypeGRFModel = new TransactionTypeGRFModel(
      1,
      this.locationDetails.cmDetails
        ? this.locationDetails.grfDetails?.data?.minimumUtilization
          ? this.locationDetails.grfDetails.data.minimumUtilization
          : ''
        : '',
      transactionTypeGRFCheckBox,
      this.fieldValidatorsService,
      this.translateService
    );
    // -----------------

    // ---------------------
    const enableGEPSale: { id: string; name: string; checked?: boolean }[] = [
      {
        id: '1',
        name: 'pw.locationMaster.enableGEPSale',
        checked: this.locationDetails.gepDetails
          ? this.locationDetails.gepDetails?.data?.enableGEPSale
            ? this.locationDetails.gepDetails.data.enableGEPSale
            : false
          : false
      }
    ];
    const isPreMeltingDetailsMandatory: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.locationMaster.IsPreMeltingdetailsmandatory',
        checked: this.locationDetails.gepDetails
          ? this.locationDetails.gepDetails?.data?.isPreMeltingDetailsMandatory
            ? this.locationDetails.gepDetails.data.isPreMeltingDetailsMandatory
            : false
          : false
      }
    ];

    const transactionTypeGEPModel = new TransactionTypeGEPModel(
      1,
      // this.locationDetails.gepDetails
      //   ? this.locationDetails.gepDetails?.data?.gepPureGoldPurity
      //     ? this.locationDetails.gepDetails.data.gepPureGoldPurity
      //     : ''
      //   : '',
      // this.locationDetails.gepDetails
      //   ? this.locationDetails.gepDetails?.data?.gepPureSilverPurity
      //     ? this.locationDetails.gepDetails.data.gepPureSilverPurity
      //     : ''
      //   : '',
      // this.locationDetails.gepDetails
      //   ? this.locationDetails.gepDetails?.data?.gepPurePlatinumPurity
      //     ? this.locationDetails.gepDetails.data.gepPurePlatinumPurity
      //     : ''
      //   : '',
      // this.locationDetails.gepDetails
      //   ? this.locationDetails.gepDetails?.data?.gepStandardDeductionGold
      //     ? this.locationDetails.gepDetails.data.gepStandardDeductionGold
      //     : ''
      //   : '',
      // this.locationDetails.gepDetails
      //   ? this.locationDetails.gepDetails?.data?.gepStandardDeductionSilver
      //     ? this.locationDetails.gepDetails.data.gepStandardDeductionSilver
      //     : ''
      //   : '',
      // this.locationDetails.gepDetails
      //   ? this.locationDetails.gepDetails?.data?.gepStandardDeductionPlatinum
      //     ? this.locationDetails.gepDetails.data.gepStandardDeductionPlatinum
      //     : ''
      //   : '',
      enableGEPSale,
      this.locationDetails.gepDetails
        ? this.locationDetails.gepDetails.data?.noOfDaysGepCancel
          ? this.locationDetails.gepDetails?.data?.noOfDaysGepCancel
          : ''
        : '',
      this.locationDetails.gepDetails
        ? this.locationDetails.gepDetails.data?.karatAcceptedForGEP
          ? this.locationDetails.gepDetails?.data?.karatAcceptedForGEP
          : ''
        : '',
      isPreMeltingDetailsMandatory,
      this.locationDetails.gepDetails
        ? this.locationDetails.gepDetails.data?.gepHoldTime
          ? this.locationDetails.gepDetails?.data?.gepHoldTime
          : ''
        : '',
      this.fieldValidatorsService,
      this.translateService
    );
    // -----------------

    // ---------------------
    const giftCardCheckbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.locationMaster.isCardCancellationAllowed',
        checked: this.locationDetails.gcDetails
          ? this.locationDetails?.gcDetails.data.isCardCancellationAllowed
            ? this.locationDetails.gcDetails.data.isCardCancellationAllowed
            : false
          : false
      },
      // {
      //   id: '1',
      //   name: 'pw.locationMaster.isCardwardingAllowed',
      //   checked: this.locationDetails.gcDetails? this.locationDetails?.gcDetails.data.isCardInwardingAllowed? this.locationDetails.gcDetails.data.isCardInwardingAllowed
      //       : false
      //     : false
      // },
      {
        id: '2',
        name: 'pw.locationMaster.isCardActivationAllowed',
        checked: this.locationDetails.gcDetails
          ? this.locationDetails?.gcDetails.data.isCardActivationAllowed
            ? this.locationDetails.gcDetails.data.isCardActivationAllowed
            : false
          : false
      }
    ];

    const transactionTypeGiftCardModel = new TransactionTypeGiftCardModel(
      1,
      this.locationDetails.gcDetails
        ? this.locationDetails.gcDetails?.data?.maximumAmount
          ? this.locationDetails.gcDetails.data.maximumAmount
          : ''
        : '',
      this.locationDetails.gcDetails
        ? this.locationDetails.gcDetails?.data?.minimumAmount
          ? this.locationDetails.gcDetails.data.minimumAmount
          : ''
        : '',
      this.locationDetails.gcDetails
        ? this.locationDetails.gcDetails?.data?.multiplesValue
          ? this.locationDetails.gcDetails.data.multiplesValue
          : ''
        : '',
      giftCardCheckbox,
      this.fieldValidatorsService,
      this.translateService
    );
    // -----------------

    // ---------------------
    const advanceBookingCheckbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.locationMaster.cancellationAllowedforAdvanceBooking',
        checked: this.locationDetails.abDetails
          ? this.locationDetails.abDetails.data
              .cancellationAllowedforAdvanceBooking
            ? this.locationDetails.abDetails.data
                .cancellationAllowedforAdvanceBooking
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.activateAllowedforAdvanceBooking',
        checked: this.locationDetails.abDetails
          ? this.locationDetails.abDetails.data.activateAllowedforAdvanceBooking
            ? this.locationDetails.abDetails.data
                .activateAllowedforAdvanceBooking
            : false
          : false
      },
      {
        id: '3',
        name: 'pw.locationMaster.requestApprovalForNonFrozenOrderCancellation',
        checked: this.locationDetails.abDetails
          ? this.locationDetails.abDetails.data
              .requestApprovalForNonFrozenOrderCancel
            ? this.locationDetails.abDetails.data
                .requestApprovalForNonFrozenOrderCancel
            : false
          : false
      },
      {
        id: '4',
        name: 'pw.locationMaster.smsAndEmailCommunicationEnabled',
        checked: this.locationDetails.abDetails
          ? this.locationDetails.abDetails.data.isSmsAndEmailCommunicationEnable
            ? this.locationDetails.abDetails.data
                .isSmsAndEmailCommunicationEnable
            : false
          : false
      }
    ];

    const transactionTypeAdvanceBookingModel = new TransactionTypeAdvanceBookingModel(
      1,
      this.locationDetails.abDetails
        ? this.locationDetails.abDetails.data
            .validityDaysforAutoClosureInAdvanceBooking
          ? this.locationDetails.abDetails.data
              .validityDaysforAutoClosureInAdvanceBooking
          : ''
        : '',
      this.locationDetails.abDetails
        ? this.locationDetails.abDetails.data
            .validityDaysforActivateInAdvanceBooking
          ? this.locationDetails.abDetails.data
              .validityDaysforActivateInAdvanceBooking
          : ''
        : '',
      this.locationDetails.abDetails
        ? this.locationDetails.abDetails.data
            .validityDaysforReleaseInvInAdvancebooking
          ? this.locationDetails.abDetails.data
              .validityDaysforReleaseInvInAdvancebooking
          : ''
        : '',
      // this.locationDetails.abDetails
      //   ? this.locationDetails.abDetails.data.minPercentToBePaidForFrozenOrder
      //     ? this.locationDetails.abDetails.data.minPercentToBePaidForFrozenOrder
      //     : ''
      //   : '',
      // this.locationDetails.abDetails
      //   ? this.locationDetails.abDetails.data
      //       .minPercentToBePaidForNonFrozenOrder
      //     ? this.locationDetails.abDetails.data
      //         .minPercentToBePaidForNonFrozenOrder
      //     : ''
      //   : '',
      this.locationDetails.abDetails
        ? this.locationDetails.abDetails.data.abHoldTime
          ? this.locationDetails.abDetails.data.abHoldTime
          : ''
        : '',
      advanceBookingCheckbox,
      this.locationDetails.abDetails
        ? this.locationDetails.abDetails.data.noOfHoursForOpenTaskDeletion
          ? this.locationDetails.abDetails.data.noOfHoursForOpenTaskDeletion
          : ''
        : '',
      this.fieldValidatorsService,
      this.translateService
    );
    // -----------------

    // ---------------------
    const customerOrderCheckbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.locationMaster.cancellationAllowedforCustomerOrder',
        checked: this.locationDetails.coDetails
          ? this.locationDetails.coDetails.data
              .cancellationAllowedforCustomerOrder
            ? this.locationDetails.coDetails.data
                .cancellationAllowedforCustomerOrder
            : false
          : false
      },
      {
        id: '2',
        name: 'pw.locationMaster.activateAllowedforCustomerOrder',
        checked: this.locationDetails.coDetails
          ? this.locationDetails.coDetails.data.activateAllowedforCustomerOrder
            ? this.locationDetails.coDetails.data
                .activateAllowedforCustomerOrder
            : false
          : false
      },
      {
        id: '3',
        name: 'pw.locationMaster.requestApprovalForNonFrozenOrderCancellation',
        checked: this.locationDetails.coDetails
          ? this.locationDetails.coDetails.data
              .requestApprovalforNonFrozenOrderCancellation
            ? this.locationDetails.coDetails.data
                .requestApprovalforNonFrozenOrderCancellation
            : false
          : false
      },
      {
        id: '4',
        name: 'pw.locationMaster.smsAndEmailCommunicationEnabled',
        checked: this.locationDetails.coDetails
          ? this.locationDetails.coDetails.data.isSmsAndEmailCommunicationEnable
            ? this.locationDetails.coDetails.data
                .isSmsAndEmailCommunicationEnable
            : false
          : false
      }
    ];

    const transactionTypeCustomerOrderModel = new TransactionTypeCustomerOrderModel(
      1,
      this.locationDetails.coDetails
        ? this.locationDetails.coDetails.data
            .validityDaysforAutoClosureInCustomerOrder
          ? this.locationDetails.coDetails.data
              .validityDaysforAutoClosureInCustomerOrder
          : ''
        : '',
      this.locationDetails.coDetails
        ? this.locationDetails.coDetails.data
            .validityDaysforActivateInCustomerOrder
          ? this.locationDetails.coDetails.data
              .validityDaysforActivateInCustomerOrder
          : ''
        : '',
      this.locationDetails.coDetails
        ? this.locationDetails.coDetails.data.numberOfDaysforAutoApproval
          ? this.locationDetails.coDetails.data.numberOfDaysforAutoApproval
          : ''
        : '',
      this.locationDetails.coDetails
        ? this.locationDetails.coDetails.data.numberOfDaysforReturnAutoApproval
          ? this.locationDetails.coDetails.data
              .numberOfDaysforReturnAutoApproval
          : ''
        : '',

      this.locationDetails.coDetails
        ? this.locationDetails.coDetails.data.coHoldTime
          ? this.locationDetails.coDetails.data.coHoldTime
          : ''
        : '',

      customerOrderCheckbox,
      this.fieldValidatorsService,
      this.translateService
    );

    const tepPartialCNCancellationCheckbox: {
      id: string;
      name: string;
      checked?: boolean;
    }[] = [
      {
        id: '1',
        name: 'pw.locationMaster.partialTEPCNCancelationAllowed',
        checked: this.locationDetails?.tepDetails?.data
          ?.tepPartialCNCancellation
      }
    ];

    const transactionTypeTepModel = new TransactionTypeTepModel(
      1,
      this.locationDetails.tepDetails
        ? this.locationDetails.tepDetails.data.tepHoldTime.toString()
          ? this.locationDetails.tepDetails.data.tepHoldTime.toString()
          : ''
        : '',
      tepPartialCNCancellationCheckbox,
      this.fieldValidatorsService,
      this.translateService
    );
    // -----------------

    const detailsmain = new TransactionTypeMainFormModel(
      1,
      transactionTypeCreditNotesModel,
      transactionTypeTaxModel,
      transactionTypeBillCancellationModel,
      transactionTypeCashMemoModel,
      transactionTypeGRNModel,
      transactionTypeGRFModel,
      transactionTypeGEPModel,
      transactionTypeGiftCardModel,
      transactionTypeAdvanceBookingModel,
      transactionTypeCustomerOrderModel,
      transactionTypeTepModel
    );

    return detailsmain;
  }

  getCssProp() {
    return [];
  }

  public getInputs(form: any) {
    return {
      formConfig: this.setFormConfig(),
      formFields: form.buildFormFields()
    };
  }

  public setFormConfig() {
    return {
      formName: 'pw.transactionType.transactionType',
      formDesc: '',
      formTemplate: TEMPLATE19
    };
  }

  public addButton(formGroup: FormGroup) {
    const formData = formGroup.getRawValue();

    const locationDetails: LocationMasterDetails = {
      locationCode: this.locationDetails.locationCode,
      cnDetails: {
        type: LocationApiKeyEnum.CREDIT_NOTES,
        data: {
          suspendingCNs:
            formData['1-transactionTypeCreditNotesModel'][
              '1-daysSuspendingCreditNotes'
            ],
          transferredCNs:
            formData['1-transactionTypeCreditNotesModel'][
              '1-daysSuspendingTransferredCreditNotes'
            ],
          activatedCNs:
            formData['1-transactionTypeCreditNotesModel'][
              '1-suspensionGradeCreditNotes'
            ],
          maxNoOfCN: formData['1-transactionTypeCreditNotesModel']['1-maxCN'],
          otpForMinCN:
            formData['1-transactionTypeCreditNotesModel']['1-minimumOTPCN'],
          // maxNoOfTimesCNinEGHS:
          //   formData['1-transactionTypeCreditNotesModel']['1-maxNoEGHSCredit'],
          isEmployeeLoanCNCancel:
            formData['1-transactionTypeCreditNotesModel'][
              '1-employeeLoanCheckbox'
            ][0],
          isEmployeeLoanCNTransfer:
            formData['1-transactionTypeCreditNotesModel'][
              '1-employeeLoanCheckbox'
            ][1],
          isEVoucherCnCancellationAllowed:
            formData['1-transactionTypeCreditNotesModel'][
              '1-employeeLoanCheckbox'
            ][2],
          isEVoucherCnTransferAllowed:
            formData['1-transactionTypeCreditNotesModel'][
              '1-employeeLoanCheckbox'
            ][3],
          isQcgcCnCancellationAllowed:
            formData['1-transactionTypeCreditNotesModel'][
              '1-employeeLoanCheckbox'
            ][4],
          isQcgcCnTransferAllowed:
            formData['1-transactionTypeCreditNotesModel'][
              '1-employeeLoanCheckbox'
            ][5],
          isGvCnCancellationAllowed:
            formData['1-transactionTypeCreditNotesModel'][
              '1-employeeLoanCheckbox'
            ][6],
          isGvCnTransferAllowed:
            formData['1-transactionTypeCreditNotesModel'][
              '1-employeeLoanCheckbox'
            ][7],
          isGhsCnCancellationAllowed:
            formData['1-transactionTypeCreditNotesModel'][
              '1-employeeLoanCheckbox'
            ][8],
          isGhsCnTransferAllowed:
            formData['1-transactionTypeCreditNotesModel'][
              '1-employeeLoanCheckbox'
            ][9],
          isUploadMandatoryforThirdPartyCNWithoutOTP:
            formData['1-transactionTypeCreditNotesModel'][
              '1-employeeLoanCheckbox'
            ][10]
        }
      },
      taxDetails: {
        type: LocationApiKeyEnum.TAX_DETAILS,
        data: {
          isGST: formData['1-transactionTypeTaxModel']['1-isGSTEnabled'][0],
          gstRegisterationNo:
            formData['1-transactionTypeTaxModel']['1-gstRegistrationNo'],
          gstValidFrom: formData['1-transactionTypeTaxModel']['1-gstValidFrom'],
          gstPrintValidFrom:
            formData['1-transactionTypeTaxModel']['1-gstPrintValidFrom']
        }
      },
      cmDetails: {
        type: LocationApiKeyEnum.CM_DETAILS,
        data: {
          isBillCancelApprovalRequired:
            formData['1-transactionTypeBillCancellationModel'][
              '1-billCancellationApproval'
            ][0],
          maxNoOfHoursForBillCancel:
            formData['1-transactionTypeBillCancellationModel'][
              '1-hoursForBillCancellation'
            ],
          isTitle:
            formData['1-transactionTypeCashMemoModel'][
              '1-titlePrintCustomerTransactionCheckbox'
            ][0],
          isMobileAndEmailMandatoryForCorrection:
            formData['1-transactionTypeCashMemoModel'][
              '1-transactionTypeCheckbox'
            ][0],
          isEditWeightAllowed:
            formData['1-transactionTypeCashMemoModel'][
              '1-transactionTypeCheckbox'
            ][1],
          isMobileAndEmail:
            formData['1-transactionTypeCashMemoModel'][
              '1-transactionTypeCheckbox'
            ][2],
          cmHoldTimeInMinutes:
            formData['1-transactionTypeCashMemoModel']['1-cmHoldTimeInMinutes'],
          noOfHoursForOpenTaskDeletionCM:
            formData['1-transactionTypeCashMemoModel'][
              '1-noOfHoursForOpenTaskDeletionCM'
            ]
        }
      },
      grnDetails: {
        type: LocationApiKeyEnum.GRN_DETAILS,
        data: {
          noOfDaysGRNAllowed:
            formData['1-transactionTypeGRNModel']['1-daysGRNAllowed'],
          maximumNoOfDaysForApprovedGRN:
            formData['1-transactionTypeGRNModel']['1-daysGRNApproved'],
          noOfDaysToProtectGoldRateForGRN:
            formData['1-transactionTypeGRNModel']['1-protectGoldRate'],
          minUtilizationPercentForGRN:
            formData['1-transactionTypeGRNModel']['1-minimumUtilization'],
          isInterBoutiqueGRNAllowed:
            formData['1-transactionTypeGRNModel'][
              '1-innerBoutiqueGRNAllowed'
            ][0],
          isGrnAllowedInCm:
            formData['1-transactionTypeGRNModel'][
              '1-innerBoutiqueGRNAllowed'
            ][1],
          isGrnAllowedInAdvanceBooking:
            formData['1-transactionTypeGRNModel'][
              '1-innerBoutiqueGRNAllowed'
            ][2],
          isGrnAllowedInCustomerOrder:
            formData['1-transactionTypeGRNModel'][
              '1-innerBoutiqueGRNAllowed'
            ][3]
        }
      },
      grfDetails: {
        type: LocationApiKeyEnum.GRF_DETAILS,
        data: {
          minimumUtilization:
            formData['1-transactionTypeGRFModel']['1-minUtilizationGRF'],
          isGRFAllowed:
            formData['1-transactionTypeGRFModel'][
              '1-transactionTypeGRFCheckBox'
            ][0],
          isGRFAllowedInCM:
            formData['1-transactionTypeGRFModel'][
              '1-transactionTypeGRFCheckBox'
            ][1],
          isGRFAllowedInAdvanceBooking:
            formData['1-transactionTypeGRFModel'][
              '1-transactionTypeGRFCheckBox'
            ][2],
          isGRFAllowedInCustomerOrder:
            formData['1-transactionTypeGRFModel'][
              '1-transactionTypeGRFCheckBox'
            ][3],
          isMergeCNAllowed:
            formData['1-transactionTypeGRFModel'][
              '1-transactionTypeGRFCheckBox'
            ][4],
          currentOwner:
            formData['1-transactionTypeGRFModel'][
              '1-transactionTypeGRFCheckBox'
            ][5],
          thirdPerson:
            formData['1-transactionTypeGRFModel'][
              '1-transactionTypeGRFCheckBox'
            ][6]
        }
      },
      gepDetails: {
        type: LocationApiKeyEnum.GEP_DETAILS,
        data: {
          enableGEPSale:
            formData['1-transactionTypeGEPModel']['1-enableGEPSale'][0],
          gepStandardDeductionGold:
            formData['1-transactionTypeGEPModel']['1-gepDeductionGold'],
          gepStandardDeductionPlatinum:
            formData['1-transactionTypeGEPModel']['1-gepDeductionPlatinum'],
          gepStandardDeductionSilver:
            formData['1-transactionTypeGEPModel']['1-gepDeductionSilver'],
          noOfDaysGepCancel:
            formData['1-transactionTypeGEPModel']['1-gepCancellation'],
          karatAcceptedForGEP:
            formData['1-transactionTypeGEPModel']['1-karatAcceptedForGEP'],
          isPreMeltingDetailsMandatory:
            formData['1-transactionTypeGEPModel'][
              '1-isPreMeltingDetailsMandatory'
            ][0],
          gepHoldTime: formData['1-transactionTypeGEPModel']['1-gepHoldTime']
        }
      },
      gcDetails: {
        type: LocationApiKeyEnum.GIFT_CARD_DETAILS,
        data: {
          maximumAmount:
            formData['1-transactionTypeGiftCardModel']['1-maxAmount'],
          minimumAmount:
            formData['1-transactionTypeGiftCardModel']['1-minAmount'],
          multiplesValue:
            formData['1-transactionTypeGiftCardModel']['1-multiplesValue'],
          isCardCancellationAllowed:
            formData['1-transactionTypeGiftCardModel']['1-giftCardCheckbox'][0],
          // isCardInwardingAllowed:
          //   formData['1-transactionTypeGiftCardModel']['1-giftCardCheckbox'][1],
          isCardActivationAllowed:
            formData['1-transactionTypeGiftCardModel']['1-giftCardCheckbox'][1]
        }
      },
      abDetails: {
        type: LocationApiKeyEnum.ADVANCE_BOOKING_DETAILS,
        data: {
          cancellationAllowedforAdvanceBooking:
            formData['1-transactionTypeAdvanceBookingModel'][
              '1-advanceBookingCheckbox'
            ][0],
          activateAllowedforAdvanceBooking:
            formData['1-transactionTypeAdvanceBookingModel'][
              '1-advanceBookingCheckbox'
            ][1],
          requestApprovalForNonFrozenOrderCancel:
            formData['1-transactionTypeAdvanceBookingModel'][
              '1-advanceBookingCheckbox'
            ][2],
          isSmsAndEmailCommunicationEnable:
            formData['1-transactionTypeAdvanceBookingModel'][
              '1-advanceBookingCheckbox'
            ][3],
          validityDaysforAutoClosureInAdvanceBooking:
            formData['1-transactionTypeAdvanceBookingModel'][
              '1-daysAutoClosure'
            ],
          validityDaysforActivateInAdvanceBooking:
            formData['1-transactionTypeAdvanceBookingModel'][
              '1-daysForActivate'
            ],
          validityDaysforReleaseInvInAdvancebooking:
            formData['1-transactionTypeAdvanceBookingModel'][
              '1-daysForRelease'
            ],
          minPercentToBePaidForFrozenOrder: '0',
          minPercentToBePaidForNonFrozenOrder: '0',
          //   minPercentToBePaidForFrozenOrder:
          //   formData['1-transactionTypeAdvanceBookingModel'][
          //     '1-minPercentToBePaidForFrozenOrder'
          //   ],
          // minPercentToBePaidForNonFrozenOrder:
          //   formData['1-transactionTypeAdvanceBookingModel'][
          //     '1-minPercentToBePaidForNonFrozenOrder'
          //   ],
          abHoldTime:
            formData['1-transactionTypeAdvanceBookingModel']['1-abHoldTime'],
          noOfHoursForOpenTaskDeletion:
            formData['1-transactionTypeAdvanceBookingModel'][
              '1-numberOfHoursForOpenTaskDeletion'
            ]
        }
      },
      coDetails: {
        type: LocationApiKeyEnum.CUSTOMER_ORDER_DETAILS,
        data: {
          cancellationAllowedforCustomerOrder:
            formData['1-transactionTypeCustomerOrderModel'][
              '1-customerOrderCheckbox'
            ][0],
          activateAllowedforCustomerOrder:
            formData['1-transactionTypeCustomerOrderModel'][
              '1-customerOrderCheckbox'
            ][1],
          requestApprovalforNonFrozenOrderCancellation:
            formData['1-transactionTypeCustomerOrderModel'][
              '1-customerOrderCheckbox'
            ][2],
          isSmsAndEmailCommunicationEnable:
            formData['1-transactionTypeCustomerOrderModel'][
              '1-customerOrderCheckbox'
            ][3],
          validityDaysforAutoClosureInCustomerOrder:
            formData['1-transactionTypeCustomerOrderModel'][
              '1-daysForAutoClosure'
            ],
          validityDaysforActivateInCustomerOrder:
            formData['1-transactionTypeCustomerOrderModel'][
              '1-daysForActivate'
            ],
          numberOfDaysforAutoApproval:
            formData['1-transactionTypeCustomerOrderModel'][
              '1-daysForAutoApproval'
            ],
          numberOfDaysforReturnAutoApproval:
            formData['1-transactionTypeCustomerOrderModel'][
              '1-daysForReturnAutoApproval'
            ],
          coHoldTime:
            formData['1-transactionTypeCustomerOrderModel']['1-coHoldTime']
        }
      },
      tepDetails: {
        type: LocationApiKeyEnum.TEP_DETAILS,
        data: {
          tepHoldTime: +formData['1-transactionTypeTepModel']['1-tepHoldTime'],
          tepPartialCNCancellation:
            formData['1-transactionTypeTepModel'][
              '1-tepPartialCNCancellationCheckbox'
            ][0]
        }
      }
    };

    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.saveConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.formOutput.emit(locationDetails);
        }
      });
    // }
  }
  showMessage(key: string) {
    this.translateService
      .get(key)
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessage: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMessage,
            hasBackdrop: true,
            hasClose: true
          })
          .events.subscribe();
      });
  }

  public deleteButton() {
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.CONFIRM,
        message: 'pw.alertPopup.cancelConfirmation'
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: boolean) => {
        if (res) {
          this.ngOnDestroy();
          this.destroy$ = new Subject<null>();
          this.ngOnInit();
          this.cdr.detectChanges();
        }
      });
  }

  public formGroupCreated(formGroup: FormGroup) {
    const subForm: FormGroup = <FormGroup>(
      formGroup.get('1-transactionTypeTaxModel')
    );

    if (this.locationDetails.locationTypeCode === LocationTypeLists.BTQ) {
      this.translateService
        .get('pw.locationMaster.maximumAmount')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeGiftCardModel',
            '1-maxAmount',
            [
              this.fieldValidatorsService.amountField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.minimumAmount')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeGiftCardModel',
            '1-minAmount',
            [
              this.fieldValidatorsService.amountField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.caratacceptedforGEP')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeGEPModel',
            '1-karatAcceptedForGEP',
            [
              this.fieldValidatorsService.numbersField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.GEPHoldTime')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeGEPModel',
            '1-gepHoldTime',
            [
              this.fieldValidatorsService.numbersField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.tepHoldTime')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeTepModel',
            '1-tepHoldTime',
            [
              this.fieldValidatorsService.numbersField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.cmHoldTimeInMinutes')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCashMemoModel',
            '1-cmHoldTimeInMinutes',
            [
              this.fieldValidatorsService.numbersField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.noOfHoursForOpenTaskDeletionCM')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCashMemoModel',
            '1-noOfHoursForOpenTaskDeletionCM',
            [
              this.fieldValidatorsService.amountField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.numberOfHoursForOpenTaskDeletion')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeAdvanceBookingModel',
            '1-numberOfHoursForOpenTaskDeletion',
            [
              this.fieldValidatorsService.amountField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.noOfDaysForSuspendingCreditNotes')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCreditNotesModel',
            '1-daysSuspendingCreditNotes',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.suspendingtransferredcreditnotes')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCreditNotesModel',
            '1-daysSuspendingTransferredCreditNotes',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.suspendinggracepcreditnotes')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCreditNotesModel',
            '1-suspensionGradeCreditNotes',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.MaxNoofCN')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCreditNotesModel',
            '1-maxCN',
            [
              this.fieldValidatorsService.numbersField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.MinimumOTPCNvalue')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCreditNotesModel',
            '1-minimumOTPCN',
            [
              this.fieldValidatorsService.numbersField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.MaxnumbereGHS')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCreditNotesModel',
            '1-maxNoEGHSCredit',
            [
              this.fieldValidatorsService.numbersField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // correct
        });

      this.translateService
        .get('pw.locationMaster.MaxHoursbillcancellationApproval')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeBillCancellationModel',
            '1-hoursForBillCancellation',
            [
              this.fieldValidatorsService.amountField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // new
        });

      // this.translateService
      //   .get('pw.locationMaster.GEPPureGoldPurity')
      //   .toPromise()
      //   .then(fieldNameTranslate => {
      //     this.helperFunctions.setConditionalValidators(
      //       formGroup,
      //       '1-transactionTypeGEPModel',
      //       '1-gepGoldPurity',
      //       [
      //         this.fieldValidatorsService.percentageField(fieldNameTranslate),
      //         this.fieldValidatorsService.requiredField(fieldNameTranslate),
      //         Validators.required
      //       ]
      //     );
      //     // correct
      //   });
      // this.translateService
      //   .get('pw.locationMaster.GEPPureSilverPurity')
      //   .toPromise()
      //   .then(fieldNameTranslate => {
      //     this.helperFunctions.setConditionalValidators(
      //       formGroup,
      //       '1-transactionTypeGEPModel',
      //       '1-gepSilverPurity',
      //       [
      //         this.fieldValidatorsService.percentageField(fieldNameTranslate),
      //         this.fieldValidatorsService.requiredField(fieldNameTranslate),
      //         Validators.required
      //       ]
      //     );
      //     // correct
      //   });

      // this.translateService
      //   .get('pw.locationMaster.GEPPurePlatinumPurity')
      //   .toPromise()
      //   .then(fieldNameTranslate => {
      //     this.helperFunctions.setConditionalValidators(
      //       formGroup,
      //       '1-transactionTypeGEPModel',
      //       '1-gepPlatinumPurity',
      //       [
      //         this.fieldValidatorsService.percentageField(fieldNameTranslate),
      //         this.fieldValidatorsService.requiredField(fieldNameTranslate),
      //         Validators.required
      //       ]
      //     );
      //     // correct
      //   });

      this.translateService
        .get('pw.locationMaster.GEPStandaredDeductionGold')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeGEPModel',
            '1-gepDeductionGold',
            [
              this.fieldValidatorsService.percentageField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.GEPStandaredDeductionSilver')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeGEPModel',
            '1-gepDeductionSilver',
            [
              this.fieldValidatorsService.percentageField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.GEPStandaredDeductionPlatinum')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeGEPModel',
            '1-gepDeductionPlatinum',
            [
              this.fieldValidatorsService.percentageField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // correct
        });

      this.translateService
        .get('pw.locationMaster.validityDaysforAutoClosureInAdvanceBooking')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeAdvanceBookingModel',
            '1-daysAutoClosure',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // new
        });

      this.translateService
        .get('pw.locationMaster.validityDaysforActivateInAdvanceBooking')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeAdvanceBookingModel',
            '1-daysForActivate',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.validityDaysforReleaseInvInAdvancebooking')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeAdvanceBookingModel',
            '1-daysForRelease',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.minPercentToBePaidForFrozenOrder')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeAdvanceBookingModel',
            '1-minPercentToBePaidForFrozenOrder',
            [
              this.fieldValidatorsService.percentageField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // new
        });
      this.translateService
        .get('pw.locationMaster.minPercentToBePaidForNonFrozenOrder')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeAdvanceBookingModel',
            '1-minPercentToBePaidForNonFrozenOrder',
            [
              this.fieldValidatorsService.percentageField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // new
        });
      this.translateService
        .get('pw.locationMaster.abHoldTime')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeAdvanceBookingModel',
            '1-abHoldTime',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // new
        });
      this.translateService
        .get('pw.locationMaster.validityDaysforAutoClosureInCustomerOrder')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCustomerOrderModel',
            '1-daysForAutoClosure',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.validityDaysforActivateInCustomerOrder')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCustomerOrderModel',
            '1-daysForActivate',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.noOfDaysForAutoApproval')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCustomerOrderModel',
            '1-daysForAutoApproval',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
      this.translateService
        .get('pw.locationMaster.coHoldTime')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCustomerOrderModel',
            '1-coHoldTime',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
          // new
        });
      this.translateService
        .get('pw.locationMaster.noOfDaysForReturnAutoApproval')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCustomerOrderModel',
            '1-daysForReturnAutoApproval',
            [
              this.fieldValidatorsService.daysField(fieldNameTranslate),
              this.fieldValidatorsService.requiredField(fieldNameTranslate),
              Validators.required
            ]
          );
        });
    } else {
      this.translateService
        .get('pw.locationMaster.maximumAmount')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeGiftCardModel',
            '1-maxAmount',
            [this.fieldValidatorsService.amountField(fieldNameTranslate)]
          );
        });
      this.translateService
        .get('pw.locationMaster.minimumAmount')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeGiftCardModel',
            '1-minAmount',
            [this.fieldValidatorsService.amountField(fieldNameTranslate)]
          );
        });

      this.translateService
        .get('pw.locationMaster.caratacceptedforGEP')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeGEPModel',
            '1-karatAcceptedForGEP',
            [this.fieldValidatorsService.numbersField(fieldNameTranslate)]
          );
        });
      this.translateService
        .get('pw.locationMaster.GEPHoldTime')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeGEPModel',
            '1-gepHoldTime',
            [this.fieldValidatorsService.numbersField(fieldNameTranslate)]
          );
        });
      this.translateService
        .get('pw.locationMaster.tepHoldTime')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeTepModel',
            '1-tepHoldTime',
            [this.fieldValidatorsService.numbersField(fieldNameTranslate)]
          );
        });
      this.translateService
        .get('pw.locationMaster.cmHoldTimeInMinutes')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCashMemoModel',
            '1-cmHoldTimeInMinutes',
            [this.fieldValidatorsService.numbersField(fieldNameTranslate)]
          );
        });
      this.translateService
        .get('pw.locationMaster.noOfHoursForOpenTaskDeletionCM')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCashMemoModel',
            '1-noOfHoursForOpenTaskDeletionCM',
            [this.fieldValidatorsService.amountField(fieldNameTranslate)]
          );
        });
      this.translateService
        .get('pw.locationMaster.numberOfHoursForOpenTaskDeletion')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeAdvanceBookingModel',
            '1-numberOfHoursForOpenTaskDeletion',
            [this.fieldValidatorsService.amountField(fieldNameTranslate)]
          );
        });

      this.translateService
        .get('pw.locationMaster.noOfDaysForSuspendingCreditNotes')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCreditNotesModel',
            '1-daysSuspendingCreditNotes',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.suspendingtransferredcreditnotes')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCreditNotesModel',
            '1-daysSuspendingTransferredCreditNotes',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.suspendinggracepcreditnotes')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCreditNotesModel',
            '1-suspensionGradeCreditNotes',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.MaxNoofCN')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCreditNotesModel',
            '1-maxCN',
            [this.fieldValidatorsService.numbersField(fieldNameTranslate)]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.MinimumOTPCNvalue')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCreditNotesModel',
            '1-minimumOTPCN',
            [this.fieldValidatorsService.numbersField(fieldNameTranslate)]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.MaxnumbereGHS')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCreditNotesModel',
            '1-maxNoEGHSCredit',
            [this.fieldValidatorsService.numbersField(fieldNameTranslate)]
          );
          // correct
        });

      this.translateService
        .get('pw.locationMaster.MaxHoursbillcancellationApproval')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeBillCancellationModel',
            '1-hoursForBillCancellation',
            [this.fieldValidatorsService.amountField(fieldNameTranslate)]
          );
          // new
        });

      // this.translateService
      //   .get('pw.locationMaster.GEPPureGoldPurity')
      //   .toPromise()
      //   .then(fieldNameTranslate => {
      //     this.helperFunctions.setConditionalValidators(
      //       formGroup,
      //       '1-transactionTypeGEPModel',
      //       '1-gepGoldPurity',
      //       [this.fieldValidatorsService.percentageField(fieldNameTranslate)]
      //     );
      //     // correct
      //   });
      // this.translateService
      //   .get('pw.locationMaster.GEPPureSilverPurity')
      //   .toPromise()
      //   .then(fieldNameTranslate => {
      //     this.helperFunctions.setConditionalValidators(
      //       formGroup,
      //       '1-transactionTypeGEPModel',
      //       '1-gepSilverPurity',
      //       [this.fieldValidatorsService.percentageField(fieldNameTranslate)]
      //     );
      //     // correct
      //   });

      // this.translateService
      //   .get('pw.locationMaster.GEPPurePlatinumPurity')
      //   .toPromise()
      //   .then(fieldNameTranslate => {
      //     this.helperFunctions.setConditionalValidators(
      //       formGroup,
      //       '1-transactionTypeGEPModel',
      //       '1-gepPlatinumPurity',
      //       [this.fieldValidatorsService.percentageField(fieldNameTranslate)]
      //     );
      //     // correct
      //   });

      this.translateService
        .get('pw.locationMaster.GEPStandaredDeductionGold')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeGEPModel',
            '1-gepDeductionGold',
            [this.fieldValidatorsService.percentageField(fieldNameTranslate)]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.GEPStandaredDeductionSilver')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeGEPModel',
            '1-gepDeductionSilver',
            [this.fieldValidatorsService.percentageField(fieldNameTranslate)]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.GEPStandaredDeductionPlatinum')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeGEPModel',
            '1-gepDeductionPlatinum',
            [this.fieldValidatorsService.percentageField(fieldNameTranslate)]
          );
          // correct
        });

      this.translateService
        .get('pw.locationMaster.validityDaysforAutoClosureInAdvanceBooking')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeAdvanceBookingModel',
            '1-daysAutoClosure',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
          // new
        });

      this.translateService
        .get('pw.locationMaster.validityDaysforActivateInAdvanceBooking')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeAdvanceBookingModel',
            '1-daysForActivate',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.validityDaysforReleaseInvInAdvancebooking')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeAdvanceBookingModel',
            '1-daysForRelease',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
          // correct
        });
      this.translateService
        .get('pw.locationMaster.minPercentToBePaidForFrozenOrder')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeAdvanceBookingModel',
            '1-minPercentToBePaidForFrozenOrder',
            [this.fieldValidatorsService.percentageField(fieldNameTranslate)]
          );
          // new
        });
      this.translateService
        .get('pw.locationMaster.minPercentToBePaidForNonFrozenOrder')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeAdvanceBookingModel',
            '1-minPercentToBePaidForNonFrozenOrder',
            [this.fieldValidatorsService.percentageField(fieldNameTranslate)]
          );
          // new
        });
      this.translateService
        .get('pw.locationMaster.abHoldTime')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeAdvanceBookingModel',
            '1-abHoldTime',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
          // new
        });
      this.translateService
        .get('pw.locationMaster.validityDaysforAutoClosureInCustomerOrder')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCustomerOrderModel',
            '1-daysForAutoClosure',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
        });
      this.translateService
        .get('pw.locationMaster.validityDaysforActivateInCustomerOrder')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCustomerOrderModel',
            '1-daysForActivate',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
        });
      this.translateService
        .get('pw.locationMaster.noOfDaysForAutoApproval')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCustomerOrderModel',
            '1-daysForAutoApproval',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
        });
      this.translateService
        .get('pw.locationMaster.coHoldTime')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCustomerOrderModel',
            '1-coHoldTime',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
          // new
        });
      this.translateService
        .get('pw.locationMaster.noOfDaysForReturnAutoApproval')
        .toPromise()
        .then(fieldNameTranslate => {
          this.helperFunctions.setConditionalValidators(
            formGroup,
            '1-transactionTypeCustomerOrderModel',
            '1-daysForReturnAutoApproval',
            [this.fieldValidatorsService.daysField(fieldNameTranslate)]
          );
        });
    }
  }

  invalidForm($event: boolean) {
    if ($event) {
      this.alertPopupService.open({
        type: AlertPopupTypeEnum.ERROR,
        message: 'pw.inventoryMasters.invalidAlert'
      });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
