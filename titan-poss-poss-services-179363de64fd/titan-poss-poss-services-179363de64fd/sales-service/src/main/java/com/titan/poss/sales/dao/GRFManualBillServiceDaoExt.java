package com.titan.poss.sales.dao;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.MapsId;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.titan.poss.sales.base.GRFManualBillBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@Entity (name = "SalesGRFMemo")
@Table (name = "grf-memo")
@EqualsAndHashCode (callSuper = false)
public class GRFManualBillServiceDaoExt extends GRFManualBillBaseDao {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@OneToOne(fetch = FetchType.LAZY)
	@MapsId
	@JoinColumn(name = "id", referencedColumnName = "id", columnDefinition = "uniqueidentifier")
	private SalesTxnDaoExt salesTxnDao;

}
