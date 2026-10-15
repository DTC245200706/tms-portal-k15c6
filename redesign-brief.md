# TMS Portal — Redesign brief

## Mode
Redesign · Overhaul theo hướng Enterprise Data-Dense Dashboard.

## Design Read
- Artifact: dashboard web cho vận hành đào tạo.
- Audience: quản lý đào tạo, tuyển sinh, giảng viên, kế toán, quản trị hệ thống.
- Visual language: enterprise operations console, data-first, compact nhưng dễ quét.
- Dials: variance 4/10, motion 3/10, information density 8/10, asset dependence 2/10, brand fidelity 6/10.

## Preserve
- Toàn bộ phân hệ và luồng demo hiện có.
- Role-aware navigation, role switcher, filter, toast và các CTA điều hướng.
- Content model: dashboard, lead, lớp, lịch, điểm danh, bài tập, học phí, báo cáo, user/RBAC.
- Route manifest `/` và cách chạy React + Vite.

## Improve
- Tách semantic tokens theo design system UI/UX Pro Max.
- Tăng contrast, focus state, touch target và readability.
- Chuyển từ editorial pastel sang blue data + amber risk.
- Chuẩn hóa card/table/chart density, responsive overflow cho bảng.
- Dùng Fira Sans + Fira Code cho cảm giác vận hành chính xác.

## Remove
- Gradient tím/hồng, pastel thiếu ngữ nghĩa, decorative orbit quá nổi.
- Shadow nặng và text size quá nhỏ ở các vùng thao tác.

## Protected contracts
- Không đổi navigation labels, view keys, role access, component flow hoặc dữ liệu demo.
- Không đổi API/backend contracts.

## Highest-risk change
Đổi visual language toàn hệ thống có thể làm mất dấu ấn TMS; giữ logo ba cột, nhãn LIVE/TODAY/RISK và nhịp sidebar làm invariants.

## Rollback
Git diff chỉ tập trung ở visual layer, design-system docs, metadata và deployment config; có thể revert từng file.
