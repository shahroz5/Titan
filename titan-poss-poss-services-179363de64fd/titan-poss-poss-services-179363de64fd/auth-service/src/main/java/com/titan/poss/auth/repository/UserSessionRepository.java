/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.auth.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.auth.dao.UserSessionDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("authUserSessionRepo")
public interface UserSessionRepository extends JpaRepository<UserSessionDao, Integer> {

	public UserSessionDao findOneByUserLoginUserNameAndToken(String userName, String token);

	public UserSessionDao findOneByToken(String token);

	public List<UserSessionDao> findByUserLoginUserNameAndIsActiveTrue(String userName);

}