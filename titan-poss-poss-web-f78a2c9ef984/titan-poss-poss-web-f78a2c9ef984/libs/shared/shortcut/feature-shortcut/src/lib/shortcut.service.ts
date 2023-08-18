import { HttpClient } from '@angular/common/http';
import { EventEmitter, Inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  Command,
  ConfigModel,
  ShortcutServiceAbstraction
} from '@poss-web/shared/models';
import { POSS_WEB_SHORTCUT_CONFIG_SETTING } from '@poss-web/shared/util-config';
import { Hotkey, HotkeysService } from 'angular2-hotkeys';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ShortcutInfoPopupComponent } from './shortcut-info-popup/shortcut-info-popup.component';

const shortcutEnableKey = 'ctrl+alt+[';
const shortcutDisableKey = 'ctrl+alt+]';
const shortcutHelpCommand = 'Global.SHORTCUT_HELP';
const commonComponent = 'Common';
const globalComponent = 'Global';

@Injectable()
export class ShortcutService implements ShortcutServiceAbstraction {
  subject: Subject<Command>;
  commands: Observable<Command>;
  shortcutCommands = [];
  shortcutList = [];
  globalShortcutList = [];
  isDialogOpen: boolean;
  isShortcutEnable = false;
  _componentNames = [];

  constructor(
    private hotkeysService: HotkeysService,
    private http: HttpClient,
    @Inject(POSS_WEB_SHORTCUT_CONFIG_SETTING) private shortcutConfigSetting,
    private dialog: MatDialog
  ) {
    this.subject = new Subject<Command>();
    this.commands = this.subject.asObservable();

    // call to get data from config.json
    this.http
      .get(`${this.shortcutConfigSetting}`)
      .toPromise()
      .then((data: any) => data as ConfigModel)
      .then(dataJson => {
        for (const key in dataJson.hotkeys) {
          if (dataJson.hotkeys.hasOwnProperty(key)) {
            const commands = dataJson.hotkeys[key];
            this.shortcutCommands.push({ key: key, commands: commands });
            this.hotkeysService.add(
              new Hotkey(key, (event, combo) =>
                this.shortcutkeyCommand(event, combo, commands)
              )
            );
          }
        }
      });
  }

  // command for the clicked key
  shortcutkeyCommand(
    eachEvent: KeyboardEvent,
    eachCombo: string,
    commands: any
  ): boolean {
    if (eachCombo === shortcutEnableKey) {
      this.shortcutEnable = true;
    } else if (eachCombo === shortcutDisableKey) {
      this.shortcutEnable = false;
    }

    if (
      commands.length &&
      (this.shortcutEnable === true ||
        commands[0].command === shortcutHelpCommand)
    ) {
      eachEvent.preventDefault();

      if (commands[0].command === shortcutHelpCommand) {
        this.openShortcutHelpPopup(this.componentNames);
      }

      commands.forEach(eachCommand => {
        const commandName: string = eachCommand.command.split('.', 1)[0];
        this.componentNames.forEach(compName => {
          if (
            commandName === compName ||
            commandName === commonComponent ||
            commandName === globalComponent
          ) {
            const command: Command = {
              name: eachCommand.command,
              event: eachEvent,
              combo: eachCombo
            };
            this.subject.next(command);
          }
        });
      });
    }

    return true;
  }

  // open Shortcut Help Popup
  openShortcutHelpPopup(componentNames: string[]): EventEmitter<any> {
    this.shortcutList = [];
    this.globalShortcutList = [
      {
        command: 'Global.MENU',
        shortcutKeys: 'm + {{ n }}',
        description: 'To Focus on menu, n is the number of menu'
      },
      {
        command: 'Global.TAB',
        shortcutKeys: 't + {{ n }}',
        description: 'To Focus on tab, n is the number of tab'
      }
    ];

    this.shortcutCommands.forEach(data => {
      data.commands.forEach(name => {
        componentNames.forEach(compName => {
          if (name.command.includes(compName)) {
            this.shortcutList.push(name);
          }
        });
        if (name.command.includes('Global')) {
          this.globalShortcutList.push(name);
        }
      });
    });

    if (this.isDialogOpen !== true) {
      this.isDialogOpen = true;
      const dialogref = this.dialog.open(ShortcutInfoPopupComponent, {
        width: '65vw',
        autoFocus: false,
        height: '700px',
        data: {
          pageShortcuts: this.shortcutList,
          globalShortcuts: this.globalShortcutList
        }
      });

      const event = new EventEmitter<any>();
      const destroy$ = new Subject();

      dialogref
        .afterClosed()
        .pipe(takeUntil(destroy$))
        .subscribe((dailogResponse: any) => {
          this.isDialogOpen = false;
          event.emit(dailogResponse);
          destroy$.next();
          destroy$.complete();
        });

      return event;
    }
  }

  // Setting and Getting Component Name for Launching Shortcut Popup
  set componentNames(componentNames: string[]) {
    this._componentNames = componentNames;
  }

  get componentNames(): string[] {
    return this._componentNames;
  }

  // Setting and Getting Shortcut Mode for Shortcut Functionality
  set shortcutEnable(isShortcutEnable: boolean) {
    this.isShortcutEnable = isShortcutEnable;
  }

  get shortcutEnable(): boolean {
    return this.isShortcutEnable;
  }
}
