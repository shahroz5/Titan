/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.domain.acl;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public class StoreAccessControls {

	private StoreAccessControls() {
		throw new IllegalArgumentException("StoreAccessControls class");
	}

	public static final String CUSTOMER_TOWN_MASTER_ADD_EDIT = "M52";
	public static final String CUSTOMER_TOWN_MASTER_VIEW = "M51";

	public static final String CATCHMENT_MASTER_ADD_EDIT = "M98";
	public static final String CATCHMENT_MASTER_VIEW = "M97";

}
