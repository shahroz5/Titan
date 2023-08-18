/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.titan.poss.core.dao.SyncableEntity;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.sales.dao.OrderDao;
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
public class OrderDetailsSyncDto extends SyncableEntity {

	private Integer rowId;

	private String itemCode;

	private String lotNumber;

	private String binCode;

	private String inventoryId;

	private Short totalQuantity;

	private BigDecimal inventoryWeight;

	private BigDecimal totalWeight;

	private BigDecimal unitValue;

	private BigDecimal totalValue;

	private BigDecimal totalDiscount;

	private BigDecimal totalTax;

	private BigDecimal finalValue;

	private String status;

	private String remarks;

	private String productGroupCode;

	private String productCategoryCode;

	private String employeeCode;

	private String taxDetails;

	private String priceDetails;

	private String discountDetails;

	private String inventoryWeightDetails;

	private BigDecimal minValue;

	private Short deliveredQuantity;

	private BigDecimal deliveredWeight;

	private String id;

	private String order;

	private Boolean itemInStock;

	private String itemDetails;

	private BigDecimal hallmarkCharges;

	private BigDecimal hallmarkDiscount;

	private Boolean isItemToBeReleased;

	private String binGroupCode;
	
	private String comOrderNumber;
	
	private Boolean isAutoStn;
	
	private Date deliveryDate;
	
	private BigDecimal orderValue;
	
	private String requestType;
	
	private String pricingType;

	public OrderDetailsDao getOrderDetailsDao(OrderDetailsSyncDto syncDto) {
		OrderDetailsDao dao = (OrderDetailsDao) MapperUtil.getObjectMapping(syncDto, new OrderDetailsDao());
		OrderDao oder = new OrderDao();
		oder.setId(syncDto.getOrder());
		dao.setOrder(oder);
		return dao;
	}

	public List<OrderDetailsDao> getOrderDetailsDaoList(List<OrderDetailsSyncDto> syncDtoList) {
		List<OrderDetailsDao> daoList = new ArrayList<>();
		syncDtoList.forEach(syncDto -> daoList.add(getOrderDetailsDao(syncDto)));
		return daoList;
	}
}
