GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.user TO nutrimokuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.personal_data TO nutrimokuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.administrator TO nutrimokuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.client TO nutrimokuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.access_level TO nutrimokuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.token TO nutrimokuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.email_verification_token TO nutrimokuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.account_verification_token TO nutrimokuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.password_verification_token TO nutrimokuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.google_auth TO nutrimokuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.user_favourite_products TO nutrimokuser;
GRANT SELECT ON TABLE public.user TO nutrimowuser;
GRANT SELECT, UPDATE ON TABLE public.access_level TO nutrimowuser;
GRANT SELECT ON TABLE public.personal_data TO nutrimowuser;
GRANT SELECT, UPDATE ON TABLE public.client TO nutrimowuser;
GRANT SELECT ON TABLE public.google_auth TO nutrimowuser;
GRANT SELECT ON TABLE public.addition TO nutrimowuser;
GRANT SELECT ON TABLE public.access_level TO nutrimowuser;
GRANT SELECT ON TABLE public.composition TO nutrimowuser;
GRANT SELECT ON TABLE public.composition_addition TO nutrimowuser;
GRANT SELECT ON TABLE public.composition_ingredient TO nutrimowuser;
GRANT SELECT ON TABLE public.flavour TO nutrimowuser;
GRANT SELECT ON TABLE public.ingredient TO nutrimowuser;
GRANT SELECT ON TABLE public.label TO nutrimowuser;
GRANT SELECT ON TABLE public.nutritional_index TO nutrimowuser;
GRANT SELECT ON TABLE public.nutritional_value TO nutrimowuser;
GRANT SELECT ON TABLE public.nutritional_value_group TO nutrimowuser;
GRANT SELECT ON TABLE public.nutritional_value_name TO nutrimowuser;
GRANT SELECT ON TABLE public.package_type TO nutrimowuser;
GRANT SELECT ON TABLE public.personal_data TO nutrimowuser;
GRANT SELECT ON TABLE public.portion TO nutrimowuser;
GRANT SELECT ON TABLE public.producer TO nutrimowuser;
GRANT SELECT ON TABLE public.product TO nutrimowuser;
GRANT SELECT ON TABLE public.product_index TO nutrimowuser;
GRANT SELECT ON TABLE public.product_nutritional_index TO nutrimowuser;
GRANT SELECT ON TABLE public.product_nutritional_value TO nutrimowuser;
GRANT SELECT ON TABLE public.product_product_index TO nutrimowuser;
GRANT SELECT ON TABLE public.product_rating TO nutrimowuser;
GRANT SELECT ON TABLE public.rating TO nutrimowuser;
GRANT SELECT ON TABLE public.unit TO nutrimowuser;
GRANT SELECT,UPDATE,DELETE,INSERT ON TABLE public.basket TO nutrimowuser;
GRANT SELECT,UPDATE,DELETE,INSERT ON TABLE public.basket_entry TO nutrimowuser;
GRANT SELECT ON TABLE public.allergen TO nutrimowuser;
GRANT SELECT ON TABLE public.label_allergen TO nutrimowuser;
GRANT SELECT,UPDATE,DELETE,INSERT ON TABLE public.user_favourite_products TO nutrimowuser;

INSERT INTO public.user (blocked, login_attempts, verified, last_failed_login, last_successful_login, version,
                          id, password, last_failed_login_ip, last_successful_login_ip, language, created_at)
VALUES ( false, 0, true, null, null, 0, '1d927459-9b65-4b6b-bff2-9f95fd227d9e',
        '$2a$12$bOPVAvWOC2f9gJoF37IeE.N9Ij15GfWeVlvHzDPTOJk66NimJMJ4.', null, null, 'PL', now());
INSERT INTO public.personal_data (user_id, email, first_name, last_name)
VALUES ('1d927459-9b65-4b6b-bff2-9f95fd227d9e', 'email@admin.com', 'Tomasz', 'Nowak');
INSERT INTO public.access_level (version, id, user_id, level, active)
VALUES (0, 'ea3f6fde-4e67-4b95-823c-6c0710552b22', '1d927459-9b65-4b6b-bff2-9f95fd227d9e', 'ADMINISTRATOR', true);
INSERT INTO public.administrator (id)
VALUES ('ea3f6fde-4e67-4b95-823c-6c0710552b22');

INSERT INTO public.user ( blocked, login_attempts, verified, last_failed_login, last_successful_login, version,
                          id, password, last_failed_login_ip, last_successful_login_ip, language, created_at)
VALUES ( false, 0, true, null, null, 0, 'e646e3dc-9170-4abb-b0b7-82b507324271',
        '$2a$12$bOPVAvWOC2f9gJoF37IeE.N9Ij15GfWeVlvHzDPTOJk66NimJMJ4.', null, null, 'PL', now());
INSERT INTO public.personal_data (user_id, email, first_name, last_name)
VALUES ('e646e3dc-9170-4abb-b0b7-82b507324271', 'email@client.com', 'Jan', 'Nowak');
INSERT INTO public.access_level (version, id, user_id, level, active)
VALUES (0, '6f15b280-581f-423e-a0ff-c02cce1c3350', 'e646e3dc-9170-4abb-b0b7-82b507324271', 'CLIENT', true);
INSERT INTO public.client (id)
VALUES ('6f15b280-581f-423e-a0ff-c02cce1c3350');

INSERT INTO public.user (blocked, login_attempts, verified, last_failed_login, last_successful_login, version, id, password, last_failed_login_ip, last_successful_login_ip, language, created_at)
VALUES
    (false, 0, true, null, null, 0, '3d8828d8-d5e2-4f9b-8a98-29f6e478f52a', '$2a$12$bOPVAvWOC2f9gJoF37IeE.N9Ij15GfWeVlvHzDPTOJk66NimJMJ4.', null, null, 'PL', now()),
    (false, 0, true, null, null, 0, 'a7aefe70-a68b-45e7-9252-e8e5fdc00555', '$2a$12$bOPVAvWOC2f9gJoF37IeE.N9Ij15GfWeVlvHzDPTOJk66NimJMJ4.', null, null, 'PL', now()),
    (false, 0, true, null, null, 0, 'e8c339e7-a777-4b7f-9307-783f1c209f24', '$2a$12$bOPVAvWOC2f9gJoF37IeE.N9Ij15GfWeVlvHzDPTOJk66NimJMJ4.', null, null, 'PL', now()),
    (false, 0, true, null, null, 0, '3fc3fc43-de1e-4c25-a2a4-c2ae24830146', '$2a$12$bOPVAvWOC2f9gJoF37IeE.N9Ij15GfWeVlvHzDPTOJk66NimJMJ4.', null, null, 'PL', now()),
    (false, 0, true, null, null, 0, 'e08ba8d6-33b9-400c-9ec5-3fdf08146bef', '$2a$12$bOPVAvWOC2f9gJoF37IeE.N9Ij15GfWeVlvHzDPTOJk66NimJMJ4.', null, null, 'PL', now()),
    (false, 0, true, null, null, 0, 'be39e9ac-15de-43bb-a662-acb0d2a597ea', '$2a$12$bOPVAvWOC2f9gJoF37IeE.N9Ij15GfWeVlvHzDPTOJk66NimJMJ4.', null, null, 'PL', now()),
    (false, 0, true, null, null, 0, 'c9e03146-2df3-4802-84e4-26bec69cf9e0', '$2a$12$bOPVAvWOC2f9gJoF37IeE.N9Ij15GfWeVlvHzDPTOJk66NimJMJ4.', null, null, 'PL', now()),
    (false, 0, true, null, null, 0, '49e65c8a-50de-46c9-8dc9-1a37783ac269', '$2a$12$bOPVAvWOC2f9gJoF37IeE.N9Ij15GfWeVlvHzDPTOJk66NimJMJ4.', null, null, 'PL', now()),
    (false, 0, true, null, null, 0, 'ad5866a1-132a-46fc-bdbe-585237997e30', '$2a$12$bOPVAvWOC2f9gJoF37IeE.N9Ij15GfWeVlvHzDPTOJk66NimJMJ4.', null, null, 'PL', now()),
    (false, 0, true, null, null, 0, 'd067f098-9905-428f-8c6e-4e0a5160989c', '$2a$12$bOPVAvWOC2f9gJoF37IeE.N9Ij15GfWeVlvHzDPTOJk66NimJMJ4.', null, null, 'PL', now());

INSERT INTO public.personal_data (user_id, email, first_name, last_name)
VALUES
    ('3d8828d8-d5e2-4f9b-8a98-29f6e478f52a', 'romuald.dziadura@email.com', 'Romuald', 'Dziadura'),
    ('a7aefe70-a68b-45e7-9252-e8e5fdc00555', 'jadwiga.sinicka@email.com', 'Jadwiga', 'Sinicka'),
    ('e8c339e7-a777-4b7f-9307-783f1c209f24', 'anita.paciorek@email.com', 'Anita', 'Paciorek'),
    ('3fc3fc43-de1e-4c25-a2a4-c2ae24830146', 'katarzyna.zabolotna@email.com', 'Katarzyna', 'Zabolotna'),
    ('e08ba8d6-33b9-400c-9ec5-3fdf08146bef', 'anastazja.federowicz@email.com', 'Anastazja', 'Federowicz'),
    ('be39e9ac-15de-43bb-a662-acb0d2a597ea', 'kornelia.misiarz@email.com', 'Kornelia', 'Misiarz'),
    ('c9e03146-2df3-4802-84e4-26bec69cf9e0', 'tobiasz.syty@email.com', 'Tobiasz', 'Syty'),
    ('49e65c8a-50de-46c9-8dc9-1a37783ac269', 'maria.wojcieszak@email.com', 'Maria', 'Wojcieszak'),
    ('ad5866a1-132a-46fc-bdbe-585237997e30', 'konrad.mrowka@email.com', 'Konrad', 'Mrówka'),
    ('d067f098-9905-428f-8c6e-4e0a5160989c', 'bronislawa.dziedzina@email.com', 'Bronisława', 'Dziedzina');

INSERT INTO public.access_level (version, id, user_id, level, active)
VALUES
    (0, '44f61004-bf45-413d-9e60-a151d0d6a352', '3d8828d8-d5e2-4f9b-8a98-29f6e478f52a', 'CLIENT', true),
    (0, '752cc5c8-6b5f-4d12-94d9-01f1561c64f6', 'a7aefe70-a68b-45e7-9252-e8e5fdc00555', 'CLIENT', true),
    (0, 'b1015c08-d4b0-4de6-98eb-b390a9068c35', 'e8c339e7-a777-4b7f-9307-783f1c209f24', 'CLIENT', true),
    (0, '9e6858a9-2a19-4969-aa0e-85c8894c03bb', '3fc3fc43-de1e-4c25-a2a4-c2ae24830146', 'CLIENT', true),
    (0, '7b8942a2-e49d-4aa4-8e20-977b1ff271d2', 'e08ba8d6-33b9-400c-9ec5-3fdf08146bef', 'CLIENT', true),
    (0, '9288e856-d6ac-483f-bc14-c42a287cc2c5', 'be39e9ac-15de-43bb-a662-acb0d2a597ea', 'CLIENT', true),
    (0, '409f297c-bb6a-4135-8145-9abdd063d671', 'c9e03146-2df3-4802-84e4-26bec69cf9e0', 'CLIENT', true),
    (0, 'ef6bb3bd-4efc-470b-a345-0cd4d28f18bf', '49e65c8a-50de-46c9-8dc9-1a37783ac269', 'CLIENT', true),
    (0, '378d5a4a-96e0-4566-b849-208192b8e312', 'ad5866a1-132a-46fc-bdbe-585237997e30', 'CLIENT', true),
    (0, 'b0bd4cda-e9ef-4b8b-8c22-3d56a19b28f0', 'd067f098-9905-428f-8c6e-4e0a5160989c', 'CLIENT', true);

INSERT INTO public.client (id)
VALUES
    ('44f61004-bf45-413d-9e60-a151d0d6a352'),
    ('752cc5c8-6b5f-4d12-94d9-01f1561c64f6'),
    ('b1015c08-d4b0-4de6-98eb-b390a9068c35'),
    ('9e6858a9-2a19-4969-aa0e-85c8894c03bb'),
    ('7b8942a2-e49d-4aa4-8e20-977b1ff271d2'),
    ('9288e856-d6ac-483f-bc14-c42a287cc2c5'),
    ('409f297c-bb6a-4135-8145-9abdd063d671'),
    ('ef6bb3bd-4efc-470b-a345-0cd4d28f18bf'),
    ('378d5a4a-96e0-4566-b849-208192b8e312'),
    ('b0bd4cda-e9ef-4b8b-8c22-3d56a19b28f0');

INSERT INTO public.basket (id, version, client_id, name, description, created_at)
VALUES
    ('ce917586-4a47-4d0b-a4db-211f9908fe3c', 0, '6f15b280-581f-423e-a0ff-c02cce1c3350', 'Koszyk1', 'Opis koszyka 1', now()),
    ('e60bb224-9151-4537-9657-bfd20ef33ebe', 0, '6f15b280-581f-423e-a0ff-c02cce1c3350', 'Koszyk2', 'Opis koszyka 2', now()),
    ('6f5ddb15-4e8b-40b6-b752-5c607f9be0a8', 0, '6f15b280-581f-423e-a0ff-c02cce1c3350', 'Koszyk3', 'Opis koszyka 3', now()),
    ('19b93846-3c5d-454d-b117-50ce25dd8fa2', 0, '6f15b280-581f-423e-a0ff-c02cce1c3350', 'Koszyk4', 'Opis koszyka 4', now()),
    ('7d89645a-9634-429c-b06a-325fb947c7dd', 0, '6f15b280-581f-423e-a0ff-c02cce1c3350', 'Koszyk5', 'Opis koszyka 5', now()),
    ('6cfd6014-222b-4ce0-bc3e-1cf4a114e40d', 0, '6f15b280-581f-423e-a0ff-c02cce1c3350', 'Koszyk6', 'Opis koszyka 6', now()),
    ('8d5873bf-f51d-406b-b77e-9ef3d9a9e10b', 0, '6f15b280-581f-423e-a0ff-c02cce1c3350', 'Koszyk7', 'Opis koszyka 7', now()),
    ('23ad8b0b-37c0-486f-958e-e802de0f00d7', 0, '6f15b280-581f-423e-a0ff-c02cce1c3350', 'Koszyk8', 'Opis koszyka 8', now()),
    ('d7c6af9a-3018-4055-b7a4-219613680de8', 0, '6f15b280-581f-423e-a0ff-c02cce1c3350', 'Koszyk9', 'Opis koszyka 9', now()),
    ('42e1f67f-7d00-4321-b2b8-ff15b66b18be', 0, '6f15b280-581f-423e-a0ff-c02cce1c3350', 'Koszyk10', 'Opis koszyka 10', now());


INSERT INTO public.basket_entry (id, version, basket_id, product_id, quantity)
VALUES
    ('f2b159c0-6f69-4433-8e93-0b15835d3b88', 0, 'ce917586-4a47-4d0b-a4db-211f9908fe3c', 'f29139a8-3b6f-4094-9426-7d562541dd38', 450),
    ('a32c0801-9849-4ba8-9b53-52bfd65612e0', 0, 'ce917586-4a47-4d0b-a4db-211f9908fe3c', '3b1b0c48-b79f-4119-bbd4-19f37fc7d69f', 400),
    ('e7906afd-055a-4b98-b2ab-fcf432394bae', 0, 'ce917586-4a47-4d0b-a4db-211f9908fe3c', '6c81be59-6d6f-407c-a684-a928d00980f1', 450),
    ('aa71929e-ffec-4cef-a3a7-6ae273fdcbdc', 0, 'ce917586-4a47-4d0b-a4db-211f9908fe3c', '33ef722b-b668-4724-8d75-4c82b0e36440', 350),
    ('32c9d403-b6bf-4059-90c5-1b8efb97b27c', 0, 'ce917586-4a47-4d0b-a4db-211f9908fe3c', '3d32db0b-ba48-4d40-a68a-afe603e7b436', 200),
    ('179080ba-40e3-454d-8fe8-01c5cb7f0ce7', 0, 'ce917586-4a47-4d0b-a4db-211f9908fe3c', '9b0c192a-ac96-4888-9e1d-da94bd3a655c', 100),
    ('bfca27ad-280e-4295-9700-bb3644945c8a', 0, 'e60bb224-9151-4537-9657-bfd20ef33ebe', 'f8cfc3fb-56e6-49f3-9776-ae03e4f30072', 200),
    ('d2417c30-09b3-4615-a64a-6df7c35bdef6', 0, 'e60bb224-9151-4537-9657-bfd20ef33ebe', 'be02c2be-f42a-43ef-ab7c-0d4bd46b5c64', 400),
    ('fa9a0953-56fa-45d3-b2ec-a96b7617c02c', 0, 'e60bb224-9151-4537-9657-bfd20ef33ebe', '66f5d699-7e43-4512-ba82-8473308cf474', 200),
    ('72d2b56e-0cd6-48db-9dcf-ca371d4c36b8', 0, 'e60bb224-9151-4537-9657-bfd20ef33ebe', 'eaf088b0-8eb2-43bf-8116-53b6c04950bd', 50),
    ('ed4aa4be-0d1d-45cf-9f2c-26aece5981e6', 0, 'e60bb224-9151-4537-9657-bfd20ef33ebe', '4936f359-e24b-4275-b0e9-6359000979d3', 70),
    ('ece4b311-c0ec-44ab-ab1f-97fd038ed927', 0, 'e60bb224-9151-4537-9657-bfd20ef33ebe', '292ba673-0e72-4ed5-88f3-9aef18045507', 50),
    ('0055dede-af3e-4fd4-aaa8-f042fe460d84', 0, '6f5ddb15-4e8b-40b6-b752-5c607f9be0a8', '8b72b0ae-07a5-4f40-adc3-bf8c97a1ef25', 100),
    ('f1ce0213-afcb-46e2-a049-d5da43ed0059', 0, '6f5ddb15-4e8b-40b6-b752-5c607f9be0a8', '1e2b4af5-5a6a-4239-80d5-22428cffab4a', 100),
    ('79a42a67-869a-41fe-a236-2844e851f2ad', 0, '6f5ddb15-4e8b-40b6-b752-5c607f9be0a8', 'd75cda81-ea16-4652-825c-a65f891bd657', 450),
    ('aed4ba57-9e22-4461-b8d1-7fae127d54e3', 0, '6f5ddb15-4e8b-40b6-b752-5c607f9be0a8', '03b16d62-aee4-41c1-83a7-6ceaf96d8da6', 20),
    ('22ebc181-6981-4e07-b27d-046283e2550e', 0, '6f5ddb15-4e8b-40b6-b752-5c607f9be0a8', 'be4f6d1e-0171-4dc6-9852-5de83dcdbe0f', 20),
    ('f7cdfef8-be3c-46a8-ab39-97018deb333b', 0, '19b93846-3c5d-454d-b117-50ce25dd8fa2', '6eb2bda1-bb74-4363-a436-70bc27d2f2fa', 30),
    ('b90dbfd5-8da2-4fdc-9b72-3b3d68e7d967', 0, '19b93846-3c5d-454d-b117-50ce25dd8fa2', '3df3d51b-44c4-4267-96b6-ed5feca789f0', 15),
    ('65c1dbed-6794-47d6-9b51-362dfb931954', 0, '19b93846-3c5d-454d-b117-50ce25dd8fa2', 'ac172c4e-fcdd-4ee1-813a-075adf57b402', 45),
    ('fd79f490-81b5-4188-91d9-16934fe329db', 0, '19b93846-3c5d-454d-b117-50ce25dd8fa2', 'c5258b6b-dc60-45d0-9fbe-697266ba927b', 35),
    ('51273359-95b5-4ed0-88ee-7863ae41e6a3', 0, '19b93846-3c5d-454d-b117-50ce25dd8fa2', 'd21fa160-3ad0-47f9-8cdc-5fd853b2941a', 200),
    ('dd7c0282-a117-4e2b-80ab-c9d279d7b1ab', 0, '19b93846-3c5d-454d-b117-50ce25dd8fa2', 'ef5a151e-75e8-4b3b-9dd1-1cb0af9b55c0', 1),
    ('1c5aa46b-3a0e-41af-a64d-4ec1910094d1', 0, '7d89645a-9634-429c-b06a-325fb947c7dd', '53f75855-6149-4ec0-8174-35257c4a40bb', 0.25),
    ('ce5509ec-8a06-4406-b21f-fe40d11da14e', 0, '7d89645a-9634-429c-b06a-325fb947c7dd', 'e24d8ec4-f4e7-4696-8827-0d7abd35dfcf', 400),
    ('72d13d6b-329a-4d2c-9ad3-810c5c26d407', 0, '7d89645a-9634-429c-b06a-325fb947c7dd', 'df27de25-93eb-4f95-87df-d8f32d674bee', 10),
    ('9b0f5c82-2111-4380-8e61-fe68bac2b337', 0, '7d89645a-9634-429c-b06a-325fb947c7dd', 'c8bb0507-669a-4592-a5b5-9f034ed8676e', 20),
    ('5db4cd90-5e81-441f-a5ab-9841e6661509', 0, '7d89645a-9634-429c-b06a-325fb947c7dd', '3a1b9fb6-543f-4aa6-b28e-ec0a92526a90', 15),
    ('1e9169c6-01bf-42dd-9d68-abaf1b08e56d', 0, '7d89645a-9634-429c-b06a-325fb947c7dd', 'e7369e1d-1bfa-4dbd-9bf6-edacd9ebb2aa', 10),
    ('ad7939f6-c693-424c-82c6-d1c082949ff6', 0, '6cfd6014-222b-4ce0-bc3e-1cf4a114e40d', 'a34eb520-a5e2-41b6-b92d-4e58fb63c4dc', 45),
    ('279152bc-38fb-4335-823b-b8b1d3523f35', 0, '6cfd6014-222b-4ce0-bc3e-1cf4a114e40d', '7a6de410-7030-43cb-a77e-92196168e4f0', 200),
    ('3b6afcd4-bf85-42cf-ba2c-875a7df032b4', 0, '6cfd6014-222b-4ce0-bc3e-1cf4a114e40d', 'aa1c7ab3-cc28-423f-b7db-29fa5e852290', 100),
    ('009e5a73-2bd6-46ee-a129-f4e524114b5d', 0, '6cfd6014-222b-4ce0-bc3e-1cf4a114e40d', '8c02f700-36f0-4f89-be80-209968c41757', 100),
    ('c4ffa446-6ae6-437d-8ccf-9846b9452672', 0, '6cfd6014-222b-4ce0-bc3e-1cf4a114e40d', '84c26474-063f-4fe9-aa42-c7c1c939df42', 40),
    ('69af9d41-7a28-4f99-8f3c-0b13134c392f', 0, '8d5873bf-f51d-406b-b77e-9ef3d9a9e10b', '578db518-581b-4801-8613-4d09b12ed366', 300),
    ('cedf4fdd-60e0-4103-be5e-1fd6fd12ac45', 0, '8d5873bf-f51d-406b-b77e-9ef3d9a9e10b', 'f69fdc56-fb0a-479f-8b56-f3419c2b1d5d', 200),
    ('37fe17e8-b166-4428-9016-3399a769292f', 0, '8d5873bf-f51d-406b-b77e-9ef3d9a9e10b', '238bc586-031e-4585-9890-96c111786383', 10),
    ('0bb059a3-99f6-4b44-8c46-90ecc33d1e38', 0, '8d5873bf-f51d-406b-b77e-9ef3d9a9e10b', 'f4dfa69e-4710-4123-89c7-12b791baeae1', 10),
    ('1c6b70f0-d987-4d34-941b-d87e77b56694', 0, '8d5873bf-f51d-406b-b77e-9ef3d9a9e10b', '67bc64c2-69b3-494e-8b42-2c7d7dab75b6', 15),
    ('4cd10958-8f01-450d-be51-d8c2f321b382', 0, '8d5873bf-f51d-406b-b77e-9ef3d9a9e10b', '0f5f734a-19c7-464f-bf2b-29b8295b8e76', 100),
    ('e37f600e-87b0-4273-873e-2d995009b366', 0, '23ad8b0b-37c0-486f-958e-e802de0f00d7', '1ecf7d4c-c4d9-403b-a7a6-3a6de1688be6', 200),
    ('c92b2e54-491f-4982-ab5a-2f883f771237', 0, '23ad8b0b-37c0-486f-958e-e802de0f00d7', '90acf0a6-72be-4268-bbce-fac0e0b82a8e', 100),
    ('c21745cd-3f3e-48f4-9738-3b9128c6e8b6', 0, '23ad8b0b-37c0-486f-958e-e802de0f00d7', '9661a1fd-6369-4028-9f33-b08e304de7f8', 200),
    ('df9dcc5b-8554-4b4b-8b65-39d5bfbb02a1', 0, '23ad8b0b-37c0-486f-958e-e802de0f00d7', '125c3d8f-38e1-4067-b295-f43170c5ad58', 200),
    ('8b41d094-3cdd-402a-9582-1ed2a389a494', 0, '23ad8b0b-37c0-486f-958e-e802de0f00d7', '5c2a163d-65e7-46c1-a0f9-3c02c449960f', 100),
    ('d66fe429-e0ad-42d4-aa1d-a870518a63ae', 0, '23ad8b0b-37c0-486f-958e-e802de0f00d7', '3a686a2e-e786-45bf-933b-4a63a18b84e3', 20),
    ('1d501678-5311-45c2-92f9-7516a228e32b', 0, 'd7c6af9a-3018-4055-b7a4-219613680de8', '3626f037-61fb-495f-99b6-ab5127be9568', 250),
    ('b60718f5-99a1-4c33-a061-fa976bf295ea', 0, 'd7c6af9a-3018-4055-b7a4-219613680de8', 'c1f53dd2-5ee5-4a00-9c75-5014ce1c822b', 400),
    ('4f99eee5-db9e-4abb-b169-8cde95bd6dab', 0, 'd7c6af9a-3018-4055-b7a4-219613680de8', 'b573055d-ff27-460b-9243-f8a7648b0a41', 50),
    ('d48a7115-319c-4ee6-838d-e70503c31c94', 0, 'd7c6af9a-3018-4055-b7a4-219613680de8', 'edccb21b-282d-4878-accf-2fe254be2c76', 30),
    ('d02c3456-ddf4-49d1-a3aa-15889fcd00bc', 0, 'd7c6af9a-3018-4055-b7a4-219613680de8', '93d314c1-f39b-4f91-a62c-6257162dd20f', 200),
    ('9c1d4abe-ebb2-44a6-ac1d-9310aae16dae', 0, 'd7c6af9a-3018-4055-b7a4-219613680de8', 'd1e4d14a-50bb-4a5c-85af-104cffff1ce7', 100),
    ('2097b36c-d5e3-40cc-9a4c-c699c403414c', 0, '42e1f67f-7d00-4321-b2b8-ff15b66b18be', '27f464db-de40-42a9-9acc-bafdefbd79a7', 140),
    ('744271da-4c22-4919-9103-19ade8e3fa64', 0, '42e1f67f-7d00-4321-b2b8-ff15b66b18be', 'd054c51c-46a2-48c3-94ef-56fd14d36b7c', 140),
    ('2b280688-934f-445d-9701-80aeb0159d69', 0, '42e1f67f-7d00-4321-b2b8-ff15b66b18be', 'ee3d7b1b-4c24-4787-a4bd-6ac3777f7df3', 30),
    ('3dd05986-5eb6-4a77-98c1-beb7c01b52cd', 0, '42e1f67f-7d00-4321-b2b8-ff15b66b18be', 'e7d26eae-68e5-4901-ac5b-50708da88ac5', 30),
    ('f55f857e-a179-4231-9359-836a11928ca2', 0, '42e1f67f-7d00-4321-b2b8-ff15b66b18be', '43ea98aa-dc52-44ee-a70b-652ef45fbb20', 1),
    ('f0fe4831-5806-4fc1-acb8-b28ffa5ba445', 0, '42e1f67f-7d00-4321-b2b8-ff15b66b18be', '5376bd81-3acd-4966-b3fd-94f65f153d8b', 50);

INSERT INTO public.basket (id, version, created_at, description, name, client_id)
VALUES
    ('67449cf6-4113-410f-b716-2f0fdf3f17b7', 0, '2025-01-20 19:57:20.662002', 'Zestaw z wysoką zawartością białka i małą ilością tłuszczu.', 'Wysokobiałkowy', '6f15b280-581f-423e-a0ff-c02cce1c3350'),
    ('37681415-8409-4df2-a9c9-a268debbe972', 0, '2025-01-20 20:01:12.596141', 'Zestaw ze zrównoważoną zawartością składników odżywczych.', 'Zrównoważony', '6f15b280-581f-423e-a0ff-c02cce1c3350');

INSERT INTO public.basket_entry (id, version, quantity, basket_id, product_id)
VALUES
    ('7348187c-ef94-4738-a07c-6302214511ad', 0, 30.00, '67449cf6-4113-410f-b716-2f0fdf3f17b7', '5376bd81-3acd-4966-b3fd-94f65f153d8b'),
    ('f4f2181a-67ae-4462-b2ee-9aee9426529a', 0, 30.00, '67449cf6-4113-410f-b716-2f0fdf3f17b7', 'ee3d7b1b-4c24-4787-a4bd-6ac3777f7df3'),
    ('15871fa8-bd0f-44b0-a895-7f14047a17d7', 0, 400.00, '67449cf6-4113-410f-b716-2f0fdf3f17b7', '36fa7e1c-ecf6-453f-bb35-d7446c9a8457'),
    ('aa6c8be3-6327-453f-9d34-0ab76d5851d1', 0, 0.50, '67449cf6-4113-410f-b716-2f0fdf3f17b7', '53f75855-6149-4ec0-8174-35257c4a40bb'),
    ('1695ba6e-f367-49fd-8168-3d6d5437f1c9', 0, 20.00, '67449cf6-4113-410f-b716-2f0fdf3f17b7', '5338e68e-089b-444d-8009-35592f84682f'),
    ('634e87c5-efd1-4d9e-8529-a5b72be73212', 0, 50.00, '67449cf6-4113-410f-b716-2f0fdf3f17b7', '7edc5259-79b7-4526-8d2b-0924ec495df2'),
    ('a9d0ee28-8d72-40f4-a748-98f89eea7e5d', 1, 20.00, '67449cf6-4113-410f-b716-2f0fdf3f17b7', 'bd19a5cc-a263-4909-b0be-73515f8d05c1'),
    ('b7a14744-8316-4b81-84d4-008f2d4dcb1d', 0, 200.00, '67449cf6-4113-410f-b716-2f0fdf3f17b7', 'f8cfc3fb-56e6-49f3-9776-ae03e4f30072'),
    ('7cf1fccb-a08b-414c-b442-833a4aada3f3', 0, 100.00, '67449cf6-4113-410f-b716-2f0fdf3f17b7', 'd75cda81-ea16-4652-825c-a65f891bd657'),
    ('4a68559c-8c21-4a62-b788-beae43e163a3', 0, 30.00, '67449cf6-4113-410f-b716-2f0fdf3f17b7', '2eccba9e-5ae9-46f0-9760-58fd1cbf2b16'),
    ('2b1f10eb-06b3-44dc-ae00-9fde842a9996', 0, 50.00, '37681415-8409-4df2-a9c9-a268debbe972', '03b16d62-aee4-41c1-83a7-6ceaf96d8da6'),
    ('04276de8-c327-4024-8090-ec1918d125da', 1, 150.00, '37681415-8409-4df2-a9c9-a268debbe972', '1e2b4af5-5a6a-4239-80d5-22428cffab4a'),
    ('2d9e369e-cb1e-4cd0-9052-65f0fae2168a', 0, 140.00, '37681415-8409-4df2-a9c9-a268debbe972', '7bad072d-5d3e-4275-b56f-ca0e1b7e8bc7'),
    ('e05793fd-d619-4302-9f02-b1b04a095e0f', 0, 60.00, '37681415-8409-4df2-a9c9-a268debbe972', '557f23b6-cdb4-474a-9e05-eec6ffef9bf5'),
    ('88906d8b-0912-47e6-82ea-1efe597099c6', 0, 140.00, '37681415-8409-4df2-a9c9-a268debbe972', 'd054c51c-46a2-48c3-94ef-56fd14d36b7c'),
    ('ccb36384-792f-4cca-b115-dc033e3247d0', 0, 250.00, '37681415-8409-4df2-a9c9-a268debbe972', '3b1b0c48-b79f-4119-bbd4-19f37fc7d69f'),
    ('3fdf1845-08e2-4555-acd5-c8d7cb502519', 0, 60.00, '37681415-8409-4df2-a9c9-a268debbe972', '2eccba9e-5ae9-46f0-9760-58fd1cbf2b16'),
    ('31c12238-36bf-4cf0-86e4-4a5cf56572c5', 2, 25.00, '37681415-8409-4df2-a9c9-a268debbe972', 'ae0ba335-9472-4ef8-aeaf-dbd3293c7608'),
    ('e3ac49c3-5957-4f05-a877-f644dfe86357', 0, 100.00, '37681415-8409-4df2-a9c9-a268debbe972', '147dac8c-3a18-4311-996d-189827d286aa'),
    ('cdb80393-016e-4133-9516-4b1918ff31d0', 0, 200.00, '37681415-8409-4df2-a9c9-a268debbe972', '3626f037-61fb-495f-99b6-ab5127be9568'),
    ('04b6cf78-52bf-4859-9005-7f896f119cb0', 0, 30.00, '37681415-8409-4df2-a9c9-a268debbe972', '3a1b9fb6-543f-4aa6-b28e-ec0a92526a90');

INSERT INTO public.user_favourite_products (client_id, product_id)
VALUES ('6f15b280-581f-423e-a0ff-c02cce1c3350', 'd75cda81-ea16-4652-825c-a65f891bd657');

INSERT INTO public.user_favourite_products (client_id, product_id)
VALUES ('6f15b280-581f-423e-a0ff-c02cce1c3350', '7bad072d-5d3e-4275-b56f-ca0e1b7e8bc7');

INSERT INTO public.user_favourite_products (client_id, product_id)
VALUES ('6f15b280-581f-423e-a0ff-c02cce1c3350', '927d0f18-7e48-4440-a4a7-ab7a3de8f5a1');

INSERT INTO public.user_favourite_products (client_id, product_id)
VALUES ('6f15b280-581f-423e-a0ff-c02cce1c3350', '562dc9a9-ca76-4d04-91d8-be69782d0338');
