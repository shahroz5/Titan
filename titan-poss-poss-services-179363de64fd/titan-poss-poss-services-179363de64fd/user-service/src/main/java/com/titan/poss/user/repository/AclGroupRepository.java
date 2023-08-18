/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.user.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.dao.AclGroupDao;
import com.titan.poss.user.dto.response.AclGroupResponse;

/**
 * Handles repository operations for <b>AclGroup</b>
 * 
 * @author Mindtree Ltd.
 * @version 1.0s
 */
@Repository("UserAclGroupRepository")
public interface AclGroupRepository extends JpaRepository<AclGroupDao, String> {

	/**
	 * This will list acl under an acl group provided, and with if role assigned or
	 * not option
	 * 
	 * @param parentAclGroupCode
	 * @param pagebale
	 * @return
	 */
	// @formatter:off
	@Query("SELECT new com.titan.poss.user.dto.response.AclGroupResponse(agm.aclGroupCode, agm.description, agm.isLeaf,agm.parentAclGroup.aclGroupCode)"
			+ " FROM AclGroupDao agm \r\n" 
			+ " WHERE((:roleCode IS null AND :isCorpCanAccess IS null) AND ((:parentAclGroupCode IS null AND agm.parentAclGroup.aclGroupCode = NULL)"
			+ " OR (:parentAclGroupCode IS NOT null AND agm.parentAclGroup.aclGroupCode = :parentAclGroupCode)) OR ((:roleCode IS NOT null AND :isCorpCanAccess IS NOT null) AND (:isCorpCanAccess = agm.isCorpCanAccess OR agm.isCorpCanAccess IS null) AND ((:parentAclGroupCode IS null AND agm.parentAclGroup.aclGroupCode = NULL) OR (:parentAclGroupCode IS NOT null AND agm.parentAclGroup.aclGroupCode = :parentAclGroupCode ))))")
	// @formatter:on
	Page<AclGroupResponse> listByAclGroup(@Param("parentAclGroupCode") String parentAclGroupCode,
			@Param("roleCode") String roleCode, @Param("isCorpCanAccess") Boolean isCorpCanAccess, Pageable pagebale);

}
