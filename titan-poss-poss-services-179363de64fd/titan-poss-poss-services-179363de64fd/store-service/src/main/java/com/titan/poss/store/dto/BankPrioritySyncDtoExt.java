package com.titan.poss.store.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.store.dao.BankPriorityDaoExt;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = false)
public class BankPrioritySyncDtoExt extends BankPrioritySyncDto {

	private static final long serialVersionUID = 1L;

	public BankPrioritySyncDtoExt() {

	}

	public BankPrioritySyncDtoExt(BankPriorityDaoExt bankPriorityDao) {
		MapperUtil.getObjectMapping(bankPriorityDao, this);
	}

	public List<BankPrioritySyncDtoExt> getBankPrioritySyncDtoExtList(List<BankPriorityDaoExt> daoList) {
		List<BankPrioritySyncDtoExt> syncDtoExt = new ArrayList<>();
		daoList.forEach(dao -> 
			syncDtoExt.add(new BankPrioritySyncDtoExt(dao))
		);
		return syncDtoExt;

	}
}
