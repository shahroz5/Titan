package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerLocationMappingIdDao;
import com.titan.poss.sales.dao.PaymentRequestsDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PaymentRequestSyncDto extends SyncableEntity{
	
	private String id;

	private String customerLocationMap;

	private String referenceId;

	private String paymentCode;

	private BigDecimal amount;

	private BigDecimal utilizedAmount;

	private String status;

	private String requestedBy; 

	private Date requestedDate;

	private String requestedReason;

	private String approvedBy;

	private Date approvedDate;

	private String approvedReason;

	private String otherDetails;

	private Short fiscalYear;

	private String currencyCode;

	private Date docDate;
	
	private Boolean isCnGenerated;
	
	private Integer customerId;

	private String locationCode;
	
	
	public PaymentRequestSyncDto() {
		
	}
    public PaymentRequestSyncDto(PaymentRequestsDao syncDao) {
    	MapperUtil.getObjectMapping(syncDao, this);	
    	if (syncDao.getCustomerLocationMap() != null) {
			this.setLocationCode(syncDao.getCustomerLocationMap().getCustomerLocationMappingId().getLocationCode());
			this.setCustomerId(syncDao.getCustomerLocationMap().getCustomerLocationMappingId().getCustomerId());
		}
    	
	}
    public List<PaymentRequestsDao> getPaymentRequestDaoList(List<PaymentRequestSyncDto> syncDtoList){
		List<PaymentRequestsDao> daoList=new ArrayList<>();
		syncDtoList.forEach(syncDto->daoList.add(getPaymentRequestDao(syncDto)));
		return daoList;
	}
	public PaymentRequestsDao getPaymentRequestDao(PaymentRequestSyncDto syncDto) {
		PaymentRequestsDao paymentRequest=(PaymentRequestsDao)MapperUtil.getObjectMapping(syncDto,new PaymentRequestsDao());
		if(syncDto.getLocationCode()!=null && syncDto.getCustomerId()!=null) {
			CustomerLocationMappingIdDao custId=new CustomerLocationMappingIdDao();
			custId.setCustomerId(syncDto.getCustomerId());
			custId.setLocationCode(syncDto.getLocationCode());
			CustomerLocationMappingDao customerLoc=new CustomerLocationMappingDao();
			customerLoc.setCustomerLocationMappingId(custId);
			paymentRequest.setCustomerLocationMap(customerLoc);
		}
		return paymentRequest;
	}

}
