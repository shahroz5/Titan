/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.domain.constant;

import java.util.List;

/**
 * Transaction action enum
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public enum TransactionActionTypeEnum {

	CANCEL_REQUEST, CANCEL, ACTIVATE_REQUEST, ACTIVATE, RATE_FREEZE, ADD_PAYMENT, VIEW_ORDERS;

	public static List<String> actionNotAllowedForMigratedAbOrCo() {
		return List.of(TransactionActionTypeEnum.RATE_FREEZE.name(), TransactionActionTypeEnum.ADD_PAYMENT.name());
	}

}
