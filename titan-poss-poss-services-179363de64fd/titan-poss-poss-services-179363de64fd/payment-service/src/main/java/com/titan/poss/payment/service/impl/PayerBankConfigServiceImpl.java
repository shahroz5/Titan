/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service.impl;

import static com.titan.poss.payment.constants.PaymentConstants.PAYER_BANK_CONFIG_SERVICE_IMPL;

import java.util.ArrayList;
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
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;

import com.titan.poss.core.dto.DestinationType;
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
import com.titan.poss.payment.dao.PayerBankDao;
import com.titan.poss.payment.dao.PayerConfigDaoExt;
import com.titan.poss.payment.dao.PayerDetailsDaoExt;
import com.titan.poss.payment.dao.PayerLocationMappingDaoExt;
import com.titan.poss.payment.dao.PaymentDao;
import com.titan.poss.payment.dao.SyncStaging;
import com.titan.poss.payment.dto.PayerBankConfigDto;
import com.titan.poss.payment.dto.PayerBankConfigLocationRespondDto;
import com.titan.poss.payment.dto.PayerConfigSyncDtoExt;
import com.titan.poss.payment.dto.PayerDetailsSyncDtoExt;
import com.titan.poss.payment.dto.PayerLocationMappingSyncDtoExt;
import com.titan.poss.payment.dto.PayerStaggingDto;
import com.titan.poss.payment.dto.request.PayerBankDetails;
import com.titan.poss.payment.dto.request.PayerBankLocationMapping;
import com.titan.poss.payment.dto.response.MappedConfigResponse;
import com.titan.poss.payment.dto.response.PayerBankConfigDetails;
import com.titan.poss.payment.dto.response.PayerBankConfigResponseDto;
import com.titan.poss.payment.dto.response.PayerLocationMappingResponse;
import com.titan.poss.payment.repository.PayerBankConfigRepositoryExt;
import com.titan.poss.payment.repository.PayerDetailsRepositoryExt;
import com.titan.poss.payment.repository.PayerLocationMappingRepositoryExt;
import com.titan.poss.payment.repository.PaymentSyncStagingRepository;
import com.titan.poss.payment.service.PayerBankConfigService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service(PAYER_BANK_CONFIG_SERVICE_IMPL)
public class PayerBankConfigServiceImpl implements PayerBankConfigService {

	@Autowired
	PayerBankConfigRepositoryExt payerConfigRepository;

	@Autowired
	PayerDetailsRepositoryExt payerDetailsRepository;

	@Autowired
	PayerLocationMappingRepositoryExt payerLocationMappingRepository;

	@Autowired
	private PaymentSyncDataServiceImpl syncDataService;

	@Autowired
	private PaymentSyncStagingRepository paymentSyncStagingRepository;

	@Autowired
	private PayerBankConfigServiceImpl payerBankConfigService;

	@Override
	public PagedRestResponse<List<PayerBankConfigResponseDto>> listPayerBankConfig(Boolean isActive, Pageable pageable,
			String description) {

		PayerConfigDaoExt payerConfigCriteria = new PayerConfigDaoExt();
		payerConfigCriteria.setIsActive(isActive);
		payerConfigCriteria.setDescription(description);

		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<PayerConfigDaoExt> criteria = Example.of(payerConfigCriteria, matcher);

		Page<PayerConfigDaoExt> payerConfigDaoList = payerConfigRepository.findAllByBankName(description, isActive, pageable);

		List<PayerBankConfigResponseDto> payerBankConfigResponseDtoList = new ArrayList<>();

		payerConfigDaoList.forEach(payerConfig -> {
			PayerBankConfigResponseDto payerBankConfigResponseDto = (PayerBankConfigResponseDto) MapperUtil
					.getObjectMapping(payerConfig, new PayerBankConfigResponseDto());
			payerBankConfigResponseDto.setPaymentCode(payerConfig.getPayment().getPaymentCode());
			payerBankConfigResponseDto.setPaymentDetails(MapperUtil.getJsonFromString(payerConfig.getPaymentDetails()));
			payerBankConfigResponseDtoList.add(payerBankConfigResponseDto);
		});

		return (new PagedRestResponse<>(payerBankConfigResponseDtoList, payerConfigDaoList));
	}

	@Override
	public PayerBankConfigResponseDto getPayerBankConfig(String id) {

		PayerConfigDaoExt payerConfigDao = payerConfigRepository.findOneById(id);

		if (payerConfigDao == null)
			throw new ServiceException(PaymentConstants.NO_CONFIGURATION_FOUND_FOR_THE_REQUESTED,
					PaymentConstants.ERR_PAY_013);

		PayerBankConfigResponseDto payerBankConfigResponseDto = (PayerBankConfigResponseDto) MapperUtil
				.getObjectMapping(payerConfigDao, new PayerBankConfigResponseDto());
		payerBankConfigResponseDto.setPaymentCode(payerConfigDao.getPayment().getPaymentCode());
		payerBankConfigResponseDto.setPaymentDetails(MapperUtil.getJsonFromString(payerConfigDao.getPaymentDetails()));

		return payerBankConfigResponseDto;
	}

	@Override
	public PayerBankConfigResponseDto addPayerBankConfig(@Valid PayerBankConfigDto payerBankConfigDto) {

		PayerConfigDaoExt payerConfigDao = payerConfigRepository
				.findOneByDescription(payerBankConfigDto.getDescription());

		if (payerConfigDao != null)
			throw new ServiceException(PaymentConstants.CONFIGURATION_IS_ALREADY_PRESENT, PaymentConstants.ERR_PAY_012);

		payerConfigDao = (PayerConfigDaoExt) MapperUtil.getObjectMapping(payerBankConfigDto, new PayerConfigDaoExt());
		PaymentDao paymentDao = new PaymentDao();
		paymentDao.setPaymentCode(payerBankConfigDto.getPaymentCode());
		payerConfigDao.setPayment(paymentDao);
		payerConfigDao.setPaymentDetails(MapperUtil.getJsonString(payerBankConfigDto.getPaymentDetails()));
		payerConfigDao.setSrcSyncId(0);
		payerConfigDao.setDestSyncId(0);

		SyncStagingDto syncStagingDto = payerBankConfigService.savePayerBankConfig(payerConfigDao,
				PaymentOperationCodes.PAYER_BANK_CONFIG_ADD);
		syncDataService.publishPaymentMessagesToQueue(syncStagingDto);

		PayerBankConfigResponseDto payerBankConfigResponseDto = (PayerBankConfigResponseDto) MapperUtil
				.getObjectMapping(payerConfigDao, new PayerBankConfigResponseDto());
		payerBankConfigResponseDto.setPaymentCode(payerConfigDao.getPayment().getPaymentCode());
		payerBankConfigResponseDto.setPaymentDetails(MapperUtil.getJsonFromString(payerConfigDao.getPaymentDetails()));

		return payerBankConfigResponseDto;
	}

	/**
	 * @param payerConfigDao
	 * @param operation
	 * @return SyncStagingDto
	 */
	@Transactional
	public SyncStagingDto savePayerBankConfig(PayerConfigDaoExt payerConfigDao, String operation) {
		payerConfigDao = payerConfigRepository.save(payerConfigDao);
		PayerConfigSyncDtoExt syncDtoExt = new PayerConfigSyncDtoExt(payerConfigDao);
		SyncStagingDto payerConfigStagingDto = new SyncStagingDto();
		List<SyncData> syncDataList = new ArrayList<>();
		syncDataList.add(DataSyncUtil.createSyncData(syncDtoExt, 0));
		List<String> destinations = new ArrayList<>();
		MessageRequest payerConfigMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
		payerConfigStagingDto.setMessageRequest(payerConfigMsgRequest);
		String payerConfigMsg = MapperUtil.getJsonString(payerConfigMsgRequest);
		// saving to staging table
		SyncStaging payerConfigSyncStaging = new SyncStaging();
		payerConfigSyncStaging.setMessage(payerConfigMsg);
		payerConfigSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		payerConfigSyncStaging = paymentSyncStagingRepository.save(payerConfigSyncStaging);
		payerConfigStagingDto.setId(payerConfigSyncStaging.getId());
		return payerConfigStagingDto;
	}

	@Override
	public PayerBankConfigResponseDto updatePayerBankConfig(String id, PayerBankConfigDto payerBankConfigDto) {

		PayerConfigDaoExt payerConfigDao = payerConfigRepository.findOneById(id);

		if (payerConfigDao == null)
			throw new ServiceException(PaymentConstants.NO_CONFIGURATION_FOUND_FOR_THE_REQUESTED,
					PaymentConstants.ERR_PAY_013);

		payerConfigDao = (PayerConfigDaoExt) MapperUtil.getObjectMapping(payerBankConfigDto, payerConfigDao);
		if (payerBankConfigDto.getPaymentCode() != null) {
			PaymentDao paymentDao = new PaymentDao();
			paymentDao.setPaymentCode(payerBankConfigDto.getPaymentCode());
			payerConfigDao.setPayment(paymentDao);
		}
		if (payerBankConfigDto.getPaymentDetails() != null)
			payerConfigDao.setPaymentDetails(MapperUtil.getJsonString(payerBankConfigDto.getPaymentDetails()));
		payerConfigDao.setSrcSyncId(payerConfigDao.getSrcSyncId() + 1);
		SyncStagingDto syncStagingDto = payerBankConfigService.savePayerBankConfig(payerConfigDao,
				PaymentOperationCodes.PAYER_BANK_CONFIG_UPDATE);
		syncDataService.publishPaymentMessagesToQueue(syncStagingDto);

		PayerBankConfigResponseDto payerBankConfigResponseDto = (PayerBankConfigResponseDto) MapperUtil
				.getObjectMapping(payerConfigDao, new PayerBankConfigResponseDto());
		payerBankConfigResponseDto.setPaymentCode(payerConfigDao.getPayment().getPaymentCode());
		payerBankConfigResponseDto.setPaymentDetails(MapperUtil.getJsonFromString(payerConfigDao.getPaymentDetails()));

		return payerBankConfigResponseDto;

	}

	@Override
	public ListResponse<PayerBankConfigDetails> getPayerBankConfigMapping(String id) {

		PayerConfigDaoExt payerConfigDao = new PayerConfigDaoExt();
		payerConfigDao.setId(id);

		List<PayerDetailsDaoExt> payerDetails = payerDetailsRepository.findByPayerBankConfig(payerConfigDao);

		return new ListResponse<>(getPayerBankdDetailsDto(id, payerDetails));
	}

	private List<PayerBankConfigDetails> getPayerBankdDetailsDto(String id, List<PayerDetailsDaoExt> payerDetails) {
		List<PayerBankConfigDetails> payerBankConfigDetailList = new ArrayList<>();
		if(payerDetails!=null && !payerDetails.isEmpty()) {
		payerDetails.forEach(payerBankDetail -> {
			PayerBankConfigDetails payerBankConfigDetail = new PayerBankConfigDetails();
			payerBankConfigDetail.setBankName(payerBankDetail.getPayerBank().getBankName());
			payerBankConfigDetail.setConfigId(id);
			payerBankConfigDetail.setId(payerBankDetail.getId());
			payerBankConfigDetailList.add(payerBankConfigDetail);
		});
		}
		return payerBankConfigDetailList;
	}

	@Override
	public ListResponse<PayerBankConfigDetails> updatePayerBankConfigMapping(String id,
			PayerBankDetails payerBankDetails) {

		List<PayerDetailsDaoExt> savePayerDetailsDaoList = new ArrayList<>();
		List<PayerDetailsDaoExt> removePayerDetails = new ArrayList<>();

		if (!payerBankDetails.getRemoveBankName().isEmpty()) {
			removePayerDetails = payerDetailsRepository.findByIdIn(payerBankDetails.getRemoveBankName());
		}

		if (!payerBankDetails.getAddBankName().isEmpty()) {

			payerBankDetails.getAddBankName().forEach(bankName -> {
				PayerDetailsDaoExt payerDetailsDao = new PayerDetailsDaoExt();
				PayerBankDao payerBankDao = new PayerBankDao();
				payerBankDao.setBankName(bankName);
				payerDetailsDao.setPayerBank(payerBankDao);
				PayerConfigDaoExt payerConfigDao = new PayerConfigDaoExt();
				payerConfigDao.setId(id);
				payerDetailsDao.setPayerBankConfig(payerConfigDao);
				savePayerDetailsDaoList.add(payerDetailsDao);

			});
		}
		PayerStaggingDto staggingDto = payerBankConfigService.payerDetailsStagging(savePayerDetailsDaoList,
				removePayerDetails, PaymentOperationCodes.PAYER_CONFIG_DETAILS_UPDATE);
		if (staggingDto.getSyncStagging()!=null) {
			syncDataService.publishPaymentMessagesToQueue(staggingDto.getSyncStagging());
		}
		return new ListResponse<>(getPayerBankdDetailsDto(id, staggingDto.getPayerDetails()));
	}

	@Transactional
	public PayerStaggingDto payerDetailsStagging(List<PayerDetailsDaoExt> savePayerDetailsDaoList,
			List<PayerDetailsDaoExt> removePayerDetails, String operation) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		if (!removePayerDetails.isEmpty()) {
			payerDetailsRepository.deleteAll(removePayerDetails);
			payerDetailsRepository.flush();
			removePayerDetails.forEach(payer -> payer.setSrcSyncId(payer.getSrcSyncId() + 1));
			List<PayerDetailsSyncDtoExt> syncList = new ArrayList<>();
			removePayerDetails.forEach(payer -> syncList.add(new PayerDetailsSyncDtoExt(payer)));
			syncDataList.add(DataSyncUtil.createSyncData(syncList, 0));
		}
		if (!savePayerDetailsDaoList.isEmpty()) {
			savePayerDetailsDaoList = payerDetailsRepository.saveAll(savePayerDetailsDaoList);
			List<PayerDetailsSyncDtoExt> syncList = new ArrayList<>();
			savePayerDetailsDaoList.forEach(payer -> syncList.add(new PayerDetailsSyncDtoExt(payer)));
			syncDataList.add(DataSyncUtil.createSyncData(syncList, 1));
		}
		PayerStaggingDto payerStagging = new PayerStaggingDto();
		if (!syncDataList.isEmpty()) {
			SyncStagingDto payerConfigStagingDto = new SyncStagingDto();
			MessageRequest payerConfigMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation,
					destinations, MessageType.GENERAL.toString(), DestinationType.ALL.toString());
			payerConfigStagingDto.setMessageRequest(payerConfigMsgRequest);
			String payerConfigMsg = MapperUtil.getJsonString(payerConfigMsgRequest);
			// saving to staging table
			SyncStaging payerConfigSyncStaging = new SyncStaging();
			payerConfigSyncStaging.setMessage(payerConfigMsg);
			payerConfigSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			payerConfigSyncStaging = paymentSyncStagingRepository.save(payerConfigSyncStaging);
			payerConfigStagingDto.setId(payerConfigSyncStaging.getId());

			payerStagging.setSyncStagging(payerConfigStagingDto);
			payerStagging.setPayerDetails(savePayerDetailsDaoList);
		}

		return payerStagging;
	}

	@Transactional
	@Override
	public ListResponse<PayerLocationMappingResponse> getPayerBankLocationMapping(String id) {

		PayerConfigDaoExt payerConfigDao = new PayerConfigDaoExt();
		payerConfigDao.setId(id);

		List<PayerLocationMappingDaoExt> payerLocationMapping = payerLocationMappingRepository
				.findByPayerBankConfig(payerConfigDao);

		return new ListResponse<>(payerBankConfigService.getPayerBankMappingDto(id, payerLocationMapping));
	}

	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public List<PayerLocationMappingResponse> getPayerBankMappingDto(String id,
			List<PayerLocationMappingDaoExt> payerLocationMapping) {
		List<PayerLocationMappingResponse> payerLocationMappingList = new ArrayList<>();
		payerLocationMapping.forEach(payerLocationMappingDao -> {
			PayerLocationMappingResponse payerLocationMappingResponse = new PayerLocationMappingResponse();
			payerLocationMappingResponse.setConfigId(id);
			payerLocationMappingResponse.setId(payerLocationMappingDao.getId());
			payerLocationMappingResponse.setLocationCode(payerLocationMappingDao.getLocationCode());
			payerLocationMappingList.add(payerLocationMappingResponse);
		});
		return payerLocationMappingList;
	}

	@Override
	public ListResponse<PayerLocationMappingResponse> updatePayerBankLocationMapping(String id,
			PayerBankLocationMapping payerBankLocationMapping) {
		PayerConfigDaoExt payerConfig = payerConfigRepository.findOneById(id);
		if (payerConfig == null) {
			throw new ServiceException(PaymentConstants.NO_CONFIGURATION_FOUND_FOR_THE_REQUESTED,
					PaymentConstants.ERR_PAY_013);
		}
		PaymentDao paymentDao = new PaymentDao();
		paymentDao.setPaymentCode(payerConfig.getPayment().getPaymentCode());

		PayerConfigDaoExt payerConfigDao = new PayerConfigDaoExt();
		payerConfigDao.setId(id);
		payerConfigDao.setPayment(paymentDao);
		List<PayerLocationMappingDaoExt> addPayerlocationDaoList = new ArrayList<>();
		List<PayerLocationMappingDaoExt> removePayerlocationDaoList = new ArrayList<>();
		List<PayerLocationMappingDaoExt> overwritePayerlocationDaoList = new ArrayList<>();
		if (!payerBankLocationMapping.getRemoveLocations().isEmpty()) {
			removePayerlocationDaoList = payerLocationMappingRepository.findByLocationCodeInAndPayerBankConfig(
					payerBankLocationMapping.getRemoveLocations(), payerConfigDao);
		}

		if (!payerBankLocationMapping.getOverwriteLocations().isEmpty()) {
			overwritePayerlocationDaoList = payerLocationMappingRepository.findByLocationCodeInAndPaymentPaymentCode(
					payerBankLocationMapping.getOverwriteLocations(), payerConfig.getPayment().getPaymentCode());
		}
		if (!payerBankLocationMapping.getAddLocations().isEmpty()) {
			addPayerlocationDaoList = payerBankConfigService.getAddPayerBankLocation(
					payerBankLocationMapping.getAddLocations().stream().collect(Collectors.toSet()), payerConfigDao,
					paymentDao);
		}
		PayerBankConfigLocationRespondDto responseDto = payerBankConfigService.saveToDB(addPayerlocationDaoList,
				removePayerlocationDaoList, overwritePayerlocationDaoList, payerConfigDao, paymentDao);
		if (!responseDto.getStagingResponse().isEmpty()) {
			for (Map.Entry<String, SyncStagingDto> entry : responseDto.getStagingResponse().entrySet()) {
				List<String> destinations = new ArrayList<>();
				destinations.add(entry.getKey());
				syncDataService.publishPaymentMessagesToQueue(entry.getValue());
			}
		}
		addPayerlocationDaoList.addAll(overwritePayerlocationDaoList);
		return new ListResponse<>(
				payerBankConfigService.getPayerBankMappingDto(id, responseDto.getAddedPayerLocation()));
	}

	@Transactional
	public PayerBankConfigLocationRespondDto saveToDB(List<PayerLocationMappingDaoExt> addPayerlocationDaoList,
			List<PayerLocationMappingDaoExt> removePayerlocationDaoList,
			List<PayerLocationMappingDaoExt> overwritePayerlocationDaoList, PayerConfigDaoExt payerConfigDao,
			PaymentDao paymentDao) {
		Set<String> locationSet = new HashSet<>();
		List<PayerLocationMappingDaoExt> deleteMappingList = new ArrayList<>();
		List<PayerLocationMappingDaoExt> allUpdated = new ArrayList<>();
		if (!removePayerlocationDaoList.isEmpty()) {
			payerLocationMappingRepository.deleteAll(removePayerlocationDaoList);
			payerLocationMappingRepository.flush();
			removePayerlocationDaoList.forEach(payerLoc -> {
				payerLoc.setSyncTime(new Date().getTime());
				deleteMappingList.add(payerLoc);
				locationSet.add(payerLoc.getLocationCode());
			});
		}
		if (!overwritePayerlocationDaoList.isEmpty()) {
			payerLocationMappingRepository.deleteAll(overwritePayerlocationDaoList);
			payerLocationMappingRepository.flush();
			Set<String> existingLocation = new HashSet<>();
			overwritePayerlocationDaoList.forEach(oldPayerLocation -> {
				oldPayerLocation.setSyncTime(new Date().getTime());
				deleteMappingList.add(oldPayerLocation);
				if (!existingLocation.contains(oldPayerLocation.getLocationCode())) {
					PayerLocationMappingDaoExt updatedPayerLocation = payerBankConfigService.getAddPayerBankLocation(
							overwritePayerlocationDaoList.stream().map(PayerLocationMappingDaoExt::getLocationCode)
									.collect(Collectors.toSet()),
							payerConfigDao, paymentDao).get(0);
					updatedPayerLocation = payerLocationMappingRepository.save(updatedPayerLocation);
					allUpdated.add(updatedPayerLocation);
					locationSet.add(updatedPayerLocation.getLocationCode());
				}
				existingLocation.add(oldPayerLocation.getLocationCode());
			});
		}
		if (!addPayerlocationDaoList.isEmpty()) {
			addPayerlocationDaoList.forEach(payerLoc -> {
				payerLoc.setSyncTime(new Date().getTime());
				allUpdated.add(payerLoc);
				locationSet.add(payerLoc.getLocationCode());
			});
		}
		List<PayerLocationMappingDaoExt> saveMappingList = payerLocationMappingRepository.saveAll(allUpdated);
		Map<String, List<SyncData>> syncDataMap = new HashMap<>();
		if (!deleteMappingList.isEmpty())
			getSyncDataList(deleteMappingList, locationSet, syncDataMap, 0);
		if (!saveMappingList.isEmpty())
			getSyncDataList(saveMappingList, locationSet, syncDataMap, 1);
		Map<String, SyncStagingDto> locationSyncDataMap = new HashMap<>();
		for (Map.Entry<String, List<SyncData>> entry : syncDataMap.entrySet()) {
			List<String> destinations = new ArrayList<>();
			destinations.add(entry.getKey());
			locationSyncDataMap.put(entry.getKey(),
					payerBankConfigService.saveToSyncStagging(entry.getValue(), destinations));

		}
		return new PayerBankConfigLocationRespondDto(locationSyncDataMap, allUpdated);
	}

	/**
	 * @param deleteMappingList
	 * @param locationSet
	 * @param syncDataMap
	 * @param order
	 */
	private void getSyncDataList(List<PayerLocationMappingDaoExt> payerLocationMappingList, Set<String> locationSet,
			Map<String, List<SyncData>> syncDataMap, int order) {
		for (String location : locationSet) {
			payerLocationMappingList.forEach(payerLoc -> {
				if (payerLoc.getLocationCode().equals(location)) {
					if (syncDataMap.containsKey(location)) {
						PayerLocationMappingSyncDtoExt syncDtoExt = new PayerLocationMappingSyncDtoExt(payerLoc);
						syncDataMap.get(location).add(DataSyncUtil.createSyncData(syncDtoExt, order));
					} else {
						List<SyncData> syncDatas = new ArrayList<>();
						PayerLocationMappingSyncDtoExt syncDtoExt = new PayerLocationMappingSyncDtoExt(payerLoc);
						syncDatas.add(DataSyncUtil.createSyncData(syncDtoExt, order));
						syncDataMap.put(location, syncDatas);
					}
				}
			});
		}

	}

	public SyncStagingDto saveToSyncStagging(List<SyncData> payerLocSyncDataList, List<String> destinations) {
		SyncStagingDto payerLocSyncStagingDto = new SyncStagingDto();
		MessageRequest msgRequest = DataSyncUtil.createMessageRequest(payerLocSyncDataList,
				PaymentOperationCodes.PAYER_BANK_LOCATION, destinations, MessageType.GENERAL.toString(),
				DestinationType.SELECTIVE.toString());
		String requestBody = MapperUtil.getJsonString(msgRequest);
		SyncStaging payerLocStaggingMsg = new SyncStaging();
		payerLocStaggingMsg.setMessage(requestBody);
		payerLocStaggingMsg.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		payerLocStaggingMsg = paymentSyncStagingRepository.save(payerLocStaggingMsg);
		payerLocSyncStagingDto.setMessageRequest(msgRequest);
		payerLocSyncStagingDto.setId(payerLocStaggingMsg.getId());
		return payerLocSyncStagingDto;
	}

	private List<PayerLocationMappingDaoExt> getAddPayerBankLocation(Set<String> addLocations,
			PayerConfigDaoExt payerConfigDao, PaymentDao paymentDao) {
		List<PayerLocationMappingDaoExt> addPayerlocationDaoList = new ArrayList<>();
		addLocations.forEach(locationCode -> {
			PayerLocationMappingDaoExt payerLocationMappingDao = new PayerLocationMappingDaoExt();
			payerLocationMappingDao.setLocationCode(locationCode);
			payerLocationMappingDao.setPayerBankConfig(payerConfigDao);
			payerLocationMappingDao.setPayment(paymentDao);
			payerLocationMappingDao.setSyncTime(new Date().getTime());
			addPayerlocationDaoList.add(payerLocationMappingDao);
		});
		return addPayerlocationDaoList;
	}

	/**
	 * This method will return the list of location codes which is already mapped to
	 * configId based on location Codes,
	 * 
	 * @param mappedLocationDto,
	 * @return List<MappedConfigResponseDto>
	 */
	@Override
	public ListResponse<MappedConfigResponse> getMappedLocationCodes(MappedLocationDto mappedLocationDto) {

		List<MappedConfigResponse> mappedLocationList = new ArrayList<>();
		String paymentCode = null;

		Optional<PayerConfigDaoExt> payerConfigDao = payerConfigRepository
				.findById(mappedLocationDto.getExcludeConfigId());

		if (!payerConfigDao.isPresent()) {
			throw new ServiceException(PaymentConstants.NO_CONFIGURATION_FOUND_FOR_THE_REQUESTED,
					PaymentConstants.ERR_PAY_013);
		} else {
			paymentCode = payerConfigDao.get().getPayment().getPaymentCode();
		}

		Set<String> includeLocations = CollectionUtil.setNullIfEmpty(mappedLocationDto.getIncludeLocations());
		List<PayerLocationMappingDaoExt> locationCodeDao = payerLocationMappingRepository
				.findOtherConfigMappedLocationCode(mappedLocationDto.getExcludeConfigId(), paymentCode,
						includeLocations);

		if (!CollectionUtils.isEmpty(locationCodeDao)) {
			locationCodeDao.forEach(configDao -> {
				MappedConfigResponse responseDto = new MappedConfigResponse();
				responseDto.setConfigId(configDao.getPayerBankConfig().getId());
				responseDto.setLocationCode(configDao.getLocationCode());
				responseDto.setId(configDao.getId());
				responseDto.setConfigName(configDao.getPayerBankConfig().getDescription());
				responseDto.setPaymentCode(configDao.getPayment().getPaymentCode());
				mappedLocationList.add(responseDto);
			});
		}

		return new ListResponse<>(mappedLocationList);
	}

}
