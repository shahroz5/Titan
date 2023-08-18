/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.store.service;

import java.util.List;
import java.util.Optional;

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
import com.titan.poss.datasync.constant.StoreOperationCode;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.store.dao.CatchmentDao;
import com.titan.poss.store.dto.CatchmentSyncDto;
import com.titan.poss.store.repository.CatchmentRepository;
/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class CatchmentSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private CatchmentRepository catchmentRepository;

	@Autowired
	private CatchmentSyncService cathmentSyncService;

	private static final Logger LOGGER = LoggerFactory.getLogger(CatchmentSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		syncData.forEach(data -> {
			if (operationCode.equals(StoreOperationCode.CATCHMENT_ADD)
					|| operationCode.equals(StoreOperationCode.CATCHMENT_UPDATE)) {
				cathmentSyncService.syncCatchment(data, messageId,messageTransfer.getMessageTransferData().getDestination());
			}
		});
		
	}

	public void syncCatchment(SyncData data, String messageId, String destination) {
		ObjectMapper mapper = new ObjectMapper();
		CatchmentSyncDto syncDto = new CatchmentSyncDto();
		CatchmentDao srcCatchment = syncDto
				.getCatchmentDao(mapper.convertValue(data.getData(), new TypeReference<CatchmentSyncDto>() {
				}));
		Optional<CatchmentDao> destCatchment = catchmentRepository
				.findByCatchmentIdCatchmentCodeAndCatchmentIdLocationCode(
						srcCatchment.getCatchmentId().getCatchmentCode(),
						srcCatchment.getCatchmentId().getLocationCode());
		if (!destCatchment.isPresent()) {
			cathmentSyncService.saveCatchment(srcCatchment,messageId,destination);
		}
		destCatchment.ifPresent(dest -> {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcCatchment.getSrcSyncId(),
					srcCatchment.getDestSyncId(), dest.getSrcSyncId(), dest.getDestSyncId());
			if (!status.equals(DatasyncStatusEnum.SYNCED)) {
				datasyncAuditService.updateDatasyncAuditStatusById(messageId,destination, status.name());
			} else {
				cathmentSyncService.saveCatchment(srcCatchment,messageId,destination);
			}
		});
	}
	@Transactional
	public void saveCatchment(CatchmentDao srcCatchment, String messageId, String destination) {
		int tempSrcDataSyncId = srcCatchment.getSrcSyncId();
		srcCatchment.setSrcSyncId(srcCatchment.getDestSyncId());
		srcCatchment.setDestSyncId(tempSrcDataSyncId);
		try {
			catchmentRepository.save(srcCatchment);
			datasyncAuditService.updateDatasyncAuditStatusById(messageId,destination, DatasyncStatusEnum.SYNCED.name());
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

}
