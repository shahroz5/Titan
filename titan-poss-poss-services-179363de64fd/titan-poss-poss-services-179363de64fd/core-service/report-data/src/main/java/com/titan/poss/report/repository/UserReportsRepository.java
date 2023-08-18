/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.report.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.report.dao.UserReportsDao;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository
public interface UserReportsRepository extends JpaRepository<UserReportsDao, Long> {

}
