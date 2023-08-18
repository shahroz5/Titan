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
import com.titan.poss.location.dao.PincodeDao;
import com.titan.poss.location.dto.PincodeSyncDto;
import com.titan.poss.location.repository.PincodeRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class PincodeSyncService implements SyncOperation {

	@Autowired
	private PincodeRepository pincodeRepository;

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(PincodeSyncService.class);
	private static final String EXCEPTION = "exception : ";
	
	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {

			ObjectMapper mapper = new ObjectMapper();
			PincodeSyncDto pincodeSyncDto = new PincodeSyncDto();
			PincodeDao sourcePincode = pincodeSyncDto.getPincodeDao(mapper.convertValue(data.getData(), new TypeReference<PincodeSyncDto>() {
			}));
			PincodeDao destinationPincode = pincodeRepository.findOneById(sourcePincode.getId());
			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(LocationOperationCodes.PINCODE_ADD)
					|| operationCode.equals(LocationOperationCodes.PINCODE_UPDATE)) {

				if (destinationPincode == null) {
					saveToDestinationDB(sourcePincode, messageId,messageTransfer.getMessageTransferData().getDestination());
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourcePincode, destinationPincode);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {

						datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), status.name());

					} else {

						saveToDestinationDB(sourcePincode, messageId,messageTransfer.getMessageTransferData().getDestination());
					}
				}

			}

		});
	}

	@Transactional
	public void saveToDestinationDB(PincodeDao sourcePincode, String messageId, String dest) {
		int tempSrcDataSyncId = sourcePincode.getSrcSyncId();
		sourcePincode.setSrcSyncId(sourcePincode.getDestSyncId());
		sourcePincode.setDestSyncId(tempSrcDataSyncId);
		try {
			pincodeRepository.save(sourcePincode);
			datasyncAuditService.updateDatasyncAuditStatusById(messageId,dest, DatasyncStatusEnum.SYNCED.name());
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest, DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest, DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	private DatasyncStatusEnum compareSyncIdVersions(PincodeDao src, PincodeDao dest) {

		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());

	}

}
