/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.titan.poss.core.enums.CNType;
import com.titan.poss.sales.constants.CancellationTypeEnum;
import com.titan.poss.sales.dao.CancelDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface CashMemoCancelService {

	Map<String, Integer> cancelPaymentWise(SalesTxnDaoExt salesTxn, CancelDaoExt cancel,
			CancellationTypeEnum cancelType, CNType cnType, Date docDate);

	List<CancellationTypeEnum> allowedCancelTypeByTxnId(SalesTxnDaoExt salesTxn, BigDecimal tcsAmount);
}
