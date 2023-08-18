/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.location.base;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.MappedSuperclass;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.location.dao.CountryDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class PincodeBaseDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Column(name = "pin_code")
	private String pinCode;

	@Column(name = "cachement_area")
	private String cachementArea;

	@Column(name = "town_name")
	private String townName;

	@Column(name = "state_name")
	private String stateName;

	@ManyToOne(fetch = FetchType.LAZY)
	@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	@JoinColumn(name = "country_code", referencedColumnName = "country_code")
	private CountryDao country;
}
