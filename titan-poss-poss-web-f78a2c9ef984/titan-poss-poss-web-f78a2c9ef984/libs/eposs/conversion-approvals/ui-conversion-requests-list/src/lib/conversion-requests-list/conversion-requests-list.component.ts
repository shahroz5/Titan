import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { getConversionApprovalsIdRouteUrl } from '@poss-web/shared/util-site-routes';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-conversion-requests-list',
  templateUrl: './conversion-requests-list.component.html'
})
export class ConversionRequestsListComponent {
  @Input() conversionsRequestList = [];
  @Input() conversionsRequestListLength = 0;

  @Output() private loadMoreRequests: EventEmitter<any> = new EventEmitter<
    any
  >();

  status: any;
  statusColor: any;
  pageSize = 4;
  noDataFoundMessage: string;
  destroy$: Subject<null> = new Subject<null>();

  constructor(private router: Router, private translate: TranslateService) {
    this.translate
      .get(['pw.entity.requestEntity'])
      .pipe(takeUntil(this.destroy$))
      .subscribe((entity: any) => {
        this.translate
          .get(['pw.global.noDataFoundMessage'], {
            entityName: entity['pw.entity.requestEntity']
          })
          .pipe(takeUntil(this.destroy$))
          .subscribe((translatedMsg: any) => {
            this.noDataFoundMessage =
              translatedMsg['pw.global.noDataFoundMessage'];
          });
      });
  }

  loadRequests(event: number) {
    this.loadMoreRequests.emit({ pageNumber: event, pageSize: this.pageSize });
  }

  onRequestSelected(event: any) {
    this.router.navigate([getConversionApprovalsIdRouteUrl(event.id)]);
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
