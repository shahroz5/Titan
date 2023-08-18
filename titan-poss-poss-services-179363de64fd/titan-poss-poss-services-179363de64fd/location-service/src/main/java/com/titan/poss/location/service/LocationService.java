/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.service;

import java.util.List;

import javax.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.dto.LocationDropDownDto;
import com.titan.poss.core.dto.LocationFilterDto;
import com.titan.poss.core.dto.LocationHeaderDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dto.LocationDto;
import com.titan.poss.location.dto.PriceGroupMapDto;
import com.titan.poss.location.dto.request.LocationPriceGroupDto;
import com.titan.poss.location.dto.request.LocationUpdateDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public interface LocationService {

	/**
	 * This method will return the Location details based on the locationCode.
	 * 
	 * @param locationCode
	 * @return LocationDto
	 */
	LocationDto getLocation(String locationCode);

	/**
	 * This method will save the Location details.
	 * 
	 * @param locationDto
	 * @return LocationDto
	 */
	LocationDto addLocation(LocationDto locationDto);

	/**
	 * This method will update the Location details.
	 * 
	 * @param locationCode
	 * @param locationUpdateDto
	 * @return LocationDto
	 */
	LocationDto updateLocation(String locationCode, LocationUpdateDto locationUpdateDto);

	/**
	 * This method will copy the Location details from the source location to the
	 * destination location.
	 * 
	 * @param srcLocationCode
	 * @param dstLocationCode
	 * @return LocationDto
	 */
	LocationDto copyLocation(String srcLocationCode, String dstLocationCode);

	/**
	 * This method will return the locations applicable for Inter boutique transfer
	 * 
	 * @param regionType     - TOWN,STATE,REGION,COUNTRY
	 * @param ownerTypeCodes - L1 or L2
	 * @param locationTypes  - BTQ
	 * @param pageable
	 * @return
	 */

	PagedRestResponse<List<LocationHeaderDto>> listIBTLocations(String regionType, List<String> ownerTypeCodes,
			List<String> locationTypes, Pageable pageable);

	/**
	 * This method will activate the Location by performing all the validations.
	 * 
	 * @param locationCode
	 * @return LocationDto
	 */
	LocationDto activateLocation(String locationCode);

	PagedRestResponse<List<LocationDropDownDto>> listLocationsDropDown(LocationFilterDto locationFilter,
			Pageable pageable);

	/**
	 * This method will return the PriceGroup details based on the locationCode.
	 * 
	 * @param locationCode
	 * @return PriceGroupMapDto
	 */
	ListResponse<PriceGroupMapDto> listLocationPriceGroupMapping(String locationCode);

	/**
	 * This method will Create/Remove Mapping between location and price group.
	 * 
	 * @param locationCode
	 * @return LocationPriceGroupDto
	 */

	LocationPriceGroupDto locationPriceGroupMapping(String locationCode,
			@Valid LocationPriceGroupDto locationPriceGroupDto);

	/**
	 * This method will return the list of Locations.
	 * 
	 * @param isActive
	 * @return LocationHeaderDto
	 */
	PagedRestResponse<List<LocationHeaderDto>> listLocations(Boolean isActive, String locationType, Pageable pageable);

}
