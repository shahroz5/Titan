/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.service;

import com.titan.poss.payment.dto.LovCreateDto;
import com.titan.poss.payment.dto.request.LovUpdateDto;
import com.titan.poss.payment.dto.response.LovDto;
import com.titan.poss.payment.dto.response.LovTypesDto;
import org.springframework.stereotype.Service;

import static com.titan.poss.payment.constants.PaymentConstants.LOV_SERVICE;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service(LOV_SERVICE)
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
