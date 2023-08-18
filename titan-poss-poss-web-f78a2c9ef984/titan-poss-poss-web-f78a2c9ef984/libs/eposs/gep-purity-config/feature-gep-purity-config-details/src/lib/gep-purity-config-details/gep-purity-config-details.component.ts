import {
  Component,
  Inject,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { GEPPurityConfigFacade } from '@poss-web/eposs/gep-purity-config/data-access-gep-purity-config';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import { FileuploadConfirmationPopupComponent } from '@poss-web/shared/components/ui-fileupload-confirmation-popup';
import { SelectionDailogOption } from '@poss-web/shared/components/ui-selection-dialog';
import { LocationMappingFacade } from '@poss-web/shared/location-mapping/data-access-location-mapping';
import {
  AlertPopupServiceAbstraction,
  AlertPopupTypeEnum,
  ConfigTypeEnum,
  CustomErrors,
  ExcludeItemCodes,
  ExcludeThemeCodes,
  FileNamesEnum,
  FilePathEnum,
  FileResponse,
  FileUploadTypeEnum,
  GepDetails,
  GepPurityConfigEnums,
  LocationMappingServiceAbstraction,
  Lov,
  MetalType,
  OverlayNotificationEventRef,
  OverlayNotificationEventType,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  ProductGroup,
  ProductGroupMappingFormType,
  ProductGroupMappingOption,
  ProductGroupMappingServiceAbstraction,
  ProductGroupsDeduction,
  ProductGroupWithFormServiceResponse,
  PurityDetailsResponse,
  Ranges,
  RivaahExchangeConfig
} from '@poss-web/shared/models';
import { FileDownloadService } from '@poss-web/shared/util-common';
import {
  POSS_WEB_CURRENCY_CODE,
  POSS_WEB_EXCLUDE_ITEM_CODES_FILE_SIZE
} from '@poss-web/shared/util-config';
import { FieldValidatorsService } from '@poss-web/shared/util-field-validators';
import {
  getFileStatusRouteUrl,
  getGepPurityConfigurationDetailsTabRouteUrl,
  getGepPurityConfigurationRouteUrl
} from '@poss-web/shared/util-site-routes';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

const csvExtn = 'csv';
const reqfileKey = 'reqFile';

@Component({
  selector: 'poss-web-gep-purity-config-details',
  styleUrls: ['./gep-purity-config-details.component.scss'],
  templateUrl: './gep-purity-config-details.component.html'
})
export class GepPurityConfigDetailsComponent implements OnInit, OnDestroy {
  GepPurityConfigEnumsRef = GepPurityConfigEnums;
  tabType: GepPurityConfigEnums;
  configurationForm: FormGroup;
  metalTypes$: Observable<MetalType[]> = null;
  itemTypes$: Observable<Lov[]> = null;
  goldRanges$: Observable<Ranges[]> = null;
  destroy$ = new Subject<null>();
  configId: string;
  productGroups: ProductGroup[] = [];
  isRivaah: boolean = false;
  productGroupsMap: Map<string, string> = new Map();
  pageSize: number;
  minPageSize = 0;
  excludeThemeCodes: ExcludeThemeCodes[] = [];
  excludeItemCodes: ExcludeItemCodes[] = [];
  pageSizeOptions: number[] = [];

  productGroupsDeduction: ProductGroupsDeduction[];
  groupsDediction: Map<string, {}> = new Map<string, any>();

  ids: string[] = [];
  mappedGroups: any = [];
  isLocationEnable = false;
  selectedGroups: ProductGroupMappingOption[] = [];
  gepDetails: GepDetails;
  purityDetails$: Observable<PurityDetailsResponse[]>;
  purityDetails: PurityDetailsResponse[];
  isLoading$: Observable<boolean>;
  @ViewChild('fileInput') fileInput;
  fileResponse: FileResponse;
  excludeItemCodesPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  productGroupsPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  totalItemCodes$: Observable<number>;
  productGroupsCount$: Observable<number>;
  savedPurityDetails = false;
  remove = false;

  goldRanges: Ranges[];
  silverRanges: Ranges[];
  platinumRanges: Ranges[];
  selectedLocation: SelectionDailogOption;

  @ViewChild('confirmFileUploadNotification', { static: true })
  private confirmFileUploadNotification: TemplateRef<any>;
  dateFormat: string;
  mappedLocations: any = [];
  totalGroups: number;
  productMapping: ProductGroupMappingOption[] = [];
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private gepPurityConfigFacade: GEPPurityConfigFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private appSettingFacade: AppsettingFacade,
    private translate: TranslateService,
    private fieldValidatorsService: FieldValidatorsService,
    private dialog: MatDialog,
    private productGroupMappingServiceAbstraction: ProductGroupMappingServiceAbstraction,
    private locationMappingService: LocationMappingServiceAbstraction,
    private fileDownloadService: FileDownloadService,
    private alertPopupService: AlertPopupServiceAbstraction,
    @Inject(POSS_WEB_EXCLUDE_ITEM_CODES_FILE_SIZE) public fileSize,

    @Inject(POSS_WEB_CURRENCY_CODE) public currencyCode,
    private locationMappingFacade: LocationMappingFacade
  ) {}
  ngOnInit() {
    this.locationMappingFacade
      .getMappedLocations()
      .pipe(takeUntil(this.destroy$))
      .subscribe(selectedLocations => {
        if (selectedLocations) {
          this.mappedLocations = selectedLocations;
        }
      });
    this.appSettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSize = data;
        this.excludeItemCodesPageEvent.pageSize = this.pageSize;
        this.productGroupsPageEvent.pageSize = this.pageSize;
      });
    this.appSettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });

    this.appSettingFacade
      .getDateFormat()
      .pipe(takeUntil(this.destroy$))
      .subscribe((dateFormat: string) => {
        this.dateFormat = dateFormat;
      });
    this.createForm();
    this.gepPurityConfigFacade.resetGepPurityConfiguration();
    this.configId = this.activatedRoute.snapshot.params['_configName'];
    this.tabType = this.activatedRoute.snapshot.params['_tabType'];
    this.tabType = GepPurityConfigEnums.PURITY_DETAILS;
    this.gepPurityConfigFacade.loadMetalTypes();
    this.gepPurityConfigFacade.loadItemTypes();
    this.gepPurityConfigFacade.loadGoldRanges('GEP_GOLD_PURITY');
    this.gepPurityConfigFacade.loadSilverRanges('GEP_SILVER_PURITY');
    this.gepPurityConfigFacade.loadPlatinumRanges('GEP_PLATINUM_PURITY');
    this.gepPurityConfigFacade.loadProductGroups();
    this.purityDetails$ = this.gepPurityConfigFacade.getPurityDetails();
    this.metalTypes$ = this.gepPurityConfigFacade.getMetalTypes();
    this.itemTypes$ = this.gepPurityConfigFacade.getItemTypes();
    this.goldRanges$ = this.gepPurityConfigFacade.getGoldRanges();
    this.totalItemCodes$ = this.gepPurityConfigFacade.getTotalItemCodes();

    if (this.configId !== 'new') {
      this.gepPurityConfigFacade.loadExcludeThemeCodes(this.configId);
      this.loadExcludeItemCodes();
      this.loadProductGroupDeduction();
      this.gepPurityConfigFacade.loadGepDetails(this.configId);
      this.gepPurityConfigFacade.loadGepPurityDetails(this.configId);
      this.isLocationEnable = true;
      this.configurationForm.get('description').disable();
    }
    this.componentInit();
    this.isLoading$ = this.gepPurityConfigFacade.getIsLoading();
    this.productGroupsCount$ = this.gepPurityConfigFacade.getProductGroupsCount();
  }
  componentInit() {
    this.gepPurityConfigFacade
      .getConfigId()
      .pipe(takeUntil(this.destroy$))
      .subscribe((configId: string) => {
        if (configId) {
          this.configId = configId;
          this.isLocationEnable = true;
          this.configurationForm.get('description').disable();
          this.configurationForm.patchValue({
            description: this.gepDetails?.description,
            isActive: this.gepDetails?.isActive
          });
        }
      });

    this.gepPurityConfigFacade
      .getGepDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((gepDetails: GepDetails) => {
        if (gepDetails) {
          this.gepDetails = gepDetails;
          this.configurationForm.patchValue({
            description: this.gepDetails.description,
            isActive: this.gepDetails.isActive
          });
          this.isRivaah = this.gepDetails?.offerDetails?.isRivaah
            ? this.gepDetails?.offerDetails?.isRivaah
            : false;
        }
      });

    this.gepPurityConfigFacade
      .getPurityDetails()
      .pipe(takeUntil(this.destroy$))
      .subscribe((purityDetails: PurityDetailsResponse[]) => {
        if (purityDetails) {
          this.purityDetails = purityDetails;
        }
      });
    this.gepPurityConfigFacade
      .getProductGroups()
      .pipe(takeUntil(this.destroy$))
      .subscribe((productGroups: ProductGroup[]) => {
        if (productGroups) {
          this.productGroupsMap = new Map();
          productGroups.forEach((groups: ProductGroup) => {
            this.productGroupsMap.set(
              groups.productGroupCode,
              groups.description
            );
          });
        }
      });
    setTimeout(() => {
      this.gepPurityConfigFacade
        .getProductGroupsDeduction()
        .pipe(takeUntil(this.destroy$))
        .subscribe((productGroupsDeduction: ProductGroupsDeduction[]) => {
          if (productGroupsDeduction) {
            this.gepPurityConfigFacade.loadProductGroups();
            this.mappedGroups = [];
            this.groupsDediction = new Map();
            for (const deduction of productGroupsDeduction) {
              if (!this.groupsDediction.has(deduction.productGroupCode)) {
                this.groupsDediction.set(deduction.productGroupCode, {
                  productGroupCode: deduction.productGroupCode,
                  id: deduction.id,
                  [deduction.rangeId]: deduction.percentValue,
                  configId: deduction.configId,
                  description: this.productGroupsMap.get(
                    deduction.productGroupCode
                  ),
                  rivaahAdditionalDiscount: deduction.rivaahAdditionalDiscount
                });
              } else {
                this.groupsDediction.set(deduction.productGroupCode, {
                  ...this.groupsDediction.get(deduction.productGroupCode),
                  [deduction.rangeId]: deduction.percentValue,
                  id:
                    this.groupsDediction.get(deduction.productGroupCode)['id'] +
                    ',' +
                    deduction.id,
                  rivaahAdditionalDiscount: deduction.rivaahAdditionalDiscount
                });
              }
            }
            this.productMapping = [];
            for (const values of Array.from(this.groupsDediction.values())) {
              this.productMapping.push({
                uuid: Object(values).id,
                id: Object(values).productGroupCode,
                description: Object(values).description
              });
              this.mappedGroups.push(values);
            }
            this.productGroups = [];
          }
        });
    }, 1000);
    this.gepPurityConfigFacade
      .getHasPurityDetailsSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        this.savedPurityDetails = hasSaved;
        if (hasSaved) {
          if (this.remove) {
            this.saveNotification('GEPPurityDetails Removed Successfully');
          } else {
            this.saveNotification('pw.gePurityConfiguration.savePurityDetails');
          }
          this.gepPurityConfigFacade.loadGepPurityDetails(this.configId);
          this.gepPurityConfigFacade.loadGepDetails(this.configId);
        }
      });
    this.gepPurityConfigFacade
      .getHasGEPDetailsSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe(hasSaved => {
        if (hasSaved) {
          this.saveNotification('pw.gePurityConfiguration.saveGEPDetails');
        }
      });

    this.gepPurityConfigFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
          if (this.fileInput?.nativeElement?.value)
            this.fileInput.nativeElement.value = '';
        }
      });
    this.locationMappingFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.gepPurityConfigFacade
      .getGoldRanges()
      .pipe(takeUntil(this.destroy$))
      .subscribe((goldRanges: Ranges[]) => {
        if (goldRanges) {
          this.goldRanges = goldRanges;
        }
      });

    this.gepPurityConfigFacade
      .getSilverRanges()
      .pipe(takeUntil(this.destroy$))
      .subscribe((silverRanges: Ranges[]) => {
        if (silverRanges) {
          this.silverRanges = silverRanges;
        }
      });

    this.gepPurityConfigFacade
      .getPlatinumRanges()
      .pipe(takeUntil(this.destroy$))
      .subscribe((platinumRanges: Ranges[]) => {
        if (platinumRanges) {
          this.platinumRanges = platinumRanges;
        }
      });

    this.gepPurityConfigFacade
      .getExcludeItemCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((excludeItemCodes: ExcludeItemCodes[]) => {
        if (excludeItemCodes) {
          this.excludeItemCodes = excludeItemCodes;
        }
      });
    this.gepPurityConfigFacade
      .getExcludeThemeCodes()
      .pipe(takeUntil(this.destroy$))
      .subscribe((excludeThemeCodes: ExcludeThemeCodes[]) => {
        if (excludeThemeCodes) {
          this.excludeThemeCodes = excludeThemeCodes;
        }
      });
    this.gepPurityConfigFacade
      .getHasProductGroupsDeducted()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasDeducted: boolean) => {
        if (hasDeducted) {
          this.saveNotification('pw.gePurityConfiguration.saveProductGroups');
          this.loadProductGroupDeduction();
          this.selectedGroups = [];
        }
      });
    this.gepPurityConfigFacade
      .getHasProductGroupsDataUpdated()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasDeducted: boolean) => {
        if (hasDeducted) {
          this.saveNotification(
            'pw.gePurityConfiguration.updateProductGroupsData'
          );
          this.loadProductGroupDeduction();
          this.selectedGroups = [];
        }
      });
    this.gepPurityConfigFacade
      .getHasThemeCodeSaved()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasSaved: boolean) => {
        if (hasSaved) {
          this.saveNotification('pw.gePurityConfiguration.saveThemeCodes');
          this.gepPurityConfigFacade.loadExcludeThemeCodes(this.configId);
        }
      });
    this.gepPurityConfigFacade
      .getHasThemeCodeRemoved()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasRemoved: boolean) => {
        if (hasRemoved) {
          this.saveNotification('pw.gePurityConfiguration.removeThemeCodes');
          this.gepPurityConfigFacade.loadExcludeThemeCodes(this.configId);
        }
      });
    this.gepPurityConfigFacade
      .getHasProductGroupRemoved()
      .pipe(takeUntil(this.destroy$))
      .subscribe((hasRemoved: boolean) => {
        if (hasRemoved) {
          this.saveNotification('pw.gePurityConfiguration.removeProductGroups');
          this.loadProductGroupDeduction();
        }
      });

    this.gepPurityConfigFacade
      .getFileResponse()
      .pipe(takeUntil(this.destroy$))
      .subscribe((fileResponse: FileResponse) => {
        if (fileResponse) {
          this.router.navigate([
            getGepPurityConfigurationDetailsTabRouteUrl(
              this.configId,
              this.tabType
            )
          ]);

          this.fileResponse = fileResponse;
          if (fileResponse.hasError) {
            this.alertPopupService.open({
              type: AlertPopupTypeEnum.ERROR,
              message: fileResponse.message
            });
          } else {
            const hasError = fileResponse.hasError;
            if (
              this.fileResponse.records &&
              this.fileResponse.uploadType === FileUploadTypeEnum.SYNC
            ) {
              const dialogRef = this.dialog.open(
                FileuploadConfirmationPopupComponent,
                {
                  width: '420px',
                  data: {
                    fileUploadResponse: this.fileResponse
                      ? this.fileResponse
                      : {},
                    label: 'Banks',
                    isFileError: hasError
                  }
                }
              );
              dialogRef
                .afterClosed()
                .pipe(takeUntil(this.destroy$))
                .subscribe(data => {
                  if (data === 'DOWNLOAD') {
                    this.gepPurityConfigFacade.loadItemCodesErrorLog(
                      this.fileResponse.errorLogId
                    );
                  }
                });
              if (
                this.fileResponse.failureCount !== this.fileResponse.totalCount
              )
                this.loadExcludeItemCodes();
            } else if (
              this.fileResponse.uploadType === FileUploadTypeEnum.ASYNC
            ) {
              this.showFileUploadConfirmationNotification();
              this.loadExcludeItemCodes();
            }
          }
        }
      });

    this.gepPurityConfigFacade
      .getErrorLog()
      .pipe(takeUntil(this.destroy$))
      .subscribe(errorlog => {
        if (errorlog) {
          this.fileDownloadService.downloadErrorFile(
            errorlog,
            this.fileResponse.errorLogId
          );
        }
      });
  }

  loadExcludeItemCodes() {
    this.gepPurityConfigFacade.loadExcludeItemCodes({
      configId: this.configId,
      pageIndex: this.excludeItemCodesPageEvent.pageIndex,
      pageSize: this.excludeItemCodesPageEvent.pageSize
    });
  }
  showFileUploadConfirmationNotification() {
    const key = 'pw.fileUpload.fileUploadStatusMessage';
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.CUSTOM,
            message: translatedMsg,
            hasBackdrop: true,
            hasClose: true,
            template: this.confirmFileUploadNotification
          })
          .events.pipe(take(1))
          .subscribe((event: OverlayNotificationEventRef) => {
            if (event.eventType === OverlayNotificationEventType.CLOSE) {
              this.overlayNotification.close();
            }
          });
      });
  }
  fileStatus() {
    this.router.navigate([getFileStatusRouteUrl()]);
  }
  loadProductGroupDeduction() {
    this.gepPurityConfigFacade.loadProductGroupsDeduction({
      configId: this.configId,
      pageIndex: this.productGroupsPageEvent.pageIndex,
      pageSize: this.productGroupsPageEvent.pageSize
    });
  }
  productGroupPaginator(pageEvent: PageEvent) {
    this.productGroupsPageEvent = pageEvent;
    this.loadProductGroupDeduction();
  }
  paginate(pageEvent: PageEvent) {
    this.excludeItemCodesPageEvent = pageEvent;
    this.loadExcludeItemCodes();
  }

  excludeItemCodeSearch(searchValue) {
    this.gepPurityConfigFacade.searchItemCodes({
      itemCode: searchValue.toUpperCase(),
      configId: this.configId
    });
  }
  clearExcludeItemCodes() {
    this.loadExcludeItemCodes();
  }
  search(searchValue) {
    this.gepPurityConfigFacade.searchProductGroup({
      searchValue: searchValue.toUpperCase(),
      configId: this.configId
    });
  }
  clearSearch() {
    this.loadProductGroupDeduction();
  }
  saveNotification(key) {
    this.locationMappingFacade.loadMappedLocations({
      ruleType: ConfigTypeEnum.GEP_PURITY_CONFIGURATIONS,
      ruleID: this.configId
    });
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
          .events.subscribe((eventType: OverlayNotificationEventType) => {
            this.router.navigate([
              getGepPurityConfigurationDetailsTabRouteUrl(
                this.configId,
                this.tabType
              )
            ]);
            if (this.mappedLocations.length === 0) {
              this.showLocMappingAlertMessage();
            }
          });
      });
  }

  createForm() {
    this.configurationForm = new FormGroup({
      description: new FormControl(
        this.gepDetails ? this.gepDetails.description : '',
        [
          this.fieldValidatorsService.requiredField('Configuration Name'),
          this.fieldValidatorsService.nameWithSpaceField('Configuration Name')
        ]
      ),
      isActive: new FormControl(
        this.gepDetails ? this.gepDetails.isActive : true
      )
    });
  }

  openProductGroupMapping() {
    if (
      this.configId !== 'new' &&
      !this.configurationForm.get('isActive').value
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.productGroupMappingServiceAbstraction
        .openProductGroupMappingWithForm({
          formType: ProductGroupMappingFormType.ADD_DEDUCTION,
          formData: { goldRanges: this.goldRanges, isRivaah: this.isRivaah },
          selectedProductGroup: this.productMapping
        })
        .subscribe((res: ProductGroupWithFormServiceResponse) => {
          if (res) {
            const popupData = [];
            const addProductGroups = [];
            let rivaahExchangeConfigDto: RivaahExchangeConfig;
            Object.entries(res.data.config.deductionFormGroup).forEach(
              purityRange => {
                popupData.push({
                  rangeId: purityRange[0],
                  percentValue: purityRange[1]
                });
              }
            );

            rivaahExchangeConfigDto = res.data.config.rivaahFormGroup;

            res.data.prouctGroups.addedProductGroups.forEach(groups => {
              addProductGroups.push({
                configDetails: {},
                productGroupCode: groups.id
              });
            });
            this.alertPopupService
              .open({
                type: AlertPopupTypeEnum.CONFIRM,
                message: 'pw.alertPopup.saveConfirmation'
              })
              .pipe(takeUntil(this.destroy$))
              .subscribe((data: boolean) => {
                if (data) {
                  this.gepPurityConfigFacade.saveProductGroupsDeduction({
                    configId: this.configId,
                    productGroups: {
                      addProductGroups: addProductGroups,
                      addRanges: popupData,
                      removeProductGroups: [],
                      rivaahExchangeConfigDto: rivaahExchangeConfigDto
                    },
                    config: {
                      description: this.configurationForm.get('description')
                        .value,
                      isActive: this.configurationForm.get('isActive').value,
                      type: GepPurityConfigEnums.GEP_ITEM
                    }
                  });
                }
              });
          }
        });
    }
  }

  updateProductData(event) {
    if (
      this.configId !== 'new' &&
      !this.configurationForm.get('isActive').value
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.gepPurityConfigFacade.updateProductGroupsDeduction({
        configId: this.configId,
        productGroups: {
          updateGepProductGroups: event.updateGepProductGroups,
          updateRanges: event.popupData,
          addRanges: [],
          removeProductGroups: [],
          rivaahExchangeConfigDto: event.rivaahExchangeConfigDto
        },
        config: {
          description: this.configurationForm.get('description').value,
          isActive: this.configurationForm.get('isActive').value,
          type: GepPurityConfigEnums.GEP_ITEM
        }
      });
    }
  }

  back() {
    this.router.navigate([getGepPurityConfigurationRouteUrl()]);
    this.gepPurityConfigFacade.resetGepPurityConfiguration();
  }
  tab(tabType: GepPurityConfigEnums) {
    this.router.navigate([
      getGepPurityConfigurationDetailsTabRouteUrl(this.configId, tabType)
    ]);
    this.tabType = tabType;
  }
  downloadFile() {
    this.fileDownloadService.download(
      FileNamesEnum.EXCLUDE_ITEM_CODES,
      FilePathEnum.EXCLUDE_ITEM_CODES
    );
  }
  uploadFile(event) {
    if (
      this.configId !== 'new' &&
      !this.configurationForm.get('isActive').value
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.overlayNotification.close();
      const fileList: FileList = event.target.files;
      const formData: FormData = new FormData();
      if (fileList.length > 0) {
        const file: File = fileList[0];
        if (file.size > this.fileSize) {
          const errorKey =
            'pw.gePurityConfiguration.maximumFileSizeErrorMessage';
          this.showNotifications(errorKey);
          this.fileInput.nativeElement.value = '';
        }
        const extn = file.name.split('.').pop();
        if (extn !== csvExtn) {
          const errorKey = 'pw.fileUpload.CSVFileTypeErrorMessage';
          this.showNotifications(errorKey);
          this.fileInput.nativeElement.value = '';
        }

        formData.append(reqfileKey, file);
        if (extn === csvExtn && file.size < this.fileSize) {
          this.gepPurityConfigFacade.uploadFile({
            gepConfiguration: {
              description: this.configurationForm.get('description').value,
              isActive: this.configurationForm.get('isActive').value,
              type: GepPurityConfigEnums.GEP_ITEM
            },
            uploadPayload: {
              configId: this.configId,
              type: GepPurityConfigEnums.GEP_CONFIG_EXCLUDE_MAPPING,
              formData: formData
            }
          });
          this.fileInput.nativeElement.value = '';
        }
      }
    }
  }
  showNotifications(key: string) {
    this.translate
      .get(key)
      .pipe(take(1))
      .subscribe((translatedMsg: string) => {
        this.overlayNotification
          .show({
            type: OverlayNotificationType.SIMPLE,
            message: translatedMsg,
            hasClose: true
          })
          .events.pipe(take(1))
          .subscribe();
      });
  }
  saveGEPDetails($event) {
    if (
      this.configId !== 'new' &&
      !this.configurationForm.get('isActive').value
    ) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.alertPopup.saveConfirmation'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res) {
            this.gepPurityConfigFacade.saveGEPDetails({
              gepConfiguration: {
                description: this.configurationForm.get('description').value,
                isActive: this.configurationForm.get('isActive').value,
                type: GepPurityConfigEnums.GEP_ITEM
              },
              gepDetails: {
                configDetails: $event.configDetails,
                offerDetails: $event.offerDetails,
                description: this.configurationForm.get('description').value,
                isActive: this.configurationForm.get('isActive').value,
                isOfferEnabled: $event.isOfferEnabled
              },
              configId: this.configId
            });
          }
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
  savePurityDetails(purityDetails: any) {
    this.remove = false;
    this.gepPurityConfigFacade.savePurityDetails({
      configuration: {
        description: this.configurationForm.get('description').value,
        isActive: this.configurationForm.get('isActive').value,
        type: GepPurityConfigEnums.GEP_ITEM
      },
      configId: this.configId,
      purityDetails: purityDetails
    });
  }
  deletePurityDetails($event) {
    this.remove = true;
    this.gepPurityConfigFacade.savePurityDetails({
      configuration: {
        description: this.configurationForm.get('description').value,
        isActive: this.configurationForm.get('isActive').value,
        type: GepPurityConfigEnums.GEP_ITEM
      },
      configId: this.configId,
      purityDetails: {
        addConfigDetails: [],
        removeConfigDetails: [$event],
        updateConfigDetails: []
      }
    });
  }
  deleteProductGroup($event) {
    if (this.configId !== 'new' && !this.gepDetails?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.alertPopupService
        .open({
          type: AlertPopupTypeEnum.CONFIRM,
          message: 'pw.discountProductGroupMapping.deleteConfirmMessage'
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe((res: boolean) => {
          if (res === true) {
            this.gepPurityConfigFacade.removeProductGroup({
              configId: this.configId,
              deleteProductGroup: {
                addProductGroups: [],
                addRanges: [],
                removeProductGroups: $event.split(',')
              }
            });
          }
        });
    }
  }
  errorHandler(error: CustomErrors) {
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasBackdrop: true,
        hasClose: true,
        error: error
      })
      .events.pipe(take(1))
      .subscribe();
  }

  productGroupDeduction($event) {
    this.gepPurityConfigFacade.saveProductGroupsDeduction({
      configId: this.configId,
      productGroups: {
        updateProductGroups: $event.updateProductGroups,
        addRanges: $event.addRanges,
        removeProductGroups: $event.removeProductGroups,
        rivaahExchangeConfigDto: $event.rivaahExchangeConfigDto
      },
      config: {
        description: this.configurationForm.get('description').value,
        isActive: this.configurationForm.get('isActive').value,
        type: GepPurityConfigEnums.GEP_ITEM
      }
    });
  }
  addThemeCode(themeCode) {
    if (this.configId !== 'new' && !this.gepDetails?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.gepPurityConfigFacade.saveThemeCode({
        configId: this.configId,
        config: {
          description: this.configurationForm.get('description').value,
          isActive: this.configurationForm.get('isActive').value,
          type: GepPurityConfigEnums.GEP_ITEM
        },
        saveThemeCodes: {
          addThemes: [themeCode],
          removeThemes: []
        }
      });
    }
  }
  removeThemeCode(themeCode: string) {
    if (this.configId !== 'new' && !this.gepDetails?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.gepPurityConfigFacade.deleteThemeCode({
        configId: this.configId,
        deleteThemeCode: {
          addThemes: [],
          removeThemes: [themeCode]
        }
      });
    }
  }
  locationMapping() {
    if (this.configId !== 'new' && !this.gepDetails?.isActive) {
      this.showMessage('pw.global.deactiveMsg');
    } else {
      this.locationMappingService.open({
        isConfig: true,
        configDetails: {
          configId: this.configId,
          configType: ConfigTypeEnum.GEP_PURITY_CONFIGURATIONS
        }
      });
    }
  }
  showLocMappingAlertMessage() {
    this.dialog.closeAll();
    this.alertPopupService
      .open({
        type: AlertPopupTypeEnum.INFO,
        message: 'pw.gePurityConfiguration.locationsMandatoryMessage'
      })
      .pipe(take(1))
      .subscribe();
  }
  emitGridData(productGroups: ProductGroupMappingOption[]) {
    this.productGroups = [];
    productGroups.forEach(groups => {
      this.productGroups.push({
        productGroupCode: groups.id,
        description: groups.description
      });
    });
    this.selectedGroups = productGroups;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
