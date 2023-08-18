/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.Date;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.AccountDetailsDao;
import com.titan.poss.sales.dao.CustomerLocationMappingDao;
import com.titan.poss.sales.dao.CustomerLocationMappingIdDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class AccountDetailsSyncDto extends SyncableEntity {

	private String id;

	private String accountType;

	private String accountNo;

	private Integer customerId;

	private String locationCode;

	private Integer accountCustomerId;

	private String enrolledLocationCode;

	private String maturityLocationCode;

	private Integer fiscalYear;

	private String scheme;

	private Date maturityDate;

	private Date enrolledDate;

	private String status;

	private String passbookNo;

	private BigDecimal balance;

	private BigDecimal discount;

	private BigDecimal minUtilizationPct;

	private Boolean isProofsAvailable;

	private Boolean isRedeemable;

	private BigDecimal cashCollected;

	private String customerDetails;

	private String pdcDetails;

	private String cfaDetails;

	private String otherDetails;

	public AccountDetailsDao getAccountDetailsDao(AccountDetailsSyncDto syncDto) {
		AccountDetailsDao account = (AccountDetailsDao) MapperUtil.getObjectMapping(syncDto, new AccountDetailsDao());
		if (syncDto.getCustomerId() != null && syncDto.getLocationCode() != null) {
			CustomerLocationMappingDao customerLocation = new CustomerLocationMappingDao();
			CustomerLocationMappingIdDao customerLocationId = new CustomerLocationMappingIdDao();
			customerLocationId.setCustomerId(syncDto.getCustomerId());
			customerLocationId.setLocationCode(syncDto.getLocationCode());
			customerLocation.setCustomerLocationMappingId(customerLocationId);
			account.setCustomerLocationMap(customerLocation);
		}
		return account;
	}
}
