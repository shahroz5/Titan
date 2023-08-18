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
import com.titan.poss.product.dao.MaterialTypeDao;
import com.titan.poss.product.repository.MaterialTypeRepository;
import com.titan.poss.product.sync.dto.MaterialTypeSyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class MaterialTypeSyncService implements SyncOperation {

	@Autowired
	private MaterialTypeRepository materialRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(MaterialTypeSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			ObjectMapper mapper = new ObjectMapper();
			MaterialTypeSyncDto materialTypeSyncDto = new MaterialTypeSyncDto();
			MaterialTypeDao sourceMaterialType = materialTypeSyncDto
					.getMaterialTypeDao(mapper.convertValue(data.getData(), new TypeReference<MaterialTypeSyncDto>() {
					}));
			MaterialTypeDao destinationItem = materialRepository
					.findOneByMaterialTypeCode(sourceMaterialType.getMaterialTypeCode());

			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(ProductOperationCodes.MATERIAL_TYPE_ADD)
					|| operationCode.equals(ProductOperationCodes.MATERIAL_TYPE_UPDATE)) {

				if (destinationItem == null) {
					saveToDestinationDB(sourceMaterialType, messageId,messageTransfer.getMessageTransferData().getDestination());
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourceMaterialType, destinationItem);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {

						datasyncAuditService.updateDatasyncAuditStatusById(messageId, messageTransfer.getMessageTransferData().getDestination(), status.name());

					} else {

						saveToDestinationDB(sourceMaterialType, messageId,messageTransfer.getMessageTransferData().getDestination());

					}
				}

			}
		});
	}

	@Transactional
	public void saveToDestinationDB(MaterialTypeDao sourceMaterialType, String messageId, String dest) {

		int tempSrcDataSyncId = sourceMaterialType.getSrcSyncId();
		sourceMaterialType.setSrcSyncId(sourceMaterialType.getDestSyncId());
		sourceMaterialType.setDestSyncId(tempSrcDataSyncId);
		try {
			materialRepository.save(sourceMaterialType);
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

	private DatasyncStatusEnum compareSyncIdVersions(MaterialTypeDao src, MaterialTypeDao dest) {

		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());
	}

}
