/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.payment.service;

import java.util.ArrayList;
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
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.sales.service.PIFSeriesSyncService;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.payment.dao.PayeeBankLocationMappingDao;
import com.titan.poss.payment.dto.PayeeBankLocationSyncDto;
import com.titan.poss.payment.repository.PayeeBankLocationMappingRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class PayeeBankLocationSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private PIFSeriesSyncService pifSyncService;

	@Autowired
	private PayeeBankLocationMappingRepository payeeBankLocRepository;

	@Autowired
	PayeeBankLocationSyncService payBankLocationSyncService;

	private static final Logger LOGGER = LoggerFactory.getLogger(PayeeBankLocationSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		try {
			Boolean flag=syncService(syncDataList, messageId);
			if (Boolean.TRUE.equals(flag)) {
				datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.SYNCED.name());
			} else {
				datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.DISCARDED.name());
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

	public Boolean syncService(List<SyncData> syncDataList, String messageId) {
		List<PayeeBankLocationMappingDao> savePayeeBank = new ArrayList<>();
		List<PayeeBankLocationMappingDao> deletePayeeBank = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		for (SyncData data : syncDataList) {
			if (data.getOrder() == 0) {
				 syncPayeeData(data,deletePayeeBank, mapper);
			} else if (data.getOrder() == 1) {
				 syncPayeeData(data,savePayeeBank, mapper);
			}
		}
		return payBankLocationSyncService.dbOperation(savePayeeBank, deletePayeeBank, messageId);
	}
	private void syncPayeeData(SyncData data, List<PayeeBankLocationMappingDao> payeeBank, ObjectMapper mapper) {
		PayeeBankLocationSyncDto syncDto = new PayeeBankLocationSyncDto();
		PayeeBankLocationMappingDao srcPayeeBankLoc = syncDto.getPayeeBankLocation(
				mapper.convertValue(data.getData(), new TypeReference<PayeeBankLocationSyncDto>() {
				}));
		Optional<PayeeBankLocationMappingDao> destPayeeBankLoc = payeeBankLocRepository
				.findById(srcPayeeBankLoc.getId());
		if(destPayeeBankLoc.isPresent()) {
			if (srcPayeeBankLoc.getSyncTime() >= destPayeeBankLoc.get().getSyncTime()) {
				payeeBank.add(srcPayeeBankLoc);
			} 
		}else {
			payeeBank.add(srcPayeeBankLoc);
		}
		
	}

	@Transactional
	public Boolean dbOperation(List<PayeeBankLocationMappingDao> savePayeeBank,
			List<PayeeBankLocationMappingDao> deletePayeeBank, String messageId) {
		Boolean flag = false;
		if (!deletePayeeBank.isEmpty()) {
			payeeBankLocRepository.deleteAll(deletePayeeBank);
			payeeBankLocRepository.flush();
			flag = true;
		}
		if (!savePayeeBank.isEmpty()) {
			savePayeeBank=payeeBankLocRepository.saveAll(savePayeeBank);
			flag = true;
		}
		pifSyncService.updatePifSeriesMaster(deletePayeeBank, savePayeeBank);
		return flag;
	}

}