/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.dto;
import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.dao.PincodeDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@EqualsAndHashCode(callSuper = false)
public class PincodeSyncDto extends MasterSyncableEntity {

	private String id;

	private String pinCode;

	private String cachementArea;

	private String townName;

	private String stateName;

	private String country;
	
	public PincodeDao getPincodeDao(PincodeSyncDto pincodeSyncDto) {
		PincodeDao pincodeDao = (PincodeDao) MapperUtil.getObjectMapping(pincodeSyncDto, new PincodeDao()); 
		
		CountryDao countryDao = new CountryDao();
		countryDao.setCountryCode(pincodeSyncDto.getCountry());
		
		pincodeDao.setCountry(countryDao);
		return pincodeDao;
	}
}
