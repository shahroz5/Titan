/* delete data from all the tables */



DELETE FROM rule_location_mapping;
DELETE FROM rule_product_mapping;
DELETE FROM rule_metadata;
DELETE FROM rule_master;

DELETE FROM discount_slab_details;
DELETE FROM discount_location_mapping;
DELETE FROM discount_product_group_mapping;
DELETE FROM discount_master;

DELETE FROM gep_config_master;
DELETE FROM gep_config_details;
DELETE FROM gep_config_location_mapping;
DELETE FROM gep_config_product_mapping;
DELETE FROM gep_config_theme_mapping;




insert into rule_master(rule_id,rule_type,description,rule_details,is_active,created_by,created_date,last_modified_by,last_modified_date) values(1,'IBT_CONFIGURATIONS','IBTCONFIG','{"type":"IBT_CONFIGURATIONS","data":{"maxProductsPerStn":55,"maxReqPerMonth":450,"maxValPerStn":66,"validRequestTime":77}}',1,'admin','2020-04-07 18:56:15.000','admin','2020-04-07 18:56:15.000');

insert into rule_metadata(rule_type,description,rule_group,product_group_mapping,product_category_mapping,product_level_value,range_mapping,location_mapping,header_level_value,org_code,created_by,created_date,last_modified_by,last_modified_date,rule_id) 
values('IBT_CONFIGURATIONS','IBT_CONFIGURATIONS','Inventory',1,1,0,1,1,1,'TIT','admin','2020-04-07 18:56:15.000','admin','2020-04-07 18:56:15.000',1);


insert into rule_location_mapping(id,rule_id,location_code,created_by,created_date,last_modified_by,last_modified_date,rule_type) values
(NEWID(),1,'BLR','admin','2020-04-07 18:56:15.000','admin','2020-04-07 18:56:15.000','IBT_CONFIGURATIONS');


insert into rule_product_mapping(id,rule_id,product_group_code,created_by,created_date,last_modified_by,last_modified_date,rule_type,product_category_code,field_details) values
(NEWID(),1,'Diamond','admin','2020-04-07 18:56:15.000','admin','2020-04-07 18:56:15.000','IBT_CONFIGURATIONS','Bangle',null);


insert into discount_master(discount_code,description,discount_details,start_date,end_date,discount_type,preview_start_date,preview_end_date,approved_by,is_active,created_by,created_date,last_modified_by,last_modified_date) values 
('00000001','test','{"test":23}','2020-01-28 15:57:41.891','2020-01-28 15:57:41.891','test','2020-01-28 15:57:41.891','2020-01-28 15:57:41.891','admin','1','commercial','2020-03-06 13:06:31.267','commercial','2020-03-06 13:06:31.267'),
('00000002','test','{"test":13}','2020-01-28 15:57:41.891','2020-01-28 15:57:41.891','test','2020-01-28 15:57:41.891','2020-01-28 15:57:41.891','admin','1','commercial','2020-03-06 13:06:31.267','commercial','2020-03-06 13:06:31.267'),
('00009999','test','{"test":73}','2020-01-28 15:57:41.891','2020-01-28 15:57:41.891','test','2020-01-28 15:57:41.891','2020-01-28 15:57:41.891','admin','1','commercial','2020-03-06 13:06:31.267','commercial','2020-03-06 13:06:31.267');

 
insert into discount_location_mapping(id,discount_code,location_code,start_date,end_date,is_active,created_by,created_date,last_modified_by,last_modified_date) values 
(NEWID(),'00000001','MUM','2020-03-02','2020-03-02','1','commercial','2020-03-02 13:18:02.963','commercial','2020-03-02 13:18:02.963'),
(NEWID(),'00000002','MUM','2020-03-02','2020-03-02','1','commercial','2020-03-02 13:18:02.963','commercial','2020-03-02 13:18:02.963'),
(NEWID(),'00009999','MUM','2020-03-02','2020-03-02','1','commercial','2020-03-02 13:18:02.963','commercial','2020-03-02 13:18:02.963');

 
insert into	discount_product_group_mapping(id,discount_code,product_group_code,is_active,created_by,created_date,last_modified_by,last_modified_date) values
(NEWID(),'00009999','KOL','1','commercial','2020-03-03 11:45:27.543','commercial','2020-03-03 11:45:27.543'),
(NEWID(),'00000002','URB','1','admin','2020-03-03 11:45:27.543','admin','2020-03-03 11:45:27.543'),
(NEWID(),'00009999','URB','1','commercial','2020-03-03 11:45:27.543','commercial','2020-03-03 11:45:27.543');

insert into range_master(id,from_range,to_range,range_type,is_active,created_by,created_date,last_modified_by,last_modified_date) values 
('54830379-C479-4167-89E0-0DD9EAA16F4B','0.000','50.010','GEP_PURITY','1','commercial',GETDATE(),'commercial',GETDATE()),
('ECEB3561-1ADE-4E45-88F9-6572F29CC39E','52.000','90.000','GEP_PURITY','1','commercial',GETDATE(),'commercial',GETDATE());

insert into gep_config_master(config_id,description,is_offer_enabled,offer_details,config_details,is_active,created_by,created_date,
last_modified_by,last_modified_date) values 
('421F47BD-95D9-4E31-ACD9-FA140735CD6A','test','1','{}','{}','1','commercial',GETDATE(),'commercial',GETDATE()),
('7BBAE918-0C39-4936-8654-E61FACA847C3','testing','1','{}','{}','1','commercial',GETDATE(),'commercial',GETDATE());


insert into gep_config_details(id,range_id,deduction_percent,scheme_percent,start_date,end_date,metal_type,item_type,created_by,created_date,last_modified_by,last_modified_date,config_id)
values(NEWID(),'421F47BD-95D9-4E31-ACD9-FA140735CD6A','60.00','45.00',GETDATE(),GETDATE(),'J','G','commercial',GETDATE(),'commercial',GETDATE(),'421F47BD-95D9-4E31-ACD9-FA140735CD6A'),
NEWID(),'421F47BD-95D9-4E31-ACD9-FA140735CD6A','60.00','45.00',GETDATE(),GETDATE(),'J','G','commercial',GETDATE(),'commercial',GETDATE(),'7BBAE918-0C39-4936-8654-E61FACA847C3');


insert into gep_config_location_mapping(id,config_id,location_code,created_by,created_date,last_modified_by,last_modified_date) values
('FF7FF148-1061-4249-AC3C-D56A520A80EF','421F47BD-95D9-4E31-ACD9-FA140735CD6A','URB','commercial',GETDATE(),'commercial',GETDATE()),
('BB98B8FF-A068-4419-91A6-A1DFA94A11EF','421F47BD-95D9-4E31-ACD9-FA140735CD6A','BGR','commercial',GETDATE(),'commercial',GETDATE());

insert into gep_config_product_mapping(id,config_id,product_group_code,percent_value,range_id,created_by,created_date,last_modified_by,last_modified_date) values
('542AC982-BFD5-46C8-9997-F540F653C2A0','421F47BD-95D9-4E31-ACD9-FA140735CD6A','71','45.000','commercial',GETDATE(),'commercial',GETDATE()),
('29BE17D2-E04C-41BA-A665-CF59412F142F','421F47BD-95D9-4E31-ACD9-FA140735CD6A','72','45.000','commercial',GETDATE(),'commercial',GETDATE());

insert into gep_config_theme_mapping(id,config_id,item_code,theme_code,is_excluded,created_by,created_date,last_modified_by,last_modified_date) values
('D3CC4531-739E-48CA-B50A-74E9D322A1E2','421F47BD-95D9-4E31-ACD9-FA140735CD6A','509132VA154110',null,'1','commercial',GETDATE(),'commercial',GETDATE());



