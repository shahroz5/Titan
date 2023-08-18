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
import com.titan.poss.product.dao.ComplexityPriceGroupDao;
import com.titan.poss.product.repository.ComplexityPriceGroupRepository;
import com.titan.poss.product.sync.dto.ComplexityPriceGroupSyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class ComplexityPriceGroupSyncService implements SyncOperation {

	
	@Autowired
	private ComplexityPriceGroupRepository complexityPriceGroupRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(ComplexityPriceGroupSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			ObjectMapper mapper = new ObjectMapper();
			ComplexityPriceGroupSyncDto complexityPriceGroupSyncDto= new ComplexityPriceGroupSyncDto();
			
			if (operationCode.equals(ProductOperationCodes.COMPLEXITY_PRICEGROUP_ADD) || operationCode.equals(ProductOperationCodes.COMPLEXITY_PRICEGROUP_UPDATE)) {
				
				ComplexityPriceGroupDao sourceComplexityPriceGroup = complexityPriceGroupSyncDto.getComplexityPriceGroupDao(mapper.convertValue(data.getData(), new TypeReference<ComplexityPriceGroupSyncDto>() {}));
				ComplexityPriceGroupDao destinationComplexityPriceGroup = complexityPriceGroupRepository.findOneByComplexityCodeAndPriceGroup(sourceComplexityPriceGroup.getComplexity().getComplexityCode(),sourceComplexityPriceGroup.getPriceGroup().getPriceGroup());
				
				
				if (destinationComplexityPriceGroup == null) {
					saveToDestinationDB(sourceComplexityPriceGroup, messageId,messageTransfer.getMessageTransferData().getDestination());
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourceComplexityPriceGroup,
							destinationComplexityPriceGroup);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {

						datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), status.name());

					} else {

						saveToDestinationDB(sourceComplexityPriceGroup, messageId,messageTransfer.getMessageTransferData().getDestination());

					}
				}

			}else if(operationCode.equals(ProductOperationCodes.COMPLEXITY_PRICEGROUP_FILE)) {
				
				List<ComplexityPriceGroupDao> srcList = complexityPriceGroupSyncDto.getDao(mapper.convertValue(data.getData(), new TypeReference<List<ComplexityPriceGroupSyncDto>>() {}));
				
				for (ComplexityPriceGroupDao src : srcList) {
					int tempSrcDataSyncId = src.getSrcSyncId();
					src.setSrcSyncId(src.getDestSyncId());
					src.setDestSyncId(tempSrcDataSyncId);
				}
				if(!srcList.isEmpty()) 
					saveListToDestinationDB(srcList,messageId,messageTransfer.getMessageTransferData().getDestination());
				
			}
	});
	}

	private void saveListToDestinationDB(List<ComplexityPriceGroupDao> srcList, String messageId, String dest) {
		try {
			complexityPriceGroupRepository.saveAll(srcList);
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
@Transactional
	public void saveToDestinationDB(ComplexityPriceGroupDao sourceComplexityPriceGroup, String messageId, String dest) {

		int tempSrcDataSyncId = sourceComplexityPriceGroup.getSrcSyncId();
		sourceComplexityPriceGroup.setSrcSyncId(sourceComplexityPriceGroup.getDestSyncId());
		sourceComplexityPriceGroup.setDestSyncId(tempSrcDataSyncId);
		try {
			complexityPriceGroupRepository.save(sourceComplexityPriceGroup);
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

	private DatasyncStatusEnum compareSyncIdVersions(ComplexityPriceGroupDao src, ComplexityPriceGroupDao dest) {

		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());
	}

}
