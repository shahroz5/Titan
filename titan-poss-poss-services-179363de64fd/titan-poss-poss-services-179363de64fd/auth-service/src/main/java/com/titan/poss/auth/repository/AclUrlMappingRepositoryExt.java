/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.auth.repository;

import java.util.Collection;
import java.util.List;

import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.AclUrlMappingDao;
import com.titan.poss.user.repository.AclUrlMappingRepository;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository("AuthAclUrlMappingRepository")
public interface AclUrlMappingRepositoryExt extends AclUrlMappingRepository {

	List<AclUrlMappingDao> findByUrlIn(Collection<String> urls);

}
