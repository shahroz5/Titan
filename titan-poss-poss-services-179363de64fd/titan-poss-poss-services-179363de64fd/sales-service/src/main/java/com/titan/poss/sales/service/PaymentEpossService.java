/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import com.titan.poss.sales.dto.response.CashbackUtilizedDto;

/**
 * Payment EPOSS service interface.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface PaymentEpossService {

	/**
	 * This method will get the utilized cashback count for the given card and offer
	 * id.
	 * 
	 * @param instrumentNo ---- card number(encrypted cardNo)
	 * @param offerId      ---- cashback offer id
	 * @return CashbackUtilizedDto
	 */
	CashbackUtilizedDto getCashbackUtilized(String instrumentNo, String offerId);

}
