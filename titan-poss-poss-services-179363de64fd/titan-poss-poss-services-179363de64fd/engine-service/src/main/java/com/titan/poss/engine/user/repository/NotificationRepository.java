/*  Copyright 2019. Titan Company Limited
 *  All rights reserved.
 */
package com.titan.poss.engine.user.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.titan.poss.user.notification.dao.NotificationDao;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@Repository("EngineNotificationRepository")
public interface NotificationRepository extends JpaRepository<NotificationDao, String> {

}
