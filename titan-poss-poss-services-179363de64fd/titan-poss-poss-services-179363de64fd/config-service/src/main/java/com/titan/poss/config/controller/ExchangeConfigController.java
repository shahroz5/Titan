/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.controller;

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

import com.titan.poss.config.dto.constants.ConfigTypeEnum;
import com.titan.poss.config.dto.request.ExchangeConfigDetailsRequestDto;
import com.titan.poss.config.dto.request.ExchangeConfigLocationsMappingRequestDto;
import com.titan.poss.config.dto.request.ExchangeConfigLocationsRequestDto;
import com.titan.poss.config.dto.request.ExchangeConfigProductGroupMappingRequestDto;
import com.titan.poss.config.dto.request.ExchangeConfigStoneRequestDto;
import com.titan.poss.config.dto.request.ExchangeCreateConfigDto;
import com.titan.poss.config.dto.request.ExchangeUpdateConfigDto;
import com.titan.poss.config.dto.request.GepConfigItemRequestDto;
import com.titan.poss.config.dto.request.GepThemeRequestDto;
import com.titan.poss.config.dto.response.ExchangeConfigDetailsResponseDto;
import com.titan.poss.config.dto.response.ExchangeConfigItemThemeMappingResponseDto;
import com.titan.poss.config.dto.response.ExchangeConfigLocationsResponseDto;
import com.titan.poss.config.dto.response.ExchangeConfigProductGropusResponseDto;
import com.titan.poss.config.dto.response.ExchangeConfigResponseDto;
import com.titan.poss.config.dto.response.ExchangeConfigStoneResponseDto;
import com.titan.poss.config.dto.response.ExchangeUpdateItemResponseDto;
import com.titan.poss.config.dto.response.ExchangeUpdateThemeResponseDto;
import com.titan.poss.config.service.ExchangeConfigService;
import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.acl.ConfigAccessControls;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.MappedConfigResponseDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.PreAuthorizeDetails;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Validated
@RestController
@RequestMapping("config/v2/exchange-configs")
public class ExchangeConfigController {

	@Autowired
	private ExchangeConfigService exchangeConfigService;

	private static final String EXCHANGE_CONFIG_ADD_EDIT_PERMISSION = "hasPermission(#configType,'TEP_ITEM')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.TEP_PRODUCT_GROUP_ADD_EDIT
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR + "hasPermission(#configType,'TEP_STONE')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.TEP_STONE_ADD_EDIT
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR + "hasPermission(#configType,'TEP_VALIDATION')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.TEP_VALIDATION_ADD_EDIT
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR + "hasPermission(#configType,'TEP_GLOBAL')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.TEP_CONFIGURATION_ADD_EDIT
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR + "hasPermission(#configType,'TEP_CUT_PIECE')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.CUT_PIECE_TEP_ADD_EDIT
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR + "hasPermission(#configType,'GEP_ITEM')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.GEP_PURITY_ADD_EDIT
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR + "hasPermission(#configType,'TEP_EXCEPTION')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.TEP_EXCEPTION_ADD_EDIT
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR + "hasPermission(#configType,'TEP_GENERAL_CODES')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.TEP_GENERAL_CODES_ADD_EDIT
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR + "hasPermission(#configType,'TEP_MAX_FLAT_TEP')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.TEP_MAX_FLAT_TEP_ADD_EDIT
			+ PreAuthorizeDetails.END;

	private static final String EXCHANGE_CONFIG_VIEW_PERMISSION = "hasPermission(#configType,'TEP_ITEM')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.TEP_PRODUCT_GROUP_VIEW
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR + "hasPermission(#configType,'TEP_STONE')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.TEP_STONE_VIEW
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR + "hasPermission(#configType,'TEP_VALIDATION')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.TEP_VALIDATION_VIEW
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR + "hasPermission(#configType,'TEP_GLOBAL')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.TEP_CONFIGURATION_VIEW
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR + "hasPermission(#configType,'TEP_CUT_PIECE')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.CUT_PIECE_TEP_VIEW
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR + "hasPermission(#configType,'GEP_ITEM')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.GEP_PURITY_VIEW
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR + "hasPermission(#configType,'TEP_EXCEPTION')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.TEP_EXCEPTION_VIEW
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR + "hasPermission(#configType,'TEP_GENERAL_CODES')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.TEP_GENERAL_CODES_VIEW
			+ PreAuthorizeDetails.END + PreAuthorizeDetails.OR + "hasPermission(#configType,'TEP_MAX_FLAT_TEP')"
			+ PreAuthorizeDetails.AND + PreAuthorizeDetails.START + ConfigAccessControls.TEP_MAX_FLAT_TEP_VIEW
			+ PreAuthorizeDetails.END;
	

	//@formatter:off
	@ApiOperation(value = "List of Exchange config", notes = "This API return list of exchange config."
			+ "<br>Search by **description**,**is active**,**item code** is allowed. API will return pageable response.<br>"
			+ "Below config types are allowed:"
			+ "<ul>"
			+ "<li>TEP_ITEM</li>"
			+ "<li>TEP_STONE</li>"
			+ "<li>TEP_VALIDATION</li>"
			+ "<li>TEP_GLOBAL</li>"
			+ "<li>TEP_CUT_PIECE</li>"
			+ "<li>TEP_EXCEPTION</li>"
			+ "<li>TEP_GENERAL_CODES</li>"
			+ "<li>TEP_CUT_PIECE_TOT</li>"
			+ "<li>GEP_ITEM</li>"
			+ "</ul><br><br>"
			+ "For config type : **TEP_GLOBAL & TEP_CUT_PIECE** configuration can't be added multiple times. In case the mentioned "
			+ "type is already available then same **config id** "
			+ "will be returned")
	//@formatter:on
	@GetMapping
	@ApiPageable
//	@PreAuthorize(EXCHANGE_CONFIG_VIEW_PERMISSION)
	public PagedRestResponse<List<ExchangeConfigResponseDto>> getExchangeConfigList(
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_MAX_50) String description,
			@RequestParam(required = false) Boolean isActive,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = true) @ApiParam(value = "Config Type", required = true, allowableValues = "TEP_ITEM, TEP_STONE,TEP_VALIDATION, TEP_GLOBAL, TEP_CUT_PIECE, TEP_EXCEPTION, TEP_GENERAL_CODES, TEP_CUT_PIECE_TOT, GEP_ITEM") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType,
			@ApiIgnore Pageable pageable) {
		return exchangeConfigService.getExchangeConfigList(description, configType, isActive, itemCode, pageable);
	}

	//@formatter:off
	@ApiOperation(value = "Get exchange config by config id", notes = "This API return exchange config based on config id<br>"
			+ "Below config types are allowed:"
			+ "<ul>"
			+ "<li>TEP_ITEM</li>"
			+ "<li>TEP_STONE</li>"
			+ "<li>TEP_VALIDATION</li>"
			+ "<li>TEP_GLOBAL</li>"
			+ "<li>TEP_CUT_PIECE</li>"
			+ "<li>TEP_EXCEPTION</li>"
			+ "<li>TEP_GENERAL_CODES</li>"
			+ "<li>TEP_CUT_PIECE_TOT</li>"
			+ "<li>GEP_ITEM</li>"
			+ "</ul>")
	//@formatter:on
	@GetMapping(value = "/{config-id}")
//	@PreAuthorize(EXCHANGE_CONFIG_VIEW_PERMISSION)
	public ExchangeConfigResponseDto getExchangeConfig(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String configId,
			@RequestParam(required = true) @ApiParam(value = "Config Type", required = true, allowableValues = "TEP_ITEM, TEP_STONE,TEP_VALIDATION, TEP_GLOBAL, TEP_CUT_PIECE, TEP_EXCEPTION, TEP_GENERAL_CODES, TEP_CUT_PIECE_TOT, GEP_ITEM") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType) {
		return exchangeConfigService.getExchangeConfig(configId, configType);
	}

	//@formatter:off
	@ApiOperation(value = "Create new exchange config", notes = "This API is to create new exchange config.<br><br>"
			+ "Below config types are allowed:"
			+ "<ul>"
			+ "<li>TEP_ITEM</li>"
			+ "<li>TEP_STONE</li>"
			+ "<li>TEP_VALIDATION</li>"
			+ "<li>TEP_GLOBAL</li>"
			+ "<li>TEP_CUT_PIECE</li>"
			+ "<li>TEP_EXCEPTION</li>"
			+ "<li>TEP_GENERAL_CODES</li>"
			+ "<li>TEP_CUT_PIECE_TOT</li>"
			+ "<li>GEP_ITEM</li>"
			+ "</ul>"
			+ "For config type : **TEP_GLOBAL & TEP_CUT_PIECE** configuration can't be added multiple times. In case the mentioned "
			+ "type is already available then same **config id** "
			+ "will be returned")
	//@formatter:on
	@PostMapping
//	@PreAuthorize(EXCHANGE_CONFIG_ADD_EDIT_PERMISSION)
	public ExchangeConfigResponseDto createExchangeConfig(
			@RequestBody @Valid @ApiParam(name = "body", value = "'exchangeConfig' object that needs to be added", required = true) ExchangeCreateConfigDto exchangeCreateConfigDto,
			@RequestParam(required = true) @ApiParam(value = "Config Type", required = true, allowableValues = "TEP_ITEM, TEP_STONE, TEP_VALIDATION, TEP_GLOBAL, TEP_CUT_PIECE, TEP_EXCEPTION, TEP_GENERAL_CODES, TEP_CUT_PIECE_TOT, GEP_ITEM") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType) {
		return exchangeConfigService.createExchangeConfig(exchangeCreateConfigDto, configType);
	}

	//@formatter:off
	@ApiOperation(value = "Update existing exchange config by config id", notes = "This API is to update existing exchange config by config id."
			+ "Below config types are allowed:"
			+ "<ul>"
			+ "<li>TEP_VALIDATION</li>"
			+ "<li>TEP_GLOBAL</li>"
			+ "<li>TEP_CUT_PIECE</li>"
			+ "<li>TEP_EXCEPTION</li>"
			+ "<li>TEP_GENERAL_CODES</li>"
			+ "<li>TEP_CUT_PIECE_TOT</li>"
			+ "<li>GEP_ITEM</li>"
			+ "</ul>"
			+ "<br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Json format for the details:</span></b>\r\n"
			+ "&nbsp;&nbsp;<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/GepConfigDetails.json\">"
			+ "GEP_CONFIG</a> (config type:GEP_ITEM,configDetails JSON)"
			+ "</br></br>"
			+ "</li>"
			+ "&nbsp;&nbsp;<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/GepOfferDetails.json\">"
			+ "GEP_OFFER</a> (config type:GEP_ITEM,offerDetails JSON)"
			+ "</br></br>"
			+ "&nbsp;&nbsp;<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/TepGlobalConfig.json\">"
			+ "TEP_GLOBAL_CONFIG</a> (config type:TEP_GLOBAL,configDetails JSON)"
			+ "</br></br>"
			+ "</li>"
			+ "&nbsp;&nbsp;<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/TepValidationConfig.json\">"
			+ "TEP_VALIDATION_CONFIG</a> (config type:TEP_VALIDATION,configDetails JSON)"
			+ "</br></br>"
			+ "</li>"
			+ "&nbsp;&nbsp;<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/TepExceptionConfig.json\">"
			+ "TEP_EXCEPTION_CONFIG </a>(config type:TEP_EXCEPTION,offerDetails JSON)"
			+ "</br></br>"
			+ "</li>"
			+ "&nbsp;&nbsp;<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/TepGeneralCodesConfig.json\">"
			+ "TEP_GENERAL_CODES_CONFIG</a> (config type:TEP_GENERAL_CODES,configDetails JSON)"
			+ "</br></br>"
			+ "</li>"
			+ "&nbsp;&nbsp;<li>"
			+ "<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/TepCutPieceTot.json\">"
			+ "TEP_CUT_PIECE_TOT_CONFIG</a> (config TEP_CUT_PIECE_TOT,configDetails JSON)"
			+ "</br></br>"
			+ "</li>")
	//@formatter:on
	@PatchMapping(value = "/{config-id}")
//	@PreAuthorize(EXCHANGE_CONFIG_ADD_EDIT_PERMISSION)
	public ExchangeConfigResponseDto updateExchangeConfig(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String configId,
			@RequestParam(required = true) @ApiParam(value = "Config Type", required = true, allowableValues = "TEP_VALIDATION, TEP_GLOBAL, TEP_CUT_PIECE, TEP_EXCEPTION, TEP_GENERAL_CODES, TEP_CUT_PIECE_TOT, GEP_ITEM") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType,
			@RequestBody @Valid @ApiParam(name = "body", value = "exchangeConfig object that needs to be updated", required = true) ExchangeUpdateConfigDto exchangeUpdateConfigDto) {
		return exchangeConfigService.updateExchangeConfig(configId, configType, exchangeUpdateConfigDto);
	}

	//@formatter:off
	@ApiOperation(value = "Get list of exchange config details by config id", notes = "This API returns list of exchange config Details by config id."
			+ " <br> API will return pageable response."
			+ "Below config types are allowed:"
			+ "<ul>"
			+ "<li>GEP_ITEM</li>"
			+ "</ul>")
	//@formatter:on
	@GetMapping(value = "/{config-id}/details")
	@PreAuthorize(EXCHANGE_CONFIG_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<ExchangeConfigDetailsResponseDto>> getExchangeConfigDetails(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String configId,
			@RequestParam(required = true) @ApiParam(value = "Config Type", required = true, allowableValues = "GEP_ITEM") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType,
			@ApiIgnore Pageable pageable) {
		return exchangeConfigService.getExchangeConfigDetails(configId, configType, pageable);
	}

	//@formatter:off
	@ApiOperation(value = "Add/update/remove exchange config Details by config id", notes = "This API is to create/update/remove exchange config Details by config id."
			+ "Below config types are allowed:"
			+ "<ul>"
			+ "<li>GEP_ITEM</li>"
			+ "</ul>"
			+ "In GEP config details range overlapping is not possible. User has to choose below range type from range dropdown "
			+ "for the below metal type.<br>"
			+ "<ul>"
			+ "<li>metal type : <b>J(Gold)</b>, range type : <b>GEP_GOLD_PURITY</b></li>"
			+ "<li>metal type : <b>P(Silver)</b>, range type : <b>GEP_SILVER_PURITY</b></li>"
			+ "<li>metal type : <b>L(Platinum)</b>, range type : <b>GEP_PLATINUM_PURITY</b></li>"
			+ "</ul>"
			+ "<b>Note 1 : </b>If config details has been added for the first time then in updateConfigDetails object user doesn't "
			+ "need to pass any details. But if user adds data for consecutive time then all existing data should be passed in "
			+ "updateConfigDetails object.<br>"
			+ "<b>Note 2 : </b>If user passes wrong metal type & range type combination as mentioned above then user will get "
			+ "an exception.")
	//@formatter:on
	@PatchMapping(value = "/{config-id}/details")
	@PreAuthorize(EXCHANGE_CONFIG_ADD_EDIT_PERMISSION)
	public ListResponse<ExchangeConfigDetailsResponseDto> updateExchangeConfigDetails(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String configId,
			@RequestParam(required = true) @ApiParam(value = "Config Type", required = true, allowableValues = "GEP_ITEM") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType,
			@RequestBody @Valid @ApiParam(name = "body", value = "'exchangeConfig' object that needs to be added/removed/updated", required = true) ExchangeConfigDetailsRequestDto exchangeConfigDetailsRequestDto) {
		return exchangeConfigService.updateExchangeConfigDetails(configId, configType, exchangeConfigDetailsRequestDto);
	}

	//@formatter:off
	@ApiOperation(value = "Get list of exchange config locations mapping details by config id", notes = "This API returns list of all exchange location config details by config id."
			+ " <br> API will return pageable response."
			+ "Below config types are allowed:"
			+ "<ul>"
			+ "<li>TEP_ITEM</li>"
			+ "<li>TEP_STONE</li>"
			+ "<li>TEP_VALIDATION</li>"
			+ "<li>TEP_EXCEPTION</li>"
			+ "<li>GEP_ITEM</li>"
			+ "</ul>")
	//@formatter:on
	@GetMapping(value = "/{config-id}/locations")
	@PreAuthorize(EXCHANGE_CONFIG_VIEW_PERMISSION)
	public ListResponse<ExchangeConfigLocationsResponseDto> getLocationsMapping(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String configId,
			@RequestParam(required = true) @ApiParam(value = "Config Type", required = true, allowableValues = "TEP_ITEM, TEP_STONE, TEP_VALIDATION, TEP_EXCEPTION, GEP_ITEM") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType) {
		return exchangeConfigService.getLocationsMapping(configId, configType);
	}

	//@formatter:off
	@ApiOperation(value = "Update existing exchange config locations mapping details by config id", notes = "This API updates existing exchange location details by config id."
			+ " <br> By using this API a particular/multiple locations can be added or removed.<br>"
			+ "Below config types are allowed:"
			+ "<ul>"
			+ "<li>TEP_ITEM</li>"
			+ "<li>TEP_STONE</li>"
			+ "<li>TEP_VALIDATION</li>"
			+ "<li>TEP_EXCEPTION</li>"
			+ "<li>GEP_ITEM</li>"
			+ "</ul>"
			+ "<ul>"
			+ "</t><li>addLocations: list of location will be mapped w.r.t config id.</li>"
			+ "</t><li>removeLocations: list of location will be removed w.r.t config id.</li>"
			+ "</t><li>overwriteLocations: list of location will be overwritten w.r.t config id.(for config type : TEP_EXCEPTION "
			+ "overwriteLocations is invalid)</li>"
			+ "</ul>")
	//@formatter:on
	@PatchMapping(value = "/{config-id}/locations")
	@PreAuthorize(EXCHANGE_CONFIG_ADD_EDIT_PERMISSION)
	public ExchangeConfigLocationsRequestDto updateLocationsMapping(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String configId,
			@RequestParam(required = true) @ApiParam(value = "Config Type", required = true, allowableValues = "TEP_ITEM, TEP_STONE, TEP_VALIDATION, TEP_EXCEPTION, GEP_ITEM") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType,
			@RequestBody @Valid @ApiParam(name = "body", value = "'configLocationMapping' object that needs to be added/removed", required = true) ExchangeConfigLocationsRequestDto exchangeConfigLocationsDto) {
		return exchangeConfigService.updateLocationsMapping(configId, configType, exchangeConfigLocationsDto);
	}

	//@formatter:off
	@ApiOperation(value = "Get list of exchange config product mapping details by config id", notes = "This API returns list of all exchange product mapping details by config id."
			+ " <br> API will return pageable response." 
			+ "Below config types are allowed:" 
			+ "<ul>"
			+ "<li>TEP_ITEM</li>" 
			+ "<li>TEP_CUT_PIECE</li>" 
			+ "<li>TEP_GENERAL_CODES</li>"
			+ "<li>GEP_ITEM</li>" 
			+ "</ul>")
	//@formatter:on
	@GetMapping(value = "/{config-id}/product-mapping")
	@PreAuthorize(EXCHANGE_CONFIG_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<ExchangeConfigProductGropusResponseDto>> getProductMapping(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String configId,
			@RequestParam(required = true) @ApiParam(value = "Config Type", required = true, allowableValues = "TEP_ITEM, TEP_CUT_PIECE, TEP_GENERAL_CODES, GEP_ITEM") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String productGroup,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.PRODUCT_CATEGORY_CODE_REGEX) String productCategory,
			@ApiIgnore Pageable pageable) {
		return exchangeConfigService.getProductMapping(configId, configType, productGroup, productCategory, pageable);
	}

	//@formatter:off
	@ApiOperation(value = "Add/Update/Remove exchange config product mapping details by config id", notes = "This API adds/updates/removes existing exchange product details by config id."
			+ " <br> By using this API a particular/multiple product group can be added or removed. "
			+ "<br>In request range details need to be provided and range details will be mapped to every product group (For GEP only).<br>"
			+ "Below config types are allowed:"
			+ "<ul>"
			+ "<li>TEP_ITEM</li>"
			+ "<li>TEP_CUT_PIECE</li>"
			+ "<li>TEP_GENERAL_CODES</li>"
			+ "<li>GEP_ITEM</li>"
			+ "</ul>"
			+ "For config type : **TEP_CUT_PIECE** : addProductCategories & updateProductCategories should be used.<br>"
			+ "Requestbody for product groups:"
			+ "<ul>"
			+ "<li> addProductGroups: product group lists which need to be added.(only for GEP_ITEM, TEP_GENERAL_CODES & TEP_ITEM)</li>"
			+ "<li> updateProductGroups: product group lists which need to be updated (only for GEP_ITEM & TEP_ITEM)</li>"
			+ "<li> removeProductGroups: product group lists which need to be removed(UUIDs need to pass & only for GEP_ITEM, TEP_GENERAL_CODES and TEP_ITEM)</li>"
			+ "<li> addProductCategories: product categories lists which need to be added.(only for TEP_CUT_PIECE) </li>"
			+ "<li> updateProductCategories: product categories lists which need to be updated.(only for TEP_CUT_PIECE) </li>"
			+ "<li> removeProductCategories: product categories lists which need to be removed.(UUIDs need to pass & only for TEP_CUT_PIECE) </li>"
			+ "<li> addRanges: range details need to pass. Range details contains range id & percent value.(only for GEP_ITEM)</li>"
			+ "<li> updateGepProductGroups: product group lists which need to be updated (only for GEP_ITEM)</li>"
			+ "<li> updateRanges: range details need to pass. Range details contains range id & percent value.(only for GEP_ITEM)</li>"
			+ "</ul>"
			+ "<br><b><span style=\"font-size:14px;\">Find the below hyperlinks of Json format for the TEP product group config "
			+ "details(For configType: **TEP_ITEM**):</span></b>\r\n"
			+ "<ul>"
			+ "<li>"
			+ "&nbsp;&nbsp;<a span href=\"https://bitbucket.org/titan-poss/poss-services/src/master/config-service/src/main/resources/com/titan/poss/config/json/TepProductConfig.json\">"
			+ "TEP_PRODUCT_CONFIG </a>"
			+ "</br></br>"
			+ "</li>"
			+ "</ul>"
			+ "<b>NOTE : For config_type : TEP_GENERAL_CODES, in addProductGroups payload only product group code should be passed. Example : 71,72,73 etc.</b><br>"
			+ "<b>configDetails json should be empty.</b>")
	//@formatter:on
	@PatchMapping(value = "/{config-id}/product-mapping")
	@PreAuthorize(EXCHANGE_CONFIG_ADD_EDIT_PERMISSION)
	public ListResponse<ExchangeConfigProductGropusResponseDto> updateProductMapping(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String configId,
			@RequestParam(required = true) @ApiParam(value = "Config Type", required = true, allowableValues = "TEP_ITEM, TEP_CUT_PIECE, TEP_GENERAL_CODES, GEP_ITEM") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType,
			@RequestBody @Valid @ApiParam(name = "body", value = "'exchangeProductMapping' object that needs to be added/updated/removed", required = true) ExchangeConfigProductGroupMappingRequestDto exchangeConfigProductGroupMappingRequestDto) {
		return exchangeConfigService.updateProductMapping(configId, configType,
				exchangeConfigProductGroupMappingRequestDto);
	}

	//@formatter:off
	@ApiOperation(value = "Get list of exchange item theme mapping details based on config id", notes = "This API returns list of exchange item theme mapping details based on config id"
			+ "<br>To check the theme mapping **isThemeEnabled** should be true and to check the item mapping **isTheme** should "
			+ "be false. Search by **itemCode** and **themeCode** is allowed. This API will return pageable response."
			+ "Below config types are allowed:" 
			+ "<ul>" 
			+ "<li>GEP_ITEM</li>" 
			+ "</ul>")
	//@formatter:on
	@GetMapping(value = "/{config-id}/item-theme-mapping")
	@PreAuthorize(EXCHANGE_CONFIG_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<ExchangeConfigItemThemeMappingResponseDto>> getItemThemeMapping(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String configId,
			@RequestParam(required = true) @ApiParam(value = "Config Type", required = true, allowableValues = "GEP_ITEM") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType,
			@RequestParam(required = true) Boolean isTheme,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.ITEM_CODE_REGEX) String itemCode,
			@RequestParam(required = false) @PatternCheck(regexp = RegExConstants.THEME_CODE_REGEX) String themeCode,
			@ApiIgnore Pageable pageable) {
		return exchangeConfigService.getItemThemeMapping(configType, isTheme, configId, itemCode, themeCode, pageable);
	}

	//@formatter:off
	@ApiOperation(value = "Add/Remove theme codes by config id", notes = "This API adds/removes existing exchange theme details. <br>In **addThemes** object"
			+ " theme codes need to pass & **removeThemes** object **list of UUIDs** need to pass for those theme codes which should be removed."
			+ "Below config types are allowed:" 
			+ "<ul>" 
			+ "<li>GEP_ITEM</li>" 
			+ "</ul>")
	//@formatter:on
	@PatchMapping(value = "/{config-id}/theme-mapping")
	@PreAuthorize(EXCHANGE_CONFIG_ADD_EDIT_PERMISSION)
	public ListResponse<ExchangeUpdateThemeResponseDto> updateThemes(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String configId,
			@RequestParam(required = true) @ApiParam(value = "Config Type", required = true, allowableValues = "GEP_ITEM") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType,
			@RequestBody @Valid @ApiParam(name = "body", value = "'exchangetoThemeMapping' object that needs to be added/removed", required = true) GepThemeRequestDto gepThemeRequestDto) {
		return exchangeConfigService.updateThemes(configId, configType, gepThemeRequestDto);
	}

	//@formatter:off
	@ApiOperation(value = "Update item codes by config id", notes = "This API updates existing exchange item details. <br>In **updateItems** object"
			+ " **list of UUIDs** need to pass. **isExcluded** cannot be null. Either it should be true or false."
			+ "Below config types are allowed:"
			+ "<ul>"
			+ "<li>GEP_ITEM</li>"
			+ "</ul>")
	//@formatter:on
	@PatchMapping(value = "/{config-id}/item-mapping")
	@PreAuthorize(EXCHANGE_CONFIG_ADD_EDIT_PERMISSION)
	public ListResponse<ExchangeUpdateItemResponseDto> updateItems(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String configId,
			@RequestParam(required = true) @ApiParam(value = "Config Type", required = true, allowableValues = "GEP_ITEM") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType,
			@RequestBody @Valid @ApiParam(name = "body", value = "'gepItemMapping' object that needs to be added/removed", required = true) GepConfigItemRequestDto gepItemRequest) {
		return exchangeConfigService.updateItems(configId, configType, gepItemRequest);
	}

	//@formatter:off
	@ApiOperation(value = "View the list of locations which are mapped to config id.",notes="This API returns list of locations.<br>"
			+ " This API accepts below filter."
			+ "<ul>"
			+ "<li>excludeConfigId: configId to be excluded</li>"
			+ "<li>includeLocations: list of locationCodes to be included</li>"
			+ "</ul>"
			+ "Below config types are allowed:"
			+ "<ul>"
			+ "<li>GEP_ITEM</li>"
			+ "<li>TEP_ITEM</li>"
			+ "<li>TEP_STONE</li>"
			+ "<li>TEP_VALIDATION</li>"
			+ "</ul>"
			+ "<b>Note:</b>excludeConfigId is optional in this API.")
	//@formatter:on
	@PostMapping(value = "/locations")
	@PreAuthorize(EXCHANGE_CONFIG_ADD_EDIT_PERMISSION)
	public ListResponse<MappedConfigResponseDto> getLocationsMappingList(
			@RequestParam(required = true) @ApiParam(value = "Config Type", required = true, allowableValues = "TEP_ITEM, TEP_STONE, TEP_VALIDATION, GEP_ITEM") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType,
			@Valid @RequestBody @ApiParam(name = "body", value = "Provide exchange config location mapping related fields", required = true) ExchangeConfigLocationsMappingRequestDto exchangeConfigLocationsMappingRequestDto) {
		return exchangeConfigService.getLocationsMappingList(configType, exchangeConfigLocationsMappingRequestDto);
	}

	//@formatter:off
	@ApiOperation(value = "Get exchange stone details.", notes = "This API is to get the stone details based on config id<br>"
			+ "Below config types are allowed:"
			+ "<ul>"
			+ "<li>TEP_STONE</li>"
			+ "</ul>"
			+ "In this API <b>stone type code</b> search filter is available.")
	//@formatter:off
	@GetMapping(value = "/{config-id}/stones")
	@PreAuthorize(EXCHANGE_CONFIG_VIEW_PERMISSION)
	@ApiPageable
	public PagedRestResponse<List<ExchangeConfigStoneResponseDto>> getExchangeConfigStoneMapping(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String configId,
			@RequestParam(required = true) @ApiParam(value = "Config Type", required = true, allowableValues = "TEP_STONE") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType,
			@RequestParam(required = false)@PatternCheck(regexp = RegExConstants.STONE_TYPE_CODE_REGEX) String stoneTypeCode,
			@ApiIgnore Pageable pageable) {
		return exchangeConfigService.getExchangeConfigStoneMapping(configId, configType,stoneTypeCode, pageable);
	}

	//@formatter:off
	@ApiOperation(value = "Add/remove/update exchange config stone details.", notes = "This API is to add/remove/update the exchange config stone details based on config id.<br>"
			+ "Below config types are allowed:"
			+ "<ul>"
			+ "<li><b>TEP_STONE</b></li>"
			+ "</ul>"
			+ "Here range overlapping is not possible. User has to choose below range type from range dropdown. Range type should be <b>TEP_CARAT</b>.<br>"
			+ "<b>Note </b> : If config details has been added for the first time then in **updateStones** object user does not need to pass any details. "
			+ "But if user adds data for consecutive time then all existing data should be passed in **updateStones** object.")
	//@formatter:on
	@PatchMapping(value = "/{config-id}/stones")
	@PreAuthorize(EXCHANGE_CONFIG_ADD_EDIT_PERMISSION)
	public ListResponse<ExchangeConfigStoneResponseDto> updateStones(
			@PathVariable("config-id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String configId,
			@RequestParam(required = true) @ApiParam(value = "Config Type", required = true, allowableValues = "TEP_STONE") @ValueOfEnum(enumClass = ConfigTypeEnum.class) String configType,
			@RequestBody @Valid @ApiParam(name = "body", value = "exchangeStoneMapping object that needs to be added/removed/updated", required = true) ExchangeConfigStoneRequestDto exchangeStonesRequest) {
		return exchangeConfigService.updateStones(configId, configType, exchangeStonesRequest);
	}

}
