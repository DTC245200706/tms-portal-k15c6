# S3-03 — Lead conversion

`POST /api/v1/leads/:leadId/convert` chuyển lead đã đủ điều kiện sang `students` trong một transaction, cập nhật lead thành `ENROLLED` và có tính idempotent khi gọi lại.
