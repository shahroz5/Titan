import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { GepDetails } from '@poss-web/shared/models';
import * as moment from 'moment';

@Component({
  selector: 'poss-web-gep-details-view',
  templateUrl: './gep-details-view.component.html'
})
export class GepDetailsViewComponent implements OnInit, OnChanges {
  @Input() gepDetails: GepDetails;
  @Input() dateFormat: string;
  @Output() openLocationMapping = new EventEmitter<boolean>();
  value = null;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['gepDetails']) {
      if (this.gepDetails) {
        if (this.gepDetails.configDetails.gepAsPayment) {
          this.value = 'payment';
        } else this.value = 'discount';
      }
    }
  }
  ngOnInit(): void {
    console.log('gepDetails', this.gepDetails);
  }
  getDate(date) {
    return moment(Number(date)).format(this.dateFormat);
  }
  openViewLocationMapping() {
    this.openLocationMapping.emit(true);
  }
}
