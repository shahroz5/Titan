/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.store.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.StoreOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.store.dao.BankPriorityDaoExt;
import com.titan.poss.store.dao.SyncStaging;
import com.titan.poss.store.dto.BankPriorityDto;
import com.titan.poss.store.dto.BankPrioritySyncDtoExt;
import com.titan.poss.store.dto.request.PriorityDto;
import com.titan.poss.store.repository.BankPriorityRepositoryExt;
import com.titan.poss.store.repository.StoreSyncStagingRepository;
import com.titan.poss.store.service.BankPriorityService;
import com.titan.poss.store.service.StoreSyncDataService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("bankPriorityServiceImpl")
public class BankPriorityServiceImpl implements BankPriorityService {

	@Autowired
	private BankPriorityRepositoryExt bankPriorityRepository;
	@Autowired
	private BankPriorityServiceImpl bnkPriorityServiceImpl;
	@Autowired
	private StoreSyncDataService storeSyncDataService;
	@Autowired
	private StoreSyncStagingRepository storeSyncStagingRepository;

	@Value("${app.name}")
	private String appName;

	/**
	 * @return List<BankPriorityDto>
	 */
	@Override
	public List<BankPriorityDto> listBankPriority() {
		List<BankPriorityDaoExt> bankPriorityDaoList = bankPriorityRepository
				.findAllByLocationCodeOrderByPriority(CommonUtil.getLocationCode());
		return bankPriorityDaoList.stream()
				.map(bankPriority -> (BankPriorityDto) MapperUtil.getObjectMapping(bankPriority, new BankPriorityDto()))
				.collect(Collectors.toList());
	}

	@Override
	public List<BankPriorityDto> updateBankPriority(PriorityDto bankPriorityDto, String locationCode) {
		List<BankPriorityDaoExt> removeBankPriorityList = new ArrayList<>();
		Long syncTime= new Date().getTime();
		if (!bankPriorityDto.getRemovePriority().isEmpty()) {
			removeBankPriorityList = bankPriorityRepository.findByLocationCodeAndBankNameIn(locationCode,
					bankPriorityDto.getRemovePriority());
			removeBankPriorityList.forEach(bank -> bank.setSyncTime(syncTime));
		}
		List<BankPriorityDaoExt> savedBankPriorityList = new ArrayList<>();
		List<BankPriorityDto> addPriority = bankPriorityDto.getAddPriority();
		if (!bankPriorityDto.getAddPriority().isEmpty()) {
			List<BankPriorityDaoExt> bankPriorityDaoList = new ArrayList<>();
			List<String> bankNameList = addPriority.stream().map(BankPriorityDto::getBankName)
					.collect(Collectors.toList());
			List<BankPriorityDaoExt> updateBankPriority = bankPriorityRepository
					.findByLocationCodeAndBankNameIn(CommonUtil.getLocationCode(), bankNameList);
			Map<String, BankPriorityDaoExt> priorityMappingMap = new HashMap<>();
			for (BankPriorityDaoExt priorityMappingDao : updateBankPriority)
				priorityMappingMap.put(priorityMappingDao.getBankName(), priorityMappingDao);
			addPriority.forEach(bankPriority -> {
				BankPriorityDaoExt bankPriorityDao;
				if (priorityMappingMap.containsKey(bankPriority.getBankName())) {
					bankPriorityDao = (BankPriorityDaoExt) MapperUtil.getObjectMapping(bankPriority,
							priorityMappingMap.get(bankPriority.getBankName()));
					bankPriorityDao.setLocationCode(locationCode);
					bankPriorityDao.setSyncTime(syncTime);

				} else {
					bankPriorityDao = (BankPriorityDaoExt) MapperUtil.getObjectMapping(bankPriority,
							new BankPriorityDaoExt());
					bankPriorityDao.setLocationCode(locationCode);
					bankPriorityDao.setSyncTime(syncTime);
				}
				bankPriorityDaoList.add(bankPriorityDao);
			});
			savedBankPriorityList.addAll(bankPriorityDaoList);
		}
		SyncStagingDto syncStagingDto = bnkPriorityServiceImpl.dbOperation(savedBankPriorityList,
				removeBankPriorityList,locationCode);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName))
			storeSyncDataService.publishPaymentMessagesToQueue(syncStagingDto);
		return savedBankPriorityList.stream().map(bankPriorityDao -> (BankPriorityDto) MapperUtil
				.getObjectMapping(bankPriorityDao, new BankPriorityDto())).collect(Collectors.toList());

	}

	@Transactional
	public SyncStagingDto dbOperation(List<BankPriorityDaoExt> savedBankPriorityList,
			List<BankPriorityDaoExt> removeBankPriorityList,String locationCode) {
		if (!removeBankPriorityList.isEmpty()) {
			bankPriorityRepository.deleteAll(removeBankPriorityList);
			bankPriorityRepository.flush();
		}
		if (!savedBankPriorityList.isEmpty()) {
			bankPriorityRepository.saveAll(savedBankPriorityList);
		}
		savedBankPriorityList=bankPriorityRepository.findByLocationCode(locationCode);
		SyncStagingDto syncStagingDto = bnkPriorityServiceImpl.getsyncDto(removeBankPriorityList,
				savedBankPriorityList);
		if(!savedBankPriorityList.isEmpty())
			bankPriorityRepository.saveAll(savedBankPriorityList);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			String bankPriorityMsg = MapperUtil.getJsonString(syncStagingDto.getMessageRequest());
			SyncStaging bankPrioritySyncStaging = new SyncStaging();
			bankPrioritySyncStaging.setMessage(bankPriorityMsg);
			bankPrioritySyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			bankPrioritySyncStaging = storeSyncStagingRepository.save(bankPrioritySyncStaging);
			syncStagingDto.setId(bankPrioritySyncStaging.getId());
		}
		return syncStagingDto;
	}

	public SyncStagingDto getsyncDto(List<BankPriorityDaoExt> removeBankPriorityList,
			List<BankPriorityDaoExt> savedBankPriorityList) {
		BankPrioritySyncDtoExt syncDto = new BankPrioritySyncDtoExt();
		List<SyncData> syncDataList = new ArrayList<>();
		if (!savedBankPriorityList.isEmpty()) {
			Long syncTime= new Date().getTime();
			savedBankPriorityList.forEach(bankPriority->bankPriority.setSyncTime(syncTime));
			syncDataList
					.add(DataSyncUtil.createSyncData(syncDto.getBankPrioritySyncDtoExtList(savedBankPriorityList), 1));
		}else {
			syncDataList.add(DataSyncUtil.createSyncData(syncDto.getBankPrioritySyncDtoExtList(removeBankPriorityList), 0));
		}
		List<String> destinations = new ArrayList<>();
		destinations.add("EPOSS");
		MessageRequest bankPriorityMsgRequest = DataSyncUtil.createMessageRequest(syncDataList,
				StoreOperationCode.PAYER_BANK_PRIORITY_MAPPING, destinations, MessageType.GENERAL.toString(),
				DestinationType.SELECTIVE.toString());

		SyncStagingDto bankPriorityStagingDto = new SyncStagingDto();
		bankPriorityStagingDto.setMessageRequest(bankPriorityMsgRequest);
		return bankPriorityStagingDto;
	}

}
