/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service;

import java.math.BigDecimal;
import java.util.Date;
import java.util.List;

import com.titan.poss.integration.dao.VendorConfigDao;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ProductGroupDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface CommonValidationService {

	List<String> getActiveLocationCodes();

	List<LocationDao> getActiveLocations(List<String> locationCodes, boolean isActive);

	LocationDao validateLocationCode(String locationCode, String primaryData, Object object, String fileId,
			String locationType, List<String> ownerTypes);

	List<ItemDao> getActiveItemDaos(String itemCode, boolean isActive);

	boolean validateItemCode(List<ItemDao> itemDaos, String primaryData, Object object, String itemCode, String fileId);

	boolean validateProductGroupCode(String productGroupCode, ItemDao itemDao, String primaryData, Object object,
			String fileId);

	boolean validateStoneCode(String stoneCode, boolean isActive, String primaryData, Object object, String fileId);

	boolean validateMaterialCode(String materialCode, boolean isActive, String primaryData, Object object,
			String fileId);

	boolean validateItemStoneMapping(String itemCode, String stoneCode, String primaryData, Object object,
			String fileId);

	boolean validateItemMaterialMapping(String itemCode, String materialCode, String primaryData, Object object,
			String fileId);

	boolean validateFiscalYear(String primaryData, String locationCode, Object object, Integer fiscalYear,
			String fileId, String errorType);

	boolean validateSrcDocDate(String primaryData, Object object, String srcDocDate, String fileId, String errorType, Date srcDate);

	boolean validateMfgDate(String primaryData, Object object, String mfgDateStr, String fileId, String errorType);

	Integer validateIntegerField(String primaryData, Object object, String errorMsg, String value, String fileId,
			String errorType);

	Short validateShortField(String primaryData, Object object, String errorMsg, String value, String fileId,
			String errorType);

	BigDecimal validateBigDecimalField(String primaryData, Object object, String errorMsg, String value, String fileId,
			String errorType);

	Long validateLongField(String primaryData, Object object, String errorMsg, String value, String fileId,
			String errorType);

	Date validateDateField(String primaryData, Object object, String errorMsg, String value, String fileId,
			String errorType);

	String getOrderTypes(String sql);

	List<VendorConfigDao> getVendorConfigs(String vendorCode, boolean isActive);

	ProductGroupDao getProductGroup(String cfaProductGroupCode, boolean isActive);
	
	boolean lotStoneDetailPresent(String lotNumber, String itemCode);
	
	boolean lotMaterialDetailPresent(String lotNumber, String itemCode);
	
	BigDecimal calculateStuddedWt(String productWt, String otherStoneWt, String diamondWt, String otherMaterialWt);

	BigDecimal calculatePlainWt(String productWt, String otherMaterialWt);

	String roundWeights(String wt, String quantity);
}
