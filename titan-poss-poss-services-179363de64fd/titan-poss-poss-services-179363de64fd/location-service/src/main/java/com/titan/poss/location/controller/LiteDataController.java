/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.controller;

import static com.titan.poss.core.domain.constant.RegExConstants.REGEX_MSG;
import static com.titan.poss.core.domain.constant.RegExConstants.REGION_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.TOWN_NAME_REGEX;

import java.util.List;

import javax.validation.Valid;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.LocationDropDownDto;
import com.titan.poss.core.dto.LocationFilterDto;
import com.titan.poss.core.dto.LocationHeaderDto;
import com.titan.poss.core.dto.RegionLiteDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dto.response.BrandLiteDto;
import com.titan.poss.location.dto.response.CountryLiteDto;
import com.titan.poss.location.dto.response.CurrencyLiteDto;
import com.titan.poss.location.dto.response.StateLiteDto;
import com.titan.poss.location.dto.response.TownLiteDto;
import com.titan.poss.location.service.BrandService;
import com.titan.poss.location.service.CountryService;
import com.titan.poss.location.service.CurrencyService;
import com.titan.poss.location.service.LocationService;
import com.titan.poss.location.service.RegionService;
import com.titan.poss.location.service.StateService;
import com.titan.poss.location.service.TownService;

import io.swagger.annotations.ApiOperation;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("LocationLiteDataController")
@RequestMapping("location/v2/lite-data")
@Validated
public class LiteDataController {

	@Autowired
	private LocationService locationService;

	@Autowired
	private TownService townService;

	@Autowired
	private RegionService regionService;

	@Autowired
	private BrandService brandService;

	@Autowired
	private StateService stateService;

	@Autowired
	private CountryService countryService;

	@Autowired
	private CurrencyService currencyService;

	/**
	 * 
	 * 
	 * @param ownerTypeCodes - L1 or L2
	 * @param regionType     - Filter by TOWN,STATE,REGION,COUNTRY
	 * @param locationTypes  - BTQ
	 * @param pageable
	 * @return
	 */
	@ApiOperation(value = "List the locations applicable for Inter Boutique Transfer(IBT)", notes = "List the locations applicable for **Inter Boutique Transfer(IBT)**"
			+ "<br>regionType **TOWN,STATE,REGION,COUNTRY** are optional parameter"
			+ "<br>And **ownerTypeCode** i.e **L1 or L2**  and **locationTypes** i.e **BTQ** are optional parameters")
	@ApiPageable
	@GetMapping("/ibt/locations")
	public PagedRestResponse<List<LocationHeaderDto>> listLocations(
			@RequestParam(name = "ownerTypeCode", required = false) List<String> ownerTypeCodes,
			@RequestParam(name = "regionType", required = false) String regionType,
			@RequestParam(name = "locationType", required = false) List<String> locationTypes,
			@PageableDefault(value = 1000) @ApiIgnore Pageable pageable) {

		return locationService.listIBTLocations(regionType, ownerTypeCodes != null ? ownerTypeCodes : null,
				locationTypes != null ? locationTypes : null, pageable);

	}

	@ApiOperation(value = "API to view the list of Location details", notes = "This API will get the list of Location details based on Active status <br/>"
			+ "<br/><br/>User can provide the list of brandCodes to filter the location by Brand."
			+ "<br/>User can provide the list of regionCodes to filter the location by Region."
			+ "<br/>User can provide the list of ownerType(L1/L2/L3) to filter the location by OwnerType."
			+ "<br/>User can provide the list of stateCode to filter the location by States."
			+ "<br/>User can provide the list of townCode to filter the location by Town."
			+ "<br/>User can provide the list of countryCode to filter the location by Country."
			+ "<br/>User can provide the list of locationTypes to filter the location by LocationType."
			+ "<br/>User can provide the list of factoryCode to filter the location by Factory locations."
			+ "<br/>User can provide the list of cfaCode to filter the location by CFA locations."
			+ "<br/>User can provide the list of marketCode to filter the location by Market."
			+ "<br/>User can provide the list of locationFormat(SF,MF,LF,MICF) to filter the location by CFA locations.")
	@PostMapping("/locations")
	@ApiPageable
	public PagedRestResponse<List<LocationDropDownDto>> listLocationsDropDown(
			@RequestBody @Valid LocationFilterDto locationFilter,
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		if (BooleanUtils.isFalse(isPageable))
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		return locationService.listLocationsDropDown(locationFilter, pageable);
	}

	/**
	 * This method will return the list of Town details based on the stateId and
	 * isPageable.
	 * 
	 * @param stateId
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<TownLiteDto>>
	 */

	@ApiOperation(value = "API to get the list of Town details", notes = "This API will get the list of Town details based on **isPageable**")
	@GetMapping("states/{stateId}/towns")
	@ApiPageable
	public PagedRestResponse<List<TownLiteDto>> listTownsLite(@PathVariable("stateId") String stateId,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {

		return townService.listTownLite(stateId, isPageable, pageable);

	}

	/**
	 * This method will return the list of Region/Sub Region details based on the
	 * parentRegionCode and isPageable.
	 * 
	 * @param parentRegionCode
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<RegionLiteDto>>
	 */
	@ApiOperation(value = "View the list of Region/Sub Region details", notes = "This API returns the list of Region/Sub Region details based on **parentRegionCode** and **isPageable**")
	@GetMapping("/regions")
	@ApiPageable
	public PagedRestResponse<List<RegionLiteDto>> listRegionLite(
			@RequestParam(required = false) @PatternCheck(regexp = REGION_CODE_REGEX) String regionCode,
			@RequestParam(required = false) @PatternCheck(regexp = REGION_CODE_REGEX) String parentRegionCode,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return regionService.listRegionLite(regionCode, parentRegionCode, isPageable, pageable);
	}

	/**
	 * This method will return the list of Town details based on the town name
	 * 
	 * @param townName
	 * @return List<TownLiteDto>
	 */
	@ApiOperation(value = "API to get Town details", notes = "This API will get the Town details based on town name")
	@GetMapping("/towns")
	public PagedRestResponse<List<TownLiteDto>> listTownLite(
			@RequestParam(required = false) @PatternCheck(regexp = TOWN_NAME_REGEX) String townName,
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {

		return townService.getTownLite(townName, isPageable, pageable);

	}

	/**
	 * This method will return the list of Brand/Sub Brand details based on the
	 * parentBrandCode and isPageable.
	 * 
	 * @param parentBrandCode
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<BrandLiteDto>>
	 */
	@ApiOperation(value = "View the list of Brand/Sub Brand details", notes = "This API returns the list of Brand/Sub Brand details based on **parentBrandCode** and **isPageable**")
	@GetMapping("/brands")
	@ApiPageable
	public PagedRestResponse<List<BrandLiteDto>> listBrandLite(
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.BRAND_CODE_REGEX, message = REGEX_MSG) String parentBrandCode,
			@RequestParam(name = "parentBrandCodes", required = false) List<@PatternCheck(regexp = RegExConstants.BRAND_CODE_REGEX) String> parentBrandCodes,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return brandService.listBrandLite(parentBrandCode, isPageable, pageable, parentBrandCodes);
	}

	/**
	 * This method will return the list of Brand/Sub Brand details based on the
	 * parentBrandCode and isPageable.
	 * 
	 * @param regionCode
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<StateLiteDto>>
	 */
	@ApiOperation(value = "API to get State details", notes = "This API returns the list of States based on **regionCode** and **isPageable**")
	@GetMapping("/states")
	public PagedRestResponse<List<StateLiteDto>> listStateLite(
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.REGION_CODE_REGEX) String> regionCodes,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.COUNTRY_CODE_REGEX) String> countryCodes,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return stateService.listStateLite(regionCodes, countryCodes, isPageable, pageable);
	}

	/**
	 * This method will return the list of Town details based on the town name
	 * 
	 * @param townName
	 * @return List<TownLiteDto>
	 */
	@ApiOperation(value = "API to get Country details", notes = "This API will get the Country details")
	@GetMapping("/countries")
	public PagedRestResponse<List<CountryLiteDto>> listCountryLite(
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {

		return countryService.getCountryLite(isPageable, pageable);

	}

	/**
	 * This method will return the list of Town details based on the town name
	 * 
	 * @param townName
	 * @return List<CurrencyLiteDto>
	 */
	@ApiOperation(value = "API to get Currency details", notes = "This API will get the Currency details")
	@GetMapping("/currencies")
	public PagedRestResponse<List<CurrencyLiteDto>> listCurrencyLite(
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {

		return currencyService.getCurrencyLite(isPageable, pageable);

	}

}