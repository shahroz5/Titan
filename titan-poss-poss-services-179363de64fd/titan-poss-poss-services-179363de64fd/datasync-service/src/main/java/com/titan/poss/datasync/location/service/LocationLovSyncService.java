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

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.location.dao.LocationLovDao;
import com.titan.poss.location.dto.LocationLovSyncDto;
import com.titan.poss.location.repository.LovRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class LocationLovSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private LovRepository lovRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(LocationLovSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();

		for (SyncData syncData : syncDataList) {
			ObjectMapper mapper = new ObjectMapper();
			LocationLovSyncDto locLovSyncDto = new LocationLovSyncDto();
			List<LocationLovDao> srcLocLovList = locLovSyncDto
					.getDaoList(mapper.convertValue(syncData.getData(), new TypeReference<List<LocationLovSyncDto>>() {
					}));
			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(LocationOperationCodes.LOCATION_LOV_ADD)
					|| operationCode.equals(LocationOperationCodes.LOCATION_LOV_UPDATE)) {
				for (LocationLovDao sourceLov : srcLocLovList) {
					LocationLovDao destinationLocLov = lovRepository.findOneByLovTypeAndCode(sourceLov.getLovType(),
							sourceLov.getCode());
					if (destinationLocLov == null) {
						saveToDestinationDB(sourceLov);

					} else {
						compareSyncIdVersions(sourceLov, destinationLocLov);
					}
				}

				List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
				datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
				DataSyncAuditDtoThreadLocal.unsetSyncData();

			}
		}
	}

	/**
	 * @param sourceLov
	 * @param destinationLov
	 */
	private void compareSyncIdVersions(LocationLovDao src, LocationLovDao dest) {
		DatasyncStatusEnum status = ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(),
				dest.getSrcSyncId(), dest.getDestSyncId());

		if (!status.equals(DatasyncStatusEnum.SYNCED)) {
			ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
		} else {
			saveToDestinationDB(src);
		}
	}

	/**
	 * @param  
	 * @param sourceLov
	 */
	private void saveToDestinationDB(LocationLovDao sourceLocLov) {
		int tempSrcDataSyncId = sourceLocLov.getSrcSyncId();
		sourceLocLov.setSrcSyncId(sourceLocLov.getDestSyncId());
		sourceLocLov.setDestSyncId(tempSrcDataSyncId);
		try {
			lovRepository.save(sourceLocLov);
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
