/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.sales.dao.CustomerDocumentsDao;
import com.titan.poss.sales.dto.constants.UploadFileDocTypeEnum;
import com.titan.poss.sales.repository.CustomerDocumentsRepository;
import com.titan.poss.sales.service.CustomerDocumentService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class CustomerDocumentServiceImpl implements CustomerDocumentService {

	@Autowired
	private CustomerDocumentsRepository customerDocRepo;

	@Override
	public CustomerDocumentsDao getOldCustomerDocumentByInput(String txnId, String documentType, String fileType) {

		return customerDocRepo.findByTxnIdAndLocationCodeAndDocumentTypeAndFileTypeAndIsActiveTrue(txnId,
				CommonUtil.getLocationCode(), documentType, fileType);
	}

	@Override
	public CustomerDocumentsDao save(CustomerDocumentsDao cd) {
		return customerDocRepo.save(cd);
	}

	@Override
	public List<CustomerDocumentsDao> saveAll(List<CustomerDocumentsDao> cds) {
		return customerDocRepo.saveAll(cds);
	}

	@Override
	public void deactivateCustomerDoc(CustomerDocumentsDao cd) {
		cd.setIsActive(false);
		customerDocRepo.save(cd);

	}

	@Override
	public CustomerDocumentsDao getActiveDocByCustomerId(String customerId, String documentType, String fileType) {

		return customerDocRepo.findByCustomerIdAndDocumentTypeAndFileTypeAndIsActiveTrue(customerId, documentType,
				fileType);
	}

	@Override
	public CustomerDocumentsDao getActiveDocByTxnId(String txnId, String documentType, String fileType) {

		return customerDocRepo.findByTxnIdAndLocationCodeAndDocumentTypeAndFileTypeAndIsActiveTrue(txnId,
				CommonUtil.getLocationCode(), documentType, fileType);
	}

	@Override
	public List<CustomerDocumentsDao> getActiveCustomerDocsByCustomerId(String customerId) {

		return customerDocRepo.findByCustomerIdAndDocumentTypeAndIsActiveTrue(customerId,
				UploadFileDocTypeEnum.CUSTOMER.name());
	}

	@Override
	public List<CustomerDocumentsDao> getActiveDocsByTxnId(String txnId) {
		return customerDocRepo.findByTxnIdAndLocationCodeAndIsActiveTrue(txnId, CommonUtil.getLocationCode());
	}

	@Override
	public List<CustomerDocumentsDao> getActiveUnsyncedDocs() {

		return customerDocRepo.findByIsActiveTrueAndIsSyncedFalse();
	}

}
