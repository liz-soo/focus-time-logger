## 📘 타이머 기록 웹앱 기획서

---

### 🧭 목적

사용자가 수행할 작업의 **내용과 계획 시간**을 입력하면, **시각적 타이머 UI**와 함께 시간 추적을 돕고, **기록을 저장**하여 시간 관리 및 자기 점검에 활용할 수 있도록 한다.

---

## ✅ 핵심 기능

### 1. 타이머 설정

* 사용자가 다음 두 항목을 필수 입력:

  * **무엇을** 할 것인지 (`string`)
  * **몇 분** 동안 할 것인지 (`integer`)
* 타이머 시작 시:

  * 원형 시각 타이머 시작
  * Google Timer처럼 원형 진행 상황을 부채꼴(arc)로 시각화
  * 초 단위로 감소 표시 (CSS/JS/SVG 애니메이션 사용)

---

### 2. 시간 기록

* 타이머 시작 시: `시작시간` 자동 기록
* 타이머 종료 시:

  * 수동 종료 또는 자동 완료에 따라 `종료시간` 기록
  * 기록 테이블에 다음 항목 저장:
    \| 무엇을 | 계획시간 | 실제시간 | 시작시간 | 종료시간 |
  * 실제시간 = 종료시간 - 시작시간

---

### 3. 알림 기능

* 타이머 완료 시 **소리 알림**

  * 사용자가 **종료 버튼**을 누를 때까지 계속 재생됨

---

### 4. 타이머 중단

* 사용자가 수동으로 종료할 경우:

  * 남은 시간과 관계없이 해당 시점 `종료시간`으로 기록
  * 그 시점까지의 실제 수행 시간만 기록됨

---

### 5. 활동 기록 테이블

* 화면 하단에 테이블 형태로 실시간 누적 표시

  * 최근 항목이 상단에 위치
* **선택 기능**

  * 기록 내보내기 (CSV 다운로드)
  * DB 연동 가능성 고려

---

## 🐞 발견된 문제점

1. **디자인 개선 필요**

   * UI/UX 단조로움, 사용자 시선 흐름, 직관성 개선 필요
2. **타이머 시작 위치 이슈**

   * 부채꼴이 9시 방향(좌측)에서 시작 → \*\*12시 방향(상단)\*\*에서 시작하도록 수정 필요
3. **정확한 실제 시간 미반영**

   * 사용자가 웹페이지를 벗어나면 시간 계산이 이상해짐
     → `visibilitychange` 이벤트 활용 필요 또는 백엔드 시간 기준 연산 도입 고려

---

## 🛠 앞으로 구현하고 싶은 기능

1. **DB 자동 저장 기능**

   * 기록을 브라우저 localStorage가 아닌 **서버 DB에 자동 저장**
   * 예: Firebase, Supabase, SQLite 등

2. **Timeline 뷰 지원**

   * 하루의 활동 흐름을 시각적으로 보여주는 Timeline UI
   * 시간대별 구분 보기

3. **카테고리 분류 기능**

   * 사용자가 활동에 `카테고리` 부여 가능 (예: 식사, 운동, 연구, 공부 등)
   * 카테고리 기반 통계 제공

4. **시간 효율성 평가 기능**

   * 각 활동 종료 후, 사용자가 직접 평가:

     * ✅ O (계획대로 완수)
     * ⚠️ △ (부분 완료)
     * ❌ X (실패)
   * 평가 통계 시각화 가능
