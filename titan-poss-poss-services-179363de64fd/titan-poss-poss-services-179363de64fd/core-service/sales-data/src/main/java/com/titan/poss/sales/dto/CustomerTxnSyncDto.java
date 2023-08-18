/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CustomerTxnDao;
import com.titan.poss.sales.dao.SalesTxnDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerTxnSyncDto extends MasterSyncableEntity {

	private String id;

	private String locationCode;

	private String ulpId;

	private String mobileNumber;

	private String customerType;

	private String title;

	private String customerName;

	private String emailId;

	private String customerDetails;

	private Boolean isEncrypted;

	private Integer customerId;

	private String instiTaxNo;

	private String custTaxNo;

	private String passportId;
	
	private String salesTxnDao;
	
	public CustomerTxnDao getCustomerTxnDao(CustomerTxnSyncDto syncDto) {
		CustomerTxnDao customerTxnDao=(CustomerTxnDao)MapperUtil.getObjectMapping(syncDto,new CustomerTxnDao());
		SalesTxnDao slTxnDao=new SalesTxnDao();
		slTxnDao.setId(syncDto.getSalesTxnDao());
		customerTxnDao.setSalesTxnDao(slTxnDao);
		return customerTxnDao;
	}

}
