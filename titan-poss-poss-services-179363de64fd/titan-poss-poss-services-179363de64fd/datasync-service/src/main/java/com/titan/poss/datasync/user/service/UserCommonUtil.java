package com.titan.poss.datasync.user.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.titan.poss.core.dto.SyncData;
import com.titan.poss.datasync.constant.DatasyncStatusEnum;
import com.titan.poss.datasync.util.ReceiverUtil;
import com.titan.poss.user.dao.EmployeeDao;
import com.titan.poss.user.dao.EmployeeRoleMappingDao;
import com.titan.poss.user.dao.UserLoginDao;
import com.titan.poss.user.dto.sync.EmployeeRoleMappingSyncDto;
import com.titan.poss.user.dto.sync.EmployeeSyncDto;
import com.titan.poss.user.dto.sync.UserLoginSyncDto;
import com.titan.poss.user.repository.EmployeeRepository;
import com.titan.poss.user.repository.EmployeeRoleMappingRepository;
import com.titan.poss.user.repository.UserLoginRepository;

@Service
public class UserCommonUtil {

	@Autowired
	private EmployeeRepository employeeRepo;

	@Autowired
	private EmployeeRoleMappingRepository employeeRoleRepo;

	@Autowired
	private UserLoginRepository userLoginRepo;

	public void syncEmployeeDao(SyncData data, List<EmployeeDao> employeesToDeactivate, ObjectMapper mapper) {
		EmployeeSyncDto syncDto = new EmployeeSyncDto();
		List<EmployeeDao> srcDaoList = syncDto
				.getEmployeeDaoList(mapper.convertValue(data.getData(), new TypeReference<List<EmployeeSyncDto>>() {
				}));
		srcDaoList.forEach(srcDao -> {
			Optional<EmployeeDao> destDao = employeeRepo.findByEmployeeCode(srcDao.getEmployeeCode());
			if (!destDao.isPresent()) {
				int tempSrcDataSyncId = srcDao.getSrcSyncId();
				srcDao.setSrcSyncId(srcDao.getDestSyncId());
				srcDao.setDestSyncId(tempSrcDataSyncId);
				employeesToDeactivate.add(srcDao);
			}
			destDao.ifPresent(dest -> {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcDao.getSrcSyncId(), srcDao.getDestSyncId(),
						dest.getSrcSyncId(), dest.getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcDao.getSrcSyncId();
					srcDao.setSrcSyncId(srcDao.getDestSyncId());
					srcDao.setDestSyncId(tempSrcDataSyncId);
					employeesToDeactivate.add(srcDao);
				}
			});
		});

	}

	public void syncEmployeeRoleMappingDao(SyncData data, List<EmployeeRoleMappingDao> employeeRoleMappingList,
			ObjectMapper mapper) {
		EmployeeRoleMappingSyncDto syncDto = new EmployeeRoleMappingSyncDto();
		List<EmployeeRoleMappingDao> srcDaoList = syncDto
				.getDaoList(mapper.convertValue(data.getData(), new TypeReference<List<EmployeeRoleMappingSyncDto>>() {
				}));
		srcDaoList.forEach(srcDao -> {
			Optional<EmployeeRoleMappingDao> destDao = employeeRoleRepo.findById(srcDao.getId());
			destDao.ifPresent(dest -> {
				if (dest.getSyncTime() < srcDao.getSyncTime()) {
					employeeRoleMappingList.add(dest);
				}
			});
		});

	}

	public void syncUserLoginDao(SyncData data, List<UserLoginDao> userLoginList, ObjectMapper mapper) {
		UserLoginSyncDto syncDto = new UserLoginSyncDto();
		List<UserLoginDao> srcDaoList = syncDto
				.getUserLoginDaoList(mapper.convertValue(data.getData(), new TypeReference<List<UserLoginSyncDto>>() {
				}));
		srcDaoList.forEach(srcDao -> {
			UserLoginDao destDao = userLoginRepo.findOneByUserName(srcDao.getUserName());
			if (destDao == null) {
				int tempSrcDataSyncId = srcDao.getSrcSyncId();
				srcDao.setSrcSyncId(srcDao.getDestSyncId());
				srcDao.setDestSyncId(tempSrcDataSyncId);
				userLoginList.add(srcDao);
			} else {
				DatasyncStatusEnum status = ReceiverUtil.isSyncable(srcDao.getSrcSyncId(), srcDao.getDestSyncId(),
						destDao.getSrcSyncId(), destDao.getDestSyncId());
				if (status.equals(DatasyncStatusEnum.SYNCED)) {
					int tempSrcDataSyncId = srcDao.getSrcSyncId();
					srcDao.setSrcSyncId(srcDao.getDestSyncId());
					srcDao.setDestSyncId(tempSrcDataSyncId);
					userLoginList.add(srcDao);
				}
			}
		});

	}
}
