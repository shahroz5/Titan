/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.report.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.report.dao.UserSavedQueriesDao;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository
public interface UserSavedQueriesRepository extends JpaRepository<UserSavedQueriesDao, String> {

}
