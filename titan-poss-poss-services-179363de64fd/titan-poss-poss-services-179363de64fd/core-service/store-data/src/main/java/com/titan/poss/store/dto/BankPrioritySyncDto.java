/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.store.dto;

import java.util.ArrayList;
import java.util.List;

import com.titan.poss.core.dao.SyncTimeDao;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.store.dao.BankPriorityDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class BankPrioritySyncDto extends SyncTimeDao {

	private static final long serialVersionUID = 1L;

	private String bankName;

	private Integer priority;

	private String locationCode;

	private String id;

	public List<BankPriorityDao> getBankPriorityDaoList(List<BankPrioritySyncDto> bankPrioritySyncDtos) {
		List<BankPriorityDao> daoList = new ArrayList<>();
		bankPrioritySyncDtos.forEach(bankPrioritySyncDto -> {
			BankPriorityDao bankPriorityDao = (BankPriorityDao) MapperUtil.getObjectMapping(bankPrioritySyncDto,
					new BankPriorityDao());
			daoList.add(bankPriorityDao);
		});
		return daoList;
	}

	public BankPriorityDao getConfigLocationMappingDao(BankPrioritySyncDto bankPrioritySyncDto) {
		return (BankPriorityDao) MapperUtil.getObjectMapping(bankPrioritySyncDto,
				new BankPriorityDao());
	}
}
