GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.users TO nutriuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.personal_data TO nutriuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.administrators TO nutriuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.sellers TO nutriuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.clients TO nutriuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.access_levels TO nutriuser;

INSERT INTO public.users (active, blocked, login_attempts, verified, last_failed_login, last_successful_login, version,
                          id, password, last_failed_login_ip, last_successful_login_ip)
VALUES (true, false, 0, true, null, null, 0, '1d927459-9b65-4b6b-bff2-9f95fd227d9e',
        '$2a$12$bOPVAvWOC2f9gJoF37IeE.N9Ij15GfWeVlvHzDPTOJk66NimJMJ4.', 'lastFailedLoginIp', 'lastSuccessfulLoginIp');
INSERT INTO public.personal_data (user_id, email, first_name, last_name)
VALUES ('1d927459-9b65-4b6b-bff2-9f95fd227d9e', 'email@admin.com', 'firstName', 'lastName');
INSERT INTO public.access_levels (version, id, user_id, level)
VALUES (0, 'ea3f6fde-4e67-4b95-823c-6c0710552b22', '1d927459-9b65-4b6b-bff2-9f95fd227d9e', 'ADMINISTRATOR');
INSERT INTO public.administrators (id)
VALUES ('ea3f6fde-4e67-4b95-823c-6c0710552b22');

INSERT INTO public.users (active, blocked, login_attempts, verified, last_failed_login, last_successful_login, version,
                          id, password, last_failed_login_ip, last_successful_login_ip)
VALUES (true, false, 0, true, null, null, 0, 'e646e3dc-9170-4abb-b0b7-82b507324271',
        '$2a$12$bOPVAvWOC2f9gJoF37IeE.N9Ij15GfWeVlvHzDPTOJk66NimJMJ4.', 'lastFailedLoginIp', 'lastSuccessfulLoginIp');
INSERT INTO public.personal_data (user_id, email, first_name, last_name)
VALUES ('e646e3dc-9170-4abb-b0b7-82b507324271', 'email@client.com', 'firstName', 'lastName');
INSERT INTO public.access_levels (version, id, user_id, level)
VALUES (0, '6f15b280-581f-423e-a0ff-c02cce1c3350', 'e646e3dc-9170-4abb-b0b7-82b507324271', 'CLIENT');
INSERT INTO public.clients (id)
VALUES ('6f15b280-581f-423e-a0ff-c02cce1c3350');


INSERT INTO public.users (active, blocked, login_attempts, verified, last_failed_login, last_successful_login, version,
                          id, password, last_failed_login_ip, last_successful_login_ip)
VALUES (true, false, 0, true, null, null, 0, '9f9e4e2d-52f1-4d53-b606-095884e69d72',
        '$2a$12$bOPVAvWOC2f9gJoF37IeE.N9Ij15GfWeVlvHzDPTOJk66NimJMJ4.', 'lastFailedLoginIp', 'lastSuccessfulLoginIp');
INSERT INTO public.personal_data (user_id, email, first_name, last_name)
VALUES ('9f9e4e2d-52f1-4d53-b606-095884e69d72', 'email@seller.com', 'firstName', 'lastName');
INSERT INTO public.access_levels (version, id, user_id, level)
VALUES (0, 'f5fcf708-a416-45fa-b96b-0bd9eac29fac', '9f9e4e2d-52f1-4d53-b606-095884e69d72', 'SELLER');
INSERT INTO public.sellers (id)
VALUES ('f5fcf708-a416-45fa-b96b-0bd9eac29fac');

