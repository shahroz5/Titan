/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncTimeDao;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.PaymentCategoryDao;
import com.titan.poss.payment.dao.PaymentProductDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PaymentProductSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String id;

	private String paymentCategoryDao;

	private String productGroupCode;

	public PaymentProductDao getPaymentProductDao(PaymentProductSyncDto syncDto) {
		PaymentProductDao paymentProductDao = (PaymentProductDao) MapperUtil.getObjectMapping(syncDto,
				new PaymentProductDao());

		PaymentCategoryDao paymentCategory = new PaymentCategoryDao();
		paymentCategory.setPaymentCategoryName(syncDto.getPaymentCategoryDao());

		paymentProductDao.setPaymentCategoryDao(paymentCategory);

		return paymentProductDao;
	}

	public List<PaymentProductDao> getDaoList(List<PaymentProductSyncDto> syncDtoList) {

		List<PaymentProductDao> daoList = new ArrayList<>();
		for (PaymentProductSyncDto syncDto : syncDtoList) {
			PaymentProductSyncDto dto = new PaymentProductSyncDto();
			daoList.add(dto.getPaymentProductDao(syncDto));
		}
		return daoList;

	}
}
