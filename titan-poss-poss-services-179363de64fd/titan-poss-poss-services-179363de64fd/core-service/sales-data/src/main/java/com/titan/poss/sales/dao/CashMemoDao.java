
package com.titan.poss.sales.dao;

import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.titan.poss.sales.base.CashMemoBaseDao;

import lombok.Data;
import lombok.EqualsAndHashCode;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Data
@Entity(name = "CashMemo")
@Table(name = "cash_memo")
@EqualsAndHashCode(callSuper = false)
public class CashMemoDao extends CashMemoBaseDao{
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	@OneToOne(fetch = FetchType.LAZY)
	//@MapsId
	@JoinColumn(name = "id", referencedColumnName = "id", columnDefinition = "uniqueidentifier")
	private SalesTxnDao salesTxnDao;

}
