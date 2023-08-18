/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.titan.poss.core.dto.ItemStoneMappingDto;
import com.titan.poss.core.dto.LotNumberDetailsDto;
import com.titan.poss.core.dto.LotNumberMasterDto;
import com.titan.poss.core.dto.MultiMetalDetailsDto;
import com.titan.poss.sales.dao.CashMemoDao;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dao.CustomerTxnDao;
import com.titan.poss.sales.dao.DiscountConfigDetailsDao;
import com.titan.poss.sales.dao.DiscountDetailsDao;
import com.titan.poss.sales.dao.DiscountItemDetailsDao;
import com.titan.poss.sales.dao.FocSchemesDao;
import com.titan.poss.sales.dao.PaymentDetailsDao;
import com.titan.poss.sales.dao.PaymentItemMappingDao;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CashMemoEntity {

	private CashMemoDao cashMemo;
	private List<CashMemoDetailsDao> cashMemoDetails;
	private CustomerTxnDao customerTxn;
	private List<PaymentDetailsDao> paymentDetails;

	private List<PaymentItemMappingDao> paymentItemMappingDaoDetails;
	private List<FocDetailsDtoEntity> focDetails;

	private List<FocSchemesDao> focSchemes;
	private List<DiscountConfigDetailsDao> discountConfigDetails;
	private List<DiscountDetailsDao> discountDetails;
	private List<DiscountItemDetailsDao> discountItemDetails;
	// to keep relation between discount details
	private Map<String, String> discountDetailAndConfigMap;
	private Map<String, String> discountItemAndDetailsMap;
	private List<LotNumberDetailsDto> lotNumberDetailsList;
	private List<MultiMetalDetailsDto> multiMetalDetailsList; 
	private List<LotNumberMasterDto> lotNumberMasterList; 
	private List<ItemStoneMappingDto> itemStoneMappingList;
	private Map<String,String> discountItemMap;
	private Map<String,BigDecimal> paymentDetailsMap;
	private Map<String,String> discountDetailsAndTypeMap;
	private BigDecimal tcsPercentage;
	private BigDecimal tcsApplicableAmount;
    
}
