/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.base;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;

import com.titan.poss.core.dao.MasterSyncableEntity;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@MappedSuperclass
@EqualsAndHashCode(callSuper = false)
public class PIFSeriesBaseDao extends MasterSyncableEntity implements Serializable{/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	@Column(name = "bank_name")
	private String bankName;

	@Column(name = "payment_code")
	private String paymentCode;

	@Column(name = "from_no")
	private Integer fromNo;

	@Column(name = "to_no")
	private Integer toNo;

	@Column(name = "current_seq_no")
	private Integer currentSeqNo;

	@Column(name = "location_code")
	private String locationCode;

	@Column(name = "is_home_bank")
	private Boolean isHomeBank;

}
