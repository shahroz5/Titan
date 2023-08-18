/*
*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.payment.service.impl;

import static com.titan.poss.payment.constants.PaymentConstants.PAYMENT_CONFIG_SERVICE_IMPL;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MappedConfigResponseDto;
import com.titan.poss.core.dto.MappedLocationDto;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.PaymentOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.payment.constants.PaymentConstants;
import com.titan.poss.payment.constants.TransactionSearchTypeEnum;
import com.titan.poss.payment.dao.ConfigDaoExt;
import com.titan.poss.payment.dao.ConfigDetailsDaoExt;
import com.titan.poss.payment.dao.ConfigLocationMappingDaoExt;
import com.titan.poss.payment.dao.PaymentCustomerMappingDaoExt;
import com.titan.poss.payment.dao.SyncStaging;
import com.titan.poss.payment.dto.ConfigDetailDto;
import com.titan.poss.payment.dto.ConfigDetailsSyncDtoExt;
import com.titan.poss.payment.dto.ConfigLocationMappingSyncDtoExt;
import com.titan.poss.payment.dto.ConfigSyncDtoExt;
import com.titan.poss.payment.dto.PaymentCustomerMappingSyncDtoExt;
import com.titan.poss.payment.dto.TransactionTypeCountDto;
import com.titan.poss.payment.dto.request.ConfigDetailsUpdate;
import com.titan.poss.payment.dto.request.ConfigRequestDto;
import com.titan.poss.payment.dto.request.CustomerConfigRequestDto;
import com.titan.poss.payment.dto.response.ConfigDetailsDto;
import com.titan.poss.payment.dto.response.ConfigLocationResponseDto;
import com.titan.poss.payment.dto.response.ConfigMasterDto;
import com.titan.poss.payment.dto.response.CustomerConfigDetailsDto;
import com.titan.poss.payment.dto.response.CustomerConfigDto;
import com.titan.poss.payment.repository.ConfigDetailsRepositoryExt;
import com.titan.poss.payment.repository.ConfigLocationMappingRepositoryExt;
import com.titan.poss.payment.repository.ConfigRepositoryExt;
import com.titan.poss.payment.repository.PaymentCustomerMappingRepositoryExt;
import com.titan.poss.payment.repository.PaymentSyncStagingRepository;
import com.titan.poss.payment.service.ConfigService;
import com.titan.poss.payment.service.PaymentCommonService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service(PAYMENT_CONFIG_SERVICE_IMPL)
public class ConfigServiceImpl implements ConfigService {

	@Autowired
	PaymentCommonService paymentUtilService;

	@Autowired
	ConfigRepositoryExt configRepository;

	@Autowired
	ConfigDetailsRepositoryExt configDetailsRepository;

	@Autowired
	PaymentCustomerMappingRepositoryExt paymentCustomerMappingRepo;

	@Autowired
	ConfigLocationMappingRepositoryExt configLocationMappingRepository;

	@Autowired
	private PaymentSyncStagingRepository paymentSyncStagingRepository;

	@Autowired
	private PaymentSyncDataServiceImpl syncDataService;

	@Autowired
	ConfigServiceImpl configServiceImplementation;

	/**
	 * This method will return the list of Payment Configuration Details based on
	 * the configId, isActive.
	 * 
	 * @param isActive
	 * @return ListResponse<ConfigDetailsDto>
	 */
	@Override
	public PagedRestResponse<List<ConfigMasterDto>> listConfig(Boolean isActive, Pageable pageable, String description,
			String configId, String configType) {

		/*
		 * ConfigDaoExt configCriteria = new ConfigDaoExt();
		 * configCriteria.setIsActive(isActive);
		 * configCriteria.setDescription(description);
		 * configCriteria.setConfigId(configId);
		 * configCriteria.setConfigType(configType);
		 * 
		 * ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		 * Example<ConfigDaoExt> criteria = Example.of(configCriteria, matcher);
		 */

		Page<ConfigDaoExt> configList = configRepository.findAllConfigNames(description, isActive, pageable);

		List<ConfigMasterDto> configDtoList = new ArrayList<>();

		configList.forEach(config -> {
			ConfigMasterDto configDto = (ConfigMasterDto) MapperUtil.getObjectMapping(config, new ConfigMasterDto());
			configDtoList.add(configDto);
		});

		return (new PagedRestResponse<>(configDtoList, configList));
	}

	/**
	 * This method will return the Payment Configuration details based on the
	 * configId.
	 * 
	 * @param configId
	 * @return ConfigDto
	 */
	@Override
	public ConfigMasterDto getConfig(String configId) {
		ConfigDaoExt configDao = configRepository.findOneByConfigId(configId);

		if (configDao == null)
			throw new ServiceException(PaymentConstants.NO_PAYMENT_CONFIGURATION_FOUND_FOR_THE_REQUESTED_PAYMENT,
					PaymentConstants.ERR_PAY_003);

		return (ConfigMasterDto) MapperUtil.getObjectMapping(configDao, new ConfigMasterDto());
	}

	/**
	 * This method will save the Configuration details.
	 * 
	 * @param configRequestDto
	 * @return ConfigDto
	 */
	@Override
	public ConfigMasterDto addConfig(ConfigRequestDto configRequestDto) {
		ConfigDaoExt configDao = (ConfigDaoExt) MapperUtil.getObjectMapping(configRequestDto, new ConfigDaoExt());
		configDao.setSrcSyncId(0);
		configDao.setDestSyncId(0);
		Map<String, SyncStagingDto> syncStagingDto = configServiceImplementation.saveConfig(configDao,
				PaymentOperationCodes.PAYMENT_CONFIG_ADD, true);
		syncDataService.publishPaymentMessages(syncStagingDto);
		return (ConfigMasterDto) MapperUtil.getObjectMapping(configDao, new ConfigMasterDto());
	}

	@Transactional
	public Map<String, SyncStagingDto> saveConfig(ConfigDaoExt configDao, String operation, boolean isPublishToEGHS) {
		configDao = configRepository.save(configDao);
		ConfigSyncDtoExt configSyncDtoExt = new ConfigSyncDtoExt(configDao);
		List<SyncData> syncDataList = new ArrayList<>();
		syncDataList.add(DataSyncUtil.createSyncData(configSyncDtoExt, 0));
		List<String> destinations = new ArrayList<>();
		return syncDataService.getPaymentSyncStagingMap(syncDataList, operation, destinations, isPublishToEGHS,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}

	/**
	 * This method will update the Payment Configuration details.
	 * 
	 * @param configId
	 * @param isActive
	 * @return ConfigDto
	 */
	@Override
	public ConfigMasterDto updateConfig(String configId, Boolean isActive) {
		ConfigDaoExt configDao = configRepository.findOneByConfigId(configId);

		if (configDao == null)
			throw new ServiceException(PaymentConstants.NO_PAYMENT_CONFIGURATION_FOUND_FOR_THE_REQUESTED_PAYMENT,
					PaymentConstants.ERR_PAY_003);

		configDao.setIsActive(isActive);
		configDao.setSrcSyncId(configDao.getSrcSyncId() + 1);
		Map<String, SyncStagingDto> syncStagingDto = configServiceImplementation.saveConfig(configDao,
				PaymentOperationCodes.PAYMENT_CONFIG_UPDATE, true);
		syncDataService.publishPaymentMessages(syncStagingDto);
		return (ConfigMasterDto) MapperUtil.getObjectMapping(configDao, new ConfigMasterDto());
	}

	/**
	 * This method will return the list of Payment Configuration details based on
	 * the paymentConfig, isActive.
	 * 
	 * @param configId
	 * @param transactionTypes
	 * @param paymentCodes
	 * @return ConfigDetailsDto
	 */
	@Override
	public ConfigDetailsDto listConfigDetails(String configId, List<String> transactionTypes,
			List<String> paymentCodes) {

		List<ConfigDetailsDaoExt> configDetailsDao;

		ConfigDaoExt configDao = new ConfigDaoExt();
		configDao.setConfigId(configId);

		configDetailsDao = configDetailsRepository.findAllByConfigDao(configDao, paymentCodes, transactionTypes);

		return paymentUtilService.getConfigDetailResponse(configDetailsDao, configId);
	}

	/**
	 * This method will update the Payment Configuration Details.
	 * 
	 * @param configId
	 * @param configDetailsUpdate
	 * @return ConfigDetailsDto
	 */
	@Override
	@Transactional
	public ConfigDetailsDto updateConfigDetails(String configId, ConfigDetailsUpdate configDetailsUpdate) {
		ConfigDaoExt configDaoExt = new ConfigDaoExt();
		configDaoExt.setConfigId(configId);
		Map<String, SyncStagingDto> configStagingDto = configServiceImplementation.staggingConfigDetails(configId,
				configDetailsUpdate, true);
		syncDataService.publishPaymentMessages(configStagingDto);
		return paymentUtilService.getConfigDetailResponse(configDetailsRepository.findAllByConfigId(configDaoExt),
				configId);
	}

	public Map<String, SyncStagingDto> staggingConfigDetails(String configId, ConfigDetailsUpdate configDetailsUpdate,
			boolean isPublishToEGHS) {
		ConfigDaoExt configDao = configRepository.findOneByConfigId(configId);

		if (configDao == null)
			throw new ServiceException(PaymentConstants.NO_PAYMENT_CONFIGURATION_FOUND_FOR_THE_REQUESTED_PAYMENT,
					PaymentConstants.ERR_PAY_003);

		Set<String> txnTypes = new HashSet<>();
		// validate if txnType is valid for payment mapping
		if (!CollectionUtil.isEmpty(configDetailsUpdate.getAddConfigs())) {
			configDetailsUpdate.getAddConfigs().forEach(configDto -> txnTypes.add(configDto.getTransactionType()));
		}

		// validate if txnType is valid for payment mapping
		if (!CollectionUtil.isEmpty(configDetailsUpdate.getUpdateConfigs())) {
			configDetailsUpdate.getUpdateConfigs()
					.forEach(configDto -> txnTypes.add(configDto.getConfigsDto().getTransactionType()));

		}
		paymentUtilService.validTxnTypeForConfig(txnTypes, TransactionSearchTypeEnum.PAYMENT_MAPPING.name(), true);

		List<SyncData> syncDataList = new ArrayList<>();
		List<ConfigDetailsSyncDtoExt> configDetailsDeleteSyncDto = null;
		if (configDetailsUpdate.getRemoveConfigs() != null && !configDetailsUpdate.getRemoveConfigs().isEmpty()) {
			configDetailsDeleteSyncDto = configServiceImplementation
					.removeConfigDetails(configDetailsUpdate.getRemoveConfigs());
			syncDataList.add(DataSyncUtil.createSyncData(configDetailsDeleteSyncDto, 0));
		}

		List<ConfigDetailsDaoExt> configDetailDao = null;
		if ((configDetailsUpdate.getUpdateConfigs() != null && !configDetailsUpdate.getUpdateConfigs().isEmpty())
				|| (configDetailsUpdate.getAddConfigs() != null && !configDetailsUpdate.getAddConfigs().isEmpty())) {
			configDetailDao = saveUpdateConfigDetails(configId, configDetailsUpdate);
			List<ConfigDetailsSyncDtoExt> configDetailsUpdateSyncDto = new ArrayList<>();
			configDetailDao.forEach(
					configDetailsDao -> configDetailsUpdateSyncDto.add(new ConfigDetailsSyncDtoExt(configDetailsDao)));
			syncDataList.add(DataSyncUtil.createSyncData(configDetailsUpdateSyncDto, 1));
		}
		List<String> destinations = new ArrayList<>();
		return syncDataService.getPaymentSyncStagingMap(syncDataList,
				PaymentOperationCodes.PAYMENT_CONFIG_DETAILS_UPDATE, destinations, isPublishToEGHS,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}

	public List<ConfigDetailsDaoExt> saveUpdateConfigDetails(String configId, ConfigDetailsUpdate configDetailsUpdate) {
		List<ConfigDetailsDaoExt> configDetailDao = new ArrayList<>();
		if (configDetailsUpdate.getUpdateConfigs() != null && !configDetailsUpdate.getUpdateConfigs().isEmpty()) {

			Map<String, ConfigDetailDto> configDetailUpdateMap = new HashMap<>();
			List<String> configUpdateId = new ArrayList<>();

			configDetailsUpdate.getUpdateConfigs().forEach(configDetail -> {
				configUpdateId.add(configDetail.getConfigDetailId());
				configDetailUpdateMap.put(configDetail.getConfigDetailId(), configDetail.getConfigsDto());
			});

			List<ConfigDetailsDaoExt> configDetailUpdateDao = configDetailsRepository
					.findAllByConfigDetailId(configUpdateId);
			configDetailUpdateDao.forEach(configDetail -> {
				ConfigDetailsDaoExt configDetailsDaoExt = paymentUtilService.getConfigDetailDao(configDetail,
						configDetailUpdateMap.get(configDetail.getId()), configId);
				configDetailsDaoExt.setSyncTime(new Date().getTime());
				configDetailDao.add(configDetailsDaoExt);
			});
		}

		if (configDetailsUpdate.getAddConfigs() != null && !configDetailsUpdate.getAddConfigs().isEmpty()) {
			configDetailsUpdate.getAddConfigs().forEach(addConfig -> {
				ConfigDetailsDaoExt configDetailsDaoExt = paymentUtilService
						.getConfigDetailDao(new ConfigDetailsDaoExt(), addConfig, configId);
				configDetailsDaoExt.setSyncTime(new Date().getTime());
				configDetailDao.add(configDetailsDaoExt);
			});
		}

		return configDetailsRepository.saveAll(configDetailDao);
	}

	public List<ConfigDetailsSyncDtoExt> removeConfigDetails(Set<String> removeConfigDetailsId) {
		List<String> configDetailIdRemove = removeConfigDetailsId.stream().collect(Collectors.toList());
		List<ConfigDetailsDaoExt> configDetailsDaoDelete = configDetailsRepository
				.findAllByConfigDetailId(configDetailIdRemove);
		configDetailsDaoDelete.forEach(configDetailsDaoExt -> configDetailsDaoExt.setSyncTime(new Date().getTime()));
		configDetailsRepository.deleteAll(configDetailsDaoDelete);
		List<ConfigDetailsSyncDtoExt> syncData = new ArrayList<>();
		configDetailsDaoDelete.forEach(configDetailsDao -> syncData.add(new ConfigDetailsSyncDtoExt(configDetailsDao)));
		return syncData;
	}

	/**
	 * This method will return the list of location codes based on configId,.
	 * 
	 * @param configId
	 * @return List<LocationCodeDto>
	 */
	@Override
	public ListResponse<MappedConfigResponseDto> getLocationCodes(String configId, String configType) {

		List<MappedConfigResponseDto> locationCodeDto = new ArrayList<>();

		ConfigDaoExt configDao = configRepository.findOneByConfigId(configId);

		if (configDao == null) {
			throw new ServiceException(PaymentConstants.NO_PAYMENT_CONFIGURATION_FOUND_FOR_THE_REQUESTED_PAYMENT,
					PaymentConstants.ERR_PAY_003);
		}

		List<ConfigLocationMappingDaoExt> locationCodeDao = configLocationMappingRepository
				.findByConfigIdAndConfigType(configDao, configType);

		locationCodeDao.forEach(locationDao -> {
			MappedConfigResponseDto locationCode = new MappedConfigResponseDto();
			locationCode.setConfigId(configId);
			locationCode.setLocationCode(locationDao.getLocationCode());
			locationCode.setConfigName(configDao.getDescription());
			locationCode.setConfigType(configDao.getConfigType());
			locationCodeDto.add(locationCode);
		});

		return new ListResponse<>(locationCodeDto);
	}

	/**
	 * This API will return the count of transaction type according to payment mode.
	 *
	 * @param configId
	 * @return TransactionTypeCountDto
	 */
	@Override
	public ListResponse<TransactionTypeCountDto> getTransactionTypeCount(String configId) {

		return new ListResponse<>(configDetailsRepository.findByConfigId(configId));
	}

	@Override
	public CustomerConfigDetailsDto createCustomerConfigDetails(String configId,
			CustomerConfigRequestDto configDetailsDto) {

		ConfigDaoExt configDao = configRepository.findOneByConfigId(configId);

		if (configDao == null)
			throw new ServiceException(PaymentConstants.NO_PAYMENT_CONFIGURATION_FOUND_FOR_THE_REQUESTED_PAYMENT,
					PaymentConstants.ERR_PAY_003);

		Set<String> txnTypes = new HashSet<>();
		// validate if txnType is valid for customer mapping
		if (!CollectionUtil.isEmpty(configDetailsDto.getAddConfigs())) {
			configDetailsDto.getAddConfigs().forEach(configDto -> txnTypes.add(configDto.getTransactionType()));
			paymentUtilService.validTxnTypeForConfig(txnTypes, TransactionSearchTypeEnum.CUSTOMER_MAPPING.name(), true);
		}

		List<PaymentCustomerMappingDaoExt> responseList = new ArrayList<>();
		Map<String, SyncStagingDto> customerStagingDto = configServiceImplementation
				.stagingCustomerTransaction(configDetailsDto, responseList, configId, false);
		syncDataService.publishPaymentMessages(customerStagingDto);

		return paymentUtilService.getCustomerConfigResponse(responseList, configId);
	}

	/**
	 * @param configDetailsDto
	 * @param responseList
	 * @param configId
	 * @param isPublishToEGHS
	 * @return SyncStagingDto
	 */
	@Transactional
	public Map<String, SyncStagingDto> stagingCustomerTransaction(CustomerConfigRequestDto configDetailsDto,
			List<PaymentCustomerMappingDaoExt> responseList, String configId, boolean isPublishToEGHS) {
		List<SyncData> syncDatas = new ArrayList<>();
		PaymentCustomerMappingSyncDtoExt syncDtoExt = new PaymentCustomerMappingSyncDtoExt();
		if (configDetailsDto.getRemoveConfigs() != null && !configDetailsDto.getRemoveConfigs().isEmpty()) {
			List<String> configDetailIdList = configDetailsDto.getRemoveConfigs().stream().collect(Collectors.toList());
			List<PaymentCustomerMappingDaoExt> configDetailsDaoList = paymentCustomerMappingRepo
					.findByIdIn(configDetailIdList);
			paymentCustomerMappingRepo.deleteAll(configDetailsDaoList);
			paymentCustomerMappingRepo.flush();
			configDetailsDaoList.forEach(configDetails -> configDetails.setSyncTime(new Date().getTime()));
			syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoList(configDetailsDaoList), 0));
		}

		List<PaymentCustomerMappingDaoExt> customerTrancList = new ArrayList<>();

		if (configDetailsDto.getAddConfigs() != null && !configDetailsDto.getAddConfigs().isEmpty()) {
			configDetailsDto.getAddConfigs().forEach(customerConfig -> customerTrancList.add(paymentUtilService
					.getPaymentCustomerDao(new PaymentCustomerMappingDaoExt(), customerConfig, configId)));
			List<PaymentCustomerMappingDaoExt> savedCustomerTrancList = paymentCustomerMappingRepo
					.saveAll(customerTrancList);
			paymentCustomerMappingRepo.flush();
			savedCustomerTrancList.forEach(configDetails -> {
				configDetails.setSyncTime(new Date().getTime());
				responseList.add(configDetails);
			});
			syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt.getSyncDtoList(responseList), 1));
		}
		List<String> destinations = new ArrayList<>();
		return syncDataService.getPaymentSyncStagingMap(syncDatas, PaymentOperationCodes.PAYMENT_CUSTOMER_MAPPING,
				destinations, isPublishToEGHS, MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}

	@Override
	public CustomerConfigDetailsDto listCustomerConfigDetails(String configId) {

		List<CustomerConfigDto> custConfigList = new ArrayList<>();
		CustomerConfigDetailsDto configDto = new CustomerConfigDetailsDto();
		configDto.setConfigId(configId);
		List<PaymentCustomerMappingDaoExt> configDetailsDao = paymentCustomerMappingRepo.findByConfigDetailId(configId);
		configDetailsDao.forEach(config -> {
			CustomerConfigDto custConfigDto = (CustomerConfigDto) MapperUtil.getObjectMapping(config,
					new CustomerConfigDto());
			custConfigDto.setTransactionType(config.getTransactionDao().getTransactionType());
			custConfigList.add(custConfigDto);
		});
		configDto.setConfigs(custConfigList);
		return configDto;
	}

	/**
	 * 
	 * @param mappedLocationDto
	 * @return ListResponse<MappedConfigResponseDto>
	 */
	@Override
	public ListResponse<MappedConfigResponseDto> getMappedLocationCodes(String configType,
			MappedLocationDto mappedLocationDto) {
		List<MappedConfigResponseDto> mappedLocationList = new ArrayList<>();

		Set<String> includeLocations = CollectionUtil.setNullIfEmpty(mappedLocationDto.getIncludeLocations());

		List<ConfigLocationMappingDaoExt> locationCodeDao = configLocationMappingRepository
				.findOtherConfigMappedLocationCode(configType, mappedLocationDto.getExcludeConfigId(),
						includeLocations);

		if (locationCodeDao == null) {
			throw new ServiceException(PaymentConstants.NO_PAYMENT_CONFIGURATION_FOUND_FOR_THE_REQUESTED_PAYMENT,
					PaymentConstants.ERR_PAY_003);
		}

		if (!CollectionUtils.isEmpty(locationCodeDao)) {
			locationCodeDao.forEach(configDao -> {
				MappedConfigResponseDto responseDto = new MappedConfigResponseDto();
				responseDto.setConfigName(configDao.getConfigId().getDescription());
				responseDto.setConfigId(configDao.getConfigId().getConfigId());
				responseDto.setConfigType(configDao.getConfigType());
				responseDto.setLocationCode(configDao.getLocationCode());
				mappedLocationList.add(responseDto);
			});
		}

		return new ListResponse<>(mappedLocationList);
	}

	@Override
	public ConfigLocationResponseDto locationsMappings(String configId, String configType,
			ConfigLocationResponseDto configLocationDto) {
		Set<String> addLocations = configLocationDto.getAddLocations();
		Set<String> removeLocations = configLocationDto.getRemoveLocations();
		Set<String> overwriteLocations = configLocationDto.getOverwriteLocations();
		ConfigDaoExt configDao = new ConfigDaoExt();
		configDao.setConfigId(configId);
		List<ConfigLocationMappingDaoExt> removeConfigLocationMappingDao = new ArrayList<>();
		List<ConfigLocationMappingDaoExt> addconfigLocationList = new ArrayList<>();
		if (!CollectionUtils.isEmpty(removeLocations)) {
			removeConfigLocationMappingDao = configLocationMappingRepository
					.findByConfigTypeAndLocationCodeIn(configType, removeLocations);
			removeConfigLocationMappingDao.forEach(mappingDao -> mappingDao.setSyncTime(new Date().getTime()));
		}
		if (!CollectionUtils.isEmpty(addLocations)) {
			saveLocationsToDb(addLocations, addconfigLocationList, configDao, configType);
		}
		List<SyncStagingDto> syncDtoList = configServiceImplementation.configLocationDbOperation(addconfigLocationList,
				removeConfigLocationMappingDao, overwriteLocations, configDao, configType);
		syncDtoList.forEach(sync -> syncDataService.publishPaymentMessagesToQueue(sync));
		return configLocationDto;
	}

	@Transactional
	public List<SyncStagingDto> configLocationDbOperation(List<ConfigLocationMappingDaoExt> addconfigLocationList,
			List<ConfigLocationMappingDaoExt> removeConfigLocationMappingDao, Set<String> overwriteLocations,
			ConfigDaoExt configDao, String configType) {
		List<SyncStagingDto> syncDtoList = new ArrayList<>();
		if (!removeConfigLocationMappingDao.isEmpty()) {
			configLocationMappingRepository.deleteAll(removeConfigLocationMappingDao);
			configLocationMappingRepository.flush();
			removeConfigLocationMappingDao.forEach(configDo -> {
				SyncStagingDto syncStagingDto = configServiceImplementation.getSyncDto(configDo, 0, syncDtoList, true);
				String configMsgRqst = MapperUtil.getJsonString(syncStagingDto.getMessageRequest());
				SyncStaging configSyncStaging = new SyncStaging();
				configSyncStaging.setMessage(configMsgRqst);
				configSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
				configSyncStaging = paymentSyncStagingRepository.save(configSyncStaging);
				syncStagingDto.setId(configSyncStaging.getId());
				syncDtoList.add(syncStagingDto);
			});
		}
		if (!CollectionUtils.isEmpty(overwriteLocations)) {
			List<ConfigLocationMappingDaoExt> overwriteConfigLocationMappingDao = configLocationMappingRepository
					.findByConfigTypeAndLocationCodeIn(configType, overwriteLocations);
			configLocationMappingRepository.deleteAll(overwriteConfigLocationMappingDao);
			configLocationMappingRepository.flush();
			overwriteConfigLocationMappingDao.forEach(mappingDao -> {
				mappingDao.setSyncTime(new Date().getTime());
				ConfigLocationMappingDaoExt updatedMappingDao = new ConfigLocationMappingDaoExt();
				updatedMappingDao.setSyncTime(new Date().getTime());
				updatedMappingDao.setConfigId(configDao);
				updatedMappingDao.setConfigType(configType);
				updatedMappingDao.setLocationCode(mappingDao.getLocationCode());
				configLocationMappingRepository.save(updatedMappingDao);
				SyncStagingDto syncStagingDto = configServiceImplementation.getOverWriteSyncDto(mappingDao,
						updatedMappingDao);
				String configMsgRqst = MapperUtil.getJsonString(syncStagingDto.getMessageRequest());
				SyncStaging configSyncStaging = new SyncStaging();
				configSyncStaging.setMessage(configMsgRqst);
				configSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
				configSyncStaging = paymentSyncStagingRepository.save(configSyncStaging);
				syncStagingDto.setId(configSyncStaging.getId());
				syncDtoList.add(syncStagingDto);
			});
		}
		if (!addconfigLocationList.isEmpty()) {
			addconfigLocationList = configLocationMappingRepository.saveAll(addconfigLocationList);
			addconfigLocationList.forEach(configDo -> {
				SyncStagingDto syncStagingDto = configServiceImplementation.getSyncDto(configDo, 1, syncDtoList, true);
				String configMsgRqst = MapperUtil.getJsonString(syncStagingDto.getMessageRequest());
				SyncStaging configSyncStaging = new SyncStaging();
				configSyncStaging.setMessage(configMsgRqst);
				configSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
				configSyncStaging = paymentSyncStagingRepository.save(configSyncStaging);
				syncStagingDto.setId(configSyncStaging.getId());
				syncDtoList.add(syncStagingDto);
			});
		}
		return syncDtoList;
	}

	private SyncStagingDto getOverWriteSyncDto(ConfigLocationMappingDaoExt mappingDao,
			ConfigLocationMappingDaoExt updatedMappingDao) {
		List<SyncData> syncDataList = new ArrayList<>();
		ConfigLocationMappingSyncDtoExt syncDto = new ConfigLocationMappingSyncDtoExt();
		syncDataList.add(DataSyncUtil.createSyncData(syncDto.getConfigLocMappingSyncDto(mappingDao), 0));
		syncDataList.add(DataSyncUtil.createSyncData(syncDto.getConfigLocMappingSyncDto(updatedMappingDao), 1));
		List<String> destinations = new ArrayList<>();
		destinations.add(updatedMappingDao.getLocationCode());
		MessageRequest configMsgRequest = DataSyncUtil.createMessageRequest(syncDataList,
				PaymentOperationCodes.PAYMENT_CONFIG_LOCATION, destinations, MessageType.GENERAL.toString(),
				DestinationType.SELECTIVE.toString());
		SyncStagingDto configStagingDto = new SyncStagingDto();
		configStagingDto.setMessageRequest(configMsgRequest);
		return configStagingDto;
	}

	public SyncStagingDto getSyncDto(ConfigLocationMappingDaoExt configDo, int i, List<SyncStagingDto> syncDtoList,
			boolean isPublishToEGHS) {
		List<SyncData> syncDataList = new ArrayList<>();
		ConfigLocationMappingSyncDtoExt syncDto = new ConfigLocationMappingSyncDtoExt();
		if (i == 0) {
			syncDataList.add(DataSyncUtil.createSyncData(syncDto.getConfigLocMappingSyncDto(configDo), i));
		}
		if (i == 1) {
			syncDataList.add(DataSyncUtil.createSyncData(syncDto.getConfigLocMappingSyncDto(configDo), i));
		}
		List<String> destinations = new ArrayList<>();
		destinations.add(configDo.getLocationCode());
		MessageRequest configMsgRequest = DataSyncUtil.createMessageRequest(syncDataList,
				PaymentOperationCodes.PAYMENT_CONFIG_LOCATION, destinations, MessageType.GENERAL.toString(),
				DestinationType.SELECTIVE.toString());
		SyncStagingDto configStagingDto = new SyncStagingDto();
		configStagingDto.setMessageRequest(configMsgRequest);
		if (isPublishToEGHS) {
			SyncStagingDto eghsStaging = syncDataService.getEGHSSyncStagingDto(syncDataList,
					PaymentOperationCodes.PAYMENT_CONFIG_LOCATION, MessageType.GENERAL.toString());
			syncDtoList.add(eghsStaging);
		}
		return configStagingDto;
	}

	private void saveLocationsToDb(Set<String> locationList, List<ConfigLocationMappingDaoExt> configLocationList,
			ConfigDaoExt configDao, String configType) {
		locationList.forEach(location -> {
			ConfigLocationMappingDaoExt configLocationMapping = new ConfigLocationMappingDaoExt();
			configLocationMapping.setConfigId(configDao);
			configLocationMapping.setLocationCode(location);
			configLocationMapping.setConfigType(configType);
			configLocationMapping.setSyncTime(new Date().getTime());
			configLocationList.add(configLocationMapping);
		});
	}

}