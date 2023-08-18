/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerLocationMappingIdDao;
import com.titan.poss.sales.dao.CustomerPaymentDao;
import com.titan.poss.sales.dao.PaymentDetailsDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerPaymentSyncDto extends SyncableEntity{
	
	private String customerType;

	private String customerIdentifier1;

	private String customerIdentifier2;

	private String paymentCode;

	private String paymentType;

	private String instrumentNo;
	
	private BigDecimal paidAmount;

	private BigDecimal cashAmount;

	private String txnType;

	private Date paymentDate;// business date of payment confirmation

	private Date instrumentDate;

	private String storeType;

	private String stateCode;

	private String countryCode;

	private String companyName;

	private String id;

	private String customer;

	private Integer customerId;

	private String locationCode;
	
	private String locationPanNumber;

	private String paymentDetailsDao;
	
	public CustomerPaymentSyncDto() {

	}

	public CustomerPaymentSyncDto(CustomerPaymentDao daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		if (daoExt.getCustomer() != null)
			this.setCustomer(daoExt.getCustomer().getId());
		if (daoExt.getCustomerLocationMap() != null) {
			this.setLocationCode(daoExt.getCustomerLocationMap().getCustomerLocationMappingId().getLocationCode());
			this.setCustomerId(daoExt.getCustomerLocationMap().getCustomerLocationMappingId().getCustomerId());
		}
		if (daoExt.getPaymentDetailsDao() != null)
			this.setPaymentDetailsDao(daoExt.getPaymentDetailsDao().getId());
	}

	public List<CustomerPaymentDao> getCustomerPaymentDaoList(List<CustomerPaymentSyncDto> syncDtoList){
		List<CustomerPaymentDao> daoList=new ArrayList<>();
		syncDtoList.forEach(syncDto->daoList.add(getCustomerPaymentDao(syncDto)));
		return daoList;
	}
	
	public CustomerPaymentDao getCustomerPaymentDao(CustomerPaymentSyncDto syncDto) {
		CustomerPaymentDao customerPayment=(CustomerPaymentDao)MapperUtil.getObjectMapping(syncDto,new CustomerPaymentDao());
		if(syncDto.getCustomer()!=null) {
			CustomerDao custDao=new CustomerDao();
			custDao.setId(syncDto.getCustomer());
			customerPayment.setCustomer(custDao);
		}
		if(syncDto.getLocationCode()!=null && syncDto.getCustomerId()!=null) {
			CustomerLocationMappingIdDao custId=new CustomerLocationMappingIdDao();
			custId.setCustomerId(syncDto.getCustomerId());
			custId.setLocationCode(syncDto.getLocationCode());
			CustomerLocationMappingDao customerLoc=new CustomerLocationMappingDao();
			customerLoc.setCustomerLocationMappingId(custId);
			customerPayment.setCustomerLocationMap(customerLoc);
		}
		if(syncDto.getPaymentDetailsDao()!=null) {
			PaymentDetailsDao payment=new PaymentDetailsDao();
			payment.setId(syncDto.getPaymentDetailsDao());
			customerPayment.setPaymentDetailsDao(payment);
		}
		return customerPayment;
	}
	
}
