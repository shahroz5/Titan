/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.store.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.titan.poss.store.dto.BankPriorityDto;
import com.titan.poss.store.dto.request.PriorityDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("bankPriorityService")
public interface BankPriorityService {

	/**
	 * @return List<BankPriorityDto>
	 */
	List<BankPriorityDto> listBankPriority();

	/**
	 * @param bankPriorityDto
	 * @param locationCode
	 * @return BankPriorityDto
	 */
	List<BankPriorityDto> updateBankPriority(PriorityDto bankPriorityDto, String locationCode);

}
