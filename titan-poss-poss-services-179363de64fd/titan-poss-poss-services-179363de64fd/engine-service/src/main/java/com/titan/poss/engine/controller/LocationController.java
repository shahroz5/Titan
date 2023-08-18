/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.controller;

import static com.titan.poss.core.domain.constant.RegExConstants.COUNTRY_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100;
import static com.titan.poss.core.domain.constant.RegExConstants.LOCATION_CODE_REGEX;
import static com.titan.poss.core.domain.constant.RegExConstants.MARKET_CODE_REGEX;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.validation.Valid;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.auth.domain.AuthUser;
import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.BoutiqueMetalRateRequestDto;
import com.titan.poss.core.dto.BrandDto;
import com.titan.poss.core.dto.BusinessDateDto;
import com.titan.poss.core.dto.CfaDto;
import com.titan.poss.core.dto.CountryDetailsDto;
import com.titan.poss.core.dto.CountryDto;
import com.titan.poss.core.dto.EdcBankRequestDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationCacheRequestDto;
import com.titan.poss.core.dto.LocationCoordinateDto;
import com.titan.poss.core.dto.LocationDropDownDto;
import com.titan.poss.core.dto.LocationFilterDto;
import com.titan.poss.core.dto.LocationResponseDto;
import com.titan.poss.core.dto.LocationServicesDto;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.dto.MarketDto;
import com.titan.poss.core.dto.MetalApplicableDto;
import com.titan.poss.core.dto.MetalGoldPriceDto;
import com.titan.poss.core.dto.MetalRateResponseDto;
import com.titan.poss.core.dto.PayerBankDtoRes;
import com.titan.poss.core.dto.StateLiteDto;
import com.titan.poss.core.dto.StorePrintDetailsDto;
import com.titan.poss.core.dto.TownLiteDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.engine.dto.CountryLiteDto;
import com.titan.poss.engine.dto.PincodeDto;
import com.titan.poss.engine.service.LocationService;
import com.titan.poss.location.acl.LocationACLConstants;
import com.titan.poss.location.dto.constants.LovTypeEnum;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Validated
@RestController("engineLocationController")
@RequestMapping(value = "engine/v2/locations")
public class LocationController {

	@Autowired
	private LocationService locationService;

	private static final String METAL_RATE_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.BOUTIQUE_METAL_RATE_ADD_EDIT + "' )";

	/**
	 * This method will return the Country details.
	 */
	@GetMapping("country-details")
	@ApiOperation(value = "This method will return the Country details.", notes = "This method will return the Country details.")
	public CountryDetailsDto getCountryDetails(
			@RequestParam(name = "locationCode", required = false) @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode) {

		return locationService.getCountryDetails(locationCode);
	}

	/**
	 * This method will return the list of Country details based on the isPageable.
	 * 
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<CountryLiteDto>>
	 */
	@ApiOperation(value = "API to view the list of Country details", notes = "This API will get the list of Country details based on **isPageable**")
	@GetMapping("/countries")
	@ApiPageable
	public PagedRestResponse<List<CountryLiteDto>> listCountry(
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@RequestParam(required = false) @PatternCheck(regexp = DESCRIPTION_REGEX_SPCL_CHAR_MAX_100) String description,
			@ApiIgnore Pageable pageable) {
		return locationService.listCountryLite(isPageable, description, pageable);
	}

	/**
	 * This method will return the Lov details based on the lovType.
	 * 
	 * @param lovType
	 * @return LovDto
	 */
	@ApiOperation(value = "View the Lov details", notes = "View the Lov details based on **lovType**")
	@GetMapping(value = "lov/{lovType}")
	public LovDto getLov(
			@ApiParam(name = "lovType", value = "'lovType' to get details", allowableValues = "LOCATIONTYPE, OWNERTYPE, LOCATIONFORMAT,  TAXSYSTEM, TAXTRANSACTIONTYPE, MATERIALPRICETYPE, DATEFORMAT, TIMEFORMAT, PRINT_DOC_TYPE", required = true) @PathVariable("lovType") @ValueOfEnum(enumClass = LovTypeEnum.class) String lovType) {
		return locationService.getLocationLov(lovType);
	}

	/**
	 * This method will return the list of State details based on the countryCode
	 * and isPageable.
	 * 
	 * @param countryCode
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<StateLiteDto>>
	 */
	@ApiOperation(value = "API to get the list of State details", notes = "This API will get the list of State details based on **countryCode** and **isPageable**")
	@GetMapping("/countries/{countryCode}/states")
	@ApiPageable
	public PagedRestResponse<List<StateLiteDto>> listStatelite(
			@PathVariable("countryCode") @PatternCheck(regexp = RegExConstants.COUNTRY_CODE_REGEX) String countryCode,
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return locationService.listStateLite(countryCode, isPageable, pageable);
	}

	/**
	 * This method will return the list of pincode details based on countryCode and
	 * isPageable.
	 * 
	 * @param countryCode
	 * @param pincode
	 * @param isPageable
	 * @param pageable
	 * @return PagedRestResponse<List<PincodeLiteDto>>
	 */
	@ApiOperation(value = "API to view the list of pincodes", notes = "This API will get the list of pincode details based on **countryCode** and **isPageable**")
	@GetMapping("/countries/{countryCode}/pincodes")
	@ApiPageable
	public PagedRestResponse<List<PincodeDto>> listPincodeLite(
			@PathVariable("countryCode") @PatternCheck(regexp = RegExConstants.COUNTRY_CODE_REGEX) String countryCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.PIN_CODE_REGEX) String pincode,
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {

		return locationService.listPincodeLite(countryCode, pincode, isPageable, pageable);
	}

	/**
	 * This method will return the Location details for specific store.
	 * 
	 * @return LocationResponseDto
	 */
	@ApiOperation(value = "API to fetch the Location details for specific store.", notes = "This API will fetch the  Location details,Factory Details for specific store.")
	@GetMapping("/details")
	public LocationResponseDto getBoutiqueLocationDetails() {
		AuthUser authUser = (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		LocationResponseDto locationDto = new LocationResponseDto();
		if (!StringUtils.isEmpty(authUser.getLocationCode())) {
			locationDto = locationService.listLocationByLocationCode(authUser.getLocationCode());
		}
		return locationDto;
	}

	/**
	 * This method will return the Location details based on the locationCode.
	 * 
	 * @param locationCode
	 * @return StoreLocationDto
	 */
	@ApiOperation(value = "View the Location details based on the locationCode", notes = "View the Location details based on the **locationCode**<br>"
			+ "The response of this API will be cached.")
	@GetMapping("/{locationCode}/cache")
	public LocationCacheDto getStoreLocation(
			@PathVariable("locationCode") @PatternCheck(regexp = LOCATION_CODE_REGEX) String locationCode) {
		return locationService.getStoreLocation(locationCode);

	}

	@ApiOperation(value = "View the Location details based on the locationCode with State Code", notes = "View the Location details based on the **locationCode with State Code**<br>"
			+ "The response of this API will be cached.")
	@GetMapping("/{locationCode}/cacheTaxCode")
	public StorePrintDetailsDto getStoreLocationWithTaxCode(
			@PathVariable("locationCode") @PatternCheck(regexp = LOCATION_CODE_REGEX) String locationCode) {
		return locationService.getStorePrintInformation(locationCode);

	}

	@ApiOperation(value = "Get store details required for printing", notes = "Get store details based on the logged in user's **locationCode**<br>"
			+ "The response of this API will be cached.")
	@GetMapping("/print-info")
	public StorePrintDetailsDto getStorePrintInformation() {
		return locationService.getStorePrintInformation(CommonUtil.getStoreCode());

	}

	/**
	 * This method will return the Location details based on the List of
	 * locationCode.
	 * 
	 * @param locationCode
	 * @return StoreLocationDto
	 */
	@ApiOperation(value = "View the Location details based on the locationCode", notes = "View the Location details based on the **locationCode**")
	@PostMapping("/stores/cache")
	public ListResponse<LocationCacheDto> getStoreLocationDetails(
			@RequestBody LocationCacheRequestDto locationCacheRequestDto) {
		List<LocationCacheDto> locationDtoList = new ArrayList<>();
		if (!locationCacheRequestDto.getLocationCodes().isEmpty()) {
			locationCacheRequestDto.getLocationCodes()
					.forEach(locationCode -> locationDtoList.add(getStoreLocation(locationCode)));
		}
		return new ListResponse<>(locationDtoList);
	}

	// @formatter:off
	@ApiOperation(value = "Save metal rates for boutique", notes = "This API is to save the updated metal rates for offline scenario.<br>"
			+ " In EPOSS level whatever metal rates and password are set,in POSS the same should be in request. Else user will get error saying **Invalid"
			+ " data or invalid password**."
			+ "<span style=\"font-weight: bold;font-size:14px;\">In response for **standardMetalrates** the structure will be: </span><br>"
			+ "<ul>" 
			+ "	<li>additionalProp1: J</li>"
			+ "	<li>additionalProp2: P</li>"
			+ "	<li>additionalProp3: L</li>"
			+ "</ul><br>")
	// @formatter:on
	@PostMapping("/metal-rates")
	@PreAuthorize(METAL_RATE_ADD_EDIT_PERMISSION)
	public MetalRateResponseDto saveMetalRates(
			@ApiParam(name = "body", value = "Metalrate details object that is required to validate password", required = true) @RequestBody @Valid BoutiqueMetalRateRequestDto boutiqueMetalRateRequestDto) {
		return locationService.saveMetalRates(boutiqueMetalRateRequestDto);
	}

	/**
	 * This method will return the Location details based on the locationCode.
	 * 
	 * @param locationCode
	 * @return StoreLocationDto
	 */
	@ApiOperation(value = "View the Market details based on the marketCode", notes = "View the Market details based on the **marketCode**<br>"
			+ "The response of this API will be cached.")
	@GetMapping("/markets/{marketCode}/cache")
	public MarketDto getMarketDetails(
			@PathVariable("marketCode") @PatternCheck(regexp = MARKET_CODE_REGEX) String marketCode) {
		return locationService.getMarketDetails(marketCode);

	}

	/**
	 * This method will get Brand details for the provided brandCode. 1. For a store
	 * user, brandCode is picked from taken 2. A commercial user needs to give
	 * brandCode as input
	 * 
	 * @param brandCode
	 * @return BrandDto
	 */
	@ApiOperation(value = "View the Brand details based on the brandCode", notes = "This API returns the Brand details based on the **brandCode**.<br> For a store user, brand code is taken internally, no need to pass.")
	@GetMapping(value = "/brand-details")
	public BrandDto getBrand(
			@ApiParam(name = "brandCode", value = "Provide 'brandCode' to get details", required = false) @RequestParam(name = "brandCode", required = false) @PatternCheck(regexp = RegExConstants.BRAND_CODE_REGEX) String brandCode) {

		return locationService.getBrandDetails(brandCode);
	}

	@GetMapping(value = "/location-details")
	public List<String> getAppBasedLocations() {
		return locationService.getAppBasedLocations();
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
	@PostMapping("/stores")
	@ApiPageable
	public PagedRestResponse<List<LocationDropDownDto>> listLocationsDropDown(
			@RequestBody @Valid LocationFilterDto locationFilter,
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		if (BooleanUtils.isFalse(isPageable)) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}
		return locationService.listLocationsDropDown(locationFilter, pageable);
	}

	/**
	 * This method will return the Country details based on the countryCode.
	 * 
	 * @param countryCode
	 * @return CountryDto
	 */
	@ApiOperation(value = "API to view the Country details based on the countryCode", notes = "This API will get the Country details based on the **countryCode**")
	@GetMapping(value = "/{countryCode}")
	public CountryDto getCountry(
			@PathVariable("countryCode") @PatternCheck(regexp = COUNTRY_CODE_REGEX) String countryCode) {
		return locationService.getCountry(countryCode);
	}

	/**
	 * This method will return the Country details based on the countryCode.
	 * 
	 * @param countryCode
	 * @return CountryDto
	 */
	@ApiOperation(value = "API to view the state and town details", notes = "This API will get the state/town based on the **id**")
	@GetMapping(value = "/state-town")
	public TownLiteDto getStateAndTownDetails(
			@RequestParam(name = "stateId", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String stateId,
			@RequestParam(name = "townId", required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String townId) {
		return locationService.getStateAndTownDetails(stateId, townId);
	}

	/**
	 * This method will return the Location details for specific store.
	 * 
	 * @return CfaDto
	 */
	@ApiOperation(value = "API to fetch the list of Cfa details", notes = "This API will fetch the  CFA list details.")
	@GetMapping("/cfa")
	public List<CfaDto> getCfaDetails() {
		AuthUser authUser = (AuthUser) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
		List<CfaDto> cfaDto = new ArrayList<>();
		if (!StringUtils.isEmpty(authUser.getLocationCode())) {
			cfaDto = locationService.getlistOfCfa();
		}
		return cfaDto;
	}

	@ApiOperation(value = "Get all Locations if Active", notes = "This API will get all locations locationCode , latitude and longitude values if active ")
	@GetMapping("/active-locations")
	public List<LocationCoordinateDto> getAllByLocationIfIsActive() {
		return locationService.getAllByLocationIfIsActive();
	}
	
	/**
	 * This method will return the market details.
	 */
	@ApiOperation(value = "This method will return the metal price details.", notes = "This method will return the metal price details.")
	@PostMapping("/metal-details/{locationCode}")
	public List<MetalGoldPriceDto> getMarketMetalDetails(
			@PathVariable("locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode,
			@RequestBody @Valid MetalApplicableDto applicableDate) {
		return locationService.getMarketMetalDetails(locationCode,applicableDate);
	}
	
	/**
	 * This method will return the location details based on the locationCode.
	 * 
	 * @param locationCode
	 * @return GLCodeDto
	 */
	@ApiOperation(value = "This method will return the location details based on the locationCode", notes = "This method will return the location details based on the locationCode")
	@GetMapping(value = "/location-details/{locationCode}")
	public List<LocationServicesDto>  getLocationDetails(
			@PathVariable("locationCode") @PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String locationCode) {
		return locationService.getLocationDetails(locationCode);
	}
	
	/**
	 * This method will return the location code based on the date range.
	 * 
	 * @param locationCode
	 * @return GLCodeDto
	 */
	@ApiOperation(value = "This method will return the location details based on the date range", notes = "This method will return the location details based on the date range")
	@PostMapping(value = "/service-location-details")
	public List<String>  getLocationCodes(
			@RequestBody(required = true) @Validated EdcBankRequestDto edcBankRequestDto) {
		return locationService.getLocationCodes(edcBankRequestDto);
	}
	
	
}
