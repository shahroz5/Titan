/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.io.File;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.enums.DelimiterEnum;
import com.titan.poss.core.utils.FileUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.StnStageDto;
import com.titan.poss.file.service.CommonValidationService;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.StnValidationService;
import com.titan.poss.inventory.dao.BinDao;
import com.titan.poss.inventory.repository.BinRepository;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.product.dao.ItemDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class StnValidationServiceImpl implements StnValidationService {

	@Autowired
	private DataAuditService dataAuditService;

	@Autowired
	private CommonValidationService commonValidationService;

	@Autowired
	private BinRepository binRepository;

	public static final String BI_METAL_STUDDED_CFA_CODE = "B5";
	public static final String BI_METAL_PLAIN_CFA_CODE = "B6";
	public static final String CUSTOMER_ORDER_BIN = "CUSTOMERORDERBIN";

	@Override
	public boolean validateFileColumnLength(File stnFile) {
		List<String[]> list = FileUtil.readFile(stnFile, DelimiterEnum.PSV.getValue().charAt(0), 0);
		for (String[] stringList : list) {
			if (!validateFileColumns(stringList)) {
				return false;
			}
		}
		return true;
	}

	private boolean validateFileColumns(String[] stringList) {
		// the file contains an extra'|', so reducing the length by 1
		return ((stringList[0].equals("HDR") && stringList.length - 1 == FileIntegrationConstants.STN_HDR_COLUMN_COUNT)
				|| (stringList[0].equals("HDR") && stringList.length == FileIntegrationConstants.STN_HDR_COLUMN_COUNT)
				|| (stringList[0].equals("DTL")
						&& stringList.length - 1 == FileIntegrationConstants.STN_DTL_COLUMN_COUNT)
				|| (stringList[0].equals("LDTL")
						&& stringList.length - 1 == FileIntegrationConstants.STN_LDTL_COLUMN_COUNT)
				|| (stringList[0].equals("MDTL")
						&& stringList.length - 1 == FileIntegrationConstants.STN_MDTL_COLUMN_COUNT)
				|| (stringList[0].equals("CTRL")
						&& stringList.length - 1 == FileIntegrationConstants.STN_CTRL_COLUMN_COUNT)
				|| (stringList[0].equals("CTRL")
						&& stringList.length == FileIntegrationConstants.STN_CTRL_COLUMN_COUNT));

	}

	@Override
	public boolean validateHdrService(StnStageDto stnStageDto) {

		if (!validateHdrInputType(stnStageDto)) {
			return false;
		}
		if (!validateHdrBusinessValidation(stnStageDto)) {
			return false;
		}

		// Validate the Fiscal Year
		// FiscalYear validation removed
//		if (!commonValidationService.validateFiscalYear(stnStageDto.getType(), stnStageDto.getLocation(), stnStageDto,
//				stnStageDto.getCreatedYear(), stnStageDto.getFileId(), ErrorTypeEnum.ERROR.toString())) {
//			return false;
//		}

		// validate src doc date
		return commonValidationService.validateSrcDocDate(stnStageDto.getType(), stnStageDto, stnStageDto.getStmDate(),
				stnStageDto.getFileId(), ErrorTypeEnum.ERROR.toString(), null);
	}

	private boolean validateHdrInputType(StnStageDto stnStageDto) {
		if (stnStageDto.getTransferType() == null) {
			dataAuditService.saveDataAuditData(stnStageDto.getType(), MapperUtil.getJsonString(stnStageDto),
					"transfer type cannot be null", stnStageDto.getFileId(), ErrorTypeEnum.ERROR.toString());
			return false;
		}

		if (stnStageDto.getType() == null) {
			dataAuditService.saveDataAuditData(stnStageDto.getType(), MapperUtil.getJsonString(stnStageDto),
					"delivery number cannot be null", stnStageDto.getFileId(), ErrorTypeEnum.ERROR.toString());
			return false;
		}

		Long srcDocDate = commonValidationService.validateLongField(stnStageDto.getType(), stnStageDto,
				"src doc date cannot be null/invalid", stnStageDto.getStmDate(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		if (srcDocDate == null) {
			return false;
		}

		if (stnStageDto.getHdrShipQty() == null) {
			dataAuditService.saveDataAuditData(stnStageDto.getType(), MapperUtil.getJsonString(stnStageDto),
					"ship qty cannot be null", stnStageDto.getFileId(), ErrorTypeEnum.ERROR.toString());
			return false;
		}
		return true;
	}

	private boolean validateHdrBusinessValidation(StnStageDto stnStageDto) {
		// validate src and dest location code and transferType(201 or 202)
		List<String> locationCodes = Arrays.asList(stnStageDto.getFactoryCode(), stnStageDto.getLocation());
		List<LocationDao> activeLocations = commonValidationService.getActiveLocations(locationCodes, true);
		List<String> activeLocationCodeList = activeLocations.stream().map(LocationDao::getLocationCode)
				.collect(Collectors.toList());
		// validating src location code
		if (!activeLocationCodeList.contains(stnStageDto.getFactoryCode())) {
			dataAuditService.saveDataAuditData(stnStageDto.getType(), MapperUtil.getJsonString(stnStageDto),
					"Src location code: " + stnStageDto.getFactoryCode() + " not present/active in location master.",
					stnStageDto.getFileId(), ErrorTypeEnum.ERROR.toString());
			return false;
		}
		// validating dest loc code
		if (!activeLocationCodeList.contains(stnStageDto.getLocation())) {
			dataAuditService.saveDataAuditData(stnStageDto.getType(), MapperUtil.getJsonString(stnStageDto),
					"Destination location code: " + stnStageDto.getLocation()
							+ " not present/active in location master.",
					stnStageDto.getFileId(), ErrorTypeEnum.ERROR.toString());
			return false;
		}
		// validating transfer type
		return validateTransferType(stnStageDto, activeLocations);

	}

	private boolean validateTransferType(StnStageDto stnStageDto, List<LocationDao> activeLocations) {
		if (stnStageDto.getTransferType().equals(201)) {
			LocationDao srcLocation = activeLocations.stream()
					.filter(loc -> loc.getLocationCode().equalsIgnoreCase(stnStageDto.getFactoryCode()))
					.collect(Collectors.toList()).get(0);
			if (srcLocation.getLocationTypeCode().equalsIgnoreCase(FileIntegrationConstants.LOCATION_TYPE_BTQ)) {
				stnStageDto.setHdrStockTransferType(FileIntegrationConstants.TRANSFER_TYPE_BTQ_BTQ);
			} else {
				dataAuditService.saveDataAuditData(stnStageDto.getType(), MapperUtil.getJsonString(stnStageDto),
						"Invalid src location code type : " + stnStageDto.getFactoryCode()
								+ " where transfer type: 201 ",
						stnStageDto.getFileId(), ErrorTypeEnum.ERROR.toString());
				return false;
			}

			LocationDao destLocation = activeLocations.stream()
					.filter(loc -> loc.getLocationCode().equalsIgnoreCase(stnStageDto.getLocation()))
					.collect(Collectors.toList()).get(0);
			if (!destLocation.getLocationTypeCode().equalsIgnoreCase(FileIntegrationConstants.LOCATION_TYPE_BTQ)) {
				dataAuditService.saveDataAuditData(stnStageDto.getType(), MapperUtil.getJsonString(stnStageDto),
						"Invalid dest location type: " + stnStageDto.getFactoryCode() + " where transfer type: 201 ",
						stnStageDto.getFileId(), ErrorTypeEnum.ERROR.toString());
				return false;
			}
		} else if (stnStageDto.getTransferType().equals(202)) {
			LocationDao srcLocation = activeLocations.stream()
					.filter(loc -> loc.getLocationCode().equalsIgnoreCase(stnStageDto.getFactoryCode()))
					.collect(Collectors.toList()).get(0);
			if (srcLocation.getLocationTypeCode().equalsIgnoreCase(FileIntegrationConstants.LOCATION_TYPE_FAC)) {
				stnStageDto.setHdrStockTransferType(FileIntegrationConstants.TRANSFER_TYPE_FAC_BTQ);
			} else if (srcLocation.getLocationTypeCode().equalsIgnoreCase(FileIntegrationConstants.LOCATION_TYPE_CFA)) {
				stnStageDto.setHdrStockTransferType(FileIntegrationConstants.TRANSFER_TYPE_CFA_BTQ);
			} else {
				dataAuditService.saveDataAuditData(stnStageDto.getType(), MapperUtil.getJsonString(stnStageDto),
						"Invalid src location code type : " + stnStageDto.getFactoryCode()
								+ " where transfer type: 202 ",
						stnStageDto.getFileId(), ErrorTypeEnum.ERROR.toString());
				return false;
			}

			LocationDao destLocation = activeLocations.stream()
					.filter(loc -> loc.getLocationCode().equalsIgnoreCase(stnStageDto.getLocation()))
					.collect(Collectors.toList()).get(0);
			if (!destLocation.getLocationTypeCode().equalsIgnoreCase(FileIntegrationConstants.LOCATION_TYPE_BTQ)) {
				dataAuditService.saveDataAuditData(stnStageDto.getType(), MapperUtil.getJsonString(stnStageDto),
						"Invalid dest location type: " + stnStageDto.getFactoryCode() + " where transfer type: 202 ",
						stnStageDto.getFileId(), ErrorTypeEnum.ERROR.toString());
				return false;
			}

			// validate owner type, owner type should be L1 or L2 else throw error
		} else {
			dataAuditService.saveDataAuditData(stnStageDto.getType(), MapperUtil.getJsonString(stnStageDto),
					"Invalid transfer type: " + stnStageDto.getTransferType() + ". Transfer Type should be 201/202",
					stnStageDto.getFileId(), ErrorTypeEnum.ERROR.toString());
			return false;
		}
		return true;
	}

	@Override
	public boolean validateDtlService(StnStageDto stnStageDto) {
		if (!validateDtlInputType(stnStageDto)) {
			return false;
		}
		if (!dtlBusinessValidtion(stnStageDto)) {
			return false;
		}

		// validate the mfg date.
		return commonValidationService.validateMfgDate(stnStageDto.getType(), stnStageDto, stnStageDto.getStmDate(),
				stnStageDto.getFileId(), ErrorTypeEnum.ERROR.toString());

	}

	/**
	 * @param stnStageDto
	 */
	private boolean validateDtlInputType(StnStageDto stnStageDto) {

		if (commonValidationService.validateLongField(stnStageDto.getType(), stnStageDto,
				"Invalid mfgDate: " + stnStageDto.getStmDate(), stnStageDto.getStmDate(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString()) == null) {
			return false;
		}
		if (commonValidationService.validateBigDecimalField(stnStageDto.getType(), stnStageDto,
				"Invalid data in Standard Value: " + stnStageDto.getDtlProductValue1(),
				stnStageDto.getDtlProductValue1(), stnStageDto.getFileId(), ErrorTypeEnum.ERROR.toString()) == null) {
			return false;
		}
		if (commonValidationService.validateShortField(stnStageDto.getType(), stnStageDto,
				"Invalid data in Issued Quantity", stnStageDto.getDtlProductQty(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString()) == null) {
			return false;
		}
		if (commonValidationService.validateBigDecimalField(stnStageDto.getType(), stnStageDto,
				"Invalid data in Issued Weight", stnStageDto.getDtlProductWt(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString()) == null) {
			return false;
		}
		if (commonValidationService.validateBigDecimalField(stnStageDto.getType(), stnStageDto,
				"Invalid data in Issued Value", stnStageDto.getDtlProductValue2(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString()) == null) {
			return false;
		}

		if (commonValidationService.validateBigDecimalField(stnStageDto.getType(), stnStageDto,
				"Invalid data in IGSTPct", stnStageDto.getDtlIgstPerc(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString()) == null) {
			return false;
		}
		if (commonValidationService.validateBigDecimalField(stnStageDto.getType(), stnStageDto,
				"Invalid data in IGSTVal", stnStageDto.getDtlIgstVal(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString()) == null) {
			return false;
		}
		if (commonValidationService.validateBigDecimalField(stnStageDto.getType(), stnStageDto,
				"Invalid data in SGSTPct", stnStageDto.getDtlSgstPerc(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString()) == null) {
			return false;
		}
		if (commonValidationService.validateBigDecimalField(stnStageDto.getType(), stnStageDto,
				"Invalid data in SGSTVal", stnStageDto.getDtlSgstVal(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString()) == null) {
			return false;
		}
		if (commonValidationService.validateBigDecimalField(stnStageDto.getType(), stnStageDto,
				"Invalid data in CGSTPct", stnStageDto.getDtlCgstPerc(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString()) == null) {
			return false;
		}
		if (commonValidationService.validateBigDecimalField(stnStageDto.getType(), stnStageDto,
				"Invalid data in CGSTVal", stnStageDto.getDtlCgstVal(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString()) == null) {
			return false;
		}
		if (!validateDtlInputType2(stnStageDto)) {
			return false;
		}

		return commonValidationService.validateBigDecimalField(stnStageDto.getType(), stnStageDto,
				"Invalid data in otherMaterialWeight", stnStageDto.getDtlOtherNetWt(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString()) != null;

	}

	private boolean validateDtlInputType2(StnStageDto stnStageDto) {
		if (commonValidationService.validateBigDecimalField(stnStageDto.getType(), stnStageDto,
				"Invalid data in UTGSTPct", stnStageDto.getDtlUtgstPerc(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString()) == null) {
			return false;
		}
		if (commonValidationService.validateBigDecimalField(stnStageDto.getType(), stnStageDto,
				"Invalid data in UTGSTVal", stnStageDto.getDtlUtgstVal(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString()) == null) {
			return false;
		}

		if (commonValidationService.validateBigDecimalField(stnStageDto.getType(), stnStageDto,
				"Invalid data in actualGoldWeight", stnStageDto.getDtlGoNetWt(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString()) == null) {
			return false;
		}
		if (commonValidationService.validateBigDecimalField(stnStageDto.getType(), stnStageDto,
				"Invalid data in actualPlatinumWeight", stnStageDto.getDtlPtNetWt(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString()) == null) {
			return false;
		}
		if (commonValidationService.validateBigDecimalField(stnStageDto.getType(), stnStageDto,
				"Invalid data in actualSilverWeight", stnStageDto.getDtlSiNetWt(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString()) == null) {
			return false;
		}
		if (commonValidationService.validateBigDecimalField(stnStageDto.getType(), stnStageDto,
				"Invalid data in diamondWeight", stnStageDto.getDtlDiamondWt(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString()) == null) {
			return false;
		}
		return commonValidationService.validateBigDecimalField(stnStageDto.getType(), stnStageDto,
				"Invalid data in otherStoneWeight", stnStageDto.getDtlOtherStoneWt(), stnStageDto.getFileId(),
				ErrorTypeEnum.ERROR.toString()) != null;
	}

	private boolean dtlBusinessValidtion(StnStageDto stnStageDto) {
		// validate item code
		return validateItemCode(stnStageDto);
	}

	private boolean validateItemCode(StnStageDto stnStageDto) {
		List<ItemDao> itemDaos = commonValidationService.getActiveItemDaos(stnStageDto.getDtlProductCode(), true);

		if (commonValidationService.validateItemCode(itemDaos, stnStageDto.getType(), stnStageDto,
				stnStageDto.getDtlProductCode(), stnStageDto.getFileId())) {

			boolean isFocItem = itemDaos.get(0).getIsFocItem();
			if (isFocItem) {
				stnStageDto.setDtlBinCode("FOC");
				stnStageDto.setDtlBinGroupCode("FOC");
			} else if (stnStageDto.isStnIbt() && checkIfBinAndBinGroupExist(stnStageDto)) {
				if (stnStageDto.getDtlOrderType().equalsIgnoreCase("P")) {
					stnStageDto.setDtlBinCode(stnStageDto.getDtlBinCode());
					stnStageDto.setDtlBinGroupCode(CUSTOMER_ORDER_BIN);
				} else {
					stnStageDto.setDtlBinCode(stnStageDto.getDtlBinCode());
					stnStageDto.setDtlBinGroupCode("STN");
				}
			} else {
				if (stnStageDto.getDtlOrderType().equalsIgnoreCase("P")) {
					stnStageDto.setDtlBinCode(CUSTOMER_ORDER_BIN);
					stnStageDto.setDtlBinGroupCode(CUSTOMER_ORDER_BIN);
				} else {
					stnStageDto.setDtlBinCode("ZEROBIN");
					stnStageDto.setDtlBinGroupCode("STN");
				}
			}
			stnStageDto.setDtlProductCategory(itemDaos.get(0).getProductCategory().getProductCategoryCode());

			// validate product group code
			validateProductGroupCode(stnStageDto, itemDaos.get(0));
			return true;
		}
		return false;
	}

	private boolean checkIfBinAndBinGroupExist(StnStageDto stn) {
		BinDao bin = binRepository.findOneByBinCodeAndBinGroupBinGroupCode(stn.getDtlBinCode(), "STN");
		return bin != null;
	}

	/**
	 * @param stnStageDto
	 */
	private void validateProductGroupCode(StnStageDto stnStageDto, ItemDao itemDao) {
		if (commonValidationService.validateProductGroupCode(stnStageDto.getProductGroup(), itemDao,
				stnStageDto.getType(), stnStageDto, stnStageDto.getFileId())
				&& (stnStageDto.getProductGroup().equalsIgnoreCase(BI_METAL_STUDDED_CFA_CODE)
						|| stnStageDto.getProductGroup().equalsIgnoreCase(BI_METAL_PLAIN_CFA_CODE))) {

			// validating if it is BI Metal
			if (StringUtils.isEmpty(stnStageDto.getDtlGoNetWt()) || stnStageDto.getDtlGoNetWt().equalsIgnoreCase("0")) {
				dataAuditService.saveDataAuditData(stnStageDto.getType(), MapperUtil.getJsonString(stnStageDto),
						"Actual gold weight can't be empty for BI-Metal", stnStageDto.getFileId(),
						ErrorTypeEnum.WARNING.toString());
			}
			if (StringUtils.isEmpty(stnStageDto.getDtlPtNetWt()) || stnStageDto.getDtlPtNetWt().equalsIgnoreCase("0")) {
				dataAuditService.saveDataAuditData(stnStageDto.getType(), MapperUtil.getJsonString(stnStageDto),
						"Actual platinum weight can't be empty for BI-Metal", stnStageDto.getFileId(),
						ErrorTypeEnum.WARNING.toString());
			}
			// check if it is jewellary item else throw an error
		}

	}

	@Override
	public boolean validateLdtlService(StnStageDto stnStageDto) {
		// validate stone code
		if (!commonValidationService.validateStoneCode(stnStageDto.getLdtlItemNo(), true, stnStageDto.getLdtlItemNo(),
				stnStageDto, stnStageDto.getFileId())) {
			return false;
		}

		// validate item stone mapping
		return commonValidationService.validateItemStoneMapping(stnStageDto.getItemCode(), stnStageDto.getLdtlItemNo(),
				stnStageDto.getLdtlItemNo(), stnStageDto, stnStageDto.getFileId());
	}

	@Override
	public boolean validateMdtlService(StnStageDto stnStageDto) {
		// validate material code
		if (!commonValidationService.validateMaterialCode(stnStageDto.getMdtlItemNo(), true,
				stnStageDto.getMdtlItemNo(), stnStageDto, stnStageDto.getFileId())) {
			return false;
		}

		// validate item material mapping
		return commonValidationService.validateItemMaterialMapping(stnStageDto.getItemCode(),
				stnStageDto.getMdtlItemNo(), stnStageDto.getMdtlItemNo(), stnStageDto, stnStageDto.getFileId());
	}

}
