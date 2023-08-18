/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.service;

import java.math.BigDecimal;
import java.util.List;

import javax.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.config.dto.FocSchemeBaseDto;
import com.titan.poss.config.dto.FocSchemeResponseDto;
import com.titan.poss.config.dto.ManualFocSchemeResponseDto;
import com.titan.poss.core.discount.dto.FocSchemeRequestDto;
import com.titan.poss.core.dto.FocSchemeItemResponseDto;
import com.titan.poss.core.dto.GepConfigDetailResponse;
import com.titan.poss.core.dto.GepDiscountConfigurationDetailsDto;
import com.titan.poss.core.dto.GepRequestDetail;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.dto.TepItemResponseDto;
import com.titan.poss.core.dto.TepStoneResponseDto;
import com.titan.poss.core.dto.TepValidationConfigDetails;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.engine.config.dto.request.VerifyManualFOCDto;
import com.titan.poss.engine.dto.request.TepStoneRequestDto;
import com.titan.poss.engine.dto.response.FocSchemeForABResponseDto;
import com.titan.poss.sales.dao.SalesTxnDao;

import java.util.Date;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public interface ConfigService {

	/**
	 * @param buisnessDate
	 * @param locationCode
	 * @param itemType
	 * @param metalType
	 * @return percentage
	 */
	GepConfigDetailResponse getGEPDetails(GepRequestDetail gepRequestDetail);

	ListResponse<GepDiscountConfigurationDetailsDto> getGEPDiscountConfigs(List<BigDecimal> purityList);

	/**
	 * @param locationCode
	 * @return
	 */
	ListResponse<FocSchemeBaseDto> getFocActiveSchemes(String locationCode);

	/**
	 * @param focSchemeRequestDto
	 * @param abItemIdList
	 * @param cashMemoId
	 * @param orderToCmDto
	 * @return
	 */
	ListResponse<FocSchemeResponseDto> getFocSchemesAndItems(@Valid FocSchemeRequestDto focSchemeRequestDto,
			String cashMemoId, List<String> abItemIdList);

	/**
	 * @param mobileNumber
	 * @param mobileNumber2
	 * @return
	 */
	ListResponse<ManualFocSchemeResponseDto> getManualFocSchemeDetails(String mobileNumber);

	TepItemResponseDto getTepItem(String itemCode, String customerMobileNo, String tepType, Boolean boolean1);

	ListResponse<TepStoneResponseDto> getTepStone(TepStoneRequestDto tepStoneRequestDto);

	TepValidationConfigDetails getTepCancelDetails(String tepType);

	LovDto getLov(String lovType, Boolean isManualDiscount, Boolean isPageable, Pageable pageable);

	/**
	 * @param FocSchemeIndividualBaseDto
	 * @return
	 */
	ListResponse<FocSchemeItemResponseDto> getFocSchemesOnProductGroups(@Valid FocSchemeRequestDto focSchemeRequestDto);

	/**
	 * @param focSchemeRequestDto
	 * @return
	 */
	ListResponse<FocSchemeForABResponseDto> getFocSchemesForAB(@Valid FocSchemeRequestDto focSchemeRequestDto);

	SalesTxnDao validateCMManualFocDetails(String locationCode,
			String approvedBy, String CMNumber, String fiscalYear,String mobileNumber);
	

	void validateManualFocIsAlreadyGiven(VerifyManualFOCDto verifyManualFOCDto);
	
	TepItemResponseDto getTepItems(String itemCode, String customerMobileNo, String tepType, Boolean boolean1);

}
