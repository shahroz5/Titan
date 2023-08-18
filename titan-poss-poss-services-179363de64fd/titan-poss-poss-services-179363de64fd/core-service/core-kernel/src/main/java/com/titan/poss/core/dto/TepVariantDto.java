package com.titan.poss.core.dto;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class TepVariantDto {

	@JsonProperty("DocNo")
	private Integer docNo;
	
	@JsonProperty("FiscalYear")
	private Short fiscalYear;
	
	@JsonProperty("LocationCode")
	private String locationCode;
	
	@JsonProperty("VariantLineItemNo")
	private Integer rowId;
	
	@JsonProperty("RefCMNo")
	private Integer refCMNo;
	
	@JsonProperty("RefCMFiscalYear")
	private Short refCMFiscalYear;
	
	@JsonProperty("Status")
	private Boolean status;
	
	@JsonProperty("PaidValue")
	private BigDecimal paidValue;
	
	@JsonProperty("ItemWeight")
	private BigDecimal itemWeight;
	
	@JsonProperty("ItemCode")
	private String itemCode;
	
	@JsonProperty("GoldPrice")
	private BigDecimal goldPrice;
	
	@JsonProperty("NoOfStonesReturned")
	private Integer noOfStonesReturned;
	
	@JsonProperty("ActualValue")
	private BigDecimal actualValue;
	
	@JsonProperty("TotalQuantity")
	private Integer totalQuantity;
	
	@JsonProperty("ItemsSentToFactory")
	private Integer itemsSentToFactory;
	
	@JsonProperty("ItemsSoldOut")
	private Integer itemsSoldOut;
	
	@JsonProperty("TotalStoneWeight")
	private BigDecimal totalStoneWeight;
	
	@JsonProperty("PricePerUnit")
	private BigDecimal pricePerUnit;
	
	@JsonProperty("BinCode")
	private String binCode;
	
	@JsonProperty("PlainItemValue")
	private BigDecimal plainItemValue;
	
	@JsonProperty("Karatage")
	private BigDecimal karatage;
	
	@JsonProperty("Tax1")
	private BigDecimal tax1;
	
	@JsonProperty("Tax2")
	private BigDecimal tax2;
	
	@JsonProperty("TaxType1")
	private String taxType1;
	
	@JsonProperty("TaxType2")
	private String taxType2;
	
	@JsonProperty("FullValueTEP")
	private Boolean fullValueTEP;
	
	@JsonProperty("LotNumber")
	private String lotNumber;
	
	@JsonProperty("DiscountRecovered")
	private BigDecimal discountRecovered;
	
	@JsonProperty("StoneValue")
	private BigDecimal stoneValue;
	
	@JsonProperty("GoldValue")
	private BigDecimal goldValue;
	
	@JsonProperty("IsCMAvailable")
	private Boolean isCMAvailable;
	
	@JsonProperty("RefCMLocationCode")
	private String refCMLocationCode;
	
	@JsonProperty("RefLotNumber")
	private String refLotNumber;
	
	@JsonProperty("IsException")
	private Boolean isException;
	
	@JsonProperty("IsStone")
	private Boolean isStone;
	
	@JsonProperty("IsLeastBOMUsed")
	private Boolean isLeastBOMUsed;
	
	@JsonProperty("IsGeneralTEP")
	private Boolean isGeneralTEP;
	
	@JsonProperty("TEPValueOnRefund")
	private BigDecimal tEPValueOnRefund;
	
	@JsonProperty("StdGrossWeight")
	private BigDecimal stdGrossWeight;
	
	@JsonProperty("StdStoneWeight")
	private BigDecimal stdStoneWeight;
	
	@JsonProperty("TotalCFALevelDeduction")
	private BigDecimal totalCFALevelDeduction;
	
	@JsonProperty("MakingCharges")
	private BigDecimal makingCharges;
	
	@JsonProperty("WastageCharge")
	private BigDecimal wastageCharge;
	
	@JsonProperty("TotalTax")
	private BigDecimal totalTax;
	
	@JsonProperty("IsCMValueUsedForFVT")
	private Boolean isCMValueUsedForFVT;
	
	@JsonProperty("ActualDiscount")
	private BigDecimal actualDiscount;
	
	@JsonProperty("DiscountHeader")
	private String discountHeader;
	
	@JsonProperty("ActualGoldValue")
	private BigDecimal actualGoldValue;
	
	@JsonProperty("RefundDeductionAmount")
	private BigDecimal refundDeductionAmount;
	
	@JsonProperty("ActualStoneValue")
	private BigDecimal actualStoneValue;
	
	@JsonProperty("IsStoneChargeApplicable")
	private Boolean isStoneChargeApplicable;
	
	@JsonProperty("SilverPrice")
	private BigDecimal silverPrice;
	
	@JsonProperty("PlatinumPrice")
	private BigDecimal platinumPrice;
	
	@JsonProperty("SilverValue")
	private BigDecimal silverValue;
	
	@JsonProperty("PlatinumValue")
	private BigDecimal platinumValue;
	
	@JsonProperty("ActualSilverValue")
	private BigDecimal actualSilverValue;
	
	@JsonProperty("ActualPlatinumValue")
	private BigDecimal actualPlatinumValue;
	
	@JsonProperty("CustomerTax1")
	private BigDecimal customerTax1;
	
	@JsonProperty("CustomerTax2")
	private BigDecimal customerTax2;
	
	@JsonProperty("CustomerTotalTax")
	private BigDecimal customerTotalTax;
	
	@JsonProperty("OtherMaterialWeight")
	private BigDecimal otherMaterialWeight;

}
