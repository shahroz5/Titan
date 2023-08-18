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
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.PaymentOperationCodes;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.payment.dao.CashbackOfferDetailsDao;
import com.titan.poss.payment.dto.CashbackOfferDetailsSyncDto;
import com.titan.poss.payment.repository.CashbackOfferDetailsRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class CashBackOfferDetailsSyncService implements SyncOperation {

	@Autowired
	private CashbackOfferDetailsRepository cashbackOfferDetailsRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(CashBackOfferDetailsSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDatas = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		for (SyncData syncData : syncDatas) {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(PaymentOperationCodes.CASHBACK_OFFER_DETAILS_UPDATE)) {
				List<CashbackOfferDetailsDao> sourceList = getSourceList(syncData.getData());
				compareListsAndSave(sourceList, syncData.getOrder());
			}
		}
		datasyncAuditService.updateStatus(DataSyncAuditDtoThreadLocal.getSyncData(), messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param sourceList
	 * @param order
	 */
	private void compareListsAndSave(List<CashbackOfferDetailsDao> srcCbOfferList, int order) {
		List<CashbackOfferDetailsDao> cbOfferSaveList = new ArrayList<>();
		List<CashbackOfferDetailsDao> cbOfferDeleteList = new ArrayList<>();
		for (CashbackOfferDetailsDao srcCbOffer : srcCbOfferList) {
			Optional<CashbackOfferDetailsDao> destination = cashbackOfferDetailsRepository.findById(srcCbOffer.getId());
			if (destination.isPresent()) {
				if (srcCbOffer.getSyncTime() >= destination.get().getSyncTime()) {
					if (order == 0)
						cbOfferDeleteList.add(destination.get());
					else if (order == 1) {
						cbOfferDeleteList.add(destination.get());
						cbOfferSaveList.add(srcCbOffer);
					}
				} else {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				}
			} else {
				cbOfferSaveList.add(srcCbOffer);
			}
		}
		saveToDestinationDB(cbOfferSaveList, cbOfferDeleteList, order);
	}

	/**
	 * @param cboOfferSaveList
	 * @param cboOfferDeleteList
	 * @param order
	 */
	private void saveToDestinationDB(List<CashbackOfferDetailsDao> cboOfferSaveList,
			List<CashbackOfferDetailsDao> cboOfferDeleteList, int order) {
		try {
			if (order == 0)
				cashbackOfferDetailsRepository.deleteAll(cboOfferDeleteList);
			else if (order == 1) {
				if (!cboOfferDeleteList.isEmpty()) {
					cashbackOfferDetailsRepository.deleteAll(cboOfferDeleteList);
					cashbackOfferDetailsRepository.flush();
				}
				cashbackOfferDetailsRepository.saveAll(cboOfferSaveList);
			}
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
			LOGGER.error(EXCEPTION, ex);
		} catch (Exception ex) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
			LOGGER.error(EXCEPTION, ex);
		}
	}

	/**
	 * @param data
	 * @return List<CashbackOfferDetailsDao>
	 */
	private List<CashbackOfferDetailsDao> getSourceList(Object data) {

		ObjectMapper mapper = new ObjectMapper();
		List<CashbackOfferDetailsSyncDto> syncDtoList = mapper.convertValue(data,
				new TypeReference<List<CashbackOfferDetailsSyncDto>>() {
				});
		List<CashbackOfferDetailsDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDt -> {
			CashbackOfferDetailsSyncDto dto = new CashbackOfferDetailsSyncDto();
			daoList.add(dto.getCashbackOfferDao(syncDt));
		});
		return daoList;

	}

}
