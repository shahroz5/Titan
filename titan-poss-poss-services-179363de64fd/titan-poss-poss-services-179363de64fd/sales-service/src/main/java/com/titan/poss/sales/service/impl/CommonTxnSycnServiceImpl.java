/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.dto.DestinationType;
import com.titan.poss.core.dto.MessageRequest;
import com.titan.poss.core.dto.MessageType;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.core.utils.CollectionUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.constant.SalesOperationCode;
import com.titan.poss.datasync.dto.SyncStagingDto;
import com.titan.poss.datasync.util.DataSyncUtil;
import com.titan.poss.sales.dao.DiscountConfigDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountDetailsDaoExt;
import com.titan.poss.sales.dao.DiscountItemDetailsDaoExt;
import com.titan.poss.sales.dao.DocNumberFailAuditDaoExt;
import com.titan.poss.sales.dao.PaymentDetailsDaoExt;
import com.titan.poss.sales.dao.SalesTxnDaoExt;
import com.titan.poss.sales.dao.SyncStaging;
import com.titan.poss.sales.dto.CustomerPaymentSyncDto;
import com.titan.poss.sales.dto.DiscountConfigDetailsSyncDtoExt;
import com.titan.poss.sales.dto.DiscountDetailsSyncDtoExt;
import com.titan.poss.sales.dto.DiscountItemDetailsSyncDtoExt;
import com.titan.poss.sales.dto.DocNumberFailAuditSyncDtoExt;
import com.titan.poss.sales.dto.PaymentDetailsSyncDtoExt;
import com.titan.poss.sales.dto.SalesTxnSyncDtoExt;
import com.titan.poss.sales.dto.constants.PaymentStatusEnum;
import com.titan.poss.sales.repository.DiscountConfigDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountDetailsRepositoryExt;
import com.titan.poss.sales.repository.DiscountItemDetailsRepositoryExt;
import com.titan.poss.sales.repository.DocNumberFailAuditDaoRepositoryExt;
import com.titan.poss.sales.repository.PaymentDetailsRepositoryExt;
import com.titan.poss.sales.repository.SalesSyncStagingRepository;
import com.titan.poss.sales.repository.SalesTxnRepositoryExt;
import com.titan.poss.sales.service.CommonTxnSycnService;
import com.titan.poss.sales.service.SalesSyncDataService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("salesCommonTxnSycnServiceImpl")
public class CommonTxnSycnServiceImpl implements CommonTxnSycnService {

	@Value("${app.name}")
	private String appName;

	@Autowired
	private SalesTxnRepositoryExt salesTxnRepository;

	@Autowired
	private PaymentDetailsRepositoryExt paymentDetailsRepository;

	@Autowired
	private DiscountConfigDetailsRepositoryExt discountConfigDetailsRepository;

	@Autowired
	private DiscountDetailsRepositoryExt discountDetailsRepository;

	@Autowired
	private DiscountItemDetailsRepositoryExt discountItemDetailsRepository;

	@Autowired
	private SalesSyncStagingRepository saleSyncStagingRepository;

	@Autowired
	private DocNumberFailAuditDaoRepositoryExt docNumberFailAuditRepo;
	
	@Autowired
	private SalesSyncDataService salesSyncDataService;

	@Override
	public SyncStagingDto discountSyncStagging(SalesTxnDaoExt salesTxn) {

		// sync for discounts iff discount is applied.
		List<DiscountItemDetailsDaoExt> discountItemDetails = discountItemDetailsRepository
				.findByDiscountDetailSalesTxnId(salesTxn.getId());
		if (CollectionUtil.isEmpty(discountItemDetails) || (!AppTypeEnum.POSS.name().equalsIgnoreCase(appName))) {
			return null;
		}

		salesTxn.setSrcSyncId(salesTxn.getSrcSyncId() + 1);
		salesTxn = salesTxnRepository.save(salesTxn);
		// also, sync payments if they are related to discount
		SyncStagingDto txnDiscountStagingDto = null;

		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());

		syncDataList.add(DataSyncUtil.createSyncData(new SalesTxnSyncDtoExt(salesTxn,null), 0));
		// as loop by discount item details is not working
		List<DiscountDetailsDaoExt> discountDetailsList = discountDetailsRepository
				.findAllBySalesTxnId(salesTxn.getId());
		Set<DiscountConfigDetailsDaoExt> discountConfigDetailsList = discountDetailsList.stream()
				.map(DiscountDetailsDaoExt::getDiscountConfig).collect(Collectors.toSet());
		Set<String> paymentIdList = discountDetailsRepository.findPaymentIdInDiscountByTxnId(salesTxn.getId());
		List<PaymentDetailsDaoExt> paymentList = new ArrayList<>();
		if (!CollectionUtil.isEmpty(paymentIdList)) {
			paymentList = paymentDetailsRepository.findByIdInAndSalesTxnDaoLocationCodeAndStatus(paymentIdList,
					salesTxn.getLocationCode(), PaymentStatusEnum.COMPLETED.name());
		}
		if (!CollectionUtil.isEmpty(paymentList)) {
			List<PaymentDetailsSyncDtoExt> dtoExtList = new ArrayList<>();
			paymentList.forEach(daoExt -> {
				daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
				dtoExtList.add(new PaymentDetailsSyncDtoExt(daoExt));
			});
			paymentDetailsRepository.saveAll(paymentList);
			syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 1));
		}
		if (!CollectionUtil.isEmpty(discountConfigDetailsList)) {
			List<DiscountConfigDetailsSyncDtoExt> dtoExtList = new ArrayList<>();
			discountConfigDetailsList.forEach(daoExt -> {
				daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
				dtoExtList.add(new DiscountConfigDetailsSyncDtoExt(daoExt));
			});
			discountConfigDetailsRepository.saveAll(discountConfigDetailsList);
			syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 2));
		}
		if (!CollectionUtil.isEmpty(discountDetailsList)) {
			List<DiscountDetailsSyncDtoExt> dtoExtList = new ArrayList<>();
			discountDetailsList.forEach(daoExt -> {
				daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
				dtoExtList.add(new DiscountDetailsSyncDtoExt(daoExt));
			});
			discountDetailsRepository.saveAll(discountDetailsList);
			syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 3));
		}
		if (!CollectionUtil.isEmpty(discountItemDetails)) {
			List<DiscountItemDetailsSyncDtoExt> dtoExtList = new ArrayList<>();
			discountItemDetails.forEach(daoExt -> {
				daoExt.setSrcSyncId(daoExt.getSrcSyncId() + 1);
				dtoExtList.add(new DiscountItemDetailsSyncDtoExt(daoExt));
			});
			discountItemDetailsRepository.saveAll(discountItemDetails);
			syncDataList.add(DataSyncUtil.createSyncData(dtoExtList, 4));
		}

		MessageRequest txnDiscountMsgRequest = DataSyncUtil.createMessageRequest(syncDataList,
				SalesOperationCode.SALES_DISCOUNT, destinations, MessageType.FIFO.toString(),
				DestinationType.SELECTIVE.toString());
		txnDiscountStagingDto = new SyncStagingDto();
		txnDiscountStagingDto.setMessageRequest(txnDiscountMsgRequest);
		String cashMemoMsgRqst = MapperUtil.getJsonString(txnDiscountMsgRequest);
		SyncStaging txnDiscountSyncStaging = new SyncStaging();
		txnDiscountSyncStaging.setMessage(cashMemoMsgRqst);
		txnDiscountSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
		txnDiscountSyncStaging = saleSyncStagingRepository.save(txnDiscountSyncStaging);
		txnDiscountStagingDto.setId(txnDiscountSyncStaging.getId());

		return txnDiscountStagingDto;
	}

	@Override
	public void syncDataDocNumberFailAudit(DocNumberFailAuditDaoExt docNumberFailAuditDaoExt) {
		List<SyncData> syncDataList = new ArrayList<>();
		List<String> destinations = new ArrayList<>();
		destinations.add(AppTypeEnum.EPOSS.name());
		if (AppTypeEnum.POSS.name().equalsIgnoreCase(appName)) {
			List<DocNumberFailAuditSyncDtoExt> syncDtoList = new ArrayList<>();
			docNumberFailAuditDaoExt.setSrcSyncId(docNumberFailAuditDaoExt.getSrcSyncId()==null?1:docNumberFailAuditDaoExt.getSrcSyncId() + 1);
			syncDtoList.add(new DocNumberFailAuditSyncDtoExt(docNumberFailAuditDaoExt));
			syncDataList.add(DataSyncUtil.createSyncData(syncDtoList, 0));
			docNumberFailAuditRepo.save(docNumberFailAuditDaoExt);
			MessageRequest docNumberMsgRequest = DataSyncUtil.createMessageRequest(syncDataList,
					SalesOperationCode.DOC_NUMBER_FAIL_AUDIT, destinations, MessageType.FIFO.toString(),
					DestinationType.SELECTIVE.toString());
			SyncStagingDto cpStagingDto = new SyncStagingDto();
			cpStagingDto.setMessageRequest(docNumberMsgRequest);
			String cpMsgRequest = MapperUtil.getJsonString(docNumberMsgRequest);
			SyncStaging cpSyncStaging = new SyncStaging();
			cpSyncStaging.setMessage(cpMsgRequest);
			cpSyncStaging.setStatus(DatasyncStatusEnum.IN_PROGRESS.name());
			cpSyncStaging = saleSyncStagingRepository.save(cpSyncStaging);
			cpStagingDto.setId(cpSyncStaging.getId());	
			salesSyncDataService.publishSalesMessagesToQueue(cpStagingDto);
		}
	}


}
