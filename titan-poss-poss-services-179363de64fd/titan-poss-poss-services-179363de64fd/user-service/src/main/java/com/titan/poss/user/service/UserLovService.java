/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.service;

import org.springframework.stereotype.Service;

import com.titan.poss.user.dto.response.LovDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("userLovService")
public interface UserLovService {

	/**
	 * This method will return the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @param isActive
	 * @return
	 */
	LovDto getLov(String lovType, Boolean isActive);

}
