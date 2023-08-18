package com.titan.poss.payment.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.payment.dao.ConfigDetailsDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class ConfigDetailsSyncDtoExt extends ConfigDetailsSyncDto {

	private static final long serialVersionUID = 1L;

	public ConfigDetailsSyncDtoExt() {

	}

	public ConfigDetailsSyncDtoExt(ConfigDetailsDaoExt config) {
		MapperUtil.getObjectMapping(config, this);
		this.setConfigId(config.getConfigId().getConfigId());
		this.setPayment(config.getPayment().getPaymentCode());
		this.setTransactionType(config.getTransactionDao().getTransactionType());
		if (config.getConfigDetails() != null)
			this.setConfigDetails(config.getConfigDetails());
	}
}
