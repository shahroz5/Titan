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
import com.titan.poss.payment.dao.CashbackCardDetailsDao;
import com.titan.poss.payment.dao.CashbackDao;
import com.titan.poss.payment.dto.CashbackCardDetailsSyncDto;
import com.titan.poss.payment.dto.CashbackSyncDto;
import com.titan.poss.payment.repository.CashbackCardDetailsRepository;
import com.titan.poss.payment.repository.CashbackOfferDetailsRepository;
import com.titan.poss.payment.repository.CashbackRepository;

@Service
public class CashbackSyncService implements SyncOperation {

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	private CashbackSyncService cashbackService;

	@Autowired
	private CashbackRepository cashbackRepository;

	@Autowired
	private CashbackOfferDetailsRepository cashbackOfferDetailsRepository;

	@Autowired
	private CashbackCardDetailsRepository cashbackCardDetailsRepository;

	private static final Logger LOGGER = LoggerFactory.getLogger(CashbackSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncData = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		syncData.forEach(data -> {
			if (operationCode.equals(PaymentOperationCodes.CASHBACK_ADD)
					|| operationCode.equals(PaymentOperationCodes.CASHBACK_UPDATE)) {
				cashbackService.addAndUpdateCashback(data);
			} else if (operationCode.equals(PaymentOperationCodes.CASHBACK_CARD_DETAILS_ADD)
					|| operationCode.equals(PaymentOperationCodes.CASHBACK_CARD_DETAILS_UPDATE)) {
				cashbackService.getCashbackCardDetails(data.getData(), messageId);
			}
		});
		List<DataSyncAuditDto> dataSyncAuditDtos = DataSyncAuditDtoThreadLocal.getSyncData();
		datasyncAuditService.updateStatus(dataSyncAuditDtos, messageId,messageTransfer.getMessageTransferData().getDestination());
		DataSyncAuditDtoThreadLocal.unsetSyncData();
	}

	private void addAndUpdateCashback(SyncData data) {
		ObjectMapper mapper = new ObjectMapper();
		CashbackSyncDto cashbackSyncDto = new CashbackSyncDto();
		CashbackDao sourceCashback = cashbackSyncDto
				.getCashbackDao(mapper.convertValue(data.getData(), new TypeReference<CashbackSyncDto>() {
				}));
		Optional<CashbackDao> destinationCashback = cashbackRepository.findById(sourceCashback.getId());
		destinationCashback.ifPresent(dest -> {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(sourceCashback.getSrcSyncId(),
					sourceCashback.getDestSyncId(), destinationCashback.get().getSrcSyncId(),
					destinationCashback.get().getDestSyncId());
			if (!status.equals(DatasyncStatusEnum.SYNCED)) {
				ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
			} else {
				saveToDestinationDB(sourceCashback);
			}
		});
		if (!destinationCashback.isPresent()) {
			saveToDestinationDB(sourceCashback);
		}

	}

	public void getCashbackCardDetails(Object data, String messageId) {
		List<CashbackCardDetailsDao> sourceCashbackCardDaoList = getCashbackCardDetailsDao(data);
		sourceCashbackCardDaoList.forEach(sourceCashbackCardDao -> {
			if (cashbackOfferDetailsRepository.existsById(sourceCashbackCardDao.getId())) {
				Optional<CashbackCardDetailsDao> destinationCashbackCardDao = cashbackCardDetailsRepository
						.findById(sourceCashbackCardDao.getId());

				DatasyncStatusEnum status = ReceiverUtil.isSyncable(sourceCashbackCardDao.getSrcSyncId(),
						sourceCashbackCardDao.getDestSyncId(), destinationCashbackCardDao.get().getSrcSyncId(),
						destinationCashbackCardDao.get().getDestSyncId());
				if (!status.equals(DatasyncStatusEnum.SYNCED)) {
					ReceiverUtil.addToDataSyncAuditDto(status.name(), null);
				} else {
					int tempSrcSyncId = sourceCashbackCardDao.getSrcSyncId();
					sourceCashbackCardDao.setSrcSyncId(sourceCashbackCardDao.getDestSyncId());
					sourceCashbackCardDao.setDestSyncId(tempSrcSyncId);
					cashbackCardDetailsRepository.save(sourceCashbackCardDao);
					ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
				}
			} else {
				int tempSrcSyncId = sourceCashbackCardDao.getSrcSyncId();
				sourceCashbackCardDao.setSrcSyncId(sourceCashbackCardDao.getDestSyncId());
				sourceCashbackCardDao.setDestSyncId(tempSrcSyncId);
				cashbackCardDetailsRepository.save(sourceCashbackCardDao);
				ReceiverUtil.addToDataSyncAuditDto(DatasyncStatusEnum.SYNCED.name(), null);
			}
		});

	}

	private List<CashbackCardDetailsDao> getCashbackCardDetailsDao(Object data) {
		ObjectMapper mapper = new ObjectMapper();
		List<CashbackCardDetailsSyncDto> syncDtoList = mapper.convertValue(data,
				new TypeReference<List<CashbackCardDetailsSyncDto>>() {
				});
		List<CashbackCardDetailsDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDt -> {
			CashbackCardDetailsSyncDto dto = new CashbackCardDetailsSyncDto();
			daoList.add(dto.getCashbackDao(syncDt));
		});
		return daoList;
	}

	private void saveToDestinationDB(CashbackDao sourceCashback) {
		int tempSrcDataSyncId = sourceCashback.getSrcSyncId();
		sourceCashback.setSrcSyncId(sourceCashback.getDestSyncId());
		sourceCashback.setDestSyncId(tempSrcDataSyncId);
		try {
			cashbackRepository.save(sourceCashback);
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
