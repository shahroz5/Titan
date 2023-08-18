import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import {
  POSS_WEB_API_URL,
  POSS_WEB_SHORTCUT_CONFIG_SETTING,
  POSS_WEB_ENABLE_LOG_ACTIONS,
  POSS_APP_TYPE,
  POSS_WEB_CURRENCY_CODE,
  POSS_WEB_CACHING_STRATEGY,
  POSS_WEB_WEIGHT_FRACTION_DIGITS,
  POSS_WEB_DATE_FORMAT,
  POSS_WEB_PERCENTAGE_FRACTION_DIGITS,
  POSS_WEB_HOST_NAME,
  POSS_WEB_BRAND_CODE,
  POSS_WEB_AMOUNT_FRACTION_DIGITS,
  POSS_WEB_AMOUNT_DIGITS_BEFORE_DECIMAL,
  POSS_WEB_GC_MAX_AMOUNT_LIMIT,
  POSS_WEB_GC_MIN_AMOUNT_LIMIT,
  POSS_WEB_REFRESH_CHECK_SETTING,
  POSS_WEB_REFRESH_CHECK_NOTIFICATION_SETTING,
  POSS_WEB_FILE_SIZE_FIR_MER,
  POSS_WEB_AIRPAY_HOST_CONFIG_FILE_SIZE,
  POSS_WEB_AIRPAY_CONFIG_FILE_SIZE,
  POSS_WEB_UNIPAY_HOST_CONFIG_FILE_SIZE,
  POSS_WEB_PAYER_BANK_FILE_SIZE,
  POSS_WEB_ENCRYPT_PASSWORD,
  POSS_WEB_IMAGE_FILE_SIZE,
  POSS_WEB_EXCLUDE_ITEM_CODES_FILE_SIZE,
  POSS_WEB_GV_STATUS_UPDATE_CONFIG_FILE_SIZE,
  POSS_WEB_LOAD_ACL_DATA_FROM_DB,
  POSS_WEB_GST_DETAILS_FILE_SIZE,
  POSS_WEB_MATERIAL_PRICE_REFRESH_INTERVAL,
  POSS_WEB_MAX_LIMIT_TO_BREAK_API_LOOP,
  POSS_WEB_MAX_NOTIFICATION_API_CALL_COUNT,
  POSS_WEB_COIN_PRODUCT_GROUP_CODE,
  POSS_WEB_MONTHS,
  POSS_WEB_RAZORPAY_HOST_CONFIG_FILE_SIZE,
  POSS_WEB_RAZORPAY_CONFIG_FILE_SIZE,
  POSS_WEB_MAX_FILTER_OPTION_SELECTION,
  POSS_APP_VERSION_NUMBER,
  EPOSS_APP_VERSION_NUMBER,
  POSS_WEB_MAX_NO_OF_ITEMS_IN_PRODUCT_GRID,
  POSS_WEB_SCHEDULER_RUN_TIME_FORMAT,
  POSS_WEB_TIME_TRACKING_LOG,
  POSS_WEB_EMP_LOAN_CONFIG_FILE_SIZE
} from '@poss-web/shared/util-config';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export function getHostName() {
  return window.location.protocol
    ? window.location.protocol + '//' + window.location.host
    : '';
}

async function main() {
  try {
    const data = await fetch(`./assets/config/config.${environment.name}.json`);
    const config = await data.json();
    await platformBrowserDynamic([
      { provide: POSS_WEB_API_URL, useValue: config.apiServer.epossApiURL },
      {
        provide: POSS_WEB_SHORTCUT_CONFIG_SETTING,
        useValue: config.shortcutConfigSetting.shortcutConfigFilePath
      },
      {
        provide: POSS_WEB_ENABLE_LOG_ACTIONS,
        useValue: config.enableLog
      },
      {
        provide: POSS_APP_TYPE,
        useValue: environment.appType
      },
      {
        provide: POSS_WEB_CURRENCY_CODE,
        useValue: config.currencyCode
      },

      {
        provide: POSS_WEB_MAX_FILTER_OPTION_SELECTION,
        useValue: config.maxFilterOptionsSelection
      },
      {
        provide: POSS_WEB_WEIGHT_FRACTION_DIGITS,
        useValue: config.weightFractionDigits
      },
      {
        provide: POSS_WEB_PERCENTAGE_FRACTION_DIGITS,
        useValue: config.percentageFractionDigits
      },
      {
        provide: POSS_WEB_DATE_FORMAT,
        useValue: config.dateFormat
      },
      {
        provide: POSS_WEB_CACHING_STRATEGY,
        useValue: config.cachingStrategy
      },
      { provide: POSS_WEB_BRAND_CODE, useValue: config.brandCode },
      {
        provide: POSS_WEB_AMOUNT_DIGITS_BEFORE_DECIMAL,
        useValue: config.amountDigitsBeforeDecimal
      },
      {
        provide: POSS_WEB_AMOUNT_FRACTION_DIGITS,
        useValue: config.amountFractionDigits
      },
      {
        provide: POSS_WEB_GC_MAX_AMOUNT_LIMIT,
        useValue: config.gcAmountMaxLimit
      },
      {
        provide: POSS_WEB_GC_MIN_AMOUNT_LIMIT,
        useValue: config.gcAmountMinLimit
      },
      {
        provide: POSS_WEB_REFRESH_CHECK_SETTING,
        useValue: config.refreshCheckSettings
      },
      {
        provide: POSS_WEB_REFRESH_CHECK_NOTIFICATION_SETTING,
        useValue: config.refreshCheckNotificationSettings
      },
      {
        provide: POSS_WEB_FILE_SIZE_FIR_MER,
        useValue: config.fileSizeFIRMER
      },
      {
        provide: POSS_WEB_IMAGE_FILE_SIZE,
        useValue: config.imageFileSize
      },
      {
        provide: POSS_WEB_AIRPAY_HOST_CONFIG_FILE_SIZE,
        useValue: config.airpayHostConfigurationfileSize
      },
      {
        provide: POSS_WEB_EMP_LOAN_CONFIG_FILE_SIZE,
        useValue: config.empLoanConfigurationfileSize
      },
      {
        provide: POSS_WEB_AIRPAY_CONFIG_FILE_SIZE,
        useValue: config.airpayConfigurationfileSize
      },
      {
        provide: POSS_WEB_RAZORPAY_HOST_CONFIG_FILE_SIZE,
        useValue: config.razorHostConfigurationfileSize
      },
      {
        provide: POSS_WEB_RAZORPAY_CONFIG_FILE_SIZE,
        useValue: config.razorpayConfigurationfileSize
      },
      {
        provide: POSS_WEB_UNIPAY_HOST_CONFIG_FILE_SIZE,
        useValue: config.unipayHostConfigurationfileSize
      },
      {
        provide: POSS_WEB_GV_STATUS_UPDATE_CONFIG_FILE_SIZE,
        useValue: config.unipayHostConfigurationfileSize
      },
      {
        provide: POSS_WEB_HOST_NAME,
        useFactory: getHostName,
        deps: []
      },
      {
        provide: POSS_WEB_PAYER_BANK_FILE_SIZE,
        useValue: config.payerBankFileSize
      },
      {
        provide: POSS_WEB_EXCLUDE_ITEM_CODES_FILE_SIZE,
        useValue: config.excludeItemCodesFileSize
      },
      {
        provide: POSS_WEB_ENCRYPT_PASSWORD,
        useValue: config.encryptPassword
      },
      {
        provide: POSS_WEB_LOAD_ACL_DATA_FROM_DB,
        useValue: config.loadACLDataFromDB
      },
      {
        provide: POSS_WEB_GST_DETAILS_FILE_SIZE,
        useValue: config.GSTDetailsFileSize
      },
      {
        provide: POSS_WEB_MATERIAL_PRICE_REFRESH_INTERVAL,
        useValue: config.materialPriceRefreshInterval
      },
      {
        provide: POSS_WEB_MAX_LIMIT_TO_BREAK_API_LOOP,
        useValue: config.maxRetryLimitToBreakApiLoop
      },
      {
        provide: POSS_WEB_MAX_NOTIFICATION_API_CALL_COUNT,
        useValue: config.maxNotificationApiCallCount
      },
      {
        provide: POSS_WEB_COIN_PRODUCT_GROUP_CODE,
        useValue: config.coinProductGroupCode
      },
      {
        provide: POSS_WEB_MONTHS,
        useValue: config.months
      },
      {
        provide: POSS_APP_VERSION_NUMBER,
        useValue: config.possAppVersion
      },
      {
        provide: EPOSS_APP_VERSION_NUMBER,
        useValue: config.epossAppVersion
      },
      {
        provide: POSS_WEB_MAX_NO_OF_ITEMS_IN_PRODUCT_GRID,
        useValue: config.maxNoOfItemsInProductGrid
      },
      {
        provide: POSS_WEB_SCHEDULER_RUN_TIME_FORMAT,
        useValue: config.schedulerRunTimeFormat
      },
      {
        provide: POSS_WEB_TIME_TRACKING_LOG,
        useValue: config.timeTrackingLog
      }
    ]).bootstrapModule(AppModule);
  } catch (error) {
    console.error(error);
  }
}

main();
