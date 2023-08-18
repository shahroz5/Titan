/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.service;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

public interface ReportDecryptService {

	void decryptReport(String sql, String reportId, String authorizationHeader, String authorizationCookie);

	void deleteCustomerTemp(String reportId);
}
