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

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.product.dao.ProdLovDao;
import com.titan.poss.product.repository.LovRepository;
import com.titan.poss.product.sync.dto.ProdLovSyncDto;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class ProductLovSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private LovRepository lovRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(ProductLovSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();

		for (SyncData syncData : syncDataList) {
			ObjectMapper mapper = new ObjectMapper();
			ProdLovSyncDto prodLovSyncDto = new ProdLovSyncDto();
			List<ProdLovDao> srcProdLovList = prodLovSyncDto
					.getDaoList(mapper.convertValue(syncData.getData(), new TypeReference<List<ProdLovSyncDto>>() {
					}));
			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(ProductOperationCodes.PRODUCT_LOV_ADD)
					|| operationCode.equals(ProductOperationCodes.PRODUCT_LOV_UPDATE)) {
				for (ProdLovDao sourceLov : srcProdLovList) {
					ProdLovDao destProdLov = lovRepository.findOneByLovTypeAndCode(sourceLov.getLovType(),
							sourceLov.getCode());
					if (destProdLov == null) {
						saveToDestinationDB(sourceLov);

					} else {
						compareSyncIdVersions(sourceLov, destProdLov);
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
	private void compareSyncIdVersions(ProdLovDao src, ProdLovDao dest) {
		DatasyncStatusEnum status = ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(),
				dest.getSrcSyncId(), dest.getDestSyncId());

		if (!status.equals(DatasyncStatusEnum.SYNCED)) {
			ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
		} else {
			saveToDestinationDB(src);
		}
	}

	/**
	 * @param sourceLov
	 */
	private void saveToDestinationDB(ProdLovDao sourceProdLov) {
		int tempSrcDataSyncId = sourceProdLov.getSrcSyncId();
		sourceProdLov.setSrcSyncId(sourceProdLov.getDestSyncId());
		sourceProdLov.setDestSyncId(tempSrcDataSyncId);
		try {
			lovRepository.save(sourceProdLov);
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
