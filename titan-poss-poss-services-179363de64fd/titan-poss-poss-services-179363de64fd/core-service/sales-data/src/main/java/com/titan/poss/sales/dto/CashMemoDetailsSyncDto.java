/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.CashMemoDao;
import com.titan.poss.sales.dao.CashMemoDetailsDao;
import com.titan.poss.sales.dao.OrderDetailsDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@EqualsAndHashCode(callSuper = false)
public class CashMemoDetailsSyncDto extends SyncableEntity {

	private String itemCode;

	private String lotNumber;

	private String binCode;

	private Integer rowId;

	private Short totalQuantity;

	private BigDecimal totalWeight;

	private BigDecimal unitValue;

	private BigDecimal totalValue;

	private BigDecimal totalTax;

	private String taxDetails;

	private String inventoryWeightDetails;

	private String remarks;

	private String priceDetails;

	private String discountDetails;

	private BigDecimal inventoryWeight;

	private BigDecimal totalDiscount;

	private BigDecimal finalValue;

	private String inventoryId;

	private String measuredWeightDetails;

	private String employeeCode;

	private String productGroupCode;

	private String productCategoryCode;

	private String reason;

	private BigDecimal inventoryStdValue;

	private BigDecimal inventoryStdWeight;

	private Boolean itemInStock;

	private String id;

	private String cashMemoDao;

	private String orderItem;

	private String itemDetails;

	private BigDecimal hallmarkCharges;

	private BigDecimal hallmarkDiscount;

	private String binGroupCode;
	
	private Short noOfItemsReturned;
	
	private Boolean legacyTepDiscountRecovered;
	
	private String legacyCmDetails;

	private String pricingType;
	
	public CashMemoDetailsDao getCashMemoDetailsDao(CashMemoDetailsSyncDto syncDto) {
		CashMemoDetailsDao dao = (CashMemoDetailsDao) MapperUtil.getObjectMapping(syncDto, new CashMemoDetailsDao());
		CashMemoDao csDao = new CashMemoDao();

		OrderDetailsDao orderItemDao = null;
		if (syncDto.getOrderItem() != null) {
			orderItemDao = new OrderDetailsDao();
			orderItemDao.setId(syncDto.getOrderItem());
		}

		csDao.setId(syncDto.getCashMemoDao());
		dao.setCashMemoDao(csDao);
		dao.setOrderItem(orderItemDao);
		return dao;
	}

	public List<CashMemoDetailsDao> getCashMemoDetailsDaoList(List<CashMemoDetailsSyncDto> synList) {
		List<CashMemoDetailsDao> daoList = new ArrayList<>();
		synList.forEach(sync -> daoList.add(getCashMemoDetailsDao(sync)));
		return daoList;
	}
}
