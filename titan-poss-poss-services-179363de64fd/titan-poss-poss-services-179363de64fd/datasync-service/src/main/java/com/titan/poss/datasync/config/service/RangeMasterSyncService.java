/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.config.service;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.config.dao.RangeMasterDao;
import com.titan.poss.config.dto.RangeMasterSyncDto;
import com.titan.poss.config.repository.RangeMasterRepository;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.ConfigServiceOperationCodes;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class RangeMasterSyncService implements SyncOperation {

	@Autowired
	RangeMasterRepository rangeMasterRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(RangeMasterSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDatas = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		for (SyncData syncData : syncDatas) {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(ConfigServiceOperationCodes.RANGE_ADD)) {

				ObjectMapper mapper = new ObjectMapper();
				RangeMasterSyncDto rangeSyncDto = new RangeMasterSyncDto();
				List<RangeMasterDao> srcRangeList = rangeSyncDto.getRangeMasterDaoList(
						mapper.convertValue(syncData.getData(), new TypeReference<List<RangeMasterSyncDto>>() {
						}));
				List<String> ids = new ArrayList<>();
				srcRangeList.forEach(srcRange -> ids.add(srcRange.getId()));
				List<RangeMasterDao> destRangeList = rangeMasterRepository.findAllById(ids);
				compareListsAndSave(srcRangeList, destRangeList, messageId, syncData.getOrder(),messageTransfer.getMessageTransferData().getDestination());
			}
		}
	}

	/**
	 * @param srcRangeList
	 * @param destRangeList
	 * @param messageId
	 * @param order
	 * @param dest 
	 */
	private void compareListsAndSave(List<RangeMasterDao> srcRangeList, List<RangeMasterDao> destRangeList,
			String messageId, int order, String dest) {
		List<RangeMasterDao> newRangeList = new ArrayList<>();
		for (RangeMasterDao srcRange : srcRangeList) {
			boolean isNew = true;
			for (RangeMasterDao destination : destRangeList) {

				if (srcRange.getId().equals(destination.getId())) {
					isNew = false;
					DatasyncStatusEnum status = compareSyncIdVersions(srcRange, destination);
					if (status.equals(DatasyncStatusEnum.SYNCED)) {
						int tempSrcDataSyncId = srcRange.getSrcSyncId();
						srcRange.setSrcSyncId(srcRange.getDestSyncId());
						srcRange.setDestSyncId(tempSrcDataSyncId);
						newRangeList.add(srcRange);
					} else {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					}
					break;
				}
			}
			if (isNew) {
				int tempSrcDataSyncId = srcRange.getSrcSyncId();
				srcRange.setSrcSyncId(srcRange.getDestSyncId());
				srcRange.setDestSyncId(tempSrcDataSyncId);
				newRangeList.add(srcRange);
			}

		}
		if (!newRangeList.isEmpty())
			saveToDestinationDB(newRangeList, order);
		datasyncAuditService.updateStatus(DataSyncAuditDtoThreadLocal.getSyncData(), messageId,dest);
		DataSyncAuditDtoThreadLocal.unsetSyncData();

	}

	/**
	 * @param srcRange
	 * @param destination
	 * @return DatasyncStatusEnum
	 */
	private DatasyncStatusEnum compareSyncIdVersions(RangeMasterDao src, RangeMasterDao dest) {
		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());
	}

	/**
	 * @param newRangeList
	 * @param order
	 */
	private void saveToDestinationDB(List<RangeMasterDao> newRangeList, int order) {
		try {
			if (order == 0)
				rangeMasterRepository.saveAll(newRangeList);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
			LOGGER.error(EXCEPTION, ex);
		} catch (Exception ex) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
			LOGGER.error(EXCEPTION, ex);
		}

	}

}
