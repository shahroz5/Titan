import {
  Component,
  NgZone,
  OnDestroy,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import { ScrollDispatcher, CdkScrollable } from '@angular/cdk/overlay';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
@Component({
  selector: 'poss-web-expansion-panel-summary',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpansionPanelSummaryComponent {}
@Component({
  selector: 'poss-web-expansion-panel-content',
  template: '<ng-content></ng-content>',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpansionPanelContentComponent {}
@Component({
  selector: 'poss-web-expansion-panel',
  templateUrl: './expansion-panel.component.html',
  styleUrls: ['./expansion-panel.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExpansionPanelComponent implements OnDestroy {
  isExpanded = true;
  destroy$ = new Subject();

  constructor(
    private scrollDispatcher: ScrollDispatcher,
    private zone: NgZone,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.scrollDispatcher
      .scrolled()
      .pipe(takeUntil(this.destroy$))
      .subscribe((cdk: CdkScrollable) => {
        const topOffset = cdk.measureScrollOffset('top');
        const bottomOffset = cdk.measureScrollOffset('bottom');
        if (!(topOffset === 0 && bottomOffset === 0)) {
          this.zone.run(() => {
            if (topOffset === 0) {
              this.isExpanded = true;
            } else {
              this.isExpanded = false;
            }
            this.changeDetectorRef.markForCheck();
          });
        }
      });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
