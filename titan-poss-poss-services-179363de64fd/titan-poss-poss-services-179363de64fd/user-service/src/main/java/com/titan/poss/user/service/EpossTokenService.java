/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.user.service;

import com.titan.poss.integration.dao.VendorDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface EpossTokenService {

	String getAuthHeaderToken(VendorDao vendorDao);
}
