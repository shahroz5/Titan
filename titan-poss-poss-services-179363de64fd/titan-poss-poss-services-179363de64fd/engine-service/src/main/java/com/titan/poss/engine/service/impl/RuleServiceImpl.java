/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/

package com.titan.poss.engine.service.impl;

import java.io.IOException;
import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;

import org.apache.commons.lang.BooleanUtils;
import org.apache.commons.lang.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.config.dao.RivaahProductMappingDao;
import com.titan.poss.config.dao.RuleIdDao;
import com.titan.poss.config.dao.RuleLocationMappingDao;
import com.titan.poss.config.dao.RuleMasterDao;
import com.titan.poss.config.dao.RuleMetadataDao;
import com.titan.poss.config.dao.RuleProductDao;
import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.constants.RangeTypeEnum;
import com.titan.poss.config.dto.request.json.WeightTolRuleDetails;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.dto.RivaahCardCouponDetails;
import com.titan.poss.core.dto.RivaahEligibilityProductMappingDetails;
import com.titan.poss.core.dto.RuleRequestListDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.engine.config.repository.RivaahProductMappingRepositoryExt;
import com.titan.poss.engine.config.repository.RuleLocationMappingRepositoryExt;
import com.titan.poss.engine.config.repository.RuleMasterRepository;
import com.titan.poss.engine.config.repository.RuleMetadataRepositoryExt;
import com.titan.poss.engine.config.repository.RuleProductMappingRepositoryExt;
import com.titan.poss.engine.sales.repository.BusinessDayRepositoryExt;
import com.titan.poss.engine.service.RuleService;
import com.titan.poss.sales.constants.DayActivityStatusEnum;
import com.titan.poss.sales.dao.BusinessDayDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class RuleServiceImpl implements RuleService {

	@Autowired
	RuleMasterRepository ruleMasterRepository;

	@Autowired
	RuleMetadataRepositoryExt ruleMetadataRepository;

	@Autowired
	private RuleLocationMappingRepositoryExt ruleLocationRepo;

	@Autowired
	private RuleProductMappingRepositoryExt ruleProductRepo;

	@Autowired
	private RivaahProductMappingRepositoryExt rivaahRuleRepo;

	@Autowired
	private BusinessDayRepositoryExt businessDayRepo;
	
	private static final String UNABLE_TO_PARSE_JSON = "Unable to parse json data";

	private static final String ERR_CORE_003 = "ERR-CORE-003";

	private static final Logger logger = LoggerFactory.getLogger(RuleServiceImpl.class);

	/**
	 * The method returns configurations set for a ruleType depending on filters.
	 * 
	 * @param ruleType
	 * @param filters
	 */
	@Override
	@Transactional
	public Object ruleValueMappingListBasedOnFilters(String ruleType, RuleRequestListDto ruleRequestListDto) {
		RuleMetadataDao ruleMetadataDao = ruleMetadataRepository.findByRuleType(ruleType);
		if (ruleMetadataDao != null) {
			if (ruleType.equals(RuleTypeEnum.RIVAAH_CARD_ELIGIBILITY.name())) {
				return rivaahRuleDetails(ruleType, ruleRequestListDto);
			} else {
				validateFieldsAgainstMetadata(ruleRequestListDto, ruleType);
				Map<String, Map<String, String>> queryMap = getQueryBasedOnFilters(ruleRequestListDto, ruleMetadataDao);
				String query = createFinalQuery(ruleType, queryMap, ruleRequestListDto);

				logger.debug("final generated Query - {}", query);
				List<Object[]> responseList = ruleMasterRepository.getValueListBasedOnFilters(query);

				if (responseList == null || responseList.isEmpty()) {
					Map<String, String> dynamicErrorValues = new HashMap<>();
					dynamicErrorValues.put("ruleType", ruleType);

					throw new ServiceException(ConfigConstants.RESULT_IS_EMPTY_PLEASE_SET_CONFIGURATION,
							ConfigConstants.ERR_CONFIG_015, ruleType, dynamicErrorValues);
				}
				return getResponse(responseList, ruleType);
			}

		} else {
			throw new ServiceException(ConfigConstants.NO_METADATA_FOUND_FOR_RULE_TYPE + ruleType + "",
					ConfigConstants.ERR_CONFIG_014, ruleType, Map.of("ruleType", ruleType));
		}

	}

	private Object rivaahRuleDetails(String ruleType, RuleRequestListDto ruleRequestListDto) {
		RuleLocationMappingDao location = ruleLocationRepo.findOneByRuleMasterDaoRuleIdDaoRuleTypeAndLocationCode(
				RuleTypeEnum.RIVAAH_CARD_ELIGIBILITY.name(), ruleRequestListDto.getLocationCode());
		List<BusinessDayDao> businessDayList = businessDayRepo.findByStatusInAndLocationCode(
				Arrays.asList(DayActivityStatusEnum.OPEN.name(), DayActivityStatusEnum.EOD_IN_PROGRESS.name()),
				ruleRequestListDto.getLocationCode());

		if (location != null && !businessDayList.get(0).getBusinessDate().before(location.getOfferStartDate())
				&& !businessDayList.get(0).getBusinessDate().after(location.getOfferEndDate())) {
			if (BooleanUtils.isTrue(ruleRequestListDto.getIsRivaah())) {
				RuleIdDao rule = new RuleIdDao();
				rule.setRuleId(1);
				rule.setRuleType(RuleTypeEnum.RIVAAH_CARD_ELIGIBILITY.name());
				Optional<RuleMasterDao> ruleMaster = ruleMasterRepository.findById(rule);
				if (ruleMaster.isPresent() && ruleMaster.get().getRuleDetails() != null) {
					JsonData couponJsonData = MapperUtil.getObjectMapperInstance().convertValue(
							MapperUtil.getJsonFromString(ruleMaster.get().getRuleDetails()), JsonData.class);
					return MapperUtil.mapObjToClass(couponJsonData.getData(), RivaahCardCouponDetails.class);
				}
			} else {
				List<RivaahEligibilityProductMappingDetails> eligibilityList = new ArrayList<>();
				List<RuleProductDao> ruleProducts = ruleProductRepo.findByRuleTypeAndRuleIdAndProductCategoryCode(
						ruleType, 1, ruleRequestListDto.getProductCategoryCode());
				if (!CollectionUtils.isEmpty(ruleProducts)) {
					for (RuleProductDao ruleProduct : ruleProducts) {
						if (ruleProduct.getProductCategoryCode()
								.equalsIgnoreCase(ruleRequestListDto.getProductCategoryCode())) {
							List<RivaahProductMappingDao> rivaahProduct = rivaahRuleRepo
									.findAllByProductMap(ruleProduct.getId());
							if (!CollectionUtil.isEmpty(rivaahProduct)) {
								List<String> productGroupCodes = new ArrayList<>();
								rivaahProduct.forEach(rivaah -> productGroupCodes.add(rivaah.getProductGroupCode()));
								if (productGroupCodes.contains(ruleRequestListDto.getProductGroupCode())
										&& ruleProduct.getFieldDetails() != null) {
									JsonData eligibilityJsonData = MapperUtil.getObjectMapperInstance().convertValue(
											MapperUtil.getJsonFromString(ruleProduct.getFieldDetails()),
											JsonData.class);
									eligibilityList.add(MapperUtil.mapObjToClass(eligibilityJsonData.getData(),
											RivaahEligibilityProductMappingDetails.class));
								}
							}
						}
					}
				}
				return eligibilityList;
			}
		}
		return new Object();
	}

	/**
	 * The method to create Response Object
	 * 
	 * @param ruleMetadataDao
	 * @param ruleType2
	 * 
	 * @param List<Object[]>
	 */
	private Object getResponse(List<Object[]> responseList, String ruleType) {

		Object response = null;

		Map<String, String> dynamicErrorValues = new HashMap<>();
		dynamicErrorValues.put("ruleType", ruleType);

		if (!CollectionUtils.isEmpty(responseList)) {

			if (responseList.size() > 1) {
				throw new ServiceException(
						ConfigConstants.MULTIPLE_CONFIGS_PRESENT_FOR_RULETYPE + ruleType + "Please verify Data.",
						ConfigConstants.ERR_CONFIG_071, responseList.size(), dynamicErrorValues);
			}

			for (Object[] value : responseList) {
				JsonData jsonData = MapperUtil.getObjectMapperInstance()
						.convertValue(MapperUtil.getJsonFromString((String) value[2]), JsonData.class);

				if (jsonData.getData() != null) {
					response = MapperUtil.getObjectMapperInstance().convertValue(jsonData.getData(), Object.class);
				}
			}

		} else {
			throw new ServiceException(ConfigConstants.NO_RULE_DETAILS_PRESENT_FOR_RULETYPE + ruleType + "",
					ConfigConstants.ERR_CONFIG_016, ruleType, dynamicErrorValues);
		}

		return response;
	}

	/**
	 * method to create final Query
	 * 
	 * @param ruleRequestListDto
	 * 
	 * @param fieldCodes
	 * @return String query.
	 */
	private String createFinalQuery(String ruleType, Map<String, Map<String, String>> queryMap,
			RuleRequestListDto ruleRequestListDto) {
		Map<String, String> productMappingData = queryMap.get("productMapping");
		Map<String, String> locationMappingData = queryMap.get("locationMapping");
		Map<String, String> marketMappingData = queryMap.get("marketMapping");
		boolean isProductPresent = false;
		boolean isLocationPresent = false;
		boolean isMarketPresent = false;

		StringBuilder query = new StringBuilder();

		RuleMetadataDao ruleMetadataDao = ruleMetadataRepository.findByRuleType(ruleType);
		if (ruleMetadataDao != null) {

			if (ruleMetadataDao.getProductLevelValue()) {

				createProductLevelQuery(query, productMappingData, locationMappingData, ruleType, isLocationPresent,
						ruleRequestListDto);
			}

			else if (ruleMetadataDao.getHeaderLevelValue()) {

				createHeaderLevelQuery(query, productMappingData, locationMappingData, ruleType, isLocationPresent,
						isProductPresent, isMarketPresent, marketMappingData);

			} else if (ruleMetadataDao.getRangeLevelValue()) {

				createRangeLevelQuery(query, productMappingData, locationMappingData, ruleType, isLocationPresent,
						isProductPresent, ruleRequestListDto, isMarketPresent, marketMappingData);

			}

			return query.toString();
		}
		throw new ServiceException(ConfigConstants.NO_METADATA_FOUND_FOR_RULE_TYPE, ConfigConstants.ERR_CONFIG_014,
				ruleType);
	}

	/**
	 * @param query
	 * @param productMappingData
	 * @param locationMappingData
	 * @param ruleType
	 * @param isLocationPresent
	 * @param isProductPresent
	 * @param isRangePresent
	 * @param ruleRequestListDto
	 * @param rangeMappingData
	 * @param marketMappingData
	 * @param isMarketPresent
	 */
	private StringBuilder createRangeLevelQuery(StringBuilder query, Map<String, String> productMappingData,
			Map<String, String> locationMappingData, String ruleType, boolean isLocationPresent,
			boolean isProductPresent, RuleRequestListDto ruleRequestListDto, boolean isMarketPresent,
			Map<String, String> marketMappingData) {

		query.append(
				"SELECT DISTINCT cv.rule_type,cv.rule_id,cv.range_details FROM rule_range_mapping cv INNER JOIN ( ");

		if (productMappingData != null) {
			query.append(productMappingData.get(ConfigConstants.SELECT_QUERY));
			isProductPresent = true;
		}

		if (locationMappingData != null) {
			query.append(locationMappingData.get(ConfigConstants.SELECT_QUERY));
			isLocationPresent = true;
		}

		if (marketMappingData != null) {
			query.append(marketMappingData.get(ConfigConstants.SELECT_QUERY));
			isMarketPresent = true;
		}

		StringBuilder rangeValueQuery = new StringBuilder(
				"SELECT rrm.rule_id, rrm.rule_type from rule_range_mapping rrm "
						+ "INNER JOIN range_master rm on rrm.range_id = rm.id where ('"
						+ ruleRequestListDto.getInputValue()
						+ "' BETWEEN rm.from_range AND rm.to_range) AND rrm.rule_type = '" + ruleType
						+ "' AND rm.range_type = '" + ruleRequestListDto.getRangeType() + "'");

		String metalType = null;
		if (ruleRequestListDto.getMetalType() != null) {
			metalType = ruleRequestListDto.getMetalType();
			rangeValueQuery.append("AND  rrm.metal_type = '" + ruleRequestListDto.getMetalType() + "'");

		}

		query.append(rangeValueQuery).append(ConfigConstants.ALIAS);

		if (isMarketPresent && marketMappingData != null) {
			query.append(marketMappingData.get(ConfigConstants.ON_QUERY)).append(ConfigConstants.ALIAS);
		}

		if (isLocationPresent && locationMappingData != null) {
			query.append(locationMappingData.get(ConfigConstants.ON_QUERY)).append(ConfigConstants.ALIAS);
		}

		if (isProductPresent && productMappingData != null) {
			query.append(productMappingData.get(ConfigConstants.ON_QUERY)).append(ConfigConstants.ALIAS);
		}

		query.append(
				" ON cv.rule_type = t1.rule_type AND cv.rule_id = t1.rule_id INNER JOIN rule_master rm ON rm.rule_type = cv.rule_type AND rm.rule_id = cv.rule_id "

						+ " INNER JOIN range_master rmm ON cv.range_id = rmm.id where rm.is_active = 1  AND rmm.range_type = '"
						+ ruleRequestListDto.getRangeType() + "' AND (cv.metal_type='" + metalType
						+ "' OR cv.metal_type IS NULL) AND  (" + ruleRequestListDto.getInputValue()
						+ " BETWEEN  rmm.from_range AND rmm.to_range)");

		return query;

	}

	/**
	 * This method creates RuleValueMapQuery
	 * 
	 * @param query
	 * @param productMappingData
	 * @param locationMappingData
	 * @param ruleType
	 * @param isLocationPresent
	 * @param fieldCodes
	 * @param isProductPresent
	 * @param rangeMappingData
	 * @param isRangePresent
	 * @param marketMappingData
	 * @param isMarketPresent
	 */
	private void createHeaderLevelQuery(StringBuilder query, Map<String, String> productMappingData,
			Map<String, String> locationMappingData, String ruleType, boolean isLocationPresent,
			boolean isProductPresent, boolean isMarketPresent, Map<String, String> marketMappingData) {
		query.append("SELECT DISTINCT cv.rule_type,cv.rule_id,cv.rule_details FROM rule_master cv INNER JOIN ( ");

		StringBuilder ruleValueQuery = new StringBuilder(" SELECT cvm.rule_type, cvm.rule_id FROM rule_master cvm "
				+ "WHERE cvm.rule_type = '" + ruleType + "' AND cvm.is_active='TRUE'");

		if (productMappingData != null) {
			query.append(productMappingData.get(ConfigConstants.SELECT_QUERY));
			isProductPresent = true;
		}

		if (locationMappingData != null) {
			query.append(locationMappingData.get(ConfigConstants.SELECT_QUERY));
			isLocationPresent = true;
		}

		if (marketMappingData != null) {
			query.append(marketMappingData.get(ConfigConstants.SELECT_QUERY));
			isMarketPresent = true;
		}

		query.append(ruleValueQuery).append(ConfigConstants.ALIAS);

		if (isMarketPresent && marketMappingData != null) {
			query.append(marketMappingData.get(ConfigConstants.ON_QUERY)).append(ConfigConstants.ALIAS);
		}

		if (isLocationPresent && locationMappingData != null) {
			query.append(locationMappingData.get(ConfigConstants.ON_QUERY)).append(ConfigConstants.ALIAS);
		}

		if (isProductPresent && productMappingData != null) {
			query.append(productMappingData.get(ConfigConstants.ON_QUERY)).append(ConfigConstants.ALIAS);
		}

		query.append(" ON cv.rule_type = t1.rule_type AND cv.rule_id = t1.rule_id ");

	}

	/**
	 * This method creates RuleProductMappingQuery
	 * 
	 * @param query
	 * @param productMappingData
	 * @param locationMappingData
	 * @param ruleType
	 * @param isLocationPresent
	 * @param ruleRequestListDto
	 * @param fieldCodes
	 * @param isProductPresent
	 */
	private StringBuilder createProductLevelQuery(StringBuilder query, Map<String, String> productMappingData,
			Map<String, String> locationMappingData, String ruleType, boolean isLocationPresent,
			RuleRequestListDto ruleRequestListDto) {
		query.append(
				"SELECT DISTINCT cv.rule_type,cv.rule_id,cv.field_details FROM rule_product_mapping cv INNER JOIN ( ");

		StringBuilder productValueQuery = new StringBuilder(
				" SELECT cpm.rule_type,cpm.rule_id, cpm.field_details FROM rule_product_mapping cpm ");

		if (ruleRequestListDto.getInputValue() != null) {
			productValueQuery.append("INNER JOIN range_master rm on cpm.range_id = rm.id ");
		}

		if (productMappingData != null) {
			productValueQuery.append(productMappingData.get(ConfigConstants.WHERE_QUERY)).append(" AND ");
		} else {
			productValueQuery.append(" WHERE ");
		}

		productValueQuery.append(" cpm.rule_type = '" + ruleType + "' ");

		if (ruleRequestListDto.getInputValue() != null) {
			productValueQuery.append("AND ('" + ruleRequestListDto.getInputValue()
					+ "'  between rm.from_range AND rm.to_range AND rm.range_type = '"
					+ ruleRequestListDto.getRangeType() + "')");
		}

		if (locationMappingData != null) {
			query.append(locationMappingData.get(ConfigConstants.SELECT_QUERY));
			isLocationPresent = true;
		}

		query.append(productValueQuery).append(ConfigConstants.ALIAS);

		if (isLocationPresent && locationMappingData != null) {
			query.append(locationMappingData.get(ConfigConstants.ON_QUERY)).append(ConfigConstants.ALIAS);
		}

		StringBuilder productString = null;
		if (ruleRequestListDto.getProductGroupCode() != null && !ruleRequestListDto.getProductGroupCode().equals("")) {
			productString = new StringBuilder(
					" AND cv.product_group_code = '" + ruleRequestListDto.getProductGroupCode() + "' ");
			if (ruleRequestListDto.getProductCategoryCode() != null
					&& !ruleRequestListDto.getProductCategoryCode().equals("")) {
				productString = productString.append(
						" AND cv.product_category_code = '" + ruleRequestListDto.getProductCategoryCode() + "' ");
			}
		}

		query.append("ON cv.rule_type = t1.rule_type AND cv.rule_id = t1.rule_id ");
		query.append(productString).append(
				"INNER JOIN rule_master rm ON rm.rule_type = cv.rule_type AND rm.rule_id = cv.rule_id where rm.is_active = 1");

		return query;
	}

	/**
	 * method to create Inclause based on Based on FielCodes
	 * 
	 * @param fieldCodes
	 * @return StringBuilder object.
	 */
	StringBuilder createFieldCodeInClause(Set<String> fieldCodes) {
		StringBuilder fieldCodesInClause = null;
		for (String fieldCode : fieldCodes) {
			fieldCodesInClause = appendInClauseString(fieldCodesInClause);
			fieldCodesInClause.append("'").append(fieldCode).append("'");
		}
		return fieldCodesInClause;
	}

	/**
	 * method to get Query Based on Filters
	 * 
	 * @param ruleMetadataDao
	 * 
	 * @param locationCodes
	 * @param productGroupCodes
	 * @param productCategoryCodes
	 * @return Map Object.
	 */

	private Map<String, Map<String, String>> getQueryBasedOnFilters(RuleRequestListDto ruleRequestListDto,
			RuleMetadataDao ruleMetadataDao) {

		Map<String, Map<String, String>> queryMap = new HashMap<>();

		if (ruleMetadataDao.getLocationMapping() && ruleRequestListDto.getLocationCode() != null) {

			getQueryBasedOnLocationFilters(ruleRequestListDto.getLocationCode(), queryMap);
		}

		if (ruleMetadataDao.getMarketMapping() && ruleRequestListDto.getMarketCode() != null) {

			getQueryBasedOnMarketFilters(ruleRequestListDto.getMarketCode(), queryMap);
		}

		if (ruleMetadataDao.getRangeMapping() && ruleRequestListDto.getInputValue() != null) {

			getQueryBasedOnRangeFilter(ruleRequestListDto, queryMap);
		}

		if ((ruleMetadataDao.getProductGroupMapping() || ruleMetadataDao.getProductCategoryMapping())
				&& ruleRequestListDto.getInputValue() != null && (ruleRequestListDto.getProductGroupCode() != null
						|| ruleRequestListDto.getProductCategoryCode() != null)) {
			StringBuilder whereClause = null;

			if (ruleRequestListDto.getProductGroupCode() != null) {

				whereClause = getProductGroupWhereClauseQuery(ruleRequestListDto.getProductGroupCode(), whereClause);

			}

			if (ruleRequestListDto.getProductCategoryCode() != null) {

				whereClause = getProductCategoryWhereClause(ruleRequestListDto.getProductCategoryCode(), whereClause);
			}

			String selectQuery = "SELECT cpm.rule_type,cpm.rule_id FROM rule_product_mapping cpm INNER JOIN (";
			StringBuilder onQuery = new StringBuilder(" ON cpm.rule_type = t1.rule_type AND cpm.rule_id = t1.rule_id ");

			Map<String, String> productMappingData = new HashMap<>();

			if (whereClause != null) {
				onQuery.append(whereClause);
				productMappingData.put(ConfigConstants.WHERE_QUERY, whereClause.toString());
			}

			productMappingData.put(ConfigConstants.SELECT_QUERY, selectQuery);
			productMappingData.put(ConfigConstants.ON_QUERY, onQuery.toString());

			queryMap.put("productMapping", productMappingData);

		}
		return queryMap;
	}

	private Map<String, Map<String, String>> getQueryBasedOnRangeFilter(RuleRequestListDto ruleRequestListDto,
			Map<String, Map<String, String>> queryMap) {

		String selectQuery = "SELECT rrm.rule_id, rrm.rule_type from rule_range_mapping rrm "
				+ "INNER JOIN range_master rm on rrm.range_id = rm.id  where ('" + ruleRequestListDto.getInputValue()
				+ "'" + " between rm.from_range AND rm.to_range AND rm.is_active='TRUE'	)";

		String onQuery = "ON clm.rule_type = t1.rule_type AND clm.rule_id = t1.rule_id";
		Map<String, String> rangeMappingData = new HashMap<>();
		rangeMappingData.put(ConfigConstants.SELECT_QUERY, selectQuery);
		rangeMappingData.put(ConfigConstants.ON_QUERY, onQuery);
		queryMap.put("rangeMapping", rangeMappingData);
		return queryMap;

	}

	/**
	 * @param queryMap2
	 * @param string
	 * @return
	 */
	private Map<String, Map<String, String>> getQueryBasedOnMarketFilters(String marketCode,
			Map<String, Map<String, String>> queryMap) {

		String selectQuery = "SELECT clm.rule_type,clm.rule_id  FROM rule_market_mapping clm INNER JOIN ( ";
		String onQuery = "ON clm.rule_type = t1.rule_type AND clm.rule_id = t1.rule_id WHERE clm.market_code = '"
				+ marketCode + "'";
		Map<String, String> marketMappingData = new HashMap<>();
		marketMappingData.put(ConfigConstants.SELECT_QUERY, selectQuery);
		marketMappingData.put(ConfigConstants.ON_QUERY, onQuery);
		queryMap.put("marketMapping", marketMappingData);
		return queryMap;

	}

	/**
	 * method to get the where clause query for ProductCategorys.
	 * 
	 * @param productCategoryCode
	 * @param whereClause.
	 * @return StringBuilder Object.
	 */
	private StringBuilder getProductCategoryWhereClause(String productCategoryCode, StringBuilder whereClause) {

		if (productCategoryCode != null && !productCategoryCode.equals("")) {
			if (whereClause == null) {
				whereClause = new StringBuilder(" WHERE ");
			} else {
				whereClause.append(" AND ");
			}

			whereClause.append(" cpm.product_category_code = '" + productCategoryCode + "' ");
		}
		return whereClause;
	}

	/**
	 * method to get the where clause query for ProductGroups.
	 * 
	 * @param productGroupCode
	 * @param whereClause.
	 * @return StringBuilder Object.
	 */
	private StringBuilder getProductGroupWhereClauseQuery(String productGroupCode, StringBuilder whereClause) {

		if (productGroupCode != null && !productGroupCode.equals("")) {
			whereClause = new StringBuilder(" WHERE cpm.product_group_code = '" + productGroupCode + "'");
		}
		return whereClause;
	}

	/**
	 * method to get the Query based on Location Filter.
	 * 
	 * @param queryMap2
	 * 
	 * @param locationCodeList
	 * @return Map object.
	 */
	private Map<String, Map<String, String>> getQueryBasedOnLocationFilters(String locationCode,
			Map<String, Map<String, String>> queryMap) {

		String selectQuery = "SELECT clm.rule_type,clm.rule_id  FROM rule_location_mapping clm INNER JOIN ( ";
		String onQuery = "ON clm.rule_type = t1.rule_type AND clm.rule_id = t1.rule_id WHERE clm.location_code = '"
				+ locationCode + "'";
		Map<String, String> locationMappingData = new HashMap<>();
		locationMappingData.put(ConfigConstants.SELECT_QUERY, selectQuery);
		locationMappingData.put(ConfigConstants.ON_QUERY, onQuery);
		queryMap.put("locationMapping", locationMappingData);
		return queryMap;

	}

	/**
	 * method to append Inclause string.
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
	 * This method will check weightTolerance limit.
	 * 
	 * @param locationCode
	 * @param productGroupCode
	 * @param weightDifference
	 * @param measuredWeight
	 * @param availableQuantity
	 * @param measuredQuantity
	 */
	@Override
	public void checkWeightTolerance(String locationCode, String productGroupCode, BigDecimal availableWeight,
			BigDecimal measuredWeight, short availableQuantity, short measuredQuantity) {

		BigDecimal stdweight;
		BigDecimal availableQty = new BigDecimal(availableQuantity);
		if (availableQty.compareTo(BigDecimal.ZERO) > 0) {
			stdweight = availableWeight.divide(availableQty, MathContext.DECIMAL32);
			stdweight = stdweight.multiply(new BigDecimal(measuredQuantity));
		} else {
			throw new ServiceException("Available Quantity is Zero", "ERR-INV-030");
		}

		// check weight tolerance if weight difference is greater than 0
		BigDecimal weightDifference = measuredWeight.subtract(stdweight).setScale(3, RoundingMode.HALF_UP).abs();
		if (weightDifference.compareTo(BigDecimal.ZERO) > 0) {
			// check weight tolerance validation
			weightToleranceValidation(locationCode, productGroupCode, weightDifference);
		}

	}

	/**
	 * This method will validate weightTolerance limit for mapped locationCode and
	 * ProductGroupCode.
	 * 
	 * @param locationCode
	 * @param productGroupCode
	 * @param weightDifference
	 */

	private void weightToleranceValidation(String locationCode, String productGroupCode, BigDecimal weightDifference) {

		String ruleType = RuleTypeEnum.WEIGHT_TOLERANCE.toString();

		RuleRequestListDto ruleRequestListDto = new RuleRequestListDto();

		if (!StringUtils.isEmpty(locationCode)) {
			ruleRequestListDto.setLocationCode(locationCode);
		}

		if (!StringUtils.isEmpty(productGroupCode)) {
			ruleRequestListDto.setProductGroupCode(productGroupCode);
		}

		if (weightDifference != null) {
			ruleRequestListDto.setInputValue(weightDifference);
		}

		ruleRequestListDto.setRangeType(RangeTypeEnum.WEIGHT_TOLERANCE.toString());

		Object response = ruleValueMappingListBasedOnFilters(ruleType, ruleRequestListDto);

		if (response != null) {

			WeightTolRuleDetails weightDetails = MapperUtil.getObjectMapperInstance().convertValue(response,
					WeightTolRuleDetails.class);

			BigDecimal weightToleranceValue = new BigDecimal(weightDetails.getWeightTolGrams());

			// get the absolute value of (measured weight-std weight)
			// if the result returns -ve value then change it to positive value
			BigDecimal absoluteValue = weightDifference.setScale(3, RoundingMode.HALF_UP).abs();

			if (absoluteValue.compareTo(weightToleranceValue) > 0) {
				throw new ServiceException(
						"Measured weight is exceeding weight tolerance limit " + weightToleranceValue, "ERR-INV-028",
						weightToleranceValue);
			}

		} else {
			Map<String, String> dynamicErrorValues = new HashMap<>();
			dynamicErrorValues.put("ruleType", ruleType);
			throw new ServiceException(ConfigConstants.RESULT_LIST_EMPTY_FOR_WEIGHT_TOLERANCE + ruleType + " ",
					ConfigConstants.ERR_CONFIG_017, ruleType, dynamicErrorValues);
		}
	}

	/**
	 * This method will check the location Mapping against metadata.
	 * 
	 * @param ruleMetadataDao
	 * @param ruleRequestListDto
	 * @param ruleType
	 */
	private void locationCheck(RuleMetadataDao ruleMetadataDao, RuleRequestListDto ruleRequestListDto,
			String ruleType) {

		if (BooleanUtils.isTrue(ruleMetadataDao.getLocationMapping())
				&& (ruleRequestListDto.getLocationCode() == null || ruleRequestListDto.getLocationCode().isEmpty())) {
			throw new ServiceException(ConfigConstants.LOCATION_CODE_IS_MANDATORY, ConfigConstants.ERR_CONFIG_004,
					ruleType);

		}
	}

	/**
	 * This method will check the productGroup Mapping against metadata.
	 * 
	 * @param ruleMetadataDao
	 * @param ruleRequestListDto
	 */
	private void productGrpCheck(RuleMetadataDao ruleMetadataDao, RuleRequestListDto ruleRequestListDto,
			String ruleType) {

		if (BooleanUtils.isTrue(ruleMetadataDao.getProductGroupMapping())
				&& (ruleRequestListDto.getProductGroupCode() == null
						|| ruleRequestListDto.getProductGroupCode().isEmpty())) {
			throw new ServiceException(ConfigConstants.PRODUCT_GROUP_CODE_IS_MANDATORY, ConfigConstants.ERR_CONFIG_018,
					ruleType);

		}
	}

	/**
	 * This method will check the productGroup Mapping against metadata.
	 * 
	 * @param ruleMetadataDao
	 * @param ruleRequestListDto
	 */
	private void productCatCheck(RuleMetadataDao ruleMetadataDao, RuleRequestListDto ruleRequestListDto,
			String ruleType) {

		if (BooleanUtils.isTrue(ruleMetadataDao.getProductCategoryMapping())
				&& (ruleRequestListDto.getProductCategoryCode() == null
						|| ruleRequestListDto.getProductCategoryCode().isEmpty())) {
			throw new ServiceException(ConfigConstants.PRODUCT_CATEGORY_CODE_IS_MANDATORY,
					ConfigConstants.ERR_CONFIG_019, ruleType);

		}
	}

	/**
	 * This method will check the productGroup Mapping against metadata.
	 * 
	 * @param ruleMetadataDao
	 * @param ruleRequestListDto
	 */
	private void marketCheck(RuleMetadataDao ruleMetadataDao, RuleRequestListDto ruleRequestListDto, String ruleType) {

		if (BooleanUtils.isTrue(ruleMetadataDao.getMarketMapping())
				&& (ruleRequestListDto.getMarketCode() == null || ruleRequestListDto.getMarketCode().isEmpty())) {
			throw new ServiceException(ConfigConstants.MARKET_CODE_IS_MANDATORY, ConfigConstants.ERR_CONFIG_079,
					ruleType);

		}
	}

	/**
	 * @param ruleMetadataDao
	 * @param ruleRequestListDto
	 * @param ruleType
	 */
	private void rangeCheck(RuleMetadataDao ruleMetadataDao, RuleRequestListDto ruleRequestListDto, String ruleType) {
		if (BooleanUtils.isTrue(ruleMetadataDao.getRangeMapping()) && (ruleRequestListDto.getInputValue() == null)) {
			throw new ServiceException(ConfigConstants.RANGE_TYPE_AND_WEIGHT_IS_MANDATORY,
					ConfigConstants.ERR_CONFIG_078, ruleType);

		}

	}

	/**
	 * This method will throw Exception if mandatory fields not present for
	 * weightTolerance.
	 * 
	 * @param ruleRequestListDto
	 */

	private void validateFieldsAgainstMetadata(RuleRequestListDto ruleRequestListDto, String ruleType) {
		RuleMetadataDao ruleMetadataDao = ruleMetadataRepository.findByRuleType(ruleType);
		if (ruleMetadataDao != null) {

			locationCheck(ruleMetadataDao, ruleRequestListDto, ruleType);

			productGrpCheck(ruleMetadataDao, ruleRequestListDto, ruleType);

			productCatCheck(ruleMetadataDao, ruleRequestListDto, ruleType);

			marketCheck(ruleMetadataDao, ruleRequestListDto, ruleType);

			rangeCheck(ruleMetadataDao, ruleRequestListDto, ruleType);

		}
	}
	
	@Override
	public BigDecimal getRefundCashLimitConfig() {
		RuleMasterDao ruleMaster=ruleMasterRepository.findByRuleIdDaoRuleType(RuleTypeEnum.CASH_CONFIGURATION.name());
		BigDecimal refundCashLimit;
		if(ruleMaster==null) {
			throw new ServiceException(ConfigConstants.RESULT_IS_EMPTY_PLEASE_SET_CONFIGURATION,
					ConfigConstants.ERR_CONFIG_015, RuleTypeEnum.CASH_CONFIGURATION.name(), Map.of("ruleType",RuleTypeEnum.CASH_CONFIGURATION.name()));
		}else {
			ObjectMapper mapper = new ObjectMapper();
			try {
				JsonNode root=mapper.readTree(ruleMaster.getRuleDetails());
				JsonNode dataNode = root.path("data");
				JsonNode configNode = dataNode.path("cashRefundSetting");
				if(configNode==null) {
					throw new ServiceException(ConfigConstants.NO_REFUND_CASH_CONFIG,
							ConfigConstants.ERR_CONFIG_186, Map.of("configKey","cashRefundSetting - refundCashLimit"));
				}
				if(!configNode.isNull() && configNode.get("refundCashLimit")!=null) {
					refundCashLimit= new BigDecimal(configNode.get("refundCashLimit").asText());
				}else {
					throw new ServiceException(ConfigConstants.NO_REFUND_CASH_CONFIG,
							ConfigConstants.ERR_CONFIG_186, Map.of("configKey","refundCashLimit"));
				}
			} catch (IOException e) {
				throw new ServiceException(UNABLE_TO_PARSE_JSON, ERR_CORE_003);
			}
		}
		return refundCashLimit;
		
	}

}
