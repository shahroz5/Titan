/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncTimeDao;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.PayeeBankDao;
import com.titan.poss.payment.dao.PayeeBankLocationMappingDao;
import com.titan.poss.payment.dao.PaymentDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PayeeBankLocationSyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String id;

	private String payeeBank;

	private String payment;

	private String locationCode;

	private String glCode;

	private Boolean isDefault;

	public PayeeBankLocationMappingDao getPayeeBankLocation(PayeeBankLocationSyncDto syncDto) {
		PayeeBankLocationMappingDao payeeBankLocation = (PayeeBankLocationMappingDao) MapperUtil
				.getObjectMapping(syncDto, new PayeeBankLocationMappingDao());

		PaymentDao paymentDao = new PaymentDao();
		paymentDao.setPaymentCode(syncDto.getPayment());

		payeeBankLocation.setPayment(paymentDao);

		PayeeBankDao payeeBankDao = new PayeeBankDao();
		payeeBankDao.setBankName(syncDto.getPayeeBank());

		payeeBankLocation.setPayeeBank(payeeBankDao);

		return payeeBankLocation;
	}

	public List<PayeeBankLocationMappingDao> getDaoList(List<PayeeBankLocationSyncDto> syncDtoList) {

		List<PayeeBankLocationMappingDao> daoList = new ArrayList<>();
		for (PayeeBankLocationSyncDto syncDto : syncDtoList) {
			PayeeBankLocationSyncDto dto = new PayeeBankLocationSyncDto();
			daoList.add(dto.getPayeeBankLocation(syncDto));
		}
		return daoList;

	}
}
