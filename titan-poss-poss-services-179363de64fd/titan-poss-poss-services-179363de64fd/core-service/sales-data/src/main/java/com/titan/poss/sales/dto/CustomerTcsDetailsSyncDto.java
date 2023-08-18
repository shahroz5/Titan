package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerTcsDetailsDao;
import com.titan.poss.sales.dao.SalesTxnDao;
import com.titan.poss.sales.dao.SalesTxnDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerTcsDetailsSyncDto extends SyncableEntity {

	private String id;

	private String salesTxnDao;

	private String brandCode;

	private String ownerType;

	private String locationCode;

	private String customer;

	private String mobileNumber;

	private String ulpId;

	private String storePan;

	private Integer docNo;

	private Short fiscalYear;

	private Date transactionDate;

	private BigDecimal tcsEligibleAmount;

	private BigDecimal tcsApplicableAmount;

	private BigDecimal tcsPercentage;

	private BigDecimal tcsAmountPaid;

	private BigDecimal netInvoiceAmount;
	
	public CustomerTcsDetailsSyncDto() {
		
	}
	
	public CustomerTcsDetailsSyncDto(CustomerTcsDetailsDao customerTcsDetailsDaoExt) {
		MapperUtil.getObjectMapping(customerTcsDetailsDaoExt, this);
		if (customerTcsDetailsDaoExt.getCustomer() != null)
			this.setCustomer(customerTcsDetailsDaoExt.getCustomer().getId());
		if (customerTcsDetailsDaoExt.getSalesTxnDao() != null) {
			this.setLocationCode(customerTcsDetailsDaoExt.getLocationCode());
			this.setCustomer(customerTcsDetailsDaoExt.getCustomer().getId());
		}
	}
	
	public List<CustomerTcsDetailsDao> getCustomerTcsDetailsDaoList(List<CustomerTcsDetailsSyncDto> syncDtoList){
		List<CustomerTcsDetailsDao> daoList=new ArrayList<>();
		syncDtoList.forEach(syncDto->daoList.add(getCustomerTcsDetailsDao(syncDto)));
		return daoList;
	}

	public CustomerTcsDetailsDao getCustomerTcsDetailsDao(CustomerTcsDetailsSyncDto syncDto) {
		CustomerTcsDetailsDao customerTcsDetails=(CustomerTcsDetailsDao)MapperUtil.getObjectMapping(syncDto,new CustomerTcsDetailsDao());
		if(syncDto.getCustomer()!=null) {
			CustomerDao custDao=new CustomerDao();
			custDao.setId(syncDto.getCustomer());
			customerTcsDetails.setCustomer(custDao);
		}
		if(syncDto.getSalesTxnDao()!=null) {
			SalesTxnDao salesTxnDaoExt=new SalesTxnDao();
			salesTxnDaoExt.setId(syncDto.getSalesTxnDao());
			customerTcsDetails.setSalesTxnDao(salesTxnDaoExt);
		}
		return customerTcsDetails;
	}
	
}
