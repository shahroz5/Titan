import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
  OnInit
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CnMasterDetail } from '@poss-web/shared/models';

@Component({
  selector: 'poss-web-cn-master-view-detail-item',
  templateUrl: './cn-master-view-detail-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CnMasterViewDetailItemComponent implements OnInit, OnDestroy {
  @Input() cnMasterDetail$: Observable<CnMasterDetail>;

  cnMasterForm: FormGroup;
  destroy$: Subject<null> = new Subject<null>();
  cnMasterDetail: CnMasterDetail;


  ngOnInit(): void {
    if (this.cnMasterDetail$) {
      this.cnMasterDetail$
        .pipe(takeUntil(this.destroy$))
        .subscribe((cnDetail: CnMasterDetail) => {
          this.cnMasterDetail = cnDetail;
        });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
