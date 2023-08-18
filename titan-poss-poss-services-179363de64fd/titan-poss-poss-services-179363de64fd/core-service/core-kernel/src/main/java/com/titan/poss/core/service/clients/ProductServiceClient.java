/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.service.clients;

import java.util.List;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;

import com.titan.poss.core.domain.constant.RegExConstants;
import com.titan.poss.core.domain.validator.PatternCheck;
import com.titan.poss.core.dto.ConversionItemDto;
import com.titan.poss.core.dto.LotDetailsReqDto;
import com.titan.poss.core.dto.LotDto;
import com.titan.poss.core.dto.LotNumberDetailReqDto;
import com.titan.poss.core.dto.ProductCategoryDto;
import com.titan.poss.core.dto.ProductGroupDto;
import com.titan.poss.core.dto.SchedulerResponseDto;
import com.titan.poss.core.filter.FeignClientInterceptor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@FeignClient(contextId = "productContextId", name = "product-service", configuration = FeignClientInterceptor.class)
public interface ProductServiceClient {

	@GetMapping(value = "/product/v2/lite-data/conversion/{itemCode}")
	ConversionItemDto getItemDetailsForConversionFromProductService(@PathVariable("itemCode") String itemCode,
			@RequestParam(value = "lotNumber", required = false) String lotNumber);

	@PostMapping(value = "product/v2/lot-details")
	Object getLotDetails(@RequestBody(required = true) LotDetailsReqDto lotDetailsReq);
	
	@PutMapping("/update-lot-details")
	public void updateLotStoneDetails(@RequestBody(required= true) LotNumberDetailReqDto lotNumberDetailReqDto);

	@GetMapping(value = "product/v2/jobs/publish-to-datasync")
	public SchedulerResponseDto publishToDataSync(
			@RequestHeader(value = "Authorization", required = true) String authorizationHeader,
			@RequestHeader(value = "Cookie", required = false) String authorizationCookie);

	@GetMapping(value = "product/v2/product-groups/{productGroupCode}")
	ProductGroupDto getProductGroup(@PathVariable("productGroupCode") String productGroupCode);

	@GetMapping(value = "product/v2/lite-data/conversionItem/{itemCode}")
	ConversionItemDto getItemMasterForConversion(@PathVariable("itemCode") String itemCode);

	@GetMapping(value = "product/v2/product-categories/{productCategoryCode}")
	ProductCategoryDto getProductCategory(@PathVariable("productCategoryCode") String productCategoryCode);

	@GetMapping("product/v2/lite-data/conversion/{itemCode}")
	public ConversionItemDto listItems(@PathVariable("itemCode") String itemCode,
			@RequestParam(name = "lotNumber", required = false) String lotNumber);
	
	@PostMapping("product/v2/lot-details/items/lotDto")
	Object getItemsWithItemCodeAndLotNumber(@RequestBody(required = true) List<LotDto> lotDtoList);
	
}