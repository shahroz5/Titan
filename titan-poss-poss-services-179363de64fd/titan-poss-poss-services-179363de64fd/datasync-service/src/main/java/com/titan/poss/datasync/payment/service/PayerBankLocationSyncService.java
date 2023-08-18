package com.titan.poss.datasync.payment.service;

import java.util.ArrayList;
import java.util.List;

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
import com.titan.poss.payment.dao.PayerLocationMappingDao;
import com.titan.poss.payment.dto.PayerLocationMappingSyncDto;
import com.titan.poss.payment.repository.PayerLocationMappingRepository;

@Service
public class PayerBankLocationSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private PayerLocationMappingRepository payerLocationRepository;

	@Autowired
	private PayerBankLocationSyncService payerBnkLocationSyncService;

	private static final Logger LOGGER = LoggerFactory.getLogger(PayerBankLocationSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> payerBankLocSyncData = ReceiverUtil
				.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		try {
			Boolean flag=payerBankLocsyncService(payerBankLocSyncData, messageId,messageTransfer.getMessageTransferData().getDestination());
			if (Boolean.TRUE.equals(flag)) {
				datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.SYNCED.name());
			} else {
				datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.DISCARDED.name());
			}
		}catch (DataIntegrityViolationException ex) {
					LOGGER.error(EXCEPTION, ex);
					datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,messageTransfer.getMessageTransferData().getDestination(),
							DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
				} catch (Exception ex) {
					LOGGER.error(EXCEPTION, ex);
					datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,messageTransfer.getMessageTransferData().getDestination(),
							DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
				}
	}

	public Boolean payerBankLocsyncService(List<SyncData> payerBankLocSyncData, String messageId, String dest) {
		List<PayerLocationMappingDao> savePayerBankList = new ArrayList<>();
		List<PayerLocationMappingDao> removePayerBankList = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		for (SyncData data : payerBankLocSyncData) {
			if (data.getOrder() == 0) {
				 syncPaymentData(data,removePayerBankList, mapper);
			} else if (data.getOrder() == 1) {
				 syncPaymentData(data,savePayerBankList, mapper);
			}
		}
		return payerBnkLocationSyncService.dbOperation(savePayerBankList, removePayerBankList, messageId,dest);
	}

	private void syncPaymentData(SyncData data, List<PayerLocationMappingDao> removePayerBankList,
			ObjectMapper mapper) {
		PayerLocationMappingSyncDto payerLocationMappingSyncDto = new PayerLocationMappingSyncDto();
		PayerLocationMappingDao srcPayerBank = payerLocationMappingSyncDto.getPayerLocationMappingDao(
				mapper.convertValue(data.getData(), new TypeReference<PayerLocationMappingSyncDto>() {
				}));
		PayerLocationMappingDao destPayerBankLocation = payerLocationRepository
				.findByPayerBankConfigIdAndLocationCodeAndPaymentPaymentCode(srcPayerBank.getPayerBankConfig().getId(),
						srcPayerBank.getLocationCode(), srcPayerBank.getPayment().getPaymentCode());
		if(destPayerBankLocation != null){
			if (srcPayerBank.getSyncTime() >= destPayerBankLocation.getSyncTime()) {
				removePayerBankList.add(srcPayerBank);
			}
		}else {
			removePayerBankList.add(srcPayerBank);
		}
	}

	@Transactional
	public Boolean dbOperation(List<PayerLocationMappingDao> savePayerBankList,
			List<PayerLocationMappingDao> removePayerBankList, String messageId, String dest) {
		Boolean flag=false;
		if (!removePayerBankList.isEmpty()) {
			payerLocationRepository.deleteAll(removePayerBankList);
			payerLocationRepository.flush();
			flag=true;
		}
		if (!savePayerBankList.isEmpty()) {
			payerLocationRepository.saveAll(savePayerBankList);
			flag=true;
		}
		return flag;
	}
}
