import {
  InstrumentType,
  PaymentCode,
  RedemptionType,
  ProductGroupMappingOption,
  CPGProductGroupConfigForQCGCListingResult,
  CPGProductGroupConfigForQCGCDetails
} from '@poss-web/shared/models';

export class CPGProductGroupConfigForQCGCAdaptor {
  static getCPGProductGroupConfigForQCGCListing(
    data: any
  ): CPGProductGroupConfigForQCGCListingResult {
    const cpgProductGroupConfigListing: CPGProductGroupConfigForQCGCDetails[] = [];
    for (const listItem of data.results) {
      cpgProductGroupConfigListing.push({
        id: listItem.id,
        description: listItem.description,
        instrumentNumberDetails: listItem.instrumentNumberDetails,
        instrumentType: listItem.instrumentType,
        minimumAmount: listItem.minimumAmount,
        paymentCategoryName: listItem.paymentCategoryName,
        paymentCode: listItem.paymentCode,
        redemptionType: listItem.redemptionType,
        isActive: listItem.isActive
      });
    }

    const cpgProductGroupConfigListingResult: CPGProductGroupConfigForQCGCListingResult = {
      results: cpgProductGroupConfigListing,
      pageNumber: data.pageNumber,
      pageSize: data.pageSize,
      totalPages: data.totalPages,
      totalElements: data.totalElements
    };

    return cpgProductGroupConfigListingResult;
  }

  static getCPGProductGroupConfigForQCGCDetails(
    data: any
  ): CPGProductGroupConfigForQCGCDetails {
    const cpgProductGroupConfigDetails: CPGProductGroupConfigForQCGCDetails = {
      description: data.description,
      instrumentNumberDetails: data.instrumentNumberDetails,
      instrumentType: data.instrumentType,
      isActive: data.isActive,
      minimumAmount: data.minimumAmount,
      paymentCategoryName: data.paymentCategoryName,
      paymentCode: data.paymentCode,
      redemptionType: data.redemptionType
    };

    return cpgProductGroupConfigDetails;
  }

  static getCPGProductGroupConfigForQCGCDetailsNew(): CPGProductGroupConfigForQCGCDetails {
    const cpgProductGroupConfigDetails: CPGProductGroupConfigForQCGCDetails = {
      description: '',
      instrumentNumberDetails: {
        data: [
          {
            instrumentNo: '',
            isGhsVoucherEnabled: false
          }
        ],
        type: 'INSTRUMENT_NUMBER_DETAILS'
      },
      paymentCategoryName: '',
      minimumAmount: 0,
      isActive: true,
      instrumentType: InstrumentType.PhysicalCard,
      paymentCode: PaymentCode.Qcgc,
      redemptionType: RedemptionType.Full
    };

    return cpgProductGroupConfigDetails;
  }

  static getCPGProductGroupConfigForQCGCMapping(
    data: any
  ): ProductGroupMappingOption[] {
    const cpgProductGroupConfigMapping: ProductGroupMappingOption[] = [];

    for (const listItem of data?.results) {
      cpgProductGroupConfigMapping.push({
        id: listItem.productGroupCode,
        uuid: listItem.id,
        description: listItem.paymentCategoryName
      });
    }

    return cpgProductGroupConfigMapping;
  }

  static getCPGProductGroupConfigForQCGCSaveMapping(
    data: any
  ): ProductGroupMappingOption[] {
    const cpgProductGroupConfigMapping: ProductGroupMappingOption[] = [];

    for (const listItem of data) {
      cpgProductGroupConfigMapping.push({
        id: listItem.productGroupCode,
        uuid: listItem.id,
        description: listItem.paymentCategoryName
      });
    }

    return cpgProductGroupConfigMapping;
  }
}
