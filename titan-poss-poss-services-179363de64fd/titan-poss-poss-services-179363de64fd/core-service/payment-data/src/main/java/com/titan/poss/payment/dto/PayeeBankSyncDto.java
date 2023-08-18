/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.payment.dto;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.PayeeBankDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class PayeeBankSyncDto extends MasterSyncableEntity {

	private String bankName;

	private String bankCode;

	private String ownerType;

	private String address;

	private String stateName;

	private String townName;

	private String contactPerson;

	private String mailId;

	public PayeeBankSyncDto() {

	}

	public PayeeBankSyncDto(PayeeBankDao payeeBankDao) {
		MapperUtil.getObjectMapping(payeeBankDao, this);
	}

	public PayeeBankDao getPayeeBankDao(PayeeBankSyncDto payeeBankSyncDto) {
		return (PayeeBankDao) MapperUtil.getObjectMapping(payeeBankSyncDto, new PayeeBankDao());
	}

}
