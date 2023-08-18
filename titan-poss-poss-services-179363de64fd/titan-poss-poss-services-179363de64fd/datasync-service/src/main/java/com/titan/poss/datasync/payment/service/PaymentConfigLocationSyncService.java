package com.titan.poss.datasync.payment.service;

import java.util.ArrayList;
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
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.payment.dao.ConfigLocationMappingDao;
import com.titan.poss.payment.dto.ConfigLocationMappingSyncDto;
import com.titan.poss.payment.repository.ConfigLocationMappingRepository;

@Service
public class PaymentConfigLocationSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	ConfigLocationMappingRepository configRepository;
	@Autowired
	PaymentConfigLocationSyncService paymentLocationSyncService;

	private static final Logger LOGGER = LoggerFactory.getLogger(PaymentConfigLocationSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		try {
		paymentConfigSync(syncDataList, messageId);
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	public void paymentConfigSync(List<SyncData> syncDataList, String messageId) {
		List<ConfigLocationMappingDao> saveConfigList = new ArrayList<>();
		List<ConfigLocationMappingDao> removeConfigList = new ArrayList<>();
		syncDataList.forEach(syncData -> {
			ObjectMapper mapper = new ObjectMapper();
			ConfigLocationMappingSyncDto syncDto = new ConfigLocationMappingSyncDto();
			ConfigLocationMappingDao sourceDao = syncDto.getConfigLocationMappingDao(
					mapper.convertValue(syncData.getData(), new TypeReference<ConfigLocationMappingSyncDto>() {
					}));
			syncPaymentDataList(saveConfigList, removeConfigList, sourceDao,
					syncData.getOrder());
		});
			paymentLocationSyncService.dbOperation(saveConfigList, removeConfigList, messageId);
	}

	private void syncPaymentDataList(List<ConfigLocationMappingDao> saveConfigList,
			List<ConfigLocationMappingDao> removeConfigList, ConfigLocationMappingDao sourceDao, int order) {
		ConfigLocationMappingDao destDao = configRepository.findByConfigIdConfigIdAndLocationCodeAndConfigType(
				sourceDao.getConfigId().getConfigId(), sourceDao.getLocationCode(), sourceDao.getConfigType());
		if(destDao != null){
			
			if (destDao.getSyncTime() <= sourceDao.getSyncTime()) {
				if (order == 0) {
					removeConfigList.add(destDao);
				} else if (order == 1) {
					saveConfigList.add(sourceDao);
				}
			} else {
				ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
			}
		}
		if (destDao == null && order == 1) {
			saveConfigList.add(sourceDao);
		}

	}

	@Transactional
	public void dbOperation(List<ConfigLocationMappingDao> saveConfigList,
			List<ConfigLocationMappingDao> removeConfigList, String messageId) {
		boolean flag=false;
		if (!removeConfigList.isEmpty()) {
			configRepository.deleteAll(removeConfigList);
			configRepository.flush();
			flag=true;
		}
		if (!saveConfigList.isEmpty()) {
			configRepository.saveAll(saveConfigList);
			flag=true;
		}
		if (flag) {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} else {
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
		}
	}
}
