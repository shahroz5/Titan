import { CashPaymentConfiguration } from '@poss-web/shared/models';

export class CashPaymentConfigurationAdaptor {
  static getCashPaymentConfigurationDetails(
    data: any
  ): CashPaymentConfiguration {
    const cashPaymentConfigurationData: CashPaymentConfiguration = {
      ruleId: data.ruleId,
      ruleType: data.ruleType,
      description: data.description,
      ruleDetails: {
        type: data.ruleDetails.type,
        data: {
          cashAmountMaxCap: data.ruleDetails.data.cashAmountMaxCap,
          validFrom: data.ruleDetails.data.validFrom,
          applicableDays: {
            isVariableDay: data.ruleDetails.data.applicableDays
              ? data.ruleDetails.data.applicableDays.isVariableDay
              : null,
            isSingleDay: data.ruleDetails.data.applicableDays
              ? data.ruleDetails.data.applicableDays.isSingleDay
              : null
          },
          applicablePaymentType: {
            grn: data.ruleDetails.data.applicablePaymentType
              ? data.ruleDetails.data.applicablePaymentType.grn
              : null,
            ghsMaturity: data.ruleDetails.data.applicablePaymentType
              ? data.ruleDetails.data.applicablePaymentType.ghsMaturity
              : null,
            advanceCN: data.ruleDetails.data.applicablePaymentType
              ? data.ruleDetails.data.applicablePaymentType.advanceCN
              : null,
            billCancel: data.ruleDetails.data.applicablePaymentType
              ? data.ruleDetails.data.applicablePaymentType.billCancel
              : null,
            cnIBT: data.ruleDetails.data.applicablePaymentType
              ? data.ruleDetails.data.applicablePaymentType.cnIBT
              : null,
            giftCard: data.ruleDetails.data.applicablePaymentType
              ? data.ruleDetails.data.applicablePaymentType.giftCard
              : null
          },
          applicableTransaction: {
            advanceBooking: data.ruleDetails.data.applicableTransaction
              ? data.ruleDetails.data.applicableTransaction.advanceBooking
              : null,
            cashMemo: data.ruleDetails.data.applicableTransaction
              ? data.ruleDetails.data.applicableTransaction.cashMemo
              : null,
            ghs: data.ruleDetails.data.applicableTransaction
              ? data.ruleDetails.data.applicableTransaction.ghs
              : null,
            //assm: data.ruleDetails.data.applicableTransaction.assm,
            //quickCM: data.ruleDetails.data.applicableTransaction.quickCM,
            giftCardValue: data.ruleDetails.data.applicableTransaction
              ? data.ruleDetails.data.applicableTransaction.giftCardValue
              : null,
            grf: data.ruleDetails.data.applicableTransaction
              ? data.ruleDetails.data.applicableTransaction.grf
              : null,
            customerOrder: data.ruleDetails.data.applicableTransaction
              ? data.ruleDetails.data.applicableTransaction.customerOrder
              : null,
            acceptAdvance: data.ruleDetails.data.applicableTransaction
              ? data.ruleDetails.data.applicableTransaction.acceptAdvance
              : null,
            servicePoss: data.ruleDetails.data.applicableTransaction
              ? data.ruleDetails.data.applicableTransaction.servicePoss
              : null
          },
          cummulativeCashValue: data.ruleDetails.data
            ? data.ruleDetails.data.cummulativeCashValue
            : null,
          l1l2Stores: data.ruleDetails.data.l1l2Stores,
          applicableL1L2Stores: {
            sameStore:
              data.ruleDetails.data &&
              data.ruleDetails.data.applicableL1L2Stores
                ? data.ruleDetails.data?.applicableL1L2Stores.sameStore
                : null,
            sameState:
              data.ruleDetails.data &&
              data.ruleDetails.data.applicableL1L2Stores
                ? data.ruleDetails.data?.applicableL1L2Stores.sameState
                : null,
            acrossCountry:
              data.ruleDetails.data &&
              data.ruleDetails.data.applicableL1L2Stores
                ? data.ruleDetails.data?.applicableL1L2Stores.acrossCountry
                : null
          },
          l3Stores: data.ruleDetails.data.l3Stores,
          applicableL3Stores: {
            sameStore:
              data.ruleDetails.data &&
              data.ruleDetails.data.applicableL1L2Stores
                ? data.ruleDetails.data.applicableL3Stores.sameStore
                : null,
            sameState:
              data.ruleDetails.data &&
              data.ruleDetails.data.applicableL1L2Stores
                ? data.ruleDetails.data.applicableL3Stores.sameState
                : null,
            acrossCountry:
              data.ruleDetails.data &&
              data.ruleDetails.data.applicableL1L2Stores
                ? data.ruleDetails.data.applicableL3Stores.acrossCountry
                : null
          },
          cashRefundSetting: {
            refundCashLimit: data.ruleDetails.data.cashRefundSetting
              ? data.ruleDetails.data.cashRefundSetting.refundCashLimit
              : null
          },
          pmlaSettings: {
            cashAmountMaxCap: data.ruleDetails.data.pmlaSettings
              ? data.ruleDetails.data.pmlaSettings.cashAmountMaxCap
              : null,
            applicableL1L2Stores: {
              acrossCountry: data.ruleDetails.data.pmlaSettings
                ? data.ruleDetails.data.pmlaSettings.applicableL1L2Stores
                    .acrossCountry
                : false,
              sameState: data.ruleDetails.data.pmlaSettings
                ? data.ruleDetails.data.pmlaSettings.applicableL1L2Stores
                    .sameState
                : false,
              sameStore: data.ruleDetails.data.pmlaSettings
                ? data.ruleDetails.data.pmlaSettings.applicableL1L2Stores
                    ?.sameStore
                : false
            },

            applicableL3Stores: {
              acrossCountry:
                data.ruleDetails.data.pmlaSettings &&
                data.ruleDetails.data.pmlaSettings.applicableL3Stores
                  ? data.ruleDetails.data.pmlaSettings.applicableL3Stores
                      .acrossCountry
                  : false,
              sameState:
                data.ruleDetails.data.pmlaSettings &&
                data.ruleDetails.data.pmlaSettings.applicableL3Stores
                  ? data.ruleDetails.data.pmlaSettings.applicableL3Stores
                      .sameState
                  : false,
              sameStore:
                data.ruleDetails.data.pmlaSettings &&
                data.ruleDetails.data.pmlaSettings.applicableL3Stores
                  ? data.ruleDetails.data.pmlaSettings.applicableL3Stores
                      .sameStore
                  : false
            },
            l1l2Stores: data.ruleDetails.data.pmlaSettings?.l1l2Stores,
            l3Stores: data.ruleDetails.data.pmlaSettings?.l3Stores
          }
        }
      },
      isActive: data.isActive
    };

    return cashPaymentConfigurationData;
  }
}
