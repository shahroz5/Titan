/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.UserDocDao;

/**
 * Handles repository operations for <b>UserOtp</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("UserDocRepository")
public interface UserDocRepository extends JpaRepository<UserDocDao, Integer> {

	UserDocDao findOneByLocationCodeAndFiscalYearAndDocType(String locationCode, Short fiscalYear, String docType);

	UserDocDao findByLocationCodeAndDocType(String locationCode, String docType);

}
