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
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.PaymentOperationCodes;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.payment.dao.PaymentProductDao;
import com.titan.poss.payment.dto.PaymentProductSyncDto;
import com.titan.poss.payment.repository.PaymentProductMappingRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class PaymentProductSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private PaymentProductMappingRepository paymentProductMappingRepository;

	@Autowired
	private PaymentProductSyncService paymntProductSyncService;

	private static final Logger LOGGER = LoggerFactory.getLogger(PaymentProductSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> paymntProdSyncDataList = ReceiverUtil
				.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		try {
			if (operationCode.equals(PaymentOperationCodes.PAYMENT_CATEGORY_PRODUCT)) {
				paymntProdSyncService(paymntProdSyncDataList, messageId);
			}
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	public void paymntProdSyncService(List<SyncData> paymntProdSyncDataList, String messageId) {
		List<PaymentProductDao> savePaymentList = new ArrayList<>();
		List<PaymentProductDao> deletePaymentList = new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		for (SyncData data : paymntProdSyncDataList) {
			PaymentProductSyncDto syncDto = new PaymentProductSyncDto();
			List<PaymentProductDao> srcProductList = syncDto
					.getDaoList(mapper.convertValue(data.getData(), new TypeReference<List<PaymentProductSyncDto>>() {
					}));
			syncDataList(srcProductList, savePaymentList, deletePaymentList, data.getOrder());
		}
		paymntProductSyncService.dbOperation(deletePaymentList, savePaymentList, messageId);
	}

	public void syncDataList(List<PaymentProductDao> srcProductList, List<PaymentProductDao> savePaymentList,
			List<PaymentProductDao> deletePaymentList, int order) {
		srcProductList.forEach(sourcePayment -> {
			PaymentProductDao destPayment = paymentProductMappingRepository
					.findByPaymentCategoryDaoPaymentCategoryNameAndProductGroupCode(
							sourcePayment.getPaymentCategoryDao().getPaymentCategoryName(),
							sourcePayment.getProductGroupCode());
			if (destPayment == null && order == 1) {
				savePaymentList.add(sourcePayment);
			}
			if (destPayment != null) {
				if (destPayment.getSyncTime() <= sourcePayment.getSyncTime()) {
					if (order == 1) {
						savePaymentList.add(sourcePayment);
					} else if (order == 0) {
						deletePaymentList.add(destPayment);
					}
				} else {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				}
			}
		});
	}

	@Transactional
	public void dbOperation(List<PaymentProductDao> deletePaymentList, List<PaymentProductDao> savePaymentList,
			String messageId) {
		boolean flag = false;
		if (!deletePaymentList.isEmpty()) {
			paymentProductMappingRepository.deleteAll(deletePaymentList);
			paymentProductMappingRepository.flush();
			flag = true;
		}
		if (!savePaymentList.isEmpty()) {
			paymentProductMappingRepository.saveAll(savePaymentList);
			flag = true;
		}
		if (flag) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} else {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
		}
	}
}
