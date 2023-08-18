/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.service.impl;

import static com.titan.poss.payment.constants.PaymentConstants.PAYEE_BANK_SERVICE_IMPL;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.dto.TownLiteDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.PaymentOperationCodes;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.payment.constants.PaymentConstants;
import com.titan.poss.payment.dao.PayeeBankDao;
import com.titan.poss.payment.dao.PayeeBankLocationMappingDaoExt;
import com.titan.poss.payment.dao.SyncStaging;
import com.titan.poss.payment.dto.PayeeBankDto;
import com.titan.poss.payment.dto.PayeeBankLocationSyncDtoExt;
import com.titan.poss.payment.dto.PayeeBankSyncDto;
import com.titan.poss.payment.dto.UpdateGLCodeDto;
import com.titan.poss.payment.dto.request.MappedConfigDto;
import com.titan.poss.payment.dto.request.PayeeBankMappingDto;
import com.titan.poss.payment.dto.request.PayeeBankUpdateDto;
import com.titan.poss.payment.dto.response.PayeeBankLocationDto;
import com.titan.poss.payment.repository.PayeeBankLocationMappingRepositoryExt;
import com.titan.poss.payment.repository.PayeeBankRepository;
import com.titan.poss.payment.repository.PaymentSyncStagingRepository;
import com.titan.poss.payment.service.PayeeBankService;
import com.titan.poss.payment.service.PaymentCommonService;
import com.titan.poss.payment.service.PaymentSyncDataService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service(PAYEE_BANK_SERVICE_IMPL)
public class PayeeBankServiceImpl implements PayeeBankService {

	@Autowired
	private PayeeBankRepository payeeBankRepository;

	@Autowired
	private PayeeBankLocationMappingRepositoryExt payeeBankLocationMappingRepository;

	@Autowired
	private PaymentCommonService paymentUtilService;

	@Autowired
	private PaymentSyncDataService syncDataService;

	@Autowired
	private PaymentSyncStagingRepository paymentSyncStagingRepository;
	
	@Autowired
	private EngineServiceClient engineService;

	@Autowired
	private PayeeBankServiceImpl payeeBankService;

	/**
	 * This method will return the list of payee bank based on the isActive.
	 *
	 * @param isActive
	 * @param pageable
	 * @return PagedRestResponse<List < PayeeBankDto>>
	 */
	@Override
	public PagedRestResponse<List<PayeeBankDto>> listPayeeBank(String bankName, Boolean isActive, Pageable pageable) {

		/*
		 * PayeeBankDao payeeBankCriteria = new PayeeBankDao();
		 * payeeBankCriteria.setIsActive(isActive);
		 * 
		 * ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		 * Example<PayeeBankDao> criteria = Example.of(payeeBankCriteria, matcher);
		 */

		Page<PayeeBankDao> payeeBankList = payeeBankRepository.getPayeeBankList(bankName, isActive, pageable);
		List<PayeeBankDto> payerBankDtoList = new ArrayList<>();

		payeeBankList.forEach(payerBank -> {
			PayeeBankDto payeeBankDto = (PayeeBankDto) MapperUtil.getObjectMapping(payerBank, new PayeeBankDto());
			payerBankDtoList.add(payeeBankDto);
		});

		return (new PagedRestResponse<>(payerBankDtoList, payeeBankList));
	}

	/**
	 * This method will return the Payee Bank based on the bankName.
	 *
	 * @param bankName
	 * @return PayeeBankDto
	 */
	@Override
	public PayeeBankDto getPayeeBank(String bankName) {

		PayeeBankDao payeeBankDao = payeeBankRepository.findOneByBankName(bankName);

		if (payeeBankDao == null)
			throw new ServiceException(PaymentConstants.NO_BANK_FOUND_FOR_THE_REQUESTED_BANK_NAME,
					PaymentConstants.ERR_PAY_005);

		return (PayeeBankDto) MapperUtil.getObjectMapping(payeeBankDao, new PayeeBankDto());
	}

	/**
	 * This method will save the Payee Bank.
	 *
	 * @param payeeBankDto
	 * @return PayeeBankDto
	 */
	@Override
	public PayeeBankDto addPayeeBank(PayeeBankDto payeeBankDto) {

		PayeeBankDao payeeBankDao = payeeBankRepository.findOneByBankName(payeeBankDto.getBankName());

		if (payeeBankDao != null)
			throw new ServiceException(PaymentConstants.BANK_NAME_IS_ALREADY_AVAILABLE, PaymentConstants.ERR_PAY_006);

		payeeBankDao = (PayeeBankDao) MapperUtil.getObjectMapping(payeeBankDto, new PayeeBankDao());
		TownLiteDto town=engineService.getStateAndTownDetails(payeeBankDto.getStateName(), payeeBankDto.getTownName());
		payeeBankDao.setStateName(town.getStateName());
		payeeBankDao.setTownName(town.getTownName());
		payeeBankDao.setSrcSyncId(0);
		payeeBankDao.setDestSyncId(0);

		Map<String, SyncStagingDto> syncStagingDto = payeeBankService.savePayeeBank(payeeBankDao,
				PaymentOperationCodes.PAYEE_BANK_ADD, true);
		syncDataService.publishPaymentMessages(syncStagingDto);

		return (PayeeBankDto) MapperUtil.getObjectMapping(payeeBankDao, new PayeeBankDto());
	}

	/**
	 * @param payeeBankDao
	 * @param operation
	 * @return SyncStagingDto
	 */
	@Transactional
	public Map<String, SyncStagingDto> savePayeeBank(PayeeBankDao payeeBankDao, String operation,
			boolean isPublishToEGHS) {

		payeeBankDao = payeeBankRepository.save(payeeBankDao);
		List<SyncData> syncDataList = new ArrayList<>();
		PayeeBankSyncDto payeeBankSyncDto = new PayeeBankSyncDto(payeeBankDao);
		syncDataList.add(DataSyncUtil.createSyncData(payeeBankSyncDto, 0));
		List<String> destinations = new ArrayList<>();
		return syncDataService.getPaymentSyncStagingMap(syncDataList, operation, destinations, isPublishToEGHS,
				MessageType.GENERAL.toString(), DestinationType.ALL.toString());
	}

	/**
	 * This method will update the Payee bank.
	 *
	 * @param bankName
	 * @param payeeBankDto
	 * @return PayeeBankDto
	 */
	@Override
	public PayeeBankDto updatePayeeBank(String bankName, PayeeBankUpdateDto payeeBankDto) {

		PayeeBankDao payeeBankDao = payeeBankRepository.findOneByBankName(bankName);

		if (payeeBankDao == null)
			throw new ServiceException(PaymentConstants.NO_BANK_FOUND_FOR_THE_REQUESTED_BANK_NAME,
					PaymentConstants.ERR_PAY_005);

		payeeBankDao = (PayeeBankDao) MapperUtil.getObjectMapping(payeeBankDto, payeeBankDao);

		payeeBankDao.setSrcSyncId(payeeBankDao.getSrcSyncId() + 1);
		TownLiteDto town=engineService.getStateAndTownDetails(payeeBankDto.getStateName(), payeeBankDto.getTownName());
		if(!StringUtils.isEmpty(town.getStateName()))
			payeeBankDao.setStateName(town.getStateName());
		if(!StringUtils.isEmpty(town.getTownName()))
			payeeBankDao.setTownName(town.getTownName());
		Map<String, SyncStagingDto> syncStagingDto = payeeBankService.savePayeeBank(payeeBankDao,
				PaymentOperationCodes.PAYEE_BANK_UPDATE, true);
		syncDataService.publishPaymentMessages(syncStagingDto);

		return (PayeeBankDto) MapperUtil.getObjectMapping(payeeBankDao, new PayeeBankDto());
	}

	/**
	 * This method will get the list of gl_code for Payee bank based on location
	 * Code and bankName.
	 *
	 * @param bankName
	 * @param locationCode
	 * @return PayeeBankLocationDto
	 */

	@Override
	public PagedRestResponse<List<PayeeBankLocationDto>> getLocationMapping(String bankName, List<String> locationCode,
			Pageable pageable, List<String> paymentCodes, Boolean isPageable) {
		
		if (!isPageable.booleanValue()) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}
		
		Page<PayeeBankLocationMappingDaoExt> payeeBankList = payeeBankLocationMappingRepository
				.findByBankNameAndLocationCodeIn(bankName, locationCode, pageable, paymentCodes);
		List<PayeeBankLocationDto> payeeBankDtoList = new ArrayList<>();

		payeeBankList.forEach(payeeMappingDao -> {
			PayeeBankLocationDto payeeBankLocationDto = (PayeeBankLocationDto) MapperUtil
					.getObjectMapping(payeeMappingDao, new PayeeBankLocationDto());
			payeeBankLocationDto.setBankName(payeeMappingDao.getPayeeBank().getBankName());
			payeeBankLocationDto.setPaymentCode(payeeMappingDao.getPayment().getPaymentCode());
			payeeBankDtoList.add(payeeBankLocationDto);
		});

		return (new PagedRestResponse<>(payeeBankDtoList, payeeBankList));
	}

	/**
	 * @param isPublishToEGHS
	 * @param syncDtoList
	 * @param removeMappingDaoList
	 * @param payeeBankLocationMappingDaoList
	 * @param payeeBankLocationMappingData
	 */

	public SyncStagingDto syncStaggging(PayeeBankLocationMappingDaoExt mappingDao, int order,
			List<SyncStagingDto> syncDtoList, boolean isPublishToEGHS) {

		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(mappingDao.getLocationCode());
		PayeeBankLocationSyncDtoExt syncDtoExt = new PayeeBankLocationSyncDtoExt(mappingDao);
		if (order == 0) {
			syncDataList.add(DataSyncUtil.createSyncData(syncDtoExt, order));
		}
		if (order == 1) {
			syncDataList.add(DataSyncUtil.createSyncData(syncDtoExt, order));
		}
		SyncStagingDto payeeBankStagingDto = new SyncStagingDto();
		MessageRequest payeeBankMsgRequest = DataSyncUtil.createMessageRequest(syncDataList,
				PaymentOperationCodes.PAYEE_BANK_LOCATION, destinations, MessageType.GENERAL.toString(),
				DestinationType.SELECTIVE.toString());
		payeeBankStagingDto.setMessageRequest(payeeBankMsgRequest);
		if (isPublishToEGHS) {
			SyncStagingDto eghsStaging = syncDataService.getEGHSSyncStagingDto(syncDataList,
					PaymentOperationCodes.PAYEE_BANK_LOCATION, MessageType.GENERAL.toString());
			syncDtoList.add(eghsStaging);
		}

		return payeeBankStagingDto;

	}

	/**
	 * This method will mapped the bankName with paymentCodes in multiple locations.
	 *
	 * @param bankName
	 * @param payeeBankLocationMappingDto
	 * @return ListResponse<PayeeBankLocationDto>
	 */
	@Override
	public ListResponse<PayeeBankLocationDto> updateLocationMappings(String bankName,
			PayeeBankMappingDto payeeBankLocationMappingDto) {
		List<PayeeBankLocationMappingDaoExt> savePayeeBankMappingDaoList = new ArrayList<>();
		List<PayeeBankLocationMappingDaoExt> removeMappingDaoList = new ArrayList<>();
		if (payeeBankLocationMappingDto.getRemoveLocations()!=null && !payeeBankLocationMappingDto.getRemoveLocations().isEmpty()) {
			List<PayeeBankLocationMappingDaoExt> removeLocationMapping = payeeBankLocationMappingRepository
					.findByPayeeBankBankNameAndLocationCodeIn(bankName,
							payeeBankLocationMappingDto.getRemoveLocations());
			removeLocationMapping.forEach(mappingDao -> mappingDao.setSyncTime(new Date().getTime()));
			removeMappingDaoList.addAll(removeLocationMapping);
		}

		if ((payeeBankLocationMappingDto.getRemovePaymentCodes()!=null && !payeeBankLocationMappingDto.getRemovePaymentCodes().isEmpty())
				&& (payeeBankLocationMappingDto.getAddLocations()!=null && !payeeBankLocationMappingDto.getAddLocations().isEmpty())) {
			List<PayeeBankLocationMappingDaoExt> removePaymentCodes = payeeBankLocationMappingRepository
					.findByPayeeBankBankNameAndPaymentPaymentCodeInAndLocationCodeIn(bankName,
							payeeBankLocationMappingDto.getRemovePaymentCodes(),
							payeeBankLocationMappingDto.getAddLocations());
			removePaymentCodes.forEach(mappingDao -> mappingDao.setSyncTime(new Date().getTime()));
			removeMappingDaoList.addAll(removePaymentCodes);
		}
		if (payeeBankLocationMappingDto.getUpdateConfigs()!=null && !payeeBankLocationMappingDto.getUpdateConfigs().isEmpty()) {
			List<PayeeBankLocationMappingDaoExt> updateMappingList = new ArrayList<>();
			List<String> idList = payeeBankLocationMappingDto.getUpdateConfigs().stream().map(UpdateGLCodeDto::getId)
					.collect(Collectors.toList());

			List<PayeeBankLocationMappingDaoExt> updateLocationMapping = payeeBankLocationMappingRepository
					.findAllById(idList);
			removeMappingDaoList.addAll(updateLocationMapping);
			Map<String, PayeeBankLocationMappingDaoExt> payeeBankMappingMap = new HashMap<>();

			updateLocationMapping.forEach(updateData -> payeeBankMappingMap.put(updateData.getId(), updateData));

			payeeBankLocationMappingDto.getUpdateConfigs().forEach(updateConfigs -> {
				PayeeBankLocationMappingDaoExt payeeBankMapping = payeeBankMappingMap.get(updateConfigs.getId());
				payeeBankMapping.setGlCode(updateConfigs.getGlCode());
				payeeBankMapping.setIsDefault(updateConfigs.getIsDefault());
				updateMappingList.add(payeeBankMapping);
			});

			List<PayeeBankLocationMappingDaoExt> defaultTrueList = updateMappingList.stream()
					.filter(updateConfig -> Boolean.TRUE.equals(updateConfig.getIsDefault()))
					.collect(Collectors.toList());
			List<PayeeBankLocationMappingDaoExt> defaultFalseList = updateMappingList.stream()
					.filter(updateConfig -> Boolean.FALSE.equals(updateConfig.getIsDefault()))
					.collect(Collectors.toList());

			if (!defaultFalseList.isEmpty()) {
				defaultFalseList.forEach(mappingDao -> mappingDao.setSyncTime(new Date().getTime()));
				savePayeeBankMappingDaoList.addAll(defaultFalseList);
			}

			if (!defaultTrueList.isEmpty()) {
				defaultTrueList.forEach(mappingDao -> mappingDao.setSyncTime(new Date().getTime()));
				savePayeeBankMappingDaoList.addAll(defaultTrueList);
			}
		}
		if (payeeBankLocationMappingDto.getAddPaymentCodes()!=null && !payeeBankLocationMappingDto.getAddPaymentCodes().isEmpty()
				&& !payeeBankLocationMappingDto.getAddLocations().isEmpty()) {
			List<PayeeBankLocationMappingDaoExt> payeeBankLocationMappingDaoList = new ArrayList<>();
            payeeBankLocationMappingDto.getAddLocations()
                    .forEach(addLocation -> payeeBankLocationMappingDto.getAddPaymentCodes()
                            .forEach(paymentCodes -> payeeBankLocationMappingDaoList
                                    .add(paymentUtilService.getPayeeDaoMapping(paymentCodes, bankName, addLocation))));
			payeeBankLocationMappingDaoList.forEach(mappingDao -> mappingDao.setSyncTime(new Date().getTime()));
			savePayeeBankMappingDaoList.addAll(payeeBankLocationMappingDaoList);
		}
		List<SyncStagingDto> syncDtoList = payeeBankService.saveToDB(savePayeeBankMappingDaoList, removeMappingDaoList,
				true);
		syncDtoList.forEach(stagingDto -> syncDataService.publishPaymentMessagesToQueue(stagingDto));
		return new ListResponse<>(paymentUtilService.getPayeeDtoMapping(savePayeeBankMappingDaoList));
	}

	@Transactional
	public List<SyncStagingDto> saveToDB(List<PayeeBankLocationMappingDaoExt> savePayeeBankMappingDaoList,
			List<PayeeBankLocationMappingDaoExt> removeMappingDaoList, boolean isPublishToEGHS) {
		List<SyncStagingDto> syncDtoList = new ArrayList<>();
		if (!removeMappingDaoList.isEmpty()) {
			payeeBankLocationMappingRepository.deleteAll(removeMappingDaoList);
			payeeBankLocationMappingRepository.flush();
			removeMappingDaoList.forEach(dao -> {
				SyncStagingDto stagingDto = payeeBankService.syncStaggging(dao, 0, syncDtoList, isPublishToEGHS);
				String payerBankMsgRqst = MapperUtil.getJsonString(stagingDto.getMessageRequest());
				SyncStaging payeeBankSyncStaging = new SyncStaging();
				payeeBankSyncStaging.setMessage(payerBankMsgRqst);
				payeeBankSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
				payeeBankSyncStaging = paymentSyncStagingRepository.save(payeeBankSyncStaging);
				stagingDto.setId(payeeBankSyncStaging.getId());
				syncDtoList.add(stagingDto);
			});
		}
		if (!savePayeeBankMappingDaoList.isEmpty()) {
			savePayeeBankMappingDaoList = payeeBankLocationMappingRepository.saveAll(savePayeeBankMappingDaoList);
			savePayeeBankMappingDaoList.forEach(dao -> {
				SyncStagingDto stagingDto = payeeBankService.syncStaggging(dao, 1, syncDtoList, isPublishToEGHS);
				String payerBankMsgRqst = MapperUtil.getJsonString(stagingDto.getMessageRequest());
				SyncStaging payeeBankSyncStaging = new SyncStaging();
				payeeBankSyncStaging.setMessage(payerBankMsgRqst);
				payeeBankSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
				payeeBankSyncStaging = paymentSyncStagingRepository.save(payeeBankSyncStaging);
				stagingDto.setId(payeeBankSyncStaging.getId());
				syncDtoList.add(stagingDto);
			});
		}
		return syncDtoList;
	}

	/**
	 * This method will give the list of Payee bank location mapping for which
	 * default is true already Configured.
	 *
	 * @param payeeBankMapping
	 * @return ListResponse<PayeeBankLocationDto>
	 */
	@Override
	public ListResponse<PayeeBankLocationDto> getConflictLocationMapping(MappedConfigDto payeeBankMapping) {

		List<PayeeBankLocationMappingDaoExt> payeeBankLocationMappingDaoList = new ArrayList<>();

		payeeBankMapping.getDefaultList().forEach(payeeBank -> {
			PayeeBankLocationMappingDaoExt payeeBankLocationMappingDao = payeeBankLocationMappingRepository
					.findByPaymentPaymentCodeAndLocationCodeAndIsDefault(payeeBank.getPaymentCode(),
							payeeBank.getLocationCode(), Boolean.TRUE);
			if (payeeBankLocationMappingDao != null)
				payeeBankLocationMappingDaoList.add(payeeBankLocationMappingDao);

		});

		return new ListResponse<>(paymentUtilService.getPayeeDtoMapping(payeeBankLocationMappingDaoList));
	}
}
