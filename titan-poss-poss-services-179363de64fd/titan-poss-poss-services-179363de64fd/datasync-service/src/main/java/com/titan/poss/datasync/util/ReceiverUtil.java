/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.util;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
public class ReceiverUtil {

	private static final Logger LOGGER = LoggerFactory.getLogger(ReceiverUtil.class);
	private static final String MESSAGE = "Status =  {}  , sourceSrcSyncId =  {} , destDestSyncId =  {}";
	private static final String MESSAGE_CONFLICT = "Status =  {}  , sourceDestSyncId =  {} , destSrcSyncId =  {}";
	ReceiverUtil() {

	}

	public static DatasyncStatusEnum isSyncable(int sourceSrcSyncId, int sourceDestSyncId, int destSrcSyncId,
			int destDestSyncId) {
			
		DatasyncStatusEnum status;

		if ((sourceSrcSyncId > destDestSyncId) && (sourceDestSyncId == destSrcSyncId)) {
			status = DatasyncStatusEnum.SYNCED;
			LOGGER.debug(MESSAGE, status, sourceSrcSyncId, destDestSyncId);
		} else if ((sourceSrcSyncId <= destDestSyncId) && (sourceDestSyncId == destSrcSyncId)  ) {
			status = DatasyncStatusEnum.DISCARDED;
			LOGGER.debug(MESSAGE, status, sourceSrcSyncId, destDestSyncId);
		} else {
			status = DatasyncStatusEnum.FAILED_CONFLICT;
			LOGGER.debug(MESSAGE_CONFLICT, status, sourceDestSyncId, destSrcSyncId);
		}
		return status;
	}

	public static OperationCodesEnum getOperationCode(String operation) {

		return Enum.valueOf(OperationCodesEnum.class, operation.split("-")[0]);
	}

	public static List<SyncData> sortSyncData(List<SyncData> syncData) {
		Collections.sort(syncData);
		return syncData;
	}

	/**
	 * @param status
	 * @param exception
	 * @return DataSyncAuditDto
	 */
	public static void addToDataSyncAuditDto(String status, String exception) {
		DataSyncAuditDto dataSyncAuditDto = new DataSyncAuditDto();
		dataSyncAuditDto.setStatus(status);
		dataSyncAuditDto.setException(exception);
		if (DataSyncAuditDtoThreadLocal.getSyncData() == null) {
			List<DataSyncAuditDto> data = new ArrayList<>();
			data.add(dataSyncAuditDto);
			DataSyncAuditDtoThreadLocal.setIntialSyncData(data);
		} else {
			DataSyncAuditDtoThreadLocal.setSyncData(dataSyncAuditDto);
		}
	}
	
	

}
