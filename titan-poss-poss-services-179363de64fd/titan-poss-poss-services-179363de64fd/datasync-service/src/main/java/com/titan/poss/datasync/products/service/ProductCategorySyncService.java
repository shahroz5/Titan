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
import com.titan.poss.product.dao.ProductCategoryDao;
import com.titan.poss.product.repository.ProductCategoryRepository;
import com.titan.poss.product.sync.dto.ProductCategorySyncDto;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class ProductCategorySyncService implements SyncOperation {

	@Autowired
	private ProductCategoryRepository productCategoryRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Value("${productCategoryCache}")
	private String productCategoryCache;

	@Autowired
	private EngineServiceClient engineServiceClient;

	@Autowired
	private EpossCallService epossCallService;

	private static final Logger LOGGER = LoggerFactory.getLogger(ProductCategorySyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			ObjectMapper mapper = new ObjectMapper();
			ProductCategorySyncDto productCategorySyncDto = new ProductCategorySyncDto();
			ProductCategoryDao sourceProductCategory = productCategorySyncDto.getProductCategoryDao(
					mapper.convertValue(data.getData(), new TypeReference<ProductCategorySyncDto>() {
					}));
			ProductCategoryDao destinationProductCategory = productCategoryRepository
					.findOneByProductCategoryCode(sourceProductCategory.getProductCategoryCode());

			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(ProductOperationCodes.PRODUCT_CATEGORY_ADD)
					|| operationCode.equals(ProductOperationCodes.PRODUCT_CATEGORY_UPDATE)) {

				if (destinationProductCategory == null) {
					saveToDestinationDB(sourceProductCategory, messageId,messageTransfer.getMessageTransferData().getDestination());
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourceProductCategory,
							destinationProductCategory);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {

						datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), status.name());

					} else {

						saveToDestinationDB(sourceProductCategory, messageId,messageTransfer.getMessageTransferData().getDestination());

					}
				}

			}
		});
	}

	@Transactional
	public void saveToDestinationDB(ProductCategoryDao sourceItem, String messageId, String dest) {
		// first clearing the cache in engine service
		String authToken = epossCallService.getAuthHeaderToken(VendorCodeEnum.POSS_TITAN.name());
		engineServiceClient.clearCacheWithToken("Bearer " + authToken, productCategoryCache, null);

		int tempSrcDataSyncId = sourceItem.getSrcSyncId();
		sourceItem.setSrcSyncId(sourceItem.getDestSyncId());
		sourceItem.setDestSyncId(tempSrcDataSyncId);
		try {
			productCategoryRepository.save(sourceItem);
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

	private DatasyncStatusEnum compareSyncIdVersions(ProductCategoryDao src, ProductCategoryDao dest) {

		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());
	}

}
