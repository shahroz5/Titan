/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.controller;

import java.math.BigDecimal;
import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Positive;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.config.dto.FocSchemeBaseDto;
import com.titan.poss.config.dto.FocSchemeResponseDto;
import com.titan.poss.config.dto.ManualFocSchemeResponseDto;
import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.discount.dto.FocSchemeRequestDto;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.constant.TepTypeEnum;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.FocSchemeIndividualDto;
import com.titan.poss.core.dto.FocSchemeItemResponseDto;
import com.titan.poss.core.dto.GepDiscountConfigurationDetailsDto;
import com.titan.poss.core.dto.LovDto;
import com.titan.poss.core.dto.TepItemResponseDto;
import com.titan.poss.core.dto.TepStoneResponseDto;
import com.titan.poss.core.dto.TepValidationConfigDetails;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.engine.config.dto.request.VerifyManualFOCDto;
import com.titan.poss.engine.dto.request.TepStoneRequestDto;
import com.titan.poss.engine.dto.response.FocSchemeForABResponseDto;
import com.titan.poss.engine.service.ConfigFocService;
import com.titan.poss.engine.service.ConfigService;
import com.titan.poss.sales.dao.SalesTxnDao;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Validated
@RestController("engineConfigController")
@RequestMapping("engine/v2/configs")
public class ConfigController {

	@Autowired
	ConfigService configService;

	@Autowired
	ConfigFocService configFocService;

	// @formatter:off
	@GetMapping(value = "/gep-item")
	@ApiOperation(value = "This API is used to fetch GEP config details data", notes = "This API returns discount configDetails w.r.t mapped locationCode for GEP."
			+ "<br> This API UI wont use."
			+ "For storing configuation(based on purity) to sales service this API will be called.")
	// @formatter:on
	public ListResponse<GepDiscountConfigurationDetailsDto> getGEPDiscountConfigs(
			@RequestParam(required = false, name = "purityList") List<@Positive BigDecimal> purityList) {
		return configService.getGEPDiscountConfigs(purityList);

	}

	/**
	 * This method will return the list of active foc Schemes available at a
	 * location for a current date.
	 * 
	 * @return List<FocSchemeBaseDto>.
	 */
	@ApiOperation(value = "API to get the list of Active FOC Schemes available at a particular Location for a CurrentDate", notes = "This API will get the list of Active FOC Scheme available at a location for current Date.")
	@GetMapping("/foc-schemes/location")
	public ListResponse<FocSchemeBaseDto> checkFocActiveSchemes() {

		return configService.getFocActiveSchemes(CommonUtil.getLocationCode());

	}

	@ApiOperation(value = "API to get the scheme information by scheme ID")
	@GetMapping("/foc-schemes/{focSchemeId}")
	public FocSchemeIndividualDto getFocSchemeConfigById(@PathVariable(name = "focSchemeId") String schemeId) {

		return configFocService.getFocSchemeConfigById(schemeId);

	}
	
	@ApiOperation(value = "API to get the scheme information by scheme ID and Product group")
	@GetMapping("/foc-schemes/details/{focSchemeId}")
	public FocSchemeIndividualDto getFocSchemeDetails(@PathVariable(name = "focSchemeId") String focSchemeId,
			@RequestParam(required = false, value = "productGroup") String productGroup) {

		return configFocService.getFocSchemeDetails(focSchemeId, productGroup);
	}

	/**
	 * This method will return the list of active foc Schemes and Items applicable
	 * for variants added in CM.
	 * 
	 * @return List<FocSchemeBaseDto>.
	 */
	@ApiOperation(value = "API to fetch FOC schemes and FOC items applicable for the variants added in a Cash Memo.", notes = "This API will fetch FOC schemes and FOC items applicable for the variants added in a Cash Memo.")
	@PostMapping("/foc-schemes")
	public ListResponse<FocSchemeResponseDto> getFocSchemesAndItems(
			@RequestBody @Valid FocSchemeRequestDto focSchemeRequestDto,
			@RequestParam(required = false) String cashMemoId,
			@RequestParam(required = false) List<String> abItemIdList) {

		return configService.getFocSchemesAndItems(focSchemeRequestDto, cashMemoId, abItemIdList);

	}

	@ApiOperation(value = "API to fetch FOC schemes and FOC items applicable for the variants added in a Cash Memo.", notes = "This API will fetch FOC schemes and FOC items applicable for the variants added in a Cash Memo.")
	@PostMapping("/foc-schemes/product-group")
	public ListResponse<FocSchemeItemResponseDto> getFocSchemesOnProductGroups(
			@RequestBody @Valid FocSchemeRequestDto focSchemeRequestDto) {

		return configService.getFocSchemesOnProductGroups(focSchemeRequestDto);

	}

	/**
	 * This method will return the details of FOC that can be added manually for a
	 * specific customer or location in CM.
	 * 
	 * @return List<FocSchemeResponseDto>.
	 */
	@ApiOperation(value = "API to fetch FOC Scheme Details that can be added manually for a specific customer or location in CM", notes = "This API will fetch Manual FOC Scheme Details as per specific location or Store details")
	@PostMapping("/foc-schemes/manual-foc")
	public ListResponse<ManualFocSchemeResponseDto> getManualFocSchemeDetails(
			@RequestParam(required = false) String mobileNumber) {
		return configService.getManualFocSchemeDetails(mobileNumber);
	}

	@ApiOperation(value = "API to fetch FOC Scheme Details that can be added manually for a specific customer or location in CM", notes = "This API will fetch Manual FOC Scheme Details as per specific location or Store details")
	@PostMapping("/foc-schemes/validate-cm-manual-foc")
	public SalesTxnDao validateCMManualFoc(@RequestParam(required = false) String approvedBy,
			@RequestParam(required = true) String CMNumber,
			@RequestParam(required = true) String locationCode,	
			@RequestParam(required = true) String fiscalYear,
			@RequestParam(required = true) String mobileNumber) {
		return configService.validateCMManualFocDetails(locationCode, approvedBy, CMNumber, fiscalYear,mobileNumber);
	}

	// @formatter:off
	@ApiOperation(value = "This API is used to fetch TEP config details(Regular,Inter brand,Full value, Cut piece)", notes = "This API returns product group configDetails "
			+ " for Regular TEP , Full Value TEP & Inter brand TEP</b>. For Regular TEP based on mapped location product group config data will come. **UI** need to call "
			+ " this API first and based on **isCMAvailable** response for Regular TEP(POSS) they have to show the pop up. If **isCMAvailable** is "
			+ " **true** then only UI have to show the pop up. Here **itemCode**,**tepType** is mandatory & **customerMobileNo** is optional."
			+ " **tepType** should be **NEW_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP, CUT_PIECE_TEP**.<br>"
			+ " <b>Note : </b> For Inter Brand TEP, in tepGeneralCodeConfig response object we have one flag **isCMMandatory**."
			+ " If the flag value is **true** then CM details pop up should be shown.<br><br>"
			+ " Below tables will be involved for New TEP, Inter Brand TEP & Full Value TEP :-" + " <ul>"
			+ " <li>New TEP(config type - TEP_ITEM) : exchange_config_location_mapping,exchange_config_product_mapping</li>"
			+ " <li>Inter Brand TEP(config type - TEP_GENERAL_CODES) : exchange_config_location_mapping,exchange_config_product_mapping,exchange_config_master</li>"
			+ " <li>Full Value TEP(config type - TEP_ITEM) :  exchange_config_location_mapping,exchange_config_product_mapping</li>"
			+ " <li>Cut Piece TEP(config type - TEP_ITEM) :  exchange_config_location_mapping,exchange_config_product_mapping</li>"
			+ " </ul>"
			+ " Below checks will be happened for New TEP, Inter Brand TEP, Full Value TEP & Cut Piece TEP :-" + " <ul>"
			+ " <li>New TEP : **isTepAllowed** flag should be true</li>"
			+ " <li>Inter Brand TEP : **isInterBrandTepAllowed** flag should be true</li>"
			+ " <li>Full Value TEP :  **isFVTAllowed** flag should be true</li>"
			+ " <li>Cut Piece TEP :  **isCutPieceTepAllowed** flag should be true and if **productCategory** is mapped</li>"
			+ " </ul>")
	// @formatter:on
	@GetMapping("/tep-item")
	public TepItemResponseDto getTepItem(
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) String customerMobileNo,
			@RequestParam(required = true) @ApiParam(value = "Tep Type", required = true, allowableValues = "NEW_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP, CUT_PIECE_TEP,MANUAL_FULL_VALUE_TEP,MANUAL_INTER_BRAND_TEP") @ValueOfEnum(enumClass = TepTypeEnum.class) String tepType,
			@RequestParam(required = false) @ApiParam(required = false)Boolean isDummy) {
		return configService.getTepItem(itemCode, customerMobileNo, tepType, isDummy);
	}

	// @formatter:off
	@ApiOperation(value = "This API is used to fetch TEP stone config details", notes = "This API returns TEP stone config details."
			+ " Here **stoneCode** is mandatory & **customerMobileNo** is optional. In case customer mapped any offer with stone"
			+ " then those data will also be available in this API.")
	// @formatter:on
	@PostMapping("/tep-stone")
	public ListResponse<TepStoneResponseDto> getTepStone(
			@RequestBody @Valid @ApiParam(name = "body", value = "get tepStone object details", required = true) TepStoneRequestDto tepStoneRequestDto) {
		return configService.getTepStone(tepStoneRequestDto);
	}

	// @formatter:off
	@ApiOperation(value = "This API is used to fetch TEP cancel config details", notes = "This API returns TEP cancel config details."
			+ " Here **Tep Type** is mandatory & **Tep Type** will be **CANCEL_TEP**. Here if location mapping is not available"
			+ " then API will throw an exception." + " Below tables will be involved for Cancel TEP :-" + " <ul>"
			+ " <li>Cancel TEP(config type - TEP_VALIDATION) : exchange_config_location_mapping,exchange_config_master</li>"
			+ " </ul>")
	// @formatter:on
	@GetMapping("/tep-cancel")
	public TepValidationConfigDetails getTepCancelDetails(
			@RequestParam(required = true) @ApiParam(value = "Tep Type", required = true, allowableValues = "CANCEL_TEP") @ValueOfEnum(enumClass = TepTypeEnum.class) String tepType) {
		return configService.getTepCancelDetails(tepType);
	}

	// @formatter:off
	@ApiOperation(value = "View Lov details", notes = "This API will give the Lov details based on **lovType**.<br><br>"
			+ "<span style=\"font-weight: bold;font-size:14px;\">Lov types:</span>" + "<ul>"
			+ "		<li>APPROVAL_ROLES</li>" + "</ul>" + "<ul>" + "		<li>DISCOUNT_TYPE</li>" + "</ul>"
			+ "Please note that if lovType is wrong then empty resopne will be returned.")
	// @formatter:on
	@GetMapping(value = "lovs/{lovType}")
	@ApiPageable
	public LovDto getLov(
			@ApiParam(name = "lovType", value = "'lovType' to get details", required = true) @PathVariable("lovType") @NotBlank @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50, nullCheck = true, caseInsensitive = false) String lovType,
			@RequestParam(required = false) Boolean isManualDiscount,
			@RequestParam(value = "isPageable", required = false, defaultValue = "false") Boolean isPageable,
			@ApiIgnore Pageable pageable) {

		return configService.getLov(lovType, isManualDiscount, isPageable, pageable);
	}

	@ApiOperation(value = "API to fetch FOC schemes with eligible weight applicable for the variants added in AB.", notes = "This API will fetch FOC schemes with eligible weight applicable for the variants added in AB.")
	@PostMapping("/foc-schemes/advance-booking")
	public ListResponse<FocSchemeForABResponseDto> getFocSchemesForAB(
			@RequestBody @Valid FocSchemeRequestDto focSchemeRequestDto) {

		return configService.getFocSchemesForAB(focSchemeRequestDto);

	}

	@ApiOperation(value = "API to validate customer for giving manual FOC", notes = "This API is used to validate customer whether manual FOC is previously given or not")
	@PostMapping("/foc-schemes/verify-manual-foc")
	public void verifyCustomerForManualFOC(@RequestBody @Valid VerifyManualFOCDto verifyManualFOCDto) {

		configService.validateManualFocIsAlreadyGiven(verifyManualFOCDto);
	}
	
	@ApiOperation(value = "Api to give config details")
	@GetMapping("/tep-Items")
	public TepItemResponseDto getTepItemts(
			@RequestParam(required = true) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) String customerMobileNo,
			@RequestParam(required = true) @ApiParam(value = "Tep Type", required = true, allowableValues = "NEW_TEP, INTER_BRAND_TEP, FULL_VALUE_TEP, CUT_PIECE_TEP,MANUAL_FULL_VALUE_TEP,MANUAL_INTER_BRAND_TEP") @ValueOfEnum(enumClass = TepTypeEnum.class) String tepType,
			@RequestParam(required = false) @ApiParam(required = false)Boolean isDummy) {
		return configService.getTepItems(itemCode, customerMobileNo, tepType, isDummy);
	}
}
