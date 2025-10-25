# Vietnamese Text Fixes and Improvements

## Overview
This document outlines the Vietnamese language improvements made to ensure natural, professional, and user-friendly text throughout the application.

---

## Fixed Issues

### 1. **Capitalization Rules**
Vietnamese doesn't use title case like English. Only proper nouns and the first word of sentences should be capitalized.

**Before:**
- `Quản Lý Thành Viên` (incorrect - title case)
- `Lịch Sử Tiêm Chủng` (incorrect - title case)

**After:**
- `Danh sách thành viên` (correct - only first word)
- `Lịch sử tiêm chủng` (correct - only first word)

### 2. **Natural Phrasing**
Improved phrasing to sound more natural in Vietnamese.

**Before:**
- `Vaccine đầy đủ` (awkward)
- `Theo dõi tốt` (unclear)
- `Active` (English word)

**After:**
- `Đã được bảo vệ` (natural Vietnamese)
- `Theo dõi đầy đủ` (clearer meaning)
- `Tốt` or `100%` (Vietnamese equivalent)

### 3. **Consistency**
Ensured consistent terminology throughout the app.

**Standardized Terms:**
- Thành viên → member
- Tiêm chủng → vaccination
- Kháng nguyên → antigen
- Vắc xin / Vaccine → vaccine (both acceptable, prefer vắc xin)
- Mũi tiêm → dose
- Phác đồ → schedule
- Cơ sở y tế → healthcare facility

### 4. **User-Friendly Messages**

**Before:**
- `Chưa có thành viên` (too brief)
- `Không thể tải` (no context)

**After:**
- `Chưa có thành viên nào` (more natural)
- `Không thể tải thông tin. Vui lòng thử lại.` (with action)

---

## Vietnamese Grammar Rules Applied

### 1. **Pronouns and Formality**
- Use `bạn` (you - neutral/friendly) in healthcare context
- Avoid `anh/chị` unless knowing user's gender/age
- Use `của bạn` (your) sparingly, Vietnamese often omits it

### 2. **Sentence Structure**
Vietnamese follows Subject-Verb-Object (SVO) order like English, but:
- Adjectives come after nouns: `thành viên mới` (new member)
- Classifiers used with numbers: `3 người` (3 people), `5 mũi` (5 doses)

### 3. **Punctuation**
- No spaces before punctuation marks
- Use ellipsis (...) for continuation
- Use em dash (—) for emphasis

### 4. **Numbers**
- Dates: `DD/MM/YYYY` format (25/10/2025)
- Times: 24-hour format (14:30)
- Percentages: `100%` (no space)

---

## Specific Fixes by File

### Login.tsx ✅
- Header texts are appropriate and natural
- Error messages are clear and actionable
- Button labels are concise

**Good examples:**
- `Đăng nhập ngay` (Login now)
- `Quên mật khẩu?` (Forgot password?)
- `Vui lòng nhập số điện thoại` (Please enter phone number)

### PersonalInfo.tsx ✅ (Recently Updated)
- Changed `Quản Lý Thành Viên` → `Danh sách thành viên`
- Changed `Vaccine đầy đủ` → `Đã được bảo vệ`
- Changed `Theo dõi tốt` → `Theo dõi đầy đủ`
- Improved empty state messages
- Added natural search placeholder

**Improvements:**
- Search: `Tìm kiếm theo tên, số điện thoại, email...`
- Empty state: `Chưa có thành viên nào`
- No results: `Không tìm thấy kết quả`

### VaccinationHistory.tsx
**To review:**
- Tab labels should not use title case
- Check for consistency with PersonalInfo

### ChangePassword.tsx ✅
- Good use of progressive disclosure
- Clear step-by-step instructions
- Appropriate formality level

---

## Vietnamese Healthcare Terminology

### Standard Medical Terms (Use These)
| Vietnamese | English | Notes |
|-----------|---------|-------|
| Tiêm chủng | Vaccination | Standard medical term |
| Vắc xin | Vaccine | Preferred over "vaccine" |
| Kháng nguyên | Antigen | Technical but understandable |
| Mũi tiêm | Dose | Common healthcare term |
| Phác đồ | Schedule/Protocol | Medical standard |
| Cơ sở y tế | Healthcare facility | Official term |
| Sổ tiêm chủng | Vaccination record | Traditional term |
| Lịch sử tiêm | Vaccination history | Modern term |

### User-Friendly Alternatives
| Formal | User-Friendly | When to Use |
|--------|---------------|-------------|
| Đối tượng | Thành viên | Always prefer |
| Theo dõi | Quản lý | Interface labels |
| Thực hiện | Tiến hành | Action buttons |
| Hoàn thành | Đã xong | Status indicators |

---

## Best Practices for Vietnamese UI Text

### DO ✅
- **Be concise**: Vietnamese tends to be shorter than English
- **Use active voice**: `Xem lịch sử` not `Lịch sử được xem`
- **Be specific**: `Tải lại dữ liệu` not just `Tải lại`
- **Include context**: `Không tìm thấy thành viên` not just `Không tìm thấy`
- **Use verbs for actions**: `Làm mới`, `Tải lại`, `Xem chi tiết`

### DON'T ❌
- **Don't use title case**: Not `Danh Sách Thành Viên`
- **Don't mix English**: Avoid `Active`, `Update`, etc.
- **Don't be too formal**: Not `Quý khách vui lòng...`
- **Don't overuse pronouns**: Often omit `của bạn` when clear from context
- **Don't translate literally**: Adapt to Vietnamese structure

---

## Common Mistakes to Avoid

### 1. **False Friends**
- ❌ `Vaccine đầy đủ` → ✅ `Đã tiêm đầy đủ`
- ❌ `Active member` → ✅ `Đang theo dõi`
- ❌ `Update information` → ✅ `Cập nhật thông tin`

### 2. **Word Order**
- ❌ `Mới thành viên` → ✅ `Thành viên mới`
- ❌ `Tiêm chủng lịch sử` → ✅ `Lịch sử tiêm chủng`

### 3. **Redundancy**
- ❌ `Xem và kiểm tra thông tin` → ✅ `Xem thông tin`
- ❌ `Nhấn vào nút để xem` → ✅ `Nhấn để xem`

---

## Testing Checklist

- [ ] All Vietnamese text uses proper capitalization
- [ ] No English words mixed in Vietnamese sentences
- [ ] Medical terms are consistent throughout
- [ ] Error messages are helpful and actionable
- [ ] Button labels are clear and concise
- [ ] Empty states provide guidance
- [ ] Success messages are encouraging
- [ ] Loading states are informative

---

## Glossary

### Interface Elements
- Button: Nút
- Link: Liên kết
- Menu: Trình đơn
- Search: Tìm kiếm
- Filter: Lọc / Bộ lọc
- Sort: Sắp xếp
- View: Xem
- Edit: Sửa
- Delete: Xóa
- Refresh: Làm mới / Tải lại
- Loading: Đang tải
- Error: Lỗi
- Success: Thành công

### Status Terms
- Active: Đang hoạt động / Đang theo dõi
- Inactive: Không hoạt động
- Pending: Đang chờ
- Completed: Đã hoàn thành
- In Progress: Đang tiến hành
- Available: Có sẵn
- Unavailable: Không có sẵn

### Actions
- Click: Nhấn / Nhấp
- Tap: Chạm
- Swipe: Vuốt
- Scroll: Cuộn
- Select: Chọn
- Enter: Nhập
- Submit: Gửi
- Cancel: Hủy
- Confirm: Xác nhận
- Back: Quay lại
- Next: Tiếp theo
- Finish: Hoàn thành

---

## Resources

### Vietnamese Typography
- Font: System default (supports Vietnamese well)
- Line height: 1.5-1.6 (Vietnamese needs more space)
- Letter spacing: Normal (don't condense)

### Tone Marks
Always display tone marks correctly:
- á, à, ả, ã, ạ
- ă, ắ, ằ, ẳ, ẵ, ặ
- â, ấ, ầ, ẩ, ẫ, ậ
- é, è, ẻ, ẽ, ẹ
- ê, ế, ề, ể, ễ, ệ
- ó, ò, ỏ, õ, ọ
- ô, ố, ồ, ổ, ỗ, ộ
- ơ, ớ, ờ, ở, ỡ, ợ
- ú, ù, ủ, ũ, ụ
- ư, ứ, ừ, ử, ữ, ự
- í, ì, ỉ, ĩ, ị
- ý, ỳ, ỷ, ỹ, ỵ

---

## Continuous Improvement

This is a living document. As we receive user feedback, we'll continue to refine the Vietnamese text to ensure the best possible user experience.

**Last Updated**: October 25, 2025
**Version**: 1.0

