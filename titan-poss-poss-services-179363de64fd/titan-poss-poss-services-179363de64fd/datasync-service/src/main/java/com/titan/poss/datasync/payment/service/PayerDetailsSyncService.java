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
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.payment.dao.PayerDetailsDao;
import com.titan.poss.payment.dto.PayerDetailsSyncDto;
import com.titan.poss.payment.repository.PayerDetailsRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class PayerDetailsSyncService implements SyncOperation {

	@Autowired
	private PayerDetailsRepository payerDetailsRepo;

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private PayerDetailsSyncService payerDetailsSynService;

	private static final Logger LOGGER = LoggerFactory.getLogger(PayerDetailsSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		try {
			boolean flag = syncPayerDetails(syncData);
			if (flag) {
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

	public boolean syncPayerDetails(List<SyncData> syncData) {
		ObjectMapper mapper = new ObjectMapper();
		List<PayerDetailsDao> removePayerDetails = new ArrayList<>();
		List<PayerDetailsDao> savePayerDetails = new ArrayList<>();
		for (SyncData data : syncData) {
			syncPayer(data, removePayerDetails, savePayerDetails, mapper);
		}
		return payerDetailsSynService.dbOperation(removePayerDetails, savePayerDetails);
	}

	public void syncPayer(SyncData data, List<PayerDetailsDao> removePayerDetails,
			List<PayerDetailsDao> savePayerDetails, ObjectMapper mapper) {
		PayerDetailsSyncDto syncDto = new PayerDetailsSyncDto();
		List<PayerDetailsDao> srcPayerList = syncDto.getPayerDetailsList(
				mapper.convertValue(data.getData(), new TypeReference<List<PayerDetailsSyncDto>>() {
				}));
		srcPayerList.forEach(srcPayer -> {
			Optional<PayerDetailsDao> destPayer = payerDetailsRepo.findOneByPayerBankConfigIdAndPayerBankBankName(srcPayer.getPayerBankConfig().getId(),srcPayer.getPayerBank().getBankName());
			if (!destPayer.isPresent()) {
				if (data.getOrder() == 1) {
					int tempSrcDataSyncId = srcPayer.getSrcSyncId();
					srcPayer.setSrcSyncId(srcPayer.getDestSyncId());
					srcPayer.setDestSyncId(tempSrcDataSyncId);
					savePayerDetails.add(srcPayer);
				}
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcPayer.getSrcSyncId(), srcPayer.getDestSyncId(),
						destPayer.get().getSrcSyncId(), destPayer.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					if (data.getOrder() == 1) {
						int tempSrcDataSyncId = srcPayer.getSrcSyncId();
						srcPayer.setSrcSyncId(srcPayer.getDestSyncId());
						srcPayer.setDestSyncId(tempSrcDataSyncId);
						savePayerDetails.add(srcPayer);
					} else {
						removePayerDetails.add(destPayer.get());
					}
				}
			}
		});
	}

	@Transactional
	public boolean dbOperation(List<PayerDetailsDao> removePayerDetails, List<PayerDetailsDao> savePayerDetails) {
		boolean flag = false;
		if (!removePayerDetails.isEmpty()) {
			payerDetailsRepo.deleteAll(removePayerDetails);
			flag = true;
		}
		if (!savePayerDetails.isEmpty()) {
			payerDetailsRepo.saveAll(savePayerDetails);
			flag = true;
		}
		return flag;
	}

}
