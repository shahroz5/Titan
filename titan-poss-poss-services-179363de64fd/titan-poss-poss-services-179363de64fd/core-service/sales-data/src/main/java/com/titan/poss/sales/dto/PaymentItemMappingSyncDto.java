/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.PaymentDetailsDao;
import com.titan.poss.sales.dao.PaymentItemMappingDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PaymentItemMappingSyncDto extends SyncableEntity {

	private String id;

	private String paymentDetailsDao;

	private String itemId;

	private BigDecimal amount;

	private String productGroupCode;

	public PaymentItemMappingSyncDto() {

	}

	public PaymentItemMappingSyncDto(PaymentItemMappingDao daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);

		if (daoExt.getPaymentDetailsDao() != null)
			this.setPaymentDetailsDao(daoExt.getPaymentDetailsDao().getId());
	}

	public List<PaymentItemMappingDao> getPaymentItemMappingDaoList(List<PaymentItemMappingSyncDto> syncDtoList) {
		List<PaymentItemMappingDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> daoList.add(getPaymentItemMappingDao(syncDto)));
		return daoList;
	}

	public PaymentItemMappingDao getPaymentItemMappingDao(PaymentItemMappingSyncDto syncDto) {
		PaymentItemMappingDao paymentItemMapping = (PaymentItemMappingDao) MapperUtil.getObjectMapping(syncDto,
				new PaymentItemMappingDao());

		if (syncDto.getPaymentDetailsDao() != null) {
			PaymentDetailsDao payment = new PaymentDetailsDao();
			payment.setId(syncDto.getPaymentDetailsDao());
			paymentItemMapping.setPaymentDetailsDao(payment);
		}
		return paymentItemMapping;
	}

}
