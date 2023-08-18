/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.List;

import javax.validation.Valid;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dto.FocDetailAbDto;
import com.titan.poss.sales.dto.FocSchemesAbCreateDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface AdvBookingFocItemService {

	List<FocSchemesAbCreateDto> addFocDetails(String id, String txnType, String subTxnType,
			@Valid FocDetailAbDto focDetails);

	/**
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @return
	 */
	ListResponse<FocSchemesAbCreateDto> getFocDetails(String id, String txnType, String subTxnType);

	/**
	 * @param id
	 * @param focSchemeId
	 * @param txnType
	 * @param subTxnType
	 */
	void deleteFocItemFromCM(String id, List<String> focSchemeId, String txnType, String subTxnType);

}
