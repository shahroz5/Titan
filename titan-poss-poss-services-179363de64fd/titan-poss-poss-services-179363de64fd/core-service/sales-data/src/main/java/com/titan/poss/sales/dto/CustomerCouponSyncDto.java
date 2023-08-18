/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CustomerCouponDao;
import com.titan.poss.sales.dao.CustomerDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerCouponSyncDto extends MasterSyncableEntity {

	private String couponType;

	private String couponCode;

	private Date docDate;

	private String refId;

	private String status;

	private Date expiryDate;

	private Integer attempts;
	
	private Integer totalCount;

	private String id;

	private String customer;

	public CustomerCouponSyncDto() {

	}

	public CustomerCouponDao getCustomerCoupon(CustomerCouponSyncDto syncDto) {
		CustomerCouponDao customerCoupon = (CustomerCouponDao) MapperUtil.getObjectMapping(syncDto,
				new CustomerCouponDao());
		CustomerDao customerDao = new CustomerDao();
		customerDao.setId(syncDto.getCustomer());
		customerCoupon.setCustomer(customerDao);
		return customerCoupon;
	}

	public List<CustomerCouponDao> getCustomerCouponsDaoList(List<CustomerCouponSyncDto> customerSyncDtoList) {
		List<CustomerCouponDao> daoList = new ArrayList<>();
		if (!customerSyncDtoList.isEmpty())
			daoList = customerSyncDtoList.stream().map(syncDto -> syncDto.getCustomerCoupon(syncDto))
					.collect(Collectors.toList());
		return daoList;
	}
}
