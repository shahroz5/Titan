/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.products.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.domain.constant.enums.VendorCodeEnum;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.EpossCallService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.product.repository.ProductGroupRepository;
import com.titan.poss.product.sync.dto.ProductGroupSyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class ProductGroupSyncService implements SyncOperation {

	@Autowired
	private ProductGroupRepository productGroupRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	private EngineServiceClient engineServiceClient;

	@Autowired
	private EpossCallService epossCallService;

	private static final Logger LOGGER = LoggerFactory.getLogger(ProductGroupSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			ObjectMapper mapper = new ObjectMapper();
			ProductGroupSyncDto productGroupSyncDto = new ProductGroupSyncDto();
			ProductGroupDao sourceProductGroup = productGroupSyncDto
					.getProductGroupDao(mapper.convertValue(data.getData(), new TypeReference<ProductGroupSyncDto>() {
					}));
			ProductGroupDao destinationProductGroup = productGroupRepository
					.findOneByProductGroupCode(sourceProductGroup.getProductGroupCode());

			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(ProductOperationCodes.PRODUCT_GROUP_ADD)
					|| operationCode.equals(ProductOperationCodes.PRODUCT_GROUP_UPDATE)) {

				if (destinationProductGroup == null) {
					saveToDestinationDB(sourceProductGroup, messageId,messageTransfer.getMessageTransferData().getDestination());
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourceProductGroup, destinationProductGroup);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {

						datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), status.name());

					} else {

						saveToDestinationDB(sourceProductGroup, messageId,messageTransfer.getMessageTransferData().getDestination());

					}
				}

			}
		});
	}

	@Value("${productGroupCache}")
	private String productGroupCache;

	@Transactional
	// @CacheEvict(key = "#sourceProductGroup.isPlainStudded", value = "napCache")
	public void saveToDestinationDB(ProductGroupDao sourceProductGroup, String messageId, String dest) {

		// first clearing the cache in engine service
		String authToken = epossCallService.getAuthHeaderToken(VendorCodeEnum.POSS_TITAN.name());
		engineServiceClient.clearCacheWithToken("Bearer " + authToken, productGroupCache, null);

		int tempSrcDataSyncId = sourceProductGroup.getSrcSyncId();
		sourceProductGroup.setSrcSyncId(sourceProductGroup.getDestSyncId());
		sourceProductGroup.setDestSyncId(tempSrcDataSyncId);
		try {
			productGroupRepository.save(sourceProductGroup);
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

	private DatasyncStatusEnum compareSyncIdVersions(ProductGroupDao src, ProductGroupDao dest) {

		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());
	}

}
