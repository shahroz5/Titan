/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.service.impl;

import java.io.File;
import java.math.BigDecimal;
import java.util.List;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.domain.constant.enums.DelimiterEnum;
import com.titan.poss.core.utils.FileUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.InvoiceStageDto;
import com.titan.poss.file.service.CommonValidationService;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.InvoiceValidationService;
import com.titan.poss.location.dao.LocationDao;
import com.titan.poss.product.dao.ItemDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class InvoiceValidationServiceImpl implements InvoiceValidationService {

	@Autowired
	private DataAuditService dataAuditService;

	@Autowired
	private CommonValidationService commonValidationService;

	private static final Integer INVOICE_TRANSFER_TYPE = 115;

	@Override
	public boolean validateFileColumnLength(File stnFile) {
		boolean flag = true;
		List<String[]> list = FileUtil.readFile(stnFile, DelimiterEnum.CSV.getValue().charAt(0), 0);
		for (String[] stringList : list) {
			if (validateFileColumns(stringList)) {
				flag = true;
			} else {
				flag = false;
				break;
			}
		}
		return flag;
	}

	private boolean validateFileColumns(String[] stringList) {
		return ((stringList[0].equals("IHDR")
				&& stringList.length == FileIntegrationConstants.INVOICE_IHDR_COLUMN_COUNT)
				// in idtl index 28 and 29 may or may not come
				|| (stringList[0].equals("IDTL")
						&& stringList.length == FileIntegrationConstants.INVOICE_IDTL_COLUMN_COUNT)
				|| (stringList[0].equals("IDTL")
						&& stringList.length == FileIntegrationConstants.INVOICE_IDTL_COLUMN_COUNT - 1)
				|| (stringList[0].equals("IDTL")
						&& stringList.length == FileIntegrationConstants.INVOICE_IDTL_COLUMN_COUNT - 2)
				|| (stringList[0].equals("ISAC")
						&& stringList.length == FileIntegrationConstants.INVOICE_ISAC_COLUMN_COUNT)
				|| (stringList[0].equals("LDTL")
						&& stringList.length == FileIntegrationConstants.INVOICE_ILDTL_COLUMN_COUNT)
				|| (stringList[0].equals("MDTL")
						&& stringList.length == FileIntegrationConstants.INVOICE_IMDTL_COLUMN_COUNT)
				|| (stringList[0].equals("CTRL")
						&& stringList.length == FileIntegrationConstants.INVOICE_ICTRL_COLUMN_COUNT));

	}

	@Override
	public boolean validateIhdrService(InvoiceStageDto invoiceStageDto) {
		if (!validateIhdrNotNullFields(invoiceStageDto)) {
			return false;
		}
		return validateSrcLocation(invoiceStageDto);

	}

	/**
	 * @param invoiceStageDto
	 */
	private boolean validateSrcLocation(InvoiceStageDto invoiceStageDto) {
		LocationDao locationDao = commonValidationService.validateLocationCode(invoiceStageDto.getSrcLocation(),
				invoiceStageDto.getIdtlItemNo2(), invoiceStageDto, invoiceStageDto.getFileId(),
				FileIntegrationConstants.LOCATION_TYPE_CFA, null);
		if (locationDao != null) {
			invoiceStageDto.setCurrencyCode(locationDao.getBaseCurrency().getCurrencyCode());
			return validateTransferType(invoiceStageDto, locationDao);
		}
		return false;
	}

	/**
	 * @param invoiceStageDto
	 * @param locationDao
	 */
	private boolean validateTransferType(InvoiceStageDto invoiceStageDto, LocationDao locationDao) {
		if (!(invoiceStageDto.getCfaType().equals(INVOICE_TRANSFER_TYPE)
				&& locationDao.getLocationTypeCode().equalsIgnoreCase("CFA"))) {
			dataAuditService.saveDataAuditData(invoiceStageDto.getIdtlItemNo2(),
					MapperUtil.getJsonString(invoiceStageDto),
					"Invalid dest location type: " + invoiceStageDto.getCfaType()
							+ ". Transfer type should be 115 for invocie.",
					invoiceStageDto.getFileId(), ErrorTypeEnum.ERROR.toString());
			return false;
		}
		return true;
	}

	private boolean validateItemCode(InvoiceStageDto invoiceStageDto) {
		List<ItemDao> itemDaos = commonValidationService.getActiveItemDaos(invoiceStageDto.getIdtlItemNo2(), true);
		if (commonValidationService.validateItemCode(itemDaos, invoiceStageDto.getIdtlItemNo2(), invoiceStageDto,
				invoiceStageDto.getIdtlItemNo2(), invoiceStageDto.getFileId())) {
			if (invoiceStageDto.getIdtlItemNo2().equalsIgnoreCase("88")
					|| invoiceStageDto.getIdtlItemNo2().equalsIgnoreCase("89")) {
				invoiceStageDto.setIdtlCfaDiamondWeight(new BigDecimal(0));
			}
			boolean isFocItem = itemDaos.get(0).getIsFocItem();
			if (isFocItem) {
				invoiceStageDto.setIdtlBinCode("FOC");
				invoiceStageDto.setIdtlBinGroupCode("FOC");
			} else if (invoiceStageDto.getIdtlCfaInvoiceType().equalsIgnoreCase("P")) {
				invoiceStageDto.setIdtlBinCode("CUSTOMERORDERBIN");
				invoiceStageDto.setIdtlBinGroupCode("CUSTOMERORDERBIN");
			} else {
				invoiceStageDto.setIdtlBinCode("ZEROBIN");
				invoiceStageDto.setIdtlBinGroupCode("PURCFA");
			}

			invoiceStageDto.setProductCategoryCode(itemDaos.get(0).getProductCategory().getProductCategoryCode());
			// validate product group code
			validateProductGroupCode(invoiceStageDto, itemDaos.get(0));
			return true;
		}
		return false;
	}

	/**
	 * @param invoiceStageDto
	 * @param itemDao
	 */
	private void validateProductGroupCode(InvoiceStageDto invoiceStageDto, ItemDao itemDao) {
		commonValidationService.validateProductGroupCode(invoiceStageDto.getCfaProductCode(), itemDao,
				invoiceStageDto.getIdtlItemNo2(), invoiceStageDto, invoiceStageDto.getFileId());
	}

	/**
	 * @param invoiceStageDto
	 */
	private boolean validateIhdrNotNullFields(InvoiceStageDto invoiceStageDto) {

		// validating SAP code
		if (StringUtils.isEmpty(invoiceStageDto.getCfaCustomerNumber())) {
			dataAuditService.saveDataAuditData(invoiceStageDto.getIdtlItemNo2(),
					MapperUtil.getJsonString(invoiceStageDto), "SAP code is mandatory for the Destination Boutique",
					invoiceStageDto.getFileId(), ErrorTypeEnum.ERROR.toString());
			return false;
		}

		// validate fiscal year
		// FiscalYear validation removed
//		return commonValidationService.validateFiscalYear(invoiceStageDto.getType(),
//				invoiceStageDto.getIhdrDestLocationCode(), MapperUtil.getJsonString(invoiceStageDto),
//				invoiceStageDto.getCfaFiscalYear() - 1, invoiceStageDto.getFileId(), ErrorTypeEnum.ERROR.toString());
		return true;
	}

	@Override
	public boolean validateIdtlService(InvoiceStageDto invoiceStageDto) {
		return validateItemCode(invoiceStageDto);
	}

	@Override
	public boolean validateLdtlService(InvoiceStageDto invoiceStageDto) {
		// validate stone code
		if (!commonValidationService.validateStoneCode(invoiceStageDto.getIldtlItemNo(), true,
				invoiceStageDto.getIldtlItemNo(), invoiceStageDto, invoiceStageDto.getFileId())) {
			return false;
		}

		// validate item stone mapping
		return commonValidationService.validateItemStoneMapping(invoiceStageDto.getItemCode(),
				invoiceStageDto.getIldtlItemNo(), invoiceStageDto.getIldtlItemNo(), invoiceStageDto,
				invoiceStageDto.getFileId());
	}

	@Override
	public boolean validateMdtlService(InvoiceStageDto invoiceStageDto) {
		// validate material code
		if (!commonValidationService.validateMaterialCode(invoiceStageDto.getImdtlItemNo(), true,
				invoiceStageDto.getImdtlItemNo(), invoiceStageDto, invoiceStageDto.getFileId())) {
			return false;
		}

		// validate item material mapping
		return commonValidationService.validateItemMaterialMapping(invoiceStageDto.getItemCode(),
				invoiceStageDto.getImdtlItemNo(), invoiceStageDto.getImdtlItemNo(), invoiceStageDto,
				invoiceStageDto.getFileId());

	}

}
