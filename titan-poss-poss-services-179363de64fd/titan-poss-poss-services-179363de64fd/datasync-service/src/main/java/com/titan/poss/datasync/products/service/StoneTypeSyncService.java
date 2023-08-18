/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.products.service;

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
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.product.dao.StoneTypeDao;
import com.titan.poss.product.repository.StoneTypeRepository;
import com.titan.poss.product.sync.dto.StoneTypeSyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class StoneTypeSyncService implements SyncOperation {

	@Autowired
	private StoneTypeRepository stoneTypeRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(StoneTypeSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			ObjectMapper mapper = new ObjectMapper();
			StoneTypeSyncDto itemSyncDto = new StoneTypeSyncDto();
			StoneTypeDao sourceStoneType = itemSyncDto
					.getStoneTypeDao(mapper.convertValue(data.getData(), new TypeReference<StoneTypeSyncDto>() {
					}));
			StoneTypeDao destinationItem = stoneTypeRepository
					.findOneByStoneTypeCode(sourceStoneType.getStoneTypeCode());

			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(ProductOperationCodes.STONE_TYPE_ADD)
					|| operationCode.equals(ProductOperationCodes.STONE_TYPE_UPDATE)) {

				if (destinationItem == null) {
					saveToDestinationDB(sourceStoneType, messageId,messageTransfer.getMessageTransferData().getDestination());
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourceStoneType, destinationItem);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {

						datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), status.name());

					} else {

						saveToDestinationDB(sourceStoneType, messageId,messageTransfer.getMessageTransferData().getDestination());

					}
				}

			}
		});
	}

	@Transactional
	public void saveToDestinationDB(StoneTypeDao sourceStoneType, String messageId, String dest) {

		int tempSrcDataSyncId = sourceStoneType.getSrcSyncId();
		sourceStoneType.setSrcSyncId(sourceStoneType.getDestSyncId());
		sourceStoneType.setDestSyncId(tempSrcDataSyncId);
		try {
			stoneTypeRepository.save(sourceStoneType);
			datasyncAuditService.updateDatasyncAuditStatusById(messageId,dest, DatasyncStatusEnum.SYNCED.name());
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest,
					DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,dest,
					DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	private DatasyncStatusEnum compareSyncIdVersions(StoneTypeDao src, StoneTypeDao dest) {

		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());
	}

}
