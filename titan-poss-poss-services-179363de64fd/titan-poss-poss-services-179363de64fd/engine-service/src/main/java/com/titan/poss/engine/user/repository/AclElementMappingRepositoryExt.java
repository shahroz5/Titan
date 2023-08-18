/*  Copyright 2019. Titan Company Limited
*  All rights reserved.
*/
package com.titan.poss.engine.user.repository;

import java.util.List;

import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.AclElementMappingDao;
import com.titan.poss.user.repository.AclElementMappingRepository;

/**
 * @author Mindtree Ltd.
 * @version 2.0
 */
@Repository("EngineAclElementMappingRepository")
public interface AclElementMappingRepositoryExt extends AclElementMappingRepository {

	List<AclElementMappingDao> findByUrl(String url);

}
