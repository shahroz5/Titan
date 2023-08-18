/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.service;

import java.util.List;

import javax.validation.Valid;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.config.dto.FocSchemeDetailDto;
import com.titan.poss.config.dto.FocSchemeDetailsListDto;
import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.request.FocItemMappingRequestDto;
import com.titan.poss.config.dto.request.FocLocationRequestDto;
import com.titan.poss.config.dto.request.FocSchemeAddDto;
import com.titan.poss.config.dto.request.FocSchemeUpdateDto;
import com.titan.poss.config.dto.request.FocUpdateProductDto;
import com.titan.poss.config.dto.response.FocItemMappingResponseDto;
import com.titan.poss.config.dto.response.FocLocationResponseDto;
import com.titan.poss.config.dto.response.FocProductDto;
import com.titan.poss.config.dto.response.FocSchemeDetailResponseDto;
import com.titan.poss.config.dto.response.FocSchemeHeaderDto;
import com.titan.poss.config.dto.response.FocSchemeResponseDto;
import com.titan.poss.core.domain.constant.FocSchemeNameEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Service(ConfigConstants.FOC_SERVICE)
public interface FocService {

	/**
	 * @param focSchemeAddDto
	 * @return
	 */
	FocSchemeResponseDto createScheme(@Valid FocSchemeAddDto focSchemeAddDto);

	/**
	 * @param id
	 * @param focSchemeUpdateDto
	 * @return
	 */
	FocSchemeResponseDto updateScheme(String id, FocSchemeUpdateDto focSchemeUpdateDto);

	/**
	 * @param schemeName
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<FocSchemeHeaderDto>> getAllScheme(String schemeName, Pageable pageable);

	/**
	 * @param id
	 * @param focSchemeDetailDto
	 * @return
	 */
	ListResponse<FocSchemeDetailResponseDto> updateSchemeDetails(String id, FocSchemeDetailDto focSchemeDetailDto);

	/**
	 * @param id
	 * @param pageable
	 * @param offerType
	 * @param itemType
	 * @param category
	 * @param productGroupCode
	 * @return
	 */
	PagedRestResponse<List<FocSchemeDetailsListDto>> getSchemeDetails(String id, Pageable pageable, String category,
			String itemType, String offerType, String productGroupCode);

	/**
	 * @param id
	 * @param focLocationRequestDto
	 * @return
	 */
	ListResponse<FocLocationResponseDto> updateLocation(String id, FocLocationRequestDto focLocationRequestDto);

	/**
	 * @param id
	 * @param locationCode
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<FocLocationResponseDto>> getLocationOnScheme(String id, String locationCode,
			Pageable pageable);

	/**
	 * @param id
	 * @param focItemMappingRequestDto
	 * @return
	 */
	ListResponse<FocItemMappingResponseDto> addFocItem(String id, FocItemMappingRequestDto focItemMappingRequestDto);

	/**
	 * @param id
	 * @param itemCode
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<FocItemMappingResponseDto>> getItem(String id, String itemCode, Pageable pageable);

	/**
	 * @param schemeMasterId
	 * @param schemedetailsId
	 * @param updateProductDto
	 * @return
	 */
	ListResponse<FocProductDto> updateProducts(String schemeMasterId, String schemedetailsId,
			FocUpdateProductDto updateProductDto);

	/**
	 * @param id
	 * @param schemedetailsId
	 * @param category
	 * @param itemType 
	 * @param pageable
	 * @param isPageable
	 * @return
	 */
	PagedRestResponse<List<FocProductDto>> getProducts(String id, String schemedetailsId, String category,
			String itemType, Pageable pageable, Boolean isPageable);

	/**
	 * @param schemeName
	 * @param locationCode
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<FocLocationResponseDto>> getLocationForManualFoc(
			@ValueOfEnum(enumClass = FocSchemeNameEnum.class) String schemeName, String locationCode,
			Pageable pageable);

	/**
	 * @param id
	 * @param schemeName
	 * @return
	 */
	FocSchemeResponseDto getScheme(String id, String schemeName);

	/**
	 * @param focSchemeId
	 */
	void publishFocScheme(String focSchemeId);

}
