/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.sales.dao;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.PrePersist;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.titan.poss.core.dao.AuditableEntity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */


@Data
@Entity(name ="CustomerOrderTempDao")
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "customer_order_temp")
@EqualsAndHashCode(callSuper = false)
public class CustomerOrderTempDao extends AuditableEntity implements Serializable {

	private static final long serialVersionUID = 1L;

	@Id
	@Column(name = "com_order_number")
	private String comOrderNumber;
	
	@Column(name = "mobile_number" , columnDefinition = "NVARCHAR" )
    private String mobileNumber;
	
	@Column(name = "customer_name" )
	private String customerName;
	
	@Column(name = "item_code" )
	private String itemCode;
	
	@Column(name = "gross_weight", columnDefinition = "decimal")
	private BigDecimal grossWeight;
	
	@Column(name = "quantity")
	private Short quantity;
	
	@Column(name = "status" )
	private String status;
	
	@Column(name = "com_order_date_time")
	@Temporal(TemporalType.TIMESTAMP)
	private Date comOrderDateTime;
	
	@Column(name = "autostn" )
	private String autostn;
	
	@Column(name = "request_type")
	private String requestType;
	
	@Column(name = "request_btq" )
	private String requestBtq;
	
	@Column(name = "request_by" )
	private String requestBy;
	
	@Column(name = "delivery_date_time")
	@Temporal(TemporalType.TIMESTAMP)
	private Date deliveryDateTime;
	
	@Column(name = "order_value", columnDefinition = "decimal")
	private BigDecimal orderValue;
	
	@Column(name = "co_status" )
	private String coStatus;
	
	@Column(name = "lot_number" )
	private String lotNumber;
	
	@Column(name = "rso_name" )
	private String rsoName;
	
	@Column(name = "is_occassion" )
	private Boolean isOccassion;
	
	@Column(name = "special_occasion" )
	private String specialOccasion;
	
	@Column(name = "date_of_occasion" )
	@Temporal(TemporalType.TIMESTAMP)
	private Date dateOfOccasion;
	
	@Column(name = "eceleste_flag" )
	private Boolean ecelesteFlag;
	
	@Column(name = "sub_type" )
	private String subType;
	
	@Column(name = "cfa_code" )
	private String cfaCode;
	
	@Column(name = "is_dummy_code" )
	private Boolean isDummyCode;

	@Column(name = "is_sizing" )
	private Boolean isSizing;

	@Column(name = "gold_rate" )
	private BigDecimal goldRate;
	
	@Column(name = "gold_charges" )
	private BigDecimal goldCharges;
	
	@Column(name = "making_charges" )
	private BigDecimal makingCharges;
	
	@Column(name = "stone_charges" )
	private BigDecimal stoneCharges;
	
	@Column(name = "wt_per_unit" )
	private BigDecimal wtPerUnit;
	
	@Column(name = "stone_wt" )
	private BigDecimal stoneWt;

	@Column(name = "net_weight" )
	private BigDecimal netWeight;

	@Column(name = "is_item_code_available" )
	private Boolean isItemCodeAvailable;
	
	@PrePersist
	private void onPrePersist() {
		if (this.getIsOccassion() == null) {
			this.setIsOccassion(false);
		}
		if (this.getIsSizing() == null) {
			this.setIsSizing(false);
		}
		if (this.getIsDummyCode() == null) {
			this.setIsDummyCode(false);
		}
		if (this.getIsItemCodeAvailable() == null) {
			this.setIsItemCodeAvailable(false);
		}
		if (this.getEcelesteFlag() == null) {
			this.setEcelesteFlag(false);
		}
	}
	
	}
