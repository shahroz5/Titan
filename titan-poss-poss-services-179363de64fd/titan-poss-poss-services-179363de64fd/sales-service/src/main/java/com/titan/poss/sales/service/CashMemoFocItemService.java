/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.util.List;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.sales.dao.FocDetailsDaoExt;
import com.titan.poss.sales.dto.request.FocDetailRequestDto;
import com.titan.poss.sales.dto.response.FocItemResponseDto;

/**
 * service interface for cash memo FOC items.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface CashMemoFocItemService {

	ListResponse<FocItemResponseDto> addFOCItemToCM(String id, String txnType, String subTxnType,
			FocDetailRequestDto focDetails);

	ListResponse<FocItemResponseDto> listFocItemsOfCM(String id, String txnType, String subTxnType);

	ListResponse<FocItemResponseDto> listManualFocItemsOfCM(String id, String txnType, String subTxnType);

	void deleteFocItemFromCM(String id, String txnType, String subTxnType);

	/**
	 * this method will give FOC items without error.
	 * 
	 * @param id
	 * @param txnType
	 * @param subTxnType
	 * @return List<FocDetailsDao>
	 */
	List<FocDetailsDaoExt> getCashMemoFocItemsWoError(String id, String txnType, String subTxnType);

	ListResponse<FocItemResponseDto> addManualFOCItemToCM(String id, String txnType, String subTxnType,
			FocDetailRequestDto focDetails, String manualFocStartDate, String manualFocEndDate, String approvedBy);
}
