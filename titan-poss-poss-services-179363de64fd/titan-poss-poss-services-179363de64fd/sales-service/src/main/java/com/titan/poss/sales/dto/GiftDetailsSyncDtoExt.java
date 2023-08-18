package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.GiftDetailsDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class GiftDetailsSyncDtoExt extends GiftDetailsSyncDto {
	public GiftDetailsSyncDtoExt() {

	}

	public GiftDetailsSyncDtoExt(GiftDetailsDaoExt dao) {
		MapperUtil.getObjectMapping(dao, this);
		this.setCashMemoDao(dao.getCashMemoDao().getId());
	}
}
