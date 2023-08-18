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
import com.titan.poss.datasync.constant.ProductOperationCodes;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.location.dao.MarketUcpPriceMappingDao;
import com.titan.poss.location.dto.MarketUcpPriceMappingSyncDto;
import com.titan.poss.location.repository.MarketUcpPriceMappingRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class MarketUcpPriceMappingSyncService implements SyncOperation {

	@Autowired
	private MarketUcpPriceMappingRepository marketUcpPriceMappingRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(MarketUcpPriceMappingSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			ObjectMapper mapper = new ObjectMapper();
			MarketUcpPriceMappingSyncDto marketUcpPriceMappingSyncDto = new MarketUcpPriceMappingSyncDto();
			MarketUcpPriceMappingDao sourceMarketUcp = marketUcpPriceMappingSyncDto
					.getMarketUcpPriceMappingDao(
							mapper.convertValue(data.getData(), new TypeReference<MarketUcpPriceMappingSyncDto>() {
					}));
			MarketUcpPriceMappingDao destMarketUcp = marketUcpPriceMappingRepository
					.findOneById(sourceMarketUcp.getId());

			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(ProductOperationCodes.MARKET_UCP_PRICE_MAPPING_ADD)
					|| operationCode.equals(ProductOperationCodes.MARKET_UCP_PRICE_MAPPING_UPDATE)) {

				if (destMarketUcp == null) {
					saveToDestinationDB(sourceMarketUcp, messageId,
							messageTransfer.getMessageTransferData().getDestination());
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourceMarketUcp, destMarketUcp);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {

						datasyncAuditService.updateDatasyncAuditStatusById(messageId,
								messageTransfer.getMessageTransferData().getDestination(), status.name());

					} else {

						saveToDestinationDB(sourceMarketUcp, messageId,
								messageTransfer.getMessageTransferData().getDestination());

					}
				}

			}
		});
	}

	@Transactional
	public void saveToDestinationDB(MarketUcpPriceMappingDao marketUcpPriceMappingDao, String messageId, String dest) {

		int tempSrcDataSyncId = marketUcpPriceMappingDao.getSrcSyncId();
		marketUcpPriceMappingDao.setSrcSyncId(marketUcpPriceMappingDao.getDestSyncId());
		marketUcpPriceMappingDao.setDestSyncId(tempSrcDataSyncId);
		try {
			marketUcpPriceMappingRepository.save(marketUcpPriceMappingDao);
			datasyncAuditService.updateDatasyncAuditStatusById(messageId, dest, DatasyncStatusEnum.SYNCED.name());
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId, dest,
					DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId, dest,
					DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	private DatasyncStatusEnum compareSyncIdVersions(MarketUcpPriceMappingDao src, MarketUcpPriceMappingDao dest) {

		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());
	}
}
