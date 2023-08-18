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
import com.titan.poss.location.dao.StateDao;
import com.titan.poss.location.dto.StateSyncDto;
import com.titan.poss.location.repository.StateRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class StateSyncService implements SyncOperation {

	@Autowired
	private StateRepository stateRepository;

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(StateSyncService.class);
	private static final String EXCEPTION = "exception : ";
	
	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			ObjectMapper mapper = new ObjectMapper();
			StateSyncDto stateSyncDto = new StateSyncDto();
			StateDao sourceState = stateSyncDto
					.getStateNewDao(mapper.convertValue(data.getData(), new TypeReference<StateSyncDto>() {
					}));
		
			StateDao destinationState = stateRepository.findOneByStateId(sourceState.getStateId());

			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(LocationOperationCodes.STATE_ADD)
					|| operationCode.equals(LocationOperationCodes.STATE_UPDATE)) {

				if (destinationState == null) {
					saveToDestinationDB(sourceState, messageId,messageTransfer.getMessageTransferData().getDestination());
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourceState, destinationState);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {
						datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), status.name());
					} else {
						saveToDestinationDB(sourceState, messageId,messageTransfer.getMessageTransferData().getDestination());
					}
				}

			}

		});
	}

	@Transactional
	public void saveToDestinationDB(StateDao sourceState, String messageId, String dest) {
		int tempSrcDataSyncId = sourceState.getSrcSyncId();
		sourceState.setSrcSyncId(sourceState.getDestSyncId());
		sourceState.setDestSyncId(tempSrcDataSyncId);
		try {
			stateRepository.save(sourceState);
			datasyncAuditService.updateDatasyncAuditStatusById(messageId,dest, DatasyncStatusEnum.SYNCED.name());
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest, DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest, DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	private DatasyncStatusEnum compareSyncIdVersions(StateDao src, StateDao dest) {

		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());

	}

}
