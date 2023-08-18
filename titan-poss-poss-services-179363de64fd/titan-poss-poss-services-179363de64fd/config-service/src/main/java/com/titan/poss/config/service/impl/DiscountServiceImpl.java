/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.config.service.impl;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.math.BigDecimal;
import java.net.MalformedURLException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.config.dao.ClubbingDiscountsDaoExt;
import com.titan.poss.config.dao.DiscountCouponDaoExt;
import com.titan.poss.config.dao.DiscountDaoExt;
import com.titan.poss.config.dao.DiscountDetailsDaoExt;
import com.titan.poss.config.dao.DiscountExcludeMappingDaoExt;
import com.titan.poss.config.dao.DiscountItemMappingDao;
import com.titan.poss.config.dao.DiscountItemMappingDaoExt;
import com.titan.poss.config.dao.DiscountLocationMappingDaoExt;
import com.titan.poss.config.dao.DiscountProductCategoryMappingDaoExt;
import com.titan.poss.config.dao.DiscountProductGroupMappingDaoExt;
import com.titan.poss.config.dao.DiscountTypeMetaDataDao;
import com.titan.poss.config.dao.LinkingDiscountsDaoExt;
import com.titan.poss.config.dao.SyncStaging;
import com.titan.poss.config.dto.ClubDiscountResponseDto;
import com.titan.poss.config.dto.ClubbingDiscountsSyncDtoExt;
import com.titan.poss.config.dto.DiscountCouponUpdateResponseDto;
import com.titan.poss.config.dto.DiscountDetailsSyncDtoExt;
import com.titan.poss.config.dto.DiscountExcludeMappingSyncDtoExt;
import com.titan.poss.config.dto.DiscountItemMappingSyncDtoExt;
import com.titan.poss.config.dto.DiscountLocProductGroupDto;
import com.titan.poss.config.dto.DiscountLocationMappingSyncDtoExt;
import com.titan.poss.config.dto.DiscountProductCategorySyncDtoExt;
import com.titan.poss.config.dto.DiscountProductGroupMappingSyncDtoExt;
import com.titan.poss.config.dto.DiscountSyncDtoExt;
import com.titan.poss.config.dto.LinkDiscountResponseDto;
import com.titan.poss.config.dto.LinkingDiscountsSyncDtoExt;
import com.titan.poss.config.dto.WorkflowFileUploadDetails;
import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.constants.DiscountCouponStatusEnum;
import com.titan.poss.config.dto.constants.DiscountOfferTypeEnum;
import com.titan.poss.config.dto.constants.DiscountRequestType;
import com.titan.poss.config.dto.constants.DiscountStatusEnum;
import com.titan.poss.config.dto.request.DiscountAddRangeDto;
import com.titan.poss.config.dto.request.DiscountCouponRequestDto;
import com.titan.poss.config.dto.request.DiscountDetailsDto;
import com.titan.poss.config.dto.request.DiscountProductGroupDto;
import com.titan.poss.config.dto.request.DiscountRaiseRequestDto;
import com.titan.poss.config.dto.request.DiscountSchemeRequestDto;
import com.titan.poss.config.dto.request.DiscountSlabAddDto;
import com.titan.poss.config.dto.request.DiscountSlabDetailsDto;
import com.titan.poss.config.dto.request.DiscountSlabUpdateDto;
import com.titan.poss.config.dto.request.DiscountThemeRequestDto;
import com.titan.poss.config.dto.request.DiscountUpdateDto;
import com.titan.poss.config.dto.request.DiscountUpdateRangeDto;
import com.titan.poss.config.dto.request.ItemThemeUpdateDto;
import com.titan.poss.config.dto.request.LinkDiscountRequestDto;
import com.titan.poss.config.dto.request.ProductCategoryUpdateDto;
import com.titan.poss.config.dto.request.UpdateClubDiscountRequestDto;
import com.titan.poss.config.dto.request.UpdateRangeDto;
import com.titan.poss.config.dto.request.json.ABCategoryDetails;
import com.titan.poss.config.dto.request.json.AbCoDetails;
import com.titan.poss.config.dto.request.json.AmendmentRuleDetails;
import com.titan.poss.config.dto.request.json.ApplicableThemes;
import com.titan.poss.config.dto.request.json.BasicCriteriaDetails;
import com.titan.poss.config.dto.request.json.BestDealDiscountConfigDetails;
import com.titan.poss.config.dto.request.json.BillLevelBasicCriteriaDetails;
import com.titan.poss.config.dto.request.json.COCategoryDetails;
import com.titan.poss.config.dto.request.json.ClubDiscountTypeDetails;
import com.titan.poss.config.dto.request.json.CoinOfferBasicCriteriaDetails;
import com.titan.poss.config.dto.request.json.EmployeeDiscBasicCriteriaDetails;
import com.titan.poss.config.dto.request.json.ExchangeOfferConfigDetails;
import com.titan.poss.config.dto.request.json.GrnLocationConfigDetails;
import com.titan.poss.config.dto.request.json.ItemGroupConfig;
import com.titan.poss.config.dto.request.json.PreviewCategoryDetails;
import com.titan.poss.config.dto.request.json.RivaahCategoryDetails;
import com.titan.poss.config.dto.request.json.RivaahItemGroupConfig;
import com.titan.poss.config.dto.request.json.TataEmployeeDiscBasicCriteriaDetails;
import com.titan.poss.config.dto.request.json.TsssDiscountConfigDetails;
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
import com.titan.poss.config.dto.response.RuleMasterResponseDto;
import com.titan.poss.config.repository.ClubbingDiscountsRepositoryExt;
import com.titan.poss.config.repository.ConfigSyncStagingRepository;
import com.titan.poss.config.repository.DiscountCouponRepositoryExt;
import com.titan.poss.config.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.config.repository.DiscountExcludeMappingRepositoryExt;
import com.titan.poss.config.repository.DiscountItemMappingRepositoryExt;
import com.titan.poss.config.repository.DiscountLocationMappingRepositoryExt;
import com.titan.poss.config.repository.DiscountProductCategoryMappingRepositoryExt;
import com.titan.poss.config.repository.DiscountProductGroupMappingRepositoryExt;
import com.titan.poss.config.repository.DiscountRepositoryExt;
import com.titan.poss.config.repository.DiscountTypeMetaDataRepository;
import com.titan.poss.config.repository.LinkingDiscountsRepositoryExt;
import com.titan.poss.config.service.ConfigSyncDataService;
import com.titan.poss.config.service.DiscountService;
import com.titan.poss.config.service.EngineService;
import com.titan.poss.core.discount.dto.CouponDto;
import com.titan.poss.core.discount.dto.DiscountDto;
import com.titan.poss.core.discount.dto.DiscountGrnConfigDetails;
import com.titan.poss.core.discount.dto.DiscountHeaderDto;
import com.titan.poss.core.discount.dto.DiscountOrderConfigDetails;
import com.titan.poss.core.discount.dto.RegularCategoryDetails;
import com.titan.poss.core.discount.dto.RivaahGhsGrnConfig;
import com.titan.poss.core.domain.constant.DiscountTypeEnum;
import com.titan.poss.core.domain.constant.RuleTypeEnum;
import com.titan.poss.core.domain.constant.enums.FileExtensionEnum;
import com.titan.poss.core.domain.constant.enums.WorkflowProcessStatusEnum;
import com.titan.poss.core.domain.validator.SlabValidator;
import com.titan.poss.core.dto.BaseBasicCriteriaDetails;
import com.titan.poss.core.dto.BusinessDayDto;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.DiscountApproveRequestDto;
import com.titan.poss.core.dto.DiscountApproveResponseDto;
import com.titan.poss.core.dto.DiscountCouponDto;
import com.titan.poss.core.dto.ItemGroupMappingDto;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationCacheRequestDto;
import com.titan.poss.core.dto.LocationCodeFilterDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.TSSSCouponRedeemDto;
import com.titan.poss.core.dto.TepConfigDetails;
import com.titan.poss.core.dto.WorkflowProcessCreateDto;
import com.titan.poss.core.dto.WorkflowProcessCreateResponseDto;
import com.titan.poss.core.dto.WorkflowTaskDetailsDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.CancelPendingRequestsResponseDto;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.WorkflowServiceClient;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.CustomSecurityPrincipal;
import com.titan.poss.core.utils.FileUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.core.utils.StringUtil;
import com.titan.poss.datasync.constant.ConfigServiceOperationCodes;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("discountService")
public class DiscountServiceImpl implements DiscountService {

	@Value("${docs.file.source.path}")
	String fileBasePath;

	@Autowired
	private DiscountRepositoryExt discountRepository;

	@Autowired
	private DiscountLocationMappingRepositoryExt discountLocationMappingRepository;

	@Autowired
	private DiscountProductGroupMappingRepositoryExt discountProductGroupMappingRepository;

	@Autowired
	private DiscountExcludeMappingRepositoryExt discountExcludeMappingRepository;

	@Autowired
	private DiscountProductCategoryMappingRepositoryExt discountProductCategoryMappingRepository;

	@Autowired
	private ConfigSyncDataService syncDataService;

	@Autowired
	private LinkingDiscountsRepositoryExt linkingDiscountRepo;

	@Autowired
	private DiscountServiceImpl discountService;

	@Autowired
	private ConfigSyncStagingRepository configSyncStagingRepository;

	@Autowired
	private DiscountTypeMetaDataRepository discountTypeMetaDataRepository;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private ClubbingDiscountsRepositoryExt clubbingDiscountsRepository;

	@Autowired
	private DiscountItemMappingRepositoryExt discountItemMappingRepository;

	@Autowired
	EngineService engineService;

	@Autowired
	WorkflowServiceClient workflowServiceClient;

	@Autowired
	private DiscountCouponRepositoryExt discountCouponRepository;

	@Autowired
	private RuleServiceImpl ruleServiceImpl;

	private static final String FILE_HEADER = "DISCOUNT ID,COUPON CODE,STATUS";
	private static final String COMMA_DELEMETER = ",";
	private static final String NEW_LINE_SEPERATOR = "\n";
	private static final String discountWorkFlowType = "DISCOUNT_CREATION";
	public static final String WORKFLOW_TYPE = "workflowType";

	/**
	 * This method will return the list of Discount details based on the isActive.
	 *
	 * @param isActive
	 * @param discountType
	 * @param discountCode
	 * @param pageable
	 * @return PagedRestResponse<List<DiscountListResponseDto>>
	 */
	@Override
	public PagedRestResponse<List<DiscountListResponseDto>> listDiscount(String status, String discountCode,
			String occasion, String discountType, String clubbingDiscountType, Boolean isActive, Boolean isPageable,
			String publishStatus, Pageable pageable) {

		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}
		Boolean published = null;

		if (publishStatus != null) {
			if (publishStatus.equals("PUBLISHED"))
				published = false;
			else if (publishStatus.equals("NOT_PUBLISHED")) {
				published = true;
			}
		}

		Page<DiscountDaoExt> discountList = null;
		if (status != null) {
			Date today = CalendarUtils.getStartOfDay(new Date());
			if (status.equalsIgnoreCase(DiscountStatusEnum.RUNNING.name())) {

				discountList = discountRepository.findRunningDiscounts(discountCode, occasion, discountType, today,
						published, pageable);

			}

			else if (status.equalsIgnoreCase(DiscountStatusEnum.ACTIVE_AND_NOT_RUNNING.name())) {
				discountList = discountRepository.findActiveAndNotRunningDiscounts(discountCode, occasion, discountType,
						today, published, pageable);
			} else {
				discountList = discountRepository.findInactiveDiscounts(discountCode, occasion, discountType, published,
						pageable);
			}
		} else if (clubbingDiscountType != null) {
			discountList = discountRepository.findDiscountsForClubbingRule(clubbingDiscountType, pageable);
		} else {

			discountList = discountRepository.getDiscounts(discountType, discountCode, occasion, published,isActive, pageable);
		}
		List<DiscountListResponseDto> discountDtoList = new ArrayList<>();
		discountList.forEach(discount -> {
			DiscountListResponseDto responseDto = (DiscountListResponseDto) MapperUtil.getDtoMapping(discount,
					DiscountListResponseDto.class);
			if (publishStatus != null) {
				if (publishStatus.equals("PUBLISHED") && discount.getIsPublishPending() == false)
					discountDtoList.add(responseDto);
				else if (publishStatus.equals("NOT_PUBLISHED") && discount.getIsPublishPending() == true) {
					discountDtoList.add(responseDto);
				}
			} else {
				discountDtoList.add(responseDto);
			}

			responseDto.setStatus(status);

		});

		return new PagedRestResponse<>(discountDtoList, discountList);
	}

	/**
	 * This method will return the Discount details based on the discountId.
	 *
	 * @param discountId
	 * @return DiscountResponseDto
	 */
	@Override
	public DiscountResponseDto getDiscount(String discountId, String processId) {
		DiscountDaoExt discount = new DiscountDaoExt();
		if (discountId != null)
			discount = getDiscountDao(discountId);
		if (processId != null)
			discount = discountRepository.findOneByWorkflowProcessId(processId);
		return getDiscountResponseDto(discount);
	}

	/**
	 * This method will save the Discount details.
	 *
	 * @param discountCreateDto
	 * @return DiscountDto
	 */
	@Override
	@Transactional
	public DiscountResponseDto createDiscount(DiscountDto discountDto) {

		DiscountDaoExt discount = discountRepository.findOneByDiscountCode(discountDto.getDiscountCode());
		if (discount != null) {
			throw new ServiceException(ConfigConstants.DISCOUNT_CODE_IS_ALREADY_AVAILABLE,
					ConfigConstants.ERR_CONFIG_034);
		}

		if (discountDto.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name())) {
			List<DiscountDaoExt> daoExts = discountRepository.findActiveDiscount(discountDto.getDiscountType());
			if (!daoExts.isEmpty()) {
				Map<String, String> dynamicValues = new HashMap<>();
				dynamicValues.put("discountType", discountDto.getDiscountType());
				throw new ServiceException(ConfigConstants.DISCOUNT_IS_ALREADY_AVAILABLE,
						ConfigConstants.ERR_CONFIG_155, dynamicValues);
			}
		}

		discount = (DiscountDaoExt) MapperUtil.getObjectMapping(discountDto, new DiscountDaoExt());
		discount = getDiscountDependents(discountDto, discount);
		discount.setIsPublishPending(true);
		discountRepository.save(discount);
		return getDiscountResponseDto(discount);

	}

	/**
	 * @param discountDto
	 */

	// waiting for reply from BA
	private void validateJson(DiscountDto discountDto) {
		if (discountDto.getAbCoData() == null)
			throw new ServiceException(ConfigConstants.ABCO_DATA_IS_MANDATORY, ConfigConstants.ERR_CONFIG_035);

		if (discountDto.getBasicCriteria() == null)
			throw new ServiceException(ConfigConstants.BASIC_CRITERIA_IS_MANDATORY, ConfigConstants.ERR_CONFIG_036);

		if (discountDto.getClubDiscountType() == null)
			throw new ServiceException(ConfigConstants.CLUB_DISCOUNT_TYPE_IS_MANDATORY, ConfigConstants.ERR_CONFIG_037);

		if (discountDto.getClubOtherOffersConfig() == null)
			throw new ServiceException(ConfigConstants.CLUB_OTHER_OFFERS_IS_MANDATORY, ConfigConstants.ERR_CONFIG_038);

		if (discountDto.getConfigDetails() == null)
			throw new ServiceException(ConfigConstants.CONFIG_DETAILS_IS_MANDATORY, ConfigConstants.ERR_CONFIG_039);

		if (discountDto.getCumulativeDetails() == null)
			throw new ServiceException(ConfigConstants.CUMULATIVE_DETAILS_IS_MANDATORY, ConfigConstants.ERR_CONFIG_040);

		if (discountDto.getGrnDetails() == null)
			throw new ServiceException(ConfigConstants.GRN_DETAILS_IS_MANDATORY, ConfigConstants.ERR_CONFIG_041);

		if (discountDto.getTepDetails() == null)
			throw new ServiceException(ConfigConstants.TEP_DETAILS_IS_MANDATORY, ConfigConstants.ERR_CONFIG_042);

		if (discountDto.getOrderDetails() == null)
			throw new ServiceException(ConfigConstants.ORDER_DETAILS_IS_MANDATORY, ConfigConstants.ERR_CONFIG_043);

		if (discountDto.getItemGroupConfig() == null)
			throw new ServiceException(ConfigConstants.ORDER_DETAILS_IS_MANDATORY, ConfigConstants.ERR_CONFIG_043);

		if (discountDto.getApplicableThemes() == null)
			throw new ServiceException(ConfigConstants.ORDER_DETAILS_IS_MANDATORY, ConfigConstants.ERR_CONFIG_043);
	}

	/**
	 * @param discount
	 * @return
	 */
	private DiscountResponseDto getDiscountResponseDto(DiscountDaoExt discount) {
		DiscountResponseDto discountResponseDto = (DiscountResponseDto) MapperUtil.getObjectMapping(discount,
				new DiscountResponseDto());

		Object obj = null;
		JsonData jsonData = null;
		if (discount != null) {
			if (discount.getApplicableLevels() != null)
				discountResponseDto.setApplicableLevels(Arrays.asList(discount.getApplicableLevels().split(",")));

			if (discount.getAbCoData() != null) {
				obj = MapperUtil.getJsonFromString(discount.getAbCoData());
				jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
				discountResponseDto.setAbCoData(jsonData);
			}
			if (discount.getBasicCriteria() != null) {
				obj = MapperUtil.getJsonFromString(discount.getBasicCriteria());
				jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
				discountResponseDto.setBasicCriteria(jsonData);
			}
			if (discount.getClubDiscountType() != null) {
				obj = MapperUtil.getJsonFromString(discount.getClubDiscountType());
				jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
				discountResponseDto.setClubDiscountType(jsonData);
			}
			if (discount.getClubOtherOffersConfig() != null) {
				obj = MapperUtil.getJsonFromString(discount.getClubOtherOffersConfig());
				jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
				discountResponseDto.setClubOtherOffersConfig(jsonData);
			}
			if (discount.getConfigDetails() != null) {
				obj = MapperUtil.getJsonFromString(discount.getConfigDetails());
				jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
				discountResponseDto.setConfigDetails(jsonData);
			}
			if (discount.getCumulativeDetails() != null) {
				obj = MapperUtil.getJsonFromString(discount.getCumulativeDetails());
				jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
				discountResponseDto.setCumulativeDetails(jsonData);
			}
			if (discount.getGrnDetails() != null) {
				obj = MapperUtil.getJsonFromString(discount.getGrnDetails());
				jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
				discountResponseDto.setGrnDetails(jsonData);
			}
			if (discount.getTepDetails() != null) {
				obj = MapperUtil.getJsonFromString(discount.getTepDetails());
				jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
				discountResponseDto.setTepDetails(jsonData);
			}
			if (discount.getOrderDetails() != null) {
				obj = MapperUtil.getJsonFromString(discount.getOrderDetails());
				jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
				discountResponseDto.setOrderDetails(jsonData);
			}
			if (discount.getItemGroupConfig() != null) {
				obj = MapperUtil.getJsonFromString(discount.getItemGroupConfig());
				jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
				discountResponseDto.setItemGroupConfig(jsonData);
			}
			if (discount.getRivaahItemGroupConfig() != null) {
				obj = MapperUtil.getJsonFromString(discount.getRivaahItemGroupConfig());
				jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
				discountResponseDto.setRivaahItemGroupConfig(jsonData);
			}
			if (discount.getApplicableThemes() != null) {
				obj = MapperUtil.getJsonFromString(discount.getApplicableThemes());
				jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
				discountResponseDto.setApplicableThemes(jsonData);
			}
			if (discount.getWorkflowFileUploadDetails() != null) {
				obj = MapperUtil.getJsonFromString(discount.getWorkflowFileUploadDetails());
				jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
				discountResponseDto.setWorkflowFileUploadDetails(jsonData);
			}
			discountResponseDto.setIsAccrualUlp(discount.getIsAccrualUlp());
		}
		return discountResponseDto;
	}

	/**
	 * @param discountDto
	 * @return
	 */
	private DiscountDaoExt getDiscountDependents(DiscountDto discountDto, DiscountDaoExt discountDao) {

		if (!CollectionUtils.isEmpty(discountDto.getApplicableLevels())) {
			String applicableLevels = discountDto.getApplicableLevels().stream().collect(Collectors.joining(","));
			discountDao.setApplicableLevels(applicableLevels);
		}

		if (discountDto.getAbCoData() != null) {
			AbCoDetails abCoData = new AbCoDetails();
			abCoData.validate(discountDto.getAbCoData().getData());
			discountDao.setAbCoData(MapperUtil.getJsonString(discountDto.getAbCoData()));
		}

		if (discountDto.getBasicCriteria() != null) {

			validateBasicCriteriaObject(discountDto);

			discountDao.setBasicCriteria(MapperUtil.getJsonString(discountDto.getBasicCriteria()));
		}

		if (discountDto.getClubDiscountType() != null) {
			ClubDiscountTypeDetails clubDiscountData = new ClubDiscountTypeDetails();
			clubDiscountData.validate(discountDto.getClubDiscountType().getData());
			discountDao.setClubDiscountType(MapperUtil.getJsonString(discountDto.getClubDiscountType()));
		}

		if (discountDto.getClubOtherOffersConfig() != null) {
			ClubbingConfigDetails clubbingData = new ClubbingConfigDetails();
			clubbingData.validate(discountDto.getClubOtherOffersConfig().getData());
			discountDao.setClubOtherOffersConfig(MapperUtil.getJsonString(discountDto.getClubOtherOffersConfig()));
		}

		if (discountDto.getConfigDetails() != null) {
			validateConfigDetails(discountDto);
			discountDao.setConfigDetails(MapperUtil.getJsonString(discountDto.getConfigDetails()));
		}
		if (discountDto.getCumulativeDetails() != null) {
			discountDao.setCumulativeDetails(MapperUtil.getJsonString(discountDto.getCumulativeDetails()));
		}
		if (discountDto.getGrnDetails() != null) {
			if (discountDto.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name())) {
				RivaahGhsGrnConfig grnData = new RivaahGhsGrnConfig();
				grnData.validate(discountDto.getGrnDetails().getData());
				discountDao.setGrnDetails(MapperUtil.getJsonString(discountDto.getGrnDetails()));
			} else {
				DiscountGrnConfigDetails grnData = new DiscountGrnConfigDetails();
				grnData.validate(discountDto.getGrnDetails().getData());
				discountDao.setGrnDetails(MapperUtil.getJsonString(discountDto.getGrnDetails()));
			}
		}

		if (discountDto.getTepDetails() != null) {
			TepConfigDetails tepData = new TepConfigDetails();
			tepData.validate(discountDto.getTepDetails().getData());
			discountDao.setTepDetails(MapperUtil.getJsonString(discountDto.getTepDetails()));
		}

		if (discountDto.getItemGroupConfig() != null) {
			ItemGroupConfig itemGroupConfig = new ItemGroupConfig();
			itemGroupConfig.validate(discountDto.getItemGroupConfig().getData());
			discountDao.setItemGroupConfig(MapperUtil.getJsonString(discountDto.getItemGroupConfig()));
		}

		if (discountDto.getRivaahItemGroupConfig() != null) {
			RivaahItemGroupConfig rivaahItemGroupConfig = new RivaahItemGroupConfig();
			rivaahItemGroupConfig.validate(discountDto.getRivaahItemGroupConfig().getData());
			discountDao.setRivaahItemGroupConfig(MapperUtil.getJsonString(discountDto.getRivaahItemGroupConfig()));
		}

		if (discountDto.getApplicableThemes() != null) {
			ApplicableThemes applicableThemes = new ApplicableThemes();
			applicableThemes.validate(discountDto.getApplicableThemes().getData());
			discountDao.setApplicableThemes(MapperUtil.getJsonString(discountDto.getApplicableThemes()));
		}

		if (discountDto.getOrderDetails() != null) {
			DiscountOrderConfigDetails orderData = new DiscountOrderConfigDetails();
			orderData.validate(discountDto.getOrderDetails().getData());
			discountDao.setOrderDetails(MapperUtil.getJsonString(discountDto.getOrderDetails()));
		}
		
		if(discountDto.getWorkflowFileUploadDetails() != null) {
			WorkflowFileUploadDetails fileUploadData = new WorkflowFileUploadDetails();
			fileUploadData.validate(discountDto.getWorkflowFileUploadDetails().getData());
			discountDao.setWorkflowFileUploadDetails(MapperUtil.getJsonString(discountDto.getWorkflowFileUploadDetails()));
		}

		if (discountDto.getIsAccrualUlp() != null)
			discountDao.setIsAccrualUlp(discountDto.getIsAccrualUlp());
		
		if (discountDto.getIsAccrualUlpPoints()!= null)
			discountDao.setIsAccrualUlp(discountDto.getIsAccrualUlpPoints());

		return discountDao;
	}

	private void validateConfigDetails(DiscountDto discountDto) {

		if (discountDto.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.BEST_DEAL_DISCOUNT.toString())) {
			BestDealDiscountConfigDetails configDetails = new BestDealDiscountConfigDetails();
			configDetails.validate(discountDto.getConfigDetails().getData());

		} else if (discountDto.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.TSSS_DISCOUNT.toString())) {
			TsssDiscountConfigDetails configDetails = new TsssDiscountConfigDetails();
			configDetails.validate(discountDto.getConfigDetails().getData());

		} else if (discountDto.getDiscountType()
				.equalsIgnoreCase(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.toString())) {

			ExchangeOfferConfigDetails configDetails = new ExchangeOfferConfigDetails();
			configDetails.validate(discountDto.getConfigDetails().getData());
		}

	}

	private void validateBasicCriteriaObject(DiscountDto discountDto) {
		if (discountDto.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.COIN_OFFER_DISCOUNT.toString())) {
			CoinOfferBasicCriteriaDetails criteria = new CoinOfferBasicCriteriaDetails();
			criteria.validate(discountDto.getBasicCriteria().getData());

		} else if (discountDto.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.BILL_LEVEL_DISCOUNT.toString())) {
			BillLevelBasicCriteriaDetails criteria = new BillLevelBasicCriteriaDetails();
			criteria.validate(discountDto.getBasicCriteria().getData());

		} else if (discountDto.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.EMPLOYEE_DISCOUNT.toString())) {
			EmployeeDiscBasicCriteriaDetails criteria = new EmployeeDiscBasicCriteriaDetails();
			criteria.validate(discountDto.getBasicCriteria().getData());

		} else if (discountDto.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT.toString())) {
			TataEmployeeDiscBasicCriteriaDetails criteria = new TataEmployeeDiscBasicCriteriaDetails();
			criteria.validate(discountDto.getBasicCriteria().getData());

		} else {
			BasicCriteriaDetails basicCriteriaData = new BasicCriteriaDetails();
			basicCriteriaData.validate(discountDto.getBasicCriteria().getData());
		}

	}

	/**
	 * This method will update the Discount details.
	 *
	 * @param discountId
	 * @param discountUpdateDto
	 * @return DiscountResponseDto
	 */
	@Override
	@Transactional
	public DiscountResponseDto updateDiscount(String discountId, String requestStatus, String typeOfRequest,
			DiscountUpdateDto discountUpdateDto) {

		DiscountDaoExt discount = getDiscountDao(discountId);

		if (discountUpdateDto.getIsActive() != null) {
			if (discountUpdateDto.getIsActive() == true && discount.getIsActive() == false) {

				if (discount.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name())) {
					List<DiscountDaoExt> daoExts = discountRepository.findActiveDiscount(discount.getDiscountType());
					if (!daoExts.isEmpty()) {
						Map<String, String> dynamicValues = new HashMap<>();
						dynamicValues.put("discountType", discount.getDiscountType());
						throw new ServiceException(ConfigConstants.DISCOUNT_IS_ALREADY_AVAILABLE,
								ConfigConstants.ERR_CONFIG_155, dynamicValues);
					}
				}

				if (discount.getDiscountType().equals(DiscountTypeEnum.COIN_OFFER_DISCOUNT.name())
						|| discount.getDiscountType().equals(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name())
						|| discount.getDiscountType().equals(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name())
						|| discount.getDiscountType().equals(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name())) {

					List<DiscountLocationMappingDaoExt> locationMappingList = discountLocationMappingRepository
							.checkLocationMapping(discount.getDiscountType(), discount.getId());
					List<DiscountProductGroupMappingDaoExt> productGrps = discountProductGroupMappingRepository
							.getActiveProductMapping(discount.getDiscountType(), discount.getId());
					List<String> productGrpList = new ArrayList<>();
					productGrps.forEach(prd -> productGrpList.add(prd.getProductGroupCode()));
					List<String> locationCodes = new ArrayList<>();
					String discountType = discount.getDiscountType();
					if (!locationMappingList.isEmpty()) {
						locationMappingList.forEach(location -> {

							locationCodes.add(location.getLocationCode());
							List<DiscountLocationMappingDaoExt> locations = discountLocationMappingRepository
									.getDiscountLocationExists(location.getDiscount().getDiscountType(),
											location.getId(), location.getOfferStartDate(), location.getOfferEndDate());
							if (!locations.isEmpty() || locations == null) {
								if (productGrpList != null
										&& (discountType.equals(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name())
												|| discountType.equals(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name()))) {
									List<DiscountProductGroupMappingDaoExt> productGrps1 = discountProductGroupMappingRepository
											.getActiveProductMapping(discountType,
													locations.get(0).getDiscount().getId());
									productGrps1.forEach(prd -> {
										if (productGrpList.contains(prd.getProductGroupCode())) {
											Map<String, String> dynamicValues = new HashMap<>();
											dynamicValues.put("discountCode",
													locations.get(0).getDiscount().getDiscountCode());
											throw new ServiceException(
													ConfigConstants.MAKE_LOCATION_MAPPINGS_AS_INACTIVE,
													ConfigConstants.ERR_CONFIG_159, dynamicValues);
										}
									});

								} else {
									Map<String, String> dynamicValues = new HashMap<>();
									dynamicValues.put("discountCode", locations.get(0).getDiscount().getDiscountCode());
									throw new ServiceException(ConfigConstants.MAKE_LOCATION_MAPPINGS_AS_INACTIVE,
											ConfigConstants.ERR_CONFIG_159, dynamicValues);
								}

							}

						});

					}

				}

			}
		}
		if (discount.getPublishTime()!= null && discountUpdateDto.getIsActive() != null && discountUpdateDto.getIsActive() != discount.getIsActive()) {
			saveDiscountAndPublish(discountUpdateDto, discount);
		} else {
			discount = (DiscountDaoExt) MapperUtil.getObjectMapping(discountUpdateDto, discount);
			discount.setIsPublishPending(true);
			discount.setSrcSyncId(discount.getSrcSyncId() + 1);

			if (!CollectionUtils.isEmpty(discountUpdateDto.getApplicableLevels())) {
				String applicableLevels = discountUpdateDto.getApplicableLevels().stream()
						.collect(Collectors.joining(","));
				discount.setApplicableLevels(applicableLevels);
			}

			discountRepository.save(getDiscountDependentsForUpdate(discountUpdateDto, discount));
		}

		return getDiscountResponseDto(discount);
	}

	/**
	 * @param discountUpdateDto
	 * @param discount
	 */
	@Transactional
	public void saveDiscountAndPublish(DiscountUpdateDto discountUpdateDto, DiscountDaoExt discount) {
		discount = (DiscountDaoExt) MapperUtil.getObjectMapping(discountUpdateDto, discount);
		discount.setIsPublishPending(true);
		discount.setSrcSyncId(discount.getSrcSyncId() + 1);

		if (!CollectionUtils.isEmpty(discountUpdateDto.getApplicableLevels())) {
			String applicableLevels = discountUpdateDto.getApplicableLevels().stream().collect(Collectors.joining(","));
			discount.setApplicableLevels(applicableLevels);
		}

		discountRepository.save(getDiscountDependentsForUpdate(discountUpdateDto, discount));
		publishDiscount(discount.getId(), false);
	}

	private void validateBasicCriteriaObjectForUpdate(DiscountUpdateDto discountUpdateDto, DiscountDaoExt discountDao) {

		if (discountDao.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.COIN_OFFER_DISCOUNT.toString())
				&& discountUpdateDto.getBasicCriteria().getData() != null) {
			CoinOfferBasicCriteriaDetails criteria = new CoinOfferBasicCriteriaDetails();
			criteria.validate(discountUpdateDto.getBasicCriteria().getData());

		}

		else if (discountDao.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.BILL_LEVEL_DISCOUNT.toString())
				&& discountUpdateDto.getBasicCriteria().getData() != null) {

			BillLevelBasicCriteriaDetails criteria = new BillLevelBasicCriteriaDetails();
			criteria.validate(discountUpdateDto.getBasicCriteria().getData());

		}

		else if (discountDao.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.EMPLOYEE_DISCOUNT.toString())
				&& discountUpdateDto.getBasicCriteria().getData() != null) {

			EmployeeDiscBasicCriteriaDetails criteria = new EmployeeDiscBasicCriteriaDetails();
			criteria.validate(discountUpdateDto.getBasicCriteria().getData());

		}

		else if (discountDao.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT.toString())
				&& discountUpdateDto.getBasicCriteria().getData() != null) {

			TataEmployeeDiscBasicCriteriaDetails criteria = new TataEmployeeDiscBasicCriteriaDetails();
			criteria.validate(discountUpdateDto.getBasicCriteria().getData());

		}

		else if (discountUpdateDto.getBasicCriteria().getData() != null) {
			BasicCriteriaDetails basicCriteriaData = new BasicCriteriaDetails();
			basicCriteriaData.validate(discountUpdateDto.getBasicCriteria().getData());
		}

	}

	private DiscountDaoExt getDiscountDependentsForUpdate(DiscountUpdateDto discountUpdateDto,
			DiscountDaoExt discountDao) {

		if (discountUpdateDto.getAbCoData() != null) {
			AbCoDetails abCoData = new AbCoDetails();
			abCoData.validate(discountUpdateDto.getAbCoData().getData());
			discountDao.setAbCoData(MapperUtil.getJsonString(discountUpdateDto.getAbCoData()));
		}

		if (discountUpdateDto.getBasicCriteria() != null) {

			validateBasicCriteriaObjectForUpdate(discountUpdateDto, discountDao);

			discountDao.setBasicCriteria(MapperUtil.getJsonString(discountUpdateDto.getBasicCriteria()));
		}

		if (discountUpdateDto.getClubDiscountType() != null) {
			ClubDiscountTypeDetails clubDiscountData = new ClubDiscountTypeDetails();
			clubDiscountData.validate(discountUpdateDto.getClubDiscountType());
			discountDao.setClubDiscountType(MapperUtil.getJsonString(discountUpdateDto.getClubDiscountType()));
		}

		if (discountUpdateDto.getClubOtherOffersConfig() != null) {
			ClubbingConfigDetails clubbingData = new ClubbingConfigDetails();
			clubbingData.validate(discountUpdateDto.getClubOtherOffersConfig().getData());
			discountDao
					.setClubOtherOffersConfig(MapperUtil.getJsonString(discountUpdateDto.getClubOtherOffersConfig()));
		}

		if (discountUpdateDto.getConfigDetails() != null) {
			validateConfigDetailsForUpdate(discountUpdateDto, discountDao);
			discountDao.setConfigDetails(MapperUtil.getJsonString(discountUpdateDto.getConfigDetails()));
		}
		if (discountUpdateDto.getCumulativeDetails() != null) {
			discountDao.setCumulativeDetails(MapperUtil.getJsonString(discountUpdateDto.getCumulativeDetails()));
		}

		if (discountUpdateDto.getGrnDetails() != null) {
			GrnLocationConfigDetails grnData = new GrnLocationConfigDetails();
			grnData.validate(discountUpdateDto.getGrnDetails().getData());
			discountDao.setGrnDetails(MapperUtil.getJsonString(discountUpdateDto.getGrnDetails()));
		}

		if (discountUpdateDto.getTepDetails() != null) {
			TepConfigDetails tepData = new TepConfigDetails();
			tepData.validate(discountUpdateDto.getTepDetails().getData());
			discountDao.setTepDetails(MapperUtil.getJsonString(discountUpdateDto.getTepDetails()));
		}

		if (discountUpdateDto.getItemGroupConfig() != null) {
			ItemGroupConfig itemGroupConfig = new ItemGroupConfig();
			itemGroupConfig.validate(discountUpdateDto.getItemGroupConfig().getData());
			discountDao.setItemGroupConfig(MapperUtil.getJsonString(discountUpdateDto.getItemGroupConfig()));
		}

		if (discountUpdateDto.getRivaahItemGroupConfig() != null) {
			RivaahItemGroupConfig rivaahItemGroupConfig = new RivaahItemGroupConfig();
			rivaahItemGroupConfig.validate(discountUpdateDto.getRivaahItemGroupConfig().getData());
			discountDao
					.setRivaahItemGroupConfig(MapperUtil.getJsonString(discountUpdateDto.getRivaahItemGroupConfig()));
		}

		if (discountUpdateDto.getApplicableThemes() != null) {
			ApplicableThemes applicableThemes = new ApplicableThemes();
			applicableThemes.validate(discountUpdateDto.getApplicableThemes().getData());
			discountDao.setApplicableThemes(MapperUtil.getJsonString(discountUpdateDto.getApplicableThemes()));
		}

		if (discountUpdateDto.getOrderDetails() != null) {
			DiscountOrderConfigDetails orderData = new DiscountOrderConfigDetails();
			orderData.validate(discountUpdateDto.getOrderDetails().getData());
			discountDao.setOrderDetails(MapperUtil.getJsonString(discountUpdateDto.getOrderDetails()));
		}
		if(discountUpdateDto.getWorkflowFileUploadDetails() != null) {
			WorkflowFileUploadDetails fileUploadData = new WorkflowFileUploadDetails();
			fileUploadData.validate(discountUpdateDto.getWorkflowFileUploadDetails().getData());
			discountDao.setWorkflowFileUploadDetails(MapperUtil.getJsonString(discountUpdateDto.getWorkflowFileUploadDetails()));
		}
		

		if (discountUpdateDto.getIsAccrualUlpPoints() != null)
			discountDao.setIsAccrualUlp(discountUpdateDto.getIsAccrualUlpPoints());

		return discountDao;
	}

	private void validateConfigDetailsForUpdate(DiscountUpdateDto discountDto, DiscountDaoExt discountDao) {
		if (discountDao.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT.toString())
				&& discountDto.getConfigDetails().getData() != null) {
			BestDealDiscountConfigDetails configDetails = new BestDealDiscountConfigDetails();
			configDetails.validate(discountDto.getConfigDetails().getData());

		} else if (discountDao.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.TSSS_DISCOUNT.toString())
				&& discountDto.getConfigDetails().getData() != null) {
			TsssDiscountConfigDetails configDetails = new TsssDiscountConfigDetails();
			configDetails.validate(discountDto.getConfigDetails().getData());

		} else if (discountDao.getDiscountType()
				.equalsIgnoreCase(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.toString())
				&& discountDto.getConfigDetails().getData() != null) {

			ExchangeOfferConfigDetails configDetails = new ExchangeOfferConfigDetails();
			configDetails.validate(discountDto.getConfigDetails().getData());
		}

	}

	/**
	 * This method will list the Discount details with respect to location.
	 *
	 * @param discountCode
	 * @param isActive
	 * @return DiscountLocationCodeDto
	 */
	@Override
	public PagedRestResponse<List<DiscountLocationResponseDto>> listDiscountLocationMapping(String discountId,
			LocationCodeFilterDto locationCodeFilter, Boolean status, Boolean isPageable, Pageable pageable) {

		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}

		Date offerStartDate = locationCodeFilter.getOfferStartDate() == null ? null
				: CalendarUtils.getStartOfDay(locationCodeFilter.getOfferStartDate());
		Date offerEndDate = locationCodeFilter.getOfferEndDate() == null ? null
				: CalendarUtils.getStartOfDay(locationCodeFilter.getOfferEndDate());
		Date previewStartDate = locationCodeFilter.getPreviewStartDate() == null ? null
				: CalendarUtils.getStartOfDay(locationCodeFilter.getPreviewStartDate());
		Date previewEndDate = locationCodeFilter.getPreviewEndDate() == null ? null
				: CalendarUtils.getStartOfDay(locationCodeFilter.getPreviewEndDate());
		Page<DiscountLocationMappingDaoExt> discountLocationPageList = discountLocationMappingRepository
				.getDiscountLocations(discountId, locationCodeFilter.getLocationCode(), status, offerStartDate,
						offerEndDate, previewStartDate, previewEndDate, pageable);

		List<DiscountLocationMappingDaoExt> locationMappingDaoExtList = new ArrayList<>();

		if (discountLocationPageList != null) {
			locationMappingDaoExtList = discountLocationPageList.stream().collect(Collectors.toList());
		}
		DiscountDaoExt discountDaoExt = discountRepository.findOneById(discountId);
		return new PagedRestResponse<>(getLocationMappingResponse(discountDaoExt, locationMappingDaoExtList),
				discountLocationPageList);

	}

	/**
	 * This method will list the Discount details with respect to ProductGroup.
	 *
	 * @param discountCode
	 * @param isActive
	 * @return DiscountProductGroupDto
	 */
	@Override
	public PagedRestResponse<List<DiscountProductDto>> listDiscountProductGroupMapping(String discountId,
			List<String> productGroupCodeList, String karatType, String productType, String discountDetailsId,
			Boolean isPageable, Pageable pageable) {

		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}

		DiscountDaoExt discount = getDiscountDao(discountId);

		DiscountDetailsDaoExt discountDetailDao = null;
		if (discountDetailsId != null) {
			discountDetailDao = discountDetailsRepository.findById(discountDetailsId)
					.orElseThrow(() -> new ServiceException(ConfigConstants.NO_DISCOUNT_DETAILS_FOUND,
							ConfigConstants.ERR_CONFIG_057));
		}

		Page<DiscountProductGroupMappingDaoExt> discountList = discountProductGroupMappingRepository
				.findAllByProductGroupCodeList(discount, discountDetailDao, karatType, productType,
						productGroupCodeList, pageable);

		List<DiscountProductDto> discountProductGroupResponseDtoList = new ArrayList<>();
		if (discountList != null) {
			discountList.forEach(discounts -> discountProductGroupResponseDtoList
					.add(getProductMappingResponse(discounts, discount)));
		}

		return new PagedRestResponse<>(discountProductGroupResponseDtoList, discountList);
	}

	/**
	 * This method will create/remove mapping between discount and location.
	 *
	 * @param discountCode
	 * @param discountLocationDto
	 * @return DiscountLocationDto
	 */
	@Override
	@Transactional
	public ListResponse<DiscountLocationResponseDto> discountLocationMapping(String discountId,
			DiscountLocationDto discountLocationDto) {

		DiscountDaoExt discount = getDiscountDao(discountId);

		List<DiscountLocationMappingDaoExt> discountLocationMappingList = new ArrayList<>();

		if (!CollectionUtils.isEmpty(discountLocationDto.getRemoveLocations())) {

			removeLocation(discountLocationDto.getRemoveLocations(), discount);
		}

		if ((discountLocationDto.getAddLocations() != null && !discountLocationDto.getAddLocations().isEmpty())
				|| (discountLocationDto.getUpdateLocations() != null
						&& !discountLocationDto.getUpdateLocations().isEmpty())) {
			validateLocationMappingRequest(discount.getDiscountType(), discountLocationDto, discount);
		}
		if (discountLocationDto.getUpdateLocations() != null && !discountLocationDto.getUpdateLocations().isEmpty()) {
			List<DiscountLocationMappingDaoExt> discountLocationUpdateList = discountLocationMappingRepository
					.findAllById(discountLocationDto.getUpdateLocations());

			discountLocationUpdateList.forEach(location -> {
				validateLocationUpdateRequest(discountLocationDto, discountLocationMappingList, discount, location,
						discountId);
			});
		}
		if (!CollectionUtils.isEmpty(discountLocationDto.getAddLocations())) {
			discountLocationDto.getAddLocations().forEach(locationCode -> {

				validateLocationAddRequest(locationCode, discountLocationDto, discountLocationMappingList, discount,
						discountId);

			});
		}

		discountLocationMappingRepository.saveAll(discountLocationMappingList);
		discount.setIsPublishPending(true);
		discount.setSrcSyncId(discount.getSrcSyncId() + 1);
		discountRepository.save(discount);
		return new ListResponse<>(getLocationMappingResponse(discount, discountLocationMappingList));
	}

	/**
	 * @param locationCode
	 * @param discountLocationDto
	 * @param discountLocationMappingList
	 * @param discountId
	 * @param discount
	 */
	private void validateLocationAddRequest(String locationCode, DiscountLocationDto discountLocationDto,
			List<DiscountLocationMappingDaoExt> discountLocationMappingList, DiscountDaoExt discount,
			String discountId) {
		// checking duplicate w.r.t CFA, location, start & end dates combination while
		// Adding(across discountType)
		if (discount.getDiscountType().equals(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name())
				|| discount.getDiscountType().equals(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name())) {
			List<DiscountLocProductGroupDto> discountLocList = discountLocationMappingRepository.checkMappedDiscount(
					discountId, discountLocationDto.getAddLocations(),
					CalendarUtils.getStartOfDay(discountLocationDto.getValidity().getOfferStartDate()),
					CalendarUtils.getStartOfDay(discountLocationDto.getValidity().getOfferEndDate()),
					discount.getDiscountType());
			if (!CollectionUtils.isEmpty(discountLocList)) {

				// for given location,if already one Discount is running/active throw exception.
				// bcoz at a location for a product only one discout can be active
				throw new ServiceException(ConfigConstants.LOCATION_ALREADY_MAPPED, ConfigConstants.ERR_CONFIG_150,
						discountLocList);
			}
		}

		// checking duplicate w.r.t location, start & end dates combination while
		// Adding(across discountType)
		if (discount.getDiscountType().equals(DiscountTypeEnum.COIN_OFFER_DISCOUNT.name())
				|| discount.getDiscountType().equals(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name())) {
			List<DiscountLocProductGroupDto> discountLocList = discountLocationMappingRepository
					.checkDiscountExsitsOrNot(discountId, discountLocationDto.getAddLocations(),
							CalendarUtils.getStartOfDay(discountLocationDto.getValidity().getOfferStartDate()),
							CalendarUtils.getStartOfDay(discountLocationDto.getValidity().getOfferEndDate()),
							discount.getDiscountType());
			if (!CollectionUtils.isEmpty(discountLocList)) {

				/*
				 * For location and start & end date combination, there should be only one
				 * discount code available
				 */
				throw new ServiceException(ConfigConstants.DISCOUNT_ALREADY_APPLICABLE, ConfigConstants.ERR_CONFIG_053);
			}
		}

		// checking duplicate location, start & end dates combination while
		// Adding(within discount)
		if (discountLocationDto.getValidity() != null && discountLocationMappingRepository.ifExists(discount.getId(),
				CalendarUtils.getStartOfDay(discountLocationDto.getValidity().getOfferStartDate()),
				CalendarUtils.getStartOfDay(discountLocationDto.getValidity().getOfferEndDate()), locationCode) > 0)
			throw new ServiceException(ConfigConstants.DISCOUNT_ALREADY_APPLICABLE, ConfigConstants.ERR_CONFIG_053);

		discountLocationMappingList.add(getLocationMappingDependents(locationCode, discount, discountLocationDto,
				new DiscountLocationMappingDaoExt()));
	}

	/**
	 * @param discountLocationDto
	 * @param discountLocationMappingList
	 * @param discountId
	 * @param location
	 * @param discount
	 */
	private void validateLocationUpdateRequest(DiscountLocationDto discountLocationDto,
			List<DiscountLocationMappingDaoExt> discountLocationMappingList, DiscountDaoExt discount,
			DiscountLocationMappingDaoExt location, String discountId) {

		Date startDate = new Date();
		Date endDate = new Date();
		if (discountLocationDto.getValidity() != null) {
			startDate = CalendarUtils.getStartOfDay(discountLocationDto.getValidity().getOfferStartDate());
			endDate = CalendarUtils.getStartOfDay(discountLocationDto.getValidity().getOfferEndDate());
		}

		// checking duplicate w.r.t to start & end dates combination while updating
		// range (within in same discount)
		if ((discountLocationDto.getValidity() != null || (discountLocationDto.getStatus() != null
				&& discountLocationDto.getStatus() == true && location.getIsActive() == false))
				&& discountLocationMappingRepository.ifUpdateExists(discount.getId(), location.getId(), startDate,
						endDate) > 0)
			throw new ServiceException(ConfigConstants.DISCOUNT_ALREADY_APPLICABLE, ConfigConstants.ERR_CONFIG_053);

		// checking duplicate w.r.t to start & end dates combination while
		// updating range (across discountType)
		if (discountLocationDto.getValidity() != null
				&& (discount.getDiscountType().equals(DiscountTypeEnum.COIN_OFFER_DISCOUNT.name())
						|| discount.getDiscountType().equals(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name()))
				&& discountLocationMappingRepository.ifDiscountExists(discount.getDiscountType(), location.getId(),
						startDate, endDate) > 0)
			throw new ServiceException(ConfigConstants.DISCOUNT_ALREADY_APPLICABLE, ConfigConstants.ERR_CONFIG_053);

		// checking duplicate w.r.t to location, start & end dates combination while
		// activating(across discountType)
		if (discountLocationDto.getStatus() != null && location.getIsActive() != null) {
			if (discountLocationDto.getStatus() == true && location.getIsActive() == false) {
				if ((discount.getDiscountType().equals(DiscountTypeEnum.COIN_OFFER_DISCOUNT.name())
						|| discount.getDiscountType().equals(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name()))
						&& discountLocationMappingRepository.ifDiscountExists(discount.getDiscountType(),
								location.getId(), location.getOfferStartDate(), location.getOfferEndDate()) > 0)
					throw new ServiceException(ConfigConstants.DISCOUNT_ALREADY_APPLICABLE,
							ConfigConstants.ERR_CONFIG_053);
			}
		}

		Set<String> addLocations = new HashSet<>();
		addLocations.add(location.getLocationCode());

		// checking duplicate w.r.t CFA, location, start & end dates combination while
		// activating(across discountType)
		if ((discount.getDiscountType().equals(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name())
				|| discount.getDiscountType().equals(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name()))
				&& ((discountLocationDto.getStatus() != null && discountLocationDto.getStatus() == true
						&& location.getIsActive() == false))) {

			List<DiscountLocProductGroupDto> discountLocList = discountLocationMappingRepository.checkMappedDiscount(
					discountId, addLocations, location.getOfferStartDate(), location.getOfferEndDate(),
					discount.getDiscountType());
			if (!CollectionUtils.isEmpty(discountLocList)) {

				throw new ServiceException(ConfigConstants.LOCATION_ALREADY_MAPPED, ConfigConstants.ERR_CONFIG_150,
						discountLocList);
			}
		}

		// checking duplicate w.r.t CFA, location, start & end dates combination while
		// updating range(across discountType)
		if (discountLocationDto.getValidity() != null
				&& (discount.getDiscountType().equals(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name())
						|| discount.getDiscountType().equals(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name()))) {
			List<DiscountLocProductGroupDto> discountLocList = discountLocationMappingRepository
					.checkMappedDiscount(discountId, addLocations, startDate, endDate, discount.getDiscountType());
			if (!CollectionUtils.isEmpty(discountLocList)) {

				throw new ServiceException(ConfigConstants.LOCATION_ALREADY_MAPPED, ConfigConstants.ERR_CONFIG_150,
						discountLocList);
			}
		}

		discountLocationMappingList
				.add(getLocationMappingDependents(location.getLocationCode(), discount, discountLocationDto, location));
	}

	/**
	 * @param removeLocations
	 * @param discount
	 */
	private void removeLocation(Set<String> removeLocations, DiscountDaoExt discount) {
		List<DiscountLocationMappingDaoExt> discountLocationMappingDaoList = discountLocationMappingRepository
				.findAllById(removeLocations);
		discountLocationMappingDaoList.forEach(loc -> {
			if (discount.getPublishTime() != null
					&& loc.getCreatedDate().getTime() < discount.getPublishTime().getTime()) {
				throw new ServiceException(ConfigConstants.LOCATIONS_CANNOT_BE_REMOVED, ConfigConstants.ERR_CONFIG_110,
						discount.getPublishTime());
			}
		});
		discountLocationMappingRepository.deleteAll(discountLocationMappingDaoList);
		discountLocationMappingRepository.flush();
	}

	/**
	 * @param discount
	 * @param locationMapping
	 * @return
	 */
	private List<DiscountLocationResponseDto> getLocationMappingResponse(DiscountDaoExt discount,
			List<DiscountLocationMappingDaoExt> locationMappingList) {

		List<DiscountLocationResponseDto> discountLocationMappingDtoList = new ArrayList<>();
		List<String> locationCodes = new ArrayList<>();
		locationMappingList.forEach(locationMappingDao -> locationCodes.add(locationMappingDao.getLocationCode()));

		LocationCacheRequestDto locationCacheRequestDto = new LocationCacheRequestDto();
		locationCacheRequestDto.setLocationCodes(locationCodes);

		List<LocationCacheDto> responseList = engineService.getStoreLocationDetails(locationCacheRequestDto)
				.getResults();

		Map<String, LocationCacheDto> responseMap = new HashMap<>();

		responseList.forEach(location -> responseMap.put(location.getLocationCode(), location));

		locationMappingList.forEach(locationMappingDao -> {
			DiscountLocationResponseDto discountLocationResponseDto = (DiscountLocationResponseDto) MapperUtil
					.getDtoMapping(locationMappingDao, DiscountLocationResponseDto.class);
			discountLocationResponseDto.setStatus(locationMappingDao.getIsActive());
			Object obj = MapperUtil.getJsonFromString(locationMappingDao.getConfigDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			discountLocationResponseDto.setConfigDetails(jsonData);

			discountLocationResponseDto
					.setDescription(responseMap.get(locationMappingDao.getLocationCode()).getDescription());
			discountLocationResponseDto
					.setSubBrandCode(responseMap.get(locationMappingDao.getLocationCode()).getSubBrandCode());
			discountLocationResponseDto
					.setIsDeletable(isDeletable(discount.getPublishTime(), locationMappingDao.getCreatedDate()));
			discountLocationMappingDtoList.add(discountLocationResponseDto);
		});
		return discountLocationMappingDtoList;
	}

	/**
	 * @param publishTime
	 * @param createdDate
	 * @return
	 */
	private Boolean isDeletable(Date publishTime, Date createdDate) {
		Boolean isDeletable;
		if (publishTime != null && createdDate.getTime() < publishTime.getTime()) {
			isDeletable = false;
		} else {
			isDeletable = true;
		}
		return isDeletable;
	}

	/**
	 * @param discountType
	 * @param discountLocationDto
	 * @param discount
	 */
	private void validateLocationMappingRequest(String discountType, DiscountLocationDto discountLocationDto,
			DiscountDaoExt discount) {

		DiscountTypeMetaDataDao discountTypeMetaDataDao = discountTypeMetaDataRepository
				.findByDiscountType(discountType);

		if (!discountTypeMetaDataDao.getLocationMapping())
			throw new ServiceException(ConfigConstants.LOCATION_MAPPING_NOT_ALLOWED_FOR_GIVEN_DISCOUNT_TYPE,
					ConfigConstants.ERR_CONFIG_054);

		if (discountLocationDto.getValidity() != null && discount.getIsPreviewApplicable() != null) {
			if (discount.getIsPreviewApplicable() && discountLocationDto.getValidity().getPreviewStartDate() != null
					&& discountLocationDto.getValidity().getPreviewEndDate() != null)
				if (discountLocationDto.getValidity().getPreviewStartDate()
						.before(discountLocationDto.getValidity().getOfferStartDate())
						|| discountLocationDto.getValidity().getPreviewEndDate()
								.after(discountLocationDto.getValidity().getOfferEndDate()))
					throw new ServiceException(ConfigConstants.INVALID_PREVIEW_START_DATE_OR_END_DATE,
							ConfigConstants.ERR_CONFIG_051);

			if ((discountLocationDto.getValidity().getOfferStartDate()
					.after(discountLocationDto.getValidity().getOfferEndDate())))
				throw new ServiceException(ConfigConstants.START_DATE_MUST_BE_BEFORE_END_DATE,
						ConfigConstants.ERR_CONFIG_052);

			if (discount.getIsPreviewApplicable() != null
					&& discountLocationDto.getValidity().getPreviewStartDate() != null
					&& discountLocationDto.getValidity().getPreviewEndDate() != null)
				if (discount.getIsPreviewApplicable() && (discountLocationDto.getValidity().getPreviewStartDate()
						.after(discountLocationDto.getValidity().getPreviewEndDate())))
					throw new ServiceException(ConfigConstants.START_DATE_MUST_BE_BEFORE_END_DATE,
							ConfigConstants.ERR_CONFIG_052);
		}

	}

	/**
	 * @param locationCode
	 * @param discount
	 * @param discountLocationDto
	 * @param discountLocationMapping
	 * @return
	 */
	private DiscountLocationMappingDaoExt getLocationMappingDependents(String locationCode, DiscountDaoExt discount,
			DiscountLocationDto discountLocationDto, DiscountLocationMappingDaoExt discountLocationMapping) {

		discountLocationMapping.setDiscount(discount);
		discountLocationMapping.setLocationCode(locationCode);
		if (discountLocationDto.getStatus() != null)
			discountLocationMapping.setIsActive(discountLocationDto.getStatus());
		if (discountLocationDto.getValidity() != null) {
			if (discountLocationDto.getValidity().getOfferStartDate() != null)
				discountLocationMapping.setOfferStartDate(discountLocationDto.getValidity().getOfferStartDate());
			if (discountLocationDto.getValidity().getOfferEndDate() != null)
				discountLocationMapping.setOfferEndDate(discountLocationDto.getValidity().getOfferEndDate());
			if (discount.getIsPreviewApplicable() != null && discount.getIsPreviewApplicable()) {
				if (discountLocationDto.getValidity().getPreviewStartDate() != null)
					discountLocationMapping
							.setPreviewStartDate(discountLocationDto.getValidity().getPreviewStartDate());
				if (discountLocationDto.getValidity().getPreviewEndDate() != null)
					discountLocationMapping.setPreviewEndDate(discountLocationDto.getValidity().getPreviewEndDate());
			}
		}

		if (discountLocationDto.getConfigDetails() != null)
			discountLocationMapping
					.setConfigDetails(MapperUtil.getStringFromJson(discountLocationDto.getConfigDetails()));
		if (discountLocationMapping.getSrcSyncId() == null)
			discountLocationMapping.setSrcSyncId(0);
		else
			discountLocationMapping.setSrcSyncId(discountLocationMapping.getSrcSyncId() + 1);
		discountLocationMapping.setDestSyncId(0);

		return discountLocationMapping;
	}

	/**
	 * @param syncDataList
	 * @param operation
	 * @param locationCodeList
	 * @param discountDaoExt
	 * @return SyncStaging
	 */
	@Transactional
	public SyncStagingDto saveToSyncStaging(List<SyncData> syncDataList, String operation,
			List<String> locationCodeList, String destinationType, DiscountDaoExt discountDaoExt) {
		SyncStagingDto discountSyncStagingDto = new SyncStagingDto();
		MessageRequest discountMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, locationCodeList,
				MessageType.GENERAL.toString(), destinationType);
		String discountRequestBody = MapperUtil.getJsonString(discountMsgRequest);
		SyncStaging discountStaggingMsg = new SyncStaging();
		discountStaggingMsg.setMessage(discountRequestBody);
		discountStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		discountStaggingMsg = configSyncStagingRepository.save(discountStaggingMsg);
		discountSyncStagingDto.setMessageRequest(discountMsgRequest);
		discountSyncStagingDto.setId(discountStaggingMsg.getId());
		if (discountDaoExt != null) {
			discountDaoExt.setPublishTime(new Date());
			discountDaoExt.setIsPublishPending(false);
			discountRepository.save(discountDaoExt);
		}
		return discountSyncStagingDto;
	}

	/**
	 * This method will create/remove mapping between discount and productGroup.
	 *
	 * @param discountCode
	 * @param discountProductGroupDto
	 * @return DiscountProductGroupDto
	 */
	@Override
	@Transactional
	public ListResponse<DiscountProductDto> discountProductGroupMapping(String discountId,
			DiscountProductGroupDto discountProductGroupDto, String discountDetailId, String karatType,
			String productType) {

		DiscountDaoExt discount = getDiscountDao(discountId);
		DiscountTypeMetaDataDao discountTypeMetaDataDao = discountTypeMetaDataRepository
				.findByDiscountType(discount.getDiscountType());

		if (discountTypeMetaDataDao == null) {
			throw new ServiceException(ConfigConstants.METADATA_IS_NOT_PRESENT_FOR_THIS_DISCOUNT_TYPE,
					ConfigConstants.ERR_CONFIG_081);
		}

		DiscountDetailsDaoExt discountDetailDao = null;
		if (discountDetailId != null)
			discountDetailDao = discountDetailsRepository.findById(discountDetailId)
					.orElseThrow(() -> new ServiceException(ConfigConstants.NO_DISCOUNT_DETAILS_FOUND,
							ConfigConstants.ERR_CONFIG_057));

		List<DiscountProductDto> discountProductGroupResponseList = new ArrayList<>();
		List<DiscountProductGroupMappingDaoExt> discountProductGroupMappingList = new ArrayList<>();

		if (discountProductGroupDto.getRemoveProducts() != null
				&& !discountProductGroupDto.getRemoveProducts().isEmpty()) {

			List<DiscountProductGroupMappingDaoExt> discountProductGroupRemoveList = discountProductGroupMappingRepository
					.findAllById(discountProductGroupDto.getRemoveProducts());
			discountProductGroupRemoveList.forEach(disProdMap -> {
				if (discount.getPublishTime() != null
						&& disProdMap.getCreatedDate().getTime() < discount.getPublishTime().getTime()) {
					throw new ServiceException(ConfigConstants.DISCOUNTS_PRODUCTS_CANNOT_BE_REMOVED,
							ConfigConstants.ERR_CONFIG_111, discount.getPublishTime());
				}

			});
			discountProductGroupMappingRepository.deleteAll(discountProductGroupRemoveList);
			discountProductGroupMappingRepository.flush();
		}
		List<String> productGroupList = new ArrayList<>();
		Set<String> productGroup = new HashSet<>();
		if (discountProductGroupDto.getUpdateProductGroupsDtoList() != null
				&& !discountProductGroupDto.getUpdateProductGroupsDtoList().isEmpty()) {

			DiscountProductGroupMappingDaoExt discountProduct1 = discountProductGroupMappingRepository
					.findOneById(discountProductGroupDto.getUpdateProductGroupsDtoList().get(0).getProductMappingId());

			discountProductGroupDto.getUpdateProductGroupsDtoList().forEach(dto -> {
				DiscountProductGroupMappingDaoExt discountProduct = discountProductGroupMappingRepository
						.findOneById(dto.getProductMappingId());
				if (dto.getIsActive() != null && dto.getIsActive() == true && discountProduct.getIsActive() == false) {
					productGroupList.add(discountProduct.getProductGroupCode());
					productGroup.add(discountProduct.getProductGroupCode());
				}
				if (discountProduct != null) {
					discountProduct.setSrcSyncId(discountProduct.getSrcSyncId() + 1);
					discountProduct.setIsActive(dto.getIsActive());
					discountProductGroupMappingList.add(discountProduct);
				}

			});
			if (!productGroupList.isEmpty()) {
				if ((discount.getDiscountType().equals(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name())
						|| discount.getDiscountType().equals(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name()))) {
					productMappingDuplicateCheckForSlabAndHigh(discountId, productGroupList, discount);
				}
				if (discount.getDiscountType().equals(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name())) {
					List<DiscountProductGroupMappingDaoExt> productsDaoExts = discountProductGroupMappingRepository
							.checkBasedOnKaratType(discountId, productGroupList);
					if (!CollectionUtils.isEmpty(productsDaoExts) && (!discountProduct1.getKaratType().equalsIgnoreCase("TEP"))) {
						Map<String, String> errorCause = new HashMap<>();
						errorCause.put("karatType", productsDaoExts.get(0).getKaratType());
						throw new ServiceException(ConfigConstants.PRODUCT_GROUP_ALREADY_MAPPED_TO,
								ConfigConstants.ERR_CONFIG_153, errorCause);
					}
				}
				// Duplicate product group mapping check among rules
				duplicateCheckforProductGroupsWithInRules(discountId, productGroup,
						discountProduct1.getDiscountDetail().getId());
				if (discount.getDiscountType().equals(DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name())) {
					List<DiscountProductGroupMappingDaoExt> productsDaoExts = discountProductGroupMappingRepository
							.checkBasedOnProductType(discountId, productGroupList);
					if (!CollectionUtils.isEmpty(productsDaoExts)) {
						Map<String, String> errorCause = new HashMap<>();
						errorCause.put("productType", productsDaoExts.get(0).getProductType());
						throw new ServiceException(ConfigConstants.PRODUCT_GROUP_ALREADY_MAPPED_TO_RIVAAH,
								ConfigConstants.ERR_CONFIG_167, errorCause);
					}
				}
			}
		}

		if (!discountProductGroupDto.getUpdateProducts().isEmpty()) {
			List<DiscountProductGroupMappingDaoExt> discountProductGroupUpdateList = discountProductGroupMappingRepository
					.findAllById(discountProductGroupDto.getUpdateProducts());

			discountProductGroupUpdateList.forEach(productGroupId -> {
				if (discountProductGroupDto.getIsActive() != null && discountProductGroupDto.getIsActive() == true
						&& productGroupId.getIsActive() == false) {

					productGroupList.add(productGroupId.getProductGroupCode());
				}
			});

			if (!productGroupList.isEmpty()) {
				if ((discount.getDiscountType().equals(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name())
						|| discount.getDiscountType().equals(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name()))) {
					productMappingDuplicateCheckForSlabAndHigh(discountId, productGroupList, discount);
				}
				if (discount.getDiscountType().equals(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name())) {
					List<DiscountProductGroupMappingDaoExt> productsDaoExts = discountProductGroupMappingRepository
							.checkBasedOnKaratType(discountId, productGroupList);
					if (!CollectionUtils.isEmpty(productsDaoExts) && (!discountProductGroupUpdateList.get(0).getKaratType().equalsIgnoreCase("TEP"))) {
						Map<String, String> errorCause = new HashMap<>();
						errorCause.put("karatType", productsDaoExts.get(0).getKaratType());
						throw new ServiceException(ConfigConstants.PRODUCT_GROUP_ALREADY_MAPPED_TO,
								ConfigConstants.ERR_CONFIG_153, errorCause);
					}
				}
				if (discount.getDiscountType().equals(DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name())) {
					List<DiscountProductGroupMappingDaoExt> productsDaoExts = discountProductGroupMappingRepository
							.checkBasedOnProductType(discountId, productGroupList);
					
					if (!CollectionUtils.isEmpty(productsDaoExts)) {
						Map<String, String> errorCause = new HashMap<>();
						errorCause.put("productType", productsDaoExts.get(0).getProductType());
						throw new ServiceException(ConfigConstants.PRODUCT_GROUP_ALREADY_MAPPED_TO_RIVAAH,
								ConfigConstants.ERR_CONFIG_167, errorCause);
					}
				}
			}
			discountProductGroupUpdateList.forEach(productGroupId -> {

				if (discountProductGroupDto.getEligibleKarat() != null) {
					productGroupId.setEligibleKarat(discountProductGroupDto.getEligibleKarat());
				}

				if (discountProductGroupDto.getIsActive() != null) {
					productGroupId.setIsActive(discountProductGroupDto.getIsActive());
				}

				productGroupId.setSrcSyncId(productGroupId.getSrcSyncId() + 1);
				discountProductGroupMappingList.add(productGroupId);

			});
			
		}

		if (!discountProductGroupDto.getAddProducts().isEmpty() && discountProductGroupDto.getAddProducts() != null) {
			List<String> productGroupList1 = discountProductGroupDto.getAddProducts().stream()
					.collect(Collectors.toList());
			if (!discountTypeMetaDataDao.getProductGroupMapping())
				throw new ServiceException(ConfigConstants.PRODUCT_GROUP_MAPPING_NOT_ALLOWED_FOR_GIVEN_DISCOUNT_TYPE,
						ConfigConstants.ERR_CONFIG_058);
			if (discount.getDiscountType().equals(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name())
					|| discount.getDiscountType().equals(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name())) {
				productMappingDuplicateCheckForSlabAndHigh(discountId, productGroupList1, discount);
			}
			if (discount.getDiscountType().equals(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name())
					&& (!karatType.equalsIgnoreCase("TEP"))) {
				List<DiscountProductGroupMappingDaoExt> productsDaoExts = discountProductGroupMappingRepository
						.checkBasedOnKaratType(discountId, productGroupList1);
				if (!CollectionUtils.isEmpty(productsDaoExts)) {
					Map<String, String> errorCause = new HashMap<>();
					errorCause.put("karatType", productsDaoExts.get(0).getKaratType());
					throw new ServiceException(ConfigConstants.PRODUCT_GROUP_ALREADY_MAPPED_TO,
							ConfigConstants.ERR_CONFIG_153, errorCause);
				}
			}
			if (discount.getDiscountType().equals(DiscountTypeEnum.RIVAAH_ASHIRWAAD_DISCOUNT.name())) {
				List<DiscountProductGroupMappingDaoExt> productsDaoExts = discountProductGroupMappingRepository
						.checkBasedOnProductType(discountId, productGroupList1);
				if (!CollectionUtils.isEmpty(productsDaoExts)) {
					Map<String, String> errorCause = new HashMap<>();
					errorCause.put("productType", productsDaoExts.get(0).getProductType());
					throw new ServiceException(ConfigConstants.PRODUCT_GROUP_ALREADY_MAPPED_TO_RIVAAH,
							ConfigConstants.ERR_CONFIG_167, errorCause);
				}
			}
			if (discountDetailDao != null) {
				// Duplicate product group mapping check among rules
				duplicateCheckforProductGroupsWithInRules(discountId, discountProductGroupDto.getAddProducts(),
						discountDetailDao.getId());
			}
			for (String productGroup1 : discountProductGroupDto.getAddProducts()) {

				discountProductGroupMappingList.add(addProductGroupMapping(discountProductGroupDto, discount,
						discountDetailDao, productGroup1, karatType, productType));
			}
			
			discountProductGroupMappingRepository.saveAll(discountProductGroupMappingList);
		}
		discount.setIsPublishPending(true);
		discount.setSrcSyncId(discount.getSrcSyncId() + 1);
		discountRepository.save(discount);
		discountProductGroupMappingList.forEach(discountProductGroup -> discountProductGroupResponseList
				.add(getProductMappingResponse(discountProductGroup, discount)));
		return new ListResponse<>(discountProductGroupResponseList);
	}

	/**
	 * @param discountDetailDao
	 * @param set
	 * @param discountId
	 * 
	 */
	private void duplicateCheckforProductGroupsWithInRules(String discountId, Set<String> productGroups,
			String discountDetailId) {
		List<DiscountProductGroupMappingDaoExt> disPrdDaoExt = discountProductGroupMappingRepository
				.getByDiscountAndProductGroup(discountId, productGroups, discountDetailId);

		if (!disPrdDaoExt.isEmpty()) {
			List<String> productGroupsList = new ArrayList<>();
			disPrdDaoExt.forEach(disPrd -> productGroupsList.add(disPrd.getProductGroupCode()));
			Map<String, String> dynamicValues = new HashMap<>();
			String productGroup = productGroupsList.stream()
				      .map(productG -> String.valueOf(productG))
				      .collect(Collectors.joining(",", "{", "}"));
			dynamicValues.put("productGroupCodes", productGroup);

			throw new ServiceException(ConfigConstants.PRODUCT_GROUP_ALREADY_MAPPED_TO_RULE,
					ConfigConstants.ERR_CONFIG_161,dynamicValues);
		}
	}

	/**
	 * @param discount
	 * @param productGroupList
	 * @param discountId
	 * 
	 */
	private void productMappingDuplicateCheckForSlabAndHigh(String discountId, List<String> productGroupList,
			DiscountDaoExt discount) {

		List<DiscountLocationMappingDaoExt> commonLocations = discountProductGroupMappingRepository
				.getMappedActiveLocations(discountId, productGroupList, discount.getDiscountType());

		Set<String> locationcodes = new HashSet<>();

		List<DiscountLocationMappingDaoExt> invalidMappings = new ArrayList<>();

		if (!commonLocations.isEmpty()) {
			commonLocations.forEach(loc -> locationcodes.add(loc.getLocationCode()));
			List<DiscountLocationMappingDaoExt> locations = discountLocationMappingRepository
					.findByDiscountIdAndIsActiveAndLocationCodeIn(discountId, true, locationcodes);
			locations.forEach(loc -> {
				commonLocations.forEach(commonLoc -> {
					if (loc.getLocationCode().equals(commonLoc.getLocationCode())) {
						if ((loc.getOfferStartDate().before(commonLoc.getOfferStartDate())
								&& loc.getOfferEndDate().after(commonLoc.getOfferEndDate()))
								|| (commonLoc.getOfferStartDate().before(loc.getOfferStartDate())
										&& commonLoc.getOfferEndDate().after(loc.getOfferEndDate()))) {
							invalidMappings.add(commonLoc);
						}
					}
				});
			});
		}

		if (!CollectionUtils.isEmpty(invalidMappings)) {
			Map<String, String> errorCause = new HashMap<>();
			errorCause.put("discountCode", invalidMappings.get(0).getDiscount().getDiscountCode());
			throw new ServiceException(ConfigConstants.PRODUCT_GROUP_ALREADY_MAPPED, ConfigConstants.ERR_CONFIG_148,
					errorCause);
		}
	}

	/**
	 * @param discountProductGroup
	 * @param discount
	 * @return
	 */
	private DiscountProductDto getProductMappingResponse(DiscountProductGroupMappingDaoExt discountProductGroup,
			DiscountDaoExt discount) {
		DiscountProductDto discountProductGroupDto = (DiscountProductDto) MapperUtil.getDtoMapping(discountProductGroup,
				DiscountProductDto.class);
		discountProductGroupDto.setDiscountId(discountProductGroup.getDiscount().getId());
		if (discountProductGroup.getDiscountDetail() != null)
			discountProductGroupDto.setDiscountDetailsId(discountProductGroup.getDiscountDetail().getId());
		Map<String, String> productGroupList = engineService.getProductGroups(null);
		discountProductGroupDto.setDescription(productGroupList.get(discountProductGroup.getProductGroupCode()));
		discountProductGroupDto
				.setIsDeletable(isDeletable(discount.getPublishTime(), discountProductGroup.getCreatedDate()));
		discountProductGroupDto.setIsActive(discountProductGroup.getIsActive());
		return discountProductGroupDto;
	}

	/**
	 * @param discountProductGroupDto
	 * @param discount
	 * @param discountDetailsDao
	 * @param productGroup
	 * @param karatType
	 * @param productGroupType
	 * @return
	 */
	private DiscountProductGroupMappingDaoExt addProductGroupMapping(DiscountProductGroupDto discountProductGroupDto,
			DiscountDaoExt discount, DiscountDetailsDaoExt discountDetailsDao, String productGroup, String karatType,
			String productType) {
		DiscountProductGroupMappingDaoExt discountProductGroupMappingDao = new DiscountProductGroupMappingDaoExt();
		discountProductGroupMappingDao.setDiscount(discount);
		discountProductGroupMappingDao.setProductGroupCode(productGroup);
		if (discountDetailsDao != null)
			discountProductGroupMappingDao.setDiscountDetail(discountDetailsDao);
		if (karatType != null)
			discountProductGroupMappingDao.setKaratType(karatType);
		if (productType != null)
			discountProductGroupMappingDao.setProductType(productType);
		if (discountProductGroupDto.getEligibleKarat() != null)
			discountProductGroupMappingDao.setEligibleKarat(discountProductGroupDto.getEligibleKarat());
		if (discountProductGroupDto.getIsActive() != null)
			discountProductGroupMappingDao.setIsActive(discountProductGroupDto.getIsActive());
		return discountProductGroupMappingDao;
	}

	@Override
	public ListResponse<DiscountThemeUpdateResponseDto> updateTheme(String discountId, String excludeType,
			@Valid DiscountThemeRequestDto discountThemeRequestDto) {

		List<DiscountThemeUpdateResponseDto> themeUpdateResponseDtos = new ArrayList<>();
		List<DiscountExcludeMappingDaoExt> discountExcludeMappingDaoList = new ArrayList<>();
		DiscountDaoExt discount = getDiscountDao(discountId);

		removeDiscountTheme(discount, discountThemeRequestDto);

		addDiscountTheme(discountThemeRequestDto, excludeType, discount, discountExcludeMappingDaoList);

		updateDiscountTheme(discount, discountThemeRequestDto);

		discountExcludeMappingDaoList.forEach(record -> {
			DiscountThemeUpdateResponseDto themeUpdateResponseDto = (DiscountThemeUpdateResponseDto) MapperUtil
					.getDtoMapping(record, DiscountThemeUpdateResponseDto.class);
			themeUpdateResponseDto.setDiscountId(record.getDiscount().getId());
			themeUpdateResponseDtos.add(themeUpdateResponseDto);
		});
		return new ListResponse<>(themeUpdateResponseDtos);
	}

	/**
	 * @param discount
	 * @param discountThemeRequestDto
	 */
	private void updateDiscountTheme(DiscountDaoExt discount, @Valid DiscountThemeRequestDto discountThemeRequestDto) {
		if (!CollectionUtils.isEmpty(discountThemeRequestDto.getUpdateThemes())) {

			List<DiscountExcludeMappingDaoExt> discountExcludeMappingDaoList = discountExcludeMappingRepository
					.findAllById(discountThemeRequestDto.getUpdateThemes());
			discountExcludeMappingDaoList.forEach(discExclude -> {
				discExclude.setIsActive(discountThemeRequestDto.getIsActive());
				discExclude.setSrcSyncId(discExclude.getSrcSyncId() + 1);
			});
			discountExcludeMappingRepository.saveAll(discountExcludeMappingDaoList);

			discount.setIsPublishPending(true);
			discount.setSrcSyncId(discount.getSrcSyncId() + 1);
			discountRepository.save(discount);
		}

	}

	/**
	 * @param discount
	 * @param discountThemeRequestDto
	 */
	private void removeDiscountTheme(DiscountDaoExt discount, @Valid DiscountThemeRequestDto discountThemeRequestDto) {

		if (!CollectionUtils.isEmpty(discountThemeRequestDto.getRemoveThemes())) {

			List<DiscountExcludeMappingDaoExt> discountExcludeMappingDaoList = discountExcludeMappingRepository
					.findAllById(discountThemeRequestDto.getRemoveThemes());
			discountExcludeMappingDaoList.forEach(discExclude -> {
				if (discount.getPublishTime() != null
						&& discExclude.getCreatedDate().getTime() < discount.getPublishTime().getTime()) {
					throw new ServiceException(ConfigConstants.DISCOUNTS_THEMES_CANNOT_BE_REMOVED,
							ConfigConstants.ERR_CONFIG_116, discount.getPublishTime());
				}
			});
			discountExcludeMappingRepository.deleteAll(discountExcludeMappingDaoList);
			discountExcludeMappingRepository.flush();
			discount.setIsPublishPending(true);
			discount.setSrcSyncId(discount.getSrcSyncId() + 1);
			discountRepository.save(discount);
		}

	}

	/**
	 * @param discountThemeRequestDto
	 * @param excludeType
	 * @param discount
	 * @param discountExcludeMappingDaoList
	 */
	private void addDiscountTheme(@Valid DiscountThemeRequestDto discountThemeRequestDto, String excludeType,
			DiscountDaoExt discount, List<DiscountExcludeMappingDaoExt> discountExcludeMappingDaoList) {
		discountThemeRequestDto.getAddThemes().forEach(record -> {
			DiscountExcludeMappingDaoExt discountExcludeMappingDao = new DiscountExcludeMappingDaoExt();
			discountExcludeMappingDao.setDiscount(discount);
			discountExcludeMappingDao.setThemeCode(record);
			if (discountThemeRequestDto.getIsActive() != null)
				discountExcludeMappingDao.setIsActive(discountThemeRequestDto.getIsActive());
			discountExcludeMappingDao.setExcludeType(excludeType);
			discountExcludeMappingDaoList.add(discountExcludeMappingDao);
		});
		if (!StringUtils.isEmpty(discountExcludeMappingDaoList)) {
			discountExcludeMappingRepository.saveAll(discountExcludeMappingDaoList);
			discount.setIsPublishPending(true);
			discount.setSrcSyncId(discount.getSrcSyncId() + 1);
			discountRepository.save(discount);
		}

	}

	@Override
	public ListResponse<DiscountSchemeUpdateResponseDto> updateScheme(String discountId, String excludeType,
			DiscountSchemeRequestDto discountSchemeRequestDto) {
		List<DiscountSchemeUpdateResponseDto> schemeUpdateResponseDtos = new ArrayList<>();
		List<DiscountExcludeMappingDaoExt> discountExcludeMappingDaoList = new ArrayList<>();
		DiscountDaoExt discount = getDiscountDao(discountId);

		removeDiscountScheme(discount, discountSchemeRequestDto);

		addDiscountScheme(discountSchemeRequestDto, excludeType, discount, discountExcludeMappingDaoList);

		updateDiscountScheme(discount, discountSchemeRequestDto);

		discountExcludeMappingDaoList.forEach(record -> {
			DiscountSchemeUpdateResponseDto schemeUpdateResponseDto = (DiscountSchemeUpdateResponseDto) MapperUtil
					.getDtoMapping(record, DiscountSchemeUpdateResponseDto.class);
			schemeUpdateResponseDto.setDiscountId(record.getDiscount().getId());
			schemeUpdateResponseDtos.add(schemeUpdateResponseDto);
		});
		return new ListResponse<>(schemeUpdateResponseDtos);
	}

	private void removeDiscountScheme(DiscountDaoExt discount, DiscountSchemeRequestDto discountSchemeRequestDto) {
		if (!CollectionUtils.isEmpty(discountSchemeRequestDto.getRemoveSchemes())) {

			List<DiscountExcludeMappingDaoExt> discountExcludeMappingDaoList = discountExcludeMappingRepository
					.findAllById(discountSchemeRequestDto.getRemoveSchemes());
			discountExcludeMappingRepository.deleteAll(discountExcludeMappingDaoList);
			discountExcludeMappingRepository.flush();
			discount.setIsPublishPending(true);
			discount.setSrcSyncId(discount.getSrcSyncId() + 1);
			discountRepository.save(discount);
		}
	}

	private void addDiscountScheme(DiscountSchemeRequestDto discountSchemeRequestDto, String excludeType,
			DiscountDaoExt discount, List<DiscountExcludeMappingDaoExt> discountExcludeMappingDaoList) {
		discountSchemeRequestDto.getAddSchemes().forEach(record -> {
			DiscountExcludeMappingDaoExt discountExcludeMappingDao = new DiscountExcludeMappingDaoExt();
			discountExcludeMappingDao.setDiscount(discount);
			discountExcludeMappingDao.setSchemeCode(record);
			if (discountSchemeRequestDto.getIsActive() != null)
				discountExcludeMappingDao.setIsActive(discountSchemeRequestDto.getIsActive());
			discountExcludeMappingDao.setExcludeType(excludeType);
			List<DiscountExcludeMappingDaoExt> schemeExists = discountExcludeMappingRepository
					.findAllByDiscountAndSchemeCode(discount, record);
			if (!CollectionUtil.isEmpty(schemeExists))
				throw new ServiceException("SchemeCode is Already mapped to the discount", "ERR-CONFIG-176");
			discountExcludeMappingDaoList.add(discountExcludeMappingDao);
		});
		if (!StringUtils.isEmpty(discountExcludeMappingDaoList)) {
			discountExcludeMappingRepository.saveAll(discountExcludeMappingDaoList);
			discount.setIsPublishPending(true);
			discount.setSrcSyncId(discount.getSrcSyncId() + 1);
			discountRepository.save(discount);
		}

	}

	private void updateDiscountScheme(DiscountDaoExt discount, DiscountSchemeRequestDto discountSchemeRequestDto) {
		if (!CollectionUtils.isEmpty(discountSchemeRequestDto.getUpdateSchemes())) {

			List<DiscountExcludeMappingDaoExt> discountExcludeMappingDaoList = discountExcludeMappingRepository
					.findAllById(discountSchemeRequestDto.getUpdateSchemes());
			discountExcludeMappingDaoList.forEach(discExclude -> {
				discExclude.setIsActive(discountSchemeRequestDto.getIsActive());
				discExclude.setSrcSyncId(discExclude.getSrcSyncId() + 1);
			});
			discountExcludeMappingRepository.saveAll(discountExcludeMappingDaoList);

			discount.setIsPublishPending(true);
			discount.setSrcSyncId(discount.getSrcSyncId() + 1);
			discountRepository.save(discount);
		}

	}

	@Override
	public ListResponse<ItemThemeUpdateResponseDto> updateItemThemeMapping(String discountId,
			@Valid ItemThemeUpdateDto itemThemeUpdateDto) {

		DiscountDaoExt discount = getDiscountDao(discountId);

		List<ItemThemeUpdateResponseDto> itemThemeUpdateResponseDtoList = new ArrayList<>();
		List<String> ids = new ArrayList<>();
		itemThemeUpdateDto.getUpdateItems().forEach(updateItem -> ids.add(updateItem.getId()));
		List<DiscountExcludeMappingDaoExt> discountExcludeMappingDaoList = discountExcludeMappingRepository
				.findAllById(ids);

		Map<String, DiscountExcludeMappingDaoExt> discountExcludeMappingMap = getDiscountExcludeMappingMap(
				discountExcludeMappingDaoList);

		List<DiscountExcludeMappingDaoExt> discountExcludeMappingDaos = new ArrayList<>();
		itemThemeUpdateDto.getUpdateItems().forEach(record -> {
			DiscountExcludeMappingDaoExt discountExcludeMappingDao = discountExcludeMappingMap.get(record.getId());
			discountExcludeMappingDao.setIsExcluded(record.getIsExcluded());
			discountExcludeMappingDao.setSrcSyncId(discountExcludeMappingDao.getSrcSyncId() + 1);
			if (record.getIsActive() != null)
				discountExcludeMappingDao.setIsActive(record.getIsActive());
			discountExcludeMappingDaos.add(discountExcludeMappingDao);
		});
		discountExcludeMappingRepository.saveAll(discountExcludeMappingDaos);
		discountExcludeMappingDaos.forEach(record -> {
			ItemThemeUpdateResponseDto itemThemeUpdateResponseDto = (ItemThemeUpdateResponseDto) MapperUtil
					.getDtoMapping(record, ItemThemeUpdateResponseDto.class);
			itemThemeUpdateResponseDto.setDiscountId(discount.getId());
			itemThemeUpdateResponseDtoList.add(itemThemeUpdateResponseDto);

		});
		discount.setIsPublishPending(true);
		discount.setSrcSyncId(discount.getSrcSyncId() + 1);
		discountRepository.save(discount);
		return new ListResponse<>(itemThemeUpdateResponseDtoList);
	}

	@Override
	public PagedRestResponse<List<ItemThemeMappingDto>> listItemThemeMapping(String discountId, String excludeType,
			Boolean isExcluded, String itemCode, Pageable pageable, Boolean isPageable) {

		DiscountDaoExt discount = getDiscountDao(discountId);

		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}

		List<ItemThemeMappingDto> itemThemeMappingDtoList = new ArrayList<>();

		Page<DiscountExcludeMappingDaoExt> discountExcludeMappingPageList = discountExcludeMappingRepository
				.findAllByFilters(discountId, excludeType, isExcluded, itemCode, pageable);

		if (discountExcludeMappingPageList != null) {
			discountExcludeMappingPageList.forEach(record -> {
				ItemThemeMappingDto itemThemeMappingDto = (ItemThemeMappingDto) MapperUtil.getDtoMapping(record,
						ItemThemeMappingDto.class);
				itemThemeMappingDto.setDiscountId(discount.getId());
				itemThemeMappingDto.setExcludeType(excludeType);
				itemThemeMappingDto.setIsActive(record.getIsActive());
				itemThemeMappingDto.setIsDeletable(isDeletable(discount.getPublishTime(), discount.getCreatedDate()));
				itemThemeMappingDtoList.add(itemThemeMappingDto);
			});
		}

		return new PagedRestResponse<>(itemThemeMappingDtoList, discountExcludeMappingPageList);
	}

	/**
	 * @param discountExcludeMappingDaoList
	 * @return
	 */
	private Map<String, DiscountExcludeMappingDaoExt> getDiscountExcludeMappingMap(
			List<DiscountExcludeMappingDaoExt> discountExcludeMappingDaoList) {
		Map<String, DiscountExcludeMappingDaoExt> discountExcludeMappingMap = new HashMap<>();
		discountExcludeMappingDaoList.forEach(record -> discountExcludeMappingMap.put(record.getId(), record));
		return discountExcludeMappingMap;
	}

	@Override
	@Transactional
	public ListResponse<DiscountExcludeMappingRangeDto> updateMakingChargeOrComplexityPercent(String discountId,
			String excludeType, UpdateRangeDto updateRangeDto) {

		DiscountDaoExt discount = getDiscountDao(discountId);

		List<DiscountExcludeMappingRangeDto> discountExcludeMappingRangeDto = new ArrayList<>();
		List<DiscountExcludeMappingDaoExt> discountExcludeMappingDaoList = new ArrayList<>();

		if (!CollectionUtils.isEmpty(updateRangeDto.getRemoveValues())) {

			List<DiscountExcludeMappingDaoExt> discountExcludeMappingRemoveList = discountExcludeMappingRepository
					.findAllById(updateRangeDto.getRemoveValues());
			discountExcludeMappingRemoveList.forEach(discExclude -> {
				if (discount.getPublishTime() != null
						&& discExclude.getCreatedDate().getTime() < discount.getPublishTime().getTime()) {
					throw new ServiceException(ConfigConstants.MC_COMPLEXIY_PERCENT_CANNOT_BE_REMOVED,
							ConfigConstants.ERR_CONFIG_112, discount.getPublishTime());
				}
			});
			discountExcludeMappingRepository.deleteAll(discountExcludeMappingRemoveList);
			discountExcludeMappingRepository.flush();
		}
		if (!CollectionUtils.isEmpty(updateRangeDto.getUpdateValue())) {
			List<String> ids = new ArrayList<>();
			updateRangeDto.getUpdateValue().forEach(addValue -> ids.add(addValue.getId()));
			List<DiscountExcludeMappingDaoExt> discountExcludeMappingList = discountExcludeMappingRepository
					.findAllById(ids);
			Map<String, DiscountExcludeMappingDaoExt> discountExcludeMappingMap = getDiscountExcludeMappingMap(
					discountExcludeMappingList);
			updateRangeDto.getUpdateValue()
					.forEach(record -> discountExcludeMappingDaoList
							.add(updateRange(record, discountExcludeMappingMap.get(record.getId()), discount,
									excludeType, updateRangeDto.getIsActive())));
		}
		if (!CollectionUtils.isEmpty(updateRangeDto.getAddValues()))
			updateRangeDto.getAddValues().forEach(record -> discountExcludeMappingDaoList
					.add(addRange(record, discount, excludeType, updateRangeDto.getIsActive())));
		discountExcludeMappingRepository.saveAll(discountExcludeMappingDaoList);
		discount.setIsPublishPending(true);
		discount.setSrcSyncId(discount.getSrcSyncId() + 1);
		discountRepository.save(discount);
		discountExcludeMappingDaoList
				.forEach(record -> discountExcludeMappingRangeDto.add(getExcludeMappingResponse(record)));
		return new ListResponse<>(discountExcludeMappingRangeDto);
	}

	/**
	 * @param record
	 * @return
	 */
	private DiscountExcludeMappingRangeDto getExcludeMappingResponse(DiscountExcludeMappingDaoExt record) {
		DiscountExcludeMappingRangeDto excludeMappingRangeDto = (DiscountExcludeMappingRangeDto) MapperUtil
				.getDtoMapping(record, DiscountExcludeMappingRangeDto.class);
		excludeMappingRangeDto.setDiscountId(record.getDiscount().getId());
		return excludeMappingRangeDto;
	}

	/**
	 * @param record
	 * @param discount
	 * @param excludeType
	 * @param status
	 * @return
	 */
	private DiscountExcludeMappingDaoExt addRange(@Valid DiscountAddRangeDto record, DiscountDaoExt discount,
			String excludeType, Boolean status) {
		DiscountExcludeMappingDaoExt discountExcludeMappingDao = new DiscountExcludeMappingDaoExt();
		discountExcludeMappingDao.setFromValue(record.getFromValue());
		discountExcludeMappingDao.setToValue(record.getToValue());
		discountExcludeMappingDao.setDiscount(discount);
		discountExcludeMappingDao.setExcludeType(excludeType);
		if (status != null)
			discountExcludeMappingDao.setIsActive(status);
		return discountExcludeMappingDao;
	}

	/**
	 * @param record
	 * @param discountExcludeMappingDao
	 * @param excludeType
	 * @param discount
	 * @param status
	 * @return
	 */
	private DiscountExcludeMappingDaoExt updateRange(@Valid DiscountUpdateRangeDto record,
			DiscountExcludeMappingDaoExt discountExcludeMappingDao, DiscountDaoExt discount, String excludeType,
			Boolean status) {
		if (record.getFromValue() != null)
			discountExcludeMappingDao.setFromValue(record.getFromValue());
		if (record.getToValue() != null)
			discountExcludeMappingDao.setToValue(record.getToValue());
		discountExcludeMappingDao.setDiscount(discount);
		discountExcludeMappingDao.setExcludeType(excludeType);
		discountExcludeMappingDao.setSrcSyncId(discountExcludeMappingDao.getSrcSyncId() + 1);
		if (status != null)
			discountExcludeMappingDao.setIsActive(status);
		return discountExcludeMappingDao;
	}

	@Transactional
	@Override
	public ListResponse<ProductCategoryUpdateResponseDto> updateProductCategory(String discountId,
			ProductCategoryUpdateDto productCategoryUpdateDto) {

		DiscountDaoExt discount = getDiscountDao(discountId);

		List<DiscountProductCategoryMappingDaoExt> discountProductCategoryList = new ArrayList<>();
		List<ProductCategoryUpdateResponseDto> productCategoryResponseDtoList = new ArrayList<>();

		DiscountTypeMetaDataDao discountTypeMetaDataDao = discountTypeMetaDataRepository
				.findByDiscountType(discount.getDiscountType());
		if (discountTypeMetaDataDao == null) {
			throw new ServiceException(ConfigConstants.METADATA_IS_NOT_PRESENT_FOR_THIS_DISCOUNT_TYPE,
					ConfigConstants.ERR_CONFIG_081);
		}

		if (!CollectionUtils.isEmpty(productCategoryUpdateDto.getRemoveProductCategories())) {

			removeProductCategoryMapping(productCategoryUpdateDto, discount);
		}

		if (!CollectionUtils.isEmpty(productCategoryUpdateDto.getAddProductCategories())
				&& !discountTypeMetaDataDao.getProductCategoryMapping())

			throw new ServiceException(ConfigConstants.PRODUCT_CATEGORY_MAPPING_NOT_ALLOWED_FOR_GIVEN_DISCOUNT_TYPE,
					ConfigConstants.ERR_CONFIG_059);

		if (!CollectionUtils.isEmpty(productCategoryUpdateDto.getUpdateProductCategories())) {
			Map<String, DiscountProductCategoryMappingDaoExt> discountProductCategoryMap = getDiscountProductCategoryMap(
					productCategoryUpdateDto.getUpdateProductCategories());
			productCategoryUpdateDto.getUpdateProductCategories().forEach(id -> {
				DiscountProductCategoryMappingDaoExt discountProductCategoryMappingDao = discountProductCategoryMap
						.get(id);
				discountProductCategoryMappingDao.setSrcSyncId(discountProductCategoryMappingDao.getSrcSyncId() + 1);
				if (productCategoryUpdateDto.getIsActive() != null)
					discountProductCategoryMappingDao.setIsActive(productCategoryUpdateDto.getIsActive());
				discountProductCategoryList.add(discountProductCategoryMappingDao);
			});
		}
		if (!CollectionUtils.isEmpty(productCategoryUpdateDto.getAddProductCategories()))
			productCategoryUpdateDto.getAddProductCategories()
					.forEach(productCategoryCode -> discountProductCategoryList.add(
							addProductCategory(productCategoryCode, discount, productCategoryUpdateDto.getIsActive())));
		discountProductCategoryMappingRepository.saveAll(discountProductCategoryList);
		discount.setIsPublishPending(true);
		discount.setSrcSyncId(discount.getSrcSyncId() + 1);
		discountRepository.save(discount);
		discountProductCategoryList.forEach(
				productCategory -> productCategoryResponseDtoList.add(getProductCategoryResponse(productCategory)));

		return new ListResponse<>(productCategoryResponseDtoList);
	}

	private ProductCategoryUpdateResponseDto getProductCategoryResponse(
			DiscountProductCategoryMappingDaoExt productCategory) {

		ProductCategoryUpdateResponseDto categoryResponse = (ProductCategoryUpdateResponseDto) MapperUtil
				.getDtoMapping(productCategory, ProductCategoryUpdateResponseDto.class);
		Map<String, String> productCategoryMap = engineService.getProductCategories();
		categoryResponse.setDescription(productCategoryMap.get(productCategory.getProductCategoryCode()));
		return categoryResponse;
	}

	/**
	 * @param productCategoryUpdateDto
	 * @param discount
	 */
	private void removeProductCategoryMapping(ProductCategoryUpdateDto productCategoryUpdateDto,
			DiscountDaoExt discount) {
		List<DiscountProductCategoryMappingDaoExt> discountProductCategoryRemove = discountProductCategoryMappingRepository
				.findAllById(productCategoryUpdateDto.getRemoveProductCategories());
		discountProductCategoryRemove.forEach(discProdCat -> {
			if (discount.getPublishTime() != null
					&& discProdCat.getCreatedDate().getTime() < discount.getPublishTime().getTime()) {
				throw new ServiceException(ConfigConstants.DISCOUNTS_PRODUCT_CATEGORIES_CANNOT_BE_REMOVED,
						ConfigConstants.ERR_CONFIG_113, discount.getPublishTime());
			}
		});

		discountProductCategoryMappingRepository.deleteAll(discountProductCategoryRemove);
		discountProductCategoryMappingRepository.flush();
	}

	/**
	 * @param set
	 * @return
	 */
	private Map<String, DiscountProductCategoryMappingDaoExt> getDiscountProductCategoryMap(Set<String> ids) {
		List<DiscountProductCategoryMappingDaoExt> discountProductCategory = discountProductCategoryMappingRepository
				.findAllById(ids);
		Map<String, DiscountProductCategoryMappingDaoExt> discountProductCategoryMappinMap = new HashMap<>();
		discountProductCategory.forEach(record -> discountProductCategoryMappinMap.put(record.getId(), record));
		return discountProductCategoryMappinMap;
	}

	/**
	 * @param record
	 * @param discount
	 * @param status
	 * @param isActive
	 * @return
	 */
	private DiscountProductCategoryMappingDaoExt addProductCategory(String productCategoryCode, DiscountDaoExt discount,
			Boolean status) {
		DiscountProductCategoryMappingDaoExt discountProductCategoryMappingDao = new DiscountProductCategoryMappingDaoExt();
		discountProductCategoryMappingDao.setProductCategoryCode(productCategoryCode);
		discountProductCategoryMappingDao.setDiscount(discount);
		if (status != null)
			discountProductCategoryMappingDao.setIsActive(status);
		return discountProductCategoryMappingDao;
	}

	@Override
	public PagedRestResponse<List<ProductCategoryResponseDto>> listProductCategory(String discountId,
			String productCategoryCode, Boolean isPageable, Pageable pageable) {

		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}

		DiscountDaoExt discount = getDiscountDao(discountId);
		List<ProductCategoryResponseDto> productCategoryResponseDtoList = new ArrayList<>();
		DiscountProductCategoryMappingDaoExt discountProductCategoryMappingDao = new DiscountProductCategoryMappingDaoExt();
		discountProductCategoryMappingDao.setProductCategoryCode(productCategoryCode);
		discountProductCategoryMappingDao.setDiscount(discount);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<DiscountProductCategoryMappingDaoExt> criteria = Example.of(discountProductCategoryMappingDao, matcher);

		Page<DiscountProductCategoryMappingDaoExt> discountProductCategoryList = discountProductCategoryMappingRepository
				.findAll(criteria, pageable);
		if (discountProductCategoryList != null) {
			discountProductCategoryList.forEach(record -> {
				ProductCategoryResponseDto productCategory = (ProductCategoryResponseDto) MapperUtil
						.getDtoMapping(record, ProductCategoryResponseDto.class);
				productCategory.setDiscountId(record.getDiscount().getId());
				Map<String, String> productCategoryMap = engineService.getProductCategories();
				productCategory.setDescription(productCategoryMap.get(productCategory.getProductCategoryCode()));
				productCategory.setIsDeletable(isDeletable(discount.getPublishTime(), discount.getCreatedDate()));
				productCategoryResponseDtoList.add(productCategory);
			});
		}
		return new PagedRestResponse<>(productCategoryResponseDtoList, discountProductCategoryList);
	}

	/**
	 * This method will save the DiscountSlab details.
	 *
	 * @param discountSlabDto
	 * @return DiscountSlabResponseDto
	 */
	@Override
	@Transactional
	public ListResponse<DiscountDetailsUpdateResponseDto> updateDiscountDetails(DiscountDetailsDto discountDetailsDto,
			String discountId) {

		List<DiscountDetailsDaoExt> discountDetailsDaoList = new ArrayList<>();
		List<DiscountDetailsUpdateResponseDto> discountSlabResponseDtoList = new ArrayList<>();
		DiscountDaoExt discount = getDiscountDao(discountId);

		if (discountDetailsDto.getRemoveDetails() != null && !discountDetailsDto.getRemoveDetails().isEmpty()) {
			removeDiscountDetails(discountDetailsDto.getRemoveDetails(), discount);
		}

		if ((discountDetailsDto.getUpdateDetails()!= null && !CollectionUtils.isEmpty(discountDetailsDto.getUpdateDetails()))
				|| (discountDetailsDto.getDiscountComponents() != null && !CollectionUtils.isEmpty(discountDetailsDto.getDiscountComponents()))) {

			if (!CollectionUtils.isEmpty(discountDetailsDto.getUpdateDetails())) {
				if (discount.getDiscountType().equals(DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name())) {
					Optional<DiscountDetailsDaoExt> discountDetailsDaoExt = discountDetailsRepository
							.findById(discountDetailsDto.getUpdateDetails().get(0));
					if (discountDetailsDto.getConfigDetails() != null) {
						if (discountDetailsDaoExt.isPresent()) {
							if (discountDetailsDto.getIsActive() != null && discountDetailsDto.getIsActive() == true
									&& discountDetailsDaoExt.get().getIsActive() == false) {
								List<DiscountDetailsDaoExt> discountDetails =	discountDetailsRepository.checkIfSlabExist(discountDetailsDaoExt.get().getMinValue(), discountDetailsDaoExt.get().getMaxValue(),discountDetailsDaoExt.get().getDiscount().getId());
								if(!discountDetails.isEmpty()) {
									throw new ServiceException("Slab is Already Defined","ERR-CONFIG-181");
								}
									
							}
							discountDetailsDaoList.add(addDiscountDetailsDepends(discountDetailsDto.getConfigDetails(),
									discount, discountDetailsDaoExt.get(), discountDetailsDto.getIsActive(),
									discountDetailsDto.getDiscountPercent()));
						}

					} else {
						discountDetailsDaoList
								.add(addDiscountDetailsDepends(null, discount, discountDetailsDaoExt.get(),
										discountDetailsDto.getIsActive(), discountDetailsDto.getDiscountPercent()));
					}
				} else {
					Optional<DiscountDetailsDaoExt> discountDetailsDaoExt = discountDetailsRepository
							.findById(discountDetailsDto.getUpdateDetails().get(0));
					if (discountDetailsDaoExt.isPresent()) {
						if(discountDetailsDto.getIsActive() == true && discountDetailsDaoExt.get().getIsActive() == false) {
							List<DiscountDetailsDaoExt> discountDetails =	discountDetailsRepository.checkIfSlabExist(discountDetailsDaoExt.get().getMinValue(), discountDetailsDaoExt.get().getMaxValue(),discountDetailsDaoExt.get().getDiscount().getId());
							if(!discountDetails.isEmpty()) {
								throw new ServiceException("Slab is Already Defined","ERR-CONFIG-181");
							}
								
						}
					}
					Map<String, DiscountDetailsDaoExt> discountSlabMap = getDiscountSlabDaoMap(
							discountDetailsDto.getUpdateDetails());
					
					discountDetailsDto.getUpdateDetails()
							.forEach(discountSlabId -> discountDetailsDaoList
									.add(addDiscountDetailsDepends(discountDetailsDto.getDiscountComponents(), discount,
											discountSlabMap.get(discountSlabId), discountDetailsDto.getIsActive(),
											discountDetailsDto.getDiscountPercent())));
				}

			} else {
				discountDetailsDaoList.add(addDiscountDetailsDepends(discountDetailsDto.getDiscountComponents(),
						discount, new DiscountDetailsDaoExt(), discountDetailsDto.getIsActive(),
						discountDetailsDto.getDiscountPercent()));

			}
		}
		if (!discountDetailsDaoList.isEmpty())
			discountDetailsRepository.saveAll(discountDetailsDaoList);
		discount.setIsPublishPending(true);
		discount.setSrcSyncId(discount.getSrcSyncId() + 1);
		discountRepository.save(discount);

		discountDetailsDaoList.forEach(
				discountDetail -> discountSlabResponseDtoList.add(getDiscountDetailResponseDto(discountDetail)));
		return new ListResponse<>(discountSlabResponseDtoList);
	}

	/**
	 * @param discountSlab
	 * @return
	 */
	private DiscountDetailsUpdateResponseDto getDiscountDetailResponseDto(DiscountDetailsDaoExt discountDetail) {
		DiscountDetailsUpdateResponseDto discountDetailsResponseDto = (DiscountDetailsUpdateResponseDto) MapperUtil
				.getDtoMapping(discountDetail, DiscountDetailsResponseDto.class);
		discountDetailsResponseDto.setDiscountId(discountDetail.getDiscount().getId());
		List<JsonData> discountComponentList = new ArrayList<>();
		List<JsonData> discountConfigs = new ArrayList<>();
		if (discountDetail.getRegularConfigDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(discountDetail.getRegularConfigDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			discountComponentList.add(jsonData);
		}

		if (discountDetail.getAbConfigDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(discountDetail.getAbConfigDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			discountComponentList.add(jsonData);
		}

		if (discountDetail.getCoConfigDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(discountDetail.getCoConfigDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			discountComponentList.add(jsonData);
		}

		if (discountDetail.getPreviewConfigDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(discountDetail.getPreviewConfigDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			discountComponentList.add(jsonData);
		}
		if (discountDetail.getRivaahConfigDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(discountDetail.getRivaahConfigDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			discountComponentList.add(jsonData);
		}
		if (discountDetail.getConfigDetails() != null) {
			Object obj = MapperUtil.getJsonFromString(discountDetail.getConfigDetails());
			JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
			discountConfigs.add(jsonData);
		}

		discountDetailsResponseDto.setDiscountComponents(discountComponentList);
		discountDetailsResponseDto.setConfigDetails(discountConfigs);
		return discountDetailsResponseDto;

	}

	/**
	 * @param removeDetails
	 * @param discount
	 */
	private void removeDiscountDetails(List<String> removeDetails, DiscountDaoExt discount) {
		List<DiscountDetailsDaoExt> discountSlabDaoList = discountDetailsRepository.findAllById(removeDetails);
		discountSlabDaoList.forEach(discSlab -> {
			if (discount.getPublishTime() != null
					&& discSlab.getCreatedDate().getTime() < discount.getPublishTime().getTime()) {
				throw new ServiceException(ConfigConstants.DISCOUNTS_DETAILS_CANNOT_BE_REMOVED,
						ConfigConstants.ERR_CONFIG_114, discount.getPublishTime());
			}
		});
		List<DiscountProductGroupMappingDaoExt> discountProductsDaoExts = discountProductGroupMappingRepository
				.getMappedProducts(removeDetails);
		if (!discountProductsDaoExts.isEmpty()) {
			discountProductGroupMappingRepository.deleteAll(discountProductsDaoExts);
			discountProductGroupMappingRepository.flush();

		}
		discountDetailsRepository.deleteAll(discountSlabDaoList);
		discountDetailsRepository.flush();

	}

	/**
	 * @param discountId
	 * @return
	 */
	private DiscountDaoExt getDiscountDao(String discountId) {
		return discountRepository.findById(discountId)
				.orElseThrow(() -> new ServiceException(
						ConfigConstants.NO_DISCOUNT_DETAILS_FOUND_FOR_THE_REQUESTED_DISCOUNTID,
						ConfigConstants.ERR_CONFIG_033));
	}

	/**
	 * @param discountId
	 * @return
	 */
	private DiscountDaoExt getDiscountObject(String discountCode) {

		DiscountDaoExt discount = discountRepository.findOneByDiscountCode(discountCode);
		if (discount == null) {
			throw new ServiceException(ConfigConstants.NO_DISCOUNT_DETAILS_FOUND_FOR_DISCOUNT_CODE,
					ConfigConstants.ERR_CONFIG_076);
		}
		return discount;
	}

	/**
	 * @param updateSlabs
	 * @return
	 */
	private Map<String, DiscountDetailsDaoExt> getDiscountSlabDaoMap(List<String> discountSlabIds) {
		List<DiscountDetailsDaoExt> discountSlabDaoList = discountDetailsRepository.findAllById(discountSlabIds);
		Map<String, DiscountDetailsDaoExt> discountSlabDaoMap = new HashMap<>();
		discountSlabDaoList
				.forEach(discountSlabDao -> discountSlabDaoMap.put(discountSlabDao.getId(), discountSlabDao));
		return discountSlabDaoMap;
	}

	/**
	 * This method will add the DiscountSlab depends to the Discount from the
	 * DiscountSlabDto and returns DiscountSlab.
	 * 
	 * @param discountPercent
	 *
	 * @param discountSlab
	 * @param discountSlabDto
	 * @return DiscountSlab
	 */
	private DiscountDetailsDaoExt addDiscountDetailsDepends(List<JsonData> discountComponents, DiscountDaoExt discount,
			DiscountDetailsDaoExt discountDetailsDao, Boolean isActive, String discountPercent) {

		if (isActive != null && isActive == true && discountDetailsDao.getIsActive() != null
				&& discountDetailsDao.getIsActive() == false) {

			List<DiscountProductGroupMappingDaoExt> exstingProducts = discountProductGroupMappingRepository
					.getProductByDiscountDetailId(discountDetailsDao.getId());
			List<DiscountProductGroupMappingDaoExt> disPrdDaoExt = new ArrayList<>();
			if (!exstingProducts.isEmpty()) {
				Set<String> productGroupCodes = new HashSet<>();
				if (!exstingProducts.isEmpty())
					exstingProducts.forEach(prd -> productGroupCodes.add(prd.getProductGroupCode()));

				disPrdDaoExt = discountProductGroupMappingRepository.getByDiscountAndProductGroup(discount.getId(),
						productGroupCodes, discountDetailsDao.getId());
			}

			if (!disPrdDaoExt.isEmpty()) {
				List<String> productGroupsList = new ArrayList<>();
				disPrdDaoExt.forEach(disPrd -> productGroupsList.add(disPrd.getProductGroupCode()));
				
				Map<String, String> dynamicValues = new HashMap<>();
				String productGroups = productGroupsList.stream()
					      .map(productGroup -> String.valueOf(productGroup))
					      .collect(Collectors.joining(",", "{", "}"));
				dynamicValues.put("productGroupCodes", productGroups);
				throw new ServiceException(ConfigConstants.DE_ACTIVATE_PRODUCT, ConfigConstants.ERR_CONFIG_162,
						dynamicValues);
			}
		}
		if (discountComponents != null) {

			discountComponents.forEach(discountComponent -> {

				if (discountComponent.getType().equalsIgnoreCase(DiscountOfferTypeEnum.REGULAR.name())) {
					RegularCategoryDetails regularDetails = new RegularCategoryDetails();
					regularDetails.validate(discountComponent.getData());
					discountDetailsDao.setRegularConfigDetails(MapperUtil.getJsonString(discountComponent));
				}

				else if (discountComponent.getType().equalsIgnoreCase(DiscountOfferTypeEnum.PREVIEW.name())
						&& discount.getIsPreviewApplicable() != null && discount.getIsPreviewApplicable()) {

					PreviewCategoryDetails previewDetails = new PreviewCategoryDetails();
					previewDetails.validate(discountComponent.getData());
					discountDetailsDao.setPreviewConfigDetails(MapperUtil.getJsonString(discountComponent));
				}

				else if (discountComponent.getType().equalsIgnoreCase(DiscountOfferTypeEnum.RIVAAH.name())
						&& discount.getIsRiva() != null && discount.getIsRiva()) {

					RivaahCategoryDetails rivaahCategoryDetails = new RivaahCategoryDetails();
					rivaahCategoryDetails.validate(discountComponent.getData());
					discountDetailsDao.setRivaahConfigDetails(MapperUtil.getJsonString(discountComponent));
				}

				else if (discountComponent.getType().equalsIgnoreCase(DiscountOfferTypeEnum.AB.name())
						&& discount.getIsAbOfferApplicable() != null && discount.getIsAbOfferApplicable()) {
					ABCategoryDetails abDetails = new ABCategoryDetails();
					abDetails.validate(discountComponent.getData());
					discountDetailsDao.setAbConfigDetails(MapperUtil.getJsonString(discountComponent));
				}

				else if (discountComponent.getType().toUpperCase().equalsIgnoreCase(DiscountOfferTypeEnum.CO.name())
						&& discount.getIsCoOfferApplicable() != null && discount.getIsCoOfferApplicable()) {
					COCategoryDetails coDetails = new COCategoryDetails();
					coDetails.validate(discountComponent.getData());
					discountDetailsDao.setCoConfigDetails(MapperUtil.getJsonString(discountComponent));
				} else if (discount.getDiscountType().equals(DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name())) {
					discountDetailsDao.setConfigDetails(MapperUtil.getJsonString(discountComponent));
				}

			});
		}
		if (discountDetailsDao.getSrcSyncId() != null)
			discountDetailsDao.setSrcSyncId(discountDetailsDao.getSrcSyncId() + 1);
		if (isActive != null)
			discountDetailsDao.setIsActive(isActive);

		if (discountPercent != null)
			discountDetailsDao.setDiscountPercent(discountPercent);
		discountDetailsDao.setDiscount(discount);
		return discountDetailsDao;
	}

	@Override
	public PagedRestResponse<List<DiscountDetailsResponseDto>> listDiscountDetails(String discountId,
			String discountCategory, List<String> productGroupCodes, Pageable pageable) {

		DiscountDaoExt discount = getDiscountDao(discountId);

		StringUtil.checkNullString(discountCategory);
		// StringUtil.checkNullString(productGroupCode);

		Page<Object[]> discountDetailPageList = discountDetailsRepository.findAllBasedOnFilters(discount.getId(),
				discountCategory, productGroupCodes, pageable);

		List<DiscountDetailsResponseDto> discountDetailList = mapDiscountDetailtoDB(discountDetailPageList, discount);

		return new PagedRestResponse<>(discountDetailList, discountDetailPageList);
	}

	private List<DiscountDetailsResponseDto> mapDiscountDetailtoDB(Page<Object[]> discountDetailsPageList,
			DiscountDaoExt discount) {
		List<DiscountDetailsResponseDto> discountDetailsDtoList = new ArrayList<>();

		for (Object[] object : discountDetailsPageList) {
			DiscountDetailsResponseDto discountDetailList = new DiscountDetailsResponseDto();
			discountDetailList.setId((String) object[0]);
			discountDetailList.setDiscountId((String) object[1]);
			discountDetailList.setMinValue((BigDecimal) object[2]);
			discountDetailList.setMaxValue((BigDecimal) object[3]);
			discountDetailList.setSlabName((String) object[4]);
			discountDetailList.setDiscountCategory((String) object[5]);
			discountDetailList.setEligibility((String) object[6]);
			discountDetailList.setIsDeletable(isDeletable(discount.getPublishTime(), (Date) object[17]));
			discountDetailList.setIsEditable(isDeletable(discount.getPublishTime(), (Date) object[17]));

			List<JsonData> jsonDataList = new ArrayList<>();
			List<JsonData> configjsonDataList = new ArrayList<>();
			if (object[7] != null) {
				jsonDataList.add(MapperUtil.mapObjToClass(object[7], JsonData.class));
			}
			if (object[8] != null) {
				jsonDataList.add(MapperUtil.mapObjToClass(object[8], JsonData.class));
			}
			if (object[9] != null) {
				jsonDataList.add(MapperUtil.mapObjToClass(object[9], JsonData.class));
			}
			if (object[10] != null) {
				jsonDataList.add(MapperUtil.mapObjToClass(object[10], JsonData.class));
			}
			if (object[18] != null) {
				jsonDataList.add(MapperUtil.mapObjToClass(object[18], JsonData.class));
			}
			discountDetailList.setDiscountComponents(jsonDataList);

			discountDetailList.setRowId((Integer) object[11]);
			discountDetailList.setIsSingle((Boolean) object[12]);
			discountDetailList.setIsActive((Boolean) object[13]);
			if ((Integer) object[14] != null) {
				discountDetailList.setProductGroupCount((Integer) object[14]);
			} else {
				discountDetailList.setProductGroupCount(0);
			}
			discountDetailList.setDiscountPercent((String) object[15]);
			if (object[16] != null) {
				configjsonDataList.add(MapperUtil.mapObjToClass(object[16], JsonData.class));
			}
			discountDetailList.setConfigDetails(configjsonDataList);
			discountDetailsDtoList.add(discountDetailList);
		}

		return discountDetailsDtoList;
	}

	@Override
	public ListResponse<ClubDiscountResponseDto> updateClubDiscount(
			@Valid UpdateClubDiscountRequestDto updateClubDiscountRequestDto) {
		List<ClubbingDiscountsDaoExt> clubbingDiscountsDaoList = new ArrayList<>();
		List<ClubDiscountResponseDto> updateClubDiscountResponseList = new ArrayList<>();

		SyncStagingDto syncStagingDto = discountService.saveDiscountClubAndStaging(clubbingDiscountsDaoList,
				updateClubDiscountRequestDto);
		if (syncStagingDto != null)
			syncDataService.publishConfigMessagesToQueue(syncStagingDto);
		clubbingDiscountsDaoList.forEach(clubbingDiscount -> updateClubDiscountResponseList
				.add(getClubbingDiscountResponseDto(clubbingDiscount)));
		return new ListResponse<>(updateClubDiscountResponseList);
	}

	/**
	 * @param clubbingDiscountsDaoList
	 * @param updateClubDiscountRequestDto
	 * @return
	 */
	@Transactional
	public SyncStagingDto saveDiscountClubAndStaging(List<ClubbingDiscountsDaoExt> clubbingDiscountsDaoList,
			@Valid UpdateClubDiscountRequestDto updateClubDiscountRequestDto) {
		ClubbingDiscountsSyncDtoExt syncDtoExt = new ClubbingDiscountsSyncDtoExt();
		List<ClubbingDiscountsDaoExt> deleteList = new ArrayList<>();
		if (!CollectionUtils.isEmpty(updateClubDiscountRequestDto.getRemoveRules())) {
			deleteList = clubbingDiscountsRepository.findAllById(updateClubDiscountRequestDto.getRemoveRules());
			deleteList.forEach(delete -> delete.setSyncTime(new Date().getTime()));
			clubbingDiscountsRepository.deleteAll(deleteList);
			clubbingDiscountsRepository.flush();
		}

		if (!CollectionUtils.isEmpty(updateClubDiscountRequestDto.getAddRules())) {
			updateClubDiscountRequestDto.getAddRules().forEach(addRule -> {
				ClubbingDiscountsDaoExt clubbingDiscountsDao = new ClubbingDiscountsDaoExt();
				if (addRule.getType1DiscountCode() != null)
					clubbingDiscountsDao.setDiscount1(getDiscountObject(addRule.getType1DiscountCode()));
				if (addRule.getType2DiscountCode() != null)
					clubbingDiscountsDao.setDiscount2(getDiscountObject(addRule.getType2DiscountCode()));
				if (addRule.getType3DiscountCode() != null)
					clubbingDiscountsDao.setDiscount3(getDiscountObject(addRule.getType3DiscountCode()));
				clubbingDiscountsDao.setSyncTime(new Date().getTime());
				clubbingDiscountsDaoList.add(clubbingDiscountsDao);
			});
			clubbingDiscountsRepository.saveAll(clubbingDiscountsDaoList);
		}
		List<SyncData> syncDatas = new ArrayList<>();
		SyncStagingDto syncStagingDto = null;
		List<String> destinations = new ArrayList<>();
		if (!deleteList.isEmpty())
			syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoExts(deleteList), 8));
		if (!clubbingDiscountsDaoList.isEmpty())
			syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoExts(clubbingDiscountsDaoList), 9));
		if (!syncDatas.isEmpty())
			syncStagingDto = discountService.saveToSyncStaging(syncDatas,
					ConfigServiceOperationCodes.DISCOUNT_CLUB_MAPPING, destinations, DestinationType.ALL.name(), null);
		return syncStagingDto;
	}

	/**
	 * @param clubbingDiscount
	 * @return
	 */
	private ClubDiscountResponseDto getClubbingDiscountResponseDto(ClubbingDiscountsDaoExt clubbingDiscount) {
		ClubDiscountResponseDto clubDiscountResponseDto = new ClubDiscountResponseDto();

		if (clubbingDiscount.getDiscount1() != null)
			clubDiscountResponseDto.setType1DiscountCode(clubbingDiscount.getDiscount1().getDiscountCode());
		if (clubbingDiscount.getDiscount2() != null)
			clubDiscountResponseDto.setType2DiscountCode(clubbingDiscount.getDiscount2().getDiscountCode());
		if (clubbingDiscount.getDiscount3() != null)
			clubDiscountResponseDto.setType3DiscountCode(clubbingDiscount.getDiscount3().getDiscountCode());
		clubDiscountResponseDto.setId(clubbingDiscount.getId());
		return clubDiscountResponseDto;
	}

	@Override
	public PagedRestResponse<List<ClubDiscountResponseDto>> listClubbedDiscount(String discountCode, Pageable pageable,
			Boolean isPageable) {
		List<ClubDiscountResponseDto> clubDiscountResponseList = new ArrayList<>();

		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}
		Page<ClubbingDiscountsDaoExt> clubbingDiscountPageList = null;
		List<String> discountIds = new ArrayList<>();
		if (discountCode != null) {
			List<DiscountDaoExt> discount = discountRepository.findByDiscountCodeUsingLike(discountCode);
			if (!discount.isEmpty()) {
				discount.forEach(dis -> discountIds.add(dis.getId()));
				clubbingDiscountPageList = clubbingDiscountsRepository.getClubbingDiscountList(discountIds, pageable);
			}
		} else {
			clubbingDiscountPageList = clubbingDiscountsRepository.findAll(pageable);
		}

		if (clubbingDiscountPageList == null) {
			return new PagedRestResponse<>(Page.empty());
		}
		
		clubbingDiscountPageList.forEach(clubbingDiscountDao -> clubDiscountResponseList
				.add(getClubbingDiscountResponseDto(clubbingDiscountDao)));
		return new PagedRestResponse<>(clubDiscountResponseList, clubbingDiscountPageList);
	}

	@Override
	public PagedRestResponse<List<ItemGroupMappingDto>> listItemGroupMapping(String discountId, Pageable pageable) {

		List<ItemGroupMappingDto> itemGroupMappingDtoList = new ArrayList<>();

		DiscountItemMappingDaoExt itemMappingDao = new DiscountItemMappingDaoExt();
		DiscountDaoExt discountDao = getDiscountDao(discountId);
		itemMappingDao.setDiscount(discountDao);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<DiscountItemMappingDaoExt> criteria = Example.of(itemMappingDao, matcher);
		Page<DiscountItemMappingDaoExt> discountItemMappingDaoList = discountItemMappingRepository.findAll(criteria,
				pageable);

		discountItemMappingDaoList.forEach(discountItemMapping -> {
			ItemGroupMappingDto discountItemMappingDto = (ItemGroupMappingDto) MapperUtil
					.getDtoMapping(discountItemMapping, DiscountItemMappingDao.class);
			discountItemMappingDto
					.setIsDeletable(isDeletable(discountDao.getPublishTime(), discountDao.getCreatedDate()));
			if (discountItemMapping.getRegularConfigDetails() != null) {
				Object obj = MapperUtil.getJsonFromString(discountItemMapping.getRegularConfigDetails());
				JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
				discountItemMappingDto.setRegularConfigDetails(jsonData);
			}

			if (discountItemMapping.getPreviewConfigDetails() != null) {
				Object obj = MapperUtil.getJsonFromString(discountItemMapping.getPreviewConfigDetails());
				JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
				discountItemMappingDto.setPreviewConfigDetails(jsonData);
			}

			itemGroupMappingDtoList.add(discountItemMappingDto);

		});
		return new PagedRestResponse<>(itemGroupMappingDtoList, discountItemMappingDaoList);
	}

	@Transactional
	@Override
	public ListResponse<DiscountDetailsUpdateResponseDto> updateSlabDetails(String discountId,
			@Valid DiscountSlabDetailsDto discountSlabDetailsDto) {
		DiscountDaoExt discount = getDiscountDao(discountId);

		if (!CollectionUtils.isEmpty(discountSlabDetailsDto.getRemoveDetails())) {

			List<DiscountDetailsDaoExt> deleteSlabList = discountDetailsRepository
					.findAllById(discountSlabDetailsDto.getRemoveDetails());
			deleteSlabList.forEach(slab -> {
				if (discount.getPublishTime() != null
						&& slab.getCreatedDate().getTime() < discount.getPublishTime().getTime()) {
					throw new ServiceException(ConfigConstants.DISCOUNTS_SLAB_DETAILS_CANNOT_BE_REMOVED,
							ConfigConstants.ERR_CONFIG_115, discount.getPublishTime());
				}
			});
			discountDetailsRepository.deleteAll(deleteSlabList);
			discountDetailsRepository.flush();
		}

		List<DiscountSlabAddDto> slabList = new ArrayList<>();
		List<DiscountDetailsDaoExt> slabDetailDaoList = new ArrayList<>();
		if (!CollectionUtils.isEmpty(discountSlabDetailsDto.getUpdateSlabDetails())) {
			Map<String, DiscountSlabUpdateDto> discountDetailMap = new HashMap<>();
//			discountSlabDetailsDto.getUpdateSlabDetails()
//					.forEach(updateSlab -> discountDetailMap.put(updateSlab.getId(), updateSlab));
			discountSlabDetailsDto.getUpdateSlabDetails().stream()
					.filter(updateDto -> updateDto.getMinValue() != null && updateDto.getMaxValue() != null
							&& updateDto.getRowId() != null)
					.forEach(updateSlab -> discountDetailMap.put(updateSlab.getId(), updateSlab));

			List<DiscountDetailsDaoExt> updateDetailDaoList = discountDetailsRepository
					.findAllById(discountDetailMap.keySet());
			// temporary fix: as rowId gets updated when new record is added in between, set
			// rowId = null first then save actual rowId
			List<DiscountDetailsDaoExt> setRowIdToNullList = new ArrayList<>();
			if (!CollectionUtils.isEmpty(updateDetailDaoList)) {
				updateDetailDaoList.forEach(updateSlab -> {

					DiscountDetailsDaoExt slabUpdateDao = (DiscountDetailsDaoExt) MapperUtil
							.getObjectMapping(discountDetailMap.get(updateSlab.getId()), updateSlab);
					slabUpdateDao.setRowId(null);
					setRowIdToNullList.add(updateSlab);
				});

				discountDetailsRepository.saveAll(setRowIdToNullList);
				discountDetailsRepository.flush();

			}

			List<DiscountDetailsDaoExt> updateSlabDaoList = new ArrayList<>();
			if (!CollectionUtils.isEmpty(updateDetailDaoList)) {
				updateDetailDaoList.forEach(updateSlab -> {

					if (updateSlab.getMinValue() != null && updateSlab.getMaxValue() != null
							&& updateSlab.getRowId() != null) {
						slabList.add(discountDetailMap.get(updateSlab.getId()));
					}

					DiscountDetailsDaoExt slabUpdateDao = (DiscountDetailsDaoExt) MapperUtil
							.getObjectMapping(discountDetailMap.get(updateSlab.getId()), updateSlab);
					discountSlabDetailsDto.getUpdateSlabDetails().forEach(slab->{
						if(slab.getId().equals(updateSlab.getId()) && slab.getIsActive() != null)
							slabUpdateDao.setIsActive(slab.getIsActive());
						
					});
					
					slabUpdateDao.setDiscount(discount);
					slabUpdateDao.setSrcSyncId(slabUpdateDao.getSrcSyncId() + 1);
					updateSlabDaoList.add(slabUpdateDao);
				});

				discountDetailsRepository.saveAll(updateSlabDaoList);
				discountDetailsRepository.flush();

			}

			else {
				throw new ServiceException(ConfigConstants.NO_DISCOUNT_DETAIL_ID_PRESENT,
						ConfigConstants.ERR_CONFIG_075);
			}

		}

		if (!CollectionUtils.isEmpty(discountSlabDetailsDto.getAddSlabDetails())) {
			discountSlabDetailsDto.getAddSlabDetails().forEach(addSlab -> {
				slabList.add(addSlab);
				DiscountDetailsDaoExt slabAddDao = (DiscountDetailsDaoExt) MapperUtil.getObjectMapping(addSlab,
						new DiscountDetailsDaoExt());
				slabAddDao.setIsActive(discountSlabDetailsDto.getIsActive());
				slabAddDao.setDiscount(discount);
				if (discount.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name())
						&& addSlab.getConfigDetails() != null)
					slabAddDao.setConfigDetails(MapperUtil.getJsonString(addSlab.getConfigDetails()));
				slabDetailDaoList.add(slabAddDao);
			});
		}

		if (!CollectionUtils.isEmpty(slabList)) {
			SlabValidator.createAndValidateSlabObject(slabList, DiscountSlabAddDto.class, "minValue", "maxValue",
					"rowId");
		}
		discountDetailsRepository.saveAll(slabDetailDaoList);

		List<DiscountDetailsUpdateResponseDto> slabResponseDtoList = new ArrayList<>();
		slabDetailDaoList.forEach(discountDetailDao -> {
			DiscountDetailsUpdateResponseDto detailResponse = (DiscountDetailsUpdateResponseDto) MapperUtil
					.getObjectMapping(discountDetailDao, new DiscountDetailsUpdateResponseDto());
			detailResponse.setDiscountId(discountDetailDao.getDiscount().getId());
			List<JsonData> configjsonDataList = new ArrayList<>();
			if (discount.getDiscountType().equalsIgnoreCase(DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name())
					&& discountDetailDao.getConfigDetails() != null) {
				configjsonDataList.add(MapperUtil.mapObjToClass(
						MapperUtil.getJsonFromString(discountDetailDao.getConfigDetails()), JsonData.class));
				detailResponse.setConfigDetails(configjsonDataList);
			}

			slabResponseDtoList.add(detailResponse);
		});
		discount.setIsPublishPending(true);
		discount.setSrcSyncId(discount.getSrcSyncId() + 1);
		discountRepository.save(discount);
		return new ListResponse<>(slabResponseDtoList);
	}

	@Override
	public void publishDiscount(String discountId, boolean isPublishValidationRequired) {

		DiscountDaoExt discountDaoExt = discountRepository.findOneById(discountId);

		if (discountDaoExt == null) {
			throw new ServiceException(ConfigConstants.NO_DISCOUNT_DETAILS_FOUND, ConfigConstants.ERR_CONFIG_057);
		}
		if (!discountDaoExt.getIsPublishPending().booleanValue())
			throw new ServiceException(ConfigConstants.DATA_PUBLISHED_ALREADY, ConfigConstants.ERR_CONFIG_080);
		DiscountTypeMetaDataDao metaDataDao = discountTypeMetaDataRepository
				.findByDiscountType(discountDaoExt.getDiscountType());
		if (metaDataDao == null) {
			throw new ServiceException(ConfigConstants.METADATA_IS_NOT_PRESENT_FOR_THIS_DISCOUNT_TYPE,
					ConfigConstants.ERR_CONFIG_081);
		}

		List<DiscountDetailsDaoExt> discountDetailsDaoExts = discountDetailsRepository
				.findAllByDiscount(discountDaoExt);
		if(isPublishValidationRequired)
			mandatoryFieldsCheck(discountDaoExt, metaDataDao, discountDetailsDaoExts);
		List<SyncData> syncDatas = new ArrayList<>();
		Set<String> locations = new HashSet<>();
		DiscountSyncDtoExt syncDtoExt = new DiscountSyncDtoExt(discountDaoExt);
		syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt, 0));
		List<DiscountLocationMappingDaoExt> discountLocation = discountLocationMappingRepository
				.findAllByDiscount(discountDaoExt);
		List<DiscountLocationMappingDaoExt> syncDiscountLocation = new ArrayList<>();
		Boolean isNewLocationAdded = false;
		if (metaDataDao.getLocationMapping().booleanValue() && isPublishValidationRequired) {

			if (discountLocation.isEmpty()) {
				throw new ServiceException(ConfigConstants.ADD_AT_LEAST_ONE_LOCATION_MAPPING_TO_PUBLISH,
						ConfigConstants.ERR_CONFIG_082);
			}
			for(DiscountLocationMappingDaoExt disLoc : discountLocation) {
				locations.add(disLoc.getLocationCode());
				//if new location is added after publish, then send every table data to the queue
				if (isNewLocationAdded(discountDaoExt.getPublishTime(), disLoc.getCreatedDate())) {
					isNewLocationAdded = true;
				}
					if(discountDaoExt.getPublishTime() == null || (discountDaoExt.getPublishTime() != null && isPublishable(
								discountDaoExt.getPublishTime().getTime(), disLoc.getLastModifiedDate().getTime()))){
					syncDiscountLocation.add(disLoc);
				
				}
			}
		}
		if (metaDataDao.getProductGroupMapping().booleanValue()) {
			addDiscountProductGroupSyncData(syncDatas, discountDaoExt, isPublishValidationRequired,isNewLocationAdded);
		}

		if (metaDataDao.getProductCategoryMapping().booleanValue()) {
			addDiscountProductCategorySyncData(syncDatas, discountDaoExt, isPublishValidationRequired,isNewLocationAdded);
		}
		if (metaDataDao.getItemMapping().booleanValue()) {
			if (!(discountDaoExt.getDiscountType().equals(DiscountTypeEnum.BEST_DEAL_DISCOUNT.name())
					|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT.name())))
				addDiscountItemSyncData(syncDatas, discountDaoExt, isNewLocationAdded);
		}

		if (discountDaoExt.getDiscountType().equals(DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name())
				|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name())
				|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name())) {
			if (discountDetailsDaoExts.isEmpty()) {
				throw new ServiceException(ConfigConstants.SLAB_TO_PUBLISH, ConfigConstants.ERR_CONFIG_177);
			}

		}
		if (!discountDetailsDaoExts.isEmpty()) {
			addDiscountDetailsSyncData(syncDatas, discountDaoExt, discountDetailsDaoExts,isNewLocationAdded);
		}
		List<DiscountExcludeMappingDaoExt> discountExcludeMapping = discountExcludeMappingRepository
				.findAllByDiscount(discountDaoExt);
		if (!discountExcludeMapping.isEmpty()) {
			addDiscountExcludeSyncData(syncDatas, discountDaoExt, discountExcludeMapping, isNewLocationAdded);
		}
		List<LinkingDiscountsDaoExt> linkingDiscountsDaoExts = linkingDiscountRepo
				.getLinkDiscounts(discountDaoExt.getId());
		if (!linkingDiscountsDaoExts.isEmpty()) {
			addLinkingDiscountSyncData(syncDatas, discountDaoExt, linkingDiscountsDaoExts,isNewLocationAdded);
		}

		publishToLocations(locations, syncDiscountLocation, syncDatas, discountDaoExt);

	}

	private boolean isNewLocationAdded(Date publishTime, Date createdDate) {
		Boolean isNewLocation;
		if (publishTime != null && createdDate.getTime() < publishTime.getTime()) {
			isNewLocation = true;
		} else {
			isNewLocation = false;
		}
		return isNewLocation;
	}

	/**
	 * @param discountDaoExt
	 * @param metaDataDao
	 * @param discountDetailsDaoExts
	 */
	private void mandatoryFieldsCheck(DiscountDaoExt discountDaoExt, DiscountTypeMetaDataDao metaDataDao,
			List<DiscountDetailsDaoExt> discountDetailsDaoExts) {

		Map<String, String> dynamicValues = new HashMap<>();
		List<String> feildsList = new ArrayList<>();

		headerLevelValidation(discountDaoExt, discountDetailsDaoExts, metaDataDao, feildsList);
		
		discountTypeSpecificValidation(discountDaoExt, feildsList);

		if (!(discountDaoExt.getDiscountType().equals(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name())
				|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.DIGI_GOLD_DISCOUNT.name())
				|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name())
				|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name())
				|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name())
				|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.BILL_LEVEL_DISCOUNT.name()))) {
			if (discountDaoExt.getClubbingDiscountType() == null || discountDaoExt.getClubDiscountType() == null)
				feildsList.add("Clubbing of Discounts");
		}
		if (!(discountDaoExt.getDiscountType().equals(DiscountTypeEnum.DIGI_GOLD_DISCOUNT.name())
				|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.SYSTEM_DISCOUNT_DV.name())
				|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.SYSTEM_DISCOUNT_GEP_PURITY.name())
				|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.SYSTEM_DISCOUNT_GHS_BONUS.name()))) {
			if (discountDaoExt.getClubOtherOffersConfig() == null)
				feildsList.add("Clubbing with Other Offers");
		}

		if (!feildsList.isEmpty()) {
			dynamicValues.put("feildsList", feildsList.toString());
			throw new ServiceException(ConfigConstants.MANDATORY_FIELDS_TO_PUBLISH, ConfigConstants.ERR_CONFIG_178,
					dynamicValues);
		}

	}

	/**
	 * @param discountDaoExt
	 * @param feildsList
	 */
	private void discountTypeSpecificValidation(DiscountDaoExt discountDaoExt, List<String> feildsList) {
		if (discountDaoExt.getDiscountType().equals(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name())
				&& discountDaoExt.getApplicableThemes() == null) {
			feildsList.add("Applicable Themes");
		}

		JsonData basicCriteriaJson = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(discountDaoExt.getBasicCriteria()), JsonData.class);

		BaseBasicCriteriaDetails basicCriteriaDetails = MapperUtil.mapObjToClass(basicCriteriaJson.getData(),
				BaseBasicCriteriaDetails.class);
		if (discountDaoExt.getDiscountType().equals(DiscountTypeEnum.BILL_LEVEL_DISCOUNT.name())) {
			if (basicCriteriaDetails == null)
				feildsList.add("UCP Value");
			if (basicCriteriaDetails != null && basicCriteriaDetails.getUcpValue() == null)
				feildsList.add("UCP Value");
		}
		if (discountDaoExt.getDiscountType().equals(DiscountTypeEnum.COIN_OFFER_DISCOUNT.name())) {
			if (basicCriteriaDetails == null) {
				feildsList.add("Coin purchasing period");
				feildsList.add("purchase against TEP period");
				feildsList.add("TEP CN %");
			}
			if (basicCriteriaDetails != null && (basicCriteriaDetails.getCoinPurchaseStartDate() == null
					|| basicCriteriaDetails.getCoinPurchaseEndDate() == null))
				feildsList.add("Coin purchasing period");
			if (basicCriteriaDetails != null && (basicCriteriaDetails.getTepPeriodEndDate() == null
					|| basicCriteriaDetails.getTepPeriodStartDate() == null))
				feildsList.add("purchase against TEP period");
			if (basicCriteriaDetails != null && basicCriteriaDetails.getTepCNUtilizationPercent() == null)
				feildsList.add("TEP CN %");
		}
		if (discountDaoExt.getDiscountType().equals(DiscountTypeEnum.EMPLOYEE_DISCOUNT.name())) {
			if (basicCriteriaDetails == null
					|| (basicCriteriaDetails != null && basicCriteriaDetails.getStartingSerialNo() == null))
				feildsList.add("Serial number starts from");
		}
		if (discountDaoExt.getDiscountType().equals(DiscountTypeEnum.TATA_EMPLOYEE_DISCOUNT.name())) {
			if (basicCriteriaDetails == null
					|| (basicCriteriaDetails != null && basicCriteriaDetails.getMaxCount() == null))
				feildsList.add("Max Count");
		}
		if (discountDaoExt.getDiscountType().equals(DiscountTypeEnum.TSSS_DISCOUNT.name())
				&& discountDaoExt.getConfigDetails() == null) {
			feildsList.add("TSSS Configuration");
		}
		if (discountDaoExt.getDiscountType().equals(DiscountTypeEnum.ITEM_GROUP_LEVEL_DISCOUNT.name())
				|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.BEST_DEAL_DISCOUNT.name())) {
			if (discountDaoExt.getItemGroupConfig() == null)
				feildsList.add("Max allowed % or values");
			if (discountDaoExt.getRivaahItemGroupConfig() == null)
				feildsList.add("Rivaah card config");
			if (discountDaoExt.getDiscountType().equals(DiscountTypeEnum.BEST_DEAL_DISCOUNT.name())
					&& discountDaoExt.getConfigDetails() == null)
				feildsList.add("Lot & Bin Age Config");
		}
		if (discountDaoExt.getDiscountType().equals(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name())
				&& discountDaoExt.getConfigDetails() == null)
			feildsList.add("Exchange offer Config");

		JsonData configDetails = MapperUtil.getObjectMapperInstance()
				.convertValue(MapperUtil.getJsonFromString(discountDaoExt.getConfigDetails()), JsonData.class);

		ExchangeOfferConfigDetails offerConfigDetails = MapperUtil.mapObjToClass(configDetails.getData(),
				ExchangeOfferConfigDetails.class);

		if (discountDaoExt.getDiscountType().equals(DiscountTypeEnum.KARAT_EXCHANGE_OFFER_DISCOUNT.name())
				&& discountDaoExt.getConfigDetails() != null && (offerConfigDetails.getApplicableCN() == null
						|| offerConfigDetails.getMinCNUtilizationPercent() == null)) {
			feildsList.add("Exchange offer Config");

		}

	}

	/**
	 * @param discountDaoExt
	 * @param discountDetailsDaoExts
	 * @param metaDataDao
	 * @param feildsList
	 */
	private void headerLevelValidation(DiscountDaoExt discountDaoExt,
			List<DiscountDetailsDaoExt> discountDetailsDaoExts, DiscountTypeMetaDataDao metaDataDao,
			List<String> feildsList) {
		if (discountDaoExt.getApprovedBy() == null && discountDaoExt.getIsCreatedByWorkflow() == null) {
			feildsList.add("Approved By"); // Mandatory only in direct creation
		}
		if (metaDataDao.getLocationMapping().booleanValue() && discountDaoExt.getApplicableLevels() == null) {
			feildsList.add("ApplicableLevels");
		}
		if (discountDaoExt.getDiscountCode() == null)
			feildsList.add("Discout Code");
		if (discountDaoExt.getOccasion() == null)
			feildsList.add("Occasion");
		if (discountDaoExt.getBrandCode() == null)
			feildsList.add("Brand Code");
		if (discountDaoExt.getSubBrandCode() == null)
			feildsList.add("Sub Brand Code");
		if (discountDaoExt.getDiscountType() == null)
			feildsList.add("Type Of Discount");

		if (discountDaoExt.getDiscountType().equals(DiscountTypeEnum.CATEGORY_DISCOUNT.name())
				|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name())
				|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name())
				|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.ULP_DISCOUNT_ANNIVERSARY.name())
				|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.ULP_DISCOUNT_BIRTHDAY.name())
				|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.ULP_DISCOUNT_SPOUSE_BIRTHDAY.name())) {
			if (discountDaoExt.getIsPreviewApplicable() != null && discountDaoExt.getIsPreviewApplicable() == true
					&& discountDaoExt.getUlpCreateDate() == null)
				feildsList.add("encircle creation date");
			if (!discountDetailsDaoExts.isEmpty()) {
				if (discountDaoExt.getIsPreviewApplicable() != null && discountDaoExt.getIsPreviewApplicable() == true
						&& discountDetailsDaoExts.get(0).getPreviewConfigDetails() == null) {
					feildsList.add("Preview Config");
				}
				if (discountDaoExt.getIsAbOfferApplicable() != null && discountDaoExt.getIsAbOfferApplicable() == true
						&& discountDetailsDaoExts.get(0).getAbConfigDetails() == null) {
					feildsList.add("AB Config");
				}
				if (discountDaoExt.getIsCoOfferApplicable() != null && discountDaoExt.getIsCoOfferApplicable() == true
						&& discountDetailsDaoExts.get(0).getCoConfigDetails() == null) {
					feildsList.add("CO Config");
				}
				if (discountDaoExt.getIsRiva() != null && discountDaoExt.getIsRiva() == true
						&& discountDetailsDaoExts.get(0).getRivaahConfigDetails() == null) {
					feildsList.add("Rivaah Config");
				}
				if ((discountDaoExt.getIsAbOfferApplicable() != null && discountDaoExt.getIsAbOfferApplicable() == true)
						|| (discountDaoExt.getIsCoOfferApplicable() != null)
								&& discountDaoExt.getIsCoOfferApplicable() == true) {
					if (discountDaoExt.getAbCoData() == null)
						feildsList.add("AB/CO Pop Up");
				}
			}

		}

	}

	/**
	 * @param locations
	 * @param discountLocation
	 * @param syncDatas
	 * @param discountDaoExt
	 */
	private void publishToLocations(Set<String> locations, List<DiscountLocationMappingDaoExt> syncDiscountLocation,
			List<SyncData> syncDatas, DiscountDaoExt discountDaoExt) {
		if (locations.isEmpty()) {
			List<String> destinations = new ArrayList<>();
			SyncStagingDto syncStagingDto = discountService.saveToSyncStaging(syncDatas,
					ConfigServiceOperationCodes.DISCOUNT_PUBLISH, destinations, DestinationType.ALL.name(),
					discountDaoExt);
			syncDataService.publishConfigMessagesToQueue(syncStagingDto);
		} else {
			for (String location : locations) {
				List<String> destinations = new ArrayList<>();
				destinations.add(location);
				int flag = 0;
				for (DiscountLocationMappingDaoExt discountLoc : syncDiscountLocation) {
					if (location.equals(discountLoc.getLocationCode())) {
						DiscountLocationMappingSyncDtoExt disLocSyncDtoExt = new DiscountLocationMappingSyncDtoExt(
								discountLoc);
						syncDatas.add(DataSyncUtil.createSyncData(disLocSyncDtoExt, 1));
						flag = 1;
						break;
					}
				}
				SyncStagingDto syncStagingDto = discountService.saveToSyncStaging(syncDatas,
						ConfigServiceOperationCodes.DISCOUNT_PUBLISH, destinations, DestinationType.SELECTIVE.name(),
						discountDaoExt);
				syncDataService.publishConfigMessagesToQueue(syncStagingDto);
				if (flag == 1) {
					syncDatas.remove(syncDatas.size() - 1);
				}
			}
		}
	}

	/**
	 * @param syncDatas
	 * @param discountDaoExt
	 * @param isNewLocationAdded 
	 * @param clubbingDiscountsDaoExts
	 */
	private void addLinkingDiscountSyncData(List<SyncData> syncDatas, DiscountDaoExt discountDaoExt,
			List<LinkingDiscountsDaoExt> linkingDiscountsDaoExts, Boolean isNewLocationAdded) {
		List<LinkingDiscountsDaoExt> publishLinkingDiscounts = new ArrayList<>();
		linkingDiscountsDaoExts.forEach(linkingDiscount -> {
			if (isNewLocationAdded || discountDaoExt.getPublishTime() == null || (discountDaoExt.getPublishTime() != null && isPublishable(
					discountDaoExt.getPublishTime().getTime(), linkingDiscount.getLastModifiedDate().getTime()))) {
				publishLinkingDiscounts.add(linkingDiscount);
			}

		});
		if (!publishLinkingDiscounts.isEmpty()) {
			LinkingDiscountsSyncDtoExt linkgSyncDtoExt = new LinkingDiscountsSyncDtoExt();
			syncDatas.add(DataSyncUtil.createSyncData(linkgSyncDtoExt.getSyncDtoExts(publishLinkingDiscounts), 7));
		}
	}

	/**
	 * @param syncDatas
	 * @param discountDaoExt
	 * @param discountExcludeMapping
	 * @param isNewLocationAdded 
	 */
	private void addDiscountExcludeSyncData(List<SyncData> syncDatas, DiscountDaoExt discountDaoExt,
			List<DiscountExcludeMappingDaoExt> discountExcludeMapping, Boolean isNewLocationAdded) {
		List<DiscountExcludeMappingDaoExt> publishDiscountExclude = new ArrayList<>();
		discountExcludeMapping.forEach(discountExclude -> {
			if (isNewLocationAdded || discountDaoExt.getPublishTime() == null || (discountDaoExt.getPublishTime() != null && isPublishable(
					discountDaoExt.getPublishTime().getTime(), discountExclude.getLastModifiedDate().getTime()))) {
				publishDiscountExclude.add(discountExclude);
			}

		});
		if (!publishDiscountExclude.isEmpty()) {
			DiscountExcludeMappingSyncDtoExt excludeSyncDtoExt = new DiscountExcludeMappingSyncDtoExt();
			syncDatas.add(DataSyncUtil.createSyncData(excludeSyncDtoExt.getSyncDtoExts(publishDiscountExclude), 6));

		}
	}

	/**
	 * @param syncDatas
	 * @param discountDaoExt
	 * @param discountDetailsDaoExts
	 * @param isNewLocationAdded 
	 */
	private void addDiscountDetailsSyncData(List<SyncData> syncDatas, DiscountDaoExt discountDaoExt,
			List<DiscountDetailsDaoExt> discountDetailsDaoExts, Boolean isNewLocationAdded) {
		List<DiscountDetailsDaoExt> publishdiscountDetails = new ArrayList<>();
		discountDetailsDaoExts.forEach(discountDetail -> {
			if (isNewLocationAdded || discountDaoExt.getPublishTime() == null || (discountDaoExt.getPublishTime() != null && isPublishable(
					discountDaoExt.getPublishTime().getTime(), discountDetail.getLastModifiedDate().getTime()))) {
				publishdiscountDetails.add(discountDetail);
			}

		});
		if (!publishdiscountDetails.isEmpty()) {
			DiscountDetailsSyncDtoExt detailsSyncDtoExt = new DiscountDetailsSyncDtoExt();
			syncDatas.add(DataSyncUtil.createSyncData(detailsSyncDtoExt.getSyncDtoExtList(publishdiscountDetails), 2));
		}
	}

	/**
	 * @param syncDatas
	 * @param discountDaoExt
	 * @param isNewLocationAdded 
	 */
	private void addDiscountItemSyncData(List<SyncData> syncDatas, DiscountDaoExt discountDaoExt, Boolean isNewLocationAdded) {
		List<DiscountItemMappingDaoExt> discountItemMappingDaoExts = discountItemMappingRepository
				.findAllByDiscount(discountDaoExt);
		if (!discountItemMappingDaoExts.isEmpty()) {
			List<DiscountItemMappingDaoExt> publishDiscountItem = new ArrayList<>();
			discountItemMappingDaoExts.forEach(discountItem -> {
				if (isNewLocationAdded || discountDaoExt.getPublishTime() == null || (discountDaoExt.getPublishTime() != null
						&& isPublishable(discountDaoExt.getPublishTime().getTime(),
								discountItem.getLastModifiedDate().getTime()))) {
					publishDiscountItem.add(discountItem);
				}

			});
			if (!publishDiscountItem.isEmpty()) {
				DiscountItemMappingSyncDtoExt discountItemDtoExt = new DiscountItemMappingSyncDtoExt();
				syncDatas
						.add(DataSyncUtil.createSyncData(discountItemDtoExt.getSyncDtoExtList(publishDiscountItem), 4));
			}
		}
	}

	/**
	 * @param syncDatas
	 * @param discountDaoExt
	 * @param isNewLocationAdded 
	 */
	private void addDiscountProductCategorySyncData(List<SyncData> syncDatas, DiscountDaoExt discountDaoExt,
			boolean isPublishValidationRequired, Boolean isNewLocationAdded) {
		List<DiscountProductCategoryMappingDaoExt> discountProductCategory = discountProductCategoryMappingRepository
				.findAllByDiscount(discountDaoExt);
		if (discountProductCategory.isEmpty() && isPublishValidationRequired) {
			throw new ServiceException(ConfigConstants.ADD_AT_LEAST_ONE_PRODUCT_CATEGORY_TO_PUBLISH,
					ConfigConstants.ERR_CONFIG_083);
		}
		List<DiscountProductCategoryMappingDaoExt> publishDiscountProductCategory = new ArrayList<>();
		discountProductCategory.forEach(discountPrdCat -> {
			if (isNewLocationAdded || discountDaoExt.getPublishTime() == null || (discountDaoExt.getPublishTime() != null && isPublishable(
					discountDaoExt.getPublishTime().getTime(), discountPrdCat.getLastModifiedDate().getTime()))) {
				publishDiscountProductCategory.add(discountPrdCat);
			}

		});
		if (!publishDiscountProductCategory.isEmpty()) {
			DiscountProductCategorySyncDtoExt disPrdSyncDtoExt = new DiscountProductCategorySyncDtoExt();
			syncDatas.add(
					DataSyncUtil.createSyncData(disPrdSyncDtoExt.getSyncDtoExtList(publishDiscountProductCategory), 3));
		}
	}

	/**
	 * @param syncDatas
	 * @param discountDaoExt
	 * @param isPublishValidationRequired
	 * @param isNewLocationAdded 
	 */
	private void addDiscountProductGroupSyncData(List<SyncData> syncDatas, DiscountDaoExt discountDaoExt,
			boolean isPublishValidationRequired, Boolean isNewLocationAdded) {
		List<DiscountProductGroupMappingDaoExt> publishDiscountProductGroup = new ArrayList<>();
		List<DiscountProductGroupMappingDaoExt> discountProductGroup = discountProductGroupMappingRepository
				.findAllByDiscount(discountDaoExt);
		if (discountProductGroup.isEmpty() && isPublishValidationRequired) {
			throw new ServiceException(ConfigConstants.ADD_AT_LEAST_ONE_PRODUCT_GROUP_TO_PUBLISH,
					ConfigConstants.ERR_CONFIG_084);
		}
		discountProductGroup.forEach(discountPrdGrp -> {
			if (isNewLocationAdded || discountDaoExt.getPublishTime() == null || (discountDaoExt.getPublishTime() != null && isPublishable(
					discountDaoExt.getPublishTime().getTime(), discountPrdGrp.getLastModifiedDate().getTime()))) {
				publishDiscountProductGroup.add(discountPrdGrp);
			}

		});
		if (!publishDiscountProductGroup.isEmpty()) {
			DiscountProductGroupMappingSyncDtoExt disPrdSyncDtoExt = new DiscountProductGroupMappingSyncDtoExt();
			syncDatas.add(
					DataSyncUtil.createSyncData(disPrdSyncDtoExt.getSyncDtoExtList(publishDiscountProductGroup), 5));
		}
	}

	/**
	 * @param publishTime
	 * @param modifiedTime
	 * @return boolean
	 */
	private boolean isPublishable(long publishTime, long modifiedTime) {
		boolean isPublishable = false;
		if (modifiedTime > publishTime)
			isPublishable = true;
		return isPublishable;
	}

	@Transactional
	@Override
	public ListResponse<LinkDiscountResponseDto> linkDiscounts(String discountId,
			LinkDiscountRequestDto linkDiscountRequestDto) {

		DiscountDaoExt discount = getDiscountDao(discountId);
		List<LinkDiscountResponseDto> responseList = new ArrayList<>();
		if (linkDiscountRequestDto != null) {

			if (!CollectionUtils.isEmpty(linkDiscountRequestDto.getRemoveLinks())) {

				List<LinkingDiscountsDaoExt> deleteList = linkingDiscountRepo
						.findAllById(linkDiscountRequestDto.getRemoveLinks());
				deleteList.forEach(del -> {
					if (discount.getPublishTime() != null
							&& del.getCreatedDate().getTime() < discount.getPublishTime().getTime()) {
						throw new ServiceException(ConfigConstants.LINKED_DISCOUNTS_CANNOT_BE_REMOVED,
								ConfigConstants.ERR_CONFIG_109);
					}
				});
				linkingDiscountRepo.deleteAll(deleteList);
				linkingDiscountRepo.flush();
			}

			List<LinkingDiscountsDaoExt> addList = new ArrayList<>();
			if (!CollectionUtils.isEmpty(linkDiscountRequestDto.getAddLinks())) {
				List<DiscountDaoExt> discountCodeList = discountRepository
						.findByDiscountCodeIn(linkDiscountRequestDto.getAddLinks());
				if (!CollectionUtils.isEmpty(discountCodeList)) {
					discountCodeList.forEach(record -> {
						LinkingDiscountsDaoExt linkDiscountDao = (LinkingDiscountsDaoExt) MapperUtil
								.getObjectMapping(record, new LinkingDiscountsDaoExt());
						linkDiscountDao.setIsActive(linkDiscountRequestDto.getIsActive());
						linkDiscountDao.setSrcDiscountId(discount);
						linkDiscountDao.setDestDiscountId(record);
						addList.add(linkDiscountDao);
					});
				}

			}
			if (!CollectionUtils.isEmpty(linkDiscountRequestDto.getUpdateLinks())) {
				List<LinkingDiscountsDaoExt> discountCodeList = linkingDiscountRepo
						.findAllById(linkDiscountRequestDto.getUpdateLinks());
				discountCodeList.forEach(linkDiscountDao -> {
					if (linkDiscountRequestDto.getIsActive() != null)
						linkDiscountDao.setIsActive(linkDiscountRequestDto.getIsActive());
					linkDiscountDao.setSrcSyncId(discount.getSrcSyncId() + 1);
					addList.add(linkDiscountDao);
				});
			}
			linkingDiscountRepo.saveAll(addList);

			addList.forEach(record -> responseList.add(getLinkDiscountResponse(discount, record)));
			discount.setIsPublishPending(true);
			discount.setSrcSyncId(discount.getSrcSyncId() + 1);
			discountRepository.save(discount);
		}
		return new ListResponse<>(responseList);

	}

	private LinkDiscountResponseDto getLinkDiscountResponse(DiscountDaoExt discount,
			LinkingDiscountsDaoExt linkingDiscount) {

		LinkDiscountResponseDto linkDiscountResponse = (LinkDiscountResponseDto) MapperUtil
				.getObjectMapping(linkingDiscount, new LinkDiscountResponseDto());
		linkDiscountResponse.setSrcDiscountCode(discount.getDiscountCode());
		if (linkingDiscount.getDestDiscountId() != null)
			linkDiscountResponse.setDestDiscountCode(linkingDiscount.getDestDiscountId().getDiscountCode());
		linkDiscountResponse.setIsDeletable(isDeletable(discount.getPublishTime(), discount.getCreatedDate()));
		return linkDiscountResponse;
	}

	@Override
	public PagedRestResponse<List<LinkDiscountResponseDto>> listLinkedDiscounts(String discountId, Pageable pageable) {

		DiscountDaoExt discount = getDiscountDao(discountId);

		LinkingDiscountsDaoExt linkDao = new LinkingDiscountsDaoExt();
		linkDao.setSrcDiscountId(discount);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<LinkingDiscountsDaoExt> criteria = Example.of(linkDao, matcher);

		List<LinkDiscountResponseDto> linkDtoList = new ArrayList<>();
		Page<LinkingDiscountsDaoExt> linkingDiscountPageList = linkingDiscountRepo.findAll(criteria, pageable);

		linkingDiscountPageList.forEach(record -> linkDtoList.add(getLinkDiscountResponse(discount, record)));

		return new PagedRestResponse<>(linkDtoList, linkingDiscountPageList);
	}

	@Override
	public DiscountCouponResponseDto generateDiscountCoupons(String discountId, DiscountCouponRequestDto requestDto) {
		DiscountDaoExt discount = getDiscountDao(discountId);
		if (!discount.getDiscountType().equals(DiscountTypeEnum.TSSS_DISCOUNT.name())) {
			throw new ServiceException(ConfigConstants.COUPON_GENERATION_IS_NOT_ALLOWED,
					ConfigConstants.ERR_CONFIG_131);
		}
		if (discount.getPublishTime() != null) {
			throw new ServiceException(ConfigConstants.COUPON_GENERATION_IS_NOT_ALLOWED_ONCE_PUBLISHED,
					ConfigConstants.ERR_CONFIG_132);
		}

		int lengthOfNoOfCoupons = findLength(requestDto.getNoOfCoupons());
		int lengthOfStartingDigits = findLength(requestDto.getStartingDigits());
		if (requestDto.getNoOfDigits() >= lengthOfNoOfCoupons + lengthOfStartingDigits) {
			// delete exsting coupons
			List<DiscountCouponDaoExt> disCoupons = discountCouponRepository.findAllByDiscountId(discountId);
			if (!disCoupons.isEmpty())
				discountCouponRepository.deleteAll(disCoupons);
			int middleNumbersCount = requestDto.getNoOfDigits() - (lengthOfNoOfCoupons + lengthOfStartingDigits);
			generateCouponCode((int) (Math.pow(10, middleNumbersCount + lengthOfNoOfCoupons - 1)),
					(int) (Math.pow(10, middleNumbersCount + lengthOfNoOfCoupons) - 1), requestDto.getStartingDigits(),
					requestDto.getNoOfCoupons(), discountId);
			discount.setIsPublishPending(true);
			discount.setSrcSyncId(discount.getSrcSyncId() + 1);
			discountRepository.save(discount);
		} else {
			throw new ServiceException(ConfigConstants.INVALID_INPUT_FOR_COUPON_GENERATION,
					ConfigConstants.ERR_CONFIG_133);
		}

		DiscountCouponResponseDto responseDto = new DiscountCouponResponseDto();
		responseDto.setDiscountId(discountId);
		return responseDto;
	}

	/**
	 * @param middleNumbersCount
	 * @param startingDigits
	 * @param noOfCoupons
	 */
	private void generateCouponCode(int minNumber, int maxNumber, Integer startingDigits, Integer noOfCoupons,
			String discountId) {
		Set<String> couponCodes = new HashSet<>();
		int counter = 0;
		int generatedCoupons = 0;
		for (int i = 0; i <= noOfCoupons;) {
			if (counter == 1000 || generatedCoupons == noOfCoupons) {
				Set<String> exstingCouponCodes = new HashSet<>();
				List<DiscountCouponDaoExt> disCoupons = discountCouponRepository.findAllByCouponCodeIn(couponCodes);
				if (!disCoupons.isEmpty()) {
					disCoupons.forEach(coupon -> exstingCouponCodes.add(coupon.getCouponCode()));
					couponCodes.removeAll(exstingCouponCodes);
				}
				List<DiscountCouponDaoExt> newdisCoupons = getDiscountCouponList(couponCodes, discountId);
				discountCouponRepository.saveAll(newdisCoupons);
				couponCodes.clear();
				counter = 0;
				i = i - exstingCouponCodes.size();
				generatedCoupons = generatedCoupons - exstingCouponCodes.size();
			}
			StringBuilder sb = new StringBuilder();
			sb.append(startingDigits);
			sb.append(getRandomNumber(minNumber, maxNumber));
			couponCodes.add(sb.toString());
			counter++;
			if (couponCodes.size() == counter) {
				i++;
				generatedCoupons++;
			} else {
				counter--;
			}

		}
	}

	/**
	 * @param couponCodes
	 * @return
	 */
	private List<DiscountCouponDaoExt> getDiscountCouponList(Set<String> couponCodes, String discountId) {
		List<DiscountCouponDaoExt> disCoupons = new ArrayList<>();
		couponCodes.forEach(coupon -> {
			DiscountCouponDaoExt discountCouponDaoExt = new DiscountCouponDaoExt();
			DiscountDaoExt discount = new DiscountDaoExt();
			discount.setId(discountId);
			discountCouponDaoExt.setCouponCode(coupon);
			discountCouponDaoExt.setDiscount(discount);
			discountCouponDaoExt.setStatus(DiscountCouponStatusEnum.OPEN.name());
			disCoupons.add(discountCouponDaoExt);
		});
		return disCoupons;
	}

	/**
	 * @param i
	 * @param maxNumber
	 * @return
	 */
	private int getRandomNumber(int minNumber, int maxNumber) {

		int range = (maxNumber - minNumber) + 1;
		return (int) (Math.random() * range) + minNumber;
	}

	/**
	 * @param noOfCoupons
	 * @return
	 */
	private int findLength(Integer number) {
		int length = 0;
		while (number != 0) {
			number = number / 10;
			length++;
		}
		return length;
	}

	@Override
	public ListResponse<DiscountCouponUpdateResponseDto> updateDiscountCoupons(TSSSCouponRedeemDto requestDto) {
		List<DiscountCouponUpdateResponseDto> response = new ArrayList<>();
		List<DiscountCouponDaoExt> couponsList = new ArrayList<>();
		String locationCode = CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode();
		BusinessDayDto businessDayDto = getBusinessDay(locationCode);

		requestDto.getDiscountCouponDto().forEach(dto -> {
			DiscountCouponDaoExt discountCouponDaoExt = null;
			if (dto.getStatus().equalsIgnoreCase(DiscountCouponStatusEnum.REDEEMED.name())) {
				discountCouponDaoExt = discountCouponRepository.getValidCouponToRedeem(dto.getCouponCode(),
						dto.getDiscountId(), locationCode, businessDayDto.getBusinessDate());
				if (discountCouponDaoExt == null) {
					Map<String, String> errorCause = Map.of("CouponCode:", dto.getCouponCode(), "errorMessage",
							"Discount is not running/Coupon code is already REDEEMED ");
					throw new ServiceException(ConfigConstants.INVALID_COUPONCODE, ConfigConstants.ERR_CONFIG_135,
							errorCause);
				}
			} else if (dto.getStatus().equalsIgnoreCase(DiscountCouponStatusEnum.OPEN.name())) {
				discountCouponDaoExt = discountCouponRepository.getCouponToCancelRedeemption(dto.getCouponCode(),
						dto.getDiscountId());
				if (discountCouponDaoExt == null) {
					throw new ServiceException(ConfigConstants.NO_COUPON_CODES_AVAILABLE,
							ConfigConstants.ERR_CONFIG_134);
				}
			}

			discountCouponDaoExt.setSrcSyncId(discountCouponDaoExt.getSrcSyncId() + 1);
			discountCouponDaoExt.setStatus(dto.getStatus());
			couponsList.add(discountCouponDaoExt);
			DiscountCouponUpdateResponseDto responseDto = (DiscountCouponUpdateResponseDto) MapperUtil
					.getObjectMapping(discountCouponDaoExt, new DiscountCouponUpdateResponseDto());
			responseDto.setDiscountId(dto.getDiscountId());
			response.add(responseDto);
		});
		discountCouponRepository.saveAll(couponsList);
		return new ListResponse<>(response);
	}

	/**
	 * @param locationCode
	 * @return BusinessDayDto
	 */
	private BusinessDayDto getBusinessDay(String locationCode) {
		return engineService.getBusinessDay(locationCode);
	}

	@Override
	public ListResponse<DiscountCouponDto> getDiscountCoupons(CouponDto requestDto) {
		List<DiscountCouponDto> response = new ArrayList<>();
		String locationCode = CustomSecurityPrincipal.getSecurityPrincipal().getLocationCode();
		BusinessDayDto businessDayDto = getBusinessDay(locationCode);
		List<DiscountCouponDaoExt> couponsList = discountCouponRepository.getCouponsList(requestDto.getCouponCodes(),
				businessDayDto.getBusinessDate(), locationCode);
		couponsList.forEach(coupon -> {
			DiscountCouponDto responseDto = (DiscountCouponDto) MapperUtil.getObjectMapping(coupon,
					new DiscountCouponDto());
			responseDto.setDiscountId(coupon.getDiscount().getId());
			response.add(responseDto);
		});
		return new ListResponse<>(response);
	}

	@Override
	public ResponseEntity<Resource> downloadDiscountCoupons(String discountId) {
		getDiscountDao(discountId);
		List<DiscountCouponDaoExt> dicCouponsList = discountCouponRepository.findAllByDiscountId(discountId);
		if (dicCouponsList.isEmpty()) {
			throw new ServiceException(ConfigConstants.NO_COUPON_CODES_AVAILABLE, ConfigConstants.ERR_CONFIG_134);
		}
		String path = new StringBuilder().append("/DISCOUNT").append("/").append("TSSS_COUPONS_" + discountId)
				.append(".").append(FileExtensionEnum.CSV.getValue()).toString();
		String docPath = fileBasePath + path;

		int folderPathEndIndex = docPath.lastIndexOf('/');
		String fileName = docPath.substring(folderPathEndIndex + 1, docPath.length());
		// get the folder path
		String folderPath = docPath.substring(0, folderPathEndIndex);
		File directory = new File(folderPath);
		if (!directory.exists()) {
			directory.mkdirs();
		}
		File file = new File(docPath);

		if (!file.exists()) {
			try {
				file.createNewFile();
			} catch (IOException e) {
				throw new ServiceException(ConfigConstants.ISSUE_IN_COUPON_CODES_FILE_DOWNLOAD,
						ConfigConstants.ERR_CONFIG_136);
			}
		}
		try {

			FileWriter fileWriter = new FileWriter(file);
			fileWriter.append(FILE_HEADER.toString());
			fileWriter.append(NEW_LINE_SEPERATOR);
			dicCouponsList.forEach(disCoupon -> {
				try {
					fileWriter.append(disCoupon.getDiscount().getId());
					fileWriter.append(COMMA_DELEMETER);
					fileWriter.append(disCoupon.getCouponCode());
					fileWriter.append(COMMA_DELEMETER);
					fileWriter.append(disCoupon.getStatus());
					fileWriter.append(NEW_LINE_SEPERATOR);

				} catch (IOException e) {
					throw new ServiceException(ConfigConstants.ISSUE_IN_COUPON_CODES_FILE_DOWNLOAD,
							ConfigConstants.ERR_CONFIG_136);
				}
			});
			fileWriter.close();
		} catch (IOException e) {
			throw new ServiceException(ConfigConstants.ISSUE_IN_COUPON_CODES_FILE_DOWNLOAD,
					ConfigConstants.ERR_CONFIG_136);
		}
		Resource res = null;
		try {
			res = FileUtil.getResourceByFilePath(docPath);
		} catch (MalformedURLException e) {
			throw new ServiceException(ConfigConstants.ISSUE_IN_COUPON_CODES_FILE_DOWNLOAD,
					ConfigConstants.ERR_CONFIG_136);
		}

		return ResponseEntity.ok().header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + fileName)
				.contentType(MediaType.TEXT_PLAIN).body(res);
	}

	@Override
	public DiscountRaiseResponseDto raiseDiscountCreationRequest(String discountId, String typeOfRequest,
			@Valid DiscountRaiseRequestDto discountRequestDto) {

		DiscountDaoExt discountDaoExt = discountRepository.findOneById(discountId);

		if (discountDaoExt == null) {
			throw new ServiceException(ConfigConstants.NO_DISCOUNT_DETAILS_FOUND_FOR_THE_REQUESTED_DISCOUNTID,
					ConfigConstants.ERR_CONFIG_033);
		}
		
		if(discountDaoExt.getIsActive() == false) {
			throw new ServiceException(ConfigConstants.AMENDMENT_NOT_ALLOWED_1,
					ConfigConstants.ERR_CONFIG_184);
		}
		if(discountDaoExt.getTypeOfRequest()!=null) {
		Boolean isRejected = false;
		List<WorkflowTaskDetailsDto> rejectedByEmailApproverList = workflowServiceClient.getWorkflowTasks(discountDaoExt.getWorkflowProcessId(), discountWorkFlowType);
		if(!rejectedByEmailApproverList.isEmpty()) {
			for(WorkflowTaskDetailsDto task : rejectedByEmailApproverList){
				if(task.getTaskStatus().equalsIgnoreCase(WorkflowProcessStatusEnum.REJECTED.name())) {
					isRejected = true;
					discountDaoExt.setFinalStatus(WorkflowProcessStatusEnum.REJECTED.name());
					discountDaoExt.setRequestStatus(WorkflowProcessStatusEnum.REJECTED.name());
				}
					
			}
			if(isRejected) {
				discountRepository.save(discountDaoExt);
				discountRepository.flush();
			}
		
		}
		}

		if (typeOfRequest.equals(DiscountRequestType.NEW.name())) {
			
			if(discountDaoExt.getTypeOfRequest()!=null && discountDaoExt.getTypeOfRequest().equals(DiscountRequestType.AMENDMENT.name())
					&& typeOfRequest.equals(DiscountRequestType.NEW.name())) {
				typeOfRequest = DiscountRequestType.AMENDMENT.name();
			}
			
			if (discountDaoExt.getRequestStatus() != null
					&& (discountDaoExt.getRequestStatus().equals(WorkflowProcessStatusEnum.PENDING.name())
					|| discountDaoExt.getRequestStatus().equals(WorkflowProcessStatusEnum.APPROVED.name())))
				throw new ServiceException(ConfigConstants.REQUEST_ALREADY_RAISED, ConfigConstants.ERR_CONFIG_168);
			

			DiscountTypeMetaDataDao metaDataDao = discountTypeMetaDataRepository
					.findByDiscountType(discountDaoExt.getDiscountType());

			if (metaDataDao == null) {
				throw new ServiceException(ConfigConstants.METADATA_IS_NOT_PRESENT_FOR_THIS_DISCOUNT_TYPE,
						ConfigConstants.ERR_CONFIG_081);
			}

			List<DiscountLocationMappingDaoExt> discountLocation = discountLocationMappingRepository
					.findAllByDiscount(discountDaoExt);
			if (metaDataDao.getLocationMapping().booleanValue()) {

				if (discountLocation.isEmpty()) {
					throw new ServiceException(ConfigConstants.ADD_AT_LEAST_ONE_LOCATION_MAPPING_TO_RAISE_REQUEST,
							ConfigConstants.ERR_CONFIG_169);
				}

			}
			if (metaDataDao.getProductGroupMapping().booleanValue()) {
				List<DiscountProductGroupMappingDaoExt> discountProductGroup = discountProductGroupMappingRepository
						.findAllByDiscount(discountDaoExt);
				if (discountProductGroup.isEmpty()) {
					throw new ServiceException(ConfigConstants.ADD_AT_LEAST_ONE_PRODUCT_MAPPING_TO_RAISE_REQUEST,
							ConfigConstants.ERR_CONFIG_170);
				}
			}
			if (metaDataDao.getProductCategoryMapping().booleanValue()) {
				List<DiscountProductCategoryMappingDaoExt> discountCategoryGroup = discountProductCategoryMappingRepository
						.findAllByDiscount(discountDaoExt);
				if (discountCategoryGroup.isEmpty()) {
					throw new ServiceException(
							ConfigConstants.ADD_AT_LEAST_ONE_PRODUCT_CATEGORY_MAPPING_TO_RAISE_REQUEST,
							ConfigConstants.ERR_CONFIG_171);
				}
			}
			if (discountDaoExt.getDiscountType().equals(DiscountTypeEnum.EMPOWERMENT_DISCOUNT.name())
					|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.HIGH_VALUE_DISCOUNT.name())
					|| discountDaoExt.getDiscountType().equals(DiscountTypeEnum.SLAB_BASED_DISCOUNT.name())) {
				List<DiscountDetailsDaoExt> discountDetailsDaos = discountDetailsRepository
						.findAllByDiscount(discountDaoExt);
				if (discountDetailsDaos.isEmpty()) {
					throw new ServiceException(ConfigConstants.ADD_AT_LEAST_ONE_SLAB_TO_RAISE_REQUEST,
							ConfigConstants.ERR_CONFIG_172);
				}

			}
			WorkflowProcessCreateResponseDto workflowProcessCreateResponseDto = callWorkflowToCreateProcess(
					discountRequestDto, discountDaoExt, typeOfRequest);

			if (workflowProcessCreateResponseDto != null) {
				discountDaoExt.setWorkflowProcessId(workflowProcessCreateResponseDto.getProcessId());
				discountDaoExt.setRequestStatus(workflowProcessCreateResponseDto.getApprovalStatus());
				discountDaoExt.setTypeOfRequest(typeOfRequest);
				discountDaoExt.setRemarks(discountRequestDto.getRemarks());
				discountRepository.save(discountDaoExt);
			}
		} else if (typeOfRequest.equals(DiscountRequestType.AMENDMENT.name())) {

			if (discountDaoExt.getFinalStatus() != null
					&& (!discountDaoExt.getRequestStatus().equals(WorkflowProcessStatusEnum.PENDING.name()))) {
				RuleMasterResponseDto ruleResponseDto = ruleServiceImpl
						.getRuleDetails(RuleTypeEnum.AMENDMENT_CONFIGURATION.name(), 1);
				if (ruleResponseDto == null) {
					Map<String, String> dynamicErrorValues = new HashMap<>();
					dynamicErrorValues.put("ruleType", RuleTypeEnum.AMENDMENT_CONFIGURATION.name());

					throw new ServiceException(ConfigConstants.RESULT_IS_EMPTY_PLEASE_SET_CONFIGURATION,
							ConfigConstants.ERR_CONFIG_015, RuleTypeEnum.AMENDMENT_CONFIGURATION.name(),
							dynamicErrorValues);
				} else if (ruleResponseDto.getRuleDetails() != null) {
					AmendmentRuleDetails ruleDetails = MapperUtil
							.mapObjToClass(ruleResponseDto.getRuleDetails().getData(), AmendmentRuleDetails.class);
					long days = -1;
					if (discountDaoExt.getApprovedDate() != null)
						days = CalendarUtils.getDayDiff(discountDaoExt.getApprovedDate(), new Date());
					if (Long.parseLong(ruleDetails.getNoOfDaysToRaiseAmendment()) >= days) {

						WorkflowProcessCreateResponseDto workflowProcessCreateResponseDto = callWorkflowToCreateProcess(
								discountRequestDto, discountDaoExt, typeOfRequest);

						if (workflowProcessCreateResponseDto != null) {
							discountDaoExt.setWorkflowProcessId(workflowProcessCreateResponseDto.getProcessId());
							discountDaoExt.setRequestStatus(workflowProcessCreateResponseDto.getApprovalStatus());
							discountDaoExt.setTypeOfRequest(typeOfRequest);
							discountDaoExt.setRemarks(discountRequestDto.getRemarks());
							discountRepository.save(discountDaoExt);
						}
					} else {
						throw new ServiceException(ConfigConstants.AMENDMENT_NOT_ALLOWED_AS_PER_CONFIG,
								ConfigConstants.ERR_CONFIG_183);
					}
				}
			} else {
				throw new ServiceException(ConfigConstants.AMENDMENT_NOT_ALLOWED, ConfigConstants.ERR_CONFIG_174);
			}

		}

		DiscountRaiseResponseDto responseDto = new DiscountRaiseResponseDto();
		responseDto.setRequestRemarks(discountRequestDto.getRemarks());
		return responseDto;
	}

	/**
	 * @param discountRequestDto
	 * @param string
	 * @param discountDaoExt
	 * @param typeOfRequest
	 * @return
	 */
	private WorkflowProcessCreateResponseDto callWorkflowToCreateProcess(DiscountRaiseRequestDto discountRequestDto,
			DiscountDaoExt discountDaoExt, String typeOfRequest) {
		DiscountHeaderDto discountHeaderDto = createDiscountHeaderDto(discountDaoExt, discountRequestDto);
		discountHeaderDto.setTypeOfRequest(typeOfRequest);
		// filter values
		Map<String, String> filterValues = new HashMap<>();
		filterValues.put("fiscalYear", String.valueOf(CalendarUtils.getCurrentFiscalYear()));
		filterValues.put("discountType", discountDaoExt.getDiscountType());
		filterValues.put("discountCode", discountDaoExt.getDiscountCode());
		filterValues.put("typeOfRequest", typeOfRequest);
        if(discountRequestDto.getFileDetils() != null) {
        	filterValues.put("fileId", discountRequestDto.getFileDetils().getFileId());
        	filterValues.put("fileName", discountRequestDto.getFileDetils().getFileName());
        }

		Map<String, String> emailContent = new HashMap<>();

		emailContent.put("Discount Code", discountDaoExt.getDiscountCode());
		emailContent.put("Occasion", discountDaoExt.getOccasion());
		emailContent.put("Discount Type", discountDaoExt.getDiscountType());
		emailContent.put("Request Type", typeOfRequest);

		WorkflowProcessCreateDto workflowProcessCreateDto = new WorkflowProcessCreateDto();
		workflowProcessCreateDto.setRequestorRemarks(discountRequestDto.getRemarks());
		workflowProcessCreateDto.setHeaderData(new JsonData(discountWorkFlowType + "_HEADER", discountHeaderDto));
		workflowProcessCreateDto.setRequestData(new JsonData(discountWorkFlowType + "_DETAILS", null));
		workflowProcessCreateDto.setFilterValues(filterValues);
		workflowProcessCreateDto.setEmailContent(emailContent);

		// calling workflow service
		return workflowServiceClient.createWorkflowProcess(discountWorkFlowType, workflowProcessCreateDto);
	}

	/**
	 * @param discountDaoExt
	 * @param discountRequestDto
	 * @return DiscountHeaderDto
	 */
	private DiscountHeaderDto createDiscountHeaderDto(DiscountDaoExt discountDaoExt,
			DiscountRaiseRequestDto discountRequestDto) {
		DiscountHeaderDto discountHeaderDto = (DiscountHeaderDto) MapperUtil.getObjectMapping(discountDaoExt,
				new DiscountHeaderDto());
		discountHeaderDto.setRequestRemarks(discountRequestDto.getRemarks());
		if(discountRequestDto.getFileDetils() != null) {
			discountHeaderDto.setFileId(discountRequestDto.getFileDetils().getFileId());
			discountHeaderDto.setFileName(discountRequestDto.getFileDetils().getFileName());
		}
		return discountHeaderDto;
	}

	@Override
	public DiscountApproveResponseDto approveDiscountCreationRequest(String discountId, String approvalStatus,
			@Valid DiscountApproveRequestDto discountRequestDto) {

		DiscountDaoExt discountDaoExt = discountRepository.findOneById(discountId);
		DiscountApproveResponseDto response = new DiscountApproveResponseDto();
		if (approvalStatus.equals(WorkflowProcessStatusEnum.CANCEL_BEFORE_REQUEST.name())) {
//			deleteSavedData(discountDaoExt);
		} else if (approvalStatus.equals(WorkflowProcessStatusEnum.CANCEL_AFTER_REQUEST.name())) {
			Object object = callWorkflowToUpdateStatus(discountDaoExt, WorkflowProcessStatusEnum.CANCELLED.name(),
					discountRequestDto);
			CancelPendingRequestsResponseDto discountResponseDto = (CancelPendingRequestsResponseDto) MapperUtil
					.getObjectMapping(object, new CancelPendingRequestsResponseDto());
			discountDaoExt.setFinalStatus(WorkflowProcessStatusEnum.CANCELLED.name());
			discountDaoExt.setRequestStatus(WorkflowProcessStatusEnum.CANCELLED.name());
			discountDaoExt.setApprovedBy(discountResponseDto.getApprovedby());
			discountDaoExt.setRemarks(discountRequestDto.getRemarks());
			discountRepository.save(discountDaoExt);
		} else if (approvalStatus.equals(WorkflowProcessStatusEnum.REJECTED.name())) {
			Object object = callWorkflowToUpdateStatus(discountDaoExt, WorkflowProcessStatusEnum.REJECTED.name(),
					discountRequestDto);
			CancelPendingRequestsResponseDto discountResponseDto = (CancelPendingRequestsResponseDto) MapperUtil
					.getObjectMapping(object, new CancelPendingRequestsResponseDto());
			discountDaoExt.setFinalStatus(WorkflowProcessStatusEnum.REJECTED.name());
			discountDaoExt.setRequestStatus(WorkflowProcessStatusEnum.REJECTED.name());
			discountDaoExt.setApprovedBy(discountResponseDto.getApprovedby());
			discountDaoExt.setRemarks(discountRequestDto.getRemarks());
			discountRepository.save(discountDaoExt);
		} else if (approvalStatus.equals(WorkflowProcessStatusEnum.APPROVED.name())) {
			Object object = callWorkflowToUpdateStatus(discountDaoExt, WorkflowProcessStatusEnum.APPROVED.name(),
					discountRequestDto);
			CancelPendingRequestsResponseDto discountResponseDto = (CancelPendingRequestsResponseDto) MapperUtil
					.getObjectMapping(object, new CancelPendingRequestsResponseDto());
			discountDaoExt.setFinalStatus(WorkflowProcessStatusEnum.APPROVED.name());
			discountDaoExt.setRequestStatus(WorkflowProcessStatusEnum.APPROVED.name());
			discountDaoExt.setApprovedDate(new Date());
			discountDaoExt.setApprovedBy(discountResponseDto.getApprovedby());
			discountDaoExt.setRemarks(discountRequestDto.getRemarks());
			discountRepository.save(discountDaoExt);
			publishDiscount(discountId, true);
		} 
		response.setRemarks(discountRequestDto.getRemarks());
		response.setStatus(approvalStatus);

		return response;

	}

	/**
	 * @param discountDaoExt
	 * @param approvalStatus
	 * @param discountRequestDto
	 */
	private Object callWorkflowToUpdateStatus(DiscountDaoExt discountDaoExt, String approvalStatus,
			@Valid DiscountApproveRequestDto discountRequestDto) {

		return workflowServiceClient.cancelPendingRequests(discountDaoExt.getWorkflowProcessId(), discountWorkFlowType,
				approvalStatus);
	}

	/**
	 * @param discountDaoExt
	 */
	private void deleteSavedData(DiscountDaoExt discountDaoExt) {

		List<DiscountLocationMappingDaoExt> locationsDaoExts = discountLocationMappingRepository
				.findAllByDiscount(discountDaoExt);

		if (!locationsDaoExts.isEmpty())
			discountLocationMappingRepository.deleteAll(locationsDaoExts);

		List<DiscountProductGroupMappingDaoExt> products = discountProductGroupMappingRepository
				.findAllByDiscount(discountDaoExt);

		if (!products.isEmpty()) {
			discountProductGroupMappingRepository.deleteAll(products);
		}

		List<DiscountDetailsDaoExt> discountDetails = discountDetailsRepository.findAllByDiscount(discountDaoExt);

		if (!discountDetails.isEmpty()) {
			discountDetailsRepository.deleteAll(discountDetails);
		}

		List<DiscountExcludeMappingDaoExt> excludes = discountExcludeMappingRepository
				.findAllByDiscount(discountDaoExt);

		if (!excludes.isEmpty()) {
			discountExcludeMappingRepository.deleteAll(excludes);
		}

		List<DiscountProductCategoryMappingDaoExt> prdCategory = discountProductCategoryMappingRepository
				.findAllByDiscount(discountDaoExt);

		if (!prdCategory.isEmpty()) {
			discountProductCategoryMappingRepository.deleteAll(prdCategory);
		}

		List<LinkingDiscountsDaoExt> linking = linkingDiscountRepo.getLinkDiscounts(discountDaoExt.getId());

		if (!linking.isEmpty()) {
			linkingDiscountRepo.deleteAll(linking);
		}

		List<ClubbingDiscountsDaoExt> clubbing = clubbingDiscountsRepository.getByDiscount(discountDaoExt.getId());

		if (!clubbing.isEmpty()) {
			clubbingDiscountsRepository.deleteAll(clubbing);
		}

		List<DiscountItemMappingDaoExt> items = discountItemMappingRepository.findAllByDiscount(discountDaoExt);

		if (!items.isEmpty()) {
			discountItemMappingRepository.deleteAll(items);
		}

		List<DiscountCouponDaoExt> coupons = discountCouponRepository.findAllByDiscountId(discountDaoExt.getId());

		if (!coupons.isEmpty()) {
			discountCouponRepository.deleteAll(coupons);
		}

	}

}
