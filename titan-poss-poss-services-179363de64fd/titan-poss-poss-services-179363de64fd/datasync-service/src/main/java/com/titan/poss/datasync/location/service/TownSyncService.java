/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.location.service;

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
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.location.dao.TownDao;
import com.titan.poss.location.dto.TownSyncDto;
import com.titan.poss.location.repository.TownRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class TownSyncService implements SyncOperation {
	
	@Autowired 
	private TownRepository townRepository;

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(TownSyncService.class);
	private static final String EXCEPTION = "exception : ";
	
	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			
			ObjectMapper mapper = new ObjectMapper();
			TownSyncDto townSyncDto = new TownSyncDto();
			TownDao sourceTown = townSyncDto
					.getTownDao(mapper.convertValue(data.getData(), new TypeReference<TownSyncDto>() {
					}));
			TownDao destinationTown = townRepository.findOneByTownId(sourceTown.getTownId());
			
			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(LocationOperationCodes.TOWN_ADD) || operationCode.equals(LocationOperationCodes.TOWN_UPDATE)) {

				if (destinationTown == null) {
					saveToDestinationDB(sourceTown, messageId,messageTransfer.getMessageTransferData().getDestination());
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourceTown, destinationTown);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {

						datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), status.name());

					} else {

						saveToDestinationDB(sourceTown, messageId,messageTransfer.getMessageTransferData().getDestination());
					}
				}

			}
			
		});
	}

	@Transactional
	public void saveToDestinationDB(TownDao sourceTown, String messageId, String dest) {
		int tempSrcDataSyncId = sourceTown.getSrcSyncId();
		sourceTown.setSrcSyncId(sourceTown.getDestSyncId());
		sourceTown.setDestSyncId(tempSrcDataSyncId);
		try {
			townRepository.save(sourceTown);
			datasyncAuditService.updateDatasyncAuditStatusById(messageId,dest, DatasyncStatusEnum.SYNCED.name());
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest, DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest, DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	private DatasyncStatusEnum compareSyncIdVersions(TownDao src, TownDao dest) {
		
		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());

	}
	
}
