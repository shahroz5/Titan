package com.titan.poss.sales.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CustomerTcsDetailsDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class CustomerTcsDetailsSyncDtoExt extends CustomerTcsDetailsSyncDto{

	public CustomerTcsDetailsSyncDtoExt() {
		
	}
	
	public CustomerTcsDetailsSyncDtoExt(CustomerTcsDetailsDaoExt daoExt) {
		MapperUtil.getObjectMapping(daoExt, this);
		if(daoExt.getCustomer()!=null)
			this.setCustomer(daoExt.getCustomer().getId());
		
		if(daoExt.getSalesTxnDao()!=null) 
			this.setSalesTxnDao(daoExt.getSalesTxnDao().getId());
	}
	
	public List<CustomerTcsDetailsSyncDtoExt> syncDtoList(List<CustomerTcsDetailsDaoExt> daoList){
		List<CustomerTcsDetailsSyncDtoExt> dtoList = new ArrayList<>();
		daoList.forEach(dao->{
			CustomerTcsDetailsSyncDtoExt dto = new CustomerTcsDetailsSyncDtoExt(dao);
			dtoList.add(dto);
		});
		return dtoList;
	}
}
