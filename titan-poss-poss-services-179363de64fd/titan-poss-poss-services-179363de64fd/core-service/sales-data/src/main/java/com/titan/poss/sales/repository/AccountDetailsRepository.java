/* Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.sales.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.sales.dao.AccountDetailsDao;
/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("salesAccountDetailsRepository")
public interface AccountDetailsRepository extends JpaRepository<AccountDetailsDao, String>{

}
