/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.config.service;

import org.springframework.stereotype.Service;

import com.titan.poss.config.dto.LovTypesDto;
import com.titan.poss.config.dto.request.LovUpdateDto;
import com.titan.poss.config.dto.response.LovCreateDto;
import com.titan.poss.core.dto.LovDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("LOV_SERVICE")
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
	 * @param lovCode
	 * @return LovDto
	 */
	LovDto getLov(String lovType, String lovCode);

	/**
	 * This method will create the Lov details based on the lovType.
	 * 
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
