/*  

 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.config.service.impl;

import static com.titan.poss.config.dto.constants.ConfigConstants.RULE_UTIL_SERVICE_IMPL;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.apache.commons.lang.BooleanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.config.dao.RangeMasterDao;
import com.titan.poss.config.dao.RuleIdDao;
import com.titan.poss.config.dao.RuleMasterDao;
import com.titan.poss.config.dao.RuleProductDaoExt;
import com.titan.poss.config.dao.RuleRangeDaoExt;
import com.titan.poss.config.dto.AddRuleProductDto;
import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.request.RuleRequestMappingListDto;
import com.titan.poss.config.dto.response.RuleProductDetailsDto;
import com.titan.poss.config.dto.response.RuleProductDto;
import com.titan.poss.config.dto.response.RuleRangeDetailsDto;
import com.titan.poss.config.dto.response.RuleRangeResponseDto;
import com.titan.poss.config.repository.RangeMasterRepository;
import com.titan.poss.config.repository.RuleMasterRepository;
import com.titan.poss.config.repository.RuleProductMappingRepositoryExt;
import com.titan.poss.config.service.RuleUtilService;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.MapperUtil;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service(RULE_UTIL_SERVICE_IMPL)
@Transactional
public class RuleUtilServiceImpl implements RuleUtilService {

	@Autowired
	RuleMasterRepository ruleMasterRepository;

	@Autowired
	private RangeMasterRepository rangeMasterRepository;

	@Autowired
	RuleProductMappingRepositoryExt ruleProductMappingRepository;

	/**
	 * This method will validate COnfigType and configId.
	 * 
	 * @param ruleType
	 * @param ruleId
	 * @return ConfigurationMasterDao object.
	 */
	@Override
	public RuleMasterDao validateRuleTypeAndRuleId(String ruleType, Integer ruleId) {

		RuleMasterDao ruleMasterDao = ruleMasterRepository.findByRuleIdDaoRuleTypeAndRuleIdDaoRuleId(ruleType, ruleId);

		if (ruleMasterDao == null) {
			throw new ServiceException(ConfigConstants.NO_RULE_DETAILS_FOUND_FOR_THE_REQUESTED_RULE_ID_AND_RULE_TYPE,
					ConfigConstants.ERR_CONFIG_001);
		}

		return setRuleMasterObject(ruleType, ruleId);
	}

	/**
	 * This method will set the ConfigurationMaster Object.
	 * 
	 * @param ruleId
	 * @param ruleType
	 * @return ConfigurationMasterDao
	 */

	@Override
	public RuleMasterDao setRuleMasterObject(String ruleType, Integer ruleId) {

		RuleMasterDao ruleMaster = new RuleMasterDao();

		RuleIdDao ruleDao = new RuleIdDao();
		ruleDao.setRuleId(ruleId);
		ruleDao.setRuleType(ruleType);

		ruleMaster.setRuleIdDao(ruleDao);

		return ruleMaster;

	}

	/**
	 * This method will get ruleIdDetails.
	 * 
	 * @param addRule
	 * @param ruleId
	 * @return ConfigurationProductDao object.
	 */
	@Override
	public RuleProductDaoExt getRuleDetailDao(AddRuleProductDto addRule, String ruleType, Integer ruleId) {

		RuleProductDaoExt ruleProductDao = new RuleProductDaoExt();
		RuleMasterDao ruleMasterDao = setRuleMasterObject(ruleType, ruleId);
		ruleProductDao.setRuleMasterDao(ruleMasterDao);
		ruleProductDao.setProductCategoryCode(addRule.getProductCategoryCode());
		if (ruleType.equals(RuleTypeEnum.RIVAAH_CARD_ELIGIBILITY.name())) {
			Object[] obj = ruleProductMappingRepository.getLatestProductCount();
			if (obj == null || obj.length == 0)
				ruleProductDao.setProductGroupCode("0");
			else
				ruleProductDao.setProductGroupCode(Integer.toString((Integer.parseInt((String) obj[0]) + 1)));
		} else {
			ruleProductDao.setProductGroupCode(addRule.getProductGroupCode());
		}
		if (addRule.getRangeId() != null) {
			ruleProductDao.setRangeId(getRangeMasterDao(addRule.getRangeId()));
		}
		ruleProductDao.setSyncTime(new Date().getTime());
		ruleProductDao.setFieldDetails(MapperUtil.getJsonString(addRule.getRuleDetails()));

		return ruleProductDao;
	}

	/**
	 * This method will create final Response Object of ConfigProductMapping.
	 * 
	 * @param configProductAddList
	 * @param ruleType
	 * @param ruleId
	 * @return ConfigProductDetailsDto object.
	 */
	@Override
	public RuleProductDetailsDto getRuleProductResponse(List<RuleProductDaoExt> ruleProductDaoList, String ruleType,
			Integer ruleId) {
		List<RuleProductDto> ruleProductDtoList = new ArrayList<>();

		RuleProductDetailsDto ruleProductDetailsDto = new RuleProductDetailsDto();
		ruleProductDetailsDto.setRuleId(ruleId);
		ruleProductDetailsDto.setRuleType(ruleType);

		ruleProductDaoList.forEach(ruleProductDao -> {
			RuleProductDto ruleProductDto = (RuleProductDto) MapperUtil.getObjectMapping(ruleProductDao,
					new RuleProductDto());
			ruleProductDto.setProductCategoryCode(ruleProductDao.getProductCategoryCode());
			ruleProductDto.setProductGroupCode(ruleProductDao.getProductGroupCode());
			if (ruleProductDao.getRangeId() != null) {
				ruleProductDto.setRangeId(ruleProductDao.getRangeId().getId());
			}
			ruleProductDto.setRuleDetails(MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(ruleProductDao.getFieldDetails()), JsonData.class));

			ruleProductDtoList.add(ruleProductDto);
		});
		ruleProductDetailsDto.setRules(ruleProductDtoList);

		return ruleProductDetailsDto;
	}

	private RangeMasterDao getRangeMasterDao(String rangeId) {
		RangeMasterDao rangeMaster = rangeMasterRepository.findByIdAndIsActiveTrue(rangeId);
		if (rangeMaster == null) {
			throw new ServiceException(ConfigConstants.NO_RANGE_DETAILS_FOUND, ConfigConstants.ERR_CONFIG_011,
					ConfigConstants.RANGE_ID + rangeId + " & isActive : false");
		}
		return rangeMaster;
	}

	/**
	 * This method will return the list of Configuration Details based on the
	 * configType and filters Applied.
	 * 
	 * @param ruleType
	 * @param configRequestMappingListDto
	 * @return PagedRestResponse<List<ConfigMasterDto>>
	 */
	@Override
	public Page<RuleMasterDao> getRuleTypesBasedOnFilter(String ruleType, RuleRequestMappingListDto ruleReqMapListDto,
			Pageable pageable, Boolean isExactSearch) {

		
		if(ruleReqMapListDto.getDescription()!=null && ruleType != null) {
			if(isExactSearch != null && isExactSearch)
				return ruleMasterRepository.getRule(ruleType,ruleReqMapListDto.getDescription(), pageable);
			else
				return ruleMasterRepository.getList(ruleType, ruleReqMapListDto.getDescription(), pageable);
		}else if(ruleReqMapListDto.getRuleGroup() != null && ruleReqMapListDto.getDescription()!=null) {
			return ruleMasterRepository.getRuleByRuleGroup(ruleReqMapListDto.getRuleGroup(),ruleReqMapListDto.getDescription(),pageable);
		}else if(ruleReqMapListDto.getRuleGroup() != null && ruleReqMapListDto.getRuleType()!=null){
			return ruleMasterRepository.getRuleByRuleGroupAndRuleType(ruleReqMapListDto.getRuleGroup(),ruleReqMapListDto.getRuleType(),pageable);
		}else {
			Map<String, Map<String, String>> queryMap = getQueryBasedOnFilters(ruleReqMapListDto);

			Map<String, String> query = createQuery(ruleType, ruleReqMapListDto, queryMap, pageable);

			System.out.println("query---->" + query);

			return ruleMasterRepository.getRuleDetailsBasedOnFilters(query, pageable);
		}
	}

	/**
	 * The method to append Inclause string.
	 * 
	 * @param inClause.
	 * @return StringBuilder.
	 */
	private StringBuilder appendInClauseString(StringBuilder inClause) {

		if (inClause == null) {
			inClause = new StringBuilder();
		} else {
			inClause.append(",");
		}
		return inClause;

	}

	/**
	 * The method to get the Query based on Location Filter.
	 * 
	 * @param locationCodeList
	 * @return Map object.
	 */
	private Map<String, Map<String, String>> getQueryBasedOnLocationFilters(
			RuleRequestMappingListDto ruleReqMapListDto) {
		Map<String, Map<String, String>> queryMap = new HashMap<>();
		StringBuilder locationCodeInClause = null;
		for (String locCode : ruleReqMapListDto.getLocationCode()) {
			locationCodeInClause = appendInClauseString(locationCodeInClause);
			locationCodeInClause.append("'").append(locCode).append("'");
		}

		String selectQuery = "SELECT clm.rule_type,clm.rule_id  FROM rule_location_mapping clm INNER JOIN ( ";
		String onQuery = "ON clm.rule_type = t1.rule_type AND clm.rule_id = t1.rule_id WHERE clm.location_code IN ("
				+ locationCodeInClause + ")";

		Map<String, String> locationMappingData = new HashMap<>();
		locationMappingData.put(ConfigConstants.SELECT_QUERY, selectQuery);
		locationMappingData.put(ConfigConstants.ON_QUERY, onQuery);
		queryMap.put("locationMapping", locationMappingData);
		return queryMap;
	}

	/**
	 * The method to get the where clause query for ProductGroups.
	 * 
	 * @param productGroupCodes
	 * @param whereClause.
	 * @return StringBuilder Object.
	 */
	private StringBuilder getProductGroupWhereClauseQuery(RuleRequestMappingListDto ruleReqMapListDto,
			StringBuilder whereClause) {
		StringBuilder productGroupCodeInClause = null;
		for (String productGrpCode : ruleReqMapListDto.getProductGroupCode()) {
			productGroupCodeInClause = appendInClauseString(productGroupCodeInClause);
			productGroupCodeInClause.append("'").append(productGrpCode).append("'");
		}

		if (productGroupCodeInClause != null && !productGroupCodeInClause.toString().equals("")) {
			whereClause = new StringBuilder(" WHERE cpm.product_group_code IN (" + productGroupCodeInClause + ") ");
		}
		return whereClause;
	}

	/**
	 * method to get the where clause query for ProductCategorys.
	 * 
	 * @param productCategoryCodes
	 * @param whereClause.
	 * @return StringBuilder Object.
	 */
	private StringBuilder getProductCategoryWhereClause(RuleRequestMappingListDto ruleReqMapListDto,
			StringBuilder whereClause) {
		StringBuilder productCatCodeInClause = null;
		for (String productCatCode : ruleReqMapListDto.getProductCategoryCode()) {
			productCatCodeInClause = appendInClauseString(productCatCodeInClause);
			productCatCodeInClause.append("'").append(productCatCode).append("'");
		}

		if (productCatCodeInClause != null && !productCatCodeInClause.toString().equals("")) {
			if (whereClause == null) {
				whereClause = new StringBuilder(" WHERE ");
			} else {
				whereClause.append(" AND ");
			}

			whereClause.append(" cpm.product_category_code IN (" + productCatCodeInClause + ") ");
		}
		return whereClause;
	}

	/**
	 * method to get Query Based on Filters
	 * 
	 * @param locationCodes
	 * @param productGroupCodes
	 * @param productCategoryCodes
	 * @return Map Object.
	 */
	private Map<String, Map<String, String>> getQueryBasedOnFilters(RuleRequestMappingListDto ruleReqMapListDto) {
		Map<String, Map<String, String>> queryMap = new HashMap<>();

		if (ruleReqMapListDto.getLocationCode() != null && !ruleReqMapListDto.getLocationCode().isEmpty()) {

			queryMap = getQueryBasedOnLocationFilters(ruleReqMapListDto);
		}

		if ((ruleReqMapListDto.getProductGroupCode() != null && !ruleReqMapListDto.getProductGroupCode().isEmpty())
				|| (ruleReqMapListDto.getProductCategoryCode() != null
						&& !ruleReqMapListDto.getProductCategoryCode().isEmpty())) {
			StringBuilder whereClause = null;

			if (ruleReqMapListDto.getProductGroupCode() != null) {

				whereClause = getProductGroupWhereClauseQuery(ruleReqMapListDto, whereClause);

			}

			if (ruleReqMapListDto.getProductCategoryCode() != null) {
				whereClause = getProductCategoryWhereClause(ruleReqMapListDto, whereClause);

			}

			String selectQuery = "SELECT cpm.rule_type,cpm.rule_id FROM rule_product_mapping cpm INNER JOIN (";
			StringBuilder onQuery = new StringBuilder(" ON cpm.rule_type = t1.rule_type AND cpm.rule_id = t1.rule_id ");

			if (whereClause != null) {
				onQuery.append(whereClause);
			}

			Map<String, String> productMappingData = new HashMap<>();
			productMappingData.put(ConfigConstants.SELECT_QUERY, selectQuery);
			productMappingData.put(ConfigConstants.ON_QUERY, onQuery.toString());
			queryMap.put("productMapping", productMappingData);
		}
		return queryMap;

	}

	/**
	 * method to create final Query
	 * 
	 * @param fieldCodes
	 * @return String query.
	 */
	private Map<String, String> createQuery(String ruleType, RuleRequestMappingListDto ruleReqMapListDto,
			Map<String, Map<String, String>> queryMap, Pageable pageable) {
		int active = 1;
		StringBuilder query = new StringBuilder(
				" SELECT cmt.* FROM rule_master cmt INNER JOIN ( SELECT DISTINCT cfm.rule_type, cfm.rule_id FROM rule_master cfm INNER JOIN ( ");
		Map<String, String> productMappingData = queryMap.get("productMapping");
		Map<String, String> locationMappingData = queryMap.get("locationMapping");
		boolean isProductPresent = false;
		boolean isLocationPresent = false;

		if (BooleanUtils.isFalse(ruleReqMapListDto.getIsActive())) {
			active = 0;
		}

		StringBuilder ruleIdQuery = null;
		if (ruleReqMapListDto.getRuleGroup() == null) {
			ruleIdQuery = new StringBuilder(" SELECT cf.rule_type, cf.rule_id, cf.is_active FROM rule_master cf "
					+ "WHERE cf.rule_type = '" + ruleType + "' ");
		} else {
			ruleIdQuery = new StringBuilder(
					" SELECT cf.rule_type, cf.rule_id, cf.is_active FROM rule_master cf WHERE cf.rule_type IN "
							+ "( select rule_type from rule_metadata where rule_group = '"
							+ ruleReqMapListDto.getRuleGroup() + "') ");
		}

		if (ruleReqMapListDto.getIsActive() == null) {
			ruleIdQuery.append(" AND ( cf.is_active = 1 OR cf.is_active = 0 )").append(" ");
		} else {
			ruleIdQuery.append("AND cf.is_active = " + active + "").append(" ");
		}

		if (ruleReqMapListDto.getRuleId() != null && !ruleReqMapListDto.getRuleId().equals(0)) {
			ruleIdQuery.append(" AND cf.rule_id = ").append(ruleReqMapListDto.getRuleId()).append(" ");
		}

		if (productMappingData != null) {
			query.append(productMappingData.get(ConfigConstants.SELECT_QUERY));
			isProductPresent = true;
		}

		if (locationMappingData != null) {
			query.append(locationMappingData.get(ConfigConstants.SELECT_QUERY));
			isLocationPresent = true;
		}

		query.append(ruleIdQuery).append(ConfigConstants.ALIAS);

		if (isLocationPresent) {
			query.append(locationMappingData.get("onQuery")).append(ConfigConstants.ALIAS);
		}

		if (isProductPresent) {
			query.append(productMappingData.get("onQuery")).append(ConfigConstants.ALIAS);
		}

		query.append(" ON cfm.rule_type = t1.rule_type AND cfm.rule_id = t1.rule_id ").append(ConfigConstants.ALIAS);
		query.append("ON cmt.rule_type = t1.rule_type AND cmt.rule_id = t1.rule_id ");

		Map<String, String> resultQueries = new HashMap<>();

		String countQuery = "SELECT COUNT(*) FROM ( " + query + " ) t1";
		resultQueries.put("countQuery", countQuery);

        query.append("ORDER BY cmt.rule_id DESC OFFSET " + pageable.getPageSize() * pageable.getPageNumber()
                + " ROWS FETCH NEXT " + pageable.getPageSize() + " ROWS ONLY");
		resultQueries.put("finalQuery", query.toString());

		return resultQueries;
	}

	@Override
	public RuleRangeResponseDto getRuleRangeResponse(RuleMasterDao ruleMaster, List<RuleRangeDaoExt> ruleRangeDaoList) {

		RuleRangeResponseDto rangeResponseDto = new RuleRangeResponseDto();
		rangeResponseDto.setRuleId(ruleMaster.getRuleIdDao().getRuleId());
		rangeResponseDto.setRuleType(ruleMaster.getRuleIdDao().getRuleType());

		List<RuleRangeDetailsDto> rangeDetailsList = new ArrayList<>();
		ruleRangeDaoList.forEach(rangeDao -> {
			RuleRangeDetailsDto rangeDetail = (RuleRangeDetailsDto) MapperUtil.getObjectMapping(rangeDao,
					new RuleRangeDetailsDto());
			if (rangeDao.getRangeId() != null) {
				rangeDetail.setRangeId(rangeDao.getRangeId().getId());
			}
			rangeDetail.setRuleDetails(MapperUtil.getObjectMapperInstance()
					.convertValue(MapperUtil.getJsonFromString(rangeDao.getRangeDetails()), JsonData.class));

			rangeDetailsList.add(rangeDetail);
		});

		rangeResponseDto.setRules(rangeDetailsList);
		return rangeResponseDto;
	}

}
