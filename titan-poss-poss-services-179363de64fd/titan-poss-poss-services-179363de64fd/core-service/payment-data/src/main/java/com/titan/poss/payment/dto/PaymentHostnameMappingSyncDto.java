/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.PaymentHostnameMappingDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class PaymentHostnameMappingSyncDto extends MasterSyncableEntity{

	private String id;

	private String locationCode;

	private String hostName;

	private String deviceId;

	private String paymentCode;
	
	private String correlationId;

	public PaymentHostnameMappingSyncDto() {

	}


	public PaymentHostnameMappingDao getPaymentHostnameMapping(PaymentHostnameMappingSyncDto paymentHostnameMappingSyncDto) {
		return (PaymentHostnameMappingDao) MapperUtil.getObjectMapping(paymentHostnameMappingSyncDto, new PaymentHostnameMappingDao());
	}

	public List<PaymentHostnameMappingDao> getDaoList(List<PaymentHostnameMappingSyncDto> dtoList) {
		List<PaymentHostnameMappingDao> daoList = new ArrayList<>();
		dtoList.forEach(dto -> {
			PaymentHostnameMappingSyncDto syncDto = new PaymentHostnameMappingSyncDto();
			daoList.add(syncDto.getPaymentHostnameMapping(dto));
		});
		return daoList;
	}

}
