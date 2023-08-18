import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output
} from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CnPriorityConfigResponse, CnTypeList } from '@poss-web/shared/models';
import { ActivatedRoute } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-cn-priority-config-view-detail-item',
  templateUrl: './cn-priority-config-view-detail-item.component.html',
  styleUrls: ['./cn-priority-config-view-detail-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CnPriorityConfigViewDetailItemComponent
  implements OnInit, OnDestroy {
  @Input() cnTypeList$: Observable<CnTypeList[]>;

  @Input() cnPriorityConfig$: Observable<CnPriorityConfigResponse>;

  @Output() openLocationMappingEvent = new EventEmitter<boolean>();

  destroy$ = new Subject<any>();
  configId: string;
  cnPriorityConfigDetails: any;
  currentIndex = 1;
  hasChange = false;
  addedCnType: any[] = [];
  cnPriorityList: any[] = [];
  cnTypeList = [];
  constructor(public activatedRoute: ActivatedRoute) {}

  locationMapping() {
    this.openLocationMappingEvent.emit(true);
  }

  ngOnInit() {
    this.activatedRoute.params
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.configId = params['_configId'];
      });

    this.cnPriorityConfig$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cnPriorityConfigDetail => {
        this.cnPriorityConfigDetails = cnPriorityConfigDetail;
        this.cnPriorityList = [];

        if (
          this.configId === 'new' ||
          (cnPriorityConfigDetail &&
            cnPriorityConfigDetail.priorityDetails &&
            cnPriorityConfigDetail.priorityDetails.length === 0)
        ) {
          this.cnTypeList$.pipe(takeUntil(this.destroy$)).subscribe(cnType => {
            this.cnTypeList = cnType;
            if (this.cnTypeList.length !== 0) {
              for (const cnPriority of this.cnTypeList) {
                const existCNType = this.cnPriorityList.find(
                  cn => cn.cnType === cnPriority.id
                );
                if (existCNType === null || existCNType === undefined) {
                  this.cnPriorityList.push({
                    cnType: cnPriority.id
                  });
                }
              }
            }
          });
        } else {
          for (const cnPriority of cnPriorityConfigDetail.priorityDetails) {
            this.cnPriorityList.push({
              cnType: cnPriority.cnType
            });
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.cnPriorityList = [];
    this.addedCnType = [];
    this.destroy$.next();
    this.destroy$.complete();
  }
}
