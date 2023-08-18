/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.location.dao;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.AllArgsConstructor;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Getter
@Setter
@Entity
@Table(name = "location_master")
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class LocationDao extends MasterSyncableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "description", columnDefinition = "NVARCHAR")
	private String description;

	@Column(name = "location_type")
	private String locationTypeCode;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "town_id", referencedColumnName = "town_id")
	private TownDao town;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "state_id", referencedColumnName = "state_id")
	private StateDao state;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "country_code", referencedColumnName = "country_code")
	private CountryDao country;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "region_code", referencedColumnName = "region_code")
	private RegionDao region;

	@Column(name = "owner_type")
	private String ownerTypeCode;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "factory_code", referencedColumnName = "location_code")
	@JsonBackReference("factory_code")
	private LocationDao factoryCode;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "brand_code", referencedColumnName = "brand_code")
	private BrandDao brand;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "cfa_code", referencedColumnName = "location_code")
	@JsonBackReference("cfa_code")
	private LocationDao cfaCode;

	@Column(name = "location_format")
	private String locationFormat;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "base_currency", referencedColumnName = "currency_code")
	private CurrencyDao baseCurrency;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "stock_currency", referencedColumnName = "currency_code")
	private CurrencyDao stockCurrency;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "master_currency", referencedColumnName = "currency_code")
	private CurrencyDao masterCurrency;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "market_code", referencedColumnName = "market_code")
	private MarketDao market;

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sub_region_code", referencedColumnName = "region_code")
	private RegionDao subRegion;

	@OneToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "sub_brand_code", referencedColumnName = "brand_code")
	private BrandDao subBrand;

	@Column(name = "payment_currencies")
	private String paymentCurrencies;

	@Column(name = "remarks")
	private String remarks;

	@Column(name = "store_details", columnDefinition = "NVARCHAR")
	private String storeDetails;

	@Column(name = "print_details", columnDefinition = "NVARCHAR")
	private String printDetails;

	@Column(name = "cn_details", columnDefinition = "NVARCHAR")
	private String cnDetails;

	@Column(name = "tax_details", columnDefinition = "NVARCHAR")
	private String taxDetails;

	@Column(name = "cm_details", columnDefinition = "NVARCHAR")
	private String cmDetails;

	@Column(name = "grn_details", columnDefinition = "NVARCHAR")
	private String grnDetails;

	@Column(name = "grf_details", columnDefinition = "NVARCHAR")
	private String grfDetails;

	@Column(name = "gep_details", columnDefinition = "NVARCHAR")
	private String gepDetails;

	@Column(name = "gc_details", columnDefinition = "NVARCHAR")
	private String gcDetails;

	@Column(name = "ab_details", columnDefinition = "NVARCHAR")
	private String abDetails;

	@Column(name = "co_details", columnDefinition = "NVARCHAR")
	private String coDetails;

	@Column(name = "ghs_details", columnDefinition = "NVARCHAR")
	private String ghsDetails;

	@Column(name = "inventory_details", columnDefinition = "NVARCHAR")
	private String inventoryDetails;

	@Column(name = "banking_details", columnDefinition = "NVARCHAR")
	private String bankingDetails;

	@Column(name = "otp_details", columnDefinition = "NVARCHAR")
	private String otpDetails;

	@Column(name = "customer_details", columnDefinition = "NVARCHAR")
	private String customerDetails;

	@Column(name = "payment_details", columnDefinition = "NVARCHAR")
	private String paymentDetails;

	@Column(name = "offer_details", columnDefinition = "NVARCHAR")
	private String offerDetails;

	@Column(name = "tep_details", columnDefinition = "NVARCHAR")
	private String tepDetails;

	@Column(name = "digigold_details", columnDefinition = "NVARCHAR")
	private String digigoldDetails;

	@Column(name = "is_offline")
	private Boolean isOffline;

	@Column(name = "is_home")
	private Boolean isHome;

	@Column(name = "is_migrated_from_legacy")
	private Boolean isMigratedFromLegacy;
	
	@Column(name = "tcs_details", columnDefinition = "NVARCHAR")
	private String tcsDetails;
	
	@Column(name = "is_autostn")
	private Boolean isAutostn;
	
	@Column(name="latitude",columnDefinition = "decimal")
	private BigDecimal latitude;
	
	@Column(name="longitude",columnDefinition = "decimal")
	private BigDecimal longitude;
	
	@Column(name = "service_details", columnDefinition = "NVARCHAR")
	private String serviceDetails;

	@Column(name="eghs_ref_state_id")
	private Integer eghsRefStateId;
	
	@Column(name= "eghs_ref_town_id")
	private Integer eghsRefTownId;
	
}
