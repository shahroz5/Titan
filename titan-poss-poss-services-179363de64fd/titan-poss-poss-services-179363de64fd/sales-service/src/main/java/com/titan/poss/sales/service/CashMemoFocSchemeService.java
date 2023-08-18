/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import com.titan.poss.core.dto.FocItemDetailsDto;
import com.titan.poss.core.dto.ManualFocSchemeItemDto;
import com.titan.poss.sales.dao.CashMemoDaoExt;
import com.titan.poss.sales.dao.FocSchemesDaoExt;
import com.titan.poss.sales.dto.FocSchemeDto;
import com.titan.poss.sales.dto.request.FocPendingRequestDto;
import com.titan.poss.sales.dto.response.FocPendingResponseDto;
import com.titan.poss.sales.dto.response.FocSchemeListResponseDto;

/**
 * 
 * Service interface w.r.t FOC schemes of cash Memo
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface CashMemoFocSchemeService {

	FocPendingResponseDto createPendingFocForCM(String id, String txnType, String subTxnType,
			FocPendingRequestDto focSchemes);

	FocSchemeListResponseDto listFocSchemesOfCM(String id, String txnType, String subTxnType);

	FocSchemesDaoExt mapFocSchemeDetails(CashMemoDaoExt cashMemoDao, FocSchemeDto focScheme,ManualFocSchemeItemDto manualFocSchemeItemDto);
}
