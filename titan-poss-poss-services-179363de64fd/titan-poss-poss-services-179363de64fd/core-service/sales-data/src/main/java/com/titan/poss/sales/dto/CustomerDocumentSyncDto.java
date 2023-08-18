/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerDocumentsDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerDocumentSyncDto extends MasterSyncableEntity{
	private String id;

	private String txnId;

	private String customer;

	private String locationCode;

	private String documentType;

	private String fileType;

	private String fileSubType;

	private String documentPath;

	private Boolean isSynced;
	
	private String processId;
	
	private String status;
	
	public CustomerDocumentsDao getCustomerDocumentsDao(CustomerDocumentSyncDto syncDto) {
		CustomerDocumentsDao dao=(CustomerDocumentsDao)MapperUtil.getObjectMapping(syncDto, new CustomerDocumentsDao());
		if(syncDto.getCustomer()!=null) {
			CustomerDao custmer=new CustomerDao();
			custmer.setId(syncDto.getCustomer());
			dao.setCustomer(custmer);
		}
		return dao;
		
	}
	public CustomerDocumentSyncDto() {
		
	}
	public CustomerDocumentSyncDto(CustomerDocumentsDao custDao) {
		MapperUtil.getObjectMapping(custDao, this);
		if(custDao.getCustomer()!=null)
			this.setCustomer(custDao.getCustomer().getId());
	}
	
	public List<CustomerDocumentsDao> getCustomerDocumentsDaoList(List<CustomerDocumentSyncDto> customerSyncDtoList) {
		List<CustomerDocumentsDao> daoList=new ArrayList<>();
		if(!customerSyncDtoList.isEmpty())
			daoList=customerSyncDtoList.stream().map(syncDto->syncDto.getCustomerDocumentsDao(syncDto)).collect(Collectors.toList());
		return daoList;
	}
}
