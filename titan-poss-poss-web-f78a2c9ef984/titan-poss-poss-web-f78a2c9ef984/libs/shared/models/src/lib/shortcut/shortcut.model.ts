import { Observable } from 'rxjs';

export abstract class ShortcutServiceAbstraction {
  public abstract commands: Observable<Command>;
  public abstract shortcutEnable: boolean;
  public abstract componentNames: string[];
}

// command model
export class Command {
  name: string;
  combo: string;
  event: KeyboardEvent;
}

class HotkeyConfig {
  [key: string]: string[];
}

// hotkey model
export class ConfigModel {
  hotkeys: HotkeyConfig;
}


