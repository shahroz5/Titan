/*
 * Copyright 2019. Titan Company Limited
 * All rights reserved.
 */

package com.titan.poss.datasync.service;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;
import java.util.zip.ZipOutputStream;

import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.ObjectMetadata;
import com.fasterxml.jackson.core.Version;
import com.titan.poss.core.domain.constant.enums.AppTypeEnum;
import com.titan.poss.core.dto.ApplicationVersionDto;
import com.titan.poss.core.enums.ApplicationVersionStatusEnum;
import com.titan.poss.core.exception.ServiceException;
import com.titan.poss.core.response.ListResponse;
import com.titan.poss.core.utils.CommonUtil;
import com.titan.poss.core.utils.MapperUtil;
import com.titan.poss.datasync.dao.ApplicationVersionDao;
import com.titan.poss.datasync.dto.AppVersionList;
import com.titan.poss.datasync.dto.ApplicationVersionRequestDto;
import com.titan.poss.datasync.dto.ApplicationVersionUpgradeDTO;
import com.titan.poss.datasync.dto.FileWithVersion;
import com.titan.poss.datasync.repository.ApplicationVersionRepository;
import com.titan.poss.datasync.util.EpossCallServiceImpl;

import lombok.extern.slf4j.Slf4j;

/**
 *
 * @author Mindtree Ltd.
 * @version 1.0
 */

@Slf4j
@Service
public class ApplicationVersionServiceImpl implements ApplicationVersionService {

	@Value("${app.name}")
	private String appName;

	@Autowired
	private ApplicationVersionRepository applicationVersionRepository;

	@Autowired
	private AmazonS3 s3client;

	@Autowired
	EpossCallServiceImpl epossCallService;

	List<ApplicationVersionDao> versionInAvailableAndInprogressPoss=new ArrayList<>();

	@Value("${spring.profiles.active}")
	private String activeProfile;

	@Value("${database.server.username}")
	private String dbUserName;

	@Value("${database.server.password}")
	private String dbPassword;

	@Value("${database.server.url}")
	private String dbUrl;

	@Value("#{'${poss.service.list.to.copy}'.split(',')}")
	private List<String> listOfServices;

	List<ApplicationVersionDto> applicationVersionDtos;

	Map<String, ApplicationVersionDao> possAppVersionIdVersionMap;

	private static final String BUCKET = "nap-ftp";
	private static final int BUFFER_SIZE = 4096;
	private static final String APPLICATION_VERSION_BASE_URL = "api/datasync/v2/app-version/";

	@Override
	public List<ApplicationVersionDto> getAppVersion(List<String> statusList, String locCode) {

		/*
		 * For Online store (EPOSS App) set location as EPOSS And for offline (POSS App)
		 * set location from token
		 */
		String location;
		if (AppTypeEnum.EPOSS.name().equalsIgnoreCase(appName)) {
			location = AppTypeEnum.EPOSS.name();
			List<ApplicationVersionDto> appVersionList = new ArrayList<>();

			for (ApplicationVersionDao av : applicationVersionRepository.findByLocationCodeStatus(locCode, statusList,
					PageRequest.of(0, 20))) {
				ApplicationVersionDto avd = new ApplicationVersionDto();
				avd = (ApplicationVersionDto) MapperUtil.getObjectMapping(av, avd);
				appVersionList.add(avd);

			}

			return new ArrayList<ApplicationVersionDto>(appVersionList);
		} else {
			location = CommonUtil.getLocationCode();
			List<String> status = new ArrayList<>();
			List<String> newIds = new ArrayList<>();
			List<String> epossIdsToSkip = new ArrayList<>();
			List<ApplicationVersionDto> listNewVersions = new ArrayList<>();
			Map<String, String> epossOutOfSyncIds = new HashMap<>();
			int dbVersionDiff = 1;
			int uiVersionDiff = 1;
			int servicesVersionDiff = 1;

			status.add(ApplicationVersionStatusEnum.INPROGRESS.name() + ","	+ ApplicationVersionStatusEnum.AVAILABLE.name());

			syncEpossOutOfSyncVersions(location);

			List<ApplicationVersionDto> versionInAvailableAndInprogressEposs = getVersionInAvailableAndInprogress(
					location, status);

			List<ApplicationVersionDao> lastDoneRecordStatusPoss = applicationVersionRepository.findByLocationCodeStatus(
					location, List.of(ApplicationVersionStatusEnum.DONE.name()), PageRequest.of(0, 20));

			checkVersionsInProgressStatusInPoss(location);

			if (!lastDoneRecordStatusPoss.isEmpty()) {

				dbVersionDiff = 0;
				uiVersionDiff = 0;
				servicesVersionDiff = 0;

				for (ApplicationVersionDto version : versionInAvailableAndInprogressEposs) {
					int dbVersionCompare = compareVersions(version.getDatabaseVersion(),
							lastDoneRecordStatusPoss.get(0).getDatabaseVersion());
					int uiVersionCompare = compareVersions(version.getPossUiVersion(),
							lastDoneRecordStatusPoss.get(0).getPossUiVersion());
					int servicesVersionCompare = compareVersions(version.getPossServiceVersion(),
							lastDoneRecordStatusPoss.get(0).getPossServiceVersion());

					dbVersionDiff = (dbVersionDiff > dbVersionCompare ? dbVersionDiff : dbVersionCompare);
					uiVersionDiff = (uiVersionDiff > uiVersionCompare ? uiVersionDiff : uiVersionCompare);
					servicesVersionDiff = (servicesVersionDiff > servicesVersionCompare ? servicesVersionDiff
							: servicesVersionCompare);

					if (dbVersionDiff <= 0 && uiVersionDiff <= 0 && servicesVersionDiff <= 0) {
						ApplicationVersionDao applicationVersion = new ApplicationVersionDao();
						MapperUtil.getObjectMapping(version, applicationVersion);
						applicationVersion.setReferenceId(version.getId());
						applicationVersion.setId(UUID.randomUUID().toString());
						applicationVersion.setStatus(ApplicationVersionStatusEnum.DOWNGRADE_SKIPPED.name());
						applicationVersionRepository.save(applicationVersion);
						epossIdsToSkip.add(version.getId());
					}
				}
			}

			if (dbVersionDiff <= 0 && uiVersionDiff <= 0 && servicesVersionDiff <= 0) {
				List<ApplicationVersionDto> list = new ArrayList<>();
				list.add(new ApplicationVersionDto(null, location, null, null, null, null, null, null, false));
				applicationVersionDtos = new ArrayList<ApplicationVersionDto>(list);
				if (!epossIdsToSkip.isEmpty()) {
					epossCallService.callEposs(HttpMethod.PUT,
							APPLICATION_VERSION_BASE_URL + String.join(",", epossIdsToSkip) + "/" + ApplicationVersionStatusEnum.DOWNGRADE_SKIPPED.name(),
							null, null, ListResponse.class);
				}
				return applicationVersionDtos;
			}

			processAndSyncEpossWithPossStatus(location, status, newIds, listNewVersions, epossOutOfSyncIds,
					versionInAvailableAndInprogressEposs);

			if (applicationVersionDtos==null || applicationVersionDtos.isEmpty()) {
				Set<String> possApplicationStatus = versionInAvailableAndInprogressPoss.stream()
						.map(ApplicationVersionDao::getStatus).collect(Collectors.toSet());
				if (possApplicationStatus.contains(ApplicationVersionStatusEnum.AVAILABLE.name())) {
					applicationVersionDtos = new ArrayList<ApplicationVersionDto>(List
							.of(new ApplicationVersionDto(null, location, null, null, null, null, null, null, true)));
				} else {
					applicationVersionDtos = new ArrayList<ApplicationVersionDto>(List.of(new ApplicationVersionDto()));
				}
			}
		}
		return applicationVersionDtos;
	}


	private void processAndSyncEpossWithPossStatus(String location, List<String> status, List<String> newIds,
												   List<ApplicationVersionDto> listNewVersions, Map<String, String> epossOutOfSyncIds,
												   List<ApplicationVersionDto> versionInAvailableAndInprogressEposs) {
		if (!versionInAvailableAndInprogressEposs.isEmpty()) {

			Map<String, ApplicationVersionDto> epossAppVersionIdVersionMap = versionInAvailableAndInprogressEposs
					.stream().collect(Collectors.toMap(ApplicationVersionDto::getId, Function.identity()));

			versionInAvailableAndInprogressPoss = applicationVersionRepository.findByLocationCodeStatus(location,
					Arrays.asList(status.get(0).split(",")), PageRequest.of(0, 20));
			possAppVersionIdVersionMap = versionInAvailableAndInprogressPoss.stream()
					.collect(Collectors.toMap(ApplicationVersionDao::getReferenceId, Function.identity()));

			epossAppVersionIdVersionMap.entrySet().forEach(epossVersion -> {
				String epossId = epossVersion.getKey();
				String epossStatus = epossAppVersionIdVersionMap.get(epossId).getStatus();
				if (possAppVersionIdVersionMap.keySet().contains(epossId)) {
					String possVersionStatus = possAppVersionIdVersionMap.get(epossId).getStatus();
					if (!possVersionStatus.equals(epossStatus)) {
						epossOutOfSyncIds.put(epossId, possVersionStatus);
					}
				} else {
					newIds.add(epossId);
				}
			});

			saveNewVersionsInPoss(newIds, listNewVersions, epossAppVersionIdVersionMap,applicationVersionDtos);
			syncEpossStatusWithPoss(epossOutOfSyncIds);
		}
	}


	private void syncEpossStatusWithPoss(Map<String, String> epossOutOfSyncIds) {
		Map<String, List<String>> epossStatusUpdates = epossOutOfSyncIds.keySet().stream()
				.collect(Collectors.groupingBy(k -> epossOutOfSyncIds.get(k)));

		epossStatusUpdates.forEach((versionStatus, ids) -> {
			epossCallService.callEposs(HttpMethod.PUT,
					APPLICATION_VERSION_BASE_URL + String.join(",", ids) + "/" + versionStatus,
					null, null, ListResponse.class);
		});
	}


	private void saveNewVersionsInPoss(List<String> newIds, List<ApplicationVersionDto> listNewVersions,
									   Map<String, ApplicationVersionDto> epossAppVersionIdVersionMap, List<ApplicationVersionDto> applicationVersionDtos2) {
		newIds.forEach(id -> {
			ApplicationVersionDao appVerDao = new ApplicationVersionDao();
			MapperUtil.getObjectMapping(epossAppVersionIdVersionMap.get(id), appVerDao);
			appVerDao.setReferenceId(epossAppVersionIdVersionMap.get(id).getId());
			appVerDao.setId(UUID.randomUUID().toString());
			applicationVersionRepository.save(appVerDao);
			epossAppVersionIdVersionMap.get(id).setUpgradeAvailable(true);
			listNewVersions.add(epossAppVersionIdVersionMap.get(id));
		});
		applicationVersionDtos = new ArrayList<ApplicationVersionDto>(listNewVersions);
	}


	private List<ApplicationVersionDto> getVersionInAvailableAndInprogress(String location, List<String> status) {
		log.info("Getting versionInAvailableAndInprogressEposs ::");

		@SuppressWarnings("unchecked")
		List<Map<String, String>> versionInAvailableAndInprogress = epossCallService.callEposs(HttpMethod.GET,
				APPLICATION_VERSION_BASE_URL + String.join(",", status) + "/" + location, null, null, List.class);

		List<ApplicationVersionDto> versionInAvailableAndInprogressEposs = new ArrayList<>();
		versionInAvailableAndInprogress.stream().forEach(version -> {
			versionInAvailableAndInprogressEposs.add(
					ApplicationVersionDto.builder().id(version.get("id")).locationCode(version.get("locationCode"))
							.status(version.get("status")).possServiceVersion(version.get("possServiceVersion"))
							.possUiVersion(version.get("possUiVersion"))
							.databaseVersion(version.get("databaseVersion"))
							.jarsVersion(version.get("jarsVersion"))
							.build());
		});

		log.info("Received versionInAvailableAndInprogressEposs :: {}", versionInAvailableAndInprogressEposs);
		return versionInAvailableAndInprogressEposs;
	}

	private void syncEpossOutOfSyncVersions(String location) {
		log.info("Getting versionInDoneStatusEposs ::");

		@SuppressWarnings("unchecked")
		List<Map<String, String>> versionInDoneStatusEposs = epossCallService.callEposs(HttpMethod.GET,
				APPLICATION_VERSION_BASE_URL + ApplicationVersionStatusEnum.DONE.name() + "/" + location, null,
				null, List.class);

		log.info("Received versionInDoneStatusEposs :: " + versionInDoneStatusEposs);

		Map<String, String> statusApplicationVersionEpossMap = new HashMap<>();
		versionInDoneStatusEposs.stream().forEach(map -> {
			statusApplicationVersionEpossMap.put(map.get("id"), map.get("status"));
		});

		List<ApplicationVersionDao> doneStatusRecordsInPoss = applicationVersionRepository.findByLocationCodeStatus(
				location, Arrays.asList(ApplicationVersionStatusEnum.DONE.name()), PageRequest.of(0, 20));

		Map<String, String> statusApplicationVersionPossMap = doneStatusRecordsInPoss.stream()
				.collect(Collectors.toMap(ApplicationVersionDao::getReferenceId, ApplicationVersionDao::getStatus));

		Map<String, String> possDoneRecordsOutOfSyncInEposs = new HashMap<>();

		statusApplicationVersionPossMap.forEach((k, v) -> {
			if (statusApplicationVersionEpossMap.get(k) == null
					|| !statusApplicationVersionEpossMap.get(k).equals(v)) {
				possDoneRecordsOutOfSyncInEposs.put(k, v);
			}
		});

		if (!possDoneRecordsOutOfSyncInEposs.isEmpty()) {
			Map<String, List<String>> versionToBeUpdatedInEposs = possDoneRecordsOutOfSyncInEposs.keySet().stream()
					.collect(Collectors.groupingBy(k -> possDoneRecordsOutOfSyncInEposs.get(k)));

			epossCallService.callEposs(HttpMethod.PUT,
					APPLICATION_VERSION_BASE_URL + String.join(",",
							versionToBeUpdatedInEposs.get(ApplicationVersionStatusEnum.DONE.name()))+"/"+ApplicationVersionStatusEnum.DONE.name(),
					null, null, List.class);

		}
	}

	@Override
	@Transactional
	public ApplicationVersionDto addAppVersion(ApplicationVersionRequestDto applicationVersionRequestDto) {

		List<ApplicationVersionDao> appVersionList = new ArrayList<>();

		for (String ar : applicationVersionRequestDto.getLocationCode()) {
			ApplicationVersionDao av = new ApplicationVersionDao();
			av.setId(UUID.randomUUID().toString());
			av = (ApplicationVersionDao) MapperUtil.getObjectMapping(applicationVersionRequestDto, av, "locationCode");
			av.setLocationCode(ar);
			av.setStatus(ApplicationVersionStatusEnum.AVAILABLE.name());
			appVersionList.add(av);
		}
		appVersionList = applicationVersionRepository.saveAll(appVersionList);

		return null;
	}

	@Override
	@Transactional
	public List<ApplicationVersionUpgradeDTO> updateAppVersion(List<String> id, String status) {

		List<ApplicationVersionUpgradeDTO> applicationVersionUpgradeDto = new ArrayList<>();
		String location;
		List<ApplicationVersionDao> versionsInAvailableStatus;
		String installDrive = returnDriveForPath("Titan\\Scripts");
		if (installDrive == "") {
			log.error("Install location does not exist");
		}
		String baseScriptsPath = installDrive + "Titan\\Scripts";
		String basePossPath = installDrive + "Titan\\POSS";
		String baseWebAppPath = "poss-webapp1/poss/";

		if (AppTypeEnum.EPOSS.name().equalsIgnoreCase(appName)) {

			List<ApplicationVersionDao> av = applicationVersionRepository.findAllById(id);
			List<ApplicationVersionUpgradeDTO> avdto = new ArrayList<>();
			for (ApplicationVersionDao ar : av) {
				ApplicationVersionUpgradeDTO avd = new ApplicationVersionUpgradeDTO();
				ar.setStatus(status);
				if(status.equals(ApplicationVersionStatusEnum.DONE.name())) {
					ar.setUpgradedOn(new Date());
				}
				applicationVersionRepository.save(ar);
				avd = (ApplicationVersionUpgradeDTO) MapperUtil.getObjectMapping(av, avd);
				avdto.add(avd);
			}
			return avdto;

		} else {

			location = CommonUtil.getLocationCode();
			Set<FileWithVersion> dbVersionUpgradesAvailable = new TreeSet<>();
			Set<FileWithVersion> serviceVersionUpgradesAvailable = new TreeSet<>();
			Set<FileWithVersion> uiVersionUpgradesAvailable = new TreeSet<>();
//			Set<String> serviceVersionUpgradesAvailable = new HashSet<>();

			versionsInAvailableStatus = applicationVersionRepository.findByLocationCodeStatus(location,
					List.of(ApplicationVersionStatusEnum.AVAILABLE.name()), PageRequest.of(0, 20));

			List<ApplicationVersionDao> lastDoneRecordStatus = applicationVersionRepository.findByLocationCodeStatus(
					location, List.of(ApplicationVersionStatusEnum.DONE.name()), PageRequest.of(0, 20));

			checkVersionsInProgressStatusInPoss(location);

			if (!versionsInAvailableStatus.isEmpty()) {

				int dbVersionDiff = 1;
				int uiVersionDiff = 1;
				int servicesVersionDiff = 1;

				for (ApplicationVersionDao version : versionsInAvailableStatus) {
					if (!lastDoneRecordStatus.isEmpty()) {
						dbVersionDiff = compareVersions(version.getDatabaseVersion(),
								lastDoneRecordStatus.get(0).getDatabaseVersion());
						if (dbVersionDiff > 0) {
							dbVersionUpgradesAvailable.add(new FileWithVersion(version.getDatabaseVersion()));
						}
						uiVersionDiff = compareVersions(versionsInAvailableStatus.get(0).getPossUiVersion(),
								lastDoneRecordStatus.get(0).getPossUiVersion());
						if(uiVersionDiff>0){
							uiVersionUpgradesAvailable.add(new FileWithVersion(version.getPossUiVersion()));
						}
						servicesVersionDiff = compareVersions(version.getPossServiceVersion(),
								lastDoneRecordStatus.get(0).getPossServiceVersion());
						if (servicesVersionDiff > 0) {
							serviceVersionUpgradesAvailable.add(new FileWithVersion(version.getPossServiceVersion()));
//							serviceVersionUpgradesAvailable.add(version.getPossServiceVersion());
						}
					} else {
						dbVersionUpgradesAvailable.add(new FileWithVersion(version.getDatabaseVersion()));
						serviceVersionUpgradesAvailable.add(new FileWithVersion(version.getPossServiceVersion()));
						uiVersionUpgradesAvailable.add(new FileWithVersion(version.getPossUiVersion()));
					}
				}

				try {
					log.info("Started cleaning up self upgrade packag");
					cleanupSelfUpgradePackage(baseScriptsPath);

					String env = activeProfile.split("[.]")[0].toUpperCase();

					downloadDbScripts(baseScriptsPath, dbVersionDiff, env, dbVersionUpgradesAvailable);

					downloadAndExtractSelfUpgrade(baseScriptsPath);

					downloadUiUpgrades((TreeSet<FileWithVersion>) uiVersionUpgradesAvailable, baseScriptsPath, env, uiVersionDiff);

					upgradeServices(serviceVersionUpgradesAvailable, baseScriptsPath, basePossPath, servicesVersionDiff, env);

					executeVBSFiles(baseScriptsPath+"\\Self_Upgrade\\STOP-NGINX.vbs");

					updateEPOSSAndPOSSStatusToInProgress(versionsInAvailableStatus);

					upgradeUi((TreeSet<FileWithVersion>) uiVersionUpgradesAvailable, baseScriptsPath, basePossPath, baseWebAppPath, uiVersionDiff,
							env);

					try {
						updateFileContent(baseScriptsPath+"\\Self_Upgrade\\POSS-Upgrade.bat","DB_URL",dbUrl.replace(":", ","));
						updateFileContent(baseScriptsPath+"\\Self_Upgrade\\POSS-Upgrade.bat","USER_NAME",dbUserName);
						updateFileContent(baseScriptsPath+"\\Self_Upgrade\\POSS-Upgrade.bat","DB_PASSWORD",dbPassword);
						updateFileContent(baseScriptsPath+"\\Self_Upgrade\\POSS-Upgrade.bat","INSTALL_DRIVE",installDrive);
						updateFileContent(baseScriptsPath+"\\Self_Upgrade\\POSS-Upgrade.vbs","INSTALL_DRIVE",installDrive);
						updateFileContent(baseScriptsPath+"\\Self_Upgrade\\POSS-START.vbs","INSTALL_DRIVE",installDrive);
					}catch (IOException ex) {
						ex.printStackTrace();
						throw new IOException("bat and vbs file updates failed...!");
					}

					updateVersionToDone(versionsInAvailableStatus, baseScriptsPath);

					executeVBSFiles(baseScriptsPath+"\\Self_Upgrade\\POSS-UPGRADE.vbs");

					versionsInAvailableStatus.forEach(version -> {
						applicationVersionUpgradeDto.add(
								new ApplicationVersionUpgradeDTO(version.getId(), "Version upgraded succcessfully"));
					});
				} catch (IOException e1) {
					e1.printStackTrace();
				}
			} else {
				applicationVersionUpgradeDto.add(new ApplicationVersionUpgradeDTO(null, "No updates available"));
			}
		}
		return applicationVersionUpgradeDto;

	}


	private void downloadAndExtractSelfUpgrade(String baseScriptsPath) throws IOException {
		getObjectFromS3Bucket(BUCKET, "Self_Upgrade/Self_Upgrade.zip",
				baseScriptsPath + "\\Self_Upgrade.zip");
		log.info("self upgrade zip downloaded from S3");

		unzipFolder(Paths.get(baseScriptsPath + "\\Self_Upgrade.zip"),
				Paths.get(baseScriptsPath + "\\Self_Upgrade"));
	}


	private void downloadUiUpgrades(TreeSet<FileWithVersion> versionsInAvailableStatus, String baseScriptsPath,
									String env, int uiVersionDiff) {
		if (uiVersionDiff > 0) {
			log.info("Started downloading UI Zip from s3 :: {}",versionsInAvailableStatus.last().getFilenameWithVersion() + ".zip");

			ObjectMetadata uiObject = getObjectFromS3Bucket(BUCKET,
					"Self_Upgrade/UI_Upgrades/" + env + "/UI_Upgrade_"
							+ versionsInAvailableStatus.last().getFilenameWithVersion() + ".zip",
					baseScriptsPath + "\\Self_Upgrade\\UI_Upgrade_"
							+ versionsInAvailableStatus.last().getFilenameWithVersion() + ".zip");
			if (uiObject == null) {
				throw new ServiceException("Specified object does not exist on S3", "ERR-VERSION-003");
			}

			log.info("Downloaded UI Zip from s3 :: {}",versionsInAvailableStatus.last().getFilenameWithVersion() + ".zip");
		}
	}


	private void updateVersionToDone(List<ApplicationVersionDao> versionsInAvailableStatus, String baseScriptsPath)
			throws IOException {
		try (FileWriter fileWriter = new FileWriter(
				new File(baseScriptsPath + "\\Self_Upgrade\\DB_Upgrade\\db_upgrade_update_to_done.sql"),
				true)) {
			String ids = versionsInAvailableStatus.stream().map(version -> "'" + version.getId() + "'")
					.collect(Collectors.joining(","));
			fileWriter.write(
					"update datasync.dbo.application_version set status='DONE',upgraded_on=GETDATE() where id in ("
							+ ids + ")");
		}
	}

	private void checkVersionsInProgressStatusInPoss(String location) {
		List<ApplicationVersionDao> versionsInProgressStatus;
		versionsInProgressStatus = applicationVersionRepository.findByLocationCodeStatus(location,
				List.of(ApplicationVersionStatusEnum.INPROGRESS.name()), PageRequest.of(0, 20));

		List<ApplicationVersionDao> versionsUpgradingForMoreThanHour = versionsInProgressStatus.stream()
				.filter(version -> {
					long time_difference = new Date().getTime() - version.getLastModifiedDate().getTime();
					long hours_difference = (time_difference / (1000 * 60 * 60)) % 24;
					return hours_difference >= 1;
				}).collect(Collectors.toList());

		if (!versionsInProgressStatus.isEmpty() && !versionsUpgradingForMoreThanHour.isEmpty()) {
			throw new ServiceException("Upgrade is in progress for more than 1 hour. Please check the status of update",
					"ERR-VERSION-002");
		}

		if (!versionsInProgressStatus.isEmpty() && versionsUpgradingForMoreThanHour.isEmpty()) {
			throw new ServiceException("Upgrade is still in progress", "ERR-VERSION-001");
		}
	}

	private void cleanupSelfUpgradePackage(String baseScriptsPath) {
		try {
			FileUtils.cleanDirectory(new File(baseScriptsPath + "\\Self_Upgrade"));
			FileUtils.forceDelete(new File(baseScriptsPath + "\\Self_Upgrade.zip"));
		} catch (IOException | IllegalArgumentException e) {
			log.info(baseScriptsPath + "\\Self_Upgrade or " + baseScriptsPath + "\\Self_Upgrade.zip does not exist!!");
			e.printStackTrace();
		}
	}

	private void upgradeServices(Set<FileWithVersion> versionsInAvailableStatus, String baseScriptsPath,
								 String basePossPath, int servicesVersionDiff, String env) throws FileNotFoundException, IOException {
		if (servicesVersionDiff > 0) {

			List<File> servicesToBackup = listOfPathsFromFilePaths(basePossPath + "\\poss-services", listOfServices);

			log.info("Started zipping services at path :: {}",servicesToBackup);
			zip(servicesToBackup, basePossPath + "\\poss-services\\service-backup.zip");
			log.info("Completed zipping files at path:: {}",basePossPath + "\\poss-services\\service-backup.zip");

			for (FileWithVersion version : versionsInAvailableStatus) {

				log.info("Downloading services Zip from s3 :: {}",version.getFilenameWithVersion() + ".zip");
				ObjectMetadata serviceObject = getObjectFromS3Bucket(BUCKET,
						"Self_Upgrade/Services_Upgrades/" + env + "/Services_Upgrade_" + version.getFilenameWithVersion()
								+ ".zip",
						baseScriptsPath + "\\Self_Upgrade\\Services_Upgrade_" + version.getFilenameWithVersion()
								+ ".zip");

				if (serviceObject == null) {
					throw new ServiceException("Specified object does not exist on S3", "ERR-VERSION-003");
				}
				log.info("Downloaded services Zip from s3 :: {}",version.getFilenameWithVersion() + ".zip");

/*				log.info("Updating {} file with vbs commands for service extraction", baseScriptsPath+"\\Self_Upgrade\\POSS-Upgrade.vbs");

				List<String> lines=FileUtils.readLines(new File(baseScriptsPath+"\\Self_Upgrade\\POSS-Upgrade.vbs"));
				lines.set(12, lines.get(12)+"\r\nWriteLog INFO, \"Extracting service version upgrade from Services_Upgrade_"+version.getFilenameWithVersion()+".zip\"");
				lines.set(12, lines.get(12)+"\r\nExtract \"INSTALL_DRIVETitan\\Scripts\\Self_Upgrade\\Services_Upgrade_"+version.getFilenameWithVersion()+".zip\", \"INSTALL_DRIVETitan\\POSS\\poss-services\"");
				lines.set(12, lines.get(12)+"\r\nWriteLog INFO, \"Extracted service version upgrade from Services_Upgrade_"+version.getFilenameWithVersion()+".zip\"\r\n");
				String joinedString=lines.stream().collect(Collectors.joining("\r\n"));
				FileUtils.writeStringToFile(new File(baseScriptsPath+"\\Self_Upgrade\\POSS-Upgrade.vbs"), joinedString);

				log.info("Updated {} file with vbs commands for service extraction", baseScriptsPath+"\\Self_Upgrade\\POSS-Upgrade.vbs");*/
			}

			versionsInAvailableStatus.stream().sorted(Comparator.reverseOrder()).forEach(version->{
				log.info("Updating {} file with vbs commands for service extraction", baseScriptsPath+"\\Self_Upgrade\\POSS-Upgrade.vbs");

				try {
					List<String> lines = FileUtils.readLines(new File(baseScriptsPath+"\\Self_Upgrade\\POSS-Upgrade.vbs"));
					lines.set(12, lines.get(12)+"\r\nWriteLog INFO, \"Extracting service version upgrade from Services_Upgrade_"+version.getFilenameWithVersion()+".zip\"");
					lines.set(12, lines.get(12)+"\r\nExtract \"INSTALL_DRIVETitan\\Scripts\\Self_Upgrade\\Services_Upgrade_"+version.getFilenameWithVersion()+".zip\", \"INSTALL_DRIVETitan\\POSS\\poss-services\"");
					lines.set(12, lines.get(12)+"\r\nWriteLog INFO, \"Extracted service version upgrade from Services_Upgrade_"+version.getFilenameWithVersion()+".zip\"\r\n");
					String joinedString=lines.stream().collect(Collectors.joining("\r\n"));
					FileUtils.writeStringToFile(new File(baseScriptsPath+"\\Self_Upgrade\\POSS-Upgrade.vbs"), joinedString);

					log.info("Updated {} file with vbs commands for service extraction", baseScriptsPath+"\\Self_Upgrade\\POSS-Upgrade.vbs");
				} catch (IOException e) {
					throw new RuntimeException("Unable to update file "+baseScriptsPath+"\\Self_Upgrade\\POSS-Upgrade.vbs"+" with VBS commands ");
				}
			});

		}
	}

	private void upgradeUi(TreeSet<FileWithVersion> versionsInAvailableStatus, String baseScriptsPath,
						   String basePossPath, String baseWebAppPath, int uiVersionDiff, String env)
			throws FileNotFoundException, IOException {
		if (uiVersionDiff > 0) {

			List<File> webAppToBackup = listOfPathsFromFilePaths(basePossPath, List.of(baseWebAppPath));

			log.info("Started zipping files at path :: {}",webAppToBackup);
			zip(webAppToBackup, basePossPath + "\\poss-webapp1\\webapp-backup.zip");
			log.info("Completed zipping files at path:: {}",webAppToBackup);

			try {
				FileUtils.cleanDirectory(new File(basePossPath + "\\poss-webapp1\\poss"));
			} catch (IOException e) {
				log.error("Unable to clean directory :: " + basePossPath + "\\poss-webapp1\\poss");
			}

//			downloadUiUpgrades(versionsInAvailableStatus, baseScriptsPath, env);
			log.info("Started unzipping file :: {} at path {}",baseScriptsPath + "\\Self_Upgrade\\UI_Upgrade_"
					+ versionsInAvailableStatus.last().getFilenameWithVersion() + ".zip", basePossPath + "\\poss-webapp1");
			unzipFolder(
					Paths.get(baseScriptsPath + "\\Self_Upgrade\\UI_Upgrade_"
							+ versionsInAvailableStatus.last().getFilenameWithVersion() + ".zip"),
					Paths.get(basePossPath + "\\poss-webapp1"));
			log.info("Completed unzipping file :: {} at path {}",baseScriptsPath + "\\Self_Upgrade\\UI_Upgrade_"
					+ versionsInAvailableStatus.last().getFilenameWithVersion() + ".zip", basePossPath + "\\poss-webapp1");

			log.info("UI update completed successfully...!!!");
		}
	}

	private void downloadDbScripts(String baseScriptsPath, int dbVersionDiff, String env,
								   Set<FileWithVersion> dbVersionUpgradesAvailable) throws IOException {
		String finalDbScriptFile=baseScriptsPath + "\\Self_Upgrade\\DB_Upgrade\\DB_Upgrade.sql";
		log.info("Downloading DB Scripts from S3");
		if (dbVersionDiff > 0) {
			for (FileWithVersion version : dbVersionUpgradesAvailable) {

				String currentSqlScriptPath=baseScriptsPath + "\\Self_Upgrade\\DB_Upgrade\\DB_Upgrade_"+version.getFilenameWithVersion()+"\\DB_Upgrade\\"+"DB_Upgrade_"+version.getFilenameWithVersion()+".sql";

				ObjectMetadata dbObject = getObjectFromS3Bucket(BUCKET,
						"Self_Upgrade/DB_Upgrades/" + env + "/DB_Upgrade_" + version.getFilenameWithVersion() + ".zip",
						baseScriptsPath + "\\Self_Upgrade\\DB_Upgrade\\DB_Upgrade_" + version.getFilenameWithVersion() + ".zip");

				if (dbObject == null) {
					throw new ServiceException("Specified object does not exist on S3", "ERR-VERSION-003");
				}

				unzipFolder(Paths.get(baseScriptsPath + "\\Self_Upgrade\\DB_Upgrade\\DB_Upgrade_" + version.getFilenameWithVersion() + ".zip"),
						Paths.get(baseScriptsPath + "\\Self_Upgrade\\DB_Upgrade\\DB_Upgrade_"+ version.getFilenameWithVersion()));

//				appendFiles(finalDbScriptFile, currentSqlScriptPath);

			}

			List<String> files = findFiles(Paths.get(baseScriptsPath + "\\Self_Upgrade\\DB_Upgrade"), "sql");
			files.forEach(file->{
				try {
					appendFiles(finalDbScriptFile, file);
				} catch (IOException e) {
					log.error("Unable to append file content");
					e.printStackTrace();
				}
			});

		}
		log.info("Downloading DB Scripts from S3 completed...!!!");
	}

	private void updateEPOSSAndPOSSStatusToInProgress(List<ApplicationVersionDao> versionsInAvailableStatus) {
		Optional.ofNullable(versionsInAvailableStatus).ifPresent(versionsWithAvailableStatus -> {

			List<String> ids = versionsWithAvailableStatus.stream().map(version -> version.getReferenceId())
					.collect(Collectors.toList());

			log.info("Calling EPOSS to update status for ids {} to INPROGRESS", ids);
			try {
				epossCallService.callEposs(HttpMethod.PUT,
						APPLICATION_VERSION_BASE_URL + String.join(",", ids) + "/" + ApplicationVersionStatusEnum.INPROGRESS.name(),
						null, null, ListResponse.class);
			} catch (RuntimeException ex) {
				log.error("Eposs datasync service call failed");
				ex.printStackTrace();
			}
			versionsWithAvailableStatus
					.forEach(version -> version.setStatus(ApplicationVersionStatusEnum.INPROGRESS.name()));
			applicationVersionRepository.saveAll(versionsInAvailableStatus);
		});
		log.info("Updated POSS and EPOSS status to InProgress...!!");
	}

	private List<File> listOfPathsFromFilePaths(String basePath, List<String> filePaths) {
		List<File> listOfFiles = new ArrayList<>();
		filePaths.forEach(filePath -> {
			listOfFiles.add(new File(basePath + "\\" + filePath));
		});
		return listOfFiles;
	}

	private ObjectMetadata getObjectFromS3Bucket(String bucket, String key, String locationToSave) {
		return s3client.getObject(new GetObjectRequest(bucket, key), new File(locationToSave));
	}

	private static void unzipFolder(Path source, Path target) throws IOException {
		try (ZipInputStream zis = new ZipInputStream(new FileInputStream(source.toFile()))) {
			ZipEntry zipEntry = zis.getNextEntry();
			while (zipEntry != null) {
				boolean isDirectory = false;
				if (zipEntry.getName().endsWith("/")) {
					isDirectory = true;
				}
				Path newPath = zipSlipProtect(zipEntry, target);
				if (isDirectory) {
					Files.createDirectories(newPath);
				} else {
					if (newPath.getParent() != null) {
						if (Files.notExists(newPath.getParent())) {
							Files.createDirectories(newPath.getParent());
						}
					}
					Files.copy(zis, newPath, StandardCopyOption.REPLACE_EXISTING);
				}
				zipEntry = zis.getNextEntry();
			}
			zis.closeEntry();
		}
	}

	public static Path zipSlipProtect(ZipEntry zipEntry, Path targetDir) throws IOException {
		Path targetDirResolved = targetDir.resolve(zipEntry.getName());
		Path normalizePath = targetDirResolved.normalize();
		if (!normalizePath.startsWith(targetDir)) {
			throw new IOException("Bad zip entry: " + zipEntry.getName());
		}
		return normalizePath;
	}

	private int compareVersions(String ver1, String ver2) {

		int[] versionArr1 = convertVersionStringToArray(ver1);
		int[] versionArr2 = convertVersionStringToArray(ver2);

		Version version1 = new Version(versionArr1[0], versionArr1[1], versionArr1[2], null, null, null);
		Version version2 = new Version(versionArr2[0], versionArr2[1], versionArr2[2], null, null, null);

		return version1.compareTo(version2);
	}

	private String returnDriveForPath(String path) {
		File[] drives = File.listRoots();
		for (int i = 0; i < drives.length; i++) {
			Path pathOfUpgradePowershellPath = Path.of(drives[i].toString(), path);
			if (Files.exists(pathOfUpgradePowershellPath)) {
				return drives[i].toString();
			}
		}
		return "";
	}

	private int[] convertVersionStringToArray(String version) {
		String[] versionStr = version.split("[.]");
		int[] versionArray = new int[versionStr.length];

		for (int i = 0; i < versionStr.length; i++) {
			versionArray[i] = Integer.parseInt(versionStr[i]);
		}
		return versionArray;
	}

	@Override
	public void deleteAppVersion(String id) {
		applicationVersionRepository.deleteById(id);
	}

	@Override
	public List<AppVersionList> listAppVersion() {

		List<AppVersionList> appVersionList = new ArrayList<>();
		Set<String> possUiVersion = new HashSet<>();
		Set<String> epossUiVersion = new HashSet<>();
		Set<String> dbVersion = new HashSet<>();
		Set<String> possServiceVersion = new HashSet<>();

		List<ApplicationVersionDao> appVersions = applicationVersionRepository.listDistinctVersions();
		for (ApplicationVersionDao a : appVersions) {
			if (a.getPossUiVersion() != null) {
				possUiVersion.add(a.getPossUiVersion());
			}
			/*
			 * if (a.getEpossUiVersion() != null) {
			 * epossUiVersion.add(a.getEpossUiVersion()); }
			 */
			if (a.getDatabaseVersion() != null) {
				dbVersion.add(a.getDatabaseVersion());
			}
			if (a.getPossServiceVersion() != null) {
				possServiceVersion.add(a.getPossServiceVersion());
			}
		}

		appVersionList.add(new AppVersionList("possUiVersion", possUiVersion));
		appVersionList.add(new AppVersionList("epossUiVersion", epossUiVersion));
		appVersionList.add(new AppVersionList("dbVersion", dbVersion));
		appVersionList.add(new AppVersionList("possServiceVersion", possServiceVersion));

		return appVersionList;
	}

	@Override
	public void publishAppVersion() {
		// TODO Auto-generated method stub

	}

	public void zip(List<File> listFiles, String destZipFile) throws FileNotFoundException, IOException {
		ZipOutputStream zos = new ZipOutputStream(new FileOutputStream(destZipFile));
		for (File file : listFiles) {
			if (file.isDirectory()) {
				zipDirectory(file, file.getName(), zos);
			} else {
				zipFile(file, zos);
			}
		}
		zos.flush();
		zos.close();
		System.gc();
	}

	private void zipDirectory(File folder, String parentFolder, ZipOutputStream zos)
			throws FileNotFoundException, IOException {
		for (File file : folder.listFiles()) {
			if (file.isDirectory()) {
				zipDirectory(file, parentFolder + "/" + file.getName(), zos);
				continue;
			}
			zos.putNextEntry(new ZipEntry(parentFolder + "/" + file.getName()));
			BufferedInputStream bis = new BufferedInputStream(new FileInputStream(file));
			long bytesRead = 0;
			byte[] bytesIn = new byte[BUFFER_SIZE];
			int read = 0;
			while ((read = bis.read(bytesIn)) != -1) {
				zos.write(bytesIn, 0, read);
				bytesRead += read;
			}
			zos.closeEntry();
		}
	}

	private void zipFile(File file, ZipOutputStream zos) throws FileNotFoundException, IOException {
		zos.putNextEntry(new ZipEntry(file.getName()));
		BufferedInputStream bis = new BufferedInputStream(new FileInputStream(file));
		long bytesRead = 0;
		byte[] bytesIn = new byte[BUFFER_SIZE];
		int read = 0;
		while ((read = bis.read(bytesIn)) != -1) {
			zos.write(bytesIn, 0, read);
			bytesRead += read;
		}
		bis.close();
		zos.closeEntry();
	}


	public static void appendFiles(String targetFile, String sourceFile) throws IOException {
		try {
			BufferedWriter out = new BufferedWriter(new FileWriter(targetFile, true));
			BufferedReader in = new BufferedReader(new FileReader(sourceFile));
			String str;
			while ((str = in.readLine()) != null) {
				out.write(str);
				out.newLine();
			}
			in.close();
			out.close();
		} catch (IOException e) {
		}
	}

	public static List<String> findFiles(Path path, String fileExtension)
			throws IOException {

		if (!Files.isDirectory(path)) {
			throw new IllegalArgumentException("Path must be a directory!");
		}

		List<String> result;

		try (Stream<Path> walk = Files.walk(path).sorted(Comparator.comparingLong(p->p.toFile().lastModified()))) {
			result = walk
					.filter(p -> !Files.isDirectory(p))
					.map(p -> p.toString().toLowerCase())
					.filter(f -> f.endsWith(fileExtension))
					.collect(Collectors.toList());
		}
		return result;
	}

	private void updateFileContent(String filePath,String text,String textToReplace) throws IOException {
		File textFile = new File(filePath);
		String data = FileUtils.readFileToString(textFile);
		data = data.replace(text, textToReplace);
		FileUtils.writeStringToFile(textFile, data);
	}

	private void executeVBSFiles(String vbsFilePath) {
		log.info("executing vb script at path :: {}", vbsFilePath);
		try {
			Process p1 = Runtime.getRuntime().exec( "wscript "+vbsFilePath);
			InputStream is = p1.getInputStream();
			int i = 0;
			while( (i = is.read() ) != -1) {
				System.out.print((char)i);
			}
			log.info("executed vb script at path :: {} successfully...!!!", vbsFilePath);
		} catch(IOException ioException) {
			log.info("Unable to execute vbs script {}");
			System.out.println(ioException.getMessage() );
		}
	}

}
