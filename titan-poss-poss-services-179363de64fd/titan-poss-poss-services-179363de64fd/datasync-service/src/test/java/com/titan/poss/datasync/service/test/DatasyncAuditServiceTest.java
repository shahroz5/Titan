/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */
package com.titan.poss.datasync.service.test;

import static org.junit.Assert.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.junit.jupiter.SpringExtension;

import com.titan.poss.datasync.DatasyncServiceApplicationTests;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.dao.DatasyncAuditDao;
import com.titan.poss.datasync.dao.LocationQueueDao;
import com.titan.poss.datasync.dto.DataflowDirectionEnum;
import com.titan.poss.datasync.service.DatasyncAuditService;

/**
 * @author Mindtree Ltd.
 * @version 1.0
 */
@ExtendWith(SpringExtension.class)
class DatasyncAuditServiceTest extends DatasyncServiceApplicationTests {

	@Autowired
	DatasyncAuditService datasyncAuditService;

	private static final String EPOSS = "EPOSS";
	private static final String STN = "stn-inward";
	private static final String IMPL = "Not yet implemented";

	private static final Logger LOGGER = LoggerFactory.getLogger(DatasyncAuditServiceTest.class);

	@Test
	void testAddDatasyncAudit() {
		DatasyncAuditDao da = new DatasyncAuditDao();
		String data = "{\"key\":\"value\"}";
		String id = UUID.randomUUID().toString();
		da.setId(id);
		da.setDestination("ABO");
		da.setSource(EPOSS);
		da.setData(data);
		da.setDataflowDirection(DataflowDirectionEnum.OUT.name());
		da.setOperation(STN);

		String result = datasyncAuditService.addDatasyncAudit(da);
		assertTrue(!result.isEmpty());

	}

	// @Test
	void testAddDatasyncAuditList() {
		List<DatasyncAuditDao> daList = new ArrayList<>();
		String id = UUID.randomUUID().toString();
		String data = "{\"key\":\"value\"}";

		DatasyncAuditDao da = new DatasyncAuditDao();
		da.setId(id);
		da.setDestination("ABO");
		da.setSource(EPOSS);
		da.setIsNotified(false);
		da.setData(data);
		da.setDataflowDirection(DataflowDirectionEnum.OUT.name());
		da.setOperation(STN);

		DatasyncAuditDao da1 = new DatasyncAuditDao();
		da1.setId(id);
		da1.setDestination("URB");
		da1.setSource(EPOSS);
		da1.setIsNotified(true);
		da1.setData(data);
		da1.setDataflowDirection(DataflowDirectionEnum.OUT.name());
		da1.setOperation(STN);

		daList.add(da1);
		daList.add(da);

		datasyncAuditService.addDatasyncAuditList(daList);

	}

	// @Test
	void testUpdateMessageRefIdAndStatus() {

		datasyncAuditService.updateMessageRefIdAndStatus("91B3259E-AAF6-4417-B035-F78857CCFA8C", "URB", "100ABC",
				DatasyncStatusEnum.IN_QUEUE.name());
	}

	// @Test
	void testlistUnnotifiedMessage() {
		List<DatasyncAuditDao> l = datasyncAuditService.listUnnotifiedMessage();

		for (DatasyncAuditDao d : l) {
			LOGGER.info(d.getId());
		}
	}

	// @Test
	void testgetAllActiveLocation() {

		List<LocationQueueDao> a = datasyncAuditService.getAllActiveLocation();
		for (LocationQueueDao b : a) {
			LOGGER.info(b.getLocationCode());
		}
	}

	// @Test
	void testUpdateDatasyncAuditStatusStringString() {
		fail(IMPL);
	}

	// @Test
	void testUpdateDatasyncAuditStatusNotificationRequest() {
		fail(IMPL);
	}

	// @Test
	void testGetMessageById() {
		fail(IMPL);
	}

}
