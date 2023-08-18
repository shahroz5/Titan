import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, EventEmitter, Inject, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { TranslateService } from '@ngx-translate/core';
import { UsersActiveSessionsResults } from '@poss-web/shared/models';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'poss-web-users-active-sessions',
  templateUrl: './users-active-sessions.component.html',
  styleUrls: ['./users-active-sessions.component.scss']
})
export class UsersActiveSessionsComponent implements OnDestroy {
  refreshActiveSessions = new EventEmitter();
  startEodProcess = new EventEmitter();
  private destroy$ = new Subject();

  //Nested Tree
  treeControl = new NestedTreeControl<UsersActiveSessionsResults>(
    node => node.sessions
  );
  dataSource = new MatTreeNestedDataSource<UsersActiveSessionsResults>();

  constructor(
    public dialogRef: MatDialogRef<UsersActiveSessionsComponent>,
    public translate: TranslateService,
    @Inject(MAT_DIALOG_DATA)
    public activeUserSessionsData$: Observable<UsersActiveSessionsResults[]>
  ) {
    activeUserSessionsData$
      .pipe(takeUntil(this.destroy$))
      .subscribe(activeSessionsData => {
        this.dataSource.data = activeSessionsData;
      });
  }

  closeDialog() {
    this.dialogRef.close(null);
  }
  refreshActiveSessionData() {
    this.refreshActiveSessions.emit();
  }
  proceedWithEodProcess() {
    this.closeDialog();
    this.startEodProcess.emit();
  }

  hasChild = (_: number, node: UsersActiveSessionsResults) =>
    !!node.sessions && node.sessions.length > 0;

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
