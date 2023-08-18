/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.controller;

import static com.titan.poss.core.domain.acl.ProductMasterACLConstants.PRODUCT_PRICING_MARKET_MATERIAL_MAPPING_ADD_EDIT;
import static com.titan.poss.core.domain.acl.ProductMasterACLConstants.PRODUCT_PRICING_MARKET_MATERIAL_MAPPING_VIEW;
import static com.titan.poss.core.domain.acl.ProductMasterACLConstants.PRODUCT_PRICING_MARKET_UCP_MAPPING_ADD_EDIT;
import static com.titan.poss.core.domain.acl.ProductMasterACLConstants.PRODUCT_PRICING_MARKET_UCP_MAPPING_VIEW;
import static com.titan.poss.core.domain.constant.RegExConstants.MARKET_CODE_REGEX;
import static com.titan.poss.core.utils.PreAuthorizeDetails.END;
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
import org.springframework.web.bind.annotation.PatchMapping;
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
import com.titan.poss.core.dto.MarketDto;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.location.dto.MarketUcpPriceMappingDto;
import com.titan.poss.location.dto.request.MarketMarkupMappingRequestDto;
import com.titan.poss.location.dto.request.MarketUpdateDto;
import com.titan.poss.location.dto.response.MarketMarkupListMappingResponseDto;
import com.titan.poss.location.dto.response.MarketMarkupMappingResponseDto;
import com.titan.poss.location.dto.response.MarketUcpPriceMappingResponseDto;
import com.titan.poss.location.service.MarketService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiParam;
import springfox.documentation.annotations.ApiIgnore;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@RestController("")
@RequestMapping("location/v2/markets")
@Api(tags = { "market-controller" })
@Validated
public class MarketController {

	@Autowired
	private MarketService marketService;

	//@formatter:off
	private static final String MARKET_VIEW_PERMISSION = START + LOCATION_HIERARCHY_MARKET_CODE_VIEW + END;

	private static final String MARKET_ADD_EDIT_PERMISSION = START + LOCATION_HIERARCHY_MARKET_CODE_ADD_EDIT + END;

	private static final String MARKET_MARKUP_VIEW_PERMISSION = START + PRODUCT_PRICING_MARKET_MATERIAL_MAPPING_VIEW + END;

	private static final String MARKET_MARKUP_ADD_EDIT_PERMISSION = START	+ PRODUCT_PRICING_MARKET_MATERIAL_MAPPING_ADD_EDIT + END;
	
	private static final String MARKET_UCP_VIEW_PERMISSION = START + PRODUCT_PRICING_MARKET_UCP_MAPPING_VIEW + END;

	private static final String MARKET_UCP_ADD_EDIT_PERMISSION = START	+ PRODUCT_PRICING_MARKET_UCP_MAPPING_ADD_EDIT + END;
	//@formatter:on

	// Following API's are reflecting for Market Table
	/**
	 * This method will return the list of Market details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<MarketDto>>
	 */
	@ApiOperation(value = "API to get the list of Market details", notes = "This API will get the list of Market details based on **isActive** <br/> if **isActive** is null, then it will get all the results matching the criteria.")
	@GetMapping
	@ApiPageable
	@PreAuthorize(MARKET_VIEW_PERMISSION)
	public PagedRestResponse<List<MarketDto>> listMarket(
			@RequestParam(name = "marketCode", required = false) List<@PatternCheck(regexp = RegExConstants.MARKET_CODE_REGEX) String> marketCodes,
			@RequestParam(required = false) Boolean isActive,
			@RequestParam(name = "isPageable", required = false, defaultValue = "true") Boolean isPageable,
			@ApiIgnore Pageable pageable) {

		return marketService.listMarket(marketCodes, isActive, isPageable, pageable);
	}

	/**
	 * This method will return the Market details based on the marketCode.
	 * 
	 * @param marketCode
	 * @return MarketDto
	 */
	@ApiOperation(value = "API to get the Market details based on the marketCode", notes = "This API will get the Market details based on the **marketCode**")
	@GetMapping(value = "/{marketCode}")
	@PreAuthorize(MARKET_VIEW_PERMISSION)
	public MarketDto getMarket(
			@PathVariable("marketCode") @PatternCheck(regexp = MARKET_CODE_REGEX) String marketCode) {
		return marketService.getMarket(marketCode);
	}

	/**
	 * This method will save the Market details.
	 * 
	 * @param marketDto
	 * @param bindingResult
	 * @return MarketDto
	 */
	@ApiOperation(value = "API to save the Market details", notes = "This API will save the Market details")
	@PostMapping
	@PreAuthorize(MARKET_ADD_EDIT_PERMISSION)
	public MarketDto addMarket(@RequestBody @Valid MarketDto marketDto) {

		return marketService.addMarket(marketDto);
	}

	/**
	 * This method will update the Market details.
	 * 
	 * @param marketCode
	 * @param marketDto
	 * @param bindingResult
	 * @return MarketUpdateDto
	 */
	@ApiOperation(value = "API to update the Market details", notes = "This API will update the Market details")
	@PatchMapping(value = "/{marketCode}")
	@PreAuthorize(MARKET_ADD_EDIT_PERMISSION)
	public MarketDto updateMarket(
			@PathVariable("marketCode") @PatternCheck(regexp = MARKET_CODE_REGEX) String marketCode,
			@RequestBody @Valid MarketUpdateDto marketUpdateDto) {

		return marketService.updateMarket(marketCode, marketUpdateDto);
	}

	// Following API's are reflecting for MarketMarkupMapping Table
	/**
	 * This method will save the Market details.
	 * 
	 * @param marketDto
	 * @param bindingResult
	 * @return MarketMarkupMappingDto
	 */
	@ApiOperation(value = "API to save the Market details", notes = "This API is used to add MarkupFactors to a market, This API will save the Market details")
	@PostMapping(value = "/{marketCode}/metal-types")
	@PreAuthorize(MARKET_MARKUP_ADD_EDIT_PERMISSION)
	public MarketMarkupMappingResponseDto addMarketMarkupMapppingConfig(
			@PathVariable("marketCode") @PatternCheck(regexp = MARKET_CODE_REGEX) String marketCode,
			@RequestBody @Valid MarketMarkupMappingRequestDto marketMateriaDto) {

		return marketService.addMarketMarkupMapping(marketCode, marketMateriaDto);
	}

	/**
	 * This method will update the Market Markup details.
	 * 
	 * @param marketCode
	 * @param marketDto
	 * @param bindingResult
	 * @return MarketMarkupMappingUpdateDto
	 */
	@ApiOperation(value = "API to update the Market details", notes = "This API is used to edit MarkupFactors to a market, This API will update the Market details")
	@PutMapping(value = "/{marketCode}/metal-types")
	@PreAuthorize(MARKET_MARKUP_ADD_EDIT_PERMISSION)
	public MarketMarkupMappingResponseDto updateMarketMarkupMappingConfig(
			@PathVariable("marketCode") @PatternCheck(regexp = MARKET_CODE_REGEX) String marketCode,
			@RequestBody @Valid MarketMarkupMappingRequestDto marketUpdateDto) {

		return marketService.updateMarketMarkupMappping(marketCode, marketUpdateDto);
	}
	
	/**
	 * This method will update amount to be added & amount to be deducted fields to Zero.
	 * 
	 * @param marketCode
	 * @param marketDto
	 * @param bindingResult
	 * @return MarketMarkupMappingUpdateDto
	 */
	@ApiOperation(value = "API to update amount to be added & amount to be deducted fields to Zero for all the records", notes = "This API is used to make it as 0 (zero) for all the 'amount to be added' & 'amount to be deducted' from all the market codes if any")
	@PatchMapping(value = "/metal-types")
	@PreAuthorize(MARKET_MARKUP_ADD_EDIT_PERMISSION)
	public void updateMarketMarkupMappingAmount() {

		 marketService.updateMarketMarkupMappingAmount();
	}

	/**
	 * This method will return the list of Market details based on the isActive.
	 * 
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List<MarketMarkupMappingDto>>
	 */
	@ApiOperation(value = "API to get the list of MarketMarkupMapping ", notes = "This API will get the list of marketMarkupDetails of combination w.r.t marketCode")
	@ApiPageable
	@GetMapping(value = "/metal-types")
	@PreAuthorize(MARKET_MARKUP_VIEW_PERMISSION)

	public PagedRestResponse<List<MarketMarkupListMappingResponseDto>> listMarketMarkupMapping(
			@RequestParam(name = "marketCode", required = false) List<@PatternCheck(regexp = MARKET_CODE_REGEX) String> marketCodes,
			@RequestParam(required = false) Boolean isActive, @ApiIgnore Pageable pageable) {

		return marketService.listMarketMarkupMapping(marketCodes, isActive, pageable);
	}

	/**
	 * This method will return the Market details based on the marketCode.
	 * 
	 * @param marketCode
	 * @return MarketMarkupMappingDto
	 */
	// will be list as
	@ApiOperation(value = "API to get the Market details based on the marketCode", notes = "This API is used while editing particular MarkupFactors to fetch existing markup factors of that market,"
			+ "</br> This API will get the Market details based on the **marketCode**")
	@GetMapping(value = "/{marketCode}/metal-types")
	@PreAuthorize(MARKET_MARKUP_VIEW_PERMISSION)
	public MarketMarkupMappingResponseDto getMarketMarkupMapping(
			@PathVariable("marketCode") @PatternCheck(regexp = MARKET_CODE_REGEX) String marketCode) {
		return marketService.getMarketMarkupMapping(marketCode);
	}

	/**
	 * This method will add UCP price for the market.
	 * 
	 * @param marketUcpPriceMappingDto
	 * @return MarketUcpPriceMappingResponseDto
	 */
	@ApiOperation(value = "API to save the Market UCP price details", notes = "This API is used to add UCP Markup factor to a market.<br>")
	@PostMapping(value = "product-groups")
	@PreAuthorize(MARKET_UCP_ADD_EDIT_PERMISSION)
	public MarketUcpPriceMappingResponseDto addMarketUcpPriceMapping(
			@ApiParam(name = "body", value = "Market UCP price object that needs to be added", required = true) @RequestBody @Valid MarketUcpPriceMappingDto marketUcpPriceMappingDto) {

		return marketService.addMarketUcpPriceMapping(marketUcpPriceMappingDto);
	}

	/**
	 * This method is used to list market UCP price details
	 * 
	 * @param marketCode
	 * @param productGroupCode
	 * @param pageable
	 * @return PagedRestResponse<List<MarketUcpPriceMappingResponseDto>>
	 */
	@ApiPageable
	@ApiOperation(value = "API to list the Market UCP price details", notes = "This API is used to list UCP Markup factor based on filters.<br>")
	@GetMapping(value = "product-groups")
	@PreAuthorize(MARKET_UCP_VIEW_PERMISSION)
	public PagedRestResponse<List<MarketUcpPriceMappingResponseDto>> listMarketUcpPriceMapping(
			@ApiParam(name = "marketCode", value = "Provide to search by 'marketCode'", required = false) @RequestParam(name = "marketCode", required = false) @PatternCheck(regexp = RegExConstants.MARKET_CODE_REGEX) String marketCode,
			@ApiParam(name = "productGroupCode", value = "Provide to search by 'productGroupCode'", required = false) @RequestParam(name = "productGroupCode", required = false) @PatternCheck(regexp = RegExConstants.PRODUCT_GROUP_CODE_REGEX) String productGroupCode,
			@ApiIgnore Pageable pageable) {

		return marketService.listMarketUcpPriceMapping(marketCode, productGroupCode, pageable);
	}

	/**
	 * This method is used to get market UCP price details based on id.
	 * 
	 * @param id
	 * @return MarketUcpPriceMappingResponseDto
	 */
	@ApiOperation(value = "API to get the Market UCP price details", notes = "This API is used get UCP Markup factor based on given id.<br>")
	@GetMapping(value = "product-groups/{id}")
	@PreAuthorize(MARKET_UCP_VIEW_PERMISSION)
	public MarketUcpPriceMappingResponseDto getMarketUcpPriceMapping(
			@ApiParam(name = "id", value = "'id' to get details", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id) {

		return marketService.getMarketUcpPriceMapping(id);
	}

	/**
	 * This method is used to get market UCP price details based on id.
	 * 
	 * @param id
	 * @return MarketUcpPriceMappingResponseDto
	 */
	@ApiOperation(value = "API to update the Market UCP price details", notes = "This API is used update UCP Markup factor based on given id.<br>")
	@PutMapping(value = "product-groups/{id}")
	@PreAuthorize(MARKET_UCP_ADD_EDIT_PERMISSION)
	public MarketUcpPriceMappingResponseDto updateMarketUcpPriceMapping(
			@ApiParam(name = "id", value = "'id' to get details", required = true) @PathVariable("id") @PatternCheck(regexp = RegExConstants.UUID_REGEX, nullCheck = true) String id,
			@ApiParam(name = "body", value = "Market UCP price object that needs to be updated", required = true) @RequestBody @Valid MarketUcpPriceMappingDto marketUcpPriceMappingDto) {

		return marketService.updateMarketUcpPriceMapping(id, marketUcpPriceMappingDto);
	}
}
