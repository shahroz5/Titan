/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.engine.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;

import com.titan.poss.config.dao.DiscountDao;
import com.titan.poss.config.dao.DiscountDetailsDao;
import com.titan.poss.config.dao.DiscountExcludeMappingDao;
import com.titan.poss.config.dao.DiscountLocationMappingDao;
import com.titan.poss.core.discount.dto.AbCoSlabDiscountRequestDto;
import com.titan.poss.core.discount.dto.CummulativeDiscountWithExcludeDto;
import com.titan.poss.core.discount.dto.DiscountBillLevelItemDetailsDto;
import com.titan.poss.core.discount.dto.DiscountDetailsBaseDto;
import com.titan.poss.core.discount.dto.DiscountDto;
import com.titan.poss.core.discount.dto.DiscountItemDetailsDto;
import com.titan.poss.core.discount.dto.DiscountItemDetailsReqDto;
import com.titan.poss.core.discount.dto.DiscountItemLevelRequestDto;
import com.titan.poss.core.discount.dto.DiscountItemLevelResponseDto;
import com.titan.poss.core.discount.dto.DiscountItemsDto;
import com.titan.poss.core.discount.dto.SlabConfigDetails;
import com.titan.poss.core.dto.ApiResponseDto;
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.product.dao.ItemDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("DiscountUtilService")
public interface DiscountUtilService {

	DiscountItemLevelResponseDto createItemLevelDiscountResponse(List<DiscountDao> discountItemList,
			DiscountItemLevelRequestDto discountRequestDto, Date businessDate,
			Map<String, CummulativeDiscountWithExcludeDto> cummulativeDiscountWithExclude);

	ItemDao getItemDetail(String itemCode);

	Map<DiscountDao, List<DiscountItemsDto>> validateDiscountIdWithRequest(List<DiscountDao> validDiscountList,
			List<DiscountItemsDto> itemDetailsList, Date businessDate, String discountType);

	List<DiscountExcludeMappingDao> validateItemCode(String discountId, String itemCode, BigDecimal compelexityPercent,
			BigDecimal makingChargePerGram);

	DiscountDao validateOtherRequestDetails(String discountId, Date businessDate, String productGroupCode,
			String productCategoryCode, String locationCode, String discountType);

	/**
	 * @param couponCodesList
	 * @return ListResponse<DiscountCouponDto>
	 */
	List<String> getValidTSSSCoupons(List<String> couponCodesList);

	DiscountBillLevelItemDetailsDto createBillLevelResponse(DiscountDao discountObject,
			List<DiscountItemsDto> itemDetailList);

	InventoryDetailsDao validateBestDealDiscountType(DiscountDao discountDao, String itemCode, String lotNumber,
			Date businessDate);

	List<DiscountExcludeMappingDao> validateItemCodeForDiscountList(List<String> employeeDiscountIds, String itemCode,
			BigDecimal compelexityPercent, BigDecimal makingChargePerGram);

	List<DiscountDao> validateOtherRequestDetailsForDiscountList(List<String> employeeDiscountIds, Date businessDate,
			String productGroupCode, String productCategoryCode, String locationCode);

	List<DiscountDao> validateItemDetailsFromRequest(List<DiscountDao> validDiscountIds,
			DiscountItemDetailsDto itemDetails, Date businessDate, String locationCode, boolean empowermentDiscount);

	List<DiscountDetailsDao> validateItemRequestDetails(String discountId, Date businessDate,
			DiscountItemDetailsReqDto itemDetail, boolean throwException, boolean empowermentDiscount, Date endDate,
			Integer offerGrace);

	Boolean validateItemRequestDetailsForAbToCmCumulativeDiscount(DiscountItemDetailsReqDto itemDetail,
			AbCoSlabDiscountRequestDto abCoSlabDiscountRequestDto);

	/**
	 * @param validDiscountObj
	 * @param discountDetailsBaseDto
	 * @param businessDate
	 * @return DiscountDetailsBaseDto
	 */
	DiscountDetailsBaseDto setDiscountConfigDetails(DiscountDao validDiscountObj,
			DiscountDetailsBaseDto discountDetailsBaseDto, Date businessDate, SlabConfigDetails slabConfigDetails);

	/**
	 * @param httpMethod
	 * @param relativeUrl
	 * @param requestParamters
	 * @param requestBody
	 * @return
	 */
	ApiResponseDto callEPOSSAPIThroughIntegration(HttpMethod httpMethod, String relativeUrl,
			Map<String, String> requestParamters, Object requestBody);

	DiscountLocationMappingDao getDiscountLocationMapping(String discountId);

	List<DiscountDao> validateOtherRequestDetailsForEmpowermentDiscountList(List<String> employeeDiscountIds,
			String productGroupCode, String productCategoryCode, String locationCode);

	DiscountDao mapDiscountDao(DiscountDto discountDto);

	DiscountDto mapDiscountDto(DiscountDao discountDao);
}
