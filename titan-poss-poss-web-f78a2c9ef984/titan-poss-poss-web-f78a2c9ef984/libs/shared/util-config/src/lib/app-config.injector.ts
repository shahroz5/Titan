import { InjectionToken } from '@angular/core';
import { CachingStrategySetting } from '@poss-web/shared/models';

export const POSS_WEB_API_URL = new InjectionToken<string>('POSS Web api url');
export const POSS_WEB_SHORTCUT_CONFIG_SETTING = new InjectionToken<string>(
  'Path of Shortcut Configuration Setting file'
);
export const POSS_WEB_ENABLE_LOG_ACTIONS = new InjectionToken<string>(
  'Enabled Logging of Actions'
);

export const POSS_APP_TYPE = new InjectionToken<string>(
  'Type of application EPOSS or POSS'
);
export const POSS_WEB_BRAND_CODE = new InjectionToken<string>(
  'POSS_WEB_BRAND_CODE'
);
export const POSS_WEB_CURRENCY_CODE = new InjectionToken<{}>(
  'POSS_WEB_CURRENCY_CODE'
);

export const POSS_WEB_MAX_FILTER_OPTION_SELECTION = new InjectionToken<{}>(
  'POSS_WEB_MAX_FILTER_OPTION_SELECTION'
);

export const POSS_WEB_WEIGHT_FRACTION_DIGITS = new InjectionToken<{}>(
  'POSS_WEB_WEIGHT_FRACTION_DIGITS'
);

export const POSS_WEB_PERCENTAGE_FRACTION_DIGITS = new InjectionToken<{}>(
  'POSS_WEB_PERCENTAGE_FRACTION_DIGITS'
);

export const POSS_WEB_DATE_FORMAT = new InjectionToken<{}>(
  'POSS_WEB_DATE_FORMAT'
);
export const POSS_WEB_MATERIAL_PRICE_REFRESH_INTERVAL = new InjectionToken<{}>(
  'POSS_WEB_MATERIAL_PRICE_REFRESH_INTERVAL'
);

export const POSS_WEB_TEMP_UNIPAY_RESPOSNE_CODE = new InjectionToken<{}>(
  'POSS_WEB_TEMP_UNIPAY_RESPOSNE_CODE'
);

export const POSS_WEB_CACHING_STRATEGY = new InjectionToken<
  CachingStrategySetting[]
>('Caching strategy setting');

export const POSS_WEB_HOST_NAME = new InjectionToken<{}>('POSS_WEB_HOST_NAME');

export const POSS_WEB_AMOUNT_FRACTION_DIGITS = new InjectionToken<{}>(
  'POSS_WEB_AMOUNT_FRACTION_DIGITS'
);

export const POSS_WEB_AMOUNT_DIGITS_BEFORE_DECIMAL = new InjectionToken<{}>(
  'POSS_WEB_AMOUNT_DIGITS_BEFORE_DECIMAL'
);

export const POSS_WEB_GC_MAX_AMOUNT_LIMIT = new InjectionToken<{}>(
  'POSS_WEB_GC_MAX_AMOUNT_LIMIT'
);

export const POSS_WEB_GC_MIN_AMOUNT_LIMIT = new InjectionToken<{}>(
  'POSS_WEB_GC_MIN_AMOUNT_LIMIT'
);

export const POSS_WEB_REFRESH_CHECK_SETTING = new InjectionToken<number>(
  'Refresh check settings'
);
export const POSS_WEB_REFRESH_CHECK_NOTIFICATION_SETTING = new InjectionToken<
  number
>('Refresh Check Notification settings');

export const POSS_WEB_ENCRYPT_PASSWORD = new InjectionToken<boolean>(
  'Encrypt Password Settings'
);
export const POSS_WEB_LOAD_ACL_DATA_FROM_DB = new InjectionToken<boolean>(
  'Load ACL data Settings'
);
export const POSS_WEB_MAX_LIMIT_TO_BREAK_API_LOOP = new InjectionToken<number>(
  'Max Limit to break Api loop Settings'
);
export const POSS_WEB_FILE_SIZE_FIR_MER = new InjectionToken<number>(
  'POSS_WEB_FILE_SIZE_FIR_MER'
);
export const POSS_WEB_IMAGE_FILE_SIZE = new InjectionToken<number>(
  'POSS_WEB_IMAGE_FILE_SIZE'
);
export const POSS_WEB_AIRPAY_HOST_CONFIG_FILE_SIZE = new InjectionToken<{}>(
  'POSS_WEB_AIRPAY_HOST_CONFIG_FILE_SIZE'
);
export const POSS_WEB_EMP_LOAN_CONFIG_FILE_SIZE = new InjectionToken<string>(
  'POSS_WEB_EMP_LOAN_CONFIG_FILE_SIZE'
);
export const POSS_WEB_AIRPAY_CONFIG_FILE_SIZE = new InjectionToken<{}>(
  'POSS_WEB_AIRPAY_CONFIG_FILE_SIZE'
);
export const POSS_WEB_RAZORPAY_HOST_CONFIG_FILE_SIZE = new InjectionToken<{}>(
  'POSS_WEB_RAZORPAY_HOST_CONFIG_FILE_SIZE'
);
export const POSS_WEB_RAZORPAY_CONFIG_FILE_SIZE = new InjectionToken<{}>(
  'POSS_WEB_RAZORPAY_CONFIG_FILE_SIZE'
);
export const POSS_WEB_UNIPAY_HOST_CONFIG_FILE_SIZE = new InjectionToken<{}>(
  'POSS_WEB_UNIPAY_HOST_CONFIG_FILE_SIZE'
);
export const POSS_WEB_GV_STATUS_UPDATE_CONFIG_FILE_SIZE = new InjectionToken<{}>(
  'POSS_WEB_GV_STATUS_UPDATE_CONFIG_FILE_SIZE'
);
export const POSS_WEB_PAYER_BANK_FILE_SIZE = new InjectionToken<{}>(
  'POSS_WEB_PAYER_BANK_FILE_SIZE'
);
export const POSS_WEB_EXCLUDE_ITEM_CODES_FILE_SIZE = new InjectionToken<{}>(
  'POSS_WEB_EXCLUDE_ITEM_CODES_FILE_SIZE'
);
export const POSS_WEB_GST_DETAILS_FILE_SIZE = new InjectionToken<{}>(
  'POSS_WEB_GST_DETAILS_FILE_SIZE'
);

export const POSS_WEB_UPLOAD_EGHS_FILE_SIZE = new InjectionToken<{}>(
  'POSS_WEB_UPLOAD_EGHS_FILE_SIZE'
);

export const POSS_WEB_UPLOAD_SERVICE_POSS_FILE_SIZE = new InjectionToken<{}>(
  'POSS_WEB_UPLOAD_SERVICE_POSS_FILE_SIZE'
);

export const POSS_WEB_MAX_NOTIFICATION_API_CALL_COUNT = new InjectionToken<
  string
>('POSS_WEB_MAX_NOTIFICATION_API_CALL_COUNT');

export const POSS_WEB_COIN_PRODUCT_GROUP_CODE = new InjectionToken<string>(
  'POSS_WEB_COIN_PRODUCT_GROUP_CODE'
);

export const POSS_WEB_MONTHS = new InjectionToken<{}>('POSS_WEB_MONTHS');
export const POSS_WEB_MAX_FILE_UPLOADS = new InjectionToken<{}>(
  'POSS_WEB_MAX_FILE_UPLOADS'
);
export const POSS_APP_VERSION_NUMBER = new InjectionToken<string>(
  'POSS_APP_VERSION_NUMBER'
);
export const EPOSS_APP_VERSION_NUMBER = new InjectionToken<string>(
  'EPOSS_APP_VERSION_NUMBER'
);
export const POSS_WEB_MAX_NO_OF_ITEMS_IN_PRODUCT_GRID = new InjectionToken<
  number
>('POSS_WEB_MAX_NO_OF_ITEMS_IN_PRODUCT_GRID');
export const POSS_WEB_SCHEDULER_RUN_TIME_FORMAT = new InjectionToken<{}>(
  'POSS_WEB_SCHEDULER_RUN_TIME_FORMAT'
);
export const POSS_WEB_TIME_TRACKING_LOG = new InjectionToken<{}>(
  'POSS_WEB_TIME_TRACKING_LOG'
);
