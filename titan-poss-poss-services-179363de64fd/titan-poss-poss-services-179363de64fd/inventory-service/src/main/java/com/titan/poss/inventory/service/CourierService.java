/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.inventory.service;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.inventory.dto.AddRemoveLocationDto;
import com.titan.poss.inventory.dto.request.CourierUpdateDto;
import com.titan.poss.inventory.dto.response.CourierDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface CourierService {

	/**
	 * This method will return the list of Courier details.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<CourierDto>>
	 */
	PagedRestResponse<List<CourierDto>> listCourier(Boolean isActive, Pageable pageable);

	/**
	 * This method will return the Courier details based on the id.
	 * 
	 * @param courierName
	 * @return CourierDto
	 */
	CourierDto getCourier(String courierName);

	/**
	 * This method will save the Courier details.
	 * 
	 * @param courierDto
	 * @return CourierDto
	 */
	CourierDto addCourier(CourierDto courierDto);

	/**
	 * This method will update the Courier details.
	 * 
	 * @param courierName
	 * 
	 * @param courierDto
	 * @return CourierDto
	 */
	CourierDto updateCourier(String courierName, CourierUpdateDto courierUpdateDto);

	/**
	 * This method will filter the Courier details based on the locationCode.
	 * 
	 * @param isActive
	 * @param locationCode
	 * @return PagedRestResponse<List<CourierDto>>
	 */
	ListResponse<CourierDto> listCouriersByLocation(Boolean isActive, String locationCode);

	/**
	 * This method will filter the Courier details based on the locationCode.
	 * 
	 * @param isActive
	 * @param locationCode
	 * @return PagedRestResponse<List<CourierDto>>
	 */
	PagedRestResponse<List<CourierDto>> listCouriersByLocationByPage(Boolean isActive, String locationCode,
			Pageable pageable);

	/**
	 * This method will add or remove the location mapping with the courier.
	 * 
	 * @param courierName
	 * @param addRemoveLocationDto
	 * @return
	 */
	Boolean addRemoveLocationMapping(String courierName, AddRemoveLocationDto addRemoveLocationDto);

	/**
	 * This method will return the list of location codes based on courierName and
	 * isActive.
	 * 
	 * @param courierName
	 * @param isActive
	 * @return ListResponse<String>
	 */
	ListResponse<String> getLocationCodes(String courierName, Boolean isActive);
}
