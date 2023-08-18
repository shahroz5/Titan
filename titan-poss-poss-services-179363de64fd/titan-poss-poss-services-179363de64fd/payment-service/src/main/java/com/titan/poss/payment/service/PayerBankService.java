/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service;

import static com.titan.poss.payment.constants.PaymentConstants.PAYER_BANK_SERVICE;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.payment.dto.PayerBankDto;
import com.titan.poss.payment.dto.request.PayerBankUpdate;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service(PAYER_BANK_SERVICE)
public interface PayerBankService {

	/**
	 * This method will return the list of payer bank based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @param bankName
	 * @param isCashBack 
	 * @return PagedRestResponse<List<PayerBankDto>>
	 */
	PagedRestResponse<List<PayerBankDto>> listPayerBank(Boolean isActive, Pageable pageable, String bankName, Boolean isCashBack);

	/**
	 * This method will update the Payer bank.
	 * 
	 * @param payerBank
	 * @return PayerBankDto
	 */
	ListResponse<PayerBankDto> updatePayerBank(PayerBankUpdate payerBank);

}
