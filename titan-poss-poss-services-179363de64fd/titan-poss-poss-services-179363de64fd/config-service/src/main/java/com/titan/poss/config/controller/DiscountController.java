/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.controller;

import static com.titan.poss.core.utils.PreAuthorizeDetails.IS_STORE_USER;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
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

import com.titan.poss.config.dto.ClubDiscountResponseDto;
import com.titan.poss.config.dto.DiscountCouponUpdateResponseDto;
import com.titan.poss.config.dto.LinkDiscountResponseDto;
import com.titan.poss.config.dto.constants.ClubbingDiscountType;
import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.constants.DiscountRequestType;
import com.titan.poss.config.dto.constants.DiscountStatus;
import com.titan.poss.config.dto.constants.ExcludeTypeEnum;
import com.titan.poss.config.dto.request.DiscountCouponRequestDto;
import com.titan.poss.config.dto.request.DiscountDetailsDto;
import com.titan.poss.config.dto.request.DiscountProductGroupDto;
import com.titan.poss.config.dto.request.DiscountRaiseRequestDto;
import com.titan.poss.config.dto.request.DiscountSchemeRequestDto;
import com.titan.poss.config.dto.request.DiscountSlabDetailsDto;
import com.titan.poss.config.dto.request.DiscountThemeRequestDto;
import com.titan.poss.config.dto.request.DiscountUpdateDto;
import com.titan.poss.config.dto.request.ItemThemeUpdateDto;
import com.titan.poss.config.dto.request.LinkDiscountRequestDto;
import com.titan.poss.config.dto.request.ProductCategoryUpdateDto;
import com.titan.poss.config.dto.request.UpdateClubDiscountRequestDto;
import com.titan.poss.config.dto.request.UpdateRangeDto;
import com.titan.poss.config.dto.request.json.DiscountCategoryEnum;
import com.titan.poss.config.dto.response.DiscountCouponResponseDto;
import com.titan.poss.config.dto.response.DiscountDetailsResponseDto;
import com.titan.poss.config.dto.response.DiscountDetailsUpdateResponseDto;
import com.titan.poss.config.dto.response.DiscountExcludeMappingRangeDto;
import com.titan.poss.config.dto.response.DiscountListResponseDto;
import com.titan.poss.config.dto.response.DiscountLocationDto;
import com.titan.poss.config.dto.response.DiscountLocationResponseDto;
import com.titan.poss.config.dto.response.DiscountProductDto;
import com.titan.poss.config.dto.response.DiscountRaiseResponseDto;
import com.titan.poss.config.dto.response.DiscountResponseDto;
import com.titan.poss.config.dto.response.DiscountSchemeUpdateResponseDto;
import com.titan.poss.config.dto.response.DiscountThemeUpdateResponseDto;
import com.titan.poss.config.dto.response.ItemThemeMappingDto;
import com.titan.poss.config.dto.response.ItemThemeUpdateResponseDto;
import com.titan.poss.config.dto.response.ProductCategoryResponseDto;
import com.titan.poss.config.dto.response.ProductCategoryUpdateResponseDto;
import com.titan.poss.config.service.DiscountService;
import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.discount.dto.CouponDto;
import com.titan.poss.core.discount.dto.DiscountDto;
import com.titan.poss.core.domain.acl.ConfigAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.enums.WorkflowProcessStatusEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.DiscountApproveRequestDto;
import com.titan.poss.core.dto.DiscountApproveResponseDto;
import com.titan.poss.core.dto.DiscountCouponDto;
import com.titan.poss.core.dto.ItemGroupMappingDto;
import com.titan.poss.core.dto.LocationCodeFilterDto;
import com.titan.poss.core.dto.TSSSCouponRedeemDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

@Validated
@RestController
@RequestMapping("config/v2/discounts")
public class DiscountController {

	@Autowired
	private DiscountService discountService;

	private static final String DISCOUNT_VIEW_PERMISSION = PreAuthorizeDetails.START
			+ ConfigAccessControls.DISCOUNT_VIEW + PreAuthorizeDetails.END;

	private static final String DISCOUNT_ADD_EDIT_PERMISSION = PreAuthorizeDetails.START
			+ ConfigAccessControls.DISCOUNT_ADD_EDIT + PreAuthorizeDetails.END;

	private static final String DISCOUNT_RAISE_REQUEST = PreAuthorizeDetails.START
			+ ConfigAccessControls.DISCOUNT_RAISE_REQUEST + PreAuthorizeDetails.END;

	private static final String DISCOUNT_UPDATE_REQUEST = PreAuthorizeDetails.START
			+ ConfigAccessControls.DISCOUNT_UPDATE_REQUEST + PreAuthorizeDetails.END + PreAuthorizeDetails.OR
			+ PreAuthorizeDetails.START
			+ ConfigAccessControls.DISCOUNT_APPROVE_REQUEST + PreAuthorizeDetails.END;

	/**
	 * This method will return the list of discounts based on the isActive.
	 * 
	 * @param isActive
	 * @param discountCode
	 * @param discountType
	 * @param pageable
	 * @return PagedRestResponse<List<DiscountListResponseDto>>
	 */
	@ApiOperation(value = "View the list of discounts", notes = "This API returns the list of discounts")
	@GetMapping
	@ApiPageable
	@PreAuthorize(DISCOUNT_VIEW_PERMISSION)
	public PagedRestResponse<List<DiscountListResponseDto>> listDiscount(
			@ApiParam(value = "select status", allowableValues = "RUNNING, ACTIVE_AND_NOT_RUNNING, INACTIVE") @RequestParam(required = false) String status,
			@RequestParam(required = false) String discountCode, @RequestParam(required = false) String occasion,
			@ApiParam(value = "select discount type", allowableValues = "CATEGORY_DISCOUNT, SLAB_BASED_DISCOUNT, ULP_DISCOUNT_BIRTHDAY, ULP_DISCOUNT_SPOUSE_BIRTHDAY, BILL_LEVEL_DISCOUNT, SYSTEM_DISCOUNT_DV,\r\n"
					+ "	SYSTEM_DISCOUNT_GHS_BONUS,COIN_OFFER_DISCOUNT, EMPLOYEE_DISCOUNT, TATA_EMPLOYEE_DISCOUNT, TSSS_DISCOUNT, ITEM_GROUP_LEVEL_DISCOUNT,\r\n"
					+ "	BEST_DEAL_DISCOUNT, HIGH_VALUE_DISCOUNT, KARAT_EXCHANGE_OFFER_DISCOUNT, EMPOWERMENT_DISCOUNT, ULP_DISCOUNT_ANNIVERSARY, RIVAAH_ASHIRWAAD_DISCOUNT") @RequestParam(required = false) String discountType,
			@ApiParam(value = "select clubbing discount type", allowableValues = "TYPE1, TYPE2, TYPE3") @RequestParam(required = false) @ValueOfEnum(message = ConfigConstants.INVALID_CLUBBING_DISCOUNT_TYPE, enumClass = ClubbingDiscountType.class) String clubbingDiscountType,
			@RequestParam(value = "isActive", required = false, defaultValue = "true") Boolean isActive,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiParam(value = "select publish status", allowableValues = "PUBLISHED, NOT_PUBLISHED") @RequestParam(required = false) String publishStatus,
			@ApiIgnore Pageable pageable) {
		return discountService.listDiscount(status, discountCode, occasion, discountType, clubbingDiscountType,
				isActive, isPageable, publishStatus, pageable);

	}

	/**
	 * This method will return the Discount details based on the discountId.
	 * 
	 * @param discountId
	 * @return DiscountResponseDto
	 */
	@ApiOperation(value = "View the Discount details based on the discountId", notes = "This API returns the Discount details based on the **discountId**")
	@GetMapping(value = "/{discountId}")
	@PreAuthorize(DISCOUNT_VIEW_PERMISSION)
	public DiscountResponseDto getDiscount(
			@PathVariable("discountId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String discountId,
			@RequestParam(required = false) String processId) {
		return discountService.getDiscount(discountId, processId);

	}

	/**
	 * This method will save the Discount details.
	 * 
	 * @param discountDto
	 * @param bindingResult
	 * @return DiscountResponseDto
	 */
	@ApiOperation(value = "Save the Discount details", notes = "This API saves the Discount details<br>"

			+ "<b><span style=\"font-size:14px;\">Find Below the HyperLinks of Json Format for the details:</span></b>\r\n"
			+ "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/CumulativeDetails.json/\">"
			+ "CUMULATIVE_DETAILS" + "</a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/DiscountGrnConfig.json/\">"
			+ "GRN_DETAILS" + "</a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/TepConfig.json/\">"
			+ "TEP_DETAILS" + "</a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/DiscountOrderConfig.json/\">"
			+ "ORDER_DETAILS" + "</a>" + "</br></br>" + "  </li>"
			+ "<b><span style=\"font-size:12px;\">Find Below the HyperLink for basicCriteria of COIN OFFER DISCOUNT:</span></b>\r\n"
			+ "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/BasicCriteriaCoinOffer.json/\">"
			+ "BASIC_CRITERIA_COIN_OFFER_DISCOUNT" + "</a>" + "</br></br>" + "  </li>"
			+ "<b><span style=\"font-size:12px;\">Find Below the HyperLink for basicCriteria of BILL LEVEL DISCOUNT:</span></b>\r\n"
			+ "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/BasicCriteriaBillLevel.json/\">"
			+ "BASIC_CRITERIA_BILL_LEVEL_DISCOUNT" + "</a>" + "</br></br>" + "  </li>"
			+ "<b><span style=\"font-size:12px;\">Find Below the HyperLink for basicCriteria of EMPLOYEE DISCOUNT:</span></b>\r\n"
			+ "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/BasicCriteriaEmployeeDiscount.json/\">"
			+ "BASIC_CRITERIA_EMPLOYEE_DISCOUNT" + "</a>" + "</br></br>" + "  </li>"
			+ "<b><span style=\"font-size:12px;\">Find Below the HyperLink for basicCriteria of TATA EMPLOYEE DISCOUNT:</span></b>\r\n"
			+ "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/BasicCriteriaTataEmployee.json/\">"
			+ "BASIC_CRITERIA_TATA_EMPLOYEE_DISCOUNT" + "</a>" + "</br></br>" + "  </li>"
			+ "<b><span style=\"font-size:12px;\">Find Below the HyperLink for basicCriteria of all other discount types:</span></b>\r\n"
			+ "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/BasicCriteria.json/\">"
			+ "BASIC_CRITERIA" + "</a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/ClubOtherOffersConfig.json/\">"
			+ "CLUB_OTHER_OFFERS_CONFIG" + "</a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/AbCoData.json/\">"
			+ "AB_CO_DATA" + "</a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/ClubDiscountType.json/\">"
			+ "CLUB_DISCOUNT_TYPE" + "</a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/ItemGroupDetails.json/\">"
			+ "ITEM_GROUP_CONFIG" + "</a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/ApplicableThemes.json/\">"
			+ "APPLICABLE_THEMES" + "</a>" + "</br></br>" + "  </li>"
			+ "<b><span style=\"font-size:12px;\">Find Below the HyperLink for configDteails of TSSS DISCOUNT TYPE:</span></b>\r\n"
			+ "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/ConfigDetailsTsssDiscount.json/\">"
			+ "CONFIG_DETAILS_TSSS_DISCOUNT_TYPE" + "</a>" + "</br></br>" + "  </li>"
			+ "<b><span style=\"font-size:12px;\">Find Below the HyperLink for configDetails of ITEM GROUP LEVEL:</span></b>\r\n"
			+ "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/ConfigDetailsItemGroupLevel.json/\">"
			+ "CONFIG_DETAILS_ITEM_GROUP_LEVEL" + "</a>" + "</br></br>" + "  </li>")
	@PostMapping
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	public DiscountResponseDto createDiscount(@RequestBody @Valid DiscountDto discountDto) {
		return discountService.createDiscount(discountDto);

	}

	/**
	 * This method will update the Discount details.
	 * 
	 * @param discountId
	 * @param discountUpdateDto
	 * @param bindingResult
	 * @return DiscountResponseDto
	 */
	@ApiOperation(value = "Update the Discount details", notes = "This API updates the Discount details<br>"
			+ "<b><span style=\"font-size:14px;\">Find Below the HyperLinks of Json Format for the details:</span></b>\r\n"
			+ "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/CumulativeDetails.json/\">"
			+ "CUMULATIVE_DETAILS" + "</a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/GrnConfig.json/\">"
			+ "GRN_DETAILS" + "</a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/TepConfig.json/\">"
			+ "TEP_DETAILS" + "</a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/OrderConfig.json/\">"
			+ "ORDER_DETAILS" + "</a>" + "</br></br>" + "  </li>"
			+ "<b><span style=\"font-size:12px;\">Find Below the HyperLink for basicCriteria of COIN OFFER DISCOUNT:</span></b>\r\n"
			+ "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/BasicCriteriaCoinOffer.json/\">"
			+ "BASIC_CRITERIA_COIN_OFFER_DISCOUNT" + "</a>" + "</br></br>" + "  </li>"
			+ "<b><span style=\"font-size:12px;\">Find Below the HyperLink for basicCriteria of BILL LEVEL DISCOUNT:</span></b>\r\n"
			+ "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/BasicCriteriaBillLevel.json/\">"
			+ "BASIC_CRITERIA_BILL_LEVEL_DISCOUNT" + "</a>" + "</br></br>" + "  </li>"
			+ "<b><span style=\"font-size:12px;\">Find Below the HyperLink for basicCriteria of EMPLOYEE DISCOUNT:</span></b>\r\n"
			+ "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/BasicCriteriaEmployeeDiscount.json/\">"
			+ "BASIC_CRITERIA_EMPLOYEE_DISCOUNT" + "</a>" + "</br></br>" + "  </li>"
			+ "<b><span style=\"font-size:12px;\">Find Below the HyperLink for basicCriteria of TATA EMPLOYEE DISCOUNT:</span></b>\r\n"
			+ "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/BasicCriteriaTataEmployee.json/\">"
			+ "BASIC_CRITERIA_TATA_EMPLOYEE_DISCOUNT" + "</a>" + "</br></br>" + "  </li>"
			+ "<b><span style=\"font-size:12px;\">Find Below the HyperLink for basicCriteria of all other discount types:</span></b>\r\n"
			+ "<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/BasicCriteria.json/\">"
			+ "BASIC_CRITERIA" + "</a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/ClubOtherOffersConfig.json/\">"
			+ "CLUB_OTHER_OFFERS_CONFIG" + "</a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/AbCoData.json/\">"
			+ "AB_CO_DATA" + "</a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/ClubDiscountType.json/\">"
			+ "CLUB_DISCOUNT_TYPE" + "</a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/ItemGroupDetails.json/\">"
			+ "ITEM_GROUP_CONFIG" + "</a>" + "</br></br>" + "  </li>" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/ApplicableThemes.json/\">"
			+ "APPLICABLE_THEMES" + "</a>" + "</br></br>" + "  </li>"
			+ "<b><span style=\"font-size:12px;\">Find Below the HyperLink for configDteails of TSSS DISCOUNT TYPE:</span></b>\r\n"
			+ "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/ConfigDetailsTsssDiscount.json/\">"
			+ "CONFIG_DETAILS_TSSS_DISCOUNT_TYPE" + "</a>" + "</br></br>" + "  </li>"
			+ "<b><span style=\"font-size:12px;\">Find Below the HyperLink for configDetails of ITEM GROUP LEVEL:</span></b>\r\n"
			+ "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/ConfigDetailsItemGroupLevel.json/\">"
			+ "CONFIG_DETAILS_ITEM_GROUP_LEVEL" + "</a>" + "</br></br>" + "  </li>")
	@PatchMapping(value = "/{discountId}")
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	public DiscountResponseDto updateDiscount(
			@PathVariable("discountId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String discountId,
			@RequestParam(required = false) @ApiParam(value = "Type Of Request", allowableValues = "NEW, AMMENDMENT", required = false) @ValueOfEnum(enumClass = DiscountRequestType.class) String typeOfRequest,
			@RequestParam(required = false) @ApiParam(value = "Request Status", allowableValues = "REQUEST_PENDING, APVL_PENDING, APPROVED, APVL_REJECTED", required = false) @ValueOfEnum(enumClass = DiscountStatus.class) String requestStatus,
			@RequestBody @Valid DiscountUpdateDto discountUpdateDto) {
		return discountService.updateDiscount(discountId, requestStatus, typeOfRequest, discountUpdateDto);
	}

	/**
	 * This method will return the list of Discount Location mapping details based
	 * on isActive.
	 * 
	 * @param discountCode
	 * @param isActive
	 * @return List<DiscountLocationCodeDto>
	 */
	@ApiOperation(value = "View the list of Discount Location mapping details", notes = "This API returns the list of Discount location mapping details")
	@PostMapping("/{discountId}/locations")
	@PreAuthorize(DISCOUNT_VIEW_PERMISSION)
	public PagedRestResponse<List<DiscountLocationResponseDto>> listDiscountLocationMapping(
			@PathVariable("discountId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String discountId,
			@RequestParam(required = false) Boolean status,
			@RequestBody @Valid @ApiParam(name = "body", value = "location filter", required = false) LocationCodeFilterDto locationCodeFilter,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return discountService.listDiscountLocationMapping(discountId, locationCodeFilter, status, isPageable,
				pageable);

	}

	/**
	 * This method will create/remove mapping between discount and location.
	 * 
	 * @param discountId
	 * @param discountLocationDto
	 * @param bindingResult
	 * @return DiscountLocationDto
	 */
	// @formatter:off
	@PatchMapping(value = "/{discountId}/locations")
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Create/Remove Mapping between discounts and locations", notes = "This API creates/removes Mapping between discounts and locations<br>"
			+ "<b><span style=\"font-size:14px;\">Find Below the HyperLinks of Json Format for the details:</span></b>\r\n"
			+ "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/LocationConfigDetails.json/\">"
			+ "CONFIG_DETAILS" + "</a>" + "</br></br>" + "  </li>")
	public ListResponse<DiscountLocationResponseDto> discountLocationMapping(
			@PathVariable("discountId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String discountId,
			@RequestBody @Valid DiscountLocationDto discountLocationDto) {
		return discountService.discountLocationMapping(discountId, discountLocationDto);

	}

	/**
	 * This method will return the list of Discount ProductGroup mapping details
	 * based on isActive.
	 * 
	 * @param discountCode
	 * @param isActive
	 * @return List<DiscountProductGroupDto>
	 */
	@ApiPageable
	@ApiOperation(value = "View the list of Discount ProductGroup mapping details", notes = "This API returns the list of Discount ProductGroup mapping details")
	@GetMapping("/{discountId}/product-groups")
	@PreAuthorize(DISCOUNT_VIEW_PERMISSION)
	public PagedRestResponse<List<DiscountProductDto>> listdiscountProductMapping(
			@PathVariable("discountId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String discountId,
			@RequestParam(required = false) List<String> productGroupCodeList,
			@RequestParam(required = false) String karatType, @RequestParam(required = false) String productType,
			@RequestParam(required = false) String discountDetailsId,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return discountService.listDiscountProductGroupMapping(discountId, productGroupCodeList, karatType, productType,
				discountDetailsId, isPageable, pageable);
	}

	/**
	 * This method will create/remove mapping between discount and location.
	 * 
	 * @param discountId
	 * @param discountProductGroupDto
	 * @param bindingResult
	 * @return DiscountProductGroupDto
	 */
	@PatchMapping(value = "/{discountId}/product-groups")
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Create/Remove Mapping between discounts and productgroups", notes = "This API creates/removes Mapping between discounts and productgroups")
	public ListResponse<DiscountProductDto> discountProductGroupMapping(
			@PathVariable("discountId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String discountId,
			@RequestBody @Valid DiscountProductGroupDto discountProductGroupDto,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String discountDetailsId,
			@RequestParam(required = false) String karatType, @RequestParam(required = false) String productType) {
		return discountService.discountProductGroupMapping(discountId, discountProductGroupDto, discountDetailsId,
				karatType, productType);
	}

	/**
	 * This method will add/remove themes.
	 * 
	 * @param discountId
	 * @param discountThemeRequestDto
	 * @return List<DiscountThemeUpdateResponseDto>
	 */
	@PatchMapping("/{discountId}/theme-mapping")
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Api to add/remove themes and map it to given discountId", notes = "This api will add/remove themes and map it to given discountId. ExcludeType - THEME_CODE")
	public ListResponse<DiscountThemeUpdateResponseDto> updateTheme(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String discountId,
			@RequestParam @ValueOfEnum(enumClass = ExcludeTypeEnum.class) String excludeType,
			@RequestBody @Valid DiscountThemeRequestDto discountThemeRequestDto) {
		return discountService.updateTheme(discountId, excludeType, discountThemeRequestDto);

	}

	/**
	 * This method will add/remove schemes.
	 * 
	 * @param discountId
	 * @param DiscountSchemeRequestDto
	 * @return List<DiscountSchemeUpdateResponseDto>
	 */
	@PatchMapping("/{discountId}/scheme-mapping")
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Api to add/remove schemes and map it to given discountId", notes = "This api will add/remove schemes and map it to given discountId. ExcludeType - SCHEME_CODE")
	public ListResponse<DiscountSchemeUpdateResponseDto> updateScheme(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String discountId,
			@RequestParam @ValueOfEnum(enumClass = ExcludeTypeEnum.class) String excludeType,
			@RequestBody @Valid DiscountSchemeRequestDto discountSchemeRequestDto) {
		return discountService.updateScheme(discountId, excludeType, discountSchemeRequestDto);

	}

	@PatchMapping("/{discountId}/item-mapping")
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Api to update item mapping for the given discountId", notes = "Api will update item mapping")
	public ListResponse<ItemThemeUpdateResponseDto> updateItemThemeMapping(@PathVariable String discountId,
			@RequestBody @Valid ItemThemeUpdateDto itemThemeUpdateDto) {
		return discountService.updateItemThemeMapping(discountId, itemThemeUpdateDto);

	}

	@PatchMapping("/{discountId}/exclude-mapping")
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "Api to add ,update or remove exclude mapping for a discountId", notes = "Api will add update or remove exclude mapping")
	public ListResponse<DiscountExcludeMappingRangeDto> updateMakingChargeOrComplexityPercent(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String discountId,
			@RequestParam @ValueOfEnum(enumClass = ExcludeTypeEnum.class) String excludeType,
			@RequestBody @Valid UpdateRangeDto updateRangeDto) {
		return discountService.updateMakingChargeOrComplexityPercent(discountId, excludeType, updateRangeDto);

	}

	@GetMapping("/{discountId}/item-theme-mapping")
	@PreAuthorize(DISCOUNT_VIEW_PERMISSION)
	@ApiOperation(value = "API to list item theme mapping for a discountId", notes = "Api will list  item theme mapping for a discountId")
	@ApiPageable
	public PagedRestResponse<List<ItemThemeMappingDto>> listItemThemeMapping(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String discountId,
			@RequestParam @ValueOfEnum(enumClass = ExcludeTypeEnum.class) String excludeType,
			@RequestParam(required = false) Boolean isExcluded,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@ApiIgnore Pageable pageable,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable) {

		return discountService.listItemThemeMapping(discountId, excludeType, isExcluded, itemCode, pageable,
				isPageable);
	}

	@PatchMapping("/{discountId}/product-categories")
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "API to add update or remove product category for a discountId", notes = "Api will add update or remove product category for a discountId")
	public ListResponse<ProductCategoryUpdateResponseDto> updateProductCategory(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String discountId,
			@RequestBody @Valid ProductCategoryUpdateDto productCategoryUpdateDto) {
		return discountService.updateProductCategory(discountId, productCategoryUpdateDto);

	}

	@GetMapping("/{discountId}/product-categories")
	@PreAuthorize(DISCOUNT_VIEW_PERMISSION)
	@ApiOperation(value = "API to list product category for a discountId", notes = "Api will list product category for a discountId")
	@ApiPageable
	public PagedRestResponse<List<ProductCategoryResponseDto>> listProductCategory(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String discountId,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String productCategoryCode,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {
		return discountService.listProductCategory(discountId, productCategoryCode, isPageable, pageable);

	}

	/**
	 * This method will save the Discount details.
	 * 
	 * @param discountDetailsDto
	 * @param discountId
	 * @return List<DiscountDetailsUpdateResponseDto>
	 */
	@ApiOperation(value = "This Api will Save the Discount details", notes = "This API will saves the discount details<br>"
			+ "Find Below the HyperLinks of Json Format for the DiscountComponent(JsonObject will be similar for all categories except the type fied in jsonData)\r\n"
			+ "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/DiscountComponentDetails.json/\">"
			+ "DISCOUNT_COMPONENT" + "</a>" + "</br></br>" + "  </li>"
			+ "Find the below JSON of ConfigDetails for <b>Empowerment Discount</b> Type\r\n" + "	<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/EmpowermentDiscount.json/\">"
			+ "CONFIG_DETAILS" + "</a>" + "</br></br>" + "  </li>")
	@PatchMapping("/{discountId}/details")
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	public ListResponse<DiscountDetailsUpdateResponseDto> updateDiscountDetails(
			@RequestBody @Valid DiscountDetailsDto discountDetailsDto,
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String discountId) {

		return discountService.updateDiscountDetails(discountDetailsDto, discountId);
	}

	/**
	 * This method will save the Discount details.
	 * 
	 * @param discountSlabDetailsDto
	 * @param discountId
	 * @return List<DiscountDetailsUpdateResponseDto>
	 */
	@ApiOperation(value = "This Api will Save the Discount Slab details for a discountId", notes = "This API will saves the Discount Slab Details<br>")
	@PatchMapping("/{discountId}/slabs")
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	public ListResponse<DiscountDetailsUpdateResponseDto> updateSlabDetails(
			@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String discountId,
			@RequestBody @Valid DiscountSlabDetailsDto discountSlabDetailsDto) {

		return discountService.updateSlabDetails(discountId, discountSlabDetailsDto);
	}

	/**
	 * This method will list the Discount details.
	 * 
	 * @param discountId
	 * @param discountCategory
	 * @return List<DiscountDetailsResponseDto>
	 */
	@ApiOperation(value = "Api to list Discount details", notes = "This API will return discount details")
	@GetMapping("/{discountId}/details")
	@PreAuthorize(DISCOUNT_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<DiscountDetailsResponseDto>> listDiscountDetails(@PathVariable String discountId,
			@RequestParam(required = false) @ValueOfEnum(message = ConfigConstants.INVALID_CATEGORY, enumClass = DiscountCategoryEnum.class) String discountCategory,
			@RequestParam(required = false) List<String> productGroupCodes, @ApiIgnore Pageable pageable) {
		return discountService.listDiscountDetails(discountId, discountCategory, productGroupCodes, pageable);
	}

	@ApiOperation(value = "Api to add or remove clubbed discount", notes = "Api will add or remove clubbed discount")
	@PatchMapping("/club-discounts")
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	public ListResponse<ClubDiscountResponseDto> updateClubDiscount(
			@RequestBody @Valid UpdateClubDiscountRequestDto updateClubDiscountRequestDto) {
		return discountService.updateClubDiscount(updateClubDiscountRequestDto);

	}

	@ApiOperation(value = "Api will list clubbed discount", notes = "Api will list clubbed discount")
	@GetMapping("/club-discounts")
	@PreAuthorize(DISCOUNT_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<ClubDiscountResponseDto>> listClubbedDiscount(
			@RequestParam(required = false) String discountCode, @ApiIgnore Pageable pageable,
			@RequestParam(value = "isPageable", required = false, defaultValue = "true") Boolean isPageable) {
		return discountService.listClubbedDiscount(discountCode, pageable, isPageable);

	}

	@ApiOperation(value = "Api to add or remove the linking between discounts", notes = "Api to add or remove the link between discount"
			+ "like Slab Based Discounts can be linked with BestDealDiscounts")
	@PatchMapping("/{discountId}/link-discounts")
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	public ListResponse<LinkDiscountResponseDto> linkDiscounts(@PathVariable String discountId,
			@RequestBody @Valid LinkDiscountRequestDto linkDiscountRequestDto) {
		return discountService.linkDiscounts(discountId, linkDiscountRequestDto);

	}

	@ApiOperation(value = "Api will list discounts Linked to a discountId", notes = "Api will list discounts linked to a discountId")
	@GetMapping("/{discountId}/link-discounts")
	@PreAuthorize(DISCOUNT_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<LinkDiscountResponseDto>> listLinkedDiscounts(@PathVariable String discountId,
			@ApiIgnore Pageable pageable) {
		return discountService.listLinkedDiscounts(discountId, pageable);

	}

	@ApiOperation(value = "Api will list the items mapped to discountId", notes = "Api will list the items mapped to discountId")
	@GetMapping("/{discount-id}/item-groups")
	@PreAuthorize(DISCOUNT_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<ItemGroupMappingDto>> listItemGroupMapping(@PathVariable String discountId,
			@ApiIgnore Pageable pageable) {
		return discountService.listItemGroupMapping(discountId, pageable);

	}

	/**
	 * This method will publish the Discount tables.
	 * 
	 * @param discountId
	 */
	@ApiOperation(value = "This Api will publish the Discount tables", notes = "This API will publish the Discount tables")
	@PostMapping("/publish/{discountId}")
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	public void publishDiscount(@PathVariable @PatternCheck(regexp = RegExConstants.UUID_REGEX) String discountId) {

		discountService.publishDiscount(discountId, true);
	}

	/**
	 * This method will generate coupons for given discount.
	 * 
	 * @param discountId
	 * @param discountLocationDto
	 * @param bindingResult
	 * @return DiscountLocationDto
	 */
	// @formatter:off
	@PostMapping(value = "/{discountId}/coupons")
	@PreAuthorize(DISCOUNT_ADD_EDIT_PERMISSION)
	@ApiOperation(value = "This Api will Generates coupons for TSSS discount", notes = "This Api will Generates coupons for TSSS discount.")
	public DiscountCouponResponseDto generateDiscountCoupons(
			@PathVariable("discountId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String discountId,
			@RequestBody @Valid DiscountCouponRequestDto discountCouponRequestDto) {
		return discountService.generateDiscountCoupons(discountId, discountCouponRequestDto);

	}

	@ApiOperation(value = "Api will Update the coupon status to REDEEMED/OPEN", notes = "Api will Update the coupon status to REDEEMED/OPEN<br>"
			+ "<ul>" + "Give the Status REDEEMED to Redeem the Coupon" + "</ul>" + "<ul>"
			+ "Give the Status OPEN to Cancel the redemption </ul>")
	@PatchMapping("/coupons")
	@PreAuthorize(IS_STORE_USER)
	public ListResponse<DiscountCouponUpdateResponseDto> updateDiscountCoupons(
			@RequestBody @Valid TSSSCouponRedeemDto discountCouponDto) {
		return discountService.updateDiscountCoupons(discountCouponDto);

	}

	@ApiOperation(value = "Api will give list of valid coupons", notes = "Api will give list of valid coupons")
	@PostMapping("/coupons")
	@PreAuthorize(IS_STORE_USER)
	public ListResponse<DiscountCouponDto> getDiscountCoupons(@RequestBody @Valid CouponDto couponDto) {
		return discountService.getDiscountCoupons(couponDto);

	}

	@ApiOperation(value = "Api will download list of coupons for given discount", notes = "Api will download list of coupons for given discount")
	@GetMapping("/{discountId}/coupons")
	@PreAuthorize(DISCOUNT_VIEW_PERMISSION)
	public ResponseEntity<Resource> downloadDiscountCoupons(
			@PathVariable("discountId") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String discountId) {
		return discountService.downloadDiscountCoupons(discountId);

	}
	
	@ApiOperation(value = "API to raise a request to create Discount", notes = "API to raise a request to create Discount")
	@PatchMapping("/raiseRequest")
	@PreAuthorize(DISCOUNT_RAISE_REQUEST)
	public DiscountRaiseResponseDto raiseDiscountCreationRequest(
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String discountId,
			@RequestParam(required = false) @ApiParam(value = "Type Of Request", allowableValues = "NEW, AMENDMENT", required = false) @ValueOfEnum(enumClass = DiscountRequestType.class) String typeOfRequest,
			@RequestBody @Valid DiscountRaiseRequestDto discountRequestDto) {
		return discountService.raiseDiscountCreationRequest(discountId,typeOfRequest,discountRequestDto);
	}
	
	@ApiOperation(value = "API to update the status of request", notes = "API to update the status of request<br>"
			+ "<ul>" + "CANCEL_BEFORE_REQUEST : If Requestor Cancel before raising a request, it will delete saved data from all tables" + "</ul>"
			+ "<ul>" + "CANCEL_AFTER_REQUEST : If Requestor Cancel after raising a request, it will cancle the request" + "</ul>"
			+ "<ul>" + "Reqestor(Category Team) Can Cancel the request" + "</ul>"
			+ "<ul>" + "Approver(Commercial) Can Approve/Reject the request, in case of APPROVE it will publish" + "</ul>")
	@PatchMapping("/updateRequest")
	@PreAuthorize(DISCOUNT_UPDATE_REQUEST)
	public DiscountApproveResponseDto approveDiscountCreationRequest(
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.UUID_REGEX) String discountId,
			@RequestParam(required = true) @ApiParam(value = "Approval Status", allowableValues = "CANCEL_BEFORE_REQUEST,CANCEL_AFTER_REQUEST, APPROVED, REJECTED,REJECTED_EMAIL", required = false) @ValueOfEnum(enumClass = WorkflowProcessStatusEnum.class) String approvalStatus,
			@RequestBody @Valid DiscountApproveRequestDto discountRequestDto) {
		return discountService.approveDiscountCreationRequest(discountId,approvalStatus,discountRequestDto);
	}
	
}
