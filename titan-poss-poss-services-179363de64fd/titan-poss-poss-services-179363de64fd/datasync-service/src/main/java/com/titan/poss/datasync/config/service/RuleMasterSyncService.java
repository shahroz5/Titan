/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.config.service;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.config.dao.RuleMasterDao;
import com.titan.poss.config.dao.RuleMetadataDao;
import com.titan.poss.config.dto.RuleMasterSyncDto;
import com.titan.poss.config.dto.RuleMetadataSyncDto;
import com.titan.poss.config.repository.RuleMasterRepository;
import com.titan.poss.config.repository.RuleMetadataRepository;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.ConfigServiceOperationCodes;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
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
public class RuleMasterSyncService implements SyncOperation {

	@Autowired
	RuleMasterRepository ruleMasterRepository;

	@Autowired
	RuleMetadataRepository ruleMetadataRepository;

	@Autowired
	DatasyncAuditService datasyncAuditService;

	private static final Logger LOGGER = LoggerFactory.getLogger(RuleMasterSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	@Transactional
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDatas = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		for (SyncData syncData : syncDatas) {
			String operationCode = messageTransfer.getMessageTransferData().getOperation();
			if (operationCode.equals(ConfigServiceOperationCodes.RULE_ADD)
					|| operationCode.equals(ConfigServiceOperationCodes.RULE_UPDATE)) {
				if (syncData.getOrder() == 0) {
					getRuleMasterAndSave(syncData.getData(), syncData.getOrder());
				}
				else if (syncData.getOrder() == 1) {
					getRuleMetaDataAndSave(syncData.getData(), syncData.getOrder());
				}
			}
		}
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	/**
	 * @param data
	 * @param order
	 */
	private void getRuleMetaDataAndSave(Object data, int order) {
		ObjectMapper mapper = new ObjectMapper();
		RuleMetadataSyncDto ruleMetadataSyncDto = new RuleMetadataSyncDto();
		//@formatter:off
		RuleMetadataDao sourceRuleMetaData = ruleMetadataSyncDto.getRuleMetadataDao(mapper.convertValue(data, new TypeReference<RuleMetadataSyncDto>() {}));
		RuleMetadataDao destMetaData = ruleMetadataRepository.findByRuleType(sourceRuleMetaData.getRuleType());
		//@formatter:on
		if (destMetaData == null) {
			int tempSrcDataSyncId = sourceRuleMetaData.getSrcSyncId();
			sourceRuleMetaData.setSrcSyncId(sourceRuleMetaData.getDestSyncId());
			sourceRuleMetaData.setDestSyncId(tempSrcDataSyncId);
			saveToDestinationDB(sourceRuleMetaData, order);
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(sourceRuleMetaData.getSrcSyncId(),
					sourceRuleMetaData.getDestSyncId(), destMetaData.getSrcSyncId(), destMetaData.getDestSyncId());
			if (!status.equals(DatasyncStatusEnum.SYNCED)) {
				ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
			} else {
				int tempSrcDataSyncId = sourceRuleMetaData.getSrcSyncId();
				sourceRuleMetaData.setSrcSyncId(sourceRuleMetaData.getDestSyncId());
				sourceRuleMetaData.setDestSyncId(tempSrcDataSyncId);
				saveToDestinationDB(sourceRuleMetaData, order);
			}
		}
	}

	/**
	 * @param data
	 * @param order
	 */
	@Transactional
	public void getRuleMasterAndSave(Object data, int order) {
		ObjectMapper mapper = new ObjectMapper();
		RuleMasterSyncDto syncDto = new RuleMasterSyncDto();
		//@formatter:off
		RuleMasterDao sourceRule = syncDto.getRuleMasterDao(mapper.convertValue(data, new TypeReference<RuleMasterSyncDto>() {}));
		//@formatter:on
		RuleMasterDao destRule = ruleMasterRepository.findByRuleIdDaoRuleTypeAndRuleIdDaoRuleId(
				sourceRule.getRuleIdDao().getRuleType(), sourceRule.getRuleIdDao().getRuleId());
		if (destRule == null) {
			int tempSrcDataSyncId = sourceRule.getSrcSyncId();
			sourceRule.setSrcSyncId(sourceRule.getDestSyncId());
			sourceRule.setDestSyncId(tempSrcDataSyncId);
			saveToDestinationDB(sourceRule, order);
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(sourceRule.getSrcSyncId(), sourceRule.getDestSyncId(),
					destRule.getSrcSyncId(), destRule.getDestSyncId());
			if (!status.equals(DatasyncStatusEnum.SYNCED)) {
				ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
			} else {
				int tempSrcDataSyncId = sourceRule.getSrcSyncId();
				sourceRule.setSrcSyncId(sourceRule.getDestSyncId());
				sourceRule.setDestSyncId(tempSrcDataSyncId);
				saveToDestinationDB(sourceRule, order);
			}
		}
	}

	/**
	 * @param sourceRule
	 * @param order
	 */
	@Transactional
	public void saveToDestinationDB(Object object, int order) {
		try {
			if (order == 0) {
				ruleMasterRepository.save((RuleMasterDao) object);
			} else if (order == 1) {
				ruleMetadataRepository.save((RuleMetadataDao) object);
			}
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
