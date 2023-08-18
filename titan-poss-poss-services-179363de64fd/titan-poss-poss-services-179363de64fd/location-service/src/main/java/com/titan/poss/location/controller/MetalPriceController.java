/*  Copyright 2019. Titan Company Limited
 * 
 */
package com.titan.poss.location.controller;

import static com.titan.poss.core.domain.acl.ConfigAccessControls.PRODUCT_PRICING_MATERIAL_PRICE_ADD_EDIT;
import static com.titan.poss.core.domain.acl.ConfigAccessControls.PRODUCT_PRICING_MATERIAL_PRICE_VIEW;
import static com.titan.poss.core.domain.acl.ProductMasterACLConstants.PRODUCT_PRICING_MATERIAL_PRICE_TYPE_ADD_EDIT;
import static com.titan.poss.core.domain.acl.ProductMasterACLConstants.PRODUCT_PRICING_MATERIAL_PRICE_TYPE_VIEW;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
import static com.titan.poss.core.utils.PreAuthorizeDetails.OR;
import static com.titan.poss.core.utils.PreAuthorizeDetails.START;
import static com.titan.poss.location.acl.LocationACLConstants.LOCATION_HIERARCHY_MARKET_CODE_ADD_EDIT;
import static com.titan.poss.location.acl.LocationACLConstants.LOCATION_HIERARCHY_MARKET_CODE_VIEW;

import java.util.List;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.titan.poss.core.config.swagger.ApiPageable;
import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.MetalPriceLocationResponse;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dto.request.MetalBasePriceRequestDto;
import com.titan.poss.location.dto.request.MetalPriceMappingRequestDto;
import com.titan.poss.location.dto.request.json.MetalPriceConfigRequestDto;
import com.titan.poss.location.dto.response.MarketMarkupMappingFactorsDto;
import com.titan.poss.location.dto.response.MetalPriceConfigDto;
import com.titan.poss.location.dto.response.MetalPriceMappingBaseDto;
import com.titan.poss.location.dto.response.MetalPriceMappingResponseDto;
import com.titan.poss.location.service.MetalService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("locationMetalPriceController")
@RequestMapping("location/v2/metal-types/")
@Api(tags = { "metal-price-controller" })
@Validated
public class MetalPriceController {

	@Autowired
	private MetalService metalService;

	// @formatter:off
	private static final String MARKET_VIEW_PERMISSION = START + LOCATION_HIERARCHY_MARKET_CODE_VIEW + END + OR + START
			+ PRODUCT_PRICING_MATERIAL_PRICE_TYPE_VIEW + END + OR + START + PRODUCT_PRICING_MATERIAL_PRICE_VIEW
			+ END ;

	private static final String MARKET_ADD_EDIT_PERMISSION = START + LOCATION_HIERARCHY_MARKET_CODE_ADD_EDIT + END + OR
			+ START + PRODUCT_PRICING_MATERIAL_PRICE_TYPE_ADD_EDIT + END + OR + START
			+ PRODUCT_PRICING_MATERIAL_PRICE_ADD_EDIT + END;
	// @formatter:on

	// Following API are reflecting for MetalPriceMapping (gold,silver,platinum)
	/**
	 * This method will return the list of Market details based on the isActive.
	 * 
	 * @param MetalTypeCodeEnum
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<MarketMarkupMappingFactorsDto>>
	 */
	@ApiOperation(value = "API to get the list of MarketMarkupMappingFactors details", notes = "This API is used to list markupFactors for list of markets based on metalTypeCode, "
			+ "</br> This API will get the list of MarketMarkupMappingFactors details based on metalTypeCodeSelected")
	@ApiPageable
	@GetMapping(value = "/{metalTypeCode}/market")
	@PreAuthorize(MARKET_VIEW_PERMISSION)
	public PagedRestResponse<List<MarketMarkupMappingFactorsDto>> listMetalPriceLocationMapping(
			@ApiParam(name = "metalTypeCode", allowableValues = "J, P, L", required = true) @PathVariable("metalTypeCode") @ValueOfEnum(enumClass = MetalTypeCodeEnum.class) String metalTypeCode,
			@RequestParam(name = "marketCodes", required = false) List<@PatternCheck(regexp = RegExConstants.MARKET_CODE_REGEX) String> marketCodes,
			@RequestParam(name = "description", required = false) List<@PatternCheck(regexp = RegExConstants.DESCRIPTION_REGEX_SPCL_CHAR_MAX_100) String> descriptions,
			@ApiIgnore Pageable pageable) {

		return metalService.listMarketMarkupMapping(marketCodes, descriptions, metalTypeCode, pageable);
	}

	// Following API's are reflecting with combination of MarketMarkupMapping
	// Table + provided base price
	/**
	 * This method will compute the MetalPriceLocaionMapping by calculating
	 * Computing Price details.
	 * 
	 * @param marketMateriaDto
	 * @param bindingResult
	 * @return MetalPriceMappingResponseDto
	 */
	@ApiOperation(value = "API to compute the metalPrice w.r.t provided base price", notes = "This API is used to compute the metal price on basis of Base_price Provided w.r.t metalTypeCode,"
			+ "</br> This API will compute the metal price for the market_code and returns response w.r.t locations")
	@PostMapping(value = "/{metalTypeCode}/price/compute")
	@ApiPageable
	@PreAuthorize(MARKET_ADD_EDIT_PERMISSION)
	public PagedRestResponse<List<MetalPriceMappingBaseDto>> computeMetalPriceLocationMapppingConfig(
			@ApiParam(name = "metalTypeCode", allowableValues = "J, P, L", required = true) @PathVariable("metalTypeCode") @ValueOfEnum(enumClass = MetalTypeCodeEnum.class) String metalTypeCode,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.MARKET_CODE_REGEX) String> marketCodes,
			@RequestParam(required = false) List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> locationCodes,
			@RequestBody @Valid MetalBasePriceRequestDto metalPriceDto, @ApiIgnore Pageable pageable) {

		return metalService.computeMetalPriceLocationMapping(metalTypeCode, metalPriceDto, marketCodes, locationCodes,
				pageable);
	}

	// Following API's are reflecting for MetalPriceLocationMapping Table
	/**
	 * This method will save the MetalPriceLocaionMapping by calculating Computing
	 * Price details.
	 * 
	 * @param marketDto
	 * @param bindingResult
	 * @return MarketMarkupMappingDto
	 */
	@ApiOperation(value = "API to compute the metalPrice and to save in MetalPriceLocationMapping", notes = "This API is used to save the Compputed price of particular metalTypeCode for applicable Date,"
			+ "</br> This API will compute the metal price for the market_code and save ")
	@PutMapping(value = "/{metalTypeCode}/price")
	@PreAuthorize(MARKET_ADD_EDIT_PERMISSION)
	public void confirmMetalPriceLocationMapppingConfig(
			@ApiParam(name = "metalTypeCode", allowableValues = "J, P, L", required = true) @PathVariable("metalTypeCode") @ValueOfEnum(enumClass = MetalTypeCodeEnum.class) String metalTypeCode,
			@RequestBody @Valid MetalPriceMappingRequestDto marketMateriaDto) {

		metalService.confirmMetalPriceLocationMapping(metalTypeCode, marketMateriaDto);

	}

	// list api for config header.
	// Following API gets data from for MetalPriceConfig Table
	/**
	 * This method will fetch data from MetalPriceConfig for computed Computing
	 * Price details.
	 * 
	 * @param marketDto
	 * @param bindingResult
	 * @return list MetalPriceConfigDto
	 */
	@ApiPageable
	@ApiOperation(value = "API to  fetch data from MetalPriceConfig for computed ", notes = "This API is used to list base prices defined for markets on basis of applicable date and metalTypeCode, This API will fetch data from MetalPriceConfig for computed **</br> J-GOLD"
			+ "    </br> P-SILVER" + "    </br> L-PLATINUM" + "    </br> S-STONES **")
	@PostMapping(value = "/{metalTypeCode}/price")
	@PreAuthorize(MARKET_ADD_EDIT_PERMISSION)
	public PagedRestResponse<List<MetalPriceConfigDto>>listMetalPriceConfig(
			@ApiParam(name = "metalTypeCode", allowableValues = "J, P, L", required = true) @PathVariable("metalTypeCode") @ValueOfEnum(enumClass = MetalTypeCodeEnum.class) String metalTypeCode,
			@RequestBody @Valid MetalPriceConfigRequestDto metalPriceConfigRequestDto,
			@RequestParam(required = false) String configId,@ApiIgnore Pageable pageable) {

		return metalService.listMetalPriceConfig(metalTypeCode, metalPriceConfigRequestDto, configId,pageable);
	}

	// fetching MetalpricelocationDetails mapping w.r.t config id.
	// Following API gets data from for MetalPriceConfig Table
	/**
	 * This method will fetch data from MetalPriceConfig for computed Computing
	 * Price details.
	 * 
	 * @param marketDto
	 * @param bindingResult
	 * @return MarketMarkupMappingDto
	 */
	@ApiOperation(value = "API to  fetch data from MetalPriceConfig for computed ", notes = "This API lists saved computed prices for the Markets defined w.r.t locations on basis of configID and metalTypeCode,"
			+ "</br> This API will fetch data from  MetalPriceConfig for computed **</br> J-GOLD" + "    </br> P-SILVER"
			+ "    </br> L-PLATINUM" + "    </br> S-STONES **")
	@ApiPageable
	@GetMapping(value = "{metalTypeCode}/{id}/prices")
	@PreAuthorize(MARKET_ADD_EDIT_PERMISSION)
	public PagedRestResponse<List<MetalPriceMappingResponseDto>> listMetalPriceLocation(
			@ApiParam(name = "metalTypeCode", allowableValues = "J, P, L", required = true) @PathVariable("metalTypeCode") @ValueOfEnum(enumClass = MetalTypeCodeEnum.class) String metalTypeCode,
			@PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX) String id,
			@RequestParam(name = "marketCodes", required = false) List<@PatternCheck(regexp = RegExConstants.MARKET_CODE_REGEX) String> marketCodes,
			@RequestParam(name = "locationCode", required = false) List<@PatternCheck(regexp = RegExConstants.LOCATION_CODE_REGEX) String> locationCodes,
			@ApiIgnore Pageable pageable) {

		return metalService.listMetalPriceLocation(metalTypeCode, id, marketCodes, locationCodes, pageable);
	}

	@PostMapping(value = "/eposs")
	@ApiOperation(value = "API to get metalPriceObject based on the appicableDate for a boutique", notes = "This api is uded to sync the metal rate to a boutique ")
	public MetalPriceLocationResponse listMetalPriceLocationDao(
			@RequestBody @Valid MetalPriceConfigRequestDto metalPriceLocationgRequestDto) {
		return metalService.listMetalPriceLocationDao(metalPriceLocationgRequestDto);
	}

}