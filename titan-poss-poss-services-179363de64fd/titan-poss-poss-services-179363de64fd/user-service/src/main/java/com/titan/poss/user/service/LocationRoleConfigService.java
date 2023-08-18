/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.service;

import org.springframework.stereotype.Service;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("userLocationRoleConfigService")
public interface LocationRoleConfigService {

	/**
	 * Create roles for provided location code taking value from default roles of
	 * location format
	 * 
	 * @param reqLocationCode location code
	 * @param locationFormat  LocationFormat Enum as String
	 * @param ownerType       OwnerType Enum as String
	 */
	void setLocationRoleLimit(String locationCode, String locationFormat, String ownerType);

}
