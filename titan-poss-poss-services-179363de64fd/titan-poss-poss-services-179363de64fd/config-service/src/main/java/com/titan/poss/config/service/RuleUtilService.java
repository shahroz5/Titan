/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.service;

import static com.titan.poss.config.dto.constants.ConfigConstants.RULE_UTIL_SERVICE;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.config.dao.RuleMasterDao;
import com.titan.poss.config.dao.RuleProductDaoExt;
import com.titan.poss.config.dao.RuleRangeDaoExt;
import com.titan.poss.config.dto.AddRuleProductDto;
import com.titan.poss.config.dto.request.RuleRequestMappingListDto;
import com.titan.poss.config.dto.response.RuleProductDetailsDto;
import com.titan.poss.config.dto.response.RuleRangeResponseDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service(RULE_UTIL_SERVICE)
public interface RuleUtilService {

	/**
	 * This method will return the list of rule Details based on the ruleType and
	 * filters Applied.
	 * 
	 * @param ruleType
	 * @param isExactSearch 
	 * @param ruleRequestMappingListDto
	 * @return PagedRestResponse<List<ruleMasterDto>>
	 */
	Page<RuleMasterDao> getRuleTypesBasedOnFilter(String ruleType, RuleRequestMappingListDto ruleReqMapListDto,
			Pageable pageable, Boolean isExactSearch);

	/**
	 * This method will validate ruleType and ruleId.
	 * 
	 * @param ruleType
	 * @param ruleId
	 * @return ruleMasterDao object.
	 */
	RuleMasterDao validateRuleTypeAndRuleId(String ruleType, Integer ruleId);

	/**
	 * This method will set ruleMasterObject.
	 * 
	 * @param ruleType
	 * @param ruleId
	 * @return ruleMasterDao object.
	 */
	RuleMasterDao setRuleMasterObject(String ruleType, Integer ruleId);

	/**
	 * This method will get ruleDetails.
	 * 
	 * @param addrule
	 * @param ruleId
	 * @param slabList 
	 * @return ruleProductDao object.
	 */
	RuleProductDaoExt getRuleDetailDao(AddRuleProductDto addrule, String ruleType, Integer ruleId);

	/**
	 * This method will create final Response Object of ruleProductMapping.
	 * 
	 * @param ruleProductAddList
	 * @param ruleType
	 * @param ruleId
	 * @return ruleProductDetailsDto object.
	 */
	RuleProductDetailsDto getRuleProductResponse(List<RuleProductDaoExt> ruleProductAddList, String ruleType,
			Integer ruleId);

	RuleRangeResponseDto getRuleRangeResponse(RuleMasterDao ruleMaster, List<RuleRangeDaoExt> ruleProductAddList);

}
