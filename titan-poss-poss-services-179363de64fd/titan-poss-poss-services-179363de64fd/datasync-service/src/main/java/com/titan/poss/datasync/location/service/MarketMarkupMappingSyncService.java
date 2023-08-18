/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.location.service;

import java.util.ArrayList;
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
import com.titan.poss.datasync.constant.LocationOperationCodes;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.location.dao.MarketDao;
import com.titan.poss.location.dao.MarketMarkupMappingDao;
import com.titan.poss.location.dto.MarketMarkupMappingSyncDto;
import com.titan.poss.location.repository.MarketMarkupMappingRepository;
import com.titan.poss.location.repository.MarketRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class MarketMarkupMappingSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private MarketRepository marketRepository;

	@Autowired
	private MarketMarkupMappingRepository marketMarkupMappingRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(MarketMarkupMappingSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {

		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		syncData.forEach(data -> {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(LocationOperationCodes.MARKET_MARKUP_MAPPING_ADD )||operationCode.equals(LocationOperationCodes.MARKET_MARKUP_MAPPING_UPDATE) ){
				if (data.getOrder() == 0) {
					List<MarketMarkupMappingDao> sourceList = getSourceList(data.getData());
					List<MarketMarkupMappingDao> destinationList = getDestinationList(sourceList);
					compareListsAndSave(sourceList, destinationList, data.getOrder());
				}

			}
		});
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}


	/**
	 * @param market
	 * @param destinationMarket
	 * @return
	 */
	private DatasyncStatusEnum compareSyncIdVersions(MarketDao market, MarketDao destinationMarket) {
		return ReceiverUtil.isSyncable(market.getSrcSyncId(), market.getDestSyncId(), destinationMarket.getSrcSyncId(),
				destinationMarket.getDestSyncId());
	}

	/**
	 * @param sourceList
	 * @param destinationList
	 * @param messageId
	 */
	private void compareListsAndSave(List<MarketMarkupMappingDao> sourceList,
			List<MarketMarkupMappingDao> destinationList, int order) {
		List<MarketMarkupMappingDao> newMarketMarkupList = new ArrayList<>();

		for (MarketMarkupMappingDao srcMarketMarkup : sourceList) {
			boolean isNew = true;
			for (MarketMarkupMappingDao destination : destinationList) {
				if (srcMarketMarkup.getMarket().getMarketCode().equals(destination.getMarket().getMarketCode())
						&& srcMarketMarkup.getMetalTypeCode().equals(destination.getMetalTypeCode())) {
					isNew = false;
					DatasyncStatusEnum status = compareSyncIdVersions(srcMarketMarkup, destination);
					if (status.equals(DatasyncStatusEnum.SYNCED)) {
						int tempSrcDataSyncId = srcMarketMarkup.getSrcSyncId();
						srcMarketMarkup.setSrcSyncId(srcMarketMarkup.getDestSyncId());
						srcMarketMarkup.setDestSyncId(tempSrcDataSyncId);
						srcMarketMarkup.setId(destination.getId());
						newMarketMarkupList.add(srcMarketMarkup);
					} else {
						ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
					}
					break;
				}
			}
			if (isNew) {
				int tempSrcDataSyncId = srcMarketMarkup.getSrcSyncId();
				srcMarketMarkup.setSrcSyncId(srcMarketMarkup.getDestSyncId());
				srcMarketMarkup.setDestSyncId(tempSrcDataSyncId);
				newMarketMarkupList.add(srcMarketMarkup);
			}
		}
		saveAllToDestinationDB(newMarketMarkupList, order);
	}

	/**
	 * @param newMarketMarkupList
	 */
	@SuppressWarnings("unchecked")
	private void saveAllToDestinationDB(Object data, int order) {
		try {
			if (order == 0) {
				List<MarketMarkupMappingDao> marketMarkupMappingDaos = (List<MarketMarkupMappingDao>) data;
				if (!marketMarkupMappingDaos.isEmpty()) {
					marketMarkupMappingRepository.saveAll(marketMarkupMappingDaos);
					marketMarkupMappingRepository.flush();
				}
			}
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
			LOGGER.error(EXCEPTION, ex);
		} catch (Exception ex) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
			LOGGER.error(EXCEPTION, ex);
		}

	}

	/**
	 * @param srcMarketMarkup
	 * @param destination
	 * @return
	 */
	private DatasyncStatusEnum compareSyncIdVersions(MarketMarkupMappingDao src, MarketMarkupMappingDao dest) {
		return ReceiverUtil.isSyncable(src.getSrcSyncId(), src.getDestSyncId(), dest.getSrcSyncId(),
				dest.getDestSyncId());

	}

	/**
	 * @param sourceList
	 * @return
	 */
	private List<MarketMarkupMappingDao> getDestinationList(List<MarketMarkupMappingDao> sourceList) {
		List<MarketMarkupMappingDao> daos = new ArrayList<>();
		sourceList.forEach(src -> {
			MarketMarkupMappingDao mappingDao =marketMarkupMappingRepository
					.findOneByMarketMarketCodeAndMetalTypeCode(src.getMarket().getMarketCode(), src.getMetalTypeCode());
			if (mappingDao != null)
				daos.add(mappingDao);
		});
		return daos;
	}

	/**
	 * @param data
	 * @return
	 */
	private List<MarketMarkupMappingDao> getSourceList(Object data) {
		ObjectMapper mapper = new ObjectMapper();
		MarketMarkupMappingSyncDto marketMarkupMappingSyncDto = new MarketMarkupMappingSyncDto();
		return marketMarkupMappingSyncDto
				.getDaoList(mapper.convertValue(data, new TypeReference<List<MarketMarkupMappingSyncDto>>() {
				}));
	}

}
