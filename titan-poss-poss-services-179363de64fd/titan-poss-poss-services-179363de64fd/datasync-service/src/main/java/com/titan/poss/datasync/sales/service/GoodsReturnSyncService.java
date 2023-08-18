/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
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
import com.titan.poss.inventory.dao.InventoryDetailsDao;
import com.titan.poss.inventory.repository.InventoryDetailsRepository;
import com.titan.poss.sales.dao.CancelDao;
import com.titan.poss.sales.dao.CreditNoteDao;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerPaymentDao;
import com.titan.poss.sales.dao.GrnDao;
import com.titan.poss.sales.dao.GrnDetailsDao;
import com.titan.poss.sales.dto.CancelSyncDto;
import com.titan.poss.sales.dto.CustomerLocationMappingSyncDto;
import com.titan.poss.sales.dto.GrnDetailsSyncDto;
import com.titan.poss.sales.dto.GrnSynDto;
import com.titan.poss.sales.repository.CancellationRepository;
import com.titan.poss.sales.repository.CreditNoteRepository;
import com.titan.poss.sales.repository.CustomerDocumentsRepository;
import com.titan.poss.sales.repository.CustomerLocationMappingRepository;
import com.titan.poss.sales.repository.GrnDetailsRepository;
import com.titan.poss.sales.repository.GrnRepository;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service
public class GoodsReturnSyncService implements SyncOperation{
	
	@Autowired
	private DatasyncAuditService datasyncAuditService;
	
	@Autowired
	private SalesCommonUtil salesCommon;
	
	@Autowired
	private GoodsReturnSyncService goodReturnSyncService;
	
	private static final Logger LOGGER = LoggerFactory.getLogger(GoodsReturnSyncService.class);
	private static final String EXCEPTION = "exception : ";
	
	@Autowired
	private CancellationRepository cancelRepository;
	
	@Autowired
	private InventoryDetailsRepository inventoryDetailsRepo;
	
	@Autowired
	private CreditNoteRepository creditRepository;
	
	@Autowired
	private CustomerLocationMappingRepository customerLocationRepo;
	
	@Autowired
	private GrnRepository grnRepo;
	
	@Autowired
	private GrnDetailsRepository grnDetailsRepo;
	
	@Autowired
	private CustomerDocumentsRepository customerDocRepo;

	@Override
	public void operation(MessageTransfer messageTransfer) {
		List<SyncData> syncDataList = ReceiverUtil.sortSyncData(messageTransfer.getMessageTransferData().getSyncData());
		String messageId = messageTransfer.getMessageTransferData().getId();
		String operationCode = messageTransfer.getMessageTransferData().getOperation();
		try {
			if (operationCode.equals(SalesOperationCode.GRN_CONFIRM) || operationCode.equals(SalesOperationCode.GRN_CONFIRM_REQ)) {
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
		ObjectMapper mapper = new ObjectMapper();
		GrnDao grn=null;
		List<GrnDetailsDao> grnDetails=new ArrayList<>();
		CancelDao cancel=null;
		List<CreditNoteDao> creditNoteList = new ArrayList<>();
		List<InventoryDetailsDao> inventoryDetailsList = new ArrayList<>();
		CustomerLocationMappingDao customerTxn=null;
		List<CustomerDocumentsDao> customerDocList = new ArrayList<>();
		List<CustomerPaymentDao> customerPaymentList = new ArrayList<>();
		for (SyncData data : syncDataList) {
			if (data.getOrder() == 0) {
				grn = syncGrn(data, mapper);
			} else if (data.getOrder() == 1) {
				syncGrnDetails(data,grnDetails, mapper);
			} else if (data.getOrder() == 2) {
				cancel=syncCancel(data, mapper);
			} else if (data.getOrder() == 3) {
				salesCommon.syncCreditNote(data, creditNoteList, mapper);
			} else if (data.getOrder() == 4) {
				salesCommon.syncInventoryDetails(data,inventoryDetailsList, mapper);
			}  else if (data.getOrder() == 5) {
				customerTxn = syncCustomerLocation(data, mapper);
			}else if (data.getOrder() == 6) {
				salesCommon.syncCustomerDocument(data, customerDocList, mapper);
			}
		}	
		return goodReturnSyncService.dbOperation(grn,grnDetails,cancel,creditNoteList,inventoryDetailsList,customerTxn,customerDocList);
	}
	
	private void syncGrnDetails(SyncData data, List<GrnDetailsDao> grnDetails, ObjectMapper mapper) {
		GrnDetailsSyncDto syncDto=new GrnDetailsSyncDto();
		List<GrnDetailsDao> srcGrnDetails=syncDto.getGrnDetailsDaoList(mapper.convertValue(data.getData(), new TypeReference<List<GrnDetailsSyncDto>>() {
				}));
		srcGrnDetails.forEach(srcGrnDetail->{
			Optional<GrnDetailsDao> destGrnDetail = grnDetailsRepo.findById(srcGrnDetail.getId());
			if (!destGrnDetail.isPresent()) {
				int tempSrcDataSyncId = srcGrnDetail.getSrcSyncId();
				srcGrnDetail.setSrcSyncId(srcGrnDetail.getDestSyncId());
				srcGrnDetail.setDestSyncId(tempSrcDataSyncId);
				grnDetails.add(srcGrnDetail) ;
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcGrnDetail.getSrcSyncId(), srcGrnDetail.getDestSyncId(),
						destGrnDetail.get().getSrcSyncId(), destGrnDetail.get().getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcGrnDetail.getSrcSyncId();
					srcGrnDetail.setSrcSyncId(srcGrnDetail.getDestSyncId());
					srcGrnDetail.setDestSyncId(tempSrcDataSyncId);
					grnDetails.add(srcGrnDetail) ;
				}
			}
		});
	}
	
	private CustomerLocationMappingDao syncCustomerLocation(SyncData data, ObjectMapper mapper) {
		CustomerLocationMappingSyncDto syncDto = new CustomerLocationMappingSyncDto();
		CustomerLocationMappingDao srcDao = syncDto.getCustomerLocationMappingDao(
				mapper.convertValue(data.getData(), new TypeReference<CustomerLocationMappingSyncDto>() {
				}));

		Optional<CustomerLocationMappingDao> destDao = customerLocationRepo
				.findById(srcDao.getCustomerLocationMappingId());
		if (!destDao.isPresent()) {
			int tempSrcDataSyncId = srcDao.getSrcSyncId();
			srcDao.setSrcSyncId(srcDao.getDestSyncId());
			srcDao.setDestSyncId(tempSrcDataSyncId);
			return srcDao;
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcDao.getSrcSyncId(), srcDao.getDestSyncId(),
					destDao.get().getSrcSyncId(), destDao.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcDao.getSrcSyncId();
				srcDao.setSrcSyncId(srcDao.getDestSyncId());
				srcDao.setDestSyncId(tempSrcDataSyncId);
				return srcDao;
			}
		}
		return null;
	}

	private GrnDao syncGrn(SyncData data, ObjectMapper mapper) {
		GrnSynDto syncDto = new GrnSynDto();
		GrnDao srcGrn = syncDto
				.getGrnDao(mapper.convertValue(data.getData(), new TypeReference<GrnSynDto>() {
				}));
		Optional<GrnDao> destGrn = grnRepo.findById(srcGrn.getId());
		if (!destGrn.isPresent()) {
			int tempSrcDataSyncId = srcGrn.getSrcSyncId();
			srcGrn.setSrcSyncId(srcGrn.getDestSyncId());
			srcGrn.setDestSyncId(tempSrcDataSyncId);
			return srcGrn;
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcGrn.getSrcSyncId(), srcGrn.getDestSyncId(),
					destGrn.get().getSrcSyncId(), destGrn.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcGrn.getSrcSyncId();
				srcGrn.setSrcSyncId(srcGrn.getDestSyncId());
				srcGrn.setDestSyncId(tempSrcDataSyncId);
				return srcGrn;
			}
		}
		return null;
	}

	private CancelDao syncCancel(SyncData data, ObjectMapper mapper) {
		CancelSyncDto syncDto = new CancelSyncDto();
		CancelDao srcCancel = syncDto
				.getCancelDao(mapper.convertValue(data.getData(), new TypeReference<CancelSyncDto>() {
				}));
		Optional<CancelDao> destCancel = cancelRepository.findById(srcCancel.getId());
		if (!destCancel.isPresent()) {
			int tempSrcDataSyncId = srcCancel.getSrcSyncId();
			srcCancel.setSrcSyncId(srcCancel.getDestSyncId());
			srcCancel.setDestSyncId(tempSrcDataSyncId);
			return srcCancel;
		} else {
			DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcCancel.getSrcSyncId(), srcCancel.getDestSyncId(),
					destCancel.get().getSrcSyncId(), destCancel.get().getDestSyncId());
			if (status.equals(DatasyncStatusEnum.SYNCED)) {
				int tempSrcDataSyncId = srcCancel.getSrcSyncId();
				srcCancel.setSrcSyncId(srcCancel.getDestSyncId());
				srcCancel.setDestSyncId(tempSrcDataSyncId);
				return srcCancel;
			}
		}
		return null;
	}

	@Transactional(value="chainedTransaction")
	public Boolean dbOperation(GrnDao grn, List<GrnDetailsDao> grnDetails, CancelDao cancel,
			List<CreditNoteDao> creditNoteList, List<InventoryDetailsDao> inventoryDetailsList, CustomerLocationMappingDao customerTxn, List<CustomerDocumentsDao> customerDocList) {
		boolean flag = false;
		if (customerTxn != null) {
			customerLocationRepo.save(customerTxn);
			flag = true;
		}
		if (cancel != null) {
			cancelRepository.save(cancel);
			flag = true;
		}
		if(grn!=null) {
			grnRepo.save(grn);
			flag = true;
		}
		if(!grnDetails.isEmpty()) {
			grnDetailsRepo.saveAll(grnDetails);
			flag = true;
		}
		if (!creditNoteList.isEmpty()) {
			creditNoteList.forEach(cn->{
				String parent=null;
				String oiginal=null;
				if(cn.getParentCn()!=null) {
					 parent=cn.getParentCn().getId();
					 cn.setParentCn(null);
				}
				if(cn.getOriginalCn()!=null) {
					 oiginal=cn.getOriginalCn().getId();
					 cn.setOriginalCn(null);
				}
				cn=creditRepository.saveAndFlush(cn);
				if(parent!=null) {
					 CreditNoteDao cnParent =new CreditNoteDao();
					 cnParent.setId(parent);
					 cn.setParentCn(cnParent);
				}
				if(oiginal!=null) {
					 CreditNoteDao cnOiginal =new CreditNoteDao();
					 cnOiginal.setId(oiginal);
					 cn.setOriginalCn(cnOiginal);
				}
				creditRepository.save(cn);
				
			});
			flag = true;
		}
		if (!inventoryDetailsList.isEmpty()) {
			inventoryDetailsRepo.saveAll(inventoryDetailsList);
			flag = true;
		}
		if (!customerDocList.isEmpty()) {
			customerDocRepo.saveAll(customerDocList);
			flag = true;
		}
		return flag;
	}

}
