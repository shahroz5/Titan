import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { Report, ReportStatus } from '@poss-web/shared/models';
@Component({
  selector: 'poss-web-report-list-item',
  templateUrl: './report-list-item.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ReportListItemComponent  {
  @Input() report: Report;

  @Output() download = new EventEmitter<string>();

  isCompleted = () => this.report.status === ReportStatus.COMPLETED;
  isInProgress = () => this.report.status === ReportStatus.IN_PROGRESS;
  isFailed = () => this.report.status === ReportStatus.FAILED;



  downloadReport() {
    this.download.emit(this.report.id);
  }
}
