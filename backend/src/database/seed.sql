
-- Bootstrap production users. Override passwords and remove these rows after first deployment.
INSERT INTO programs(code,name,description,duration_sessions,standard_fee,status)
VALUES
('FS-K15C6','Full-stack Web Developer','Lộ trình phát triển web từ frontend đến backend.',30,18500000,'ACTIVE'),
('DA-K02','Data Analyst Foundation','Phân tích dữ liệu thực hành với SQL và dashboard.',24,16000000,'ACTIVE'),
('UX-K08','UI/UX Product Design','Nghiên cứu người dùng và thiết kế sản phẩm số.',20,15000000,'ACTIVE'),
('PM-K03','Product Management Essentials','Nền tảng discovery, roadmap và delivery sản phẩm.',18,14000000,'ACTIVE')
ON CONFLICT (code) DO NOTHING;

INSERT INTO courses(code,name,sessions_count,weight,learning_outcomes,status)
VALUES
('WEB-FE','React State & Data Flow',8,30,'Xây dựng giao diện React có state rõ ràng.','ACTIVE'),
('WEB-BE','NestJS & PostgreSQL API',10,40,'Thiết kế API, JWT và dữ liệu quan hệ.','ACTIVE'),
('SQL-FOUND','SQL Window Functions',6,30,'Truy vấn phân tích và báo cáo dữ liệu.','ACTIVE'),
('UX-DS','Design System Workshop',8,100,'Thiết kế hệ thống UI nhất quán.','ACTIVE'),
('PM-DISCOVERY','Product Discovery Sprint',6,100,'Xác định vấn đề, giả thuyết và roadmap.','ACTIVE')
ON CONFLICT (code) DO NOTHING;

INSERT INTO rooms(code,name,capacity,meeting_url,status)
VALUES
('LAB-03','Lab 03',30,NULL,'ACTIVE'),
('ROOM-204','Phòng 204',24,NULL,'ACTIVE'),
('ROOM-301','Phòng 301',20,NULL,'ACTIVE'),
('ZOOM','Online · Zoom',100,'https://zoom.us/j/000000000','ACTIVE')
ON CONFLICT (code) DO NOTHING;

INSERT INTO classes(code,program_id,expected_start_date,max_students,delivery_mode,status)
SELECT v.code,p.id,v.start_date,v.max_students,v.mode,v.status
FROM (VALUES
  ('FS-K15C6','FS-K15C6','2026-09-01'::date,28,'ONSITE','ACTIVE'),
  ('DA-K02','DA-K02','2026-09-15'::date,24,'ONSITE','ACTIVE'),
  ('UX-K08','UX-K08','2026-10-20'::date,25,'ONLINE','PREPARING'),
  ('PM-K03','PM-K03','2026-10-25'::date,20,'ONSITE','PREPARING')
) AS v(code,program_code,start_date,max_students,mode,status)
JOIN programs p ON p.code=v.program_code
ON CONFLICT (code) DO NOTHING;

INSERT INTO users(email,password_hash,full_name,status)
VALUES
('admin@tms.edu.vn','$argon2id$v=19$m=65536,t=3,p=4$gIb7L+z2455mWoBSuRzN0Q$ST5zFDvRecEkGEt88ZdIUUpR3vwZwayBzfpmAKf64VM','Admin TMS','ACTIVE'),
('student@tms.edu.vn','$argon2id$v=19$m=65536,t=3,p=4$gIb7L+z2455mWoBSuRzN0Q$ST5zFDvRecEkGEt88ZdIUUpR3vwZwayBzfpmAKf64VM','Nguyễn Minh Anh','ACTIVE'),
('instructor@tms.edu.vn','$argon2id$v=19$m=65536,t=3,p=4$gIb7L+z2455mWoBSuRzN0Q$ST5zFDvRecEkGEt88ZdIUUpR3vwZwayBzfpmAKf64VM','Nguyễn Hoàng Long','ACTIVE')
ON CONFLICT (email) DO NOTHING;
INSERT INTO user_roles(user_id,role_code)
SELECT u.id, 'ADMIN' FROM users u WHERE u.email='admin@tms.edu.vn'
ON CONFLICT DO NOTHING;
INSERT INTO user_roles(user_id,role_code)
SELECT u.id, 'STUDENT' FROM users u WHERE u.email='student@tms.edu.vn'
ON CONFLICT DO NOTHING;
INSERT INTO user_roles(user_id,role_code)
SELECT u.id, 'INSTRUCTOR' FROM users u WHERE u.email='instructor@tms.edu.vn'
ON CONFLICT DO NOTHING;

INSERT INTO leads(full_name,phone,email,source,interested_program_id,owner_id,status)
SELECT v.full_name,v.phone,v.email,v.source,p.id,u.id,v.status
FROM (VALUES
  ('Vũ Khánh Linh','0903123456','linh.vu@example.com','Workshop tháng 10','PM-K03','admin@tms.edu.vn','NEW'),
  ('Đỗ Đức Anh','0903987654','anh.do@example.com','Zalo OA','FS-K15C6','admin@tms.edu.vn','CONTACTED'),
  ('Nguyễn Thu Trang','0903555123','trang.nguyen@example.com','Landing page','DA-K02','admin@tms.edu.vn','CONSULTING')
) AS v(full_name,phone,email,source,program_code,owner_email,status)
JOIN programs p ON p.code=v.program_code
JOIN users u ON u.email=v.owner_email
WHERE NOT EXISTS (SELECT 1 FROM leads l WHERE l.email=v.email);

INSERT INTO class_courses(class_id,course_id,sort_order,instructor_id)
SELECT cl.id, co.id, 1, u.id FROM classes cl, courses co, users u
WHERE cl.code='FS-K15C6' AND co.code='WEB-FE' AND u.email='instructor@tms.edu.vn'
ON CONFLICT (class_id,course_id) DO NOTHING;
INSERT INTO class_courses(class_id,course_id,sort_order,instructor_id)
SELECT cl.id, co.id, 2, u.id FROM classes cl, courses co, users u
WHERE cl.code='FS-K15C6' AND co.code='WEB-BE' AND u.email='instructor@tms.edu.vn'
ON CONFLICT (class_id,course_id) DO NOTHING;

INSERT INTO class_courses(class_id,course_id,sort_order,instructor_id)
SELECT cl.id, co.id, 1, u.id FROM classes cl, courses co, users u
WHERE cl.code='DA-K02' AND co.code='SQL-FOUND' AND u.email='instructor@tms.edu.vn'
ON CONFLICT (class_id,course_id) DO NOTHING;
INSERT INTO class_courses(class_id,course_id,sort_order,instructor_id)
SELECT cl.id, co.id, 1, u.id FROM classes cl, courses co, users u
WHERE cl.code='UX-K08' AND co.code='UX-DS' AND u.email='instructor@tms.edu.vn'
ON CONFLICT (class_id,course_id) DO NOTHING;
INSERT INTO class_courses(class_id,course_id,sort_order,instructor_id)
SELECT cl.id, co.id, 1, u.id FROM classes cl, courses co, users u
WHERE cl.code='PM-K03' AND co.code='PM-DISCOVERY' AND u.email='instructor@tms.edu.vn'
ON CONFLICT (class_id,course_id) DO NOTHING;

INSERT INTO students(user_id,student_code,entry_level)
SELECT u.id,'HV-24031','Foundation' FROM users u WHERE u.email='student@tms.edu.vn'
ON CONFLICT (student_code) DO NOTHING;
INSERT INTO enrollments(class_id,student_id)
SELECT cl.id, st.id FROM classes cl, students st WHERE cl.code='FS-K15C6' AND st.student_code='HV-24031'
ON CONFLICT (class_id,student_id) DO NOTHING;
INSERT INTO class_sessions(class_id,class_course_id,starts_at,ends_at,room_id,instructor_id,status)
SELECT cl.id, cc.id, '2026-10-11 08:30:00+07','2026-10-11 11:30:00+07',r.id,u.id,'SCHEDULED'
FROM classes cl JOIN class_courses cc ON cc.class_id=cl.id JOIN courses co ON co.id=cc.course_id JOIN rooms r ON r.code='LAB-03' JOIN users u ON u.email='instructor@tms.edu.vn'
WHERE cl.code='FS-K15C6' AND co.code='WEB-FE'
AND NOT EXISTS (SELECT 1 FROM class_sessions s WHERE s.class_id=cl.id AND s.starts_at='2026-10-11 08:30:00+07');
INSERT INTO attendance_records(session_id,student_id,status)
SELECT cs.id, st.id, 'PRESENT' FROM class_sessions cs, students st WHERE st.student_code='HV-24031'
ON CONFLICT (session_id,student_id) DO NOTHING;
INSERT INTO assignments(class_course_id,title,description,due_at,max_score,status,created_by)
SELECT cc.id,'Build a Kanban Board','Xây dựng board React có drag and drop','2026-10-12 17:00:00+07',100,'PUBLISHED',u.id
FROM class_courses cc JOIN classes cl ON cl.id=cc.class_id JOIN courses co ON co.id=cc.course_id JOIN users u ON u.email='instructor@tms.edu.vn'
WHERE cl.code='FS-K15C6' AND co.code='WEB-FE'
AND NOT EXISTS (SELECT 1 FROM assignments a WHERE a.title='Build a Kanban Board');
INSERT INTO notifications(user_id,type,title,body,target_path)
SELECT id,'SESSION_REMINDER','Buổi học ngày mai bắt đầu lúc 08:30','Lớp FS-K15C6 học tại Lab 03.','/attendance'
FROM users WHERE email='student@tms.edu.vn'
AND NOT EXISTS (SELECT 1 FROM notifications n WHERE n.title='Buổi học ngày mai bắt đầu lúc 08:30');
