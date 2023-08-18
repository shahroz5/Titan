/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.controller;

import static com.titan.poss.core.domain.constant.RegExConstants.LOCATION_CODE_REGEX;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.LocationHeaderDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.acl.LocationACLConstants;
import com.titan.poss.location.dto.LocationDto;
import com.titan.poss.location.dto.PriceGroupMapDto;
import com.titan.poss.location.dto.constants.LocationTypeEnum;
import com.titan.poss.location.dto.request.LocationPriceGroupDto;
import com.titan.poss.location.dto.request.LocationUpdateDto;
import com.titan.poss.location.service.LocationService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController
@RequestMapping("location/v2/locations")
@Api(tags = { "location-controller" })
@Validated
public class LocationController {

	@Autowired
	private LocationService locationService;

	private static final String LOCATION_VIEW_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.LOCATION_HIERARCHY_LOCATION_VIEW + "' )";

	private static final String LOCATION_ADD_EDIT_PERMISSION = "hasPermission(true,'"
			+ LocationACLConstants.LOCATION_HIERARCHY_LOCATION_ADD_EDIT + "' )";

	/**
	 * This method will return the list of Locations.
	 * 
	 * @param isActive
	 * @return LocationHeaderDto
	 */
	@PreAuthorize(LOCATION_VIEW_PERMISSION)
	@ApiOperation(value = "API to get the list of Locations ", notes = "This API will get the list of Locations")
	@GetMapping(value = "")
	@ApiPageable
	public PagedRestResponse<List<LocationHeaderDto>> listLocations(@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) @ApiParam(required = false, value = "Location Type", allowableValues = "CFA,BTQ,FAC") @ValueOfEnum(enumClass = LocationTypeEnum.class) String locationType,
			@ApiIgnore Pageable pageable) {
		return locationService.listLocations(isActive, locationType, pageable);
	}

	/**
	 * This method will return the Location details based on the locationCode.
	 * 
	 * @param locationCode
	 * @return LocationDto
	 */
	@PreAuthorize(LOCATION_VIEW_PERMISSION)
	@ApiOperation(value = "API to get the Location details based on the locationCode", notes = "This API will get the Location details based on the **locationCode**")
	@GetMapping(value = "/{locationCode}")
	public LocationDto getLocation(
			@PathVariable("locationCode") @PatternCheck(regexp = LOCATION_CODE_REGEX) String locationCode) {
		return locationService.getLocation(locationCode);
	}

	/**
	 * This method will update the Location details.
	 * 
	 * @param locationCode
	 * @param locationDto
	 * @param bindingResult
	 * @return LocationDto
	 */
	@ApiOperation(value = "API to update the Location details", notes = "This API will update the Location details</br>"
			+ "<b>To activate Location, All mandatory columns to be entered.</b>")
	@PatchMapping(value = "/{locationCode}")
	@PreAuthorize(LOCATION_ADD_EDIT_PERMISSION)
	public LocationDto updateLocation(
			@PathVariable("locationCode") @PatternCheck(regexp = LOCATION_CODE_REGEX) String locationCode,
			@RequestBody @Valid LocationUpdateDto locationUpdateDto) {

		return locationService.updateLocation(locationCode, locationUpdateDto);
	}

	/**
	 * This method will save the Location details.
	 * 
	 * @param locationDto
	 * @param bindingResult
	 * @return LocationDto
	 */
	@PreAuthorize(LOCATION_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to copy the Location details", notes = "This API will copy the Location details")
	@PostMapping("/{srcLocationCode}/clone")
	public LocationDto copyLocation(
			@PathVariable(required = true) @PatternCheck(regexp = LOCATION_CODE_REGEX) String srcLocationCode,
			@RequestParam(required = true) @PatternCheck(regexp = LOCATION_CODE_REGEX) String dstLocationCode) {
		return locationService.copyLocation(srcLocationCode, dstLocationCode);
	}

	/**
	 * This method will activate the Location by performing all the validations.
	 * 
	 * @param locationDto
	 * @param bindingResult
	 * @return LocationDto
	 */
	@Deprecated
	@PreAuthorize(LOCATION_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to activate the Location by performing all the validations", notes = "This API will activate the Location by performing all the validations")
	@PatchMapping("/{locationCode}/activate")
	public LocationDto copyLocation(
			@PathVariable(value = "locationCode", required = true) @PatternCheck(regexp = LOCATION_CODE_REGEX) String locationCode) {
		return locationService.activateLocation(locationCode);
	}

	/**
	 * This method will return the list of location price group mapping details
	 * based on isActive.
	 * 
	 * @param locationCode
	 * @param isActive
	 * @return List<PriceGroupMappingDTO>
	 */
	@ApiOperation(value = "View the list of location price group mapping details", notes = "This API returns the list of location price group mapping details based on **isActive**")
	@GetMapping("/{locationCode}/price-groups")
	public ListResponse<PriceGroupMapDto> listLocationPriceGroupMapping(
			@PathVariable("locationCode") @PatternCheck(regexp = LOCATION_CODE_REGEX) String locationCode) {
		return locationService.listLocationPriceGroupMapping(locationCode);
	}

	@PatchMapping(value = "/{locationCode}/price-groups")
	@ApiOperation(value = "Create/Remove Mapping between location and price group", notes = "This API creates/removes Mapping between location and price-group")
	public LocationPriceGroupDto locationPriceGroupMapping(
			@PathVariable("locationCode") @PatternCheck(regexp = LOCATION_CODE_REGEX) String locationCode,
			@RequestBody @Valid LocationPriceGroupDto locationPriceGroupDto) {

		return locationService.locationPriceGroupMapping(locationCode, locationPriceGroupDto);

	}

	/**
	 * This method will save the Location details.
	 * 
	 * @param locationDto
	 * @param bindingResult
	 * @return LocationDto
	 */
	// @formatter:off
	@ApiOperation(value = "API to Save the Location details", notes = "This API will save the Location details<br><br>"
			+ "Note: 1.Default value for all Currencies is INR for a new Location.It can be updated as per the Country</br>"
			+ "    2. When isActive is true while creating new location, all Mandatory fields to be entered.</br>"
			+ " 3.When ownerType is L3, cfaCode value is mandatory and if ownerType is L1/L2 , factoryCode is mandatory</br>"
			+ "<b><span style=\"font-size:14px;\">Find Below the HyperLinks for Details Json Format:</span></b>\r\n"
			+ "<ul>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/AdvanceBookingDetails.json/\">"
			+ " ADVANCE_BOOKING_DETAILS </a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/BankingDetails.json/\">"
			+ " BANKING_DETAILS </a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/CashMemoDetails.json/\">"
			+ " CASHMEMO_DETAILS </a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/CreditNoteDetails.json/\">"
			+ " CREDIT_NOTE_DETAILS </a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/CustomerDetails.json/\">"
			+ " CUSTOMER_DETAILS </a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/CustomerOrderDetails.json/\">"
			+ " CUSTOMER_ORDER_DETAILS </a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/GepDetails.json/\">"
			+ " GEP_DETAILS </a>" + "</br></br>" + "  </li>" + "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/GhsDetails.json/\">"
			+ " GHS_DETAILS </a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/GiftCardDetails.json/\">"
			+ " GIFT_CARD_DETAILS </a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/GrfDetails.json/\">"
			+ " GRF_DETAILS </a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/GrnDetails.json/\">"
			+ " GRN_DETAILS </a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/InventoryDetails.json/\">"
			+ " INVENTORY_DETAILS </a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/OfferDetails.json/\">"
			+ " OFFER_DETAILS </a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/OtpDetails.json/\">"
			+ "OTP_DETAILS </a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/PaymentDetails.json/\">"
			+ "PAYMENT_DETAILS </a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/PrintDetails.json/\">"
			+ " PRINT_DETAILS </a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/StoreDetails.json/\">"
			+ " STORE_DETAILS </a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/location-service/src/main/resources/com/titan/poss/location/json/TaxDetails.json/\">"
			+ " TAX_DETAILS </a>" + "</br></br>" + "  </li>"
	
            + "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/936b8c328742d2462a4f01cf20ee494eeb92a748/location-service/src/main/resources/com/titan/poss/location/json/TepDetails.json?at=Release-COM-CR-0.0.23-0.0.0-Branch/\">"
            + " TEP_DETAILS </a>" + "</br></br>" + "  </li>")
	
	

	@PostMapping()
	@PreAuthorize(LOCATION_ADD_EDIT_PERMISSION)
	public LocationDto addLocation(@RequestBody @Valid LocationDto locationDto) {

		return locationService.addLocation(locationDto);
	}
}
