import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConversionApprovalsFacade } from '@poss-web/eposs/conversion-approvals/data-access-conversion-approvals';
import {
  CommomStateAttributeNameEnum,
  CommomStateAttributeTypeEnum,
  ConversionApprovalsEnum,
  ConversionApprovalStatus,
  ConversionRequestItems,
  CustomErrors,
  OverlayNotificationEventRef,
  OverlayNotificationServiceAbstraction,
  OverlayNotificationType,
  SelectedRequestDetailsResponse,
  UpdateApprovalRequestStatusPayload
} from '@poss-web/shared/models';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { getConversionApprovalsAllowedRouteUrl } from '@poss-web/shared/util-site-routes';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil, withLatestFrom } from 'rxjs/operators';
import { CommonFacade } from '@poss-web/shared/common/data-access-common';

@Component({
  selector: 'poss-web-conversion-approval-details',
  templateUrl: './conversion-approval-details.component.html'
})
export class ConversionApprovalDetailsComponent implements OnInit, OnDestroy {
  hasNotification = false;
  parentItem: ConversionRequestItems = null;
  childItems: ConversionRequestItems[] = [];

  selectedRequest: SelectedRequestDetailsResponse;
  status: any;
  statusColor: any;
  id: number;

  selectedItemIds: string[];
  @ViewChild('ackowledgedSuccessNotificationTemplate', {
    static: true
  })
  ackowledgedSuccessNotificationTemplate: TemplateRef<any>;
  @ViewChild('approvedSuccessNotificationTemplate', {
    static: true
  })
  approvedSuccessNotificationTemplate: TemplateRef<any>;
  selectedRequestDocNo: number;

  parentForm: FormArray;
  isShowingErrorNotifcation = false;
  isLoading$: Observable<boolean>;

  destroy$: Subject<null> = new Subject<null>();
  isLoadImageUrl: boolean;
  isLoadChildImageUrl: boolean;
  isLoadingImage$: Observable<boolean>;
  constructor(
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
    private router: Router,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private conversionApprovalsFacade: ConversionApprovalsFacade,
    private commonFacade: CommonFacade
  ) {
    this.commonFacade.loadImageCatalogueDetails();
    this.parentForm = new FormArray([]);
  }

  ngOnInit(): void {
    this.isLoadingImage$ = this.conversionApprovalsFacade.getIsLoadingImage();

    this.isLoading$ = this.conversionApprovalsFacade.getIsLoading();
    this.overlayNotification.close();
    this.id = this.activatedRoute.snapshot.params['_id'];

    this.componentInit();
  }

  componentInit() {
    this.conversionApprovalsFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
        }
      });

    this.isLoadChildImageUrl = true;
    this.conversionApprovalsFacade.loadSelectedRequest({
      id: this.id,
      requestType: ConversionApprovalsEnum.REQUEST_TYPE
    });

    this.conversionApprovalsFacade
      .getSelectedRequest()
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: SelectedRequestDetailsResponse) => {
        if (response) {
          this.selectedRequest = response;
          this.initialLoad();
        }
      });
  }

  initialLoad() {
    this.conversionApprovalsFacade
      .getUpdateStatusResponse()
      .pipe(
        filter(data => data !== null),
        takeUntil(this.destroy$)
      )
      .subscribe(data => {
        if (data) {
          this.selectedRequestDocNo = data.reqDocNo;

          switch (data.status) {
            case ConversionApprovalStatus.APVL_PENDING:
              this.showSuccessNotification(
                this.ackowledgedSuccessNotificationTemplate
              );
              break;
            case ConversionApprovalStatus.APPROVED:
              this.showSuccessNotification(
                this.approvedSuccessNotificationTemplate
              );
              break;
            case ConversionApprovalStatus.APVL_REJECTED:
              this.back();
              break;
          }
        }
      });

    this.isLoadImageUrl = true;
    this.conversionApprovalsFacade.loadSelectedRequestData({
      id: this.selectedRequest.id,
      requestType: ConversionApprovalsEnum.REQUEST_TYPE
    });

    this.conversionApprovalsFacade
      .getSelectedItemIds()
      .pipe(takeUntil(this.destroy$))
      .subscribe(itemIds => {
        this.selectedItemIds = itemIds;
      });

    this.conversionApprovalsFacade
      .getSelectedRequestData()
      .pipe(
        withLatestFrom(
          this.commonFacade.getCommonFacadeAttributes(
            CommomStateAttributeTypeEnum.INVENTORY,
            CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe(([data, imageCatalogueDetails]) => {
        if (data) {
          this.childItems = [];
          for (const item of data) {
            if (
              item?.itemDetails?.itemType?.toUpperCase() ===
              ConversionApprovalsEnum.PARENT
            ) {
              this.parentItem = item;
            } else {
              this.childItems.push(item);
            }
          }

          if (this.isLoadImageUrl && data.length > 0 && imageCatalogueDetails)
          this.loadImage(data, imageCatalogueDetails, false);

          if (this.childItems.length === 0) {
            this.childItems = this.selectedRequest?.otherDetails;
            if (this.isLoadChildImageUrl && this.childItems.length > 0 && imageCatalogueDetails)
              this.loadImage(this.childItems, imageCatalogueDetails, true);
          }
          this.showNotification();
        }
      });
  }

  back() {
    this.router.navigate([getConversionApprovalsAllowedRouteUrl()]);
  }

  /**
   * gets the status of the request and determines the color code and status description
   * @param status : status of the request
   */
  getStatus(status?: string) {
    let key = {
      status: '',
      statusColor: ''
    };
    if (commonTranslateKeyMap.has(status)) {
      key = commonTranslateKeyMap.get(status);
    }
    this.translate
      .get([key.status, key.statusColor])
      .pipe(takeUntil(this.destroy$))
      .subscribe((translatedMessages: string) => {
        this.status = translatedMessages[key.status];
        this.statusColor = translatedMessages[key.statusColor];
      });
    return this.statusColor;
  }

  showSuccessNotification(customTemplate) {
    this.overlayNotification.close();
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.CUSTOM,
        hasClose: true,
        hasBackdrop: true,
        template: customTemplate
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
        this.back();
      });
  }

  showNotification() {
    if (!this.isShowingErrorNotifcation) {
      if (
        this.selectedRequest?.status?.toUpperCase() ===
          ConversionApprovalStatus.ACKNOWLEDGE_PENDING ||
        this.selectedRequest?.status?.toUpperCase() ===
          ConversionApprovalStatus.APVL_PENDING
      ) {
        this.updateNowOverlay();
      } else {
        this.overlayNotification.close();
      }
    }
  }

  updateNowOverlay() {
    const enterRemarksMessage = 'pw.conversionApprovals.enterRemarksMessage';
    const acknowledgeBtn = 'pw.conversionApprovals.acknowledgeButtonText';
    const approveBtn = 'pw.conversionApprovals.approveButtonText';
    const rejectBtn = 'pw.conversionApprovals.rejectButtonText';

    this.translate
      .get([enterRemarksMessage, acknowledgeBtn, approveBtn, rejectBtn])
      .pipe(take(1))
      .subscribe(translatedMessages => {
        this.hasNotification = true;
        this.overlayNotification
          .show({
            type: OverlayNotificationType.MULTI_ACTION,
            buttons:
              this.selectedRequest?.status?.toUpperCase() ===
              ConversionApprovalStatus.APVL_PENDING
                ? [
                    {
                      id: 2,
                      text: translatedMessages[rejectBtn],
                      css: 'pw-primary-btn',
                      hasRemarksValidation: true
                    },
                    {
                      id: 3,
                      text: translatedMessages[approveBtn],
                      css: 'pw-accent-btn',
                      hasRemarksValidation: true
                    }
                  ]
                : [
                    {
                      id: 1,
                      text: translatedMessages[acknowledgeBtn],
                      css: 'pw-accent-btn',
                      hasRemarksValidation: true
                    }
                  ],
            hasRemarks: true,
            isRemarksMandatory:
              this.selectedRequest?.status?.toUpperCase() ===
              ConversionApprovalStatus.APVL_PENDING
                ? true
                : false
          })
          .events.subscribe((overlayEvent: OverlayNotificationEventRef) => {
            this.hasNotification = false;
            this.conversionApprovalsFacade.updateApprovalRequestStatus(
              this.getUpdateStatusPayload(
                overlayEvent.data,
                overlayEvent.selectedId
              )
            );
          });
      });
  }

  getUpdateStatusPayload(
    enteredRemarks: string,
    selectedButtonId: number
  ): UpdateApprovalRequestStatusPayload {
    let payload: UpdateApprovalRequestStatusPayload;
    let action: string;

    switch (selectedButtonId) {
      case 1:
        action = ConversionApprovalStatus.ACKNOWLEDGED;
        break;
      case 2:
        action = ConversionApprovalStatus.APVL_REJECTED;
        break;
      case 3:
        action = ConversionApprovalStatus.APPROVED;
        break;
    }

    payload = {
      id: this.selectedRequest?.id,
      requestType: ConversionApprovalsEnum.REQUEST_TYPE,
      requestUpdateDto: {
        itemIds: this.selectedItemIds,
        remarks: enteredRemarks,
        status: action
      }
    };
    return payload;
  }

  errorHandler(error: CustomErrors) {
    this.isShowingErrorNotifcation = true;
    this.hasNotification = true;
    this.overlayNotification
      .show({
        type: OverlayNotificationType.ERROR,
        hasClose: true,
        error: error,
        hasBackdrop: true
      })
      .events.pipe(takeUntil(this.destroy$))
      .subscribe((event: OverlayNotificationEventRef) => {
        this.hasNotification = false;
        this.isShowingErrorNotifcation = false;
        this.showNotification();
      });
  }

  // Image
  loadImage(itemList, imageCatalogueDetails, isChildItems) {
    if(isChildItems)
      this.isLoadChildImageUrl = false;
    else
      this.isLoadImageUrl = false;
    itemList.forEach(item => {
      if(item.imageURL !== null && item.imageURL !== undefined){
          this.conversionApprovalsFacade.loadThumbnailImageUrl({
          id: item.inventoryId,
          imageUrl: item.imageURL,
          imageCatalogueDetails: imageCatalogueDetails,
          isChildItems: isChildItems
        });
      }
    });
  }

  loadImageUrl(event, isChildItems: boolean) {
    this.commonFacade.getCommonFacadeAttributes(
      CommomStateAttributeTypeEnum.INVENTORY,
      CommomStateAttributeNameEnum.IMAGE_CATALOGUE_DETAILS
    )
      .pipe(take(1))
      .subscribe(imageCatalogueDetails => {
        if(event.imageUrl !== null && event.imageUrl !== undefined){
          this.conversionApprovalsFacade.loadImageUrl({
            id: event.id,
            imageUrl: event.imageUrl,
            imageCatalogueDetails: imageCatalogueDetails,
            isChildItems: isChildItems
          });
        }
      });
  }

  trackBy(_: number, item: ConversionRequestItems) {
    return item.inventoryId;
  }
  ngOnDestroy() {
    while (this.parentForm.length !== 0) {
      this.parentForm.clear();
    }
    this.conversionApprovalsFacade.resetState();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
