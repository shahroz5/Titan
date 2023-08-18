// import {
//   ChangeDetectorRef,
//   Component,
//   EventEmitter,
//   Input,
//   OnDestroy,
//   OnInit,
//   Output
// } from '@angular/core';
// import { FormGroup } from '@angular/forms';
// import { MatDialog } from '@angular/material/dialog';
// import { TranslateService } from '@ngx-translate/core';
// import { TEMPLATE19 } from '@poss-web/shared/components/ui-dynamic-form';
// import {
//   BrandMasterDetails,
//   NetInvoiceEnum,
//   AlertPopupTypeEnum,
//   AlertPopupServiceAbstraction,
//   OverlayNotificationServiceAbstraction,
//   OverlayNotificationEventType,
//   OverlayNotificationType
// } from '@poss-web/shared/models';
// import {
//   TcsConfigBullionModel,
//   TcsConfigFormSixtyModel,
//   TcsConfigJewelryModel,
//   TcsConfigMainFormModel,
//   TcsConfigModel,
//   TcsConfigSilverPlatinumModel
// } from '@poss-web/shared/ui-master-form-models';
// import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
// import { Subject } from 'rxjs';
// import { takeUntil } from 'rxjs/operators';

// @Component({
//   selector: 'poss-web-tcs-config-form',
//   template: `
//     <poss-web-dynamic-form
//       *ngIf="formFields"
//       [style]="currentStyle"
//       [formFields]="formFields"
//       [disabled]="false"
//       [enableSubmitOnInvalid]="true"
//       [buttonNames]="['pw.locationMaster.cancel', 'pw.locationMaster.save']"
//       (addForm)="addButton($event)"
//       (deleteForm)="deleteButton($event)"
//       (invalidForm)="invalidForm($event)"
//       (formGroupCreated)="formGroupCreated($event)"
//     >
//     </poss-web-dynamic-form>
//   `,
//   styles: []
// })
// export class TcsConfigFormComponent implements OnInit, OnDestroy {
//   constructor(
//     private translateService: TranslateService,
//     private fieldValidatorsService: FieldValidatorsService,
//     private cdr: ChangeDetectorRef,
//     public dialog: MatDialog,
//     private alertPopupService: AlertPopupServiceAbstraction,
//     private overlayNotification: OverlayNotificationServiceAbstraction
//   ) {}

//   @Input() brandMasterDetails: BrandMasterDetails;
//   @Output() formOutput = new EventEmitter<BrandMasterDetails>();

//   destroy$: Subject<null> = new Subject<null>();

//   public formFields: any;
//   public currentStyle: string[];

//   ngOnInit(): void {
//     const form = this.prepareSet();
//     this.formFields = this.getInputs(form);
//     this.currentStyle = this.getCssProp();
//   }

//   prepareSet() {
//     // ---------------------
//     const tcsConfig_checkBox = [
//       {
//         id: '1',
//         name: 'pw.brandMaster.advancedCreditNoteAllowed',
//         checked: this.brandMasterDetails.taxDetails
//           ? this.brandMasterDetails.taxDetails.data.isAdvancedCNAllowed
//             ? this.brandMasterDetails.taxDetails.data.isAdvancedCNAllowed
//             : false
//           : false
//       },
//       {
//         id: '2',
//         name: 'pw.brandMaster.ghsAllowed',
//         checked: this.brandMasterDetails.taxDetails
//           ? this.brandMasterDetails.taxDetails.data.isGhsAllowed
//             ? this.brandMasterDetails.taxDetails.data.isGhsAllowed
//             : false
//           : false
//       },
//       {
//         id: '3',
//         name: 'pw.brandMaster.onSingleInvoice',
//         checked: this.brandMasterDetails.taxDetails
//           ? this.brandMasterDetails.taxDetails.data.isOnSingleInvoice
//             ? this.brandMasterDetails.taxDetails.data.isOnSingleInvoice
//             : false
//           : false
//       }
//     ];

//     const tcsConfigModel = new TcsConfigModel(
//       1,
//       tcsConfig_checkBox,
//       this.fieldValidatorsService,
//       this.translateService
//     );

//     const tcsConfigJewelryModel = new TcsConfigJewelryModel(
//       1,
//       this.brandMasterDetails.taxDetails
//         ? this.brandMasterDetails.taxDetails.data
//           ? this.brandMasterDetails.taxDetails.data?.jewellery?.cashAmount
//             ? this.brandMasterDetails.taxDetails.data?.jewellery?.cashAmount
//             : ''
//           : ''
//         : '' /* cashAmount */,
//       this.brandMasterDetails.taxDetails
//         ? this.brandMasterDetails.taxDetails.data
//           ? this.brandMasterDetails.taxDetails.data?.jewellery?.netInvoiceAmount
//             ? this.brandMasterDetails.taxDetails.data?.jewellery
//                 ?.netInvoiceAmount
//             : ''
//           : ''
//         : '' /* netInvoiceAmount */,
//       this.brandMasterDetails.taxDetails
//         ? this.brandMasterDetails.taxDetails.data
//           ? this.brandMasterDetails.taxDetails.data?.jewellery?.panCardPercent
//             ? this.brandMasterDetails.taxDetails.data?.jewellery?.panCardPercent
//             : ''
//           : ''
//         : '' /* PanCardPercent */,
//       this.fieldValidatorsService,
//       this.translateService
//     );

//     const tcsConfigJewlryRadio = [
//       {
//         id: NetInvoiceEnum.NET_INVOICE_AMOUNT,
//         name: 'pw.brandMaster.onNetInvoiceAmount',
//         checked: this.brandMasterDetails.taxDetails
//           ? this.brandMasterDetails.taxDetails.data.form60.isNetInvoice
//             ? this.brandMasterDetails.taxDetails.data.form60.isNetInvoice ===
//               NetInvoiceEnum.NET_INVOICE_AMOUNT
//             : false
//           : false
//       },
//       {
//         id: NetInvoiceEnum.CASH_COLLECTED_AMOUNT,
//         name: 'pw.brandMaster.onCashCollectedAmount',
//         checked: this.brandMasterDetails.taxDetails
//           ? this.brandMasterDetails.taxDetails.data.form60.isNetInvoice
//             ? this.brandMasterDetails.taxDetails.data.form60.isNetInvoice ===
//               NetInvoiceEnum.CASH_COLLECTED_AMOUNT
//             : false
//           : false
//       }
//     ];

//     const tcsConfigFormSixtyModel = new TcsConfigFormSixtyModel(
//       1,
//       this.brandMasterDetails.taxDetails
//         ? this.brandMasterDetails.taxDetails.data
//           ? this.brandMasterDetails.taxDetails.data?.form60
//               ?.indianCustomerPercent
//             ? this.brandMasterDetails.taxDetails.data?.form60
//                 ?.indianCustomerPercent
//             : ''
//           : ''
//         : '' /* indianCustomerPercent */,
//       this.brandMasterDetails.taxDetails
//         ? this.brandMasterDetails.taxDetails.data
//           ? this.brandMasterDetails.taxDetails.data?.form60
//               ?.nonIndianCustomerPercent
//             ? this.brandMasterDetails.taxDetails.data.form60
//                 .nonIndianCustomerPercent
//             : ''
//           : ''
//         : '' /* nonIndianCustomerPercent */,
//       tcsConfigJewlryRadio,
//       this.fieldValidatorsService,
//       this.translateService
//     );

//     const tcsConfigBullionModel = new TcsConfigBullionModel(
//       1,
//       this.brandMasterDetails.taxDetails
//         ? this.brandMasterDetails.taxDetails.data
//           ? this.brandMasterDetails.taxDetails.data?.bullion?.cashAmount
//             ? this.brandMasterDetails.taxDetails.data?.bullion?.cashAmount
//             : ''
//           : ''
//         : '' /* cashAmount */,
//       this.brandMasterDetails.taxDetails
//         ? this.brandMasterDetails.taxDetails.data
//           ? this.brandMasterDetails.taxDetails.data?.bullion?.unitWeight
//             ? this.brandMasterDetails.taxDetails.data?.bullion?.unitWeight
//             : ''
//           : ''
//         : '' /* unitWeight */,
//       this.brandMasterDetails.taxDetails
//         ? this.brandMasterDetails.taxDetails.data
//           ? this.brandMasterDetails.taxDetails.data?.bullion?.netInvoiceAmount
//             ? this.brandMasterDetails.taxDetails.data?.bullion?.netInvoiceAmount
//             : ''
//           : ''
//         : '' /* netInvoiceAmount */,
//       this.fieldValidatorsService,
//       this.translateService
//     );

//     const tcsConfigSilverPlatinum_checkBox = [
//       {
//         id: '1',
//         name: 'pw.brandMaster.isPlatinumAllowedForTCS',
//         checked: this.brandMasterDetails.taxDetails
//           ? this.brandMasterDetails.taxDetails.data.silverPlatinumConfig
//               .isPlatinumAllowed
//             ? this.brandMasterDetails.taxDetails.data.silverPlatinumConfig
//                 .isPlatinumAllowed
//             : false
//           : false
//       },
//       {
//         id: '2',
//         name: 'pw.brandMaster.isSilverAllowedForTCS',
//         checked: this.brandMasterDetails.taxDetails
//           ? this.brandMasterDetails.taxDetails.data.silverPlatinumConfig
//               .isSilverAllowed
//             ? this.brandMasterDetails.taxDetails.data.silverPlatinumConfig
//                 .isSilverAllowed
//             : false
//           : false
//       }
//     ];

//     const tcsConfigSilverPlatinumModel = new TcsConfigSilverPlatinumModel(
//       1,
//       tcsConfigSilverPlatinum_checkBox,
//       this.fieldValidatorsService,
//       this.translateService
//     );

//     const detailsmain = new TcsConfigMainFormModel(
//       1,
//       tcsConfigModel,
//       tcsConfigJewelryModel,
//       tcsConfigFormSixtyModel,
//       tcsConfigBullionModel,
//       tcsConfigSilverPlatinumModel
//     );

//     return detailsmain;
//   }

//   getCssProp() {
//     // const annot = (LocationFormComponent as any).__annotations__;
//     // return annot[0].styles;

//     return [];
//   }

//   public getInputs(form: any) {
//     return {
//       formConfig: this.setFormConfig(),
//       formFields: form.buildFormFields()
//     };
//   }

//   public setFormConfig() {
//     return {
//       formName: 'pw.brandMaster.tcsConfiguration',
//       formDesc: '',
//       formTemplate: TEMPLATE19
//     };
//   }

//   public addButton(formGroup: FormGroup) {
//     const formData = formGroup.getRawValue();

//     const brandDetails: BrandMasterDetails = {
//       brandCode: this.brandMasterDetails.brandCode,
//       taxDetails: {
//         type: 'TAX_DETAILS',
//         data: {
//           isAdvancedCNAllowed:
//             formData['1-tcsConfigModel']['1-tcsConfig_checkBox'][0],
//           isGhsAllowed: formData['1-tcsConfigModel']['1-tcsConfig_checkBox'][1],
//           isOnSingleInvoice:
//             formData['1-tcsConfigModel']['1-tcsConfig_checkBox'][2],
//           jewellery: {
//             cashAmount: formData['1-tcsConfigJewelryModel']['1-cashAmountJ'],
//             netInvoiceAmount:
//               formData['1-tcsConfigJewelryModel']['1-netInvoiceAmountJ'],
//             panCardPercent:
//               formData['1-tcsConfigJewelryModel']['1-panCardPercent']
//           },
//           form60: {
//             indianCustomerPercent:
//               formData['1-tcsConfigFormSixtyModel']['1-indianCustomerPercent'],
//             nonIndianCustomerPercent:
//               formData['1-tcsConfigFormSixtyModel'][
//                 '1-nonIndianCustomerPercent'
//               ],
//             isNetInvoice:
//               formData['1-tcsConfigFormSixtyModel']['1-tcsConfigJewlryRadio']
//           },
//           bullion: {
//             cashAmount: formData['1-tcsConfigBullionModel']['1-cashAmount'],
//             unitWeight: formData['1-tcsConfigBullionModel']['1-unitWeight'],
//             netInvoiceAmount:
//               formData['1-tcsConfigBullionModel']['1-netInvoiceAmount']
//           },
//           silverPlatinumConfig: {
//             isPlatinumAllowed:
//               formData['1-tcsConfigSilverPlatinumModel'][
//                 '1-tcsConfigSilverPlatinum_checkBox'
//               ][0],
//             isSilverAllowed:
//               formData['1-tcsConfigSilverPlatinumModel'][
//                 '1-tcsConfigSilverPlatinum_checkBox'
//               ][1]
//           }
//         }
//       }
//     };

//     this.alertPopupService
//       .open({
//         type: AlertPopupTypeEnum.CONFIRM,
//         message: 'pw.alertPopup.saveConfirmation'
//       })
//       .pipe(takeUntil(this.destroy$))
//       .subscribe((res: boolean) => {
//         if (res) {
//           this.formOutput.emit(brandDetails);
//         }
//       });
//   }

//   public formGroupCreated() {
//     // if (this.locationDetails.factoryCodeValue === LocationTypeLists.BTQ) {
//     //   this.helperFunctions.setRequiredValidators(
//     //     formGroup,
//     //     '1-otpDetailsModel',
//     //     '1-helpdeskEmailId',
//     //     true
//     //   );
//     // } else {
//     //   this.helperFunctions.setRequiredValidators(
//     //     formGroup,
//     //     '1-otpDetailsModel',
//     //     '1-helpdeskEmailId',
//     //     false
//     //   );
//     // }
//   }

//   invalidForm($event: boolean) {
//     if ($event) {
//       this.alertPopupService.open({
//         type: AlertPopupTypeEnum.ERROR,
//         message: 'pw.inventoryMasters.invalidAlert'
//       });
//       // const dialogRef = this.dialog.open(ValidationAlertDialogComponent, {
//       //   width: '500px',
//       //   height: 'auto',
//       //   disableClose: true,
//       //   data: 'pw.inventoryMasters.invalidAlert'
//       // });
//       // dialogRef.afterClosed().pipe(takeUntil(this.destroy$)).subscribe();
//     }
//   }

//   public deleteButton() {
//     this.alertPopupService
//       .open({
//         type: AlertPopupTypeEnum.CONFIRM,
//         message: 'pw.inventoryMasters.cancelConfirmation'
//       })
//       .pipe(takeUntil(this.destroy$))
//       .subscribe((res: boolean) => {
//         if (res) {
//           this.ngOnDestroy();
//           this.destroy$ = new Subject<null>();
//           this.ngOnInit();
//           this.cdr.detectChanges();
//         }
//       });
//   }

//   ngOnDestroy(): void {
//     this.destroy$.next();
//     this.destroy$.complete();
//   }
// }
