/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dto.request.PincodeCreateDto;
import com.titan.poss.location.dto.response.PincodeDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface PincodeService {

	/**
	 * This method will return the list of pincode details.
	 * 
	 * @param countryCode
	 * @param pincode
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<PincodeDto>>
	 * 
	 */
	PagedRestResponse<List<PincodeDto>> listPincode(String countryCode, String pincode, Boolean isActive,
			Pageable pageable);

	/**
	 * This method will return the pincode details.
	 * 
	 * @param id
	 * @return PincodeDto
	 */
	PincodeDto getPincode(String id);

	/**
	 * This method will save the Pincode details.
	 * 
	 * @param pincodeCreateDto
	 * @return PincodeDto
	 * 
	 */
	PincodeDto addPincode(PincodeCreateDto pincodeCreateDto);

	/**
	 * This method will update the pincode details.
	 * 
	 * @param pincodeCreateDto
	 * @param id
	 * @return PincodeDto
	 * 
	 */
	PincodeDto updatePincode(String id, PincodeCreateDto pincodeCreateDto);
}