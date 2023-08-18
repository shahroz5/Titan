/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.integration.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.CmForCustomerLegacyDto;
import com.titan.poss.core.dto.CreditNoteLegacyResponseDto;
import com.titan.poss.core.dto.GVRequestDto;
import com.titan.poss.core.dto.GVRequestUpdateDto;
import com.titan.poss.core.dto.GVStatusDto;
import com.titan.poss.core.dto.GrnLegacyUpdateDto;
import com.titan.poss.core.dto.PmlaLegacyResponseDto;
import com.titan.poss.core.dto.TepLegacyUpdateDto;
import com.titan.poss.core.response.LegacyGVResponse;
import com.titan.poss.sales.dto.CashMemoEntities;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface LegacyOutBoundService {

	List<LegacyGVResponse> getGiftVoucherService(GVRequestDto giftStatusReq);

	List<GVStatusDto> getGiftVoucherUpdateService(GVRequestUpdateDto giftStatusReq);

	CreditNoteLegacyResponseDto transferCreditNote(String id, String destLocationCode);

	CashMemoEntities getCashMemoDetailsService(String locationCode, Short refFiscalYear, Integer refDocNo,Boolean isGRNAllowed);

	void updateGrnItemsLegacyService(GrnLegacyUpdateDto updatedGrnDto);

	//PmlaLegacyResponseDto getPmlaNapService(String dtBusinessDate, String ulpMembershipId);
	
	CashMemoEntities getTepCashMemoDetailsService(String locationCode, Short refFiscalYear, Integer refDocNo,Boolean isInterBrand,Boolean isFullValueTEP);

	 List<CmForCustomerLegacyDto>  getCMforCustomer(String locationCode, String itemCode, String customerMobileNo, String customerId,
			Boolean isMigratedIgnored);

	void updateTepItemsLegacyService(TepLegacyUpdateDto updatedTepDto);

	PmlaLegacyResponseDto getPmlaNapService(String dtBusinessDate, String ulpMembershipId);
}
