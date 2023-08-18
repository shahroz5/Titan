/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dao;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Getter
@Setter
@Entity
@Table(name = "country_master")
@EqualsAndHashCode(onlyExplicitlyIncluded = true, callSuper = false)
public class CountryDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;
	@Id
	@Column(name = "country_code")
	private String countryCode;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;

	@OneToOne(fetch = FetchType.LAZY)
	@JsonIgnoreProperties({ "hibernateLazyInitializer", "handler" })
	@JoinColumn(name = "currency_code", referencedColumnName = "currency_code")
	private CurrencyDao currency;

	@Column(name = "date_format")
	private String dateFormat;

	@Column(name = "time_format")
	private String timeFormat;

	@Column(name = "locale")
	private String locale;

	@Column(name = "phone_length")
	private Integer phoneLength;

	@Column(name = "isd_code")
	private String isdCode;

	@Column(name = "fiscal_year_start")
	private String fiscalYearStart;

	@Column(name = "fiscal_year")
	private Integer fiscalYear;

	@Column(name = "weight_unit")
	private String weightUnit;

	@Column(name = "stone_weight_unit")
	private String stoneWeightUnit;

}
