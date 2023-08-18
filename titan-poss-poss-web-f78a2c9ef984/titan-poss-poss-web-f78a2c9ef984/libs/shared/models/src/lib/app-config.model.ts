export interface AppConfig {
  env: {
    name: string;
  };
  enableLog: boolean;
  apiServer: {
    apiURL: string;
  };

  shortcutConfigSetting: {
    shortcutConfigFilePath: string;
  };
  translations: {
    prefix: string;
  };
}
