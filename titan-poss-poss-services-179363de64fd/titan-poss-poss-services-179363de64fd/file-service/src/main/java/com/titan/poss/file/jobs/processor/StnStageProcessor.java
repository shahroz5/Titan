/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.processor;

import java.math.BigDecimal;
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

import com.jcraft.jsch.Logger;
import com.titan.poss.core.domain.constant.ErrorTypeEnum;
import com.titan.poss.core.enums.MetalTypeCodeEnum;
import com.titan.poss.core.enums.PlainStuddedEnum;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.StnFileStageDto;
import com.titan.poss.file.dto.StnStageDto;
import com.titan.poss.file.service.CommonValidationService;
import com.titan.poss.file.service.DataAuditService;
import com.titan.poss.file.service.StnAndInvoiceService;
import com.titan.poss.product.constant.PricingTypeEnum;
import com.titan.poss.product.dao.ProductGroupDao;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
@Slf4j
public class StnStageProcessor implements ItemProcessor<StnFileStageDto, StnStageDto>, StepExecutionListener {

	@Autowired
	private CommonValidationService commonValidationService;

	@Autowired
	private DataAuditService dataAuditService;

	@Autowired
	private StnAndInvoiceService stnAndInvoiceService;

	private String fileId;

	private String locationCode;

	private static final String ZERO = "0.000";

	private String stnIbt;
	
	private String productGroup;

	@Override
	public StnStageDto process(StnFileStageDto stnFileDto) throws Exception {
		try {
			StnStageDto stn = new StnStageDto();
			stn.setFileId(fileId);

			if (stnFileDto.getType().equalsIgnoreCase("HDR")) {
				processHdr(stnFileDto, stn);
			} else if (stnFileDto.getType().equalsIgnoreCase("DTL")) {
				processDtl(stnFileDto, stn);
			} else if (stnFileDto.getType().equalsIgnoreCase("LDTL")) {
				processLdtl(stnFileDto, stn);
			} else if (stnFileDto.getType().equalsIgnoreCase("MDTL")) {
				processMdtl(stnFileDto, stn);
			} else if (stnFileDto.getType().equalsIgnoreCase("CTRL")) {
				processCtrl(stnFileDto, stn);
			}

			// checking if the stn file is for ibt
			if (stnIbt.equalsIgnoreCase("true")) {
				stn.setStnIbt(true);
				stn.setDtlBinCode(stnFileDto.getDtlBinCode());
			} else {
				stn.setStnIbt(false);
			}
			// default is insert flow for ldtl and mdtl
			stn.setInsertUpdate("INSERT");
			return stn;
		} catch (Exception e) {
			dataAuditService.saveDataAuditData(ErrorTypeEnum.ERROR.toString(), MapperUtil.getJsonString(stnFileDto),
					e.getMessage(), fileId, ErrorTypeEnum.ERROR.toString());
			return null;
		}
	}

	private void processHdr(StnFileStageDto stnFileDto, StnStageDto stn) {

		processCommonFields(stnFileDto, stn);
		stn.setStmDate2(stnFileDto.getStmDate2());
		Integer shipQty = commonValidationService.validateIntegerField(stnFileDto.getHdrShipQty(), stnFileDto,
				"Invalid Ship qty: " + stnFileDto.getHdrShipQty(), stnFileDto.getHdrShipQty(), stn.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		stn.setHdrShipQty(shipQty);
		BigDecimal shipQty2 = commonValidationService.validateBigDecimalField(stnFileDto.getHdrShipQty2(), stnFileDto,
				"Invalid ship qty 2: " + stnFileDto.getHdrShipQty2(), stnFileDto.getHdrShipQty2(), stn.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		stn.setHdrShipQty2(shipQty2);
		BigDecimal stmValue = commonValidationService.validateBigDecimalField(stnFileDto.getHdrStmValue(), stnFileDto,
				"Invalid stm value: " + stnFileDto.getHdrStmValue(), stnFileDto.getHdrStmValue(), stn.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		stn.setHdrStmValue(stmValue);
		stn.setHdrCarrierName(stnFileDto.getHdrCarrierName());
		stn.setHdrCreatedBy(stnFileDto.getHdrCreatedBy());
		stn.setHdrStmCreatedDate(stnFileDto.getHdrStmCreatedDate());
		stn.setHdrStmCreatedTime(stnFileDto.getHdrStmCreatedTime());
		stn.setHdrUpdatedBy(stnFileDto.getHdrUpdatedBy());
		stn.setHdrDocketNumber(stnFileDto.getHdrDocketNumber());

		stn.setHdrCarrierDetails(getHdrCarrierDetails(stnFileDto));

		locationCode = stnFileDto.getLocation();
	}

	private String getHdrCarrierDetails(StnFileStageDto stn) {

		Map<String, String> carrierDetails = new HashMap<>();
		carrierDetails.put("docketNumber", stn.getHdrDocketNumber());
		carrierDetails.put("courierCompany", stn.getHdrCarrierName());
		carrierDetails.put("lockNumber", "");
		carrierDetails.put("roadPermitNumber", "");
		Map<String, Object> stockTransferCarrierDetails = new LinkedHashMap<>();
		stockTransferCarrierDetails.put("type", "courier");
		stockTransferCarrierDetails.put("data", carrierDetails);
		return MapperUtil.getStringFromJson(stockTransferCarrierDetails);
	}

	private void processDtl(StnFileStageDto stnFileDto, StnStageDto stn) {

		processCommonFields(stnFileDto, stn);
		stn.setDtlSlNo(stnFileDto.getDtlSlNo());
		stn.setDtlOrderType(stnFileDto.getDtlOrderType());
		stn.setDtlGoldRate(stnFileDto.getDtlGoldRate());
		stn.setDtlProductCode(stnFileDto.getDtlProductCode());
		stn.setDtlProductValue1(stnFileDto.getDtlProductValue1());
		stn.setDtlProductQty(stnFileDto.getDtlProductQty());
		stn.setDtlProductWt(stnFileDto.getDtlProductWt());
		stn.setDtlProductValue2(stnFileDto.getDtlProductValue2());
		stn.setDtlLotNumber(stnFileDto.getDtlLotNumber());
		stn.setDtlActualF1(stnFileDto.getDtlActualF1());
		stn.setDtlDiamondWt(stnFileDto.getDtlDiamondWt());
		stn.setDtlOtherStoneWt(stnFileDto.getDtlOtherStoneWt());
		stn.setDtlOrderNo(stnFileDto.getDtlOrderNo());
		stn.setDtlIgstPerc(stnFileDto.getDtlIgstPerc());
		stn.setDtlIgstVal(stnFileDto.getDtlIgstVal());
		stn.setDtlSgstPerc(stnFileDto.getDtlSgstPerc());
		stn.setDtlSgstVal(stnFileDto.getDtlSgstVal());
		stn.setDtlCgstPerc(stnFileDto.getDtlCgstPerc());
		stn.setDtlCgstVal(stnFileDto.getDtlCgstVal());
		stn.setDtlUtgstPerc(stnFileDto.getDtlUtgstPerc());
		stn.setDtlUtgstVal(stnFileDto.getDtlUtgstVal());
		stn.setDtlGoNetWt(stnFileDto.getDtlGoNetWt());
		stn.setDtlPtNetWt(stnFileDto.getDtlPtNetWt());
		stn.setDtlStnNetWt(stnFileDto.getDtlStnNetWt());
		stn.setDtlSiNetWt(stnFileDto.getDtlSiNetWt());
		stn.setDtlOtherNetWt(stnFileDto.getDtlOtherNetWt());

		stn.setDtlTaxDetails(getDtlTaxDetails(stnFileDto));
		stn.setDtlIssuedWeightDetails(getDtlIssuedWeightDetails(stnFileDto));
		stn.setDtlItemDetails(stnAndInvoiceService.setItemDetails(stn.getDtlActualF1(),
				stnFileDto.getDtlIsHallMarking(), stnFileDto.getDtlHallMarkingCode(),
				stnFileDto.getDtlHallMarkingCenterName(), stnFileDto.getDtlHallMarkedDate(),
				stnFileDto.getDtlHallMarkRemarks(), stnFileDto.getDtlHallMarkRemarks1()));
		boolean isHallMarking = StringUtils.isEmpty(stnFileDto.getDtlIsHallMarking())
				|| stnFileDto.getDtlIsHallMarking().equalsIgnoreCase("0") ? false : true;
		stn.setDtlIsHallMarking(isHallMarking);

	}

	private void processCommonFields(StnFileStageDto stnFileDto, StnStageDto stn) {
		Integer deliveryNumber = commonValidationService.validateIntegerField(stnFileDto.getType(), stnFileDto,
				"Invalid delivery Number: " + stnFileDto.getDeliveryNo(), stnFileDto.getDeliveryNo(), stn.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		stn.setDeliveryNo(deliveryNumber);
		stn.setType(stnFileDto.getType());
		stn.setTilConstant(stnFileDto.getTilConstant());
		stn.setLocation(stnFileDto.getLocation());
		Integer transferType = commonValidationService.validateIntegerField(stnFileDto.getTransferType(), stnFileDto,
				"Invalid Transfer type: " + stnFileDto.getTransferType(), stnFileDto.getTransferType(), stn.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		stn.setTransferType(transferType);
		stn.setProductGroup(stnFileDto.getProductGroup());
		productGroup = stnFileDto.getProductGroup();
		//log.info("---------global product group----------"+productGroup);
		Integer createdYear = commonValidationService.validateIntegerField(stnFileDto.getCreatedYear(), stnFileDto,
				"Invalid Created year: " + stnFileDto.getCreatedYear(), stnFileDto.getCreatedYear(), stn.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		stn.setCreatedYear(createdYear);
		stn.setStmDate(stnFileDto.getStmDate());
		stn.setFactoryCode(stnFileDto.getFactoryCode());
	}

	private void processLdtl(StnFileStageDto stnFileDto, StnStageDto stn) {

		stn.setType(stnFileDto.getType());
		Integer lineCount = commonValidationService.validateIntegerField(stnFileDto.getType(), stnFileDto,
				"Invalid line count: " + stnFileDto.getLdtlLineCount(), stnFileDto.getLdtlLineCount(), stn.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		stn.setLdtlLineCount(lineCount);
		Integer lineDtlCount = commonValidationService.validateIntegerField(stnFileDto.getType(), stnFileDto,
				"Invalid line dtl count: " + stnFileDto.getLdtlLineDtlCount(), stnFileDto.getLdtlLineDtlCount(),
				stn.getFileId(), ErrorTypeEnum.ERROR.toString());
		stn.setLdtlLineDtlCount(lineDtlCount);
		stn.setLdtlItemNo(stnFileDto.getLdtlItemNo());
		BigDecimal stnWt = commonValidationService.validateBigDecimalField(stnFileDto.getType(), stnFileDto,
				"Invalid stn weight: " + stnFileDto.getLdtlStnWeight(), stnFileDto.getLdtlStnWeight(), stn.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		stn.setLdtlStnWeight(stnWt);
		Integer stnQty = commonValidationService.validateIntegerField(stnFileDto.getType(), stnFileDto,
				"Invalid stn qty: " + stnFileDto.getLdtlStnQty(), stnFileDto.getLdtlStnQty(), stnFileDto.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		stn.setLdtlStnQty(stnQty);

	}

	private void processMdtl(StnFileStageDto stnFileDto, StnStageDto stn) {

		stn.setType(stnFileDto.getType());
		Integer lineCount = commonValidationService.validateIntegerField(stnFileDto.getType(), stnFileDto,
				"Invalid line count: " + stnFileDto.getMdtlLineCount(), stnFileDto.getMdtlLineCount(), stn.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		stn.setMdtlLineCount(lineCount);
		Integer lineDtlCount = commonValidationService.validateIntegerField(stnFileDto.getType(), stnFileDto,
				"Invalid line dtl count: " + stnFileDto.getMdtlLineDtlCount(), stnFileDto.getMdtlLineDtlCount(),
				stn.getFileId(), ErrorTypeEnum.ERROR.toString());
		stn.setMdtlLineDtlCount(lineDtlCount);
		stn.setMdtlItemNo(stnFileDto.getMdtlItemNo());
		BigDecimal stnWt = commonValidationService.validateBigDecimalField(stnFileDto.getType(), stnFileDto,
				"Invalid stn weight: " + stnFileDto.getMdtlStnWeight(), stnFileDto.getMdtlStnWeight(), stn.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		stn.setMdtlStnWeight(stnWt);
		Integer stnQty = commonValidationService.validateIntegerField(stnFileDto.getType(), stnFileDto,
				"Invalid stn qty: " + stnFileDto.getMdtlStnQty(), stnFileDto.getMdtlStnQty(), stnFileDto.getFileId(),
				ErrorTypeEnum.ERROR.toString());
		stn.setMdtlStnQty(stnQty);

	}

	private void processCtrl(StnFileStageDto stnFileDto, StnStageDto stn) {

		stn.setType(stnFileDto.getType());
		Integer fileLines = commonValidationService.validateIntegerField(stnFileDto.getType(), stnFileDto,
				"Invalid cfa file lines: " + stnFileDto.getCtrlTotalLines(), stnFileDto.getCtrlTotalLines(),
				stn.getFileId(), ErrorTypeEnum.ERROR.toString());
		stn.setCtrlTotalLines(fileLines);
		Integer lineCount = commonValidationService.validateIntegerField(stnFileDto.getType(), stnFileDto,
				"Invalid hdr line count: " + stnFileDto.getCtrlTotalQuantity(), stnFileDto.getCtrlTotalQuantity(),
				stn.getFileId(), ErrorTypeEnum.ERROR.toString());
		stn.setCtrlTotalQuantity(lineCount);
		BigDecimal totalWt = commonValidationService.validateBigDecimalField(stnFileDto.getType(), stnFileDto,
				"Invalid hdr total weight: " + stnFileDto.getCtrlTotalWeight(), stnFileDto.getCtrlTotalWeight(),
				stn.getFileId(), ErrorTypeEnum.ERROR.toString());
		stn.setCtrlTotalWeight(totalWt);
		BigDecimal totalValue = commonValidationService.validateBigDecimalField(stnFileDto.getType(), stnFileDto,
				"Invalid hdr total value: " + stnFileDto.getCtrlTotalValue(), stnFileDto.getCtrlTotalValue(),
				stn.getFileId(), ErrorTypeEnum.ERROR.toString());
		stn.setCtrlTotalValue(totalValue);
	}

	private String getDtlTaxDetails(StnFileStageDto stn) {
		if (StringUtils.isEmpty(stn.getDtlIgstPerc())) {
			stn.setDtlIgstPerc("0");
		}
		if (StringUtils.isEmpty(stn.getDtlIgstVal())) {
			stn.setDtlIgstVal("0");
		}
		if (StringUtils.isEmpty(stn.getDtlSgstPerc())) {
			stn.setDtlSgstPerc("0");
		}
		if (StringUtils.isEmpty(stn.getDtlSgstVal())) {
			stn.setDtlSgstVal("0");
		}
		if (StringUtils.isEmpty(stn.getDtlCgstVal())) {
			stn.setDtlCgstVal("0");
		}
		if (StringUtils.isEmpty(stn.getDtlCgstPerc())) {
			stn.setDtlCgstPerc("0");
		}
		if (StringUtils.isEmpty(stn.getDtlUtgstVal())) {
			stn.setDtlUtgstVal("0");
		}
		if (StringUtils.isEmpty(stn.getDtlUtgstPerc())) {
			stn.setDtlUtgstPerc("0");
		}
		Map<String, String> taxDetails = new HashMap<>();
		taxDetails.put("CGSTVal", stn.getDtlCgstVal());
		taxDetails.put("CGSTPct", stn.getDtlCgstPerc());
		taxDetails.put("SGSTVal", stn.getDtlSgstVal());
		taxDetails.put("SGSTPct", stn.getDtlSgstPerc());
		taxDetails.put("IGSTVal", stn.getDtlIgstVal());
		taxDetails.put("IGSTPct", stn.getDtlIgstPerc());
		taxDetails.put("UTGSTVal", stn.getDtlUtgstVal());
		taxDetails.put("UTGSTPct", stn.getDtlUtgstPerc());
		Map<String, Object> stockTransferDetailsTaxDetails = new LinkedHashMap<>();
		stockTransferDetailsTaxDetails.put("type", "TAX_DETAILS");
		stockTransferDetailsTaxDetails.put("data", taxDetails);
		return MapperUtil.getStringFromJson(stockTransferDetailsTaxDetails);
	}

	private String getDtlIssuedWeightDetails(StnFileStageDto stn) {

		if (StringUtils.isEmpty(stn.getDtlSiNetWt())) {
			stn.setDtlSiNetWt(ZERO);
		}
		if (StringUtils.isEmpty(stn.getDtlGoNetWt())) {
			stn.setDtlGoNetWt(ZERO);
		}
		if (StringUtils.isEmpty(stn.getDtlPtNetWt())) {
			stn.setDtlPtNetWt(ZERO);
		}
		if (StringUtils.isEmpty(stn.getDtlStnNetWt())) {
			stn.setDtlStnNetWt(ZERO);
		}
		if (StringUtils.isEmpty(stn.getDtlDiamondWt())) {
			stn.setDtlDiamondWt(ZERO);
		}
		if (StringUtils.isEmpty(stn.getDtlOtherNetWt())) {
			stn.setDtlOtherNetWt(ZERO);
		}

		// calculate wts
		calcuateRequiredWeights(stn);

		Map<String, String> weightDetails = new HashMap<>();
		weightDetails.put("silverWeight",
				commonValidationService.roundWeights(stn.getDtlSiNetWt(), stn.getDtlProductQty()));
		weightDetails.put("goldWeight",
				commonValidationService.roundWeights(stn.getDtlGoNetWt(), stn.getDtlProductQty()));
		weightDetails.put("platinumWeight",
				commonValidationService.roundWeights(stn.getDtlPtNetWt(), stn.getDtlProductQty()));
		weightDetails.put("stoneWeight",
				commonValidationService.roundWeights(stn.getDtlOtherStoneWt(), stn.getDtlProductQty()));
		weightDetails.put("diamondWeight",
				commonValidationService.roundWeights(stn.getDtlDiamondWt(), stn.getDtlProductQty()));
		weightDetails.put("materialWeight",
				commonValidationService.roundWeights(stn.getDtlOtherNetWt(), stn.getDtlProductQty()));

		Map<String, Object> stockTransferDetailsWeightDetails = new LinkedHashMap<>();
		stockTransferDetailsWeightDetails.put("type", "WEIGHT_DETAILS");
		stockTransferDetailsWeightDetails.put("data", weightDetails);
		return MapperUtil.getStringFromJson(stockTransferDetailsWeightDetails);
	}

	private void calcuateRequiredWeights(StnFileStageDto stn) {
		ProductGroupDao productGroup = commonValidationService.getProductGroup(stn.getProductGroup(), true);
		if (productGroup == null) {
			dataAuditService.saveDataAuditData(stn.getType(), MapperUtil.getJsonString(stn),
					"Product group: " + stn.getProductGroup() + " is not present/active.", fileId,
					ErrorTypeEnum.ERROR.toString());
		} else {
			if (productGroup.getPlainStudded().equalsIgnoreCase(PlainStuddedEnum.P.toString())) {
				handlePlainItems(stn, productGroup);
			} else if (productGroup.getPlainStudded().equalsIgnoreCase(PlainStuddedEnum.S.toString())) {
				handleStuddedItems(stn, productGroup);
			}
		}
	}

	private void handlePlainItems(StnFileStageDto stn, ProductGroupDao productGroup) {
		if (productGroup.getPricingType().equalsIgnoreCase(PricingTypeEnum.PJWS.toString())) {
			stn.setDtlOtherStoneWt(new BigDecimal(stn.getDtlOtherStoneWt()).multiply(new BigDecimal(".2")).toString());
			stn.setDtlDiamondWt(new BigDecimal(stn.getDtlDiamondWt()).multiply(new BigDecimal(".2")).toString());
		}
		if (productGroup.getItemType() != null) {
			if (productGroup.getItemType().getItemTypeCode().equalsIgnoreCase(MetalTypeCodeEnum.J.getCode())) {
				stn.setDtlGoNetWt(commonValidationService
						.calculatePlainWt(stn.getDtlProductWt(), stn.getDtlOtherNetWt()).toString());
			} else if (productGroup.getItemType().getItemTypeCode().equalsIgnoreCase(MetalTypeCodeEnum.L.getCode())) {
				stn.setDtlPtNetWt(commonValidationService
						.calculatePlainWt(stn.getDtlProductWt(), stn.getDtlOtherNetWt()).toString());
			} else if (productGroup.getItemType().getItemTypeCode().equalsIgnoreCase(MetalTypeCodeEnum.P.getCode())) {
				stn.setDtlSiNetWt(commonValidationService
						.calculatePlainWt(stn.getDtlProductWt(), stn.getDtlOtherNetWt()).toString());
			}
		}
	}

	private void handleStuddedItems(StnFileStageDto stn, ProductGroupDao productGroup) {
		stn.setDtlOtherStoneWt(new BigDecimal(stn.getDtlOtherStoneWt()).multiply(new BigDecimal(".2")).toString());
		stn.setDtlDiamondWt(new BigDecimal(stn.getDtlDiamondWt()).multiply(new BigDecimal(".2")).toString());
		if (productGroup.getItemType() != null) {
			if (productGroup.getItemType().getItemTypeCode().equalsIgnoreCase(MetalTypeCodeEnum.J.getCode())) {
				stn.setDtlGoNetWt(commonValidationService.calculateStuddedWt(stn.getDtlProductWt(),
						stn.getDtlOtherStoneWt(), stn.getDtlDiamondWt(), stn.getDtlOtherNetWt()).toString());
			} else if (productGroup.getItemType().getItemTypeCode().equalsIgnoreCase(MetalTypeCodeEnum.L.getCode())) {
				stn.setDtlPtNetWt(commonValidationService.calculateStuddedWt(stn.getDtlProductWt(),
						stn.getDtlOtherStoneWt(), stn.getDtlDiamondWt(), stn.getDtlOtherNetWt()).toString());
			} else if (productGroup.getItemType().getItemTypeCode().equalsIgnoreCase(MetalTypeCodeEnum.P.getCode())) {
				stn.setDtlSiNetWt(commonValidationService.calculateStuddedWt(stn.getDtlProductWt(),
						stn.getDtlOtherStoneWt(), stn.getDtlDiamondWt(), stn.getDtlOtherNetWt()).toString());
			}
		}
	}

	@Override
	public void beforeStep(StepExecution stepExecution) {
		fileId = stepExecution.getJobExecution().getExecutionContext().getString("stnFileAuditId");
		stnIbt = stepExecution.getJobParameters().getString("ibt");
	}

	@Override
	public ExitStatus afterStep(StepExecution stepExecution) {
		stepExecution.getJobExecution().getExecutionContext().put("locationCode", locationCode);
		stepExecution.getJobExecution().getExecutionContext().put("productGroup", productGroup);
		//log.info("-----after step----"+stepExecution.getJobExecution().getExecutionContext());
		return ExitStatus.COMPLETED;
	}

}
