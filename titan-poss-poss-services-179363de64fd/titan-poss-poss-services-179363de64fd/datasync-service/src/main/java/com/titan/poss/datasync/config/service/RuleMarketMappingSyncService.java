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
import com.titan.poss.config.dao.RuleMarketMappingDao;
import com.titan.poss.config.dto.RuleMarketMappingSyncDto;
import com.titan.poss.config.repository.RuleMarketMappingRepository;
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
public class RuleMarketMappingSyncService implements SyncOperation {

	@Autowired
	RuleMarketMappingRepository ruleMarketRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(RuleMarketMappingSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDatas = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		for (SyncData syncData : syncDatas) {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(ConfigServiceOperationCodes.RULE_MARKET_MAPPING)) {
				List<RuleMarketMappingDao> sourceList = getSourceList(syncData.getData());
				compareListsAndSave(sourceList, syncData.getOrder());
			}
		}
		datasyncAuditService.updateStatus(DataSyncAuditDtoThreadLocal.getSyncData(), messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param sourceList
	 * @param order
	 */
	private void compareListsAndSave(List<RuleMarketMappingDao> srcRuleMarkets, int order) {
		List<RuleMarketMappingDao> rmmSrcList = new ArrayList<>();
		List<RuleMarketMappingDao> rmmDeleteList = new ArrayList<>();
		for (RuleMarketMappingDao rulePrdGrpMapping : srcRuleMarkets) {
			RuleMarketMappingDao destination = ruleMarketRepository.findMappedProduct(
					rulePrdGrpMapping.getRuleMasterDao().getRuleIdDao().getRuleType(),
					rulePrdGrpMapping.getRuleMasterDao().getRuleIdDao().getRuleId(),
					rulePrdGrpMapping.getMarketCode());
			if (destination != null) {
				if (rulePrdGrpMapping.getSyncTime() >= destination.getSyncTime()) {
					if (order == 0)
						rmmDeleteList.add(destination);
					else if (order == 1) {
						rmmDeleteList.add(destination);
						rmmSrcList.add(rulePrdGrpMapping);
					}
				} else {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				}
			} else {
				rmmSrcList.add(rulePrdGrpMapping);
			}
		}
		saveToDestinationDB(rmmSrcList, rmmDeleteList, order);
	}

	/**
	 * @param rmmSrcList
	 * @param rmmDeleteList
	 * @param order
	 */
	private void saveToDestinationDB(List<RuleMarketMappingDao> rmmSrcList, List<RuleMarketMappingDao> rmmDeleteList,
			int order) {
		try {
			if (order == 0)
				ruleMarketRepository.deleteAll(rmmDeleteList);
			else if (order == 1) {
				if (!rmmDeleteList.isEmpty()) {
					ruleMarketRepository.deleteAll(rmmDeleteList);
					ruleMarketRepository.flush();
				}
				ruleMarketRepository.saveAll(rmmSrcList);
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
	 * @param data
	 * @return List<RuleMarketMappingDao>
	 */
	private List<RuleMarketMappingDao> getSourceList(Object data) {
		ObjectMapper mapper = new ObjectMapper();
		RuleMarketMappingSyncDto syncDto = new RuleMarketMappingSyncDto();
		return syncDto
				.getMarketMappingList(mapper.convertValue(data, new TypeReference<List<RuleMarketMappingSyncDto>>() {
		}));
	}

}
