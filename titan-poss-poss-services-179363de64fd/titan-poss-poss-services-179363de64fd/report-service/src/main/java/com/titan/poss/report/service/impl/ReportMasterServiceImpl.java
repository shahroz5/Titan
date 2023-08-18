/*  
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.report.service.impl;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.support.CronSequenceGenerator;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.titan.poss.core.dto.RoleLiteDto;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.JsonData;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.response.PagedRestResponse;
import com.titan.poss.core.service.clients.EngineServiceClient;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.report.dao.ReportFieldsDao;
import com.titan.poss.report.dao.ReportFieldsRoleMappingDao;
import com.titan.poss.report.dao.ReportMasterDao;
import com.titan.poss.report.dao.ReportRoleMappingDao;
import com.titan.poss.report.dao.ReportSchedulerDao;
import com.titan.poss.report.dao.UserSavedQueriesDao;
import com.titan.poss.report.dao.UserTemplatesDao;
import com.titan.poss.report.dto.request.AddUpdateAutoReportDto;
import com.titan.poss.report.dto.request.AddUpdateReportRoleDto;
import com.titan.poss.report.dto.request.ReportFieldRequestDto;
import com.titan.poss.report.dto.request.ReportMasterRequestDto;
import com.titan.poss.report.dto.request.UpdateReportFieldsRoleDto;
import com.titan.poss.report.dto.request.UserSearchQueryRequestDto;
import com.titan.poss.report.dto.request.UserTemplatesRequestDto;
import com.titan.poss.report.dto.request.json.OutputColumnsData;
import com.titan.poss.report.dto.request.json.SavedQueryData;
import com.titan.poss.report.dto.response.AutoReportDto;
import com.titan.poss.report.dto.response.ReportFieldDto;
import com.titan.poss.report.dto.response.ReportFieldsRoleMappingDto;
import com.titan.poss.report.dto.response.ReportMasterResponseDto;
import com.titan.poss.report.dto.response.ReportRoleDto;
import com.titan.poss.report.dto.response.UserSearchQueriesDto;
import com.titan.poss.report.dto.response.UserTemplatesDto;
import com.titan.poss.report.repository.ReportFieldsRepositoryExt;
import com.titan.poss.report.repository.ReportFieldsRoleMappingRepositoryExt;
import com.titan.poss.report.repository.ReportMasterRepositoryExt;
import com.titan.poss.report.repository.ReportRoleMappingRepositoryExt;
import com.titan.poss.report.repository.ReportSchedulerRepositoryExt;
import com.titan.poss.report.repository.UserSavedQueriesRepositoryExt;
import com.titan.poss.report.repository.UserTemplatesRepositoryExt;
import com.titan.poss.report.service.ReportMasterService;

/**
 * 
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Service
public class ReportMasterServiceImpl implements ReportMasterService {

	private static final String INVALID_REPORT_ID = "No report found for the requested report id";
	private static final String ERR_REPORT_001 = "ERR-REPORT-001";
	private static final String INVALID_REPORT_FIELD_ID = "No report field found for the request report field id";
	private static final String ERR_REPORT_002 = "ERR-REPORT-002";
	private static final String JSON_TYPE_MISMATCH = "JSON type mismatch";
	private static final String ERR_CORE_014 = "ERR-CORE-014";
	private static final String REPORT_QUERY = "REPORT_QUERY";
	private static final String REPORT_TEMPLATE = "REPORT_TEMPLATE";
	private static final String INVALID_TEMPLATE_ID = "No template found for the requested template id";
	private static final String ERR_REPORT_003 = "ERR-REPORT-003";
	private static final String INVALID_SAVED_QUERY_ID = "No template found for the requested template id";
	private static final String ERR_REPORT_004 = "ERR-REPORT-003";
	private static final String ERR_REPORT_015 = "ERR-REPORT-015";

	@Autowired
	private ReportMasterRepositoryExt reportMasterRepository;

	@Autowired
	private ReportSchedulerRepositoryExt reportSchedulerRepositoryExt;

	@Autowired
	private ReportFieldsRepositoryExt reportFieldsRepository;

	@Autowired
	private ReportFieldsRoleMappingRepositoryExt reportFieldsRoleRepository;

	@Autowired
	private ReportRoleMappingRepositoryExt reportRoleMappingRepository;

	@Autowired
	private UserSavedQueriesRepositoryExt userSavedQueriesRepository;

	@Autowired
	private UserTemplatesRepositoryExt userTemplatesRepository;

	@Autowired
	private EngineServiceClient engineServiceClient;

	@Override
	public PagedRestResponse<List<ReportMasterResponseDto>> listReports(String reportName, String reportType,
			String reportGroup, Pageable pageable, Boolean isPageable) {
		if (isPageable.equals(Boolean.FALSE)) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}
		ReportMasterDao reportMasterDao = new ReportMasterDao();
		reportMasterDao.setReportName(reportName);
		reportMasterDao.setReportType(reportType);
		reportMasterDao.setReportGroup(reportGroup);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ReportMasterDao> criteria = Example.of(reportMasterDao, matcher);
		Page<ReportMasterDao> reportMasterDaoList = reportMasterRepository.findAll(criteria, pageable);
		List<ReportMasterResponseDto> reportResponseDtoList = new ArrayList<>();
		List<String> roleCodes = engineServiceClient.getRoleList().getResults();
		reportMasterDaoList
				.forEach(reportMaster -> reportResponseDtoList.add(getReportMasterDto(reportMaster, roleCodes)));
		return new PagedRestResponse<>(reportResponseDtoList, reportMasterDaoList);
	}

	/**
	 * @param reportMaster
	 * @param roleCodes
	 * @return
	 */
	private ReportMasterResponseDto getReportMasterDto(ReportMasterDao reportMaster, List<String> roleCodes) {
		ReportMasterResponseDto reportResponse = (ReportMasterResponseDto) MapperUtil.getDtoMapping(reportMaster,
				ReportMasterResponseDto.class);
		if (!CollectionUtils.isEmpty(roleCodes)) {
			Calendar calendar = Calendar.getInstance();
			int hour = calendar.get(Calendar.HOUR_OF_DAY);
			int minutes = calendar.get(Calendar.MINUTE);
			String currentHourAndMinute = hour < 10 ? "0" + hour + ":" + minutes : hour + ":" + minutes;
			List<String> roleCode = engineServiceClient.getRoleList().getResults();
			List<ReportRoleMappingDao> reportRoleMappingDao = reportRoleMappingRepository
					.getReportRoleMapping(currentHourAndMinute, roleCode, reportMaster.getId());
			if (CollectionUtils.isEmpty(reportRoleMappingDao)) {
				reportResponse.setIsMappedToTheRole(Boolean.FALSE);
			} else {
				reportResponse.setIsMappedToTheRole(Boolean.TRUE);
			}
		}
		return reportResponse;
	}

	@Override
	public ReportMasterResponseDto getReports(String id) {
		ReportMasterDao reportMasterDao = getReportMasterDao(id);
		return getReportMasterDto(reportMasterDao, null);
	}

	private ReportMasterDao getReportMasterDao(String id) {
		return reportMasterRepository.findById(id)
				.orElseThrow(() -> new ServiceException(INVALID_REPORT_ID + " : " + id, ERR_REPORT_001));
	}

	@Override
	public ReportMasterResponseDto createReport(ReportMasterRequestDto reportMasterRequestDto) {

		ReportMasterDao reportMasterDao = (ReportMasterDao) MapperUtil.getDtoMapping(reportMasterRequestDto,
				ReportMasterDao.class);
		reportMasterDao = reportMasterRepository.save(reportMasterDao);

		return getReportMasterDto(reportMasterDao, null);
	}

	@Override
	public ReportMasterResponseDto updateReport(String id, ReportMasterRequestDto reportMasterRequestDto) {

		ReportMasterDao reportMasterDao = getReportMasterDao(id);
		MapperUtil.getObjectMapping(reportMasterRequestDto, reportMasterDao);
		reportMasterDao = reportMasterRepository.save(reportMasterDao);
		return getReportMasterDto(reportMasterDao, null);
	}

	@Override
	public PagedRestResponse<List<ReportFieldDto>> listReportFields(String id, String fieldName, Pageable pageable,
			Boolean isPageable) {
		if (isPageable.equals(Boolean.FALSE)) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}
		ReportMasterDao reportMasterDao = new ReportMasterDao();
		reportMasterDao.setId(id);
		ReportFieldsDao reportFieldsDao = new ReportFieldsDao();
		List<ReportFieldDto> reportFieldDtoList = new ArrayList<>();
		reportFieldsDao.setReportMaster(reportMasterDao);
		reportFieldsDao.setFieldName(fieldName);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ReportFieldsDao> criteria = Example.of(reportFieldsDao, matcher);
		Page<ReportFieldsDao> reportFieldsDaoList = reportFieldsRepository.findAll(criteria, pageable);
		reportFieldsDaoList.forEach(reportFields -> reportFieldDtoList.add(getReportFieldDto(reportFields, id)));
		return new PagedRestResponse<>(reportFieldDtoList, reportFieldsDaoList);
	}

	@Override
	public PagedRestResponse<List<ReportFieldDto>> ListOptionalAndExcludedColumns(String reportId, Pageable pageable,
			Boolean isPageable) {
		List<ReportFieldDto> reportFieldDtoList = new ArrayList<>();
		if (isPageable.equals(Boolean.FALSE)) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}
		List<String> roleCodes = engineServiceClient.getRoleList().getResults();
		Page<ReportFieldsDao> reportFieldsDaoList = reportFieldsRepository.findOptionalAndExcludedColumnById(roleCodes,
				reportId, pageable);
		reportFieldsDaoList.forEach(reportFields -> {
			ReportFieldDto reportFieldDto = (ReportFieldDto) MapperUtil.getDtoMapping(reportFields,
					ReportFieldDto.class);
			reportFieldDtoList.add(reportFieldDto);
		});
		return new PagedRestResponse<>(reportFieldDtoList, reportFieldsDaoList);
	}

	/**
	 * @param reportFields
	 * @return
	 */
	private ReportFieldDto getReportFieldDto(ReportFieldsDao reportFields, String id) {
		ReportFieldDto reportFieldDto = (ReportFieldDto) MapperUtil.getDtoMapping(reportFields, ReportFieldDto.class);
		reportFieldDto.setId(reportFields.getId());
		reportFieldDto.setReportMasterId(id);
		return reportFieldDto;
	}

	@Override
	public ReportFieldDto getReportFields(String id, String fieldId) {
		ReportFieldsDao reportFieldsDao = getReportFieldDao(id, fieldId);
		return getReportFieldDto(reportFieldsDao, id);
	}

	@Override
	public ReportFieldDto createReportFields(String id, ReportFieldRequestDto reportFieldRequestDto) {
		ReportMasterDao reportMasterDao = getReportMasterDao(id);
		if(reportFieldRequestDto.getIsEncrypted()==null) {
			reportFieldRequestDto.setIsEncrypted(false);
		}
		ReportFieldsDao reportFieldsDao = (ReportFieldsDao) MapperUtil.getDtoMapping(reportFieldRequestDto,
				ReportFieldsDao.class);
		reportFieldsDao.setReportMaster(reportMasterDao);
		reportFieldsRepository.save(reportFieldsDao);
		return getReportFieldDto(reportFieldsDao, id);
	}

	@Override
	public ReportFieldDto updateReportFields(String id, String fieldId, ReportFieldRequestDto reportFieldRequestDto) {
		ReportFieldsDao reportFieldsDao = getReportFieldDao(id, fieldId);
		if(reportFieldRequestDto.getIsEncrypted()==null) {
			reportFieldRequestDto.setIsEncrypted(false);
		}
		MapperUtil.getObjectMapping(reportFieldRequestDto, reportFieldsDao);
		reportFieldsRepository.save(reportFieldsDao);
		return getReportFieldDto(reportFieldsDao, id);
	}

	private ReportFieldsDao getReportFieldDao(String id, String fieldId) {
		ReportFieldsDao reportFieldsDao = reportFieldsRepository.findByIdAndReportMasterId(fieldId, id);
		if (reportFieldsDao == null) {
			throw new ServiceException(INVALID_REPORT_FIELD_ID, ERR_REPORT_002);
		}
		return reportFieldsDao;
	}

	@Override
	public PagedRestResponse<List<ReportFieldsRoleMappingDto>> listReportFieldRoleMapping(String id, String roleCode,
			String fieldName, Pageable pageable, Boolean isPageable) {

		if (isPageable.equals(Boolean.FALSE)) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}

		ReportMasterDao reportMasterDao = new ReportMasterDao();
		reportMasterDao.setId(id);
		ReportFieldsDao reportField = new ReportFieldsDao();
		reportField.setFieldName(fieldName);
		List<ReportFieldsRoleMappingDto> reportFieldsRoleDtoList = new ArrayList<>();
		ReportFieldsRoleMappingDao reportFieldsRoleDao = new ReportFieldsRoleMappingDao();
		reportFieldsRoleDao.setReportMaster(reportMasterDao);
		reportFieldsRoleDao.setRoleCode(roleCode);
		reportFieldsRoleDao.setReportField(reportField);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ReportFieldsRoleMappingDao> criteria = Example.of(reportFieldsRoleDao, matcher);
		Page<ReportFieldsRoleMappingDao> reportFieldsRoleDaoList = reportFieldsRoleRepository.findAll(criteria,
				pageable);
		reportFieldsRoleDaoList.forEach(reportFieldsRoleMappingDao -> reportFieldsRoleDtoList
				.add(getreportFieldsRoleDto(reportFieldsRoleMappingDao)));
		return new PagedRestResponse<>(reportFieldsRoleDtoList, reportFieldsRoleDaoList);
	}

	/**
	 * @param reportFieldsRoleMappingDao
	 * @return
	 */
	private ReportFieldsRoleMappingDto getreportFieldsRoleDto(ReportFieldsRoleMappingDao reportFieldsRoleMappingDao) {
		ReportFieldsRoleMappingDto reportFieldsRoleDto = (ReportFieldsRoleMappingDto) MapperUtil
				.getDtoMapping(reportFieldsRoleMappingDao, ReportFieldsRoleMappingDto.class);
		reportFieldsRoleDto.setReportFieldId(reportFieldsRoleMappingDao.getReportField().getId());
		reportFieldsRoleDto.setReportMasterId(reportFieldsRoleMappingDao.getReportMaster().getId());
		reportFieldsRoleDto.setFieldName(reportFieldsRoleMappingDao.getReportField().getFieldName());
		return reportFieldsRoleDto;
	}

	@Override
	@Transactional
	public ListResponse<ReportFieldsRoleMappingDto> updateReportFieldRoleMapping(String id,
			UpdateReportFieldsRoleDto updateReportFieldsRoleDto) {
		ReportMasterDao reportMaster = getReportMasterDao(id);
		List<ReportFieldsRoleMappingDao> reportFieldsRoleDaoList = new ArrayList<>();
		List<ReportFieldsRoleMappingDto> reportFieldsRoleDtoList = new ArrayList<>();
		addReportFieldRoleMapping(id, updateReportFieldsRoleDto, reportMaster, reportFieldsRoleDaoList);
		removeReportRoleMapping(updateReportFieldsRoleDto, reportMaster);
		reportFieldsRoleDaoList.forEach(
				reportFieldsRoleDao -> reportFieldsRoleDtoList.add(getreportFieldsRoleDto(reportFieldsRoleDao)));
		return new ListResponse<>(reportFieldsRoleDtoList);
	}

	private void removeReportRoleMapping(UpdateReportFieldsRoleDto updateReportFieldsRoleDto,
			ReportMasterDao reportMaster) {
		if (!CollectionUtils.isEmpty(updateReportFieldsRoleDto.getRemoveRoles())) {
			List<ReportFieldsRoleMappingDao> reportRoleMapping = reportFieldsRoleRepository
					.findByReportMasterAndIdIn(reportMaster, updateReportFieldsRoleDto.getRemoveRoles());
			reportFieldsRoleRepository.deleteAll(reportRoleMapping);
		}
	}

	private void addReportFieldRoleMapping(String id, UpdateReportFieldsRoleDto updateReportFieldsRoleDto,
			ReportMasterDao reportMaster, List<ReportFieldsRoleMappingDao> reportFieldsRoleDaoList) {
		if (!CollectionUtils.isEmpty(updateReportFieldsRoleDto.getAddRoles())) {
			updateReportFieldsRoleDto.getAddRoles().forEach(record -> {
				ReportFieldsDao reportFieldDao = getReportFieldDao(id, record.getReportFieldId());
				ReportFieldsRoleMappingDao reportFieldsRoleMappingDao = (ReportFieldsRoleMappingDao) MapperUtil
						.getDtoMapping(record, ReportFieldsRoleMappingDao.class);
				reportFieldsRoleMappingDao.setReportField(reportFieldDao);
				reportFieldsRoleMappingDao.setReportMaster(reportMaster);
				reportFieldsRoleDaoList.add(reportFieldsRoleMappingDao);
			});
			reportFieldsRoleRepository.saveAll(reportFieldsRoleDaoList);
		}
	}

	@Override
	public PagedRestResponse<List<ReportRoleDto>> listReportRoleMapping(String roleCode, String reportDescription,
			Pageable pageable, Boolean isPageable) {
		if (isPageable.equals(Boolean.FALSE)) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}
		List<ReportRoleDto> reportRoleDtoList = new ArrayList<>();
		ReportMasterDao reportMasterDao = new ReportMasterDao();
		reportMasterDao.setReportDescription(reportDescription);
		ReportRoleMappingDao reportRoleMappingDao = new ReportRoleMappingDao();
		reportRoleMappingDao.setReportMaster(reportMasterDao);
		reportRoleMappingDao.setRoleCode(roleCode);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<ReportRoleMappingDao> criteria = Example.of(reportRoleMappingDao, matcher);
		Page<ReportRoleMappingDao> reportRoleMappingDaoList = reportRoleMappingRepository.findAll(criteria, pageable);
		reportRoleMappingDaoList
				.forEach(reportRoleMapping -> reportRoleDtoList.add(getReportRoleMappingDto(reportRoleMapping)));
		return new PagedRestResponse<>(reportRoleDtoList, reportRoleMappingDaoList);
	}

	/**
	 * @param reportRoleMapping
	 * @return
	 */
	private ReportRoleDto getReportRoleMappingDto(ReportRoleMappingDao reportRoleMapping) {
		ReportRoleDto reportRoleDto = (ReportRoleDto) MapperUtil.getDtoMapping(reportRoleMapping, ReportRoleDto.class);
		reportRoleDto.setReportId(reportRoleMapping.getReportMaster().getId());
		reportRoleDto.setReportName(reportRoleMapping.getReportMaster().getReportDescription());
		reportRoleDto.setRoleCode(reportRoleMapping.getRoleCode());
		RoleLiteDto roleLite = engineServiceClient.getRoleDetails(reportRoleMapping.getRoleCode());
		reportRoleDto.setRoleDescrption(roleLite.getRoleName());
		return reportRoleDto;
	}

	@Override
	@Transactional
	public ListResponse<ReportRoleDto> updateReportRoleMapping(String roleCode,
			AddUpdateReportRoleDto addUpdateReportRoleDto) {

		List<ReportRoleDto> reportRoleDtoList = new ArrayList<>();
		List<ReportRoleMappingDao> reportRoleMappingDaoList = new ArrayList<>();

		if (!CollectionUtils.isEmpty(addUpdateReportRoleDto.getAddAccess())) {
			addReportRoleMapping(roleCode, addUpdateReportRoleDto, reportRoleMappingDaoList);
		}
		if (!CollectionUtils.isEmpty(addUpdateReportRoleDto.getUpdateAccess())) {
			reportRoleMappingDaoList = updateReportRoles(addUpdateReportRoleDto);
		}
		if (!CollectionUtils.isEmpty(addUpdateReportRoleDto.getRemoveAccess())) {
			removeReportRoleMapping(addUpdateReportRoleDto);
		}
		reportRoleMappingDaoList
				.forEach(reportRoleDao -> reportRoleDtoList.add(getReportRoleMappingDto(reportRoleDao)));
		return new ListResponse<>(reportRoleDtoList);
	}

	private void removeReportRoleMapping(AddUpdateReportRoleDto addUpdateReportRoleDto) {
		if (!CollectionUtils.isEmpty(addUpdateReportRoleDto.getRemoveAccess())) {
			List<ReportRoleMappingDao> reportRoleMapping = reportRoleMappingRepository
					.findAllById(addUpdateReportRoleDto.getRemoveAccess());
			reportRoleMappingRepository.deleteAll(reportRoleMapping);
		}
	}

	private void addReportRoleMapping(String roleCode, AddUpdateReportRoleDto addUpdateReportRoleDto,
			List<ReportRoleMappingDao> reportRoleMappingDaoList) {

		if (!CollectionUtils.isEmpty(addUpdateReportRoleDto.getAddAccess())) {
			addUpdateReportRoleDto.getAddAccess().forEach(addRole -> {
				ReportRoleMappingDao reportRoleMappingDao = (ReportRoleMappingDao) MapperUtil.getDtoMapping(addRole,
						ReportRoleMappingDao.class);
				reportRoleMappingDao.setRoleCode(roleCode);
				ReportMasterDao reportMasterDao = getReportMasterDao(addRole.getReportId());
				reportRoleMappingDao.setReportMaster(reportMasterDao);
				reportRoleMappingDaoList.add(reportRoleMappingDao);
			});
			reportRoleMappingRepository.saveAll(reportRoleMappingDaoList);
		}
	}

	private List<ReportRoleMappingDao> updateReportRoles(AddUpdateReportRoleDto addUpdateReportRoleDto) {
		List<ReportRoleMappingDao> reportRoleMappingDaoList = new ArrayList<>();
		addUpdateReportRoleDto.getUpdateAccess().forEach(updateRole -> {

			ReportRoleMappingDao reportRoleMappingDao = reportRoleMappingRepository.findById(updateRole.getId()).get();

			if (reportRoleMappingDao != null) {
				MapperUtil.getObjectMapping(updateRole, reportRoleMappingDao);
				reportRoleMappingDaoList.add(reportRoleMappingDao);
			}
		});
		reportRoleMappingRepository.saveAll(reportRoleMappingDaoList);
		return reportRoleMappingDaoList;
	}

	@Override
	public PagedRestResponse<List<UserSearchQueriesDto>> listSavedQueries(String id, String queryName,
			String employeeCode, Pageable pageable) {
		ReportMasterDao reportMasterDao = getReportMasterDao(id);
		List<UserSearchQueriesDto> userSearchQueriesDtoList = new ArrayList<>();
		UserSavedQueriesDao userSearchQueriesDao = new UserSavedQueriesDao();
		userSearchQueriesDao.setReportMaster(reportMasterDao);
		userSearchQueriesDao.setQueryName(queryName);
		userSearchQueriesDao.setEmployeeCode(employeeCode);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<UserSavedQueriesDao> criteria = Example.of(userSearchQueriesDao, matcher);
		Page<UserSavedQueriesDao> userSearchQueriesDaoList = userSavedQueriesRepository.findAll(criteria, pageable);
		userSearchQueriesDaoList
				.forEach(userSearchQuery -> userSearchQueriesDtoList.add(getUserSearchQueriesDto(userSearchQuery)));
		return new PagedRestResponse<>(userSearchQueriesDtoList, userSearchQueriesDaoList);
	}

	/**
	 * @param userSearchQuery
	 * @return
	 */
	private UserSearchQueriesDto getUserSearchQueriesDto(UserSavedQueriesDao userSearchQuery) {
		UserSearchQueriesDto userSearchQueriesDto = (UserSearchQueriesDto) MapperUtil.getDtoMapping(userSearchQuery,
				UserSearchQueriesDto.class);
		userSearchQueriesDto.setReportMasterId(userSearchQuery.getReportMaster().getId());
		Object obj = MapperUtil.getJsonFromString(userSearchQuery.getSavedQuery());
		JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
		userSearchQueriesDto.setSavedQuery(jsonData);
		return userSearchQueriesDto;
	}

	@Override
	public UserSearchQueriesDto getSavedQueries(String id, String queryId) {
		UserSavedQueriesDao userSearchQueriesDao = userSavedQueriesRepository.findByIdAndReportMasterId(queryId, id);
		if (userSearchQueriesDao == null) {
			throw new ServiceException(INVALID_SAVED_QUERY_ID, ERR_REPORT_004);
		}
		return getUserSearchQueriesDto(userSearchQueriesDao);
	}

	@Override
	public UserSearchQueriesDto createUserSavedQuries(String id, UserSearchQueryRequestDto userSearchQueryRequestDto) {
		savedQueryTypeValidation(userSearchQueryRequestDto);
		SavedQueryData savedQueryData = new SavedQueryData();
		savedQueryData.validate(userSearchQueryRequestDto.getSavedQuery().getData());
		ReportMasterDao reportMasterDao = getReportMasterDao(id);
		UserSavedQueriesDao userSearchQueriesDao = (UserSavedQueriesDao) MapperUtil
				.getDtoMapping(userSearchQueryRequestDto, UserSavedQueriesDao.class);
		userSearchQueriesDao.setReportMaster(reportMasterDao);
		userSearchQueriesDao.setSavedQuery(MapperUtil.getJsonString(userSearchQueryRequestDto.getSavedQuery()));
		userSavedQueriesRepository.save(userSearchQueriesDao);
		return getUserSearchQueriesDto(userSearchQueriesDao);
	}

	private void savedQueryTypeValidation(UserSearchQueryRequestDto userSearchQueryRequestDto) {
		if (!REPORT_QUERY.equals(userSearchQueryRequestDto.getSavedQuery().getType())) {
			throw new ServiceException(JSON_TYPE_MISMATCH, ERR_CORE_014);
		}
	}

	@Transactional
	@Override
	public UserSearchQueriesDto updateUserSearchQuries(String id, String queryId,
			UserSearchQueryRequestDto userSearchQueryRequestDto) {
		savedQueryTypeValidation(userSearchQueryRequestDto);
		SavedQueryData savedQueryData = new SavedQueryData();
		savedQueryData.validate(userSearchQueryRequestDto.getSavedQuery().getData());
		UserSavedQueriesDao userSearchQueriesDao = userSavedQueriesRepository.findByIdAndReportMasterId(queryId, id);
		if (userSearchQueriesDao == null) {
			throw new ServiceException(INVALID_SAVED_QUERY_ID, ERR_REPORT_004);
		}
		MapperUtil.getObjectMapping(userSearchQueryRequestDto, userSearchQueriesDao);
		userSearchQueriesDao.setSavedQuery(MapperUtil.getJsonString(userSearchQueryRequestDto.getSavedQuery()));
		userSavedQueriesRepository.save(userSearchQueriesDao);
		return getUserSearchQueriesDto(userSearchQueriesDao);
	}

	@Override
	public PagedRestResponse<List<UserTemplatesDto>> listUserTemplates(String id, String templateName,
			String employeeCode, Pageable pageable) {
		ReportMasterDao reportMaster = new ReportMasterDao();
		reportMaster.setId(id);
		List<UserTemplatesDto> userTemplatesDtoList = new ArrayList<>();
		UserTemplatesDao userTemplatesDao = new UserTemplatesDao();
		userTemplatesDao.setTemplateName(templateName);
		userTemplatesDao.setEmployeeCode(employeeCode);
		userTemplatesDao.setReportMaster(reportMaster);
		ExampleMatcher matcher = ExampleMatcher.matching().withIgnoreNullValues();
		Example<UserTemplatesDao> criteria = Example.of(userTemplatesDao, matcher);
		Page<UserTemplatesDao> userTemplatesDaoList = userTemplatesRepository.findAll(criteria, pageable);
		userTemplatesDaoList.forEach(userTemplates -> userTemplatesDtoList.add(getUserTemplatesDto(userTemplates)));
		return new PagedRestResponse<>(userTemplatesDtoList, userTemplatesDaoList);
	}

	/**
	 * @param
	 * @return
	 */
	private UserTemplatesDto getUserTemplatesDto(UserTemplatesDao userTemplatesDao) {
		UserTemplatesDto userTemplatesDto = (UserTemplatesDto) MapperUtil.getDtoMapping(userTemplatesDao,
				UserTemplatesDto.class);
		userTemplatesDto.setReportMasterId(userTemplatesDao.getReportMaster().getId());
		Object obj = MapperUtil.getJsonFromString(userTemplatesDao.getOutputColumns());
		JsonData jsonData = MapperUtil.getObjectMapperInstance().convertValue(obj, JsonData.class);
		userTemplatesDto.setOutputColumns(jsonData);
		return userTemplatesDto;
	}

	@Override
	public UserTemplatesDto getUserTemplates(String id, String templateId) {
		UserTemplatesDao userTemplatesDao = userTemplatesRepository.findByIdAndReportMasterId(templateId, id);
		return getUserTemplatesDto(userTemplatesDao);
	}

	@Override
	public UserTemplatesDto createUserTemplates(String id, UserTemplatesRequestDto userTemplatesRequestDto) {
		templateJsonValidation(userTemplatesRequestDto);
		OutputColumnsData outputColumnsData = new OutputColumnsData();
		outputColumnsData.validate(userTemplatesRequestDto.getOutputColumns().getData());
		ReportMasterDao reportMaster = getReportMasterDao(id);
		UserTemplatesDao userTemplatesDao = (UserTemplatesDao) MapperUtil.getDtoMapping(userTemplatesRequestDto,
				UserTemplatesDao.class);
		userTemplatesDao.setOutputColumns(MapperUtil.getJsonString(userTemplatesRequestDto.getOutputColumns()));
		userTemplatesDao.setReportMaster(reportMaster);
		userTemplatesRepository.save(userTemplatesDao);
		return getUserTemplatesDto(userTemplatesDao);
	}

	private void templateJsonValidation(UserTemplatesRequestDto userTemplatesRequestDto) {
		if (!REPORT_TEMPLATE.equals(userTemplatesRequestDto.getOutputColumns().getType())) {
			throw new ServiceException(JSON_TYPE_MISMATCH, ERR_CORE_014);
		}
	}

	@Override
	public UserTemplatesDto updateUserTemplates(String id, UserTemplatesRequestDto userTemplatesRequestDto,
			String templateId) {
		templateJsonValidation(userTemplatesRequestDto);
		OutputColumnsData outputColumnsData = new OutputColumnsData();
		outputColumnsData.validate(userTemplatesRequestDto.getOutputColumns().getData());
		UserTemplatesDao userTemplatesDao = userTemplatesRepository.findByIdAndReportMasterId(templateId, id);
		if (userTemplatesDao == null) {
			throw new ServiceException(INVALID_TEMPLATE_ID, ERR_REPORT_003);
		}
		MapperUtil.getObjectMapping(userTemplatesRequestDto, UserTemplatesDao.class);
		userTemplatesDao.setOutputColumns(MapperUtil.getJsonString(userTemplatesRequestDto.getOutputColumns()));
		userTemplatesRepository.save(userTemplatesDao);
		return getUserTemplatesDto(userTemplatesDao);
	}

	@Override
	public ListResponse<AutoReportDto> addUpdateAutoReports(AddUpdateAutoReportDto addUpdateAutoReportDto) {
		List<AutoReportDto> autoReportDtoList = new ArrayList<>();
		List<ReportSchedulerDao> reportSchedulerDaoList = new ArrayList<>();
		if (!CollectionUtils.isEmpty(addUpdateAutoReportDto.getAddScheduler())) {
			reportSchedulerDaoList = addAutoReport(addUpdateAutoReportDto);
		}
		if (!CollectionUtils.isEmpty(addUpdateAutoReportDto.getUpdateScheduler())) {
			reportSchedulerDaoList = updateAutoReport(addUpdateAutoReportDto);
		}
		if (!CollectionUtils.isEmpty(addUpdateAutoReportDto.getRemoveScheduler())) {
			reportSchedulerDaoList = removeAutoReport(addUpdateAutoReportDto);
		}
		reportSchedulerDaoList
				.forEach(reportSchedulerDao -> autoReportDtoList.add(getAutoReportDto(reportSchedulerDao)));
		return new ListResponse<>(autoReportDtoList);

	}

	/**
	 * @param reportSchedulerDao
	 * @return
	 */
	private AutoReportDto getAutoReportDto(ReportSchedulerDao reportSchedulerDao) {

		AutoReportDto autoReportDto = new AutoReportDto();
		autoReportDto.setReportId(reportSchedulerDao.getReportMaster().getId());
		autoReportDto.setReportDescription(reportSchedulerDao.getReportMaster().getReportDescription());
		autoReportDto.setCronExpression(reportSchedulerDao.getCronExpression());
		autoReportDto.setFrequency(reportSchedulerDao.getFrequency());
		autoReportDto.setId(reportSchedulerDao.getId());
		autoReportDto.setIsAutoGenerated(Boolean.TRUE);
		return autoReportDto;
	}

	private List<ReportSchedulerDao> addAutoReport(AddUpdateAutoReportDto addUpdateAutoReportDto) {
		List<ReportSchedulerDao> reportSchedulerDaoList = new ArrayList<>();

		if (!CollectionUtils.isEmpty(addUpdateAutoReportDto.getAddScheduler())) {
			addUpdateAutoReportDto.getAddScheduler().forEach(addReport -> {
				ReportSchedulerDao reportSchedulerDao = (ReportSchedulerDao) MapperUtil.getDtoMapping(addReport,
						ReportSchedulerDao.class);
				if (addReport.getCronExpression() == null) {
					throw new ServiceException("Cron expression is required", "ERR-REPORT-014");
				}
				try {
					new CronSequenceGenerator(addReport.getCronExpression());
				} catch (Exception e) {
					throw new ServiceException(
							"Cron expression is not valid. please enter 6 digit valid cron expression", ERR_REPORT_015);
				}
				ReportSchedulerDao findByCronAndReportId = reportSchedulerRepositoryExt.findByCronAndReportId(
						addReport.getReportId(), addReport.getCronExpression(), addReport.getFrequency());
				if (findByCronAndReportId != null) {
					throw new ServiceException("Auto report configuration already exist", "ERR-REPORT-016");
				}

				ReportMasterDao reportMasterDao = getReportMasterDao(addReport.getReportId());
				reportSchedulerDao.setReportMaster(reportMasterDao);
				reportSchedulerDaoList.add(reportSchedulerDao);
			});
			reportSchedulerRepositoryExt.saveAll(reportSchedulerDaoList);
		}
		return reportSchedulerDaoList;
	}

	private List<ReportSchedulerDao> removeAutoReport(AddUpdateAutoReportDto addUpdateAutoReportDto) {
		List<ReportSchedulerDao> reportRoleMapping = new ArrayList<>();
		if (!CollectionUtils.isEmpty(addUpdateAutoReportDto.getRemoveScheduler())) {
			reportRoleMapping = reportSchedulerRepositoryExt.findAllById(addUpdateAutoReportDto.getRemoveScheduler());
			reportSchedulerRepositoryExt.deleteAll(reportRoleMapping);
		}
		return reportRoleMapping;
	}

	private List<ReportSchedulerDao> updateAutoReport(AddUpdateAutoReportDto addUpdateAutoReportDto) {

		List<ReportSchedulerDao> reportSchedulerDaoList = new ArrayList<>();
		addUpdateAutoReportDto.getUpdateScheduler().forEach(updateAutoReport -> {

			ReportSchedulerDao reportSchedulerDao = reportSchedulerRepositoryExt
					.findById(updateAutoReport.getSchedulerId()).get();
			ReportSchedulerDao findByCronAndReportId = reportSchedulerRepositoryExt.findByCronAndReportId(
					reportSchedulerDao.getReportMaster().getId(), updateAutoReport.getCronExpression(),
					updateAutoReport.getFrequency());
			if (updateAutoReport.getCronExpression() == null) {
				throw new ServiceException("Cron expression is required", "ERR-REPORT-014");
			}
			try {
				new CronSequenceGenerator(updateAutoReport.getCronExpression());
			} catch (Exception e) {
				throw new ServiceException("Cron expression is not valid. please enter 6 digit valid cron expression",
						ERR_REPORT_015);
			}
			if (reportSchedulerDao != null) {
				if (findByCronAndReportId != null) {
					throw new ServiceException("Auto report configuration already exist", "ERR-REPORT-016");
				}
				MapperUtil.getObjectMapping(updateAutoReport, reportSchedulerDao);
				reportSchedulerDaoList.add(reportSchedulerDao);
			}
		});
		reportSchedulerRepositoryExt.saveAll(reportSchedulerDaoList);
		return reportSchedulerDaoList;
	}

	@Override
	public PagedRestResponse<List<AutoReportDto>> listScheduledReports(String reportDescription, Pageable pageable,
			Boolean isPageable) {
		if (isPageable.equals(Boolean.FALSE)) {
			pageable = PageRequest.of(0, Integer.MAX_VALUE, pageable.getSort());
		}
		if (StringUtils.isEmpty(reportDescription)) {
			reportDescription = "";
		}
		Page<List<AutoReportDto>> reportSchedulerDaoList = reportSchedulerRepositoryExt
				.findAllByReportDescription(reportDescription, pageable);
		return new PagedRestResponse<>(reportSchedulerDaoList);
	}

}
