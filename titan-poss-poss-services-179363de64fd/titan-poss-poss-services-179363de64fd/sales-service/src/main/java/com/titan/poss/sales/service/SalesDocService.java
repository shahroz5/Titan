/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.service;

import com.titan.poss.sales.constants.SalesDocTypeEnum;
import com.titan.poss.sales.dao.SalesDocDaoExt;

/**
 * Service interface for Sales Cod
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
public interface SalesDocService {

	/**
	 * Returns doc no specific to a store, year and docType
	 * 
	 * @param docType
	 * @param fiscalYear
	 * @return Integer
	 */
	Integer getDocNumber(SalesDocTypeEnum docType, Short fiscalYear);

	/**
	 * return doc no (last one) for multiple doc no required for same doctype
	 * 
	 * @param docType
	 * @param fiscalYear
	 * @param count
	 * @return Integer
	 */
	Integer getDocNumber(SalesDocTypeEnum docType, Short fiscalYear, int count);

	/**
	 * return doc no (last one) for multiple doc no required for same doctype
	 * 
	 * @param docType
	 * @param fiscalYear
	 * @param count
	 * @param locationCode
	 * @return SalesDocDaoExt
	 */
	SalesDocDaoExt getDocNumber(SalesDocTypeEnum docType, Short fiscalYear, int count, String locationCode);
	
	/**
	 * return doc no (last one) for multiple doc no required for same doctype
	 * 
	 * @param docType
	 * @param fiscalYear
	 * @param locationCode
	 * @return Integer
	 */
	Integer getDocNumber(SalesDocTypeEnum docType, Short fiscalYear, String locationCode);

}
