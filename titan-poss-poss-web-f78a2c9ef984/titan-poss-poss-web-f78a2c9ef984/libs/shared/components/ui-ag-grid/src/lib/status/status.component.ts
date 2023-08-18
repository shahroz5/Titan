import { Component, OnDestroy } from '@angular/core';
import { commonTranslateKeyMap } from '@poss-web/shared/util-adaptors';
import { TranslateService } from '@ngx-translate/core';
import { takeUntil } from 'rxjs/operators';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-status',
  templateUrl: './status.component.html'
})
export class StatusComponent implements ICellRendererAngularComp, OnDestroy {
  status: string;
  statusColor: string;

  params: any;
  value: any = null;

  destroy$: Subject<null> = new Subject<null>();

  constructor(private translate: TranslateService) {}

  agInit(params: any): void {
    this.params = params;
    this.value = this.params.value;
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
  refresh(params: any): boolean {
    this.params = params;
    this.value = this.params.value;
    return true;
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
