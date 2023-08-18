import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output
} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';

@Component({
  selector: 'poss-web-gift-cards-cancellation-reasons',
  templateUrl: './gift-cards-cancellation-reasons.component.html',
  styleUrls: []
})
export class GiftCardsCancellationReasonsComponent
  implements OnChanges, OnDestroy {
  @Input() clearSelectedCancellationReason: boolean;
  @Input() reasons: string[];
  @Output() selectedCancellationReason: EventEmitter<string> = new EventEmitter<
    string
  >();

  reasonsFormGroup: FormGroup;
  cancellationReasons: string[] = [];
  destroy$: Subject<null> = new Subject<null>();

  constructor(public translate: TranslateService) {
    this.reasonsFormGroup = new FormGroup({
      reasonControl: new FormControl('')
    });
  }

  ngOnChanges() {
    if (this.clearSelectedCancellationReason) {
      this.reasonsFormGroup.get('reasonControl').setValue('');
      this.reasonsFormGroup.updateValueAndValidity();
    }
    this.cancellationReasons = this.reasons;
  }

  // ngOnInit() {
  //   if (this.clearSelectedCancellationReason) {
  //     this.reasonsFormGroup.get('reasonControl').setValue('');
  //     this.reasonsFormGroup.updateValueAndValidity();
  //   }
  //   this.cancellationReasons = this.reasons;
  // }

  onReasonChange(event: any) {
    this.selectedCancellationReason.emit(event.value);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
