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
import com.titan.poss.inventory.dao.BinGroupDao;
import com.titan.poss.inventory.dto.BinGroupSyncDto;
import com.titan.poss.inventory.repository.BinGroupRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class BinGroupSyncService implements SyncOperation {
	
	@Autowired
	private DatasyncAuditService datasyncAuditService;
	
	@Autowired
	private BinGroupRepository binGroupRepository;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(BinGroupSyncService.class);
	private static final String EXCEPTION = "exception : ";
	
	@Override
	public void operation(MessageTransfer messageTransfer) {
		
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		
		for(SyncData syncData : syncDataList ) {
			ObjectMapper mapper = new ObjectMapper();
			BinGroupSyncDto binGroupSyncDto = new BinGroupSyncDto();
			BinGroupDao sourceBinGroup = binGroupSyncDto.getBingGroupDao(mapper.convertValue(syncData.getData(), new TypeReference<BinGroupSyncDto>() {}));
			BinGroupDao destinationBinGroup = binGroupRepository.findOneByBinGroupCode(sourceBinGroup.getBinGroupCode());
			
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			
			if(operationCode.equals(InventoryOperationCodes.BINGROUP_ADD) || operationCode.equals(InventoryOperationCodes.BINGROUP_UPDATE)) {
				if (destinationBinGroup == null) {
					saveToDestinationDB(sourceBinGroup, messageId,messageTransfer.getMessageTransferData().getDestination());

				} else {
					compareSyncIdVersions(sourceBinGroup, destinationBinGroup, messageId,messageTransfer.getMessageTransferData().getDestination());
				}
			}
		}
	}
	/**
	 * @param sourceBinGroup
	 * @param destinationBinGroup
	 * @param messageId
	 * @param dest 
	 */
	private void compareSyncIdVersions(BinGroupDao src, BinGroupDao dest, String messageId, String destination) {
		
		DatasyncStatusEnum status = ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(),
				dest.getSrcSyncId(), dest.getDestSyncId());

		if (!status.equals(DatasyncStatusEnum.SYNCED)) {
			datasyncAuditService.updateDatasyncAuditStatusById(messageId,destination, status.name());
		} else {
			saveToDestinationDB(src, messageId,destination);
		}
	}
	/**
	 * @param sourceBinGroup
	 * @param messageId
	 * @param dest 
	 */
	private void saveToDestinationDB(BinGroupDao sourceBinGroup, String messageId, String dest) {
		int tempSrcDataSyncId = sourceBinGroup.getSrcSyncId();
		sourceBinGroup.setSrcSyncId(sourceBinGroup.getDestSyncId());
		sourceBinGroup.setDestSyncId(tempSrcDataSyncId);
		try {
			binGroupRepository.save(sourceBinGroup);
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
