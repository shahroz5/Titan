package com.titan.poss.sales.dto;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CustomerDao;
import com.titan.poss.sales.dao.CustomerDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerSyncDtoExt extends CustomerSyncDto {
	public CustomerSyncDtoExt() {

	}

	public CustomerSyncDtoExt(CustomerDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt,this);
	}

	public CustomerSyncDtoExt(CustomerDao dao) {
		MapperUtil.getObjectMapping(dao,this);
	}
}
