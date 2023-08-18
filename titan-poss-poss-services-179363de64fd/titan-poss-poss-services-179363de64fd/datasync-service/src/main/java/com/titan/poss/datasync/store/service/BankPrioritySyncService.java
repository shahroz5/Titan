/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.store.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.StoreOperationCode;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.store.dao.BankPriorityDao;
import com.titan.poss.store.dto.BankPrioritySyncDto;
import com.titan.poss.store.repository.BankPriorityRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class BankPrioritySyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	public BankPriorityRepository bnkPriorityRepository;

	@Autowired
	private BankPrioritySyncService streSyncService;

	private static final Logger LOGGER = LoggerFactory.getLogger(BankPrioritySyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		try {
			if (operationCode.equals(StoreOperationCode.PAYER_BANK_PRIORITY_MAPPING)) {
				Boolean flag=syncBankPriority(syncData);
				if (Boolean.TRUE.equals(flag)) {
					datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.SYNCED.name());
				} else {
					datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.DISCARDED.name());
				}
			}
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,messageTransfer.getMessageTransferData().getDestination(),
					DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,messageTransfer.getMessageTransferData().getDestination(),
					DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	private Boolean syncBankPriority(List<SyncData> syncData) {
		List<BankPriorityDao> saveBankPriorityDaoList = new ArrayList<>();
		List<BankPriorityDao> deleteBankPriorityDaoList = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		for (SyncData data : syncData) {
			if (data.getOrder() == 0) {
				 getBankPrioritySync(data,deleteBankPriorityDaoList, mapper);
			} else if (data.getOrder() == 1) {
				 getBankPrioritySync(data,saveBankPriorityDaoList, mapper);
			}
		}
		return streSyncService.dbOperation(saveBankPriorityDaoList, deleteBankPriorityDaoList);
	}

	private void getBankPrioritySync(SyncData data, List<BankPriorityDao> bankPriorityDaoList,
			ObjectMapper mapper) {
		BankPrioritySyncDto syncDto = new BankPrioritySyncDto();
		List<BankPriorityDao> srcBankPriority=syncDto.getBankPriorityDaoList(mapper.convertValue(data.getData(), new TypeReference<List<BankPrioritySyncDto>>() {
				}));
		Optional<BankPriorityDao> maxSrc=srcBankPriority.stream().max(Comparator.comparingLong(BankPriorityDao::getSyncTime));
		List<BankPriorityDao> destBankPriority = bnkPriorityRepository.findByLocationCode(srcBankPriority.get(0).getLocationCode());
		if(!destBankPriority.isEmpty()) {
			Optional<BankPriorityDao> maxDest=destBankPriority.stream().max(Comparator.comparingLong(BankPriorityDao::getSyncTime));
			if(maxDest.isPresent() && maxSrc.isPresent() && maxDest.get().getSyncTime() <= maxSrc.get().getSyncTime()) {
				bankPriorityDaoList.addAll(srcBankPriority);
			}
		}else {
			bankPriorityDaoList.addAll(srcBankPriority);
		}
	}
	
	@Transactional
	public Boolean dbOperation(List<BankPriorityDao> saveBankPriorityDaoList,
			List<BankPriorityDao> deleteBankPriorityDaoList) {
		Boolean flag = false;
		if (!deleteBankPriorityDaoList.isEmpty()) {
			bnkPriorityRepository.deleteAll(deleteBankPriorityDaoList);
			flag = true;
		}
		if (!saveBankPriorityDaoList.isEmpty()) {
			deleteBankPriorityDaoList=bnkPriorityRepository.findByLocationCode(saveBankPriorityDaoList.get(0).getLocationCode());
			bnkPriorityRepository.deleteAll(deleteBankPriorityDaoList);
			bnkPriorityRepository.flush();
			bnkPriorityRepository.saveAll(saveBankPriorityDaoList);
			flag = true;
		}
		return flag;
	}
}
