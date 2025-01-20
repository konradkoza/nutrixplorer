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