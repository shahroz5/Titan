/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import java.math.BigDecimal;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.batch.core.ExitStatus;
import org.springframework.batch.core.StepExecution;
import org.springframework.batch.core.StepExecutionListener;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.enums.PlainStuddedEnum;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.InvoiceFileStageDto;
import com.titan.poss.file.dto.InvoiceStageDto;
import com.titan.poss.file.service.CommonValidationService;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.StnAndInvoiceService;
import com.titan.poss.product.constant.PricingTypeEnum;
import com.titan.poss.product.dao.ProductGroupDao;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
public class InvoiceStageProcessor
		implements ItemProcessor<InvoiceFileStageDto, InvoiceStageDto>, StepExecutionListener {

	@Autowired
	private CommonValidationService commonValidationService;

	private String fileAuditId;

	private String destinationLocationCode;

	@Autowired
	private DataAuditService dataAuditService;

	@Autowired
	private StnAndInvoiceService stnAndInvoiceService;

	private static final String ZERO = "0.000";

	@Override
	public InvoiceStageDto process(InvoiceFileStageDto invFileDto) throws Exception {

		try {
			InvoiceStageDto invoiceStageDto = new InvoiceStageDto();
			invoiceStageDto.setFileId(fileAuditId);
			if (invFileDto.getType().equalsIgnoreCase("IHDR")) {
				processIhdr(invFileDto, invoiceStageDto);
			} else if (invFileDto.getType().equalsIgnoreCase("ISAC")) {
				processIsac(invFileDto, invoiceStageDto);
			} else if (invFileDto.getType().equalsIgnoreCase("IDTL")) {
				processIdtl(invFileDto, invoiceStageDto);
			} else if (invFileDto.getType().equalsIgnoreCase("LDTL")) {
				processIldtl(invFileDto, invoiceStageDto);
			} else if (invFileDto.getType().equalsIgnoreCase("MDTL")) {
				processImdtl(invFileDto, invoiceStageDto);
			} else if (invFileDto.getType().equalsIgnoreCase("CTRL")) {
				processIctrl(invFileDto, invoiceStageDto);
			}

			// default is insert flow for ldtl and mdtl
			invoiceStageDto.setInsertUpdate("INSERT");
			return invoiceStageDto;
		} catch (Exception e) {
			dataAuditService.saveDataAuditData(invFileDto.getType(), MapperUtil.getJsonString(invFileDto),
					e.getMessage(), fileAuditId, ErrorTypeEnum.ERROR.toString());
			return null;
		}
	}

	private void processIhdr(InvoiceFileStageDto invFileDto, InvoiceStageDto invoice) {

		processCommonFields(invFileDto, invoice);

		Integer primaryQty = commonValidationService.validateIntegerField(invFileDto.getType(), invFileDto,
				"Invalid cfa tot primary qty: " + invFileDto.getIhdrCfaTotPrimaryQty(),
				invFileDto.getIhdrCfaTotPrimaryQty(), invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIhdrCfaTotPrimaryQty(primaryQty);
		BigDecimal secondaryQty = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid cfa tot secondary  qty: " + invFileDto.getIhdrCfaTotSecondaryQty(),
				invFileDto.getIhdrCfaTotSecondaryQty(), invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIhdrCfaTotSecondaryQty(secondaryQty);
		BigDecimal cfaItemBasicValue = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid cfa item basic value: " + invFileDto.getIhdrCfaItemBasicValue(),
				invFileDto.getIhdrCfaItemBasicValue(), invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIhdrCfaItemBasicValue(cfaItemBasicValue);
		BigDecimal cfaTotDiscountAmount = commonValidationService.validateBigDecimalField(invFileDto.getType(),
				invFileDto, "Invalid cfa tot discount amt: " + invFileDto.getIhdrCfaTotDiscountAmount(),
				invFileDto.getIhdrCfaTotDiscountAmount(), invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIhdrCfaTotDiscountAmount(cfaTotDiscountAmount);
		BigDecimal cfaTaxAmount = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid cfa tax amount: " + invFileDto.getIhdrCfaTaxAmount(), invFileDto.getIhdrCfaTaxAmount(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIhdrCfaTaxAmount(cfaTaxAmount);
		BigDecimal cfaOtherCharges = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid cfa other charges: " + invFileDto.getIhdrCfaOtherCharges(),
				invFileDto.getIhdrCfaOtherCharges(), invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIhdrCfaOtherCharges(cfaOtherCharges);

		invoice.setIhdrDestLocationCode(destinationLocationCode);

	}

	private void processCommonFields(InvoiceFileStageDto invFileDto, InvoiceStageDto invoice) {

		invoice.setType(invFileDto.getType());
		invoice.setTilConstant(invFileDto.getTilConstant());
		invoice.setSrcLocation(invFileDto.getSrcLocation());
		Integer cfaType = commonValidationService.validateIntegerField(invFileDto.getType(), invFileDto,
				"Invalid cfa type: " + invFileDto.getCfaType(), invFileDto.getCfaType(), invoice.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		invoice.setCfaType(cfaType);
		invoice.setCfaProductCode(invFileDto.getCfaProductCode());
		Integer cfaInvoiceNumber = commonValidationService.validateIntegerField(invFileDto.getType(), invFileDto,
				"Invalid invoice number: " + invFileDto.getCfaInvoiceNumber(), invFileDto.getCfaInvoiceNumber(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setCfaInvoiceNumber(cfaInvoiceNumber);
		Date cfaInvoiceDate = commonValidationService.validateDateField(invFileDto.getType(), invFileDto,
				"Invalid invoice number: " + invFileDto.getCfaInvoiceDate(), invFileDto.getCfaInvoiceDate(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setCfaInvoiceDate(cfaInvoiceDate);
		Integer cfaFiscalYear = commonValidationService.validateIntegerField(invFileDto.getType(), invFileDto,
				"Invalid fiscal year: " + invFileDto.getCfaFiscalYear(), invFileDto.getCfaFiscalYear(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setCfaFiscalYear(cfaFiscalYear);
		invoice.setCfaUniqueKey(invFileDto.getCfaUniqueKey());

		invoice.setCfaCustomerNumber(invFileDto.getCfaCustomerNumber());

	}

	private void processIdtl(InvoiceFileStageDto invFileDto, InvoiceStageDto invoice) {
		processCommonFields(invFileDto, invoice);

		invoice.setIdtlItemNo(invFileDto.getIdtlItemNo());
		Integer lineCount = commonValidationService.validateIntegerField(invFileDto.getType(), invFileDto,
				"Invalid linecount: " + invFileDto.getIdtlLineCount(), invFileDto.getIdtlLineCount(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIdtlLineCount(lineCount);
		invoice.setIdtlCfaVariantType(invFileDto.getIdtlCfaVariantType());
		invoice.setIdtlItemNo2(invFileDto.getIdtlItemNo2());
		BigDecimal unitPrice = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid unit price: " + invFileDto.getIdtlUnitPrice(), invFileDto.getIdtlUnitPrice(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIdtlUnitPrice(unitPrice);
		Integer primaryQty = commonValidationService.validateIntegerField(invFileDto.getType(), invFileDto,
				"Invalid primary qty: " + invFileDto.getIdtlPrimaryQty(), invFileDto.getIdtlPrimaryQty(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIdtlPrimaryQty(primaryQty);
		BigDecimal secondaaryQty = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid secondary qty: " + invFileDto.getIdtlSecondaryQty(), invFileDto.getIdtlSecondaryQty(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIdtlSecondaryQty(secondaaryQty);
		BigDecimal cfaNetAmount = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid cfa net amount: " + invFileDto.getIdtlCfaNetAmount(), invFileDto.getIdtlCfaNetAmount(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIdtlCfaNetAmount(cfaNetAmount);
		invoice.setIdtlLotNumber(invFileDto.getIdtlLotNumber());
		BigDecimal cfaF1 = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid cfa f1: " + invFileDto.getIdtlCfaF1(), invFileDto.getIdtlCfaF1(), invoice.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		invoice.setIdtlCfaF1(cfaF1);
		BigDecimal cfaDiamondWt = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid cfa diamond net wt: " + invFileDto.getIdtlCfaDiamondWeight(),
				invFileDto.getIdtlCfaDiamondWeight(), invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIdtlCfaDiamondWeight(cfaDiamondWt);
		BigDecimal cfaOtherStoneWt = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid cfa other stone net wt: " + invFileDto.getIdtlCfaOtherStoneWeight(),
				invFileDto.getIdtlCfaOtherStoneWeight(), invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIdtlCfaOtherStoneWeight(cfaOtherStoneWt);
		invoice.setIdtlCfaInvoiceType(invFileDto.getIdtlCfaInvoiceType());
		BigDecimal goldNetWt = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid gold net wt: " + invFileDto.getIdtlGoNetWt(), invFileDto.getIdtlGoNetWt(), invoice.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		invoice.setIdtlGoNetWt(goldNetWt);
		BigDecimal platinumNetWt = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid platinum net wt: " + invFileDto.getIdtlPtNetWt(), invFileDto.getIdtlPtNetWt(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIdtlPtNetWt(platinumNetWt);
		BigDecimal stoneNetWt = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid stone net weight: " + invFileDto.getIdtlStnNetWt(), invFileDto.getIdtlStnNetWt(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIdtlStnNetWt(stoneNetWt);
		BigDecimal silverNetWt = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid silver net wt: " + invFileDto.getIdtlSiNetWt(), invFileDto.getIdtlSiNetWt(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIdtlSiNetWt(silverNetWt);
		BigDecimal otherNetWt = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid other net wt: " + invFileDto.getIdtlOtherNetWt(), invFileDto.getIdtlOtherNetWt(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIdtlOtherNetWt(otherNetWt);
		Date mfgDate = commonValidationService.validateDateField(invFileDto.getType(), invFileDto,
				"Invalid mfg date: " + invFileDto.getIdtlMfgDate(), invFileDto.getIdtlMfgDate(), invoice.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		invoice.setIdtlMfgDate(mfgDate);
		invoice.setIdtlOrderNo(invFileDto.getIdtlOrderNo());

		invoice.setIssuedWeightDetails(getIssuedWeightDetails(invFileDto));
		invoice.setItemDetails(stnAndInvoiceService.setItemDetails(invFileDto.getIdtlCfaF1(),
				invFileDto.getIdtlIsHallMarking(), invFileDto.getIdtlHallMarkingCode(),
				invFileDto.getIdtlHallMarkingCenterName(), invFileDto.getIdtlHallMarkedDate(),
				invFileDto.getIdtlHallMarkRemarks(), invFileDto.getIdtlHallMarkRemarks1()));
		boolean isHallMarking = StringUtils.isEmpty(invFileDto.getIdtlIsHallMarking())
				|| invFileDto.getIdtlIsHallMarking().equalsIgnoreCase("0") ? false : true;
		invoice.setHallMarking(isHallMarking);
	}

	/**
	 * @param invFileDto
	 * @return
	 */
	private String getIssuedWeightDetails(InvoiceFileStageDto invFileDto) {

		if (StringUtils.isEmpty(invFileDto.getIdtlSiNetWt())) {
			invFileDto.setIdtlSiNetWt(ZERO);
		}
		if (StringUtils.isEmpty(invFileDto.getIdtlGoNetWt())) {
			invFileDto.setIdtlGoNetWt(ZERO);
		}
		if (StringUtils.isEmpty(invFileDto.getIdtlPtNetWt())) {
			invFileDto.setIdtlPtNetWt(ZERO);
		}
		if (StringUtils.isEmpty(invFileDto.getIdtlStnNetWt())) {
			invFileDto.setIdtlStnNetWt(ZERO);
		}
		if (StringUtils.isEmpty(invFileDto.getIdtlCfaDiamondWeight())) {
			invFileDto.setIdtlCfaDiamondWeight(ZERO);
		}
		if (StringUtils.isEmpty(invFileDto.getIdtlCfaOtherStoneWeight())) {
			invFileDto.setIdtlCfaOtherStoneWeight(ZERO);
		}
		// calculate wts
		calcuateRequiredWeights(invFileDto);

		Map<String, String> weightDetails = new HashMap<>();
		weightDetails.put("silverWeight",
				commonValidationService.roundWeights(invFileDto.getIdtlSiNetWt(), invFileDto.getIdtlPrimaryQty()));
		weightDetails.put("goldWeight",
				commonValidationService.roundWeights(invFileDto.getIdtlGoNetWt(), invFileDto.getIdtlPrimaryQty()));
		weightDetails.put("platinumWeight",
				commonValidationService.roundWeights(invFileDto.getIdtlPtNetWt(), invFileDto.getIdtlPrimaryQty()));
		weightDetails.put("stoneWeight", commonValidationService.roundWeights(invFileDto.getIdtlCfaOtherStoneWeight(),
				invFileDto.getIdtlPrimaryQty()));
		weightDetails.put("diamondWeight", commonValidationService.roundWeights(invFileDto.getIdtlCfaDiamondWeight(),
				invFileDto.getIdtlPrimaryQty()));
		weightDetails.put("materialWeight",
				commonValidationService.roundWeights(invFileDto.getIdtlOtherNetWt(), invFileDto.getIdtlPrimaryQty()));

		Map<String, Object> stockTransferDetailsWeightDetails = new LinkedHashMap<>();
		stockTransferDetailsWeightDetails.put("type", "WEIGHT_DETAILS");
		stockTransferDetailsWeightDetails.put("data", weightDetails);
		return MapperUtil.getStringFromJson(stockTransferDetailsWeightDetails);
	}

	private void calcuateRequiredWeights(InvoiceFileStageDto invFileDto) {
		ProductGroupDao productGroup = commonValidationService.getProductGroup(invFileDto.getCfaProductCode(), true);
		if (productGroup == null) {
			dataAuditService.saveDataAuditData(invFileDto.getType(), MapperUtil.getJsonString(invFileDto),
					"Product group: " + invFileDto.getCfaProductCode() + " is not present/active.", fileAuditId,
					ErrorTypeEnum.ERROR.toString());
		} else {
			if (productGroup.getPlainStudded().equalsIgnoreCase(PlainStuddedEnum.P.toString())) {
				handlePlainItems(invFileDto, productGroup);
			} else if (productGroup.getPlainStudded().equalsIgnoreCase(PlainStuddedEnum.S.toString())) {
				handleStuddedItems(invFileDto, productGroup);
			}
		}
	}

	private void handlePlainItems(InvoiceFileStageDto invFileDto, ProductGroupDao productGroup) {
		if (productGroup.getPricingType().equalsIgnoreCase(PricingTypeEnum.PJWS.toString())) {
			invFileDto.setIdtlCfaOtherStoneWeight(
					new BigDecimal(invFileDto.getIdtlCfaOtherStoneWeight()).multiply(new BigDecimal(".2")).toString());
			invFileDto.setIdtlCfaDiamondWeight(
					new BigDecimal(invFileDto.getIdtlCfaDiamondWeight()).multiply(new BigDecimal(".2")).toString());
		}
		if (productGroup.getItemType() != null) {
			if (productGroup.getItemType().getItemTypeCode().equalsIgnoreCase(MetalTypeCodeEnum.J.getCode())) {
				invFileDto.setIdtlGoNetWt(commonValidationService
						.calculatePlainWt(invFileDto.getIdtlSecondaryQty(), invFileDto.getIdtlOtherNetWt()).toString());
			} else if (productGroup.getItemType().getItemTypeCode().equalsIgnoreCase(MetalTypeCodeEnum.L.getCode())) {
				invFileDto.setIdtlPtNetWt(commonValidationService
						.calculatePlainWt(invFileDto.getIdtlSecondaryQty(), invFileDto.getIdtlOtherNetWt()).toString());
			} else if (productGroup.getItemType().getItemTypeCode().equalsIgnoreCase(MetalTypeCodeEnum.P.getCode())) {
				invFileDto.setIdtlSiNetWt(commonValidationService
						.calculatePlainWt(invFileDto.getIdtlSecondaryQty(), invFileDto.getIdtlOtherNetWt()).toString());
			}
		}
	}

	private void handleStuddedItems(InvoiceFileStageDto invFileDto, ProductGroupDao productGroup) {
		invFileDto.setIdtlCfaOtherStoneWeight(
				new BigDecimal(invFileDto.getIdtlCfaOtherStoneWeight()).multiply(new BigDecimal(".2")).toString());
		invFileDto.setIdtlCfaDiamondWeight(
				new BigDecimal(invFileDto.getIdtlCfaDiamondWeight()).multiply(new BigDecimal(".2")).toString());
		if (productGroup.getItemType() != null) {
			if (productGroup.getItemType().getItemTypeCode().equalsIgnoreCase(MetalTypeCodeEnum.J.getCode())) {
				invFileDto.setIdtlGoNetWt(commonValidationService
						.calculateStuddedWt(invFileDto.getIdtlSecondaryQty(), invFileDto.getIdtlCfaOtherStoneWeight(),
								invFileDto.getIdtlCfaDiamondWeight(), invFileDto.getIdtlOtherNetWt())
						.toString());
			} else if (productGroup.getItemType().getItemTypeCode().equalsIgnoreCase(MetalTypeCodeEnum.L.getCode())) {
				invFileDto.setIdtlPtNetWt(commonValidationService
						.calculateStuddedWt(invFileDto.getIdtlSecondaryQty(), invFileDto.getIdtlCfaOtherStoneWeight(),
								invFileDto.getIdtlCfaDiamondWeight(), invFileDto.getIdtlOtherNetWt())
						.toString());
			} else if (productGroup.getItemType().getItemTypeCode().equalsIgnoreCase(MetalTypeCodeEnum.P.getCode())) {
				invFileDto.setIdtlSiNetWt(commonValidationService
						.calculateStuddedWt(invFileDto.getIdtlSecondaryQty(), invFileDto.getIdtlCfaOtherStoneWeight(),
								invFileDto.getIdtlCfaDiamondWeight(), invFileDto.getIdtlOtherNetWt())
						.toString());
			}
		}
	}

	private void processIsac(InvoiceFileStageDto invFileDto, InvoiceStageDto invoice) {
		processCommonFields(invFileDto, invoice);

		Integer lineCount = commonValidationService.validateIntegerField(invFileDto.getType(), invFileDto,
				"Invalid linecount: " + invFileDto.getIsacLineCount(), invFileDto.getIsacLineCount(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIsacLineCount(lineCount);
		Integer lineDtlCount = commonValidationService.validateIntegerField(invFileDto.getType(), invFileDto,
				"Invalid linedtl count: " + invFileDto.getIsacLineDtlCount(), invFileDto.getIsacLineDtlCount(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIsacLineDtlCount(lineDtlCount);
		invoice.setIsacGlKey(invFileDto.getIsacGlKey());
		invoice.setIsacDcInd(invFileDto.getIsacDcInd());
		BigDecimal discountPerc = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid disc perc: " + invFileDto.getIsacDiscPerc(), invFileDto.getIsacDiscPerc(), invoice.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		invoice.setIsacDiscPerc(discountPerc);
		BigDecimal discountAmt = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid disc amt: " + invFileDto.getIsacDiscAmt(), invFileDto.getIsacDiscAmt(), invoice.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		invoice.setIsacDiscAmt(discountAmt);
		BigDecimal discountSrcAmt = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid disc src amt: " + invFileDto.getIsacDiscSrcAmt(), invFileDto.getIsacDiscSrcAmt(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIsacDiscSrcAmt(discountSrcAmt);

	}

	private void processIldtl(InvoiceFileStageDto invFileDto, InvoiceStageDto invoice) {
		invoice.setType(invFileDto.getType());
		Integer lineCount = commonValidationService.validateIntegerField(invFileDto.getType(), invFileDto,
				"Invalid line count: " + invFileDto.getIldtlLineCount(), invFileDto.getIldtlLineCount(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIldtlLineCount(lineCount);
		Integer lineDtlCount = commonValidationService.validateIntegerField(invFileDto.getType(), invFileDto,
				"Invalid line dtl count: " + invFileDto.getIldtlLineDtlCount(), invFileDto.getIldtlLineDtlCount(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIldtlLineDtlCount(lineDtlCount);
		invoice.setIldtlItemNo(invFileDto.getIldtlItemNo());
		BigDecimal stnWt = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid stn weight: " + invFileDto.getIldtlStnWeight(), invFileDto.getIldtlStnWeight(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIldtlStnWeight(stnWt);
		Integer stnQty = commonValidationService.validateIntegerField(invFileDto.getType(), invFileDto,
				"Invalid stn qty: " + invFileDto.getIldtlStnQty(), invFileDto.getIldtlStnQty(), invoice.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		invoice.setIldtlStnQty(stnQty);

	}

	private void processImdtl(InvoiceFileStageDto invFileDto, InvoiceStageDto invoice) {
		invoice.setType(invFileDto.getType());
		Integer lineCount = commonValidationService.validateIntegerField(invFileDto.getType(), invFileDto,
				"Invalid line count: " + invFileDto.getImdtlLineCount(), invFileDto.getImdtlLineCount(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setImdtlLineCount(lineCount);
		Integer lineDtlCount = commonValidationService.validateIntegerField(invFileDto.getType(), invFileDto,
				"Invalid line dtl count: " + invFileDto.getImdtlLineDtlCount(), invFileDto.getImdtlLineDtlCount(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setImdtlLineDtlCount(lineDtlCount);
		invoice.setImdtlItemNo(invFileDto.getImdtlItemNo());
		BigDecimal stnWt = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid stn weight: " + invFileDto.getImdtlStnWeight(), invFileDto.getImdtlStnWeight(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setImdtlStnWeight(stnWt);
		Integer stnQty = commonValidationService.validateIntegerField(invFileDto.getType(), invFileDto,
				"Invalid stn qty: " + invFileDto.getImdtlStnQty(), invFileDto.getImdtlStnQty(), invoice.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		invoice.setImdtlStnQty(stnQty);

	}

	private void processIctrl(InvoiceFileStageDto invFileDto, InvoiceStageDto invoice) {
		invoice.setType(invFileDto.getType());
		Integer fileLines = commonValidationService.validateIntegerField(invFileDto.getType(), invFileDto,
				"Invalid cfa file lines: " + invFileDto.getIctrlCfaFileLines(), invFileDto.getIctrlCfaFileLines(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIctrlCfaFileLines(fileLines);
		Integer lineCount = commonValidationService.validateIntegerField(invFileDto.getType(), invFileDto,
				"Invalid hdr line count: " + invFileDto.getIctrlHdrLineCount(), invFileDto.getIctrlHdrLineCount(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIctrlHdrLineCount(lineCount);
		BigDecimal totalWt = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid hdr total weight: " + invFileDto.getIctrlHdrTotalWeight(), invFileDto.getIctrlHdrTotalWeight(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIctrlHdrTotalWeight(totalWt);
		BigDecimal totalValue = commonValidationService.validateBigDecimalField(invFileDto.getType(), invFileDto,
				"Invalid hdr total value: " + invFileDto.getIctrlHdrTotalValue(), invFileDto.getIctrlHdrTotalValue(),
				invoice.getFileId(), ErrorTypeEnum.ERROR.toString());
		invoice.setIctrlHdrTotalValue(totalValue);

	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileAuditId = stepExecution.getJobExecution().getExecutionContext().getString("invoiceFileAuditId");
		String fileName = stepExecution.getJobParameters().getString("invoiceFileName");
		String destLocationCode = fileName.replace(".txt", "");
		int initialIndex = destLocationCode.indexOf('_');
		int finalIndex = destLocationCode.indexOf('.');
		destinationLocationCode = destLocationCode.substring(initialIndex + 1, finalIndex);
		stepExecution.getJobExecution().getExecutionContext().put("locationCode", destinationLocationCode);
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		return ExitStatus.COMPLETED;
	}

}
