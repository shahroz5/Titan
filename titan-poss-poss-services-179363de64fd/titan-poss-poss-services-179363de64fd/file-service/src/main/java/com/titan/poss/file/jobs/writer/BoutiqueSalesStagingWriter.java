/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.file.jobs.writer;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Map.Entry;

import javax.sql.DataSource;

import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.titan.poss.core.domain.constant.FileIntegrationConstants;
import com.titan.poss.core.dto.TaxCalculationResponseDto;
import com.titan.poss.core.dto.TaxDetailDto;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.file.dto.BoutiqueSalesDto;

import lombok.extern.slf4j.Slf4j;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Component
@Slf4j
public class BoutiqueSalesStagingWriter implements ItemWriter<BoutiqueSalesDto> {

	@Autowired
	private DataSource dataSource;

	@Autowired
	private BoutiqueSalesJobWriter boutiqueSalesJobWriter;

	@SuppressWarnings("unchecked")
	@Override
	public void write(List<? extends BoutiqueSalesDto> items) throws Exception {

		List<BoutiqueSalesDto> boutiqueSalesHdrList = removeDuplicateHdr((List<BoutiqueSalesDto>) items);
		List<BoutiqueSalesDto> boutiqueSalesDetList = (List<BoutiqueSalesDto>) items;
		List<BoutiqueSalesDto> boutiqueSalesTaxList = new ArrayList<>();
		List<BoutiqueSalesDto> boutiqueSalesInvoiceList = getUniqueInvoices((List<BoutiqueSalesDto>) items);

		for (BoutiqueSalesDto boutiqueSalesDto : items) {
			extractTaxDetailsFromJson(boutiqueSalesDto, boutiqueSalesTaxList, boutiqueSalesHdrList);
		}
		
		for (BoutiqueSalesDto btqInvoice : boutiqueSalesInvoiceList ) {
		if(btqInvoice.getTaxOtherCharges() != null && btqInvoice.getTaxOtherCharges().compareTo(BigDecimal.ZERO)   !=0) {
			BoutiqueSalesDto newBoutiqueSalesDto = new BoutiqueSalesDto();
			newBoutiqueSalesDto.setRecType(btqInvoice.getRecType());
			newBoutiqueSalesDto.setTaxSysDocumentRef(btqInvoice.getTaxSysDocumentRef());
			newBoutiqueSalesDto.setTaxLineNo(btqInvoice.getTaxLineNo());
			newBoutiqueSalesDto.setTaxInventoryItem(btqInvoice.getTaxInventoryItem());
			newBoutiqueSalesDto.setTaxName("S_OI_IFACE");
			newBoutiqueSalesDto.setTaxAmount(btqInvoice.getTaxOtherCharges());
			newBoutiqueSalesDto.setTaxLotNumber(btqInvoice.getTaxLotNumber());
			newBoutiqueSalesDto.setLineNo(btqInvoice.getLineNo());
			newBoutiqueSalesDto.setTaxRecordId(btqInvoice.getTaxRecordId());
			newBoutiqueSalesDto.setTaxLocationId(btqInvoice.getTaxLocationId());
			newBoutiqueSalesDto.setTaxBusinessDate(btqInvoice.getTaxBusinessDate());
			newBoutiqueSalesDto.setTaxFileName(btqInvoice.getTaxFileName());
			boutiqueSalesTaxList.add(newBoutiqueSalesDto);
			}
		}

		if (!boutiqueSalesHdrList.isEmpty()) {
			boutiqueSalesJobWriter.boutiqueSalesHdrStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
					FileIntegrationConstants.WILL_BE_INJECTED, dataSource).write(boutiqueSalesHdrList);
		}

		if (!boutiqueSalesDetList.isEmpty()) {
			boutiqueSalesJobWriter.boutiqueSalesDetStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
					FileIntegrationConstants.WILL_BE_INJECTED, dataSource).write(boutiqueSalesDetList);
		}

		if (!boutiqueSalesTaxList.isEmpty()) {
			boutiqueSalesJobWriter.boutiqueSalesTaxStagingWriter(FileIntegrationConstants.WILL_BE_INJECTED,
					FileIntegrationConstants.WILL_BE_INJECTED, dataSource).write(boutiqueSalesTaxList);
		}
	}

	private List<BoutiqueSalesDto> removeDuplicateHdr(List<BoutiqueSalesDto> items) {

		Set<String> uniqueHdrSet = new HashSet<>();
		List<BoutiqueSalesDto> uniqueHdrList = new ArrayList<>();
		for (BoutiqueSalesDto item : items) {
			if (uniqueHdrSet.add(item.getHdrSysDocumentRef())) {
				uniqueHdrList.add(item);
			}
		}
		return uniqueHdrList;
	}
	
	private List<BoutiqueSalesDto> getUniqueInvoices(List<BoutiqueSalesDto> items) {

		Set<Integer> uniqueInvoiceSet = new HashSet<>();
		List<BoutiqueSalesDto> uniqueInvoiceList = new ArrayList<>();
		for (BoutiqueSalesDto item : items) {
			if (uniqueInvoiceSet.add(item.getDetDocNo())) {
				uniqueInvoiceList.add(item);
			}
		}
		return uniqueInvoiceList;
	}

	/**
	 * @param boutiqueSalesDto
	 * @param boutiqueSalesTaxList
	 */
	private void extractTaxDetailsFromJson(BoutiqueSalesDto boutiqueSalesDto,
			List<BoutiqueSalesDto> boutiqueSalesTaxList, List<BoutiqueSalesDto> boutiqueSalesHdrList) {
		TaxCalculationResponseDto taxCalculationDto = MapperUtil.getObjectMapperInstance().convertValue(
				MapperUtil.getJsonFromString(boutiqueSalesDto.getTaxName()), TaxCalculationResponseDto.class);
		if (taxCalculationDto != null && (taxCalculationDto.getTaxClass() != null || boutiqueSalesDto.getDetIsLegacyCm())) {	
			for (Entry<String, TaxDetailDto> taxDetail : taxCalculationDto.getData().entrySet()) {
				BoutiqueSalesDto newBoutiqueSalesDto = new BoutiqueSalesDto();
				//omitting rows containing tax value zero
				if(taxDetail.getValue().getTaxValue().compareTo(BigDecimal.ZERO)!=0) {
				newBoutiqueSalesDto.setRecType(boutiqueSalesDto.getRecType());
				newBoutiqueSalesDto.setTaxSysDocumentRef(boutiqueSalesDto.getTaxSysDocumentRef());
				newBoutiqueSalesDto.setTaxLineNo(boutiqueSalesDto.getTaxLineNo());
				newBoutiqueSalesDto.setTaxInventoryItem(boutiqueSalesDto.getTaxInventoryItem());
				newBoutiqueSalesDto.setTaxName(getTaxName(taxDetail.getValue().getTaxCode()));
				BigDecimal taxAmount = taxDetail.getValue().getTaxValue().setScale(3, RoundingMode.HALF_UP);
				BigDecimal originalQuantity = boutiqueSalesDto.getDetOriginalQty();
				BigDecimal totalQty = boutiqueSalesDto.getDetTotalQty();
				if(boutiqueSalesDto.getDetIsCoin() != null && boutiqueSalesDto.getDetTxnType()!= null && boutiqueSalesDto.getDetIsCoin().equalsIgnoreCase("YES") && !boutiqueSalesDto.getDetTxnType().equalsIgnoreCase("GRN") )
				{
					taxAmount = (taxAmount.divide(originalQuantity ,3, RoundingMode.HALF_UP)).multiply(totalQty);
				}
				newBoutiqueSalesDto.setTaxAmount(taxAmount);
				newBoutiqueSalesDto.setTaxLotNumber(boutiqueSalesDto.getTaxLotNumber());
				newBoutiqueSalesDto.setLineNo(boutiqueSalesDto.getLineNo());
				newBoutiqueSalesDto.setTaxRecordId(boutiqueSalesDto.getTaxRecordId());
				newBoutiqueSalesDto.setTaxLocationId(boutiqueSalesDto.getTaxLocationId());
				newBoutiqueSalesDto.setTaxBusinessDate(boutiqueSalesDto.getTaxBusinessDate());
				newBoutiqueSalesDto.setTaxFileName(boutiqueSalesDto.getTaxFileName());
				boutiqueSalesTaxList.add(newBoutiqueSalesDto);
				}
			}
			if(boutiqueSalesDto.getTaxDiscountDetails().compareTo(BigDecimal.ZERO)!=0) {
				
					BigDecimal totalTax = boutiqueSalesDto.getTaxDiscountDetails();
					BigDecimal sum = boutiqueSalesDto.getTaxGhsDiscount(); //.add(boutiqueSalesDto.getTaxEncircleDiscount());
					sum=sum.add(boutiqueSalesDto.getTaxDigiGoldDiscount());
					totalTax = totalTax.subtract(sum);
					if(totalTax.compareTo(BigDecimal.ZERO)!=0)
					{
						BoutiqueSalesDto newBoutiqueSalesDto = new BoutiqueSalesDto();
						newBoutiqueSalesDto = addDiscount("S_TD_IFACE",totalTax,boutiqueSalesDto);
						boutiqueSalesTaxList.add(newBoutiqueSalesDto);
					}
					if(boutiqueSalesDto.getTaxGhsDiscount().compareTo(BigDecimal.ZERO)!=0)
					{
						BoutiqueSalesDto newBoutiqueSalesDto = new BoutiqueSalesDto();
						newBoutiqueSalesDto = addDiscount("S_GHSD_IFACE",boutiqueSalesDto.getTaxGhsDiscount(),boutiqueSalesDto);
						boutiqueSalesTaxList.add(newBoutiqueSalesDto);
					}
//					if(boutiqueSalesDto.getTaxEncircleDiscount().compareTo(BigDecimal.ZERO)!=0) //Removed based on Kathirs input
//					{
//						BoutiqueSalesDto newBoutiqueSalesDto = new BoutiqueSalesDto();
//						newBoutiqueSalesDto = addDiscount("S_ULP_IFACE",boutiqueSalesDto.getTaxEncircleDiscount(),boutiqueSalesDto);
//						boutiqueSalesTaxList.add(newBoutiqueSalesDto);
//					}
					if(boutiqueSalesDto.getTaxDigiGoldDiscount().compareTo(BigDecimal.ZERO)!=0)
					{
						BoutiqueSalesDto newBoutiqueSalesDto = new BoutiqueSalesDto();
						newBoutiqueSalesDto = addDiscount("S_DG_IFACE",boutiqueSalesDto.getTaxDigiGoldDiscount(),boutiqueSalesDto);
						boutiqueSalesTaxList.add(newBoutiqueSalesDto);
					}
				
			}
			
		}
	}

	private BoutiqueSalesDto addDiscount(String discountName, BigDecimal discountValue, BoutiqueSalesDto boutiqueSalesDto) {
		BoutiqueSalesDto newBoutiqueSalesDto = new BoutiqueSalesDto();
		BigDecimal mul = new BigDecimal("-1");
		newBoutiqueSalesDto.setRecType(boutiqueSalesDto.getRecType());
		newBoutiqueSalesDto.setTaxSysDocumentRef(boutiqueSalesDto.getTaxSysDocumentRef());
		newBoutiqueSalesDto.setTaxLineNo(boutiqueSalesDto.getTaxLineNo());
		newBoutiqueSalesDto.setTaxInventoryItem(boutiqueSalesDto.getTaxInventoryItem());
		newBoutiqueSalesDto.setTaxName(discountName);
		newBoutiqueSalesDto.setTaxAmount(mul.multiply(discountValue));
		newBoutiqueSalesDto.setTaxLotNumber(boutiqueSalesDto.getTaxLotNumber());
		newBoutiqueSalesDto.setLineNo(boutiqueSalesDto.getLineNo());
		newBoutiqueSalesDto.setTaxRecordId(boutiqueSalesDto.getTaxRecordId());
		newBoutiqueSalesDto.setTaxLocationId(boutiqueSalesDto.getTaxLocationId());
		newBoutiqueSalesDto.setTaxBusinessDate(boutiqueSalesDto.getTaxBusinessDate());
		newBoutiqueSalesDto.setTaxFileName(boutiqueSalesDto.getTaxFileName());
		return newBoutiqueSalesDto;
		
	}

	private String getTaxName(String taxCode) {
		switch(taxCode.toUpperCase()){    
		 case "SGST":    
			 return "S_SGST_IFACE";   
		 case "CGST":
			 return "S_CGST_IFACE";
		 case "IGST":    
			 return "S_IGST_IFACE";   
		 case "UTGST":    
			  return "S_UTGST_IFACE";
		 case "HMGST":    
			  return "S_HMGST_IFACE";
		   
		     
		 default:     
		    return "S_IFACE";//doubt  
		 }  
	}
}
