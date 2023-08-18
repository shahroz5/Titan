import {
  ABFocSchemeDetailsDto,
  AddFocToCmResponsePayload,
  AvailableSchemesPayload,
  CustomErrors,
  FocItemDetailsResponsePayload,
  FocProductDetailsInGrid,
  FocSchemeDetailsDto,
  IssuePendingFocConfirmationPayload,
  IssuepPendingFocPayload,
  LoadPendingCMPayload,
  LoadPendingFocSchemesPayload,
  ManualFocDetailsDto,
  PendingCMResponsePayload,
  PendingFocSchemesResponsePayload
} from '@poss-web/shared/models';
import { CustomErrorAdaptor } from '@poss-web/shared/util-adaptors';
import * as moment from 'moment';
import { initalState } from './foc.reducer';
import * as selectors from './foc.selectors';
import { FocState } from './foc.state';

describe('FOC Selector Testing Suite', () => {
  const errorPayload: CustomErrors = CustomErrorAdaptor.fromJson(
    Error('Some Error')
  );
  const dummyloadPendingCmPayload: LoadPendingCMPayload = {
    subTxnType: 'FOC_CM',
    txnType: 'CM',
    fiscalYear: '2019',
    docNo: null,
    customerId: null
  };
  const dummyPendingFocCm: PendingCMResponsePayload[] = [
    {
      customerId: 770,
      docDate: moment(),
      docNo: 11,
      finalValue: 1000,
      fiscalYear: 2000,
      id: 'AAA-BBBB-CCCC'
    },
    {
      customerId: 770,
      docDate: moment(),
      docNo: 22,
      finalValue: 1000,
      fiscalYear: 2000,
      id: 'AAA-BBBB-CCCC-DDD'
    }
  ];

  const dummyLoadFocSchemesPayload: LoadPendingFocSchemesPayload = {
    id: 'AAAA-BBB-CCC-DDD',
    txnType: 'CM',
    subTxnType: 'NEW_CM'
  };
  const dummyPendingFocSchemes = {
    focSchemes: [
      {
        id: 'AD06C897-9DEB-44E6-80D2-FCFB9C8048FA',
        salesTxnId: '4216F1D5-7060-4430-822E-B0DA6EAFE48B',
        eligibleWeight: 5,
        eligibleQuantity: null,
        purchaseItems: {
          purchaseItemList: [
            {
              productGroupCode: '71',
              itemCodeList: ['511107CSOGAA01', '511107CTEGAA01']
            }
          ]
        },
        eligibleFocItems: {
          eligibleFocItemList: [
            {
              itemCode: '60102ZFARAP11',
              unitWeight: 5
            },
            {
              itemCode: '600102ZFARAP22',
              unitWeight: 5
            }
          ]
        },
        status: 'PENDING'
      },
      {
        id: 'BD06C897-9DEB-44E6-80D2-FCFB9C8048FA',
        salesTxnId: '3216F1D5-7060-4430-822E-B0DA6EAFE48B',
        eligibleWeight: 5,
        eligibleQuantity: null,

        eligibleFocItems: {
          eligibleFocItemList: [
            {
              itemCode: '600102ZFARAP00',
              unitWeight: 5
            }
          ]
        },
        purchaseItems: {
          purchaseItemList: [
            {
              productGroupCode: '71',
              itemCodeList: ['511107CSOGAA00', '511107CTEGAA00']
            }
          ]
        },

        status: 'PENDING'
      }
    ]
  };
  const dummyItemDetailsPayload: FocItemDetailsResponsePayload[] = [
    {
      binCode: 'FOC',
      itemCode: '600102ZFARAP00',
      lotNumber: '110011ABB',
      availableQuantity: 10,
      stdWeight: 5,
      unitWeight: 1,
      weightDetials: {}
    },
    {
      binCode: 'FOC',
      itemCode: '600102ZFARAP00',
      lotNumber: '110011ACC',
      availableQuantity: 10,
      stdWeight: 5,
      unitWeight: 1,
      weightDetials: {}
    },
    {
      binCode: 'FOC',
      itemCode: '60102ZFARAP11',
      lotNumber: '110011ADD',
      availableQuantity: 10,
      stdWeight: 5,
      unitWeight: 1,
      weightDetials: {}
    },
    {
      binCode: 'FOC',
      itemCode: '60102ZFARAP11',
      lotNumber: '110011AEE',
      availableQuantity: 10,
      stdWeight: 5,
      unitWeight: 1,
      weightDetials: {}
    },
    {
      binCode: 'FOC',
      itemCode: '600102ZFARAP22',
      lotNumber: '110011AFF',
      availableQuantity: 10,
      stdWeight: 5,
      unitWeight: 1,
      weightDetials: {}
    },
    {
      binCode: 'FOC',
      itemCode: '60102ZFARAP11',
      lotNumber: '110011ADD',
      availableQuantity: 10,
      stdWeight: 5,
      unitWeight: 1,
      weightDetials: {}
    }
  ];
  const dummyIssuePendingFocPayload: IssuepPendingFocPayload = {
    refTxnId: '11111AAAAAa',
    subTxnType: 'FOC_CM',
    txnType: 'CM',
    payload: null
  };
  const dummyIssueConfirmationPayload: IssuePendingFocConfirmationPayload = {
    docNo: 111,
    fiscalYear: 0,
    focItems: [
      {
        binCode: 'string',
        employeeCode: 'string',
        focSchemeId: 'string',
        id: 'string',
        inventoryId: 'string',
        itemCode: 'string',
        lotNumber: 'string',
        rowId: 0,
        salesTxnId: 'string',
        status: 'string',
        totalQuantity: 0,
        totalWeight: 0,
        unitWeight: 0
      }
    ],
    id: 'string',
    refTxnId: 'string',
    status: 'string',
    subTxnType: 'string',
    txnType: 'string'
  };

  const dummyFocItems: FocProductDetailsInGrid[] = [
    {
      itemCode: '11111111111111111',
      description: null,
      binCode: null,
      selectedLotNumber: '100AB10',
      availableLotNumbers: [],
      unitWeight: 2,
      actualWeight: 2,
      reason: null,
      remarks: null,
      selectedRso: 'rso',
      availableRso: [],
      pricePerUnit: 100,
      discount: null,
      finalPrice: 1000,
      priceBreakUp: null,
      productDetails: null,
      inventoryId: '222211112222221',
      itemId: '2222222222',
      productType: null,
      isAdd: true,
      priceDetails: null,
      imageUrl: 'imageUrl',
      quantity: 2,
      focSchemeId: '111BBBCCSDD'
    }
  ];
  describe('Testing LoadPendingFocCM Related Selectors', () => {
    const state: FocState = {
      ...initalState,
      pendingFocCm: dummyPendingFocCm,
      isLoadingPendingCM: false
    };
    it('should return isLoadingPendingCM Selector', () => {
      expect(
        selectors.FocSelector.selectIsIssuingPendingFOC.projector(state)
      ).toBe(false);
    });
    it('should return pendingFocCm Selector', () => {
      expect(selectors.FocSelector.selectPendingCM.projector(state)).toBe(
        dummyPendingFocCm
      );
    });
  });
  describe('Testing selectedPendingCM Related Selectors', () => {
    const payload: PendingCMResponsePayload = {
      customerId: 770,
      docDate: moment(),
      docNo: 22,
      finalValue: 1000,
      fiscalYear: 2000,
      id: 'AAA-BBBB-CCCC-DDD'
    };
    const state: FocState = {
      ...initalState,
      selectedPendingCM: payload
    };
    it('should return selectSelectedPendingCM Selector', () => {
      expect(
        selectors.FocSelector.selectSelectedPendingCM.projector(state)
      ).toBe(payload);
    });
  });
  describe('Testing loadFocSchemes Related Selectors', () => {
    const state: FocState = {
      ...initalState,
      focItemDetails: dummyItemDetailsPayload,
      isLoadingFocItemDetails: false,
      hasFocItemDetails: true,
      manualFocItemDetails: dummyItemDetailsPayload,
      isLoadingManualFocItemDetails: false,
      hasManualFocItemDetails: true,
      isFocKeptPending: true,
      isFocSchemesForItems: true
    };
    it('should return selectIsLoadingFocItemDetails Selector', () => {
      expect(
        selectors.FocSelector.selectIsLoadingFocItemDetails.projector(state)
      ).toBe(false);
    });
    it('should return selectHasFocItemDetails Selector', () => {
      expect(
        selectors.FocSelector.selectHasFocItemDetails.projector(state)
      ).toBe(true);
    });
    it('should return selectFocItemDetails Selector', () => {
      expect(selectors.FocSelector.selectFocItemDetails.projector(state)).toBe(
        dummyItemDetailsPayload
      );
    });
    it('should return selectManulFocItemDetails Selector', () => {
      expect(
        selectors.FocSelector.selectManulFocItemDetails.projector(state)
      ).toBe(dummyItemDetailsPayload);
    });

    it('should return selectIsLoadingManualFocItemDetails Selector', () => {
      expect(
        selectors.FocSelector.selectIsLoadingManualFocItemDetails.projector(
          state
        )
      ).toBe(false);
    });
    it('should return selectHasManualFocItemDetails Selector', () => {
      expect(
        selectors.FocSelector.selectHasManualFocItemDetails.projector(state)
      ).toBe(true);
    });
    it('should return selectIsFocKeptPending  Selector', () => {
      expect(
        selectors.FocSelector.selectIsFocKeptPending.projector(state)
      ).toBe(true);
    });
    it('should return selectIsFocSchemesForItems  Selector', () => {
      expect(
        selectors.FocSelector.selectIsFocSchemesForItems.projector(state)
      ).toBe(true);
    });
  });
  describe('Testing loadFocSchemes Related Selectors', () => {
    const state: FocState = {
      ...initalState,
      pendingIssueResponse: dummyIssueConfirmationPayload,
      isIssuingPendingFOC: false
    };

    it('should return selectIssuePendingFocResponse Selector', () => {
      expect(
        selectors.FocSelector.selectIssuePendingFocResponse.projector(state)
      ).toBe(dummyIssueConfirmationPayload);
    });
    it('should return selectIsIssuingPendingFOC Selector', () => {
      expect(
        selectors.FocSelector.selectIsIssuingPendingFOC.projector(state)
      ).toBe(false);
    });
  });
  describe('Testing FocItems Related Selectors', () => {
    const state: FocState = {
      ...initalState,
      focItems: dummyFocItems,
      totalFocEligibleWt: 10,
      totalFocIssuingWt: 10,
      focItemsCount: 10
    };

    it('should return selectFocItems Selector', () => {
      expect(selectors.FocSelector.selectFocItems.projector(state)).toBe(
        dummyFocItems
      );
    });
    // it('should return selecFocItemsCount Selector', () => {
    //   expect(selectors.FocSelector.selecFocItemsCount.projector(state)).toBe(
    //     10
    //   );
    // });

    // it('should return selectTotalFocIssuingWt Selector', () => {
    //   expect(
    //     selectors.FocSelector.selectTotalFocIssuingWt.projector(state)
    //   ).toBe(10);
    // });
    // it('should return selectTotalEligibleWt Selector', () => {
    //   expect(selectors.FocSelector.selectTotalEligibleWt.projector(state)).toBe(
    //     10
    //   );
    // });
  });
  describe('Testing Error Related Selectors', () => {
    it('should return selectedError Selector', () => {
      const error: CustomErrors = {
        code: '503',
        traceId: 'E-303',
        timeStamp: '',
        error: null,
        message: 'Some error'
      };

      const state: FocState = {
        ...initalState,
        error: error
      };
      expect(selectors.FocSelector.selectError.projector(state)).toEqual(error);
    });
  });
  describe('Testing FOC Related Selectors', () => {
    it('should return selectKeepFocPendingTrigger Selector', () => {
      const state: FocState = {
        ...initalState,
        keepFOCPendingTrigger: true
      };
      expect(
        selectors.FocSelector.selectKeepFocPendingTrigger.projector(state)
      ).toEqual(true);
    });
    it('should return selectKeepFocPendingTrigger Selector', () => {
      const state: FocState = {
        ...initalState,
        isFocSchemesLoaded: true
      };
      expect(
        selectors.FocSelector.selectIsFocSchemesLoaded.projector(state)
      ).toEqual(true);
    });
    it('should return selectPendingFocSchemeIds Selector', () => {
      const state: FocState = {
        ...initalState,
        pendingFocSchemeIds: []
      };
      expect(
        selectors.FocSelector.selectPendingFocSchemeIds.projector(state)
      ).toEqual([]);
    });
    it('should return selectIsFocAdded Selector', () => {
      const state: FocState = {
        ...initalState,
        isFocAdded: true
      };
      expect(selectors.FocSelector.selectIsFocAdded.projector(state)).toEqual(
        true
      );
    });
    it('should return selectFocAddedToCm Selector', () => {
      const payload: AddFocToCmResponsePayload[] = [
        {
          binCode: 'Bincode',
          employeeCode: 'rsocpd',
          focSchemeId: 'focScheeId',
          id: '11111111111',
          inventoryId: '222222222',
          itemCode: 'itemcode1',
          lotNumber: 'lotnumber',
          rowId: 1,
          salesTxnId: '444444444444',
          status: 'OPEN',
          totalQuantity: 2,
          totalWeight: 20,
          unitWeight: 5,
          isManualFOC: false
        }
      ];
      const state: FocState = {
        ...initalState,
        focAddedToCM: payload
      };
      expect(selectors.FocSelector.selectFocAddedToCm.projector(state)).toEqual(
        payload
      );
    });
    it('should return selectFocSchemes Selector', () => {
      const payload: FocSchemeDetailsDto[] = [
        {
          focItems: [{ itemCode: '111111', quantity: 1, weight: null }],
          purchaseItems: [
            {
              productGroupCode: '71',
              itemCodeList: ['511107CSOGAA01', '511107CTEGAA01']
            }
          ],
          schemeDetailId: 'schemeDetailId1',
          schemeId: 'schemeId1',
          schemeName: 'focScheme1',
          schemeCategory: 'VALUE_BASED'
        }
      ];
      const state: FocState = {
        ...initalState,
        focSchemes: payload
      };
      expect(selectors.FocSelector.selectFocSchemes.projector(state)).toEqual(
        payload
      );
    });
    it('should return selectAvailableSchemes Selector', () => {
      const payload: AvailableSchemesPayload[] = [
        {
          description: 'Foc Scheme',
          isActive: true,
          id: '111111111111',
          name: 'focScheme1'
        }
      ];
      const state: FocState = {
        ...initalState,
        availableFocSchemes: payload
      };
      expect(
        selectors.FocSelector.selectAvailableSchemes.projector(state)
      ).toEqual(payload);
    });
    it('should return selectIsLoading Selector', () => {
      const payload = true;
      const state: FocState = {
        ...initalState,
        isLoading: payload
      };
      expect(selectors.FocSelector.selectIsLoading.projector(state)).toEqual(
        payload
      );
    });
    it('should return selectIsLoadingPendingScheme Selector', () => {
      const payload = true;
      const state: FocState = {
        ...initalState,
        isLoadingPendingFocSchemes: payload
      };
      expect(
        selectors.FocSelector.selectIsLoadingPendingScheme.projector(state)
      ).toEqual(payload);
    });
    it('should return selectIsLoadingPendingCM  Selector', () => {
      const payload = true;
      const state: FocState = {
        ...initalState,
        isLoadingPendingCM: payload
      };
      expect(
        selectors.FocSelector.selectIsLoadingPendingCM.projector(state)
      ).toEqual(payload);
    });
    it('should return selectPendingFocScheme   Selector', () => {
      const payload: PendingFocSchemesResponsePayload = {
        focSchemes: [
          {
            eligibleFocItemDetails: {
              focItems: [{ itemCode: '111111', quantity: 1, weight: null }]
            },
            eligibleWeight: 1,
            eligibleQuantity: null,
            id: '111122222',
            purchaseItemDetails: {
              purchaseItems: [
                {
                  itemCodeList: ['itemCode1', 'itemCode2'],
                  productGroupCode: '71'
                }
              ]
            },
            schemeName: 'Performace Scheme',
            salesTxnId: '222221111111',
            status: 'OPEN'
          }
        ]
      };
      const state: FocState = {
        ...initalState,
        pendingFocSchemes: payload
      };
      expect(
        selectors.FocSelector.selectPendingFocScheme.projector(state)
      ).toEqual(payload);
    });
    it('should return selectManualFocItems  Selector', () => {
      const payload: ManualFocDetailsDto[] = [
        {
          focItems: [{ itemCode: '111111', quantity: 1, weight: null }],
          manualFOCEndDate: moment(),
          manualFOCStartDate: moment(),
          schemeId: 'schemeId1',
          schemeName: 'focScheme1',
          configDetails: {}
        }
      ];
      const state: FocState = {
        ...initalState,
        manualFocSchemes: payload
      };
      expect(
        selectors.FocSelector.selectManualFocItems.projector(state)
      ).toEqual(payload);
    });
    it('should return selectManualFocAddedToCm  Selector', () => {
      const payload: AddFocToCmResponsePayload[] = [
        {
          binCode: 'Bincode',
          employeeCode: 'rsocpd',
          focSchemeId: 'focScheeId',
          id: '11111111111',
          inventoryId: '222222222',
          itemCode: 'itemcode1',
          lotNumber: 'lotnumber',
          rowId: 1,
          salesTxnId: '444444444444',
          status: 'OPEN',
          totalQuantity: 2,
          totalWeight: 20,
          unitWeight: 5,
          isManualFOC: false
        }
      ];
      const state: FocState = {
        ...initalState,
        manualFocAddedToCM: payload
      };
      expect(
        selectors.FocSelector.selectManualFocAddedToCm.projector(state)
      ).toEqual(payload);
    });
    it('should return selectIsManualFocAdded  Selector', () => {
      const payload = true;
      const state: FocState = {
        ...initalState,
        isManualFocAdded: payload
      };
      expect(
        selectors.FocSelector.selectIsManualFocAdded.projector(state)
      ).toEqual(payload);
    });
    it('should return selectIsManualFocValidated  Selector', () => {
      const payload = {
        cmksjd: '32434'
      };
      const state: FocState = {
        ...initalState,
        manualFocValidationDetails: payload
      };
      expect(
        selectors.FocSelector.selectIsManualFocValidated.projector(state)
      ).toEqual(payload);
    });
    it('should return selectIsManualFocVerified  Selector', () => {
      const payload = true;
      const state: FocState = {
        ...initalState,
        isManualFocVerified: payload
      };
      expect(
        selectors.FocSelector.selectIsManualFocVerified.projector(state)
      ).toEqual(payload);
    });
  });

  // AB FOC
  describe('Testing AB FOC Related Selectors', () => {
    const dummyFocSchemeDetailsDto: FocSchemeDetailsDto[] = [
      {
        focItems: [{ itemCode: '111111', quantity: 1, weight: null }],
        purchaseItems: [
          {
            productGroupCode: '71',
            itemCodeList: ['511107CSOGAA01', '511107CTEGAA01']
          }
        ],
        schemeDetailId: 'schemeDetailId1',
        schemeId: 'schemeId1',
        schemeName: 'focScheme1',
        schemeCategory: 'VALUE_BASED'
      }
    ];

    const dummyABFocSchemeDetailsDto: ABFocSchemeDetailsDto[] = [
      {
        schemeDetailId: '123',
        schemeId: '345',
        schemeName: 'scheme1',
        schemeCategory: 'VALUE_BASED',
        weight: 0.5,
        id: '789'
      }
    ];
    const state: FocState = {
      ...initalState,
      ABFocSchemes: dummyFocSchemeDetailsDto,
      ABFocSchemesForItems: true,
      SelectedABFocSchemes: dummyABFocSchemeDetailsDto,
      SelectedABFocSchemesCount: 1,
      SaveFocSchemes: dummyABFocSchemeDetailsDto,
      deleteABFOCSchemesRes: true
    };

    it('should return selectABFocSchemes  Selector', () => {
      expect(selectors.FocSelector.selectABFocSchemes.projector(state)).toBe(
        dummyFocSchemeDetailsDto
      );
    });
    it('should return selectABFocSchemesForItems  Selector', () => {
      expect(
        selectors.FocSelector.selectABFocSchemesForItems.projector(state)
      ).toBe(true);
    });
    it('should return selectSelectedABFocSchemes  Selector', () => {
      expect(
        selectors.FocSelector.selectSelectedABFocSchemes.projector(state)
      ).toBe(dummyABFocSchemeDetailsDto);
    });
    it('should return selectSelectedABFocSchemesCount  Selector', () => {
      expect(
        selectors.FocSelector.selectSelectedABFocSchemesCount.projector(state)
      ).toBe(1);
    });

    it('should return selectSavedABFocSchemes  Selector', () => {
      expect(
        selectors.FocSelector.selectSavedABFocSchemes.projector(state)
      ).toBe(dummyABFocSchemeDetailsDto);
    });
    it('should return selectDeletedABFocSchemes  Selector', () => {
      expect(
        selectors.FocSelector.selectDeletedABFocSchemes.projector(state)
      ).toBe(true);
    });
  });
});
