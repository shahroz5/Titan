///*  Copyright 2019. Titan Company Limited
//*  All rights reserved.
//*/
//package com.titan.poss.config.service;
//
//import java.util.List;
//
//import org.springframework.data.domain.Pageable;
//
//import com.titan.poss.config.dto.DiscountSlabDto;
//import com.titan.poss.config.dto.response.DiscountSlabResponseDto;
//import com.titan.poss.core.response.ListResponse;
//import com.titan.poss.core.response.PagedRestResponse;
//
///**
// * @author Mindtree Ltd.
// * @version 1.0
// */
//public interface DiscountSlabDetailsService {
//
//	/**
//	 * This method will save the Discount Slab details.
//	 * 
//	 * @param discountSlabDto
//	 * @param discountId
//	 * @return List<DiscountSlabResponseDto>
//	 */
//	ListResponse<DiscountSlabResponseDto> addDiscountSlab(DiscountSlabDto discountSlabDto, String discountId);
//
//	/**
//	 * This method will return the list of discountSlab details based on the
//	 * isActive.
//	 * 
//	 * @param isActive
//	 * @param pageable
//	 * @return PagedRestResponse<List<DiscountSlabDto>>
//	 */
//	PagedRestResponse<List<DiscountSlabDto>> listDiscountSlab(Boolean isActive, Pageable pageable);
//
//}
