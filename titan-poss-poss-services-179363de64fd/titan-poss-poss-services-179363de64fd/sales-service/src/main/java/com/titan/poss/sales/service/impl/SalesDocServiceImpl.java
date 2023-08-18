/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.sales.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.dao.SalesDocDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.DocNoFailAuditDto;
import com.titan.poss.sales.dto.SalesDocSyncDtoExt;
import com.titan.poss.sales.repository.SalesDocRepositoryExt;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.service.SalesDocService;
import com.titan.poss.sales.service.SalesSyncDataService;
import com.titan.poss.sales.utils.DocNoFailAuditThreadLocal;

/**
 * Service class for Sales Doc.
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesDocService")
public class SalesDocServiceImpl implements SalesDocService {

	@Autowired
	private SalesDocRepositoryExt salesDocRepository;

	@Autowired
	private SalesDocServiceImpl salesDocService;

	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;

	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Value("${app.name}")
	private String appName;

	@Override
	public Integer getDocNumber(SalesDocTypeEnum docType, Short fiscalYear) {
		SalesDocDaoExt salesDocDao = salesDocService.getDocNumber(docType, fiscalYear, 1, CommonUtil.getLocationCode());
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			SyncStagingDto syncDto = salesDocStaging(salesDocDao, SalesOperationCode.SALES_DOC + docType.name());
			salesSyncDataService.publishSalesMessagesToQueue(syncDto);
		}
		return salesDocDao.getDocNo();
	}

	@Override
	public Integer getDocNumber(SalesDocTypeEnum docType, Short fiscalYear, int count) {
		SalesDocDaoExt salesDocDao = salesDocService.getDocNumber(docType, fiscalYear, count,
				CommonUtil.getLocationCode());
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			SyncStagingDto syncDto = salesDocStaging(salesDocDao, SalesOperationCode.SALES_DOC + docType.name());
			salesSyncDataService.publishSalesMessagesToQueue(syncDto);
		}
		return salesDocDao.getDocNo();
	}

	@Override
	@Transactional(propagation = Propagation.REQUIRES_NEW)
	public synchronized SalesDocDaoExt getDocNumber(SalesDocTypeEnum docType, Short fiscalYear, int count,
			String locationCode) {
		Optional<SalesDocDaoExt> salesDocDaoOptional = salesDocRepository
				.findOneByLocationCodeAndDocTypeAndFiscalYear(locationCode, docType.name(), fiscalYear);
		SalesDocDaoExt salesDocDao = null;
		if (!salesDocDaoOptional.isPresent()) {
			salesDocDao = new SalesDocDaoExt();
			salesDocDao.setDocNo(count);
			salesDocDao.setFiscalYear(fiscalYear);
			salesDocDao.setDocType(docType.name());
			salesDocDao.setLocationCode(locationCode);
		} else {
			salesDocDao = salesDocDaoOptional.get();
			// DB val 2, I need 4, so numbers are 3, 4, 5, 6 calc(getDocNo() + count)
			salesDocDao.setDocNo(salesDocDao.getDocNo() + count);
			salesDocDao.setSrcSyncId(salesDocDao.getSrcSyncId() + 1);
		}
		salesDocDao = salesDocRepository.saveAndFlush(salesDocDao);

		if (SalesDocTypeEnum.getDocTypesForAudit().contains(docType)) {
			DocNoFailAuditThreadLocal.setIntialDocNoFailData(new ArrayList<>());
			DocNoFailAuditThreadLocal.setDocNoFailData(new DocNoFailAuditDto(salesDocDao.getDocNo(), docType.name(),
					null, locationCode, fiscalYear, null, null));
		}

		return salesDocDao;
	}

	/**
	 * @param salesDocDao
	 * @param customerVisitDao
	 * @param customerVisit
	 * @return
	 */
	private SyncStagingDto salesDocStaging(SalesDocDaoExt salesDocDao, String operation) {
		SyncStagingDto salesDocStagingDto = new SyncStagingDto();
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add("EPOSS");
		syncDataList.add(DataSyncUtil.createSyncData(new SalesDocSyncDtoExt(salesDocDao), 0));
		MessageRequest salesDocMsgRequest = DataSyncUtil.createMessageRequest(syncDataList, operation, destinations,
				MessageType.FIFO.toString(), DestinationType.SELECTIVE.toString());
		salesDocStagingDto.setMessageRequest(salesDocMsgRequest);
		String salesDocMsgRqst = MapperUtil.getJsonString(salesDocMsgRequest);
		SyncStaging salesDocSyncStaging = new SyncStaging();
		salesDocSyncStaging.setMessage(salesDocMsgRqst);
		salesDocSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		salesDocSyncStaging = saleSyncStagingRepository.save(salesDocSyncStaging);
		salesDocStagingDto.setId(salesDocSyncStaging.getId());
		return salesDocStagingDto;
	}

	@Override
	public Integer getDocNumber(SalesDocTypeEnum docType, Short fiscalYear, String locationCode) {
		SalesDocDaoExt salesDocDao = salesDocService.getDocNumber(docType, fiscalYear, 1, locationCode);
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			SyncStagingDto syncDto = salesDocStaging(salesDocDao, SalesOperationCode.SALES_DOC + docType.name());
			salesSyncDataService.publishSalesMessagesToQueue(syncDto);
		}
		return salesDocDao.getDocNo();
	}

}
