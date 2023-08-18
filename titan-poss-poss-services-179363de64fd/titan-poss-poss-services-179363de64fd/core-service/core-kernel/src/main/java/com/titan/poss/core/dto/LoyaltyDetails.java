/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.core.dto;

import java.util.Date;

import lombok.Data;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
public class LoyaltyDetails {

	private Date birthday;
	private String birthdayDiscount;
	private String birthdayValdityPeriod;

	private Date spouseBirthday;
	private String spouseBirthdayDiscount;
	private String spouseBirthdayValidityPeriod;

	private Date anniversary;
	private String anniversaryDiscount;
	private String anniversaryValidityPeriod;

	private String child1BirthdayDiscount;
	private String child1BirthdayValidityPeriod;

	private String child2BirthdayDiscount;
	private String child2BirthdayValidityPeriod;

}
