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
import com.titan.poss.payment.dao.CashbackProductMappingDao;
import com.titan.poss.payment.dto.CashbackProductMappingSyncDto;
import com.titan.poss.payment.repository.CashbackProductMappingRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class CashbackProductSyncService implements SyncOperation {

	@Autowired
	private CashbackProductMappingRepository cashbackProductMappingRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(CashbackProductSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDatas = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		for (SyncData syncData : syncDatas) {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(PaymentOperationCodes.CASHBACK_PRODUCT)) {
				List<CashbackProductMappingDao> srcCashBackPrdList = getSourceList(syncData.getData());
				compareListsAndSave(srcCashBackPrdList, syncData.getOrder());
			}
		}
		datasyncAuditService.updateStatus(DataSyncAuditDtoThreadLocal.getSyncData(), messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param srcCachBackPrdList
	 * @param order
	 */
	private void compareListsAndSave(List<CashbackProductMappingDao> srcCashBackPrdList, int order) {
		List<CashbackProductMappingDao> cashBackPrdSaveList = new ArrayList<>();
		List<CashbackProductMappingDao> cashBackPrdDelList = new ArrayList<>();
		for (CashbackProductMappingDao srcashBackPrd : srcCashBackPrdList) {
			CashbackProductMappingDao destination = cashbackProductMappingRepository
					.getByCashBackIdAndProductGroup(srcashBackPrd.getCashbackDao().getId(),
							srcashBackPrd.getProductGroupCode());
			if (destination != null) {
				if (srcashBackPrd.getSyncTime() >= destination.getSyncTime()) {
					if (order == 0)
						cashBackPrdDelList.add(destination);
					else if (order == 1) {
						cashBackPrdDelList.add(destination);
						cashBackPrdSaveList.add(srcashBackPrd);
					}
				} else {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				}
			} else {
				cashBackPrdSaveList.add(srcashBackPrd);
			}
		}
		saveToDestinationDB(cashBackPrdSaveList, cashBackPrdDelList, order);
	}

	/**
	 * @param cashBackPrdSaveList
	 * @param cashBackPrdDelList
	 * @param order
	 */
	private void saveToDestinationDB(List<CashbackProductMappingDao> cashBackPrdSaveList,
			List<CashbackProductMappingDao> cashBackPrdDelList, int order) {
		try {
			if (order == 0)
				cashbackProductMappingRepository.deleteAll(cashBackPrdDelList);
			else if (order == 1) {
				if (!cashBackPrdDelList.isEmpty()) {
					cashbackProductMappingRepository.deleteAll(cashBackPrdDelList);
					cashbackProductMappingRepository.flush();
				}
				cashbackProductMappingRepository.saveAll(cashBackPrdSaveList);
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
	 * @return List<CashbackProductMappingDao>
	 */
	private List<CashbackProductMappingDao> getSourceList(Object data) {
		ObjectMapper mapper = new ObjectMapper();
		List<CashbackProductMappingSyncDto> syncDtoList = mapper.convertValue(data,
				new TypeReference<List<CashbackProductMappingSyncDto>>() {
				});
		List<CashbackProductMappingDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDt -> {
			CashbackProductMappingSyncDto dto = new CashbackProductMappingSyncDto();
			daoList.add(dto.getCashbackProductMappingDao(syncDt));
		});
		return daoList;
	}

}
