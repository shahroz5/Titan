/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.service.clients;

import static com.titan.poss.core.domain.constant.RegExConstants.COUNTRY_CODE_REGEX;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.CountryDto;
import com.titan.poss.core.dto.LocationDropDownDto;
import com.titan.poss.core.dto.LocationFilterDto;
import com.titan.poss.core.dto.LocationHeaderDto;
import com.titan.poss.core.dto.RegionLiteDto;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.filter.FeignClientInterceptor;
import com.titan.poss.core.response.PagedRestResponse;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@FeignClient(contextId = "locationContextId", name = "location-service", configuration = FeignClientInterceptor.class)
public interface LocationServiceClient {

	@GetMapping(value = "location/v2/lite-data/ibt/locations")
	PagedRestResponse<List<LocationHeaderDto>> getIBTLocations(
			@RequestParam(value = "regionType", required = false) String regionType,
			@RequestParam(value = "ownerTypeCode", required = true) List<String> ownerTypeCodes,
			@RequestParam(value = "locationType", required = true) List<String> locationTypes);

	@GetMapping(value = "location/v2/lite-data/regions")
	PagedRestResponse<List<RegionLiteDto>> getAllRegion(
			@RequestParam(required = false, value = "regionCode") String regionCode,
			@RequestParam(required = false, value = "parentRegionCode") String parentRegionCode,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable);

	@PostMapping(value = "location/v2/lite-data/locations")
	PagedRestResponse<List<LocationDropDownDto>> listLocationsDropDown(@RequestBody LocationFilterDto locationFilter,
			@RequestParam(name = "isPageable", required = false, defaultValue = "false") Boolean isPageable);

	@GetMapping(value = "location/v2/jobs/publish-to-datasync")
	public SchedulerResponseDto publishToDataSync(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@GetMapping(value = "location/v2/jobs/metal-rate-update")
	public SchedulerResponseDto triggerUpdateMaterialRate(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@GetMapping(value = "location/v2/countries/{countryCode}")
	public CountryDto getCountry(@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie,
			@PathVariable("countryCode") @PatternCheck(regexp = COUNTRY_CODE_REGEX) String countryCode);
}
