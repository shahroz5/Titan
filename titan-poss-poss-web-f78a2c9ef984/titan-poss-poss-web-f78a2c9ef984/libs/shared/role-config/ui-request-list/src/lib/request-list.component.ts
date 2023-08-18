import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnDestroy
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  RoleCountRequestStatusColorsEnum,
  RoleCountRequestList
} from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ElementPermissionService } from '@poss-web/shared/permission/util-element-permissions';
import { TranslateService } from '@ngx-translate/core';
import {
  getRoleLimitRequestsIdRouteUrl,
  getRoleLimtiRequestsApprovalsIdRouteUrl
} from '@poss-web/shared/util-site-routes';
@Component({
  selector: 'poss-web-request-list',
  templateUrl: './request-list.component.html'
})
export class RequestListComponent implements OnDestroy {
  @Input() roleCountRequestList: RoleCountRequestList[] = [];
  @Input() roleCountRequestListLength = 0;
  @Input() isBTQuser = false;
  @Input() permissions$: Observable<any[]>;

  @Output() private loadMoreRequests: EventEmitter<any> = new EventEmitter<
    any
  >();

  pageSize = 4;
  ROLELIMIT_LOCATIONCODE_LABEL_CARD = 'Uam Request List - Location Code Text';
  noDataFoundMessage: string;
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private elementPermission: ElementPermissionService,
    private translate: TranslateService
  ) {
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

  getStatusColor = (status: string): string =>
    RoleCountRequestStatusColorsEnum[status.toUpperCase()];

  loadPermission = (element: string) =>
    this.elementPermission.loadPermission(element, this.permissions$);

  loadRequests = (event: number) =>
    this.loadMoreRequests.emit({ pageNumber: event, pageSize: this.pageSize });

  onRequestSelected(event: RoleCountRequestList) {
    if (this.isBTQuser) {
      this.router.navigate([getRoleLimitRequestsIdRouteUrl(event.id)]);
    } else {
      this.router.navigate([getRoleLimtiRequestsApprovalsIdRouteUrl(event.id)]);
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
