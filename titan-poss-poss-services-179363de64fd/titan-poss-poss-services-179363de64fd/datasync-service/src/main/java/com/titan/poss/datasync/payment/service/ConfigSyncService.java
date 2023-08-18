package com.titan.poss.datasync.payment.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.PaymentOperationCodes;
import com.titan.poss.datasync.dto.DataSyncAuditDto;
import com.titan.poss.datasync.dto.DataSyncAuditDtoThreadLocal;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.payment.dao.ConfigDao;
import com.titan.poss.payment.dao.ConfigDetailsDao;
import com.titan.poss.payment.dto.ConfigDetailsSyncDto;
import com.titan.poss.payment.dto.ConfigSyncDto;
import com.titan.poss.payment.repository.ConfigDetailsRepository;
import com.titan.poss.payment.repository.ConfigLocationMappingRepository;
import com.titan.poss.payment.repository.ConfigRepository;

@Service
public class ConfigSyncService implements SyncOperation {
	@Autowired
	DatasyncAuditService datasyncAuditService;

	@Autowired
	ConfigRepository configRepository;

	@Autowired
	ConfigSyncService configService;

	@Autowired
	ConfigDetailsRepository configDetailsRepository;

	@Autowired
	ConfigLocationMappingRepository configLocationMappingRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(ConfigSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		syncData.forEach(data -> {
			if (operationCode.equals(PaymentOperationCodes.PAYMENT_CONFIG_ADD)
					|| operationCode.equals(PaymentOperationCodes.PAYMENT_CONFIG_UPDATE)) {
				configService.addAndUpdatePaymentConfig(data);
			} else if (operationCode.equals(PaymentOperationCodes.PAYMENT_CONFIG_DETAILS_UPDATE)) {
				configService.getConfigDetailsData(data.getData(), data.getOrder());
			}
		});
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	private void addAndUpdatePaymentConfig(SyncData data) {
		ObjectMapper mapper = new ObjectMapper();
		ConfigSyncDto configSyncDto = new ConfigSyncDto();
		ConfigDao sourceConfigDao = configSyncDto
				.getConfigDao(mapper.convertValue(data.getData(), new TypeReference<ConfigSyncDto>() {
				}));
		Optional<ConfigDao> destinationConfigDao = configRepository.findById(sourceConfigDao.getConfigId());
		if (!destinationConfigDao.isPresent()) {
			saveConfigToDestinationDB(sourceConfigDao);
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(sourceConfigDao.getSrcSyncId(),
					sourceConfigDao.getDestSyncId(), destinationConfigDao.get().getSrcSyncId(),
					destinationConfigDao.get().getDestSyncId());
			if (!status.equals(DatasyncStatusEnum.SYNCED)) {
				ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
			} else {
				saveConfigToDestinationDB(sourceConfigDao);
			}
		}
	}

	private void getConfigDetailsData(Object data, int order) {
		if (order == 0) {
			configService.removeConfigDetails(data);
		} else if (order == 1) {
			try {
				configService.saveConfigDetails(data);
			} catch (DataIntegrityViolationException ex) {
				LOGGER.error(EXCEPTION, ex);
				ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), null);
			} catch (Exception ex) {
				LOGGER.error(EXCEPTION, ex);
				ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), null);
			}
		}
	}

	private void saveConfigDetails(Object data) {
		List<ConfigDetailsDao> sourceConfigDetailsDaoList = configService.getConfigDetailsList(data);
		sourceConfigDetailsDaoList.forEach(sourceConfigDetailsDao -> {
			ConfigDetailsDao destinationConfigDetailsDao = configDetailsRepository
					.findByConfigIdConfigIdAndPaymentPaymentCodeAndTransactionDaoTransactionType(
							sourceConfigDetailsDao.getConfigId().getConfigId(),
							sourceConfigDetailsDao.getPayment().getPaymentCode(),
							sourceConfigDetailsDao.getTransactionDao().getTransactionType());
			if (destinationConfigDetailsDao != null) {

				if (destinationConfigDetailsDao.getSyncTime() <= sourceConfigDetailsDao.getSyncTime()) {
					configService.saveConfigDetails(sourceConfigDetailsDao);
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
				} else {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				}

			} else {
				configService.saveConfigDetails(sourceConfigDetailsDao);
				ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
			}

		});

	}

	private void removeConfigDetails(Object data) {
		List<ConfigDetailsDao> sourceConfigDetailsDaoList = configService.getConfigDetailsList(data);
		sourceConfigDetailsDaoList.forEach(sourceConfigDetailsDao -> {
			ConfigDetailsDao destinationConfigDetailsDao = configDetailsRepository
					.findByConfigIdConfigIdAndPaymentPaymentCodeAndTransactionDaoTransactionType(
							sourceConfigDetailsDao.getConfigId().getConfigId(),
							sourceConfigDetailsDao.getPayment().getPaymentCode(),
							sourceConfigDetailsDao.getTransactionDao().getTransactionType());
			if (destinationConfigDetailsDao != null) {
				if (sourceConfigDetailsDao.getSyncTime() >= destinationConfigDetailsDao.getSyncTime()) {
					configDetailsRepository.delete(destinationConfigDetailsDao);
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
				} else {
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.DISCARDED.name(), null);
				}
			}
		});

	}

	private List<ConfigDetailsDao> getConfigDetailsList(Object data) {
		ObjectMapper mapper = new ObjectMapper();
		List<ConfigDetailsSyncDto> syncDtoList = mapper.convertValue(data,
				new TypeReference<List<ConfigDetailsSyncDto>>() {
				});
		List<ConfigDetailsDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDt -> {
			ConfigDetailsSyncDto dto = new ConfigDetailsSyncDto();
			daoList.add(dto.getConfigDetailsDao(syncDt));
		});
		return daoList;
	}

	private void saveConfigToDestinationDB(ConfigDao sourceConfigDao) {
		int tempSrcDataSyncId = sourceConfigDao.getSrcSyncId();
		sourceConfigDao.setSrcSyncId(sourceConfigDao.getDestSyncId());
		sourceConfigDao.setDestSyncId(tempSrcDataSyncId);
		try {
			configRepository.save(sourceConfigDao);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	private void saveConfigDetails(ConfigDetailsDao sourceConfigDetailsDao) {

		configDetailsRepository.save(sourceConfigDetailsDao);

	}

}
