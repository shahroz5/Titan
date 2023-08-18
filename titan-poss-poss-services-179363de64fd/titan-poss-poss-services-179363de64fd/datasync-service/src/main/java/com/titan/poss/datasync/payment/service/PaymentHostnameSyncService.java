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

import com.fasterxml.jackson.core.type.TypeReference;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.PaymentOperationCodes;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.payment.dao.PaymentHostnameMappingDao;
import com.titan.poss.payment.dto.PaymentHostnameMappingSyncDto;
import com.titan.poss.payment.repository.PaymentHostnameMappingRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class PaymentHostnameSyncService implements SyncOperation {

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	PaymentHostnameMappingRepository paymentHostnameMappingRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(PaymentHostnameSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(PaymentOperationCodes.PAYMENT_HOSTNAME_MAPPING_ADD)) {
				List<PaymentHostnameMappingDao> srcPaymentHostnameList = getSourceList(data.getData());
				List<PaymentHostnameMappingDao> destPaymentHostnameList = getDestinationList(srcPaymentHostnameList);
				compareListsAndSave(srcPaymentHostnameList, destPaymentHostnameList, messageId,messageTransfer.getMessageTransferData().getDestination());
			}
		});

	}

	/**
	 * @param srcPaymentHostnameList
	 * @param destPaymentHostnameList
	 * @param messageId
	 * @param dest 
	 */
	private void compareListsAndSave(List<PaymentHostnameMappingDao> srcPaymentHostnameList,
			List<PaymentHostnameMappingDao> destPaymentHostnameList, String messageId, String dest) {
		List<PaymentHostnameMappingDao> newPaymentHostnameList = new ArrayList<>();
		for (PaymentHostnameMappingDao srcPaymentHostname : srcPaymentHostnameList) {
			boolean isNew = true;
			for (PaymentHostnameMappingDao destination : destPaymentHostnameList) {

				if (srcPaymentHostname.getLocationCode().equals(destination.getLocationCode())
						&& srcPaymentHostname.getHostName().equals(destination.getHostName())
						&& srcPaymentHostname.getPaymentCode().equals(destination.getPaymentCode())) {
					isNew = false;
					DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcPaymentHostname.getSrcSyncId(),
							srcPaymentHostname.getDestSyncId(), destination.getSrcSyncId(),
							destination.getDestSyncId());
					if (status.equals(DatasyncStatusEnum.SYNCED)) {
						int tempSrcDataSyncId = srcPaymentHostname.getSrcSyncId();
						srcPaymentHostname.setSrcSyncId(srcPaymentHostname.getDestSyncId());
						srcPaymentHostname.setDestSyncId(tempSrcDataSyncId);
						newPaymentHostnameList.add(srcPaymentHostname);
					} else {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					}
					break;
				}
			}
			if (isNew) {
				int tempSrcDataSyncId = srcPaymentHostname.getSrcSyncId();
				srcPaymentHostname.setSrcSyncId(srcPaymentHostname.getDestSyncId());
				srcPaymentHostname.setDestSyncId(tempSrcDataSyncId);
				newPaymentHostnameList.add(srcPaymentHostname);
			}
		}
		saveAllToDestinationDB(newPaymentHostnameList);
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,dest);
		DataSyncAuditDtoThreadLocal.unsetSyncData();

	}

	/**
	 * @param newPaymentHostnameList
	 */
	private void saveAllToDestinationDB(List<PaymentHostnameMappingDao> newPaymentHostnameList) {
		try {
			paymentHostnameMappingRepository.saveAll(newPaymentHostnameList);
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
	 * @param srcPaymentHostnameList
	 * @return List<PaymentHostnameMappingDao>
	 */
	private List<PaymentHostnameMappingDao> getDestinationList(List<PaymentHostnameMappingDao> srcPaymentHostnameList) {
		List<PaymentHostnameMappingDao> destList = new ArrayList<>();
		for (PaymentHostnameMappingDao src : srcPaymentHostnameList) {
			Optional<PaymentHostnameMappingDao> destDao = paymentHostnameMappingRepository
					.findByLocationCodeAndHostNameAndPaymentCode(src.getLocationCode(),
					src.getHostName(), src.getPaymentCode());
			if(destDao.isPresent()) {
				destList.add(destDao.get());
			}
		}
		return destList;
	}

	/**
	 * @param data
	 * @return List<PaymentHostnameMappingDao>
	 */
	private List<PaymentHostnameMappingDao> getSourceList(Object data) {
		PaymentHostnameMappingSyncDto syncDto = new PaymentHostnameMappingSyncDto();
		return syncDto.getDaoList(MapperUtil.getObjectMapperInstance().convertValue(
				data, new TypeReference<List<PaymentHostnameMappingSyncDto>>() {
				}));
	}

}
