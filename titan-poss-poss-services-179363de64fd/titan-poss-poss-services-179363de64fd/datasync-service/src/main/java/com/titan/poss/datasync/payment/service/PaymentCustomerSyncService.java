/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.payment.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.PaymentOperationCodes;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.payment.dao.PaymentCustomerMappingDao;
import com.titan.poss.payment.dto.PaymentCustomerMappingSyncDto;
import com.titan.poss.payment.repository.PaymentCustomerMappingRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class PaymentCustomerSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	PaymentCustomerMappingRepository paymentCustomerMappingRepository;

	@Autowired
	PaymentConfigLocationSyncService paymentLocationSyncService;

	private static final Logger LOGGER = LoggerFactory.getLogger(PaymentCustomerSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDatas = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		for (SyncData syncData : syncDatas) {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(PaymentOperationCodes.PAYMENT_CUSTOMER_MAPPING)) {
				List<PaymentCustomerMappingDao> paymentCustomerSrcList = getSourceList(syncData.getData());
				compareListsAndSave(paymentCustomerSrcList, syncData.getOrder());
			}
		}
		datasyncAuditService.updateStatus(DataSyncAuditDtoThreadLocal.getSyncData(), messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param paymentCustomerSrcList
	 * @param order
	 */
	private void compareListsAndSave(List<PaymentCustomerMappingDao> paymentCustomerSrcList, int order) {
		List<PaymentCustomerMappingDao> delPaymentCustList = new ArrayList<>();
		List<PaymentCustomerMappingDao> newPaymentCustList = new ArrayList<>();

		for (PaymentCustomerMappingDao srcPaymentCust : paymentCustomerSrcList) {
			PaymentCustomerMappingDao destination = paymentCustomerMappingRepository
					.findByConfigIdAndCustomerTypeAndTransactionDaoTransactionType(srcPaymentCust.getConfigId(),
							srcPaymentCust.getCustomerType(), srcPaymentCust.getTransactionDao().getTransactionType());
			if (destination != null) {
				if (srcPaymentCust.getSyncTime() >= destination.getSyncTime()) {
					if (order == 0) {
						delPaymentCustList.add(destination);
					} else if (order == 1) {
						delPaymentCustList.add(destination);
						newPaymentCustList.add(srcPaymentCust);
					}
				} else {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				}
			} else {
				newPaymentCustList.add(srcPaymentCust);
			}
		}
		saveAllToDestinationDB(newPaymentCustList, order, delPaymentCustList);
	}

	/**
	 * @param newPaymentCustList
	 * @param order
	 * @param delPaymentCustList
	 */
	private void saveAllToDestinationDB(List<PaymentCustomerMappingDao> newPaymentCustList, int order,
			List<PaymentCustomerMappingDao> delPaymentCustList) {
		try {
			if (order == 0)
				paymentCustomerMappingRepository.deleteAll(delPaymentCustList);
			else if (order == 1) {
				if (!delPaymentCustList.isEmpty()) {
					paymentCustomerMappingRepository.deleteAll(delPaymentCustList);
					paymentCustomerMappingRepository.flush();
				}
				paymentCustomerMappingRepository.saveAll(newPaymentCustList);
			}
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}

	}

	/**
	 * @param data
	 * @return List<PaymentCustomerMappingDao>
	 */
	private List<PaymentCustomerMappingDao> getSourceList(Object data) {
		PaymentCustomerMappingSyncDto syncDto = new PaymentCustomerMappingSyncDto();
		ObjectMapper mapper = new ObjectMapper();
		return syncDto.getPaymentCustomerMappingDaoList(
				mapper.convertValue(data, new TypeReference<List<PaymentCustomerMappingSyncDto>>() {
				}));
	}

}
