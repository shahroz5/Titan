/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.location.service;

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
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.EpossCallService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.location.dao.MarketDao;
import com.titan.poss.location.dto.MarketSyncDto;
import com.titan.poss.location.repository.MarketRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class MarketSyncService implements SyncOperation {

	@Autowired
	private MarketRepository marketRepository;

	@Autowired
	private EngineServiceClient engineServiceClient;

	@Value("${marketCache}")
	private String marketCache;

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private EpossCallService epossCallService;

	private static final Logger LOGGER = LoggerFactory.getLogger(MarketSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());

		String messageId = messageTransfer.getMessageTransferData().getId();

		syncData.forEach(data -> {

			ObjectMapper mapper = new ObjectMapper();
			MarketSyncDto marketSyncDto = new MarketSyncDto();
			MarketDao sourceMarket = marketSyncDto
					.getMarketDao(mapper.convertValue(data.getData(), new TypeReference<MarketSyncDto>() {
					}));
			MarketDao destinationMarket = marketRepository.findOneByMarketCode(sourceMarket.getMarketCode());

			String operationCode = messageTransfer.getMessageTransferData().getOperation();

			if (operationCode.equals(LocationOperationCodes.MARKET_ADD)
					|| operationCode.equals(LocationOperationCodes.MARKET_UPDATE)) {

				if (destinationMarket == null) {
					saveToDestinationDB(sourceMarket, messageId,messageTransfer.getMessageTransferData().getDestination());
				} else {
					DatasyncStatusEnum status = compareSyncIdVersions(sourceMarket, destinationMarket);
					if (!status.equals(DatasyncStatusEnum.SYNCED)) {

						datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), status.name());
					} else {

						saveToDestinationDB(sourceMarket, messageId,messageTransfer.getMessageTransferData().getDestination());
					}
				}

			}
		});
	}

	private DatasyncStatusEnum compareSyncIdVersions(MarketDao src, MarketDao dest) {
		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());
	}

	@Transactional
	public void saveToDestinationDB(MarketDao sourceMarket, String messageId, String dest) {
		// first clearing the cache in engine service
		String authToken = epossCallService.getAuthHeaderToken(VendorCodeEnum.POSS_TITAN.name());
		engineServiceClient.clearCacheWithToken("Bearer " + authToken, marketCache, sourceMarket.getMarketCode());

		int tempSrcDataSyncId = sourceMarket.getSrcSyncId();
		sourceMarket.setSrcSyncId(sourceMarket.getDestSyncId());
		sourceMarket.setDestSyncId(tempSrcDataSyncId);
		try {
			marketRepository.save(sourceMarket);
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

}
