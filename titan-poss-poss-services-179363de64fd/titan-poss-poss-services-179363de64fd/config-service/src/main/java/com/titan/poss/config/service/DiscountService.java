/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.config.service;

import java.util.List;

import javax.validation.Valid;

import org.springframework.core.io.Resource;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import com.titan.poss.config.dto.ClubDiscountResponseDto;
import com.titan.poss.config.dto.DiscountCouponUpdateResponseDto;
import com.titan.poss.config.dto.LinkDiscountResponseDto;
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
import com.titan.poss.core.discount.dto.CouponDto;
import com.titan.poss.core.discount.dto.DiscountDto;
import com.titan.poss.core.dto.DiscountApproveRequestDto;
import com.titan.poss.core.dto.DiscountApproveResponseDto;
import com.titan.poss.core.dto.DiscountCouponDto;
import com.titan.poss.core.dto.ItemGroupMappingDto;
import com.titan.poss.core.dto.LocationCodeFilterDto;
import com.titan.poss.core.dto.TSSSCouponRedeemDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface DiscountService {

	/**
	 * This method will return the list of Discount details based on the isActive.
	 * 
	 * @param status
	 * @param discountType
	 * @param discountCode
	 * @param isPageable
	 * @param isActive
	 * @param publishStatus
	 * @param pageable
	 * @return PagedRestResponse<List<DiscountListResponseDto>>
	 */
	PagedRestResponse<List<DiscountListResponseDto>> listDiscount(String status, String discountCode, String occasion,
			String discountType, String clubbingDiscountType, Boolean isPageable, Boolean isActive,
			String publishStatus, Pageable pageable);

	/**
	 * This method will return the Discount details based on the discountId.
	 * 
	 * @param discountId
	 * @param processId
	 * @return DiscountResponseDto
	 */

	DiscountResponseDto getDiscount(String discountId, String processId);

	/**
	 * This method will save the Discount details.
	 * 
	 * @param discountDto
	 * @return
	 */
	DiscountResponseDto createDiscount(@Valid DiscountDto discountDto);

	/**
	 * This method will update the Discount details.
	 * 
	 * @param discountId
	 * @param typeOfRequest
	 * @param requestStatus
	 * @param discountUpdateDto
	 * @return DiscountResponseDto
	 */
	DiscountResponseDto updateDiscount(String discountId, String requestStatus, String typeOfRequest,
			DiscountUpdateDto discountUpdateDto);

	/**
	 * This method will create/remove mapping between discount and location.
	 * 
	 * @param discountCode
	 * @param discountLocationDto
	 * @return DiscountLocationDto
	 */
	ListResponse<DiscountLocationResponseDto> discountLocationMapping(String discountId,
			DiscountLocationDto discountLocationDto);

	/**
	 * This method will create/remove mapping between discount and productGroup.
	 * 
	 * @param discountCode
	 * @param discountProductGroupDto
	 * @param discountDetailId
	 * @param karatType
	 * @param productType
	 * @return DiscountProductGroupDto
	 */
	ListResponse<DiscountProductDto> discountProductGroupMapping(String discountCode,
			DiscountProductGroupDto discountProductGroupDto, String discountDetailId, String karatType,
			String productType);

	/**
	 * @param discountId
	 * @param productGroupCodeList
	 * @param discountDetailsId
	 * @param discountDetailsId2
	 * @param isPageable
	 * @param discountDetailsId2
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<DiscountProductDto>> listDiscountProductGroupMapping(String discountId,
			List<String> productGroupCodeList, String kartType, String productGroupType, String discountDetailsId,
			Boolean isPageable, Pageable pageable);

	/**
	 * @param discountId
	 * @param discountThemeRequestDto
	 * @return
	 */
	ListResponse<DiscountThemeUpdateResponseDto> updateTheme(String discountId, String excludeType,
			@Valid DiscountThemeRequestDto discountThemeRequestDto);

	/**
	 * @param discountId
	 * @param itemThemeUpdateDto
	 * @return
	 */
	ListResponse<ItemThemeUpdateResponseDto> updateItemThemeMapping(String discountId,
			@Valid ItemThemeUpdateDto itemThemeUpdateDto);

	/**
	 * @param excludeType
	 * @param excludeType2
	 * @param updateRangeDto
	 * @return
	 */
	ListResponse<DiscountExcludeMappingRangeDto> updateMakingChargeOrComplexityPercent(String discountId,
			String excludeType, UpdateRangeDto updateRangeDto);

	/**
	 * @param discountId
	 * @param productCategoryUpdateDto
	 * @return
	 */
	ListResponse<ProductCategoryUpdateResponseDto> updateProductCategory(String discountId,
			ProductCategoryUpdateDto productCategoryUpdateDto);

	/**
	 * @param discountId
	 * @param productCategoryCode
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<ProductCategoryResponseDto>> listProductCategory(String discountId,
			String productCategoryCode, Boolean isPageable, Pageable pageable);

	/**
	 * @param discountId
	 * @param excludeType
	 * @param isExcluded
	 * @param itemCode
	 * @param pageable
	 * @param isPageable
	 * @return
	 */
	PagedRestResponse<List<ItemThemeMappingDto>> listItemThemeMapping(String discountId, String excludeType,
			Boolean isExcluded, String itemCode, Pageable pageable, Boolean isPageable);

	/**
	 * This method will save the Discount Slab details.
	 * 
	 * @param discountSlabDto
	 * @param discountId
	 * @return List<DiscountSlabResponseDto>
	 */
	ListResponse<DiscountDetailsUpdateResponseDto> updateDiscountDetails(DiscountDetailsDto discountDetailsDto,
			String discountId);

	/**
	 * @param discountId
	 * @param discountCategory
	 * @param productGroupCodes
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<DiscountDetailsResponseDto>> listDiscountDetails(String discountId, String discountCategory,
			List<String> productGroupCodes, Pageable pageable);

	/**
	 * @param updateClubDiscountRequestDto
	 * @return
	 */
	ListResponse<ClubDiscountResponseDto> updateClubDiscount(
			@Valid UpdateClubDiscountRequestDto updateClubDiscountRequestDto);

	/**
	 * @param isPageable
	 * @param discountId
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<ClubDiscountResponseDto>> listClubbedDiscount(String discountCode, Pageable pageable,
			Boolean isPageable);

	/**
	 * @param discountId
	 * @return
	 */
	PagedRestResponse<List<ItemGroupMappingDto>> listItemGroupMapping(String discountId, Pageable pageable);

	ListResponse<DiscountDetailsUpdateResponseDto> updateSlabDetails(String discountId,
			@Valid DiscountSlabDetailsDto discountSlabDetailsDto);

	/**
	 * @param discountId
	 * @param b
	 */
	void publishDiscount(String discountId, boolean b);

	ListResponse<LinkDiscountResponseDto> linkDiscounts(String discountId,
			@Valid LinkDiscountRequestDto linkDiscountRequestDto);

	PagedRestResponse<List<LinkDiscountResponseDto>> listLinkedDiscounts(String discountId, Pageable pageable);

	/**
	 * @param discountId
	 * @param discountLocationDto
	 * @return DiscountCouponResponseDto
	 */
	DiscountCouponResponseDto generateDiscountCoupons(String discountId, DiscountCouponRequestDto requestDto);

	/**
	 * @param discountId
	 * @param requestDto
	 * @return
	 */
	ListResponse<DiscountCouponUpdateResponseDto> updateDiscountCoupons(TSSSCouponRedeemDto requestDto);

	/**
	 * @param requestDto
	 * @return
	 */
	ListResponse<DiscountCouponDto> getDiscountCoupons(CouponDto requestDto);

	/**
	 * @param discountId
	 * @return
	 */
	ResponseEntity<Resource> downloadDiscountCoupons(String discountId);

	/**
	 * @param discountId
	 * @param locationCodeFilter
	 * @param status
	 * @param isPageable
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<DiscountLocationResponseDto>> listDiscountLocationMapping(String discountId,
			@Valid LocationCodeFilterDto locationCodeFilter, Boolean status, Boolean isPageable, Pageable pageable);

	/**
	 * @param discountId
	 * @param excludeType
	 * @param discountSchemeRequestDto
	 * @return
	 */
	ListResponse<DiscountSchemeUpdateResponseDto> updateScheme(String discountId, String excludeType,
			DiscountSchemeRequestDto discountSchemeRequestDto);

	/**
	 * @param discountId
	 * @param typeOfRequest
	 * @param discountRequestDto
	 * @return
	 */
	DiscountRaiseResponseDto raiseDiscountCreationRequest(String discountId, String typeOfRequest,
			@Valid DiscountRaiseRequestDto discountRequestDto);

	/**
	 * @param discountId
	 * @param approvalStatus
	 * @param discountRequestDto
	 * @return
	 */
	DiscountApproveResponseDto approveDiscountCreationRequest(
			String discountId, String approvalStatus, @Valid DiscountApproveRequestDto discountRequestDto);


}
