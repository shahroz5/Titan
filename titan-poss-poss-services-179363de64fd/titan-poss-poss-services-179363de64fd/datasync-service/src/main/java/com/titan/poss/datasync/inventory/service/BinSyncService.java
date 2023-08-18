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
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.inventory.dao.BinDao;
import com.titan.poss.inventory.dto.BinSyncDto;
import com.titan.poss.inventory.repository.BinRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class BinSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;
	
	@Autowired
	private BinRepository binRepository;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(BinSyncService.class);
	private static final String EXCEPTION = "exception : ";
	
	@Override
	public void operation(MessageTransfer messageTransfer) {
		
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		
		for(SyncData syncData : syncDataList ) {
			ObjectMapper mapper = new ObjectMapper();
			BinSyncDto binSyncDto = new BinSyncDto();
			List<BinDao> sourceBinList = binSyncDto.getDaoList(mapper.convertValue(syncData.getData(), new TypeReference<List<BinSyncDto>>() {}));
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			
			if(operationCode.equals(InventoryOperationCodes.BIN_ADD) || operationCode.equals(InventoryOperationCodes.BIN_UPDATE)) {
				for(BinDao sourceBin : sourceBinList) {
					BinDao destinationBin = binRepository.findOneByBinGroupAndBinCode(sourceBin.getBinGroup(), sourceBin.getBinCode());
					if (destinationBin == null) {
						saveToDestinationDB(sourceBin, messageId,messageTransfer.getMessageTransferData().getDestination());

					} else {
						compareSyncIdVersions(sourceBin, destinationBin, messageId,messageTransfer.getMessageTransferData().getDestination());
					}
				}
				
			}
		}
	}
	/**
	 * @param sourceBin
	 * @param destinationBin
	 * @param messageId
	 * @param destination 
	 */
	private void compareSyncIdVersions(BinDao src, BinDao dest, String messageId, String destination) {
		
		DatasyncStatusEnum status = ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(),
				dest.getSrcSyncId(), dest.getDestSyncId());

		if (!status.equals(DatasyncStatusEnum.SYNCED)) {
			datasyncAuditService.updateDatasyncAuditStatusById(messageId, destination,status.name());
		} else {
			saveToDestinationDB(src,destination, messageId);
		}
	}
	/**
	 * @param sourceBin
	 * @param messageId
	 * @param dest 
	 */
	private void saveToDestinationDB(BinDao sourceBin, String messageId, String dest) {
		
		int tempSrcDataSyncId = sourceBin.getSrcSyncId();
		sourceBin.setSrcSyncId(sourceBin.getDestSyncId());
		sourceBin.setDestSyncId(tempSrcDataSyncId);
		try {
			binRepository.save(sourceBin);
			datasyncAuditService.updateDatasyncAuditStatusById(messageId,dest, DatasyncStatusEnum.SYNCED.name());
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest, DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest, DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
		
	}

}
