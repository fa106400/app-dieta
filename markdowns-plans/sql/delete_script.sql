--delete for single user - escobar
DELETE FROM profiles
where user_id = '567714b8-87a3-454b-a852-1ac7ee075cb0';

DELETE FROM diet_recommendations
where user_id = '567714b8-87a3-454b-a852-1ac7ee075cb0';

DELETE FROM user_badges
where user_id = '567714b8-87a3-454b-a852-1ac7ee075cb0';

DELETE FROM user_current_diet
where user_id = '567714b8-87a3-454b-a852-1ac7ee075cb0';

DELETE FROM user_metrics
where user_id = '567714b8-87a3-454b-a852-1ac7ee075cb0';

DELETE FROM weights
where user_id = '567714b8-87a3-454b-a852-1ac7ee075cb0';

--create a script to loop through all users and delete their data
--delete for all users
do $$
declare auth_record RECORD;
begin
for auth_record in select id from auth.users LOOP
    update public.profiles 
      set onboarding_completed = false, estimated_calories = null where user_id = auth_record.id;
    delete from public.diet_recommendations where user_id = auth_record.id;
    delete from public.user_current_diet where user_id = auth_record.id;
    delete from public.user_badges where user_id = auth_record.id;
    delete from public.user_metrics where user_id = auth_record.id;
    delete from public.weights where user_id = auth_record.id;
end loop;
end $$;