/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.service;

import com.titan.poss.inventory.dto.request.LovUpdateDto;
import com.titan.poss.inventory.dto.response.LovCreateDto;
import com.titan.poss.inventory.dto.response.LovDto;
import com.titan.poss.inventory.dto.response.LovTypesDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface LovService {

	/**
	 * This method will return the list of lovTypes.
	 * 
	 * @return LovTypesDto
	 */
	LovTypesDto getLovTypes();

	/**
	 * This method will return the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @return LovDto
	 */
	LovDto getLov(String lovType, Boolean isActive);

	/**
	 * This method will create the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @param lovCreateDto
	 * @return LovCreateDto
	 */
	LovCreateDto createLov(LovCreateDto lovCreateDto);

	/**
	 * This method will update the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @param lovUpdateDto
	 * @return LovDto
	 */
	LovDto updateLov(String lovType, LovUpdateDto lovUpdateDto);
}
