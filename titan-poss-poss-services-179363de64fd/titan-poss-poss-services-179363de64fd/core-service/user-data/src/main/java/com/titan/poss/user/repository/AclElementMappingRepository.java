/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.AclElementMappingDao;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository("UserAclElementMappingRepository")
public interface AclElementMappingRepository extends JpaRepository<AclElementMappingDao, String> {

}
