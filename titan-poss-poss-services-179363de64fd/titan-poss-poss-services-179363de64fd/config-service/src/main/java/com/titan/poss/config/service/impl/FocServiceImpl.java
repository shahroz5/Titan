/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.config.service.impl;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.titan.poss.config.dao.FocSchemeDetailsDaoExt;
import com.titan.poss.config.dao.FocSchemeItemMappingDaoExt;
import com.titan.poss.config.dao.FocSchemeLocationMappingDaoExt;
import com.titan.poss.config.dao.FocSchemeMasterDaoExt;
import com.titan.poss.config.dao.FocSchemeProductMappingDaoExt;
import com.titan.poss.config.dao.SyncStaging;
import com.titan.poss.config.dto.FocLocationLiteDto;
import com.titan.poss.config.dto.FocSchemeDetailBaseDto;
import com.titan.poss.config.dto.FocSchemeDetailDto;
import com.titan.poss.config.dto.FocSchemeDetailsListDto;
import com.titan.poss.config.dto.FocSchemeDetailsSyncDtoExt;
import com.titan.poss.config.dto.FocSchemeItemMappingSyncDtoExt;
import com.titan.poss.config.dto.FocSchemeLocationMappingSyncDtoExt;
import com.titan.poss.config.dto.FocSchemeMasterSyncDtoExt;
import com.titan.poss.config.dto.FocSchemeProductMappingSyncDtoExt;
import com.titan.poss.config.dto.constants.ConfigConstants;
import com.titan.poss.config.dto.constants.OfferTypeEnum;
import com.titan.poss.config.dto.request.FocItemMappingRequestDto;
import com.titan.poss.config.dto.request.FocLocationRequestDto;
import com.titan.poss.config.dto.request.FocSchemeAddDto;
import com.titan.poss.config.dto.request.FocSchemeDetailUpdateDto;
import com.titan.poss.config.dto.request.FocSchemeUpdateDto;
import com.titan.poss.config.dto.request.FocUpdateProductDto;
import com.titan.poss.config.dto.request.json.GrnLocationConfigDetails;
import com.titan.poss.config.dto.request.json.LocationConfigDetails;
import com.titan.poss.config.dto.request.json.OrderConfigDetails;
import com.titan.poss.config.dto.response.FocItemMappingResponseDto;
import com.titan.poss.config.dto.response.FocLocationResponseDto;
import com.titan.poss.config.dto.response.FocProductDto;
import com.titan.poss.config.dto.response.FocSchemeDetailResponseDto;
import com.titan.poss.config.dto.response.FocSchemeHeaderDto;
import com.titan.poss.config.dto.response.FocSchemeResponseDto;
import com.titan.poss.config.repository.ConfigSyncStagingRepository;
import com.titan.poss.config.repository.FocSchemeDetailsRepositoryExt;
import com.titan.poss.config.repository.FocSchemeItemMappingRepositoryExt;
import com.titan.poss.config.repository.FocSchemeLocationMappingRepositoryExt;
import com.titan.poss.config.repository.FocSchemeMasterRepositoryExt;
import com.titan.poss.config.repository.FocSchemeProductMappingRepositoryExt;
import com.titan.poss.config.service.ConfigSyncDataService;
import com.titan.poss.config.service.EngineService;
import com.titan.poss.config.service.FocService;
import com.titan.poss.core.domain.validator.SlabValidator;
import com.titan.poss.core.dto.ClubbingConfigDetails;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.LocationCacheDto;
import com.titan.poss.core.dto.LocationCacheRequestDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.TepConfigDetails;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CalendarUtils;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.ConfigServiceOperationCodes;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */

@Service(ConfigConstants.FOC_SERVICE_IMPL)
public class FocServiceImpl implements FocService {

	@Autowired
	FocSchemeMasterRepositoryExt focSchemeMasterRepository;

	@Autowired
	FocSchemeLocationMappingRepositoryExt focSchemeLocationMappingRepository;

	@Autowired
	FocSchemeDetailsRepositoryExt focSchemeDetailsRepository;

	@Autowired
	EngineService engineService;

	@Autowired
	FocSchemeItemMappingRepositoryExt focSchemeItemMappingRepository;

	@Autowired
	FocSchemeProductMappingRepositoryExt focProductMappingRepository;

	@Autowired
	private ConfigSyncDataService syncDataService;

	@Autowired
	private FocServiceImpl focServiceImp;

	@Autowired
	private ConfigSyncStagingRepository configSyncStagingRepository;

	/**
	 * This method save FOCScheme definition details
	 * 
	 * @param FocSchemeAddDto
	 * @return FocSchemeResponseDto
	 */
	@Override
	public FocSchemeResponseDto createScheme(FocSchemeAddDto focSchemeAddDto) {

		validateJsonfromRequest(focSchemeAddDto);

		FocSchemeMasterDaoExt focSchemeMasterDao = new FocSchemeMasterDaoExt();
		setRequestJsonToDao(focSchemeMasterDao, focSchemeAddDto);
		focSchemeMasterDao.setDescription(focSchemeAddDto.getDescription());
		focSchemeMasterDao.setName(focSchemeAddDto.getName());
		focSchemeMasterDao.setIsActive(focSchemeAddDto.getIsActive());
		focSchemeMasterDao.setManualFoc(false);
		focSchemeMasterDao.setIsPublishPending(true);
		focSchemeMasterDao.setIsAccrualUlp(focSchemeAddDto.getIsAccrualUlp());
		FocSchemeResponseDto focSchemeResponseDto = (FocSchemeResponseDto) MapperUtil
				.getDtoMapping(focSchemeMasterRepository.save(focSchemeMasterDao), FocSchemeResponseDto.class);
		setJsonToResponseObject(focSchemeResponseDto, focSchemeMasterDao);

		return focSchemeResponseDto;
	}

	/**
	 * @param focSchemeResponseDto
	 * @param focSchemeAddDto
	 */
	private void setJsonToResponseObject(FocSchemeResponseDto focSchemeResponseDto,
			FocSchemeMasterDaoExt focSchemeMasterDao) {

		JsonData jsonData = null;
		Object object = null;

		if (focSchemeMasterDao.getGrnConfig() != null) {
			object = MapperUtil.getJsonFromString(focSchemeMasterDao.getGrnConfig());
			jsonData = MapperUtil.getObjectMapperInstance().convertValue(object, JsonData.class);
			focSchemeResponseDto.setGrnConfig(jsonData);
		}
		if (focSchemeMasterDao.getOrderConfig() != null) {
			object = MapperUtil.getJsonFromString(focSchemeMasterDao.getOrderConfig());
			jsonData = MapperUtil.getObjectMapperInstance().convertValue(object, JsonData.class);
			focSchemeResponseDto.setOrderConfig(jsonData);
		}

		if (focSchemeMasterDao.getTepConfig() != null) {
			object = MapperUtil.getJsonFromString(focSchemeMasterDao.getTepConfig());
			jsonData = MapperUtil.getObjectMapperInstance().convertValue(object, JsonData.class);
			focSchemeResponseDto.setTepConfig(jsonData);
		}

		if (focSchemeMasterDao.getClubbingConfig() != null) {
			object = MapperUtil.getJsonFromString(focSchemeMasterDao.getClubbingConfig());
			jsonData = MapperUtil.getObjectMapperInstance().convertValue(object, JsonData.class);
			focSchemeResponseDto.setClubbingConfig(jsonData);
		}

		if (focSchemeMasterDao.getIsAccrualUlp() != null)
			focSchemeResponseDto.setIsAccrualUlp(focSchemeMasterDao.getIsAccrualUlp());
	}

	/**
	 * @param focSchemeMasterDao
	 * @param focSchemeAddDto
	 */
	private void setRequestJsonToDao(FocSchemeMasterDaoExt focSchemeMasterDao, FocSchemeAddDto focSchemeAddDto) {
		if (focSchemeAddDto.getClubbingConfigData() != null)
			focSchemeMasterDao.setClubbingConfig(MapperUtil.getJsonString(focSchemeAddDto.getClubbingConfigData()));
		if (focSchemeAddDto.getGrnConfigData() != null)
			focSchemeMasterDao.setGrnConfig(MapperUtil.getJsonString(focSchemeAddDto.getGrnConfigData()));
		if (focSchemeAddDto.getTepConfigData() != null)
			focSchemeMasterDao.setTepConfig(MapperUtil.getJsonString(focSchemeAddDto.getTepConfigData()));
		if (focSchemeAddDto.getOrderConfigData() != null)
			focSchemeMasterDao.setOrderConfig(MapperUtil.getJsonString(focSchemeAddDto.getOrderConfigData()));

	}

	/**
	 * This method will validate the Json fields in Request
	 * 
	 * @param focSchemeAddDto
	 */
	private void validateJsonfromRequest(FocSchemeAddDto focSchemeAddDto) {
		if (focSchemeAddDto.getGrnConfigData() != null) {
			GrnLocationConfigDetails grnData = new GrnLocationConfigDetails();
			grnData.validate(focSchemeAddDto.getGrnConfigData().getData());

		}

		if (focSchemeAddDto.getTepConfigData() != null) {
			TepConfigDetails tepData = new TepConfigDetails();
			tepData.validate(focSchemeAddDto.getTepConfigData().getData());
		}

		if (focSchemeAddDto.getOrderConfigData() != null) {
			OrderConfigDetails orderData = new OrderConfigDetails();
			orderData.validate(focSchemeAddDto.getOrderConfigData().getData());
		}

		if (focSchemeAddDto.getClubbingConfigData() != null) {
			ClubbingConfigDetails clubbingConfig = new ClubbingConfigDetails();
			clubbingConfig.validate(focSchemeAddDto.getClubbingConfigData().getData());
		}

	}

	/**
	 * This method will return FOCScheme definition
	 * 
	 * @param id
	 * @param schemeName
	 * @return FocSchemeResponseDto
	 */
	@Override
	public FocSchemeResponseDto getScheme(String id, String schemeName) {
		FocSchemeMasterDaoExt focSchemeMasterDao = focSchemeMasterRepository.findByIdOrSchemeName(id, schemeName);
		if (focSchemeMasterDao == null) {
			throw new ServiceException(ConfigConstants.INVALID_SCHEME_ID_OR_SCHEME_NAME,
					ConfigConstants.ERR_CONFIG_048);
		}
		FocSchemeResponseDto focSchemeResponseDto = (FocSchemeResponseDto) MapperUtil.getDtoMapping(focSchemeMasterDao,
				FocSchemeResponseDto.class);
		setJsonToResponseObject(focSchemeResponseDto, focSchemeMasterDao);
		return focSchemeResponseDto;
	}

	/**
	 * This method will return all FOCScheme definition
	 * 
	 * @param
	 * @return List<FocSchemeResponseDto>
	 */
	@Override
	public PagedRestResponse<List<FocSchemeHeaderDto>> getAllScheme(String schemeName, Pageable pageable) {

		List<FocSchemeHeaderDto> focSchemeHeaderDtoList = new ArrayList<>();

		Page<FocSchemeMasterDaoExt> focSchemeMasterPageList = focSchemeMasterRepository.getFocList(schemeName,
				pageable);

		focSchemeMasterPageList.forEach(focSchemeMasterDao -> {
			FocSchemeHeaderDto focSchemeHeaderDto = (FocSchemeHeaderDto) MapperUtil.getDtoMapping(focSchemeMasterDao,
					FocSchemeHeaderDto.class);
			focSchemeHeaderDtoList.add(focSchemeHeaderDto);

		});

		return (new PagedRestResponse<>(focSchemeHeaderDtoList, focSchemeMasterPageList));
	}

	/**
	 * This method will return the updated FOCScheme definition details based on the
	 * SchemeId.
	 * 
	 * @param id
	 * @return FocSchemeResponseDto
	 */
	@Override
	public FocSchemeResponseDto updateScheme(String id, FocSchemeUpdateDto focSchemeUpdateDto) {
		FocSchemeMasterDaoExt focSchemeMasterDao = focSchemeMasterRepository.findById(id).orElseThrow(
				() -> new ServiceException(ConfigConstants.INVALID_SCHEME_ID, ConfigConstants.ERR_CONFIG_030));

		if (focSchemeMasterDao.getManualFoc()) {
			throw new ServiceException(ConfigConstants.CANNOT_EDIT_HEADER_INFO, ConfigConstants.ERR_CONFIG_046);
		}

		if (focSchemeUpdateDto.getIsActive() != null) {
			if (focSchemeUpdateDto.getIsActive() == true && focSchemeMasterDao.getIsActive() == false) {

				List<FocSchemeLocationMappingDaoExt> locationMappingList = focSchemeLocationMappingRepository
						.checkLocationMapping(focSchemeMasterDao.getId());
				List<String> locationCodes = new ArrayList<>();
				if (!locationMappingList.isEmpty()) {
					locationMappingList.forEach(location -> {
						locationCodes.add(location.getLocationCode());
						if (focSchemeLocationMappingRepository.ifLocationExist(location.getId(),
								location.getFocSchemeMasterDao().getId(), location.getStartDate(),
								location.getEndDate()) > 0)
							throw new ServiceException(ConfigConstants.MAKE_FOC_LOCATION_MAPPINGS_AS_INACTIVE,
									ConfigConstants.ERR_CONFIG_189);
					});

					// 1st May - 31st July -> making this header as active
					// and already 20 July-30 July is there...in this case above validation won't
					// work

					List<FocSchemeLocationMappingDaoExt> locationMappingList1 = focSchemeLocationMappingRepository
							.checkLocationMapping1(focSchemeMasterDao.getId(), locationCodes);
					if (!locationMappingList1.isEmpty()) {
						locationMappingList.forEach(location -> {
							if (focSchemeLocationMappingRepository.ifLocationExist(location.getId(),
									location.getFocSchemeMasterDao().getId(), location.getStartDate(),
									location.getEndDate()) > 0)
								throw new ServiceException(ConfigConstants.MAKE_FOC_LOCATION_MAPPINGS_AS_INACTIVE,
										ConfigConstants.ERR_CONFIG_189);
						});
					}
				}

			}
		}

		FocSchemeAddDto focSchemeAddDto = (FocSchemeAddDto) MapperUtil.getObjectMapping(focSchemeUpdateDto,
				new FocSchemeAddDto());

		validateJsonfromRequest(focSchemeAddDto);

		focSchemeMasterDao = (FocSchemeMasterDaoExt) MapperUtil.getObjectMapping(focSchemeAddDto, focSchemeMasterDao);

		setRequestJsonToDao(focSchemeMasterDao, focSchemeAddDto);

		focSchemeMasterDao.setIsPublishPending(true);
		focSchemeMasterDao.setIsAccrualUlp(focSchemeAddDto.getIsAccrualUlp());
		focSchemeMasterDao.setSrcSyncId(focSchemeMasterDao.getSrcSyncId() + 1);
		focSchemeMasterDao = focSchemeMasterRepository.save(focSchemeMasterDao);

		FocSchemeResponseDto focSchemeResponseDto = (FocSchemeResponseDto) MapperUtil.getDtoMapping(focSchemeMasterDao,
				FocSchemeResponseDto.class);

		setJsonToResponseObject(focSchemeResponseDto, focSchemeMasterDao);

		return focSchemeResponseDto;
	}

	/**
	 * This method will return the updated FOCScheme details based on the SchemeId.
	 * 
	 * @param id
	 * @return FocSchemeDetailDto
	 */
	@Override
	@Transactional
	public ListResponse<FocSchemeDetailResponseDto> updateSchemeDetails(String id,
			FocSchemeDetailDto focSchemeDetailDto) {

		FocSchemeMasterDaoExt focSchemeMasterDao = focSchemeMasterRepository.findById(id).orElseThrow(
				() -> new ServiceException(ConfigConstants.INVALID_SCHEME_ID, ConfigConstants.ERR_CONFIG_030));

		List<FocSchemeDetailResponseDto> focSchemeDetailResponseDtos = new ArrayList<>();
		List<FocSchemeDetailsDaoExt> schemeDetailsDaos = new ArrayList<>();
		List<FocSchemeDetailBaseDto> slabList = new ArrayList<>();

		if (!focSchemeDetailDto.getDeleteSchemeDetails().isEmpty()) {

			List<FocSchemeDetailsDaoExt> deleteList = focSchemeDetailsRepository
					.findAllById(focSchemeDetailDto.getDeleteSchemeDetails());
			if (!deleteList.isEmpty()) {
				deleteList.forEach(scheme -> {
					if (focSchemeMasterDao.getPublishTime() != null
							&& scheme.getCreatedDate().getTime() < focSchemeMasterDao.getPublishTime().getTime()) {
						throw new ServiceException(ConfigConstants.FOC_SCHEME_DETAILS_CANNOT_BE_REMOVED,
								ConfigConstants.ERR_CONFIG_091);
					}
				});
			}

			List<FocSchemeProductMappingDaoExt> focProducts = focProductMappingRepository
					.getMappedProducts(focSchemeDetailDto.getDeleteSchemeDetails());

			if (!focProducts.isEmpty()) {
				focProductMappingRepository.deleteAll(focProducts);
				focSchemeDetailsRepository.flush();
			}

			focSchemeDetailsRepository.deleteAll(deleteList);
			focSchemeDetailsRepository.flush();
		}
		if (!focSchemeDetailDto.getUpdateSchemeDetails().isEmpty()) {
			List<FocSchemeDetailsDaoExt> updateSchemeDetailsDaos = new ArrayList<>();
			Map<String, FocSchemeDetailUpdateDto> focSchemeDetailsMap = new HashMap<>();
			focSchemeDetailDto.getUpdateSchemeDetails().forEach(updateSchemeDetail -> {
				if (updateSchemeDetail.getOfferType().equalsIgnoreCase(OfferTypeEnum.SLAB.toString()) && updateSchemeDetail.getIsActive()) {
					slabList.add(updateSchemeDetail);
				}
				focSchemeDetailsMap.put(updateSchemeDetail.getSchemDetailsId(), updateSchemeDetail);
			});

			List<FocSchemeDetailsDaoExt> focSchemeDetailsDaos = focSchemeDetailsRepository
					.findAllById(focSchemeDetailsMap.keySet());
			if (!focSchemeDetailsDaos.isEmpty()) {
				focSchemeDetailsDaos.forEach(focSchemeDetailDao -> {
					FocSchemeDetailUpdateDto focSchemeDetailUpdateDto = focSchemeDetailsMap
							.get(focSchemeDetailDao.getId());
					focSchemeDetailDao = (FocSchemeDetailsDaoExt) MapperUtil.getObjectMapping(focSchemeDetailUpdateDto,
							focSchemeDetailDao);
					focSchemeDetailDao.setSrcSyncId(focSchemeDetailDao.getSrcSyncId() + 1);
					updateSchemeDetailsDaos.add(focSchemeDetailDao);
				});
			}
			List<FocSchemeDetailsDaoExt> sortedSchemeDetailsDaos = updateSchemeDetailsDaos.stream()
					.sorted(Comparator.comparing(FocSchemeDetailsDaoExt::getRowId).reversed())
					.collect(Collectors.toList());
			focSchemeDetailsRepository.saveAll(sortedSchemeDetailsDaos);
			focSchemeDetailsRepository.flush();
		}

		if (!focSchemeDetailDto.getAddSchemeDetails().isEmpty()) {

			focSchemeDetailDto.getAddSchemeDetails().forEach(focSchemeDetailAddDto -> {
				if (focSchemeDetailAddDto.getOfferType().equalsIgnoreCase(OfferTypeEnum.SLAB.toString())&& focSchemeDetailAddDto.getIsActive()) {
					slabList.add(focSchemeDetailAddDto);
				}
				FocSchemeDetailsDaoExt focSchemeDetailsDao = (FocSchemeDetailsDaoExt) MapperUtil
						.getDtoMapping(focSchemeDetailAddDto, FocSchemeDetailsDaoExt.class);
				focSchemeDetailsDao.setFocSchemeMasterDao(focSchemeMasterDao);
				schemeDetailsDaos.add(focSchemeDetailsDao);
			});
		}

		if (!CollectionUtils.isEmpty(slabList)) {
			SlabValidator.createAndValidateSlabObject(slabList, FocSchemeDetailBaseDto.class, "fromSaleValue",
					"toSaleValue", "rowId");
		}
		focSchemeMasterDao.setIsPublishPending(true);
		focSchemeMasterDao.setSrcSyncId(focSchemeMasterDao.getSrcSyncId() + 1);
		focSchemeMasterRepository.save(focSchemeMasterDao);
		focSchemeDetailsRepository.saveAll(schemeDetailsDaos);

		schemeDetailsDaos
				.forEach(schemeDetailDao -> focSchemeDetailResponseDtos.add((FocSchemeDetailResponseDto) MapperUtil
						.getDtoMapping(schemeDetailDao, FocSchemeDetailResponseDto.class)));
		return new ListResponse<>(focSchemeDetailResponseDtos);
	}

	/**
	 * This method will return the FOCScheme details based on the SchemeId.
	 * 
	 * @param id
	 * @return FocSchemeDetailsDto
	 */
	@Override
	public PagedRestResponse<List<FocSchemeDetailsListDto>> getSchemeDetails(String id, Pageable pageable,
			String category, String itemType, String offerType, String productGroupCode) {

		FocSchemeMasterDaoExt focSchemeMasterDao = focSchemeMasterRepository.findById(id).orElseThrow(
				() -> new ServiceException(ConfigConstants.INVALID_SCHEME_ID, ConfigConstants.ERR_CONFIG_030));

		checkNullString(category);
		checkNullString(itemType);
		checkNullString(offerType);
		checkNullString(productGroupCode);

		Page<Object[]> focSchemeDetailsDaoPageList = focSchemeDetailsRepository.findAllBasedOnFilters(
				focSchemeMasterDao.getId(), category, itemType, offerType, productGroupCode, pageable);

		List<FocSchemeDetailsListDto> focSchemeDetailsDtoList = mapSchemeDetailToDto(focSchemeDetailsDaoPageList);

		return (new PagedRestResponse<>(focSchemeDetailsDtoList, focSchemeDetailsDaoPageList));
	}

	/**
	 * @param category
	 * @return
	 */
	private String checkNullString(String string) {
		if (string == null) {
			string = "";
		}
		return string;

	}

	/**
	 * @param focSchemeDetailsDaoPageList
	 * @return
	 */
	private List<FocSchemeDetailsListDto> mapSchemeDetailToDto(Page<Object[]> focSchemeDetailsDaoPageList) {
		List<FocSchemeDetailsListDto> focSchemeDetailsDtoList = new ArrayList<>();

		for (Object[] object : focSchemeDetailsDaoPageList) {
			FocSchemeDetailsListDto focSchemeDetailDto = new FocSchemeDetailsListDto();
			focSchemeDetailDto.setId((String) object[0]);
			focSchemeDetailDto.setCategory((String) object[1]);
			focSchemeDetailDto.setItemType((String) object[2]);
			focSchemeDetailDto.setOfferType((String) object[3]);
			focSchemeDetailDto.setFocEligibility((String) object[4]);
			focSchemeDetailDto.setItemCode((String) object[5]);
			focSchemeDetailDto.setIsMultiple((Boolean) object[6]);
			focSchemeDetailDto.setStdSaleValue((BigDecimal) object[7]);
			focSchemeDetailDto.setFromSaleValue((BigDecimal) object[8]);
			focSchemeDetailDto.setToSaleValue((BigDecimal) object[9]);
			focSchemeDetailDto.setWeight((BigDecimal) object[10]);
			focSchemeDetailDto.setQuantity((short) object[11]);
			focSchemeDetailDto.setRowId((Integer) object[12]);
			focSchemeDetailDto.setKarat((BigDecimal) object[13]);
			focSchemeDetailDto.setIsSingle((Boolean) object[14]);
			focSchemeDetailDto.setIsActive((Boolean) object[15]);
			if ((Integer) object[16] != null) {
				focSchemeDetailDto.setProductGroupCount((Integer) object[16]);
			} else {
				focSchemeDetailDto.setProductGroupCount(0);
			}
			focSchemeDetailsDtoList.add(focSchemeDetailDto);
		}

		return focSchemeDetailsDtoList;
	}

	@Override
	@Transactional
	public ListResponse<FocLocationResponseDto> updateLocation(String id, FocLocationRequestDto focLocationRequestDto) {

		FocSchemeMasterDaoExt focSchemeMasterDao = focSchemeMasterRepository.findById(id).orElseThrow(
				() -> new ServiceException(ConfigConstants.INVALID_SCHEME_ID, ConfigConstants.ERR_CONFIG_030));

		String configType = "";
		
		if (focLocationRequestDto.getConfigDetails() != null) {
			LocationConfigDetails configDetails = new LocationConfigDetails();
			configType = focLocationRequestDto.getConfigDetails().getType();
			configDetails.validate(focLocationRequestDto.getConfigDetails().getData());
		}
		List<SyncData> syncDatas = new ArrayList<>();
		// kept for future use
		if (!CollectionUtils.isEmpty(focLocationRequestDto.getRemoveLocations())) {
			List<FocSchemeLocationMappingDaoExt> deleteLocList = focSchemeLocationMappingRepository
					.findByIdIn(focLocationRequestDto.getRemoveLocations());
			if (!deleteLocList.isEmpty()) {
				deleteLocList.forEach(loc -> {
					if (focSchemeMasterDao.getPublishTime() != null
							&& loc.getCreatedDate().getTime() < focSchemeMasterDao.getPublishTime().getTime()) {
						throw new ServiceException(ConfigConstants.LOCATIONS_CANNOT_BE_REMOVED,
								ConfigConstants.ERR_CONFIG_110, focSchemeMasterDao.getPublishTime());
					}
				});
			}
			focSchemeLocationMappingRepository.deleteAll(deleteLocList);
			focSchemeLocationMappingRepository.flush();
		}

		List<FocSchemeLocationMappingDaoExt> focLocationMappingDaos = new ArrayList<>();

		Set<String> updateLocationList = focLocationRequestDto.getUpdateLocations();

		if (!CollectionUtils.isEmpty(updateLocationList) && (focLocationRequestDto.getValidity() != null)) {
			updateLocations(id, updateLocationList, focLocationMappingDaos, focSchemeMasterDao, focLocationRequestDto);
		}

		Set<String> addLocations = focLocationRequestDto.getAddLocations();
		Date startDate = null;
		Date endDate = null;
		if (!CollectionUtils.isEmpty(addLocations) && (focLocationRequestDto.getValidity() != null)) {
			if (focLocationRequestDto.getValidity().getStartDate() == null
					&& focLocationRequestDto.getValidity().getEndDate() == null
					&& focLocationRequestDto.getValidity().getStatus() == null) {
				focLocationRequestDto.getValidity().setStartDate(CalendarUtils.getCurrentDate());
				focLocationRequestDto.getValidity().setEndDate(CalendarUtils.getCurrentDate());
				focLocationRequestDto.getValidity().setStatus(Boolean.TRUE);
			}
			startDate = CalendarUtils.getStartOfDay(focLocationRequestDto.getValidity().getStartDate());
			endDate = CalendarUtils.getStartOfDay(focLocationRequestDto.getValidity().getEndDate());

			List<FocLocationLiteDto> focSchemeLocList; 
			if(!configType.isEmpty() && configType.equalsIgnoreCase("FOC_BLOCKING_FOR_CUSTOMER")) {
				focSchemeLocList = focSchemeLocationMappingRepository.checkMappedSchemeForCustomer(id,
						addLocations,focLocationRequestDto.getMobileNo());
			} else {
				focSchemeLocList = focSchemeLocationMappingRepository.checkMappedScheme(id,
						addLocations, startDate, endDate,true);
			}
			
			
			if (!CollectionUtils.isEmpty(focSchemeLocList)) {
				Map<String, String> dynamicErrorValues = new HashMap<>();
				dynamicErrorValues.put("schemeName", focSchemeLocList.get(0).getSchemeName());
				// for given location,if already one scheme is running/active throw exception.
				// bcoz at a time we can have only one schme per location
				throw new ServiceException(ConfigConstants.INVALID_SCHEME_LOCATION_MAPPING,
						ConfigConstants.ERR_CONFIG_047, dynamicErrorValues);
			}

			for (String locationCode : addLocations) {
				
				if (focLocationRequestDto.getConfigDetails()!= null && configType.equalsIgnoreCase("FOC_BLOCKING_FOR_CUSTOMER") && 
						focSchemeLocationMappingRepository.ifCustomerExist(locationCode, id, focLocationRequestDto.getMobileNo()) > 0) {
					throw new ServiceException(ConfigConstants.SCHEME_ALREADY_PRESENT, ConfigConstants.ERR_CONFIG_032);
				} else if (focLocationRequestDto.getConfigDetails()!= null && !configType.equalsIgnoreCase("FOC_BLOCKING_FOR_CUSTOMER") && 
						focSchemeLocationMappingRepository.ifExist(locationCode, startDate, endDate, id) > 0) {
					throw new ServiceException(ConfigConstants.SCHEME_ALREADY_PRESENT, ConfigConstants.ERR_CONFIG_032);
				}

				FocSchemeLocationMappingDaoExt focLocationMappingDao = new FocSchemeLocationMappingDaoExt();
				focLocationMappingDao.setLocationCode(locationCode);
				focLocationMappingDao.setStartDate(startDate);
				focLocationMappingDao.setEndDate(endDate);
				focLocationMappingDao.setMobileNo(focLocationRequestDto.getMobileNo());
				focLocationMappingDao.setFocSchemeMasterDao(focSchemeMasterDao);
				focLocationMappingDao.setIsActive(focLocationRequestDto.getValidity().getStatus());
				focLocationMappingDao
						.setConfigDetails(MapperUtil.getJsonString(focLocationRequestDto.getConfigDetails()));
				focLocationMappingDaos.add(focLocationMappingDao);
				duplicateCheckWhileUpdatingLocation(focLocationMappingDao, focLocationRequestDto, id);
			}
			focSchemeMasterDao.setIsPublishPending(true);
			focSchemeMasterDao.setSrcSyncId(focSchemeMasterDao.getSrcSyncId() + 1);
			focSchemeMasterRepository.save(focSchemeMasterDao);
			focSchemeLocationMappingRepository.saveAll(focLocationMappingDaos);

		}
		if (focSchemeMasterDao.getManualFoc()) {
			focLocationMappingDaos.forEach(location -> {
				List<String> destinations = new ArrayList<>();
				destinations.add(location.getLocationCode());
				FocSchemeLocationMappingSyncDtoExt focLocSyncDtoExt = new FocSchemeLocationMappingSyncDtoExt(location);
				syncDatas.add(DataSyncUtil.createSyncData(focLocSyncDtoExt, 2));
				SyncStagingDto syncStagingDto = focServiceImp.saveToSyncStaging(syncDatas,
						ConfigServiceOperationCodes.MANUAL_FOC, destinations, DestinationType.SELECTIVE.name(), null);
				syncDataService.publishConfigMessagesToQueue(syncStagingDto);

			});
		}

		return new ListResponse<>(focLocationResponse(createResponse(focLocationMappingDaos)));

	}

	private List<FocLocationResponseDto> createResponse(List<FocSchemeLocationMappingDaoExt> focLocationMappingDaos) {
		List<FocLocationResponseDto> focLocationResponseDtos = new ArrayList<>();
		if (!CollectionUtils.isEmpty(focLocationMappingDaos)) {
			focLocationMappingDaos.forEach(focLocationMappingDao -> {

				FocLocationResponseDto focLocationResponseDto = (FocLocationResponseDto) MapperUtil
						.getDtoMapping(focLocationMappingDao, FocLocationResponseDto.class);
				if (focLocationMappingDao.getConfigDetails() != null) {
					Object obj = MapperUtil.getJsonFromString(focLocationMappingDao.getConfigDetails());
					JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
					focLocationResponseDto.setConfigDetails(jsonData);
				}

				if (focLocationMappingDao.getMobileNo() != null) {
					focLocationResponseDto.setMobileNo(focLocationMappingDao.getMobileNo());
				}
				focLocationResponseDto.setStatus(focLocationMappingDao.getIsActive());
				focLocationResponseDtos.add(focLocationResponseDto);
			});
		}
		return focLocationResponseDtos;

	}

	/**
	 * @param schemeId
	 * @param updateLocationList
	 * @param focLocationResponseDtos
	 * @param focLocationMappingDaos
	 * @param focLocationRequestDto
	 */
	private void updateLocations(String schemeId, Set<String> updateLocationList,
			List<FocSchemeLocationMappingDaoExt> focLocationMappingDaos, FocSchemeMasterDaoExt focSchemeMasterDao,
			FocLocationRequestDto focLocationRequestDto) {

		Map<String, FocSchemeLocationMappingDaoExt> focLocationMappingDaoMap = new HashMap<>();
		List<FocSchemeLocationMappingDaoExt> focLocationMappingResultDaos = focSchemeLocationMappingRepository
				.findAllById(updateLocationList.stream().collect(Collectors.toList()));
		focLocationMappingResultDaos.forEach(
				locationMappingDao -> focLocationMappingDaoMap.put(locationMappingDao.getId(), locationMappingDao));

		updateLocationList.forEach(locationId -> {
			FocSchemeLocationMappingDaoExt focLocationMappingDao = focLocationMappingDaoMap.get(locationId);
			focLocationMappingDaos
					.add(updateLocation(focLocationRequestDto, focLocationMappingDao, focSchemeMasterDao));
			duplicateCheckWhileUpdatingLocation(focLocationMappingDao, focLocationRequestDto, schemeId);
		});
		focSchemeMasterDao.setIsPublishPending(true);
		focSchemeMasterDao.setSrcSyncId(focSchemeMasterDao.getSrcSyncId() + 1);
		focSchemeMasterRepository.save(focSchemeMasterDao);
		focSchemeLocationMappingRepository.saveAll(focLocationMappingDaos);
		focSchemeLocationMappingRepository.flush();
	}

	/**
	 * @param focLocationRequestDto
	 * @param loc
	 * @param schemeId
	 * 
	 */
	private void duplicateCheckWhileUpdatingLocation(FocSchemeLocationMappingDaoExt loc,
			FocLocationRequestDto focLocationRequestDto, String schemeId) {
		Set<String> addLocations = new HashSet<>();
		Boolean isManualFOC = false;
		
		if(focLocationRequestDto.getConfigDetails()!=null && focLocationRequestDto.getConfigDetails().getType().equals("FOC_BLOCKING_FOR_STORE")) {
			isManualFOC = true;
		}
		
		addLocations.add(loc.getLocationCode());

		// Checking for duplicates while updating the date range
		if (focLocationRequestDto.getValidity().getStartDate() != null
				&& focLocationRequestDto.getValidity().getEndDate() != null) {

			Date startDate = CalendarUtils.getStartOfDay(focLocationRequestDto.getValidity().getStartDate());
			Date endDate = CalendarUtils.getStartOfDay(focLocationRequestDto.getValidity().getEndDate());

			// duplicate check w.r.t same scheme
			if (focLocationRequestDto.getConfigDetails()!= null 
					&& focLocationRequestDto.getConfigDetails().getType().equals("FOC_BLOCKING_FOR_CUSTOMER") 
					&& focSchemeLocationMappingRepository.ifCustomerLocationUpdateExist(loc.getId(), loc.getFocSchemeMasterDao().getId(),
							focLocationRequestDto.getMobileNo()) > 0) {
				throw new ServiceException(ConfigConstants.SCHEME_ALREADY_PRESENT, ConfigConstants.ERR_CONFIG_032);
			} else if (focLocationRequestDto.getConfigDetails()!= null && !focLocationRequestDto.getConfigDetails().getType().equals("FOC_BLOCKING_FOR_CUSTOMER")
					&& focSchemeLocationMappingRepository.ifLocationUpdateExist(loc.getId(),
					loc.getFocSchemeMasterDao().getId(), startDate, endDate) > 0) {
				throw new ServiceException(ConfigConstants.SCHEME_ALREADY_PRESENT, ConfigConstants.ERR_CONFIG_032);
			}

			// duplicate across schemes for CFA, Location & offer date combination
			List<FocLocationLiteDto> focSchemeLocList;
			if(focLocationRequestDto.getConfigDetails()!= null && focLocationRequestDto.getConfigDetails().getType().equals("FOC_BLOCKING_FOR_CUSTOMER")) {
				focSchemeLocList = focSchemeLocationMappingRepository.checkMappedSchemeForCustomer(schemeId,
						addLocations,focLocationRequestDto.getMobileNo());
			} else {
				focSchemeLocList = focSchemeLocationMappingRepository.checkMappedScheme(schemeId,
						addLocations, CalendarUtils.getStartOfDay(loc.getStartDate()), CalendarUtils.getStartOfDay(loc.getEndDate()),isManualFOC);
			}
			
			if (!CollectionUtils.isEmpty(focSchemeLocList)) {
				Map<String, String> dynamicErrorValues = new HashMap<>();
				dynamicErrorValues.put("schemeName", focSchemeLocList.get(0).getSchemeName());
				throw new ServiceException(ConfigConstants.INVALID_SCHEME_LOCATION_MAPPING,
						ConfigConstants.ERR_CONFIG_047, dynamicErrorValues);
			}
		}

		// Checking for duplicates while activating the location
		if (focLocationRequestDto.getValidity().getStatus() != null
				&& focLocationRequestDto.getValidity().getStatus() == true && loc.getIsActive() == false) {

			// duplicate check w.r.t same scheme
			if (focLocationRequestDto.getConfigDetails()!= null && focLocationRequestDto.getConfigDetails().getType().equals("FOC_BLOCKING_FOR_CUSTOMER") 
					&& focSchemeLocationMappingRepository.ifCustomerLocationUpdateExist(loc.getId(), loc.getFocSchemeMasterDao().getId(), focLocationRequestDto.getMobileNo()) > 0) {
				throw new ServiceException(ConfigConstants.SCHEME_ALREADY_PRESENT, ConfigConstants.ERR_CONFIG_032);
			} else if (focLocationRequestDto.getConfigDetails()!= null && !focLocationRequestDto.getConfigDetails().getType().equals("FOC_BLOCKING_FOR_CUSTOMER") 
					&& focSchemeLocationMappingRepository.ifLocationUpdateExist(loc.getId(),
					loc.getFocSchemeMasterDao().getId(), CalendarUtils.getStartOfDay(loc.getStartDate()), CalendarUtils.getStartOfDay(loc.getEndDate())) > 0) {
				throw new ServiceException(ConfigConstants.SCHEME_ALREADY_PRESENT, ConfigConstants.ERR_CONFIG_032);
			}

			// duplicate across schemes for CFA, Location & offer date combination
			List<FocLocationLiteDto> focSchemeLocList;
			if(focLocationRequestDto.getConfigDetails()!= null &&focLocationRequestDto.getConfigDetails().getType().equals("FOC_BLOCKING_FOR_CUSTOMER")) {
				focSchemeLocList = focSchemeLocationMappingRepository.checkMappedSchemeForCustomer(schemeId,
						addLocations,focLocationRequestDto.getMobileNo());
			} else {
				focSchemeLocList = focSchemeLocationMappingRepository.checkMappedScheme(schemeId,
						addLocations, CalendarUtils.getStartOfDay(loc.getStartDate()), CalendarUtils.getStartOfDay(loc.getEndDate()),isManualFOC);
			}
			
			if (!CollectionUtils.isEmpty(focSchemeLocList)) {
				Map<String, String> dynamicErrorValues = new HashMap<>();
				dynamicErrorValues.put("schemeName", focSchemeLocList.get(0).getSchemeName());
				throw new ServiceException(ConfigConstants.INVALID_SCHEME_LOCATION_MAPPING,
						ConfigConstants.ERR_CONFIG_047, dynamicErrorValues);
			}

		}
	}

	/**
	 * @param focLocationRequestDto
	 * @param focLocationMappingDao
	 * @return
	 */
	private FocSchemeLocationMappingDaoExt updateLocation(FocLocationRequestDto focLocationRequestDto,
			FocSchemeLocationMappingDaoExt focLocationMappingDao, FocSchemeMasterDaoExt focSchemeMasterDao) {

		if (focLocationRequestDto.getValidity().getStartDate() != null) {
			focLocationMappingDao.setStartDate(focLocationRequestDto.getValidity().getStartDate());
		}

		if (focLocationRequestDto.getValidity().getEndDate() != null) {
			focLocationMappingDao.setEndDate(focLocationRequestDto.getValidity().getEndDate());
		}

		if (focLocationRequestDto.getConfigDetails() != null) {
			focLocationMappingDao.setConfigDetails(MapperUtil.getJsonString(focLocationRequestDto.getConfigDetails()));
		}

		if (focLocationRequestDto.getValidity().getStatus() != null) {
			focLocationMappingDao.setIsActive(focLocationRequestDto.getValidity().getStatus());
		}

		focLocationMappingDao.setFocSchemeMasterDao(focSchemeMasterDao);
		focLocationMappingDao.setMobileNo(focLocationRequestDto.getMobileNo());
		focLocationMappingDao.setSrcSyncId(focLocationMappingDao.getSrcSyncId() + 1);
		return focLocationMappingDao;
	}

	/**
	 * @param focLocationResponseDtos
	 * @return
	 */
	private List<FocLocationResponseDto> focLocationResponse(List<FocLocationResponseDto> focLocationResponseDtos) {

		List<String> responseLocationCodes = new ArrayList<>();

		focLocationResponseDtos.forEach(locationDto -> responseLocationCodes.add(locationDto.getLocationCode()));

		LocationCacheRequestDto locationCacheRequestDto = new LocationCacheRequestDto();
		locationCacheRequestDto.setLocationCodes(responseLocationCodes);

		List<LocationCacheDto> responseList = engineService.getStoreLocationDetails(locationCacheRequestDto)
				.getResults();

		focLocationResponseDtos.forEach(focLocationResponseDto -> responseList.forEach(response -> {
			if (focLocationResponseDto.getLocationCode().equals(response.getLocationCode())) {
				focLocationResponseDto.setDescription(response.getDescription());
				focLocationResponseDto.setSubBrandCode(response.getSubBrandCode());
			}
		}));

		return focLocationResponseDtos;
	}

	@Override
	@Transactional
	public ListResponse<FocItemMappingResponseDto> addFocItem(String id,
			FocItemMappingRequestDto focItemMappingRequestDto) {

		FocSchemeMasterDaoExt focSchemeMasterDao = focSchemeMasterRepository.findById(id).orElseThrow(
				() -> new ServiceException(ConfigConstants.INVALID_SCHEME_ID, ConfigConstants.ERR_CONFIG_030));

		List<FocSchemeItemMappingDaoExt> focItemMappingDaoList = new ArrayList<>();
		List<FocItemMappingResponseDto> focItemMappingDtos = new ArrayList<>();

		if (!focItemMappingRequestDto.getRemoveItems().isEmpty()) {

			List<String> itemRemove = focItemMappingRequestDto.getRemoveItems();
			List<FocSchemeItemMappingDaoExt> itemMappingDao = focSchemeItemMappingRepository.findAllById(itemRemove);
			if (!itemMappingDao.isEmpty()) {
				itemMappingDao.forEach(item -> {
					if (focSchemeMasterDao.getPublishTime() != null
							&& item.getCreatedDate().getTime() < focSchemeMasterDao.getPublishTime().getTime()) {
						throw new ServiceException(ConfigConstants.FOC_ITEMS_CANNOT_BE_REMOVED,
								ConfigConstants.ERR_CONFIG_092, item.getId());
					}
				});
			}
			focSchemeItemMappingRepository.deleteAll(itemMappingDao);
			focSchemeItemMappingRepository.flush();
		}

		if (!CollectionUtils.isEmpty(focItemMappingRequestDto.getAddItems())) {
			focItemMappingRequestDto.getAddItems().forEach(addItem -> {
				FocSchemeItemMappingDaoExt focSchemeItemMappingDao = (FocSchemeItemMappingDaoExt) MapperUtil
						.getObjectMapping(addItem, new FocSchemeItemMappingDaoExt());
				focSchemeItemMappingDao.setFocSchemeMasterDao(focSchemeMasterDao);
				focItemMappingDaoList.add(focSchemeItemMappingDao);
			});

			focSchemeMasterDao.setIsPublishPending(true);
			focSchemeMasterDao.setSrcSyncId(focSchemeMasterDao.getSrcSyncId() + 1);
			focSchemeMasterRepository.save(focSchemeMasterDao);
			focSchemeItemMappingRepository.saveAll(focItemMappingDaoList);
			focItemMappingDaoList.forEach(focItemMappingDao -> {
				FocItemMappingResponseDto focItemMappingDto = (FocItemMappingResponseDto) MapperUtil
						.getDtoMapping(focItemMappingDao, FocItemMappingResponseDto.class);
				focItemMappingDto.setSchemeId(focSchemeMasterDao.getId());
				focItemMappingDtos.add(focItemMappingDto);
			});
		}
		return new ListResponse<>(focItemMappingDtos);
	}

	@Override
	public PagedRestResponse<List<FocItemMappingResponseDto>> getItem(String id, String itemCode, Pageable pageable) {

		FocSchemeMasterDaoExt focSchemeMasterDao = focSchemeMasterRepository.findById(id).orElseThrow(
				() -> new ServiceException(ConfigConstants.INVALID_SCHEME_ID, ConfigConstants.ERR_CONFIG_030));

		FocSchemeItemMappingDaoExt focSchemeItemMappingDao = new FocSchemeItemMappingDaoExt();

		focSchemeItemMappingDao.setFocSchemeMasterDao(focSchemeMasterDao);
		if (itemCode != null)
			focSchemeItemMappingDao.setItemCode(itemCode);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<FocSchemeItemMappingDaoExt> criteria = Example.of(focSchemeItemMappingDao, matcher);

		List<FocItemMappingResponseDto> focItemMappingResponseDtos = new ArrayList<>();
		Page<FocSchemeItemMappingDaoExt> focSchemeItemMappingPageList = focSchemeItemMappingRepository.findAll(criteria,
				pageable);
		focSchemeItemMappingPageList.forEach(itemMappingDao -> {
			FocItemMappingResponseDto focItemMappingResponseDto = (FocItemMappingResponseDto) MapperUtil
					.getDtoMapping(itemMappingDao, FocItemMappingResponseDto.class);
			focItemMappingResponseDto.setSchemeId(itemMappingDao.getFocSchemeMasterDao().getId());
			focItemMappingResponseDtos.add(focItemMappingResponseDto);

		});

		return (new PagedRestResponse<>(focItemMappingResponseDtos, focSchemeItemMappingPageList));
	}

	@Override
	@Transactional
	public ListResponse<FocProductDto> updateProducts(String schemeMasterId, String schemedetailsId,
			FocUpdateProductDto updateProductDto) {

		List<FocSchemeProductMappingDaoExt> focSchemeProductMappingList = new ArrayList<>();
		List<FocProductDto> focProductDtoList = new ArrayList<>();

		FocSchemeMasterDaoExt focSchemeMasterDao = focSchemeMasterRepository.findById(schemeMasterId).orElseThrow(
				() -> new ServiceException(ConfigConstants.INVALID_SCHEME_ID, ConfigConstants.ERR_CONFIG_030));

		if (!CollectionUtils.isEmpty(updateProductDto.getRemoveProducts())) {

			List<FocSchemeProductMappingDaoExt> productList = focProductMappingRepository
					.findAllById(updateProductDto.getRemoveProducts());

			if (!productList.isEmpty()) {
				productList.forEach(prod -> {
					if (focSchemeMasterDao.getPublishTime() != null
							&& prod.getCreatedDate().getTime() < focSchemeMasterDao.getPublishTime().getTime()) {
						throw new ServiceException(ConfigConstants.FOC_PRODUCTS_CANNOT_BE_REMOVED,
								ConfigConstants.ERR_CONFIG_093, prod.getId());
					}
				});
			}

			focProductMappingRepository.deleteAll(productList);
			focProductMappingRepository.flush();
		}

		if (!updateProductDto.getAddProducts().isEmpty()) {

			FocSchemeDetailsDaoExt focSchemeDetailsDao = null;
			if (schemedetailsId != null) {
				focSchemeDetailsDao = focSchemeDetailsRepository.findById(schemedetailsId).orElseThrow(
						() -> new ServiceException(ConfigConstants.INVALID_SCHEME_ID, ConfigConstants.ERR_CONFIG_031));
			}

			List<String> productGroupList = updateProductDto.getAddProducts().stream().collect(Collectors.toList());

			productMappingDuplicateCheck(schemeMasterId, productGroupList);
			for (String productGroupCode : updateProductDto.getAddProducts()) {
				FocSchemeProductMappingDaoExt focSchemeProductMapping = new FocSchemeProductMappingDaoExt();
				focSchemeProductMapping.setProductGroupCode(productGroupCode);

				focSchemeProductMapping.setFocSchemeMasterDao(focSchemeMasterDao);
				focSchemeProductMapping.setCategory(updateProductDto.getCategory());
				focSchemeProductMapping.setItemType(updateProductDto.getItemType());
				if (schemedetailsId != null) {
					focSchemeProductMapping.setFocSchemeDetailsDao(focSchemeDetailsDao);
				}
				focSchemeProductMappingList.add(focSchemeProductMapping);
			}

			focSchemeMasterDao.setIsPublishPending(true);
			try {
				focSchemeMasterRepository.save(focSchemeMasterDao);
				focProductMappingRepository.saveAll(focSchemeProductMappingList);
				focProductMappingRepository.flush();
			} catch (DataIntegrityViolationException e) {
				throw new ServiceException(ConfigConstants.INVALID_PRODUCT_GROUP, ConfigConstants.ERR_CONFIG_120);
			} catch (Exception ex) {
				throw ex;
			}

			focSchemeProductMappingList.forEach(product -> {
				FocProductDto focProductDto = new FocProductDto();
				focProductDto.setProductGroupCode(product.getProductGroupCode());
				focProductDto.setSchemeMasterId(product.getFocSchemeMasterDao().getId());
				if (schemedetailsId != null) {
					focProductDto.setSchemeDetailsId(product.getFocSchemeDetailsDao().getId());
				}
				focProductDto.setId(product.getId());
				focProductDto.setCategory(product.getCategory());
				focProductDto.setItemType(product.getItemType());
				focProductDtoList.add(focProductDto);
			});
		}
		return new ListResponse<>(focProductDtoList);
	}

	/**
	 * @param productGroupList
	 * @param schemeMasterId
	 * 
	 */
	private void productMappingDuplicateCheck(String schemeMasterId, List<String> productGroupList) {

		List<FocSchemeLocationMappingDaoExt> commonLocations = focProductMappingRepository
				.getMappedActiveLocations(schemeMasterId, productGroupList);

		Set<String> locationcodes = new HashSet<>();

		List<FocSchemeLocationMappingDaoExt> invalidMappings = new ArrayList<>();

		if (!commonLocations.isEmpty()) {
			commonLocations.forEach(loc -> locationcodes.add(loc.getLocationCode()));
			List<FocSchemeLocationMappingDaoExt> locations = focSchemeLocationMappingRepository
					.findByFocSchemeMasterDaoIdAndIsActiveAndLocationCodeIn(schemeMasterId, true, locationcodes);
			locations.forEach(loc -> {
				commonLocations.forEach(commonLoc -> {
					if (loc.getLocationCode().equals(commonLoc.getLocationCode())) {
//						if ((loc.getStartDate().before(commonLoc.getStartDate())
//								|| loc.getEndDate().after(commonLoc.getEndDate()))
//								|| (commonLoc.getStartDate().before(loc.getStartDate())
//										|| commonLoc.getEndDate().after(loc.getEndDate()))) {
//							invalidMappings.add(commonLoc);
//						}

						if (((loc.getStartDate().getTime() >= commonLoc.getStartDate().getTime()
								&& loc.getStartDate().getTime() <= commonLoc.getEndDate().getTime())
								|| (loc.getEndDate().getTime() >= commonLoc.getStartDate().getTime()
										&& loc.getEndDate().getTime() <= commonLoc.getEndDate().getTime()))
								|| ((commonLoc.getStartDate().getTime() >= loc.getStartDate().getTime()
										&& commonLoc.getStartDate().getTime() <= loc.getEndDate().getTime())
										|| (commonLoc.getEndDate().getTime() >= loc.getStartDate().getTime()
												&& commonLoc.getEndDate().getTime() <= loc.getEndDate().getTime()))) {
							invalidMappings.add(commonLoc);
						}

					}
				});
			});
		}

		if (!CollectionUtils.isEmpty(invalidMappings)) {
			Map<String, String> dynamicErrorValues = new HashMap<>();
			dynamicErrorValues.put("schemeName", invalidMappings.get(0).getFocSchemeMasterDao().getName());
			throw new ServiceException(ConfigConstants.INVALID_PRODUCT_GROUP_CODE, ConfigConstants.ERR_CONFIG_119,
					dynamicErrorValues);
		}
	}

	@Override
	public PagedRestResponse<List<FocProductDto>> getProducts(String id, String schemedetailsId, String category,
			String itemType, Pageable pageable, Boolean isPageable) {

		if (schemedetailsId == null && category == null) {
			throw new ServiceException(ConfigConstants.INVALID_REQUEST, ConfigConstants.ERR_CONFIG_121);
		}

		if (!isPageable.booleanValue()) {

			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());

		}

		FocSchemeMasterDaoExt focSchemeMasterDao = focSchemeMasterRepository.findById(id).orElseThrow(
				() -> new ServiceException(ConfigConstants.INVALID_SCHEME_ID, ConfigConstants.ERR_CONFIG_030));

		FocSchemeProductMappingDaoExt focSchemeProductMapping = new FocSchemeProductMappingDaoExt();
		focSchemeProductMapping.setFocSchemeMasterDao(focSchemeMasterDao);
		if (schemedetailsId != null) {
			FocSchemeDetailsDaoExt focSchemeDetailsDao = focSchemeDetailsRepository.findById(schemedetailsId)
					.orElseThrow(() -> new ServiceException(ConfigConstants.INVALID_SCHEME_ID,
							ConfigConstants.ERR_CONFIG_031));
			focSchemeProductMapping.setFocSchemeDetailsDao(focSchemeDetailsDao);
		}

		Page<FocSchemeProductMappingDaoExt> focProductMappingPageList = focProductMappingRepository
				.findProductMapping(schemedetailsId, id, category, itemType, pageable);

		List<FocProductDto> focProductDtoList = new ArrayList<>();
		focProductMappingPageList.forEach(productMapping -> {
			FocProductDto focProductDto = new FocProductDto();
			focProductDto.setId(productMapping.getId());
			focProductDto.setProductGroupCode(productMapping.getProductGroupCode());
			focProductDto.setSchemeMasterId(id);
			focProductDto.setCategory(category);
			focProductDto.setItemType(itemType);
			if (productMapping.getFocSchemeDetailsDao() != null) {
				focProductDto.setSchemeDetailsId(productMapping.getFocSchemeDetailsDao().getId());
			}
			focProductDtoList.add(focProductDto);
		});
		return (new PagedRestResponse<>(focProductDtoList, focProductMappingPageList));
	}

	@Override
	public PagedRestResponse<List<FocLocationResponseDto>> getLocationOnScheme(String id, String locationCode,
			Pageable pageable) {

		FocSchemeMasterDaoExt focSchemeMasterDao = focSchemeMasterRepository.findById(id).orElseThrow(
				() -> new ServiceException(ConfigConstants.INVALID_SCHEME_ID, ConfigConstants.ERR_CONFIG_030));

		List<FocLocationResponseDto> locationResponseDtos = new ArrayList<>();

		Page<FocSchemeLocationMappingDaoExt> focSchemeMasterPageList = focSchemeLocationMappingRepository
				.findAllBySchemeId(locationCode, focSchemeMasterDao.getId(), pageable);

		focSchemeMasterPageList.forEach(focLocationMappingDao -> {

			FocLocationResponseDto focLocationResponseDto = (FocLocationResponseDto) MapperUtil
					.getDtoMapping(focLocationMappingDao, FocLocationResponseDto.class);
			if (focLocationMappingDao.getConfigDetails() != null) {
				Object obj = MapperUtil.getJsonFromString(focLocationMappingDao.getConfigDetails());
				JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
				focLocationResponseDto.setConfigDetails(jsonData);
			}

			if (focLocationMappingDao.getMobileNo() != null) {
				focLocationResponseDto.setMobileNo(focLocationMappingDao.getMobileNo());
			}
			focLocationResponseDto.setStatus(focLocationMappingDao.getIsActive());
			locationResponseDtos.add(focLocationResponseDto);
		});

		return (new PagedRestResponse<>(focLocationResponse(locationResponseDtos), focSchemeMasterPageList));
	}

	@Override
	public PagedRestResponse<List<FocLocationResponseDto>> getLocationForManualFoc(String schemeName,
			String locationCode, Pageable pageable) {

		FocSchemeMasterDaoExt focMasterDao = focSchemeMasterRepository.findByName(schemeName);

		if (focMasterDao == null) {

			throw new ServiceException(ConfigConstants.INVALID_SCHEME_ID, ConfigConstants.ERR_CONFIG_031);
		}

		return getLocationOnScheme(focMasterDao.getId(), locationCode, pageable);
	}

	@Override
	public void publishFocScheme(String focSchemeId) {

		FocSchemeMasterDaoExt focSchemeMasterDaoExt = focSchemeMasterRepository.findOneById(focSchemeId);

		if (focSchemeMasterDaoExt == null) {
			throw new ServiceException(ConfigConstants.NO_FOC_SCHEME_FOUND, ConfigConstants.ERR_CONFIG_090);
		}
		if (!focSchemeMasterDaoExt.getIsPublishPending().booleanValue())
			throw new ServiceException(ConfigConstants.DATA_PUBLISHED_ALREADY, ConfigConstants.ERR_CONFIG_080);

		List<SyncData> syncDatas = new ArrayList<>();
		Set<String> locations = new HashSet<>();
		FocSchemeMasterSyncDtoExt syncDtoExt = new FocSchemeMasterSyncDtoExt(focSchemeMasterDaoExt);
		syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt, 0));

		addFocSchmeProductMappingSyncData(syncDatas, focSchemeMasterDaoExt);

		List<FocSchemeLocationMappingDaoExt> focLocation = focSchemeLocationMappingRepository
				.findAllByFocSchemeMasterDao(focSchemeMasterDaoExt);
		List<FocSchemeLocationMappingDaoExt> syncLocationMapping = new ArrayList<>();
		if (focLocation.isEmpty()) {
			throw new ServiceException(ConfigConstants.ADD_AT_LEAST_ONE_LOCATION_MAPPING_TO_PUBLISH,
					ConfigConstants.ERR_CONFIG_082);
		}
		focLocation.forEach(focLoc -> {
			locations.add(focLoc.getLocationCode());
			if (focSchemeMasterDaoExt.getPublishTime() == null || (focSchemeMasterDaoExt.getPublishTime() != null
					&& isPublishable(focSchemeMasterDaoExt.getPublishTime().getTime(),
							focLoc.getLastModifiedDate().getTime()))) {
				syncLocationMapping.add(focLoc);
			}
		});

		List<FocSchemeDetailsDaoExt> focSchemeDetailsDaoExts = focSchemeDetailsRepository
				.findAllByFocSchemeMasterDao(focSchemeMasterDaoExt);
		if (!focSchemeDetailsDaoExts.isEmpty())
			addFocSchemeDetailSyncData(syncDatas, focSchemeMasterDaoExt, focSchemeDetailsDaoExts);

		List<FocSchemeItemMappingDaoExt> focItemMapping = focSchemeItemMappingRepository
				.findAllByFocSchemeMasterDao(focSchemeMasterDaoExt);

		if (!focItemMapping.isEmpty())
			addFocSchemeItemMaappingSyncData(syncDatas, focSchemeMasterDaoExt, focItemMapping);

		publishToLocations(locations, syncLocationMapping, syncDatas, focSchemeMasterDaoExt);
	}

	/**
	 * @param locations
	 * @param focLocation
	 * @param syncDatas
	 * @param focSchemeMasterDaoExt
	 */
	private void publishToLocations(Set<String> locations, List<FocSchemeLocationMappingDaoExt> syncLocationMapping,
			List<SyncData> syncDatas, FocSchemeMasterDaoExt focSchemeMasterDaoExt) {
		locations.forEach(location -> {
			List<String> destinations = new ArrayList<>();
			destinations.add(location);
			int flag = 0;
			for (FocSchemeLocationMappingDaoExt focLoc : syncLocationMapping) {
				if (location.equals(focLoc.getLocationCode())) {
					FocSchemeLocationMappingSyncDtoExt focLocSyncDtoExt = new FocSchemeLocationMappingSyncDtoExt(
							focLoc);
					syncDatas.add(DataSyncUtil.createSyncData(focLocSyncDtoExt, 2));
					flag = 1;
					break;
				}
			}
			SyncStagingDto syncStagingDto = focServiceImp.saveToSyncStaging(syncDatas,
					ConfigServiceOperationCodes.FOC_PUBLISH, destinations, DestinationType.SELECTIVE.name(),
					focSchemeMasterDaoExt);
			syncDataService.publishConfigMessagesToQueue(syncStagingDto);
			if (flag == 1) {
				syncDatas.remove(syncDatas.size() - 1);

			}
		});
	}

	/**
	 * @param syncDatas
	 * @param focPublish
	 * @param destinations
	 * @param name
	 * @param focSchemeMasterDaoExt
	 * @return SyncStagingDto
	 */
	public SyncStagingDto saveToSyncStaging(List<SyncData> syncDatas, String operation, List<String> destinations,
			String destinationType, FocSchemeMasterDaoExt focSchemeMasterDaoExt) {
		SyncStagingDto focSyncStagingDto = new SyncStagingDto();
		MessageRequest focMsgRequest = DataSyncUtil.createMessageRequest(syncDatas, operation, destinations,
				MessageType.GENERAL.toString(), destinationType);
		String focRequestBody = MapperUtil.getJsonString(focMsgRequest);
		SyncStaging focStaggingMsg = new SyncStaging();
		focStaggingMsg.setMessage(focRequestBody);
		focStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		focStaggingMsg = configSyncStagingRepository.save(focStaggingMsg);
		focSyncStagingDto.setMessageRequest(focMsgRequest);
		focSyncStagingDto.setId(focStaggingMsg.getId());
		if (focSchemeMasterDaoExt != null) {
			focSchemeMasterDaoExt.setPublishTime(new Date());
			focSchemeMasterDaoExt.setIsPublishPending(false);
			focSchemeMasterRepository.save(focSchemeMasterDaoExt);
		}
		return focSyncStagingDto;
	}

	/**
	 * @param syncDatas
	 * @param focSchemeMasterDaoExt
	 * @param focItemMapping
	 */
	private void addFocSchemeItemMaappingSyncData(List<SyncData> syncDatas, FocSchemeMasterDaoExt focSchemeMasterDaoExt,
			List<FocSchemeItemMappingDaoExt> focItemMapping) {
		List<FocSchemeItemMappingDaoExt> publishFocSchemeItems = new ArrayList<>();
		focItemMapping.forEach(focItem -> {
			if (focSchemeMasterDaoExt.getPublishTime() == null || (focSchemeMasterDaoExt.getPublishTime() != null
					&& isPublishable(focSchemeMasterDaoExt.getPublishTime().getTime(),
							focItem.getLastModifiedDate().getTime()))) {
				publishFocSchemeItems.add(focItem);
			}

		});
		if (!publishFocSchemeItems.isEmpty()) {
			FocSchemeItemMappingSyncDtoExt itemSyncDtoExt = new FocSchemeItemMappingSyncDtoExt();
			syncDatas.add(DataSyncUtil.createSyncData(itemSyncDtoExt.getItemSyncDtoExts(publishFocSchemeItems), 4));
		}
	}

	/**
	 * @param syncDatas
	 * @param focSchemeMasterDaoExt
	 * @param focSchemeDetailsDaoExts
	 */
	private void addFocSchemeDetailSyncData(List<SyncData> syncDatas, FocSchemeMasterDaoExt focSchemeMasterDaoExt,
			List<FocSchemeDetailsDaoExt> focSchemeDetailsDaoExts) {
		List<FocSchemeDetailsDaoExt> publishFocSchemeDetails = new ArrayList<>();
		focSchemeDetailsDaoExts.forEach(focDetail -> {
			if (focSchemeMasterDaoExt.getPublishTime() == null || (focSchemeMasterDaoExt.getPublishTime() != null
					&& isPublishable(focSchemeMasterDaoExt.getPublishTime().getTime(),
							focDetail.getLastModifiedDate().getTime()))) {
				publishFocSchemeDetails.add(focDetail);
			}

		});
		if (!publishFocSchemeDetails.isEmpty()) {
			FocSchemeDetailsSyncDtoExt detailsSyncDtoExt = new FocSchemeDetailsSyncDtoExt();
			syncDatas.add(
					DataSyncUtil.createSyncData(detailsSyncDtoExt.getDetailsSyncDtoExts(publishFocSchemeDetails), 1));
		}
	}

	/**
	 * @param syncDatas
	 * @param focSchemeMasterDaoExt
	 */
	private void addFocSchmeProductMappingSyncData(List<SyncData> syncDatas,
			FocSchemeMasterDaoExt focSchemeMasterDaoExt) {
		List<FocSchemeProductMappingDaoExt> publishFocSchemeProducts = new ArrayList<>();
		List<FocSchemeProductMappingDaoExt> focSchemeProducts = focProductMappingRepository
				.findAllByFocSchemeMasterDao(focSchemeMasterDaoExt);
		if (focSchemeProducts.isEmpty()) {
			throw new ServiceException(ConfigConstants.ADD_AT_LEAST_ONE_PRODUCT_GROUP_TO_PUBLISH,
					ConfigConstants.ERR_CONFIG_084);
		}
		focSchemeProducts.forEach(focPrdGrp -> {
			if (focSchemeMasterDaoExt.getPublishTime() == null || (focSchemeMasterDaoExt.getPublishTime() != null
					&& isPublishable(focSchemeMasterDaoExt.getPublishTime().getTime(),
							focPrdGrp.getLastModifiedDate().getTime()))) {
				publishFocSchemeProducts.add(focPrdGrp);
			}

		});
		if (!publishFocSchemeProducts.isEmpty()) {
			FocSchemeProductMappingSyncDtoExt focPrdSyncDtoExt = new FocSchemeProductMappingSyncDtoExt();
			syncDatas.add(
					DataSyncUtil.createSyncData(focPrdSyncDtoExt.getProductSyncDtoExts(publishFocSchemeProducts), 3));
		}
	}

	/**
	 * @param publishTime
	 * @param modifiedTime
	 * @return boolean
	 */
	private boolean isPublishable(long focPublishTime, long modifiedTime) {
		boolean isPublishable = false;
		if (modifiedTime > focPublishTime)
			isPublishable = true;
		return isPublishable;
	}

}