/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service;

import org.springframework.stereotype.Service;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface UserService {
	/**
	 * @param locationCode
	 * @param locationFormat
	 * @param ownerType
	 * @return
	 */
	public void assignRolesToBoutique(String locationCode, String locationFormat, String ownerType);
}
