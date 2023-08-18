/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.integration.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.CMLegacyResponseDto;
import com.titan.poss.core.dto.CreditNoteLegacyInboundRequestDto;
import com.titan.poss.core.dto.CustomerTcsData;
import com.titan.poss.core.dto.CustomerTcsDetailsDto;
import com.titan.poss.core.dto.GVRequestDto;
import com.titan.poss.core.dto.GVRequestUpdateDto;
import com.titan.poss.core.dto.GVStatusDto;
import com.titan.poss.core.dto.GrnLegacyUpdateDto;
import com.titan.poss.core.dto.PmlaLegacyResponseDto;
import com.titan.poss.core.dto.TepLegacyUpdateDto;
import com.titan.poss.core.response.LegacyGVResponse;
import com.titan.poss.core.enums.SearchTypeEnum;
import com.titan.poss.integration.dto.response.PossCashPaidDetailsDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface LegacyInBoundService {

	/**
	 * @param gvDetails
	 * @return List<GiftDetailsResponseDto>
	 */
	List<LegacyGVResponse> listGiftDetails(GVRequestDto gvDetails);

	/**
	 * @param giftStatusUpdate
	 * @return List<GVStatusDto>
	 */
	List<GVStatusDto> updateGiftStatus(GVRequestUpdateDto giftStatusUpdate);
	
	/**
	 * @param cnTransferLegacyRequestDto
	 * @return
	 */
	CreditNoteLegacyInboundRequestDto transferCreditNote(CreditNoteLegacyInboundRequestDto cnTransferLegacyRequestDto);
	/**
	 * @param locationCode
	 * @param refDocNo
	 * @param refFiscalYear
	 * @return CMLegacyResponseDto
	 */
	CMLegacyResponseDto getCashMemoDetailsService(String locationCode,
			Short fiscalYear, Integer refDocNo);
	
	void updateGrnItemsLegacyService(GrnLegacyUpdateDto updatedGrnDto);
	
	void updateTepItemsLegacyService(TepLegacyUpdateDto updatedTepDto);

	PossCashPaidDetailsDto getCashCollectedAtPOSS(String searchType, String searchValue, String businessDate,
			String locationCode);
	PmlaLegacyResponseDto getPmlaNapService(String dtBusinessDate, String ulpMembershipId);

	List<CustomerTcsDetailsDto> retrieveLegacyTcsPaymentDetails(SearchTypeEnum searchTypeEnum, String searchField, Short fiscalYear, String locationCode);
	
	CustomerTcsData retrieveTcsData(String customerMobileNo, Short fiscalYear, String btqPanCard);

}
