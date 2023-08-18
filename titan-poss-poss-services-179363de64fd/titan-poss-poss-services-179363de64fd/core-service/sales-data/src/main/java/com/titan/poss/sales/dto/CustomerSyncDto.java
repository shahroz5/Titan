package com.titan.poss.sales.dto;

import javax.persistence.Column;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CustomerDao;

/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerSyncDto extends MasterSyncableEntity{
	private String id;
	
	private String ulpId;

	private String mobileNumber;

	private String customerType;

	private String title;

	private String customerName;

	private String emailId;

	private String customerDetails;

	private Boolean isEncrypted;

	private String instiTaxNo;

	private String custTaxNo;

	private String passportId;

	private String emailValidationDetails;
	
	private Boolean isInstiTaxNoVerified;

	private Boolean iscustTaxNoVerified;
	
	private Boolean isEmailIdValidationInitiated;

	private Boolean isEmailIdValidated;
	
	private String custTaxNoOld;
	
	private Boolean isCustTaxMatched;
	
	private Boolean isForm60Matched;
	
	private String panHolderName;
	
	public CustomerDao getCustomerDao(CustomerSyncDto syncDto) {
		return (CustomerDao)MapperUtil.getObjectMapping(syncDto,new CustomerDao());
	} 
	public CustomerSyncDto(CustomerDao dao){
		MapperUtil.getObjectMapping(dao,this);
	}
	public CustomerSyncDto(){
	}
}
