/*  
 * Copyright 2019. Titan Company Limited
 */
package com.titan.poss.user.service.impl;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.titan.poss.core.response.ListResponse;
import com.titan.poss.user.dao.RoleDao;
import com.titan.poss.user.dto.response.AclDto;
import com.titan.poss.user.dto.response.AclGroupResponse;
import com.titan.poss.user.repository.AclGroupRepository;
import com.titan.poss.user.repository.AclRepository;
import com.titan.poss.user.service.AclService;
import com.titan.poss.user.service.RoleService;

/**
 * service impl layer of ACL controller
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Service("UserAclService")
public class AclServiceImpl implements AclService {

	@Autowired
	AclGroupRepository aclGroupRepo;

	@Autowired
	AclRepository aclRepo;

	@Autowired
	RoleService rolService;

	@PersistenceContext
	private EntityManager em;

	@Override
	public ListResponse<AclGroupResponse> listAclGroup(String parentAclGroupCode, String roleCode, Pageable pageable) {
		RoleDao role = null;
		if (StringUtils.isNotBlank(roleCode)) {
			role = rolService.getRoleDetailsWithErrorCheck(roleCode);
		}
		String aclGrpListQuery = null;
		parentAclGroupCode = (parentAclGroupCode == null) ? null : "'" + parentAclGroupCode + "'";
		// @formatter:off
			aclGrpListQuery = "SELECT new com.titan.poss.user.dto.response.AclGroupResponse(agm.aclGroupCode, agm.description, agm.isLeaf,agm.parentAclGroup.aclGroupCode)"
							+ " FROM AclGroupDao agm "
							+ " WHERE agm.parentAclGroup.aclGroupCode = " + parentAclGroupCode; 
					// @formatter:on
		aclGrpListQuery = generateQueryForAccessType(role, aclGrpListQuery, "accessType", null);
		List<AclGroupResponse> q = em.createQuery(aclGrpListQuery, AclGroupResponse.class).getResultList();
		return new ListResponse<>(q);
	}

	@Override
	public ListResponse<AclDto> listAclBasedOnAclGroupAndRoleCode(String aclGroupCode, String roleCode,
			Pageable pageable) {
		RoleDao role = null;
		if (StringUtils.isNotBlank(roleCode)) {
			role = rolService.getRoleDetailsWithErrorCheck(roleCode);
		}
		roleCode = (roleCode == null) ? null : "'" + roleCode + "'";
		// @formatter:off
		String aclQuery = "SELECT new com.titan.poss.user.dto.response.AclDto(am.aclCode, am.description, am.aclGroup, "
				+ " CASE WHEN " + roleCode + " IS NULL "
				+ " 		THEN NULL "
				+ "			ELSE "
				+ "				CASE WHEN ram.role.roleCode IS NOT NULL "
				+ "					THEN true "
				+ "					ELSE false "
				+ "				END "
				+ " END as isAssigned) \r\n" 
				+ " FROM UserAcl am \r\n"
				+ " LEFT JOIN UserRoleAclMapping ram\r\n"
				+ " 	ON am = ram.acl AND ram.role.roleCode = " + roleCode + " \r\n"
				+ " WHERE am.isActive = 1 AND am.aclGroup = '" + aclGroupCode + "'";
				// @formatter:on

		aclQuery = generateQueryForAccessType(role, aclQuery, "accessType", "am");
		List<AclDto> q = em.createQuery(aclQuery, AclDto.class).getResultList();
		return new ListResponse<>(q);

	}

	private String generateQueryForAccessType(RoleDao role, String aclQuery, String accessTypeName,
			String accessTypePrefix) {
		if (StringUtils.isNotBlank(accessTypePrefix))
			accessTypeName = accessTypePrefix + "." + accessTypeName;
		int countOfOneBit = 0;
		String accessType = "_____";

		char toReplace = '1';
		if (role != null) {
			StringBuilder accessTypeQuery = new StringBuilder();
			accessTypeQuery.append(" AND (");
			String roleAccessType = role.getAccessType();
			for (int i = 0; i < roleAccessType.length(); i++) {
				if (roleAccessType.charAt(i) == '1') {
					countOfOneBit++;
					StringBuilder accessTypeLike = new StringBuilder(accessType);
					accessTypeLike.setCharAt(i, toReplace);
					if (countOfOneBit != 1) {
						accessTypeQuery.append(" or ");
					}
					accessTypeQuery.append(" " + accessTypeName + " LIKE '%" + accessTypeLike + "%'");
				}
			}
			if (countOfOneBit > 0)
				aclQuery += accessTypeQuery + ")";
		}
		return aclQuery;
	}

}
