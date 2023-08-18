/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.inventory.service;

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
import com.titan.poss.datasync.constant.InventoryOperationCodes;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.inventory.dao.BinCodeLocationMappingDao;
import com.titan.poss.inventory.dto.BinCodeLocationMappingSyncDto;
import com.titan.poss.inventory.repository.BinCodeLocationRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class BinCodeLocationMappingSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private BinCodeLocationRepository binCodeLocationRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(BinCodeLocationMappingSyncService.class);
	private static final String EXCEPTION = "exception : ";
	
	@Override
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		for (SyncData syncData : syncDataList) {
			if (operationCode.equals(InventoryOperationCodes.BIN_LOCATION_MAPPING)) {
				ObjectMapper mapper = new ObjectMapper();
				BinCodeLocationMappingSyncDto binLocSyncDto = new BinCodeLocationMappingSyncDto();
				BinCodeLocationMappingDao srcBinLocDao = binLocSyncDto.getDao(
						mapper.convertValue(syncData.getData(), new TypeReference<BinCodeLocationMappingSyncDto>() {
						}));
				BinCodeLocationMappingDao destBinLoc = binCodeLocationRepository
						.findOneByBinIdAndLocationCode(srcBinLocDao.getBin().getId(), srcBinLocDao.getLocationCode());
				saveToDestinationDB(srcBinLocDao, syncData.getOrder(), destBinLoc);
			}
		}
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param srcBinLocDao
	 * @param order
	 * @param destBinLoc
	 */
	private void saveToDestinationDB(BinCodeLocationMappingDao srcBinLocDao, int order,
			BinCodeLocationMappingDao destBinLoc) {
		try {
			if (destBinLoc == null && order == 1)
				binCodeLocationRepository.save(srcBinLocDao);
			if (destBinLoc != null) {
				if (srcBinLocDao.getSyncTime() >= destBinLoc.getSyncTime()) {
					if (order == 1) {
						binCodeLocationRepository.delete(destBinLoc);
						binCodeLocationRepository.flush();
						binCodeLocationRepository.save(srcBinLocDao);
					} else if (order == 0) {
						binCodeLocationRepository.delete(destBinLoc);
					}
				} else {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				}
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

}
