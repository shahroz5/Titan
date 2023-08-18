import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AppsettingFacade } from '@poss-web/shared/appsetting/data-access-appsetting';
import {
  CustomErrors,
  OverlayNotificationServiceAbstraction,
  FileStatusList,
  OverlayNotificationType
} from '@poss-web/shared/models';
import { getFileHomeRouteUrl } from '@poss-web/shared/util-site-routes';
import { PageEvent } from '@angular/material/paginator';
import { Subject, Observable } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';
import { FileFacade } from '@poss-web/shared/file-upload/data-access-file-upload';
@Component({
  selector: 'poss-web-file-status-listing',
  templateUrl: './file-status-listing.component.html'
})
export class FileStatusListingComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<null>();

  listingPageEvent: PageEvent = {
    pageIndex: 0,
    pageSize: 0,
    length: 0
  };
  pageSizeOptions: number[] = [];
  minPageSize: number;

  isLoading$: Observable<boolean>;
  fileStatusList$: Observable<FileStatusList[]>;
  totalCount$: Observable<number>;
  hasError$: Observable<CustomErrors>;
  noDataFoundMessage: string;
  constructor(
    public router: Router,
    private translate: TranslateService,
    private appsettingFacade: AppsettingFacade,
    private overlayNotification: OverlayNotificationServiceAbstraction,
    private fileFacade: FileFacade
  ) {
    this.translate
      .get(['pw.entity.fileStatusEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.fileStatusEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  ngOnInit() {
    this.isLoading$ = this.fileFacade.getIsLoading();
    this.fileStatusList$ = this.fileFacade.getFileStatusList();
    this.totalCount$ = this.fileFacade.getTotalFileStatusCount();
    this.hasError$ = this.fileFacade.getError();
    this.fileFacade
      .getError()
      .pipe(takeUntil(this.destroy$))
      .subscribe((error: CustomErrors) => {
        if (error) {
          this.errorHandler(error);
          // console.log(error.code);
        }
      });
    this.appsettingFacade
      .getPageSize()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        const pageSize = data;
        this.listingPageEvent.pageSize = pageSize;
        this.loadFileStatus();
      });

    this.appsettingFacade
      .getPageSizeOptions()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.pageSizeOptions = data;
        this.minPageSize = this.pageSizeOptions.reduce((a: number, b: number) =>
          a < b ? a : b
        );
      });
  }

  reloadStatus() {
    this.loadFileStatus();
  }
  loadFileStatus() {
    this.fileFacade.loadFileStatusList(this.listingPageEvent);
  }
  getErrorLog(fileData) {
    console.log(fileData, 'method');

    this.fileFacade.downloadErrorLog(fileData.fileId, fileData.fileGroup);
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
  backArrow() {
    this.router.navigate([getFileHomeRouteUrl()]);
  }
  paginate(pageEvent: PageEvent) {
    this.listingPageEvent = pageEvent;
    this.loadFileStatus();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
