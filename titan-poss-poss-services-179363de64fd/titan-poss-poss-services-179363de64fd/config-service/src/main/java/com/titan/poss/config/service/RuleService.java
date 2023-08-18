/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.service;

import static com.titan.poss.config.dto.constants.ConfigConstants.RULE_SERVICE;

import java.util.List;

import javax.validation.Valid;
import javax.validation.constraints.Positive;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.config.dto.RuleProductUpdateDto;
import com.titan.poss.config.dto.request.MappedRuleLocationDto;
import com.titan.poss.config.dto.request.RivaahProductMappingDto;
import com.titan.poss.config.dto.request.RuleLocationUpdateDto;
import com.titan.poss.config.dto.request.RuleMasterUpdateDto;
import com.titan.poss.config.dto.request.RuleRangeDto;
import com.titan.poss.config.dto.request.RuleRequestMappingListDto;
import com.titan.poss.config.dto.request.UpdateMarketMappingDto;
import com.titan.poss.config.dto.response.MarketMappingResponseDto;
import com.titan.poss.config.dto.response.RivaahProductMappingResponse;
import com.titan.poss.config.dto.response.RivaahRuleLocationDto;
import com.titan.poss.config.dto.response.RuleLocationDto;
import com.titan.poss.config.dto.response.RuleMasterDto;
import com.titan.poss.config.dto.response.RuleMasterResponseDto;
import com.titan.poss.config.dto.response.RuleProductDetailsDto;
import com.titan.poss.config.dto.response.RuleRangeResponseDto;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.validator.ValueOfEnum;
import com.titan.poss.core.dto.RivaahLocationFilterDto;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service(RULE_SERVICE)
public interface RuleService {

	/**
	 * This method will create Rules based on the ruleType.
	 * 
	 * @param configMasterDto
	 * @param ruleType
	 * @return ruleMasterDto
	 */
	RuleMasterResponseDto createRules(String ruleType, RuleMasterDto ruleMasterDto);

	/**
	 * This method will get Rules based on the ruleType and ruleId.
	 * 
	 * @param ruleId
	 * @param ruleType
	 * @return ruleMasterDto
	 */
	RuleMasterResponseDto getRuleDetails(String ruleType, Integer ruleId);

	/**
	 * This method will update the Rules details.
	 * 
	 * @param ruleId
	 * @param ruleType
	 * @param ruleMasterUpdateDto
	 * @return ruleMasterUpdateDto
	 */
	RuleMasterResponseDto updateRuleDetails(String ruleType, Integer ruleId, RuleMasterUpdateDto ruleMasterUpdateDto);

	/**
	 * This method will create/remove mapping between Rules and location.
	 * 
	 * @param ruleType
	 * @param ruleNo
	 * @param ruleLocationDto
	 * @return ruleLocationDto
	 */
	RuleLocationUpdateDto ruleLocationMapping(String ruleType, Integer ruleId,
			RuleLocationUpdateDto ruleLocationUpdateDto);

	/**
	 * This method will return the list of location codes which is already present
	 * based on ruleId, based on ruleType,
	 * 
	 * @param includeLocations
	 * @param ruleId
	 * 
	 * @param ruleId
	 * @return List<MappedConfigResponseDto>
	 */
	ListResponse<RuleLocationDto> getMappedLocationCodes(String ruleType, MappedRuleLocationDto ruleLocationDto);

	/**
	 * This method will return the Rules details wrt to a location.
	 * 
	 * @param ruleType
	 * @param ruleId
	 * @return ConfigLocationDto
	 */
	ListResponse<RuleLocationDto> listRuleLocationMapping(String ruleType, Integer ruleId);

	/**
	 * This method will create/remove mapping between Rules and productGroups.
	 * 
	 * @param ruleType
	 * @param ruleId
	 * @param ruleProductGroupCreateDto
	 * @return RuleProductGroupCreateDto
	 */
	RuleProductDetailsDto ruleProductMapping(String ruleType, Integer ruleId,
			RuleProductUpdateDto ruleProductGroupCreateDto);

	/**
	 * This method will return the list of Rules ProductGroup mapping details based
	 * on isActive.
	 * 
	 * @param ruleId
	 * @param ruleType
	 * @param pageable
	 * @param isPageable
	 * @param productGroupCode
	 * @param productCategoryCode
	 * @return ListResponse<RuleProductGroupDto>
	 */
	PagedRestResponse<List<RuleProductDetailsDto>> listRuleProductMapping(String ruleType, Integer ruleId,
			String productGroupCode, String productCategoryCode, Boolean isPageable, Pageable pageable);

	/**
	 * This method will return the list of Rules Details details based on the
	 * ruleType.
	 * 
	 * @param ruleType
	 * @param pageable
	 * @param ruleRequestMappingListDto
	 * @param isLikeSearch
	 * @param configName
	 * @return PagedRestResponse<List<RuleMasterDto>>
	 */
	PagedRestResponse<List<RuleMasterResponseDto>> listRuleDetailsBasedOnFilters(
			RuleRequestMappingListDto ruleRequestMappingListDto, Boolean isExactSearch, Pageable pageable);

	/**
	 * @param ruleId
	 * @param ruleType
	 * @param updateMarketMappingDto
	 * @return
	 */
	ListResponse<MarketMappingResponseDto> updateMarketMapping(Integer ruleId, String ruleType,
			UpdateMarketMappingDto updateMarketMappingDto);

	/**
	 * @param ruleId
	 * @param ruleType
	 * @return
	 */
	ListResponse<MarketMappingResponseDto> listMarketMapping(Integer ruleId, String ruleType);

	/**
	 * @param ruleType
	 * @param ruleId
	 * @param ruleRangeDto
	 * @return
	 */
	RuleRangeResponseDto ruleRangeMapping(@ValueOfEnum(enumClass = RuleTypeEnum.class) String ruleType,
			@Positive Integer ruleId, @Valid RuleRangeDto ruleRangeDto);

	/**
	 * @param ruleType
	 * @param ruleId
	 * @param productGroupCode
	 * @param isPageable
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<RuleRangeResponseDto>> getRuleRangeMapping(
			@ValueOfEnum(enumClass = RuleTypeEnum.class) String ruleType, @Positive Integer ruleId, Boolean isPageable,
			Pageable pageable);

	/**
	 * @param ruleType
	 * @param ruleId
	 * @param productId
	 * @param rivaahProductDto
	 * @return
	 */
	ListResponse<RivaahProductMappingResponse> rivaahProductMapping(String ruleType, Integer ruleId, String productId,
			RivaahProductMappingDto rivaahProductDto);

	/**
	 * @param ruleType
	 * @param ruleId
	 * @param productId
	 * @return
	 */
	ListResponse<RivaahProductMappingResponse> listRivaahProductMapping(String ruleType, Integer ruleId,
			String productId);

	/**
	 * @param ruleType
	 * @param ruleId
	 * @param locationCodeFilter
	 * @param pageable
	 * @return
	 */
	PagedRestResponse<List<RivaahRuleLocationDto>> listRivaahLocationMapping(String ruleType, Integer ruleId,
			RivaahLocationFilterDto locationCodeFilter, Pageable pageable);

}
