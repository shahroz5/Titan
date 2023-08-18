/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.datasync.sales.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.MessageTransfer;
import com.titan.poss.datasync.service.DatasyncAuditService;
import com.titan.poss.datasync.service.SyncOperation;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.payment.dao.PayeeBankLocationMappingDao;
import com.titan.poss.sales.constants.PaymentCodeRevenueEnum;
import com.titan.poss.sales.dao.PIFSeriesDao;
import com.titan.poss.sales.dao.PIFSeriesDaoExt;
import com.titan.poss.sales.dto.PIFSeriesSyncDto;
import com.titan.poss.sales.repository.PIFSeriesRepository;
import com.titan.poss.sales.repository.PIFSeriesRepositoryExt;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class PIFSeriesSyncService implements SyncOperation {

	@Autowired
	PIFSeriesRepository pifSeriesRepository;
	
	@Autowired
	PIFSeriesRepositoryExt pifSeriesRepositoryExt;

	@Autowired
	private DatasyncAuditService datasyncAuditService;

	@Autowired
	PIFSeriesSyncService pifSeries;

	private static final Logger LOGGER = LoggerFactory.getLogger(PIFSeriesSyncService.class);
	private static final String EXCEPTION = "exception : ";

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		try {
			if (operationCode.equals(SalesOperationCode.PIF_UPDATE)) {
				Boolean flag=syncService(syncDataList);
				if (Boolean.TRUE.equals(flag)) {
					datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.SYNCED.name());
				} else {
					datasyncAuditService.updateDatasyncAuditStatusById(messageId,messageTransfer.getMessageTransferData().getDestination(), DatasyncStatusEnum.DISCARDED.name());
				}
			}
		} catch (DataIntegrityViolationException ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,messageTransfer.getMessageTransferData().getDestination(),
					DatasyncStatusEnum.FAILED_DEPENDENCY.name(), ex.getMessage());
		} catch (Exception ex) {
			LOGGER.error(EXCEPTION, ex);
			datasyncAuditService.updateDatasyncAuditStatusAndExceptionById(messageId,messageTransfer.getMessageTransferData().getDestination(),
					DatasyncStatusEnum.FAILED_PERSIST.name(), ex.getMessage());
		}
	}

	private Boolean syncService(List<SyncData> syncDataList) {
		List<PIFSeriesDao> pifList=new ArrayList<>();
		ObjectMapper mapper = new ObjectMapper();
		for (SyncData data : syncDataList) {
			if(data.getOrder()==0) {
				syncPIFSeries(data,pifList,mapper);
			}
		}
		return pifSeries.dbOperation(pifList);
	}

	private void syncPIFSeries(SyncData data, List<PIFSeriesDao> pifList, ObjectMapper mapper) {
		PIFSeriesSyncDto syncDto=new PIFSeriesSyncDto();
		List<PIFSeriesDao> srcPIFList=syncDto.getPIFSeriesDaoList(mapper.convertValue(data.getData(), new TypeReference<List<PIFSeriesSyncDto>>() {
				}));
		srcPIFList.forEach(srcPIF->{
			Optional<PIFSeriesDao> destPIF=pifSeriesRepository.findById(srcPIF.getId());
			if(destPIF.isPresent()) {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcPIF.getSrcSyncId(), srcPIF.getDestSyncId(),
						destPIF.get().getSrcSyncId(), destPIF.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcPIF.getSrcSyncId();
					srcPIF.setSrcSyncId(srcPIF.getDestSyncId());
					srcPIF.setDestSyncId(tempSrcDataSyncId);
					pifList.add(srcPIF);
				}
			}else {
				int tempSrcDataSyncId = srcPIF.getSrcSyncId();
				srcPIF.setSrcSyncId(srcPIF.getDestSyncId());
				srcPIF.setDestSyncId(tempSrcDataSyncId);
				pifList.add(srcPIF);
			}
		});
		
	}
	
	@Transactional(value="chainedTransaction")
	public Boolean dbOperation(List<PIFSeriesDao> pifList) {
		Boolean flag=false;
		if(!pifList.isEmpty()) {
			pifSeriesRepository.saveAll(pifList);
			flag=true;
		}
		return flag;
	}

	/**
	 * 
	 * @param mappingDao
	 * @param order
	 * @return List<PIFSeriesDao>
	 */
	public List<PIFSeriesDaoExt> updatePifSeriesMaster(PayeeBankLocationMappingDao mappingDao, int order) {
		List<PIFSeriesDaoExt> pifSeriesDao;
		List<PIFSeriesDaoExt> pifSeriesDaoList = new ArrayList<>();

		if (order == 0) {
			pifSeriesDao = pifSeriesRepositoryExt.getPifSeriesData(mappingDao.getLocationCode(), Boolean.TRUE,
					mappingDao.getPayeeBank().getBankName(), mappingDao.getPayment().getPaymentCode());
			for (PIFSeriesDaoExt pifSer : pifSeriesDao) {
				pifSer.setIsActive(Boolean.FALSE);
				pifSeriesDaoList.add(pifSer);
			}
		} else if (order == 1) {
			pifSeriesDaoList = getPifSeriesDaoList(mappingDao);
		}

		return pifSeriesRepositoryExt.saveAll(pifSeriesDaoList);
	}

	/**
	 * 
	 * @param mappingDao
	 * @return List<PIFSeriesDao>
	 */
	public List<PIFSeriesDaoExt> getPifSeriesDaoList(PayeeBankLocationMappingDao mappingDao) {
		List<PIFSeriesDaoExt> pifSeriesDao;
		List<PIFSeriesDaoExt> pifSeriesDaoList = new ArrayList<>();
		if (mappingDao.getPayment().getPaymentCode().equalsIgnoreCase(PaymentCodeRevenueEnum.CASH.name())
				&& mappingDao.getIsDefault().equals(Boolean.TRUE)) {
			pifSeriesDao = pifSeriesRepositoryExt.findByLocationCodeAndIsActiveAndPaymentCode(mappingDao.getLocationCode(),
					Boolean.TRUE, mappingDao.getPayment().getPaymentCode());
			if (!pifSeriesDao.isEmpty()) {
				pifSeriesDao.forEach(pifSer -> {
					pifSer.setIsActive(Boolean.FALSE);
					pifSeriesDaoList.add(pifSer);
				});
			}
			// added again why???
			pifSeriesDaoList.add(getPifSeries(mappingDao));
		} else if (mappingDao.getPayment().getPaymentCode().equalsIgnoreCase(PaymentCodeRevenueEnum.CARD.name())) {
			PIFSeriesDaoExt pifSeriesCardDao = pifSeriesRepositoryExt.findByLocationCodeAndIsActiveAndBankNameAndPaymentCode(
					mappingDao.getLocationCode(), Boolean.TRUE, mappingDao.getPayeeBank().getBankName(),
					mappingDao.getPayment().getPaymentCode());
			if (pifSeriesCardDao == null) {
				pifSeriesCardDao = getPifSeries(mappingDao);
				pifSeriesDaoList.add(pifSeriesCardDao);
			}
		} else if ((mappingDao.getPayment().getPaymentCode().equalsIgnoreCase(PaymentCodeRevenueEnum.CHEQUE.name())
				&& mappingDao.getIsDefault().equals(Boolean.TRUE))
				|| (mappingDao.getPayment().getPaymentCode().equalsIgnoreCase(PaymentCodeRevenueEnum.DD.name())
						&& mappingDao.getIsDefault().equals(Boolean.TRUE))) {
			pifSeriesDao = pifSeriesRepositoryExt.findByLocationCodeAndIsActiveAndPaymentCode(mappingDao.getLocationCode(),
					Boolean.TRUE, mappingDao.getPayment().getPaymentCode());
			if (!pifSeriesDao.isEmpty()) {
				pifSeriesDao.forEach(pifSer -> {
					pifSer.setIsActive(Boolean.FALSE);
					pifSeriesDaoList.add(pifSer);
				});
			}
			PIFSeriesDaoExt pifSeriesHomeBank = getPifSeries(mappingDao);
			pifSeriesHomeBank.setIsHomeBank(Boolean.TRUE);
			PIFSeriesDaoExt pifSeriesNONHomeBank = getPifSeries(mappingDao);
			pifSeriesNONHomeBank.setIsHomeBank(Boolean.FALSE);
			pifSeriesDaoList.add(pifSeriesHomeBank);
			pifSeriesDaoList.add(pifSeriesNONHomeBank);
		}

		return pifSeriesDaoList;

	}

	/**
	 * 
	 * @param mappingDao
	 * @return PIFSeriesDao
	 */
	public PIFSeriesDaoExt getPifSeries(PayeeBankLocationMappingDao mappingDao) {
		PIFSeriesDaoExt pifSeriesDao = new PIFSeriesDaoExt();
		pifSeriesDao.setBankName(mappingDao.getPayeeBank().getBankName());
		pifSeriesDao.setCurrentSeqNo(0);
		pifSeriesDao.setFromNo(0);
		pifSeriesDao.setToNo(0);
		pifSeriesDao.setPaymentCode(mappingDao.getPayment().getPaymentCode());
		pifSeriesDao.setLocationCode(mappingDao.getLocationCode());
		pifSeriesDao.setIsActive(Boolean.TRUE);
		return pifSeriesDao;
	}

	public void updatePifSeriesMaster(List<PayeeBankLocationMappingDao> deletePayeeBank,
			List<PayeeBankLocationMappingDao> savePayeeBank) {
		deletePayeeBank.forEach(del -> pifSeries.updatePifSeriesMaster(del, 0));
		pifSeriesRepositoryExt.flush();
		savePayeeBank.forEach(sav -> pifSeries.updatePifSeriesMaster(sav, 1));
	}

}