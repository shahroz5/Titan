import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { getCashMemoHistory } from '@poss-web/shared/util-site-routes';
import {
  Command,
  PrintingServiceAbstraction,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

const backShortcutKey = 'HistoryDetailsShellComponent.BACK';
const historyDetailsShellComponentKey = 'HistoryDetailsShellComponent';
@Component({
  selector: 'poss-web-history-details-shell',
  templateUrl: './history-details-shell.component.html'
})
export class HistoryDetailsShellComponent implements OnDestroy {
  hasNotification = true;
  destroy$: Subject<null> = new Subject<null>();

  constructor(
    private router: Router,
    private printingService: PrintingServiceAbstraction,
    private shortcutService: ShortcutServiceAbstraction
  ) {
    this.shortcutService.componentNames = [historyDetailsShellComponentKey];
    this.shortcutService.commands
      .pipe(takeUntil(this.destroy$))
      .subscribe(command => {
        this.shortcutEventHandler(command);
      });
  }

  /**
   * method to handle shortcut commands
   * @param command: shortcut command
   */
  shortcutEventHandler(command: Command) {
    if (command.name === backShortcutKey) {
      this.back();
    }
  }

  back() {
    this.router.navigate([getCashMemoHistory()], {
      state: { clearFilter: false }
    });
  }
  ngOnDestroy(): void {
    this.printingService.resetPrint();
    this.destroy$.next();
    this.destroy$.complete();
  }
}
