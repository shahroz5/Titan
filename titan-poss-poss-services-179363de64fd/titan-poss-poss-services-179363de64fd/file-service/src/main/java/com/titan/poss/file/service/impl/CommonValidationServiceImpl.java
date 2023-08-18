/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Arrays;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.BeanPropertyRowMapper;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate;
import org.springframework.jdbc.core.namedparam.SqlParameterSource;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.jobs.mapper.ItemMasterMapper;
import com.titan.poss.file.service.CommonValidationService;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.FileService;
import com.titan.poss.integration.dao.VendorConfigDao;
import com.titan.poss.integration.repository.VendorConfigRepository;
import com.titan.poss.location.dao.CountryDao;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.location.repository.LocationRepository;
import com.titan.poss.product.dao.ItemDao;
import com.titan.poss.product.dao.ItemMaterialMappingDao;
import com.titan.poss.product.dao.ItemStoneMappingDao;
import com.titan.poss.product.dao.LotDetailsDao;
import com.titan.poss.product.dao.LotMaterialDetailsDao;
import com.titan.poss.product.dao.MaterialDao;
import com.titan.poss.product.dao.ProductGroupDao;
import com.titan.poss.product.dao.StoneDao;
import com.titan.poss.product.repository.ItemMaterialMappingRepository;
import com.titan.poss.product.repository.ItemStoneMappingRepository;
import com.titan.poss.product.repository.MaterialRepository;
import com.titan.poss.product.repository.ProductGroupRepository;
import com.titan.poss.product.repository.StoneRepository;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class CommonValidationServiceImpl implements CommonValidationService {

	@Autowired
	private JdbcTemplate jdbcTemplate;

	@Autowired
	private DataAuditService dataAuditService;

	@Autowired
	private LocationRepository locationRepository;

	@Autowired
	private NamedParameterJdbcTemplate namedParameterJdbcTemplate;

	@Autowired
	private ItemMasterMapper itemMasterMapper;

	@Autowired
	private StoneRepository stoneRepository;

	@Autowired
	private ItemStoneMappingRepository itemStoneMappingRepository;

	@Autowired
	private ItemMaterialMappingRepository itemMaterialMappingRepository;

	@Autowired
	private MaterialRepository materialRepository;

	@Autowired
	private FileService fileService;

	@Autowired
	private VendorConfigRepository vendorConfigRepository;

	@Autowired
	private ProductGroupRepository productGroupRepository;

	public static final String SIMPLE_DATE_FORMAT = "dd/MM/yyyy";

	@Override
	public List<String> getActiveLocationCodes() {
		String sql = "SELECT location_code from locations.dbo.location_master lm where location_type ='BTQ' and is_active ='true'";
		return jdbcTemplate.queryForList(sql, String.class);
	}

	@Override
	public List<LocationDao> getActiveLocations(List<String> locationCodes, boolean isActive) {
		return locationRepository.findByLocationCodeInAndIsActive(locationCodes, isActive);
	}

	@Override
	public boolean validateFiscalYear(String primaryData, String locationCode, Object object, Integer fiscalYear,
			String fileId, String errorType) {
		if (fiscalYear == null) {
			if (fileId != null) {
				dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(object),
						"fiscal year cannot be null ", fileId, ErrorTypeEnum.ERROR.toString());
			}
			return false;
		} else {
			CountryDao countryData = fileService.getCountryData();
			int currentFiscalYear = countryData.getFiscalYear();
			int previousYear = currentFiscalYear - 1;
			if (fiscalYear != currentFiscalYear && fiscalYear != previousYear) {
				if (fileId != null) {
					dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(object),
							"Invalid fiscalYear: " + fiscalYear
									+ ". Fiscal Year should be current year or previous year ",
							fileId, ErrorTypeEnum.ERROR.toString());
				}
				return false;
			}
		}
		return true;
	}

	@Override
	public boolean validateSrcDocDate(String primaryData, Object object, String srcDocDate, String fileId,
			String errorType, Date srcDate) {
		if (StringUtils.isEmpty(srcDocDate) && srcDate == null) {
			if (fileId != null) {
				dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(object),
						"src doc date cannot be null", fileId, ErrorTypeEnum.ERROR.toString());
			}
			return false;
		} else {
			Date sourceDocDate = null;
			if (!StringUtils.isEmpty(srcDocDate)) {
				sourceDocDate = validateDateField(primaryData, object, "Invalid src doc date: " + srcDocDate,
						srcDocDate, fileId, errorType);
			} else {
				sourceDocDate = srcDate;
			}
			if (sourceDocDate != null && new Date().getTime() < sourceDocDate.getTime()) {
				if (fileId != null) {
					dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(object),
							"Invalid srcDocDate: " + srcDocDate
									+ " .Source Doc Date should not be greater than current date.",
							fileId, ErrorTypeEnum.ERROR.toString());
				}
				return false;
			}
		}
		return true;
	}

	@Override
	public boolean validateMfgDate(String primaryData, Object object, String mfgDateStr, String fileId,
			String errorType) {
		if (StringUtils.isEmpty(mfgDateStr)) {
			dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(object), "Mfg date cannot be null",
					fileId, errorType);
			return false;
		} else {
			Date mfgDate = validateDateField(primaryData, object, "Invalid mfg date: " + mfgDateStr, mfgDateStr, fileId,
					errorType);
			if (mfgDate != null && new Date().getTime() < mfgDate.getTime()) {
				dataAuditService
						.saveDataAuditData(primaryData, MapperUtil.getJsonString(object),
								"Invalid mfg date: " + mfgDateStr
										+ ". Manufacturing Date should not be greater than current date",
								fileId, errorType);
				return false;
			}
		}
		return true;
	}

	@Override
	public Integer validateIntegerField(String primaryData, Object object, String errorMsg, String value, String fileId,
			String errorType) {
		if (StringUtils.isEmpty(value)) {
			return null;
		}
		try {
			return Integer.parseInt(value);
		} catch (NumberFormatException e) {
			dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(object), errorMsg, fileId,
					errorType);
			return null;
		}
	}

	@Override
	public Short validateShortField(String primaryData, Object object, String errorMsg, String value, String fileId,
			String errorType) {
		if (StringUtils.isEmpty(value)) {
			return null;
		}
		try {
			return Short.parseShort(value);
		} catch (NumberFormatException e) {
			dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(object), errorMsg, fileId,
					errorType);
			return null;
		}
	}

	@Override
	public BigDecimal validateBigDecimalField(String primaryData, Object object, String errorMsg, String value,
			String fileId, String errorType) {

		if (StringUtils.isEmpty(value)) {
			return null;
		}
		try {
			return new BigDecimal(value);
		} catch (NumberFormatException e) {
			dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(object), errorMsg, fileId,
					errorType);
			return null;
		}
	}

	@Override
	public Long validateLongField(String primaryData, Object object, String errorMsg, String value, String fileId,
			String errorType) {
		if (StringUtils.isEmpty(value)) {
			return null;
		}
		try {
			return Long.parseLong(value);
		} catch (NumberFormatException e) {
			dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(object), errorMsg, fileId,
					errorType);
			return null;
		}
	}

	@Override
	public Date validateDateField(String primaryData, Object object, String errorMsg, String value, String fileId,
			String errorType) {
		if (StringUtils.isEmpty(value)) {
			return null;
		}
		SimpleDateFormat formatter = new SimpleDateFormat(SIMPLE_DATE_FORMAT);
		Date date = null;
		try {
			date = formatter.parse(value.substring(6, 8) + "/" + value.substring(4, 6) + "/" + value.substring(0, 4));
		} catch (ParseException e) {
			dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(object), errorMsg, fileId,
					errorType);
			return null;
		}
		return date;
	}

	@Override
	public List<ItemDao> getActiveItemDaos(String itemCode, boolean isActive) {
		SqlParameterSource parameters = new MapSqlParameterSource("itemCode", itemCode).addValue("isActive", isActive);
		return namedParameterJdbcTemplate.query(
				"select * from products.dbo.item_master where item_code=:itemCode and is_active=:isActive", parameters,
				itemMasterMapper);
	}

	@Override
	public boolean validateItemCode(List<ItemDao> itemDaos, String primaryData, Object object, String itemCode,
			String fileId) {
		if (itemDaos.isEmpty()) {
			if (fileId != null) {
				dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(object),
						"Item with Item code: " + itemCode + " , does not exists in Item master", fileId,
						ErrorTypeEnum.ERROR.toString());
			}
			return false;
		}
		return true;
	}

	@Override
	public boolean validateProductGroupCode(String productGroupCode, ItemDao itemDao, String primaryData, Object object,
			String fileId) {
		if (!productGroupCode.equalsIgnoreCase(itemDao.getProductGroup().getProductGroupCode())) {
			if (fileId != null) {
				dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(object),
						"Warning: CFAProductCode of Line item Number: " + productGroupCode
								+ " does not match the CFAProductCode in the ItemMaster",
						fileId, ErrorTypeEnum.WARNING.toString());
			}
			return false;
		}
		return true;
	}

	@Override
	public boolean validateStoneCode(String stoneCode, boolean isActive, String primaryData, Object object,
			String fileId) {
		StoneDao stoneDao = stoneRepository.findByStoneCodeAndIsActive(stoneCode, true);
		if (stoneDao == null) {
			dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(object),
					"Stone code: " + stoneCode + "is not present/active in stone master", fileId,
					ErrorTypeEnum.ERROR.toString());
			return false;
		}
		return true;
	}

	@Override
	public boolean validateMaterialCode(String materialCode, boolean isActive, String primaryData, Object object,
			String fileId) {
		MaterialDao materialDao = materialRepository.findByMaterialCodeAndIsActive(materialCode, true);
		if (materialDao == null) {
			dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(object),
					"Material code: " + materialCode + "is not present/active in material master", fileId,
					ErrorTypeEnum.ERROR.toString());
			return false;
		}
		return true;
	}

	@Override
	public boolean validateItemStoneMapping(String itemCode, String stoneCode, String primaryData, Object object,
			String fileId) {

		ItemStoneMappingDao itemStoneMapping = itemStoneMappingRepository.findByItemItemCodeAndStoneStoneCode(itemCode,
				stoneCode);
		if (itemStoneMapping == null) {
			dataAuditService.saveDataAuditData(
					primaryData, MapperUtil.getJsonString(object), "Item stone mapping with item code: " + itemCode
							+ " and Stone code: " + stoneCode + "is not present/active in item stone mapping",
					fileId, ErrorTypeEnum.ERROR.toString());
			return false;
		}
		return true;
	}

	@Override
	public boolean validateItemMaterialMapping(String itemCode, String materialCode, String primaryData, Object object,
			String fileId) {
		ItemMaterialMappingDao itemMaterialMappingDao = itemMaterialMappingRepository
				.findByItemItemCodeAndMaterial(itemCode, materialCode);
		if (itemMaterialMappingDao == null) {
			dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(object),
					"Item material mapping with item code: " + itemCode + " and material code: " + materialCode
							+ " is not present/active in item material mapping",
					fileId, ErrorTypeEnum.ERROR.toString());
			return false;
		}
		return true;
	}

	@Override
	public LocationDao validateLocationCode(String locationCode, String primaryData, Object object, String fileId,
			String locationType, List<String> ownerTypes) {
		List<LocationDao> locationDaos = locationRepository.findByLocationCodeInAndIsActive(Arrays.asList(locationCode),
				true);
		if (locationDaos.isEmpty()) {
			if (fileId != null) {
				dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(object),
						"location code : " + locationCode + " is not present/active in location master ", fileId,
						ErrorTypeEnum.ERROR.toString());
			}
			return null;
		} else if (!locationDaos.get(0).getLocationTypeCode().equalsIgnoreCase(locationType)) {
			if (fileId != null) {
				dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(object),
						"location code : " + locationCode + " does not match with location type:  " + locationType,
						fileId, ErrorTypeEnum.ERROR.toString());
			}
			return null;
		} else if (ownerTypes != null && locationDaos.get(0).getOwnerTypeCode() != null
				&& !ownerTypes.contains(locationDaos.get(0).getOwnerTypeCode())) {
			if (fileId != null) {
				dataAuditService.saveDataAuditData(primaryData, MapperUtil.getJsonString(object),
						"Owner type  of location code: " + locationCode + " does not match.", fileId,
						ErrorTypeEnum.ERROR.toString());
			}
			return null;
		}
		return locationDaos.get(0);
	}

	@Override
	public String getOrderTypes(String sql) {
		List<String> orderTypes = jdbcTemplate.queryForList(sql, String.class);
		Set<String> orderTypesSet = orderTypes.stream().map(orderType -> orderType.equalsIgnoreCase("P") ? "P" : "R")
				.collect(Collectors.toSet());
		List<String> orderTypeList = orderTypesSet.stream().collect(Collectors.toList());
		StringBuilder orderTypeSb = new StringBuilder();
		for (int i = 0; i < orderTypeList.size(); i++) {
			orderTypeSb.append(orderTypeList.get(i));
			if (i != orderTypeList.size() - 1) {
				orderTypeSb.append(",");
			}
		}
		return orderTypeSb.toString();
	}

	@Override
	public List<VendorConfigDao> getVendorConfigs(String vendorCode, boolean isActive) {
		return vendorConfigRepository.findByVendorVendorCodeAndIsActive(vendorCode, isActive);
	}

	@Override
	public ProductGroupDao getProductGroup(String cfaProductGroupCode, boolean isActive) {

		ProductGroupDao productGroup = productGroupRepository.findByProductGroupCodeAndIsActive(cfaProductGroupCode,
				isActive);
		return productGroup == null ? null : productGroup;
	}

	@Override
	public boolean lotStoneDetailPresent(String lotNumber, String itemCode) {
		String lotStoneDetailSql = "Select * from products.dbo.lot_stone_details where lot_number ='" + lotNumber
				+ "' and item_code = '" + itemCode + "'";
		List<LotDetailsDao> stnLotStoneDetails = namedParameterJdbcTemplate.query(lotStoneDetailSql,
				new BeanPropertyRowMapper<>(LotDetailsDao.class));

		return !stnLotStoneDetails.isEmpty();
	}

	@Override
	public boolean lotMaterialDetailPresent(String lotNumber, String itemCode) {
		String lotMaterialDetailSql = "Select * from products.dbo.lot_material_details where lot_number ='" + lotNumber
				+ "' and item_code = '" + itemCode + "'";
		List<LotMaterialDetailsDao> stnLotMaterialDetails = namedParameterJdbcTemplate.query(lotMaterialDetailSql,
				new BeanPropertyRowMapper<>(LotMaterialDetailsDao.class));

		return !stnLotMaterialDetails.isEmpty();
	}

	@Override
	public BigDecimal calculateStuddedWt(String productWt, String otherStoneWt, String diamondWt,
			String otherMaterialWt) {
		BigDecimal sumOfOtherWt = new BigDecimal(otherStoneWt).add(new BigDecimal(diamondWt))
				.add(new BigDecimal(otherMaterialWt));
		return new BigDecimal(productWt).subtract(sumOfOtherWt);
	}

	@Override
	public BigDecimal calculatePlainWt(String productWt, String otherMaterialWt) {
		return new BigDecimal(productWt).subtract(new BigDecimal(otherMaterialWt));
	}

	@Override
	public String roundWeights(String wt, String quantity) {
		if (wt.equalsIgnoreCase("0")) {
			return "0";
		}
		return new BigDecimal(wt).divide(new BigDecimal(quantity)).setScale(3, RoundingMode.HALF_UP).toString();
	}

}
