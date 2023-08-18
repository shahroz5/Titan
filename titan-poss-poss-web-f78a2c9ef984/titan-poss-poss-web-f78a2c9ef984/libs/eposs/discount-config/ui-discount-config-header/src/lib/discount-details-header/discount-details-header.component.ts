import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  DiscountTypeEnum,
  NewDiscountDetails,
  AlertPopupTypeEnum,
  AlertPopupServiceAbstraction,
  OverlayNotificationType,
  OverlayNotificationServiceAbstraction
} from '@poss-web/shared/models';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import { TranslateService } from '@ngx-translate/core';
import * as moment from 'moment';
@Component({
  selector: 'poss-web-discount-details-header',
  templateUrl: './discount-details-header.component.html'
})
export class DiscountDetailsHeaderComponent
  implements OnInit, OnChanges, AfterViewInit {
  @Input() discountTypes;
  @Input() clubbingDiscountTypes;
  @Input() discountWorkflow;
  @Input() tabType;
  @Input() approvers;
  @Input() applicableLevels;
  @Input() subBrands;
  @Input() brands;
  @Input() discountDetails;
  @Input() disable;
  @Input() isLocationData;
  @Input() isCategoryPgData;
  @Input() isSlabData;
  @Input() uploadedFaqFileData;
  @Input() downloadFileResponse;
  @Output() discountSelected = new EventEmitter<any>();
  @Output() formOutput = new EventEmitter<NewDiscountDetails>();
  @Output() isActiveValue = new EventEmitter<boolean>();
  @Output() brandCode = new EventEmitter<string>();
  @Output() formChanged = new EventEmitter<boolean>();
  @Output() faqFileUpload = new EventEmitter<any>();
  @Output() faqFileDownload = new EventEmitter<any>();
  selectedDiscount: DiscountTypeEnum = DiscountTypeEnum.CATEGORY_DISCOUNT;
  form: FormGroup;
  DiscountTypeEnumRef = DiscountTypeEnum;
  isABOfferApplicable = this.enableAbCoConfig();
  isCOOfferApplicable = this.enableAbCoConfig();
  isRiva = this.enableRiva();
  isPreviewApplicable = false;
  enableClose = false;

  destroy$ = new Subject<null>();
  params: any;
  levels = [
    { value: 'L1', description: 'LEVEL 1' },
    { value: 'L2', description: 'LEVEL 2' },
    { value: 'L3', description: 'LEVEL 3' }
  ];
  discountCodeLabel = '';
  occasionLabel = '';
  subBarndCodeLabel = '';
  approvedByLabel = '';
  discountTypeLabel = '';
  descriptionLabel = '';
  applicableLevelLabel = '';
  remarksLabel = '';
  isActive = true;

  encircleDateLabel: any;
  isPreview = false;
  disableSave: boolean;
  brand: any;
  checkValue: any;
  checkValueAb: any;
  checkValueCo: any;
  checkValuePreview: any;
  checkValueRivaah: any;
  saveHeader = false;
  originalApplicableLevels: any;

  fileName = 'View FAQ Document';
  previewHeader = 'FAQ Document';

  constructor(
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private activatedRoute: ActivatedRoute,
    private alertPopupService: AlertPopupServiceAbstraction,
    private overlayNotification: OverlayNotificationServiceAbstraction
  ) {
    this.translate
      .get([
        'pw.discountConfig.discountCodeLabel',
        'pw.discountConfig.occasionLabel',
        'pw.discountConfig.subBarndCodeLabel',
        'pw.discountConfig.approvedByLabel',
        'pw.discountConfig.discountTypeLabel',
        'pw.discountConfig.descriptionLabel',
        'pw.discountConfig.applicableLevelLabel',
        'pw.discountConfig.remarksLabel',
        'pw.discountConfig.applicableEncircleCreationDate'
      ])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: any) => {
        this.discountCodeLabel =
          translatedMessages['pw.discountConfig.discountCodeLabel'];
        this.occasionLabel =
          translatedMessages['pw.discountConfig.occasionLabel'];
        this.subBarndCodeLabel =
          translatedMessages['pw.discountConfig.subBarndCodeLabel'];
        this.approvedByLabel =
          translatedMessages['pw.discountConfig.approvedByLabel'];
        this.discountTypeLabel =
          translatedMessages['pw.discountConfig.discountTypeLabel'];
        this.descriptionLabel =
          translatedMessages['pw.discountConfig.descriptionLabel'];
        this.applicableLevelLabel =
          translatedMessages['pw.discountConfig.applicableLevelLabel'];
        this.remarksLabel =
          translatedMessages['pw.discountConfig.remarksLabel'];
        this.encircleDateLabel =
          translatedMessages[
            'pw.discountConfig.applicableEncircleCreationDate'
          ];
      });
  }
  ngOnInit() {
    this.isPreviewApplicable = this.discountDetails.isPreviewApplicable
      ? this.discountDetails.isPreviewApplicable
      : null;

    this.selectedDiscount = this.discountDetails.discountType
      ? this.discountDetails.discountType
      : this.selectedDiscount;
    this.initForm(this.discountDetails);

    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(param => {
        this.params = param['_configId'];
        if (this.params !== 'new' && this.form) {
          this.form.get('discountCode').disable();
          this.form.get('occasion').disable();
        }
      });
    this.isActive =
      this.params === 'new' ? true : this.discountDetails.isActive;

    this.form
      .get('discountType')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(value => {
        this.setValidation();
      });
    this.form.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(value => {
      if (
        value &&
        this.params !== 'new' &&
        !this.form?.pristine &&
        this.form?.dirty
      ) {
        this.saveHeader = true;

        this.formChanged.emit(this.saveHeader);
      }
    });
    if (this.discountWorkflow && this.tabType === 'approval') {
      this.form?.get('description').disable();
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    console.log('check changes');

    if (changes['discountDetails'] && this.form) {
      this.form.markAsPristine();
    }
    if (changes['selectedDiscount']) {
    }
    if (changes['applicableLevels']) {
      this.originalApplicableLevels = this.applicableLevels;
      if (this.selectedDiscount === DiscountTypeEnum.EMPOWERMENT_DISCOUNT) {
        this.applicableLevels = this.applicableLevels.filter(
          levels => levels.code === 'L1' || levels.code === 'L2'
        );
      } else {
        this.applicableLevels = this.originalApplicableLevels;
      }
    }
    if (!this.isLocationData) this.form?.get('isPreviewApplicable').enable();
    if (changes['disable']) {
      this.disableSave = this.disable;
    }
    if (changes['subBrands']) {
      this.subBrands = this.subBrands;
    }
    if (changes['brands']) {
      this.brands = this.brands;
      if (this.params === 'new' && this.brands && this.brands.length !== 0) {
        this.form?.get('brandCode')?.patchValue(this.brands[0].value);
        this.form?.get('brandCode')?.updateValueAndValidity();
      }
    }
    if (changes['isLocationData']) {
      this.isLocationData = this.isLocationData;
    }
    if (changes['discountWorkflow']) {
      this.form
        ?.get('approvedBy')
        .setValidators(this.createValidators(this.approvedByLabel));
    }
    if (changes['isCategoryPgData']) {
      this.isCategoryPgData = this.isCategoryPgData;
    }
    if (changes['isSlabData']) {
      this.isSlabData = this.isSlabData;
    }
    if (this.params !== 'new' && (this.isSlabData || this.isCategoryPgData)) {
      this.checkValueAb = true;
      this.checkValueCo = true;
      this.checkValueRivaah = true;
    } else if (
      this.params !== 'new' &&
      (!this.isSlabData || !this.isCategoryPgData)
    ) {
      this.checkValueAb = false;
      this.checkValueCo = false;
      this.checkValueRivaah = false;
    }
    if (
      this.params !== 'new' &&
      (this.isSlabData || this.isCategoryPgData || this.isLocationData)
    ) {
      this.checkValuePreview = true;
    } else if (
      this.params !== 'new' &&
      (!this.isSlabData || !this.isCategoryPgData || !this.isLocationData)
    ) {
      this.checkValuePreview = false;
    }
  }
  ngAfterViewInit() {}
  initForm(discountDetails) {
    this.form = new FormGroup({
      discountCode: new FormControl(discountDetails.discountCode, [
        this.fieldValidatorsService.requiredField(this.discountCodeLabel),
        this.fieldValidatorsService.maxLength(50, this.discountCodeLabel)
      ]),
      occasion: new FormControl(discountDetails.occasion, [
        (this.fieldValidatorsService.requiredField(this.occasionLabel),
        this.fieldValidatorsService.maxLength(50, this.occasionLabel))
      ]),
      brandCode: new FormControl(discountDetails.brandCode, [
        this.fieldValidatorsService.requiredField('Brand Code')
      ]),
      subBrandCode: new FormControl(discountDetails.subBrandCode, [
        this.fieldValidatorsService.requiredField(this.subBarndCodeLabel)
      ]),
      approvedBy: new FormControl(
        discountDetails.approvedBy,
        this.createValidators(this.approvedByLabel)
      ),
      discountType: new FormControl(
        this.params === 'new' ? '' : discountDetails.discountType,
        [this.fieldValidatorsService.requiredField(this.discountTypeLabel)]
      ),
      description: new FormControl(discountDetails.description, [
        this.fieldValidatorsService.maxLength(250, this.descriptionLabel)
      ]),
      accrualUlpPoints: new FormControl(
        discountDetails.isAccrualUlpPoints
          ? discountDetails.isAccrualUlpPoints
          : false
      ),
      applicableLevel: new FormControl(discountDetails.applicableLevels),
      remarks: new FormControl(discountDetails.remarks, [
        this.fieldValidatorsService.remarkField(this.remarksLabel)
      ]),
      isRiva: new FormControl(
        discountDetails.isRiva ? discountDetails.isRiva : false
      ),
      isActive: new FormControl(discountDetails.isActive),
      isPreviewApplicable: new FormControl(
        discountDetails.isPreviewApplicable
          ? discountDetails.isPreviewApplicable
          : false
      ),
      isCOOfferApplicable: new FormControl(
        discountDetails.isCoOfferApplicable
          ? discountDetails.isCoOfferApplicable
          : false
      ),
      isABOfferApplicable: new FormControl(
        discountDetails.isAbOfferApplicable
          ? discountDetails.isAbOfferApplicable
          : false
      ),
      ulpCreateDate: new FormControl(
        discountDetails.ulpCreateDate
          ? moment(discountDetails.ulpCreateDate)
          : null
      )
    });

    this.discountSelected.emit(
      discountDetails.discountType
        ? discountDetails.discountType
        : this.selectedDiscount
    );
  }

  dataCheckPopup() {
    this.alertPopupService.open({
      type: AlertPopupTypeEnum.ERROR,
      message: 'Please remove mapped data to change the configuration'
    });
  }

  createValidators(label: string) {
    let validators = [];

    if (!this.discountWorkflow) {
      validators.push(this.fieldValidatorsService.requiredField(label));
    }

    return validators;
  }

  refreshClick() {
    console.log(
      '%cLog%cline:301%cRefresh clicked',
      'color:#fff;background:#ee6f57;padding:3px;border-radius:2px',
      'color:#fff;background:#1f3c88;padding:3px;border-radius:2px',
      'color:#fff;background:rgb(56, 13, 49);padding:3px;border-radius:2px',
      'Refresh clicked'
    );
  }
  setValidation() {
    const applicableLevelCtrl = this.form.get('applicableLevel');
    if (this.params === 'new') this.form.patchValue({ applicableLevel: null });

    if (
      this.form?.get('discountType').value ===
        DiscountTypeEnum.SYSTEM_DISCOUNT ||
      this.form?.get('discountType').value ===
        DiscountTypeEnum.SYSTEM_DISCOUNT_DV ||
      this.form?.get('discountType').value ===
        DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY ||
      this.form?.get('discountType').value ===
        DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS ||
      this.form?.get('discountType').value ===
        DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT ||
      this.form?.get('discountType').value ===
        DiscountTypeEnum.BEST_DEAL_DISCOUNT
    ) {
      applicableLevelCtrl.setValidators([]);
    } else {
      applicableLevelCtrl.setValidators([
        this.fieldValidatorsService.requiredField(this.applicableLevelLabel)
      ]);
    }
    applicableLevelCtrl.updateValueAndValidity();
  }

  getActiveStatus(event) {
    this.isActive = event.checked;
    this.isActiveValue.emit(event.checked);
  }
  emitBrandCode(event?) {
    const code = event ? event.value : this.form.get('brandCode').value;

    if (code) {
      this.brandCode.emit(code);
    }
  }
  saveForm() {
    if (this.uploadedFaqFileData) {
      this.uploadedFaqFileData = JSON.parse(this.uploadedFaqFileData);
    }
    if (
      this.discountDetails?.discountCode &&
      this.discountDetails?.discountCode !== '' &&
      !this.discountDetails?.isActive
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      const values = this.form.getRawValue();

      this.formOutput.emit({
        discountCode: values.discountCode,
        occasion: values.occasion,
        brandCode: values.brandCode,
        subBrandCode: values.subBrandCode,
        approvedBy: values.approvedBy,
        discountType: values.discountType,
        description: values.description ? values.description : null,
        isAccrualUlpPoints: values.accrualUlpPoints,
        applicableLevels: values.applicableLevel
          ? values.applicableLevel
          : null,
        remarks: values.remarks ? values.remarks : null,
        isActive: this.isActive,
        isRiva: values.isRiva,
        isCoOfferApplicable: values.isCOOfferApplicable,
        isPreviewApplicable: values.isPreviewApplicable,
        isAbOfferApplicable: values.isABOfferApplicable,
        ulpCreateDate: values.ulpCreateDate,
        ...(!!this.uploadedFaqFileData && {
          workflowFileUploadDetails: {
            type: 'WORKFLOW_FILE_UPLOAD_DETAILS',
            data: {
              fileId: this.uploadedFaqFileData?.fileId
                ? this.uploadedFaqFileData?.fileId
                : null,
              fileName: this.uploadedFaqFileData?.fileName
                ? this.uploadedFaqFileData?.fileName
                : null
            }
          }
        })
      });
    }
  }
  showMessage(key: string) {
    this.translate
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
  applicableLevelsMandatoryCheck() {
    return this.selectedDiscount !== DiscountTypeEnum.SYSTEM_DISCOUNT;
  }
  enableRiva() {
    return (
      this.selectedDiscount === DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.CATEGORY_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.HIGH_VALUE_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.BEST_DEAL_DISCOUNT
    );
  }
  enableAbCoConfig() {
    return (
      this.selectedDiscount === DiscountTypeEnum.CATEGORY_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.HIGH_VALUE_DISCOUNT
    );
  }
  enablePreviewAvailable() {
    return (
      this.selectedDiscount === DiscountTypeEnum.CATEGORY_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.HIGH_VALUE_DISCOUNT
    );
  }
  enableAccuralEncircle() {
    return (
      this.selectedDiscount === DiscountTypeEnum.CATEGORY_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.ULP_BIRTHDAY ||
      this.selectedDiscount === DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY ||
      this.selectedDiscount === DiscountTypeEnum.ULP_ANNIVERSARY ||
      this.selectedDiscount === DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.COIN_OFFER_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.BEST_DEAL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.HIGH_VALUE_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.EMPOWERMENT_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.SYSTEM_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.TSSS_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.EMPLOYEE_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.BILL_LEVEL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.CO_BILL_LEVEL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT
    );
  }
  enableApplicableEncircle() {
    return (
      this.selectedDiscount === DiscountTypeEnum.CATEGORY_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.BEST_DEAL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.HIGH_VALUE_DISCOUNT
    );
  }
  enableApplicableLevel() {
    return (
      this.selectedDiscount === DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.EXCHANGE_OFFER_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.ULP_BIRTHDAY ||
      this.selectedDiscount === DiscountTypeEnum.ULP_SPOUSE_BIRTHDAY ||
      this.selectedDiscount === DiscountTypeEnum.ULP_ANNIVERSARY ||
      this.selectedDiscount === DiscountTypeEnum.CATEGORY_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.SLAB_BASED_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.BILL_LEVEL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.CO_BILL_LEVEL_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.EMPLOYEE_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.TSSS_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.HIGH_VALUE_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.EMPOWERMENT_DISCOUNT ||
      this.selectedDiscount === DiscountTypeEnum.COIN_OFFER_DISCOUNT
    );
  }
  selectChangeHandler(event: any) {
    this.selectedDiscount = event.value;
    this.discountSelected.emit(this.selectedDiscount);
    this.isABOfferApplicable = this.enableAbCoConfig();
    this.isCOOfferApplicable = this.enableAbCoConfig();
    this.isRiva = this.enableRiva();
    if (this.selectedDiscount === DiscountTypeEnum.EMPOWERMENT_DISCOUNT) {
      this.applicableLevels = this.applicableLevels.filter(
        levels => levels.code === 'L1' || levels.code === 'L2'
      );
    } else {
      this.applicableLevels = this.originalApplicableLevels;
    }
  }

  abOfferApplicableChangeFn(isChecked) {
    this.isABOfferApplicable = isChecked;
    if (this.checkValueAb) {
      this.dataCheckPopup();
      return false;
    } else return true;
  }

  coOfferApplicableChangeFn(isChecked) {
    this.isCOOfferApplicable = isChecked;
    if (this.checkValueCo) {
      this.dataCheckPopup();
      return false;
    } else return true;
  }

  rivaAvailableOfferChangeFn(isChecked) {
    this.isRiva = isChecked;
    if (this.checkValueRivaah) {
      this.dataCheckPopup();
      return false;
    } else {
      return true;
    }
  }
  previewAvailableChangeFn() {
    if (this.checkValuePreview) {
      this.dataCheckPopup();
      return false;
    } else {
      this.checkValuePreview = false;
      return true;
    }
  }

  previewChange(event) {
    this.isPreviewApplicable = event.checked;
    const encircleCtrl = this.form?.get('ulpCreateDate');
    if (this.isPreviewApplicable) {
      this.isPreview = true;
      encircleCtrl.enable();
      encircleCtrl.setValidators([
        this.fieldValidatorsService.requiredField(this.encircleDateLabel)
      ]);
      encircleCtrl.markAsTouched();
    } else {
      this.isPreview = false;
      encircleCtrl.setValidators([]);
      encircleCtrl.disable();
    }
    encircleCtrl.updateValueAndValidity();
  }

  upload(event) {
    const fileList: FileList = event;
    const formData: FormData = new FormData();
    if (fileList.length > 0) {
      formData.append('file', fileList.item(0));
      const uploadData = {
        docType: 'DISCOUNT_WORKFLOW',
        file: formData,
        fileType: 'OTHERS'
      };

      this.faqFileUpload.emit(uploadData);
    }
  }

  downloadDocument(event) {
    if (event) {
      this.faqFileDownload.emit(JSON.parse(this.uploadedFaqFileData));
    }
  }

  downloadPreviewDocument(event) {
    if (event) {
      this.faqFileDownload.emit(
        this.discountDetails?.workflowFileUploadDetails?.data
      );
    }
  }

  uploadError(event: string) {
    this.showMessage(event);
  }
}
