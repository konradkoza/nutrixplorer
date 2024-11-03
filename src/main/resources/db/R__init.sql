-- ${flyway:timestamp}
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.users TO nutriuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.personal_data TO nutriuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.administrators TO nutriuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.sellers TO nutriuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.clients TO nutriuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.access_levels TO nutriuser;
GRANT SELECT, INSERT, DELETE, UPDATE ON TABLE public.addresses TO nutriuser;

GRANT SELECT ON TABLE public.addition TO nutriuser;
GRANT SELECT ON TABLE public.access_levels TO nutriuser;
GRANT SELECT ON TABLE public.composition TO nutriuser;
GRANT SELECT ON TABLE public.composition_addition TO nutriuser;
GRANT SELECT ON TABLE public.composition_ingredient TO nutriuser;
GRANT SELECT ON TABLE public.flavour TO nutriuser;
GRANT SELECT ON TABLE public.ingredient TO nutriuser;
GRANT SELECT ON TABLE public.label TO nutriuser;
GRANT SELECT ON TABLE public.nutritional_index TO nutriuser;
GRANT SELECT ON TABLE public.nutritional_value TO nutriuser;
GRANT SELECT ON TABLE public.nutritional_value_group TO nutriuser;
GRANT SELECT ON TABLE public.nutritional_value_name TO nutriuser;
GRANT SELECT ON TABLE public.package_type TO nutriuser;
GRANT SELECT ON TABLE public.personal_data TO nutriuser;
GRANT SELECT ON TABLE public.portion TO nutriuser;
GRANT SELECT ON TABLE public.producer TO nutriuser;
GRANT SELECT ON TABLE public.product TO nutriuser;
GRANT SELECT ON TABLE public.product_index TO nutriuser;
GRANT SELECT ON TABLE public.product_nutritional_index TO nutriuser;
GRANT SELECT ON TABLE public.product_nutritional_value TO nutriuser;
GRANT SELECT ON TABLE public.product_product_index TO nutriuser;
GRANT SELECT ON TABLE public.product_rating TO nutriuser;
GRANT SELECT ON TABLE public.rating TO nutriuser;
GRANT SELECT ON TABLE public.unit TO nutriuser;
GRANT SELECT,UPDATE,DELETE,INSERT ON TABLE public.basket TO nutriuser;
GRANT SELECT,UPDATE,DELETE,INSERT ON TABLE public.basket_entry TO nutriuser;
GRANT SELECT,UPDATE,DELETE,INSERT ON TABLE public.offer TO nutriuser;
GRANT SELECT ON TABLE public.allergen TO nutriuser;
GRANT SELECT ON TABLE public.label_allergen TO nutriuser;
GRANT SELECT,UPDATE,DELETE,INSERT ON TABLE public.user_favourite_products TO nutriuser;

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


INSERT INTO public.basket (id, version, user_id, name, description)
      VALUES ('0bfc4ba2-9e55-4b70-b4e2-6dc71bb7328f', 0, 'e646e3dc-9170-4abb-b0b7-82b507324271', 'Basket', 'Description of example basket');
INSERT INTO public.basket_entry(id, version, basket_id, product_id, quantity)
      VALUES ('55301f31-13ab-41ed-a289-b044a837c00c', 0, '0bfc4ba2-9e55-4b70-b4e2-6dc71bb7328f', 'f1a18267-d8ba-4215-9e87-bca3200d4ea5', 450);
INSERT INTO public.basket_entry(id, version, basket_id, product_id, quantity)
VALUES ('5f8fe998-065e-4723-a428-8896be754893', 0, '0bfc4ba2-9e55-4b70-b4e2-6dc71bb7328f', 'f1a18267-d8ba-4215-9e87-bca3200d4ea5', 400);
INSERT INTO public.basket_entry(id, version, basket_id, product_id, quantity)
VALUES ('bba0dcd6-4daf-4cad-9f27-890daa208eba', 0, '0bfc4ba2-9e55-4b70-b4e2-6dc71bb7328f', '56428e7d-2876-4456-b5f7-9ff597c97a58', 450);
INSERT INTO public.basket_entry(id, version, basket_id, product_id, quantity)
VALUES ('fa05287e-4f5d-4b69-b2ed-077b8d7020fd', 0, '0bfc4ba2-9e55-4b70-b4e2-6dc71bb7328f', '98de3ed0-b63a-4320-aba1-57d3dc28c381', 350);
INSERT INTO public.basket_entry(id, version, basket_id, product_id, quantity)
VALUES ('5455ef3a-4b25-4657-b874-cf6d90d94b75', 0, '0bfc4ba2-9e55-4b70-b4e2-6dc71bb7328f', '927d0f18-7e48-4440-a4a7-ab7a3de8f5a1', 200);
INSERT INTO public.basket_entry(id, version, basket_id, product_id, quantity)
VALUES ('9c85ce5b-1e88-4a2e-9cc4-819f774f4c84', 0, '0bfc4ba2-9e55-4b70-b4e2-6dc71bb7328f', '7bad072d-5d3e-4275-b56f-ca0e1b7e8bc7', 100);


INSERT INTO public.basket (id, version, user_id, name, description)
VALUES ('1226916e-d737-43e1-a9b1-27f590b0ac40', 0, 'e646e3dc-9170-4abb-b0b7-82b507324271', 'Basket numer 2', 'Description of example basket number 2');
INSERT INTO public.basket_entry(id, version, basket_id, product_id, quantity)
VALUES ('4e973c7f-47df-4cf1-8505-ed5db01a97b4', 0, '1226916e-d737-43e1-a9b1-27f590b0ac40', 'f1a18267-d8ba-4215-9e87-bca3200d4ea5', 450);
INSERT INTO public.basket_entry(id, version, basket_id, product_id, quantity)
VALUES ('27fa48a2-a615-4395-8e3a-4681716978b3', 0, '1226916e-d737-43e1-a9b1-27f590b0ac40', 'f1a18267-d8ba-4215-9e87-bca3200d4ea5', 400);
INSERT INTO public.basket_entry(id, version, basket_id, product_id, quantity)
VALUES ('e3a46e4d-90c7-4102-a58e-3cfaba4ff0fa', 0, '1226916e-d737-43e1-a9b1-27f590b0ac40', '56428e7d-2876-4456-b5f7-9ff597c97a58', 400);
INSERT INTO public.basket_entry(id, version, basket_id, product_id, quantity)
VALUES ('249238b1-7687-474f-8106-6f5c393a620c', 0, '1226916e-d737-43e1-a9b1-27f590b0ac40', '98de3ed0-b63a-4320-aba1-57d3dc28c381', 350);
INSERT INTO public.basket_entry(id, version, basket_id, product_id, quantity)
VALUES ('b262858a-0258-4b42-a8a1-88875c4d8e44', 0, '1226916e-d737-43e1-a9b1-27f590b0ac40', '927d0f18-7e48-4440-a4a7-ab7a3de8f5a1', 200);
INSERT INTO public.basket_entry(id, version, basket_id, product_id, quantity)
VALUES ('c8a569a2-064b-4153-bf42-6f9321f6aefa', 0, '1226916e-d737-43e1-a9b1-27f590b0ac40', '7bad072d-5d3e-4275-b56f-ca0e1b7e8bc7', 100);

INSERT INTO public.basket (id, version, user_id, name, description)
VALUES ('ec7f84f9-767c-44d3-ae07-b021d1c47ea8', 0, 'e646e3dc-9170-4abb-b0b7-82b507324271', 'Basket numer 2', 'Description of example basket number 2');
INSERT INTO public.basket_entry(id, version, basket_id, product_id, quantity)
VALUES ('ac43c184-92dc-4734-89f1-e720aa57b18c', 0, 'ec7f84f9-767c-44d3-ae07-b021d1c47ea8', 'f1a18267-d8ba-4215-9e87-bca3200d4ea5', 450);
INSERT INTO public.basket_entry(id, version, basket_id, product_id, quantity)
VALUES ('15b94603-019a-4f1e-ad07-6cea641af04c', 0, 'ec7f84f9-767c-44d3-ae07-b021d1c47ea8', 'f1a18267-d8ba-4215-9e87-bca3200d4ea5', 400);
INSERT INTO public.basket_entry(id, version, basket_id, product_id, quantity)
VALUES ('19e6d986-5756-48ba-8bfd-54c9b99dfed7', 0, 'ec7f84f9-767c-44d3-ae07-b021d1c47ea8', '56428e7d-2876-4456-b5f7-9ff597c97a58', 400);
INSERT INTO public.basket_entry(id, version, basket_id, product_id, quantity)
VALUES ('012b3e6c-176e-40f2-bc5b-7693d80638df', 0, 'ec7f84f9-767c-44d3-ae07-b021d1c47ea8', '98de3ed0-b63a-4320-aba1-57d3dc28c381', 350);
INSERT INTO public.basket_entry(id, version, basket_id, product_id, quantity)
VALUES ('bf7332cb-65c0-4e4d-9e33-e3dcd15a5602', 0, 'ec7f84f9-767c-44d3-ae07-b021d1c47ea8', '927d0f18-7e48-4440-a4a7-ab7a3de8f5a1', 200);
INSERT INTO public.basket_entry(id, version, basket_id, product_id, quantity)
VALUES ('2841954d-1b14-46d3-84f1-18c394c3fd2b', 0, 'ec7f84f9-767c-44d3-ae07-b021d1c47ea8', '7bad072d-5d3e-4275-b56f-ca0e1b7e8bc7', 100);

INSERT INTO public.user_favourite_products (client_id, product_id)
VALUES ('6f15b280-581f-423e-a0ff-c02cce1c3350', 'f1a18267-d8ba-4215-9e87-bca3200d4ea5');

INSERT INTO public.user_favourite_products (client_id, product_id)
VALUES ('6f15b280-581f-423e-a0ff-c02cce1c3350', '7bad072d-5d3e-4275-b56f-ca0e1b7e8bc7');

INSERT INTO public.user_favourite_products (client_id, product_id)
VALUES ('6f15b280-581f-423e-a0ff-c02cce1c3350', '927d0f18-7e48-4440-a4a7-ab7a3de8f5a1');

INSERT INTO public.user_favourite_products (client_id, product_id)
VALUES ('6f15b280-581f-423e-a0ff-c02cce1c3350', '56428e7d-2876-4456-b5f7-9ff597c97a58');