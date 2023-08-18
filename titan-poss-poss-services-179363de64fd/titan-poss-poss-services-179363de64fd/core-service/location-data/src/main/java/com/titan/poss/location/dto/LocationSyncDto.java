/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.location.dto;

import java.math.BigDecimal;

import com.titan.poss.core.dao.MasterSyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.location.dao.BrandDao;
import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.dao.CurrencyDao;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.dao.MarketDao;
import com.titan.poss.location.dao.RegionDao;
import com.titan.poss.location.dao.StateDao;
import com.titan.poss.location.dao.TownDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class LocationSyncDto extends MasterSyncableEntity {

	private String locationCode;

	private String description;

	private String locationTypeCode;

	private String town;

	private String state;

	private String country;

	private String region;

	private String ownerTypeCode;

	private String factoryCode;

	private String brand;

	private String cfaCode;

	private String storeDetails;

	private String locationFormat;

	private String baseCurrency;

	private String stockCurrency;

	private String masterCurrency;

	private String market;

	private String subRegion;

	private String subBrand;

	private String paymentCurrencies;

	private String remarks;

	private String printDetails;

	private String cnDetails;

	private String taxDetails;

	private String cmDetails;

	private String grnDetails;

	private String grfDetails;

	private String gepDetails;

	private String gcDetails;

	private String abDetails;

	private String coDetails;

	private String ghsDetails;

	private String inventoryDetails;

	private String bankingDetails;

	private String otpDetails;

	private String customerDetails;

	private String paymentDetails;

	private String offerDetails;

	private String tepDetails;

	private String digigoldDetails;

	private Boolean isOffline;

	private Boolean isHome;

	private Boolean isMigratedFromLegacy;
	
	private String tcsDetails;
	
	private Boolean isAutostn;
	
	private BigDecimal latitude;
	
	private BigDecimal longitude;
	
	private String serviceDetails;
	
    private Integer eghsRefTownId;
    
    private Integer eghsRefStateId;

	public LocationSyncDto() {

	}

	public LocationSyncDto(LocationDao location) {
		MapperUtil.getObjectMapping(location, this);
		this.setStoreDetails(location.getStoreDetails());
		this.setAbDetails(location.getAbDetails());
		this.setBankingDetails(location.getBankingDetails());
		this.setCmDetails(location.getCmDetails());
		this.setCnDetails(location.getCnDetails());
		this.setCoDetails(location.getCoDetails());
		this.setCustomerDetails(location.getCustomerDetails());
		this.setGcDetails(location.getGcDetails());
		this.setGepDetails(location.getGepDetails());
		this.setGhsDetails(location.getGhsDetails());
		this.setGrfDetails(location.getGrfDetails());
		this.setGrnDetails(location.getGrnDetails());
		this.setInventoryDetails(location.getInventoryDetails());
		this.setTepDetails(location.getTepDetails());
		this.setOfferDetails(location.getOfferDetails());
		this.setOtpDetails(location.getOtpDetails());
		this.setPaymentDetails(location.getPaymentDetails());
		this.setRemarks(location.getRemarks());
		this.setTown(location.getTown().getTownId());
		this.setState(location.getState().getStateId());
		this.setCountry(location.getCountry().getCountryCode());
		this.setServiceDetails(location.getServiceDetails());

		if (location.getFactoryCode() != null) {
			this.setFactoryCode(location.getFactoryCode().getLocationCode());
		} else {
			this.setFactoryCode(null);
		}

		if (location.getCfaCode() != null) {
			this.setCfaCode(location.getCfaCode().getLocationCode());
		} else {
			this.setCfaCode(null);
		}

		if (location.getBaseCurrency() != null) {
			this.setBaseCurrency(location.getBaseCurrency().getCurrencyCode());
		} else {
			this.setBaseCurrency(null);
		}

		if (location.getStockCurrency() != null) {
			this.setStockCurrency(location.getStockCurrency().getCurrencyCode());
		} else {
			this.setStockCurrency(null);
		}
		if (location.getMasterCurrency() != null) {
			this.setMasterCurrency(location.getMasterCurrency().getCurrencyCode());
		} else {
			this.setMasterCurrency(null);
		}

		if (location.getMarket() != null) {
			this.setMarket(location.getMarket().getMarketCode());
		} else {
			this.setMarket(null);
		}

		if (location.getSubRegion() != null) {
			this.setSubRegion(location.getSubRegion().getRegionCode());
		} else {
			this.setSubRegion(null);
		}

		if (location.getRegion() != null) {
			this.setRegion(location.getRegion().getRegionCode());
		} else {
			this.setRegion(null);
		}

		this.setBrand(location.getBrand().getBrandCode());
		this.setSubBrand(location.getSubBrand().getBrandCode());
		if(location.getIsAutostn() != null)
		this.setIsAutostn(location.getIsAutostn());
		else 
			this.setIsAutostn(false);
		
	}

	public LocationDao getLocationDao(LocationSyncDto locationSyncDto) {
		LocationDao location = (LocationDao) MapperUtil.getObjectMapping(locationSyncDto, new LocationDao());

		location.setStoreDetails(locationSyncDto.getStoreDetails());
		location.setAbDetails(locationSyncDto.getAbDetails());
		location.setBankingDetails(locationSyncDto.getBankingDetails());
		location.setCmDetails(locationSyncDto.getCmDetails());
		location.setCnDetails(locationSyncDto.getCnDetails());
		location.setCoDetails(locationSyncDto.getCoDetails());
		location.setCustomerDetails(locationSyncDto.getCustomerDetails());
		location.setGcDetails(locationSyncDto.getGcDetails());
		location.setGepDetails(locationSyncDto.getGepDetails());
		location.setGhsDetails(locationSyncDto.getGhsDetails());
		location.setGrfDetails(locationSyncDto.getGrfDetails());
		location.setGrnDetails(locationSyncDto.getGrnDetails());
		location.setInventoryDetails(locationSyncDto.getInventoryDetails());
		location.setTepDetails(locationSyncDto.getTepDetails());
		location.setOfferDetails(locationSyncDto.getOfferDetails());
		location.setOtpDetails(locationSyncDto.getOtpDetails());
		location.setPaymentDetails(locationSyncDto.getPaymentDetails());
		location.setServiceDetails(locationSyncDto.getServiceDetails());
		location.setRemarks(locationSyncDto.getRemarks());
		if(locationSyncDto.getIsAutostn() != null)
		location.setIsAutostn(locationSyncDto.getIsAutostn());
		else 
			location.setIsAutostn(false);

		TownDao townDao = new TownDao();
		townDao.setTownId(locationSyncDto.getTown());
		location.setTown(townDao);

		StateDao stateDao = new StateDao();
		stateDao.setStateId(locationSyncDto.getState());
		location.setState(stateDao);

		CountryDao countryDao = new CountryDao();
		countryDao.setCountryCode(locationSyncDto.getCountry());
		location.setCountry(countryDao);

		if (locationSyncDto.getRegion() != null) {
			RegionDao regionDao = new RegionDao();
			regionDao.setRegionCode(locationSyncDto.getRegion());
			location.setRegion(regionDao);
		} else {
			location.setRegion(null);
		}

		if (locationSyncDto.getSubRegion() != null) {
			RegionDao subRegionDao = new RegionDao();
			subRegionDao.setRegionCode(locationSyncDto.getSubRegion());
			location.setSubRegion(subRegionDao);
		} else {
			location.setSubRegion(null);
		}

		if (locationSyncDto.getFactoryCode() != null) {
			LocationDao factory = new LocationDao();
			factory.setLocationCode(locationSyncDto.getFactoryCode());
			location.setFactoryCode(factory);
		} else {
			location.setFactoryCode(null);
		}

		if (locationSyncDto.getCfaCode() != null) {
			LocationDao cfa = new LocationDao();
			cfa.setLocationCode(locationSyncDto.getCfaCode());
			location.setCfaCode(cfa);
		} else {
			location.setCfaCode(null);
		}

		if (locationSyncDto.getBaseCurrency() != null) {
			CurrencyDao baseCurrencyDao = new CurrencyDao();
			baseCurrencyDao.setCurrencyCode(locationSyncDto.getBaseCurrency());
			location.setBaseCurrency(baseCurrencyDao);
		} else {
			location.setBaseCurrency(null);
		}

		if (locationSyncDto.getStockCurrency() != null) {
			CurrencyDao stockCurrencyDao = new CurrencyDao();
			stockCurrencyDao.setCurrencyCode(locationSyncDto.getStockCurrency());
			location.setStockCurrency(stockCurrencyDao);
		} else {
			location.setStockCurrency(null);
		}

		if (locationSyncDto.getMasterCurrency() != null) {
			CurrencyDao masterCurrencyDao = new CurrencyDao();
			masterCurrencyDao.setCurrencyCode(locationSyncDto.getMasterCurrency());
			location.setMasterCurrency(masterCurrencyDao);
		} else {
			location.setMasterCurrency(null);
		}

		if (locationSyncDto.getMarket() != null) {
			MarketDao marketDao = new MarketDao();
			marketDao.setMarketCode(locationSyncDto.getMarket());
			location.setMarket(marketDao);
		} else {
			location.setMarket(null);
		}

		BrandDao brandDao = new BrandDao();
		brandDao.setBrandCode(locationSyncDto.getBrand());
		location.setBrand(brandDao);

		BrandDao subBrandDao = new BrandDao();
		subBrandDao.setBrandCode(locationSyncDto.getSubBrand());
		location.setSubBrand(subBrandDao);

		return location;
	}
}
