import {
  Component,
  Input,
  OnDestroy,
  OnChanges
} from '@angular/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-manual-gep-details',
  templateUrl: './manual-gep-details.component.html',
  styleUrls: []
})
export class ManualGepDetailsComponent implements OnDestroy, OnChanges {
  destroy$: Subject<null> = new Subject<null>();
  @Input() billDetails: any;
  billData: any;



  ngOnChanges() {
    if (!!this.billDetails) {
      this.billData = this.billDetails.manualBillDetails;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
