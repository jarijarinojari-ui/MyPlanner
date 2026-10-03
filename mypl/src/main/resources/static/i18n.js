(() => {
    const messages = {
  "나의 속도로 채우는 하루": {
    "ja": "自分のペースで過ごす一日",
    "en": "A day at your own pace"
  },
  "화면 설정": {
    "ja": "表示設定",
    "en": "Display settings"
  },
  "언어": {
    "ja": "言語",
    "en": "Language"
  },
  "다크 모드": {
    "ja": "ダークモード",
    "en": "Dark mode"
  },
  "라이트 모드": {
    "ja": "ライトモード",
    "en": "Light mode"
  },
  "로그아웃": {
    "ja": "ログアウト",
    "en": "Log out"
  },
  "주간 · 월간": {
    "ja": "週間・月間",
    "en": "Week · Month"
  },
  "일간": {
    "ja": "日別",
    "en": "Day"
  },
  "플래너 화면": {
    "ja": "プランナー画面",
    "en": "Planner view"
  },
  "월간으로 변경": {
    "ja": "月間に切り替え",
    "en": "Month view"
  },
  "주간으로 변경": {
    "ja": "週間に切り替え",
    "en": "Week view"
  },
  "이전 주": {
    "ja": "前の週",
    "en": "Previous week"
  },
  "다음 주": {
    "ja": "次の週",
    "en": "Next week"
  },
  "이번 주": {
    "ja": "今週",
    "en": "This week"
  },
  "주간 기록 저장": {
    "ja": "週間の記録を保存",
    "en": "Save week"
  },
  "다시 불러오기": {
    "ja": "再読み込み",
    "en": "Retry"
  },
  "이전 달": {
    "ja": "前の月",
    "en": "Previous month"
  },
  "다음 달": {
    "ja": "次の月",
    "en": "Next month"
  },
  "날짜 선택": {
    "ja": "日付を選択",
    "en": "Select date"
  },
  "일정 다시 불러오기": {
    "ja": "予定を再読み込み",
    "en": "Reload events"
  },
  "오늘로 돌아가기": {
    "ja": "今日に戻る",
    "en": "Today"
  },
  "날짜: 일일 기록 · +: 일정 추가 · 2개 표시, 나머지는 더보기": {
    "ja": "日付：日別の記録・＋：予定追加・残りは「もっと見る」",
    "en": "Date: daily plan · +: add event · More for extra events"
  },
  "기록 날짜": {
    "ja": "記録の日付",
    "en": "Plan date"
  },
  "이전 날": {
    "ja": "前の日",
    "en": "Previous day"
  },
  "다음 날": {
    "ja": "次の日",
    "en": "Next day"
  },
  "오늘의 기록": {
    "ja": "今日の記録",
    "en": "Daily plan"
  },
  "오늘의 목표": {
    "ja": "今日の目標",
    "en": "Daily goals"
  },
  "오늘 가장 중요하게 생각하는 것": {
    "ja": "今日、大切にしたいこと",
    "en": "What matters today"
  },
  "+ 목표 추가": {
    "ja": "＋ 目標を追加",
    "en": "+ Add goal"
  },
  "오늘 할 일": {
    "ja": "今日のやること",
    "en": "To-do list"
  },
  "할 일 추가": {
    "ja": "やることを追加",
    "en": "Add to-do"
  },
  "오늘의 생각, 기억하고 싶은 순간을 자유롭게 적어보세요.": {
    "ja": "今日の気持ちや覚えておきたい瞬間を書きましょう。",
    "en": "Write your thoughts and moments to remember."
  },
  "오늘의 기록 저장": {
    "ja": "今日の記録を保存",
    "en": "Save day"
  },
  "일정 편집": {
    "ja": "予定を編集",
    "en": "Edit events"
  },
  "하루 최대 5개 · 일정당 20자": {
    "ja": "1日5件まで・1件20文字",
    "en": "Up to 5 events per day · 20 characters each"
  },
  "+ 일정 추가": {
    "ja": "＋ 予定を追加",
    "en": "+ Add event"
  },
  "취소": {
    "ja": "キャンセル",
    "en": "Cancel"
  },
  "추가": {
    "ja": "追加",
    "en": "Add"
  },
  "일정 저장": {
    "ja": "予定を保存",
    "en": "Save events"
  },
  "시간 선택 → 내용 입력 → 추가 · 다시 누르면 취소": {
    "ja": "時間を選択 → 内容を入力 → 追加・もう一度押すと取消",
    "en": "Select time → enter a note → add · Click again to cancel"
  },
  "선택한 시간에 일정 추가": {
    "ja": "選択した時間に予定を追加",
    "en": "Add an event at the selected time"
  },
  "일정 내용, 최대 20자": {
    "ja": "予定の内容、20文字まで",
    "en": "Event note, up to 20 characters"
  },
  "무엇을 했나요?": {
    "ja": "何をしましたか？",
    "en": "What did you do?"
  },
  "저장하지 않은 변경 사항이 있어요.": {
    "ja": "未保存の変更があります。",
    "en": "You have unsaved changes."
  },
  "월간 일정을 불러오는 중…": {
    "ja": "月間の予定を読み込み中…",
    "en": "Loading monthly events…"
  },
  "일정을 눌러 수정하거나 삭제할 수 있어요.": {
    "ja": "予定を押すと編集・削除できます。",
    "en": "Select an event to edit or delete it."
  },
  "일정을 적어주세요": {
    "ja": "予定を入力してください",
    "en": "Enter an event"
  },
  "저장하는 중…": {
    "ja": "保存中…",
    "en": "Saving…"
  },
  "빈 일정은 입력하거나 삭제해 주세요.": {
    "ja": "空の予定を入力するか削除してください。",
    "en": "Fill in or delete empty events."
  },
  "오늘의 목표를 적어보세요": {
    "ja": "今日の目標を書きましょう",
    "en": "Write a daily goal"
  },
  "할 일을 적어보세요": {
    "ja": "やることを書きましょう",
    "en": "Write a to-do"
  },
  "로그인이 만료되었어요. 다시 로그인해 주세요. 입력 내용은 이 화면에 남아 있어요.": {
    "ja": "セッションが切れました。再ログインしてください。入力内容はこの画面に残っています。",
    "en": "Your session expired. Log in again. Your input remains on this page."
  },
  "요청을 완료하지 못했어요. 연결 상태를 확인하고 다시 시도해 주세요.": {
    "ja": "処理できませんでした。接続を確認して再試行してください。",
    "en": "The request failed. Check your connection and try again."
  },
  "저장하지 않은 내용이 있어요. 변경 사항을 버리고 날짜를 이동할까요?": {
    "ja": "未保存の内容を破棄して別の日に移動しますか？",
    "en": "Discard unsaved changes and change the date?"
  },
  "기록을 불러오는 중…": {
    "ja": "記録を読み込み中…",
    "en": "Loading your plan…"
  },
  "불러오는 중…": {
    "ja": "読み込み中…",
    "en": "Loading…"
  },
  "각 목록은 100개까지 입력할 수 있어요.": {
    "ja": "各リストは100件まで入力できます。",
    "en": "Each list can contain up to 100 items."
  },
  "빈 항목에 내용을 입력하거나 삭제해 주세요.": {
    "ja": "空の項目に入力するか削除してください。",
    "en": "Fill in or delete empty items."
  },
  "다음 날 ": {
    "ja": "翌日 ",
    "en": "Next day "
  },
  "저장하지 않은 주간 기록이 있어요.": {
    "ja": "未保存の週間記録があります。",
    "en": "You have unsaved weekly changes."
  },
  "저장하지 않은 변경 사항": {
    "ja": "未保存の変更",
    "en": "Unsaved changes"
  },
  "시간 블록 삭제": {
    "ja": "時間ブロックを削除",
    "en": "Delete time block"
  },
  "시간": {
    "ja": "時間",
    "en": "Time"
  },
  "이미 기록한 시간과 겹쳐요. 다른 시간대를 선택해 주세요.": {
    "ja": "記録済みの時間と重なっています。別の時間を選んでください。",
    "en": "This overlaps an existing block. Choose another time."
  },
  "다시 로그인해 주세요. 현재 입력한 기록은 화면에 남아 있어요.": {
    "ja": "再ログインしてください。入力内容は画面に残っています。",
    "en": "Log in again. Your input remains on this page."
  },
  "주간 기록 요청에 실패했어요. 연결을 확인하고 다시 시도해 주세요.": {
    "ja": "週間記録の処理に失敗しました。接続を確認して再試行してください。",
    "en": "Weekly request failed. Check your connection and try again."
  },
  "저장하지 않은 주간 기록을 버리고 이동할까요?": {
    "ja": "未保存の週間記録を破棄して移動しますか？",
    "en": "Discard unsaved weekly changes and continue?"
  },
  "주간 기록을 불러오는 중…": {
    "ja": "週間記録を読み込み中…",
    "en": "Loading weekly plan…"
  },
  "05:00부터 다음 날 03:00까지 · 30분 단위": {
    "ja": "05:00〜翌03:00・30分単位",
    "en": "05:00–03:00 next day · 30-minute steps"
  },
  "주간 기록을 저장하는 중…": {
    "ja": "週間記録を保存中…",
    "en": "Saving weekly plan…"
  },
  "주간 전환을 완료하지 못했어요. 주간 기록의 변경 사항 또는 연결 상태를 확인해 주세요.": {
    "ja": "週間表示に切り替えられませんでした。変更内容または接続を確認してください。",
    "en": "Could not switch weeks. Check unsaved changes or your connection."
  },
  "시간 선택을 취소했어요.": {
    "ja": "時間の選択を取り消しました。",
    "en": "Time selection cancelled."
  },
  "일정 내용을 입력한 뒤 추가해 주세요.": {
    "ja": "内容を入力してから追加してください。",
    "en": "Enter a note, then add the event."
  },
  "선택한 일정을 추가하거나 취소해 주세요.": {
    "ja": "選択した予定を追加するか取り消してください。",
    "en": "Add or cancel the selected event first."
  },
  "{date} 선택": {
    "ja": "{date}を選択",
    "en": "Select {date}"
  },
  "{date} 일정 추가": {
    "ja": "{date}の予定を追加",
    "en": "Add event on {date}"
  },
  "{date} 일정 {title} 수정": {
    "ja": "{date}の予定「{title}」を編集",
    "en": "Edit {title} on {date}"
  },
  "+{count}개 더보기": {
    "ja": "＋{count}件を見る",
    "en": "+{count} more"
  },
  "{date} 일정 전체 {count}개 보기": {
    "ja": "{date}の予定{count}件を見る",
    "en": "View all {count} events on {date}"
  },
  "{date} 일정": {
    "ja": "{date}の予定",
    "en": "Events on {date}"
  },
  "일정 {index}": {
    "ja": "予定 {index}",
    "en": "Event {index}"
  },
  "일정 {index} 삭제": {
    "ja": "予定 {index} を削除",
    "en": "Delete event {index}"
  },
  "{done} / {total} 완료": {
    "ja": "{done} / {total} 完了",
    "en": "{done} / {total} done"
  },
  "목표": {
    "ja": "目標",
    "en": "Goal"
  },
  "할 일": {
    "ja": "やること",
    "en": "To-do"
  },
  "{type} {index} 완료": {
    "ja": "{type} {index} 完了",
    "en": "Complete {type} {index}"
  },
  "{type} {index}": {
    "ja": "{type} {index}",
    "en": "{type} {index}"
  },
  "{index}번 항목 삭제": {
    "ja": "項目 {index} を削除",
    "en": "Delete item {index}"
  },
  "{time} 저장 완료": {
    "ja": "{time} 保存完了",
    "en": "Saved {time}"
  },
  "{date} {time} 메모, 최대 20자": {
    "ja": "{date} {time} メモ、20文字まで",
    "en": "{date} {time} note, up to 20 characters"
  },
  "시작 시간 조절. 위아래 방향키로 30분씩 변경": {
    "ja": "開始時間を調整。上下キーで30分ずつ変更",
    "en": "Adjust start time. Arrow keys change by 30 minutes"
  },
  "종료 시간 조절. 위아래 방향키로 30분씩 변경": {
    "ja": "終了時間を調整。上下キーで30分ずつ変更",
    "en": "Adjust end time. Arrow keys change by 30 minutes"
  },
  "{date} 일일 기록 열기": {
    "ja": "{date}の日別記録を開く",
    "en": "Open daily plan for {date}"
  },
  "{date} {time} 시간 선택": {
    "ja": "{date} {time}を選択",
    "en": "Select {date} {time}"
  },
  "선택 취소": {
    "ja": "選択を取り消す",
    "en": "Cancel selection"
  },
  "메인 메뉴": {
    "ja": "メインメニュー",
    "en": "Main menu"
  },
  "마이플래너 소개": {
    "ja": "マイプランナーについて",
    "en": "About"
  },
  "로그인": {
    "ja": "ログイン",
    "en": "Log in"
  },
  "회원가입": {
    "ja": "新規登録",
    "en": "Sign up"
  },
  "시작하기 ↗": {
    "ja": "はじめる ↗",
    "en": "Get started ↗"
  },
  "빼곡한 하루보다,": {
    "ja": "予定いっぱいの一日より、",
    "en": "Less busy,"
  },
  "나다운 하루.": {
    "ja": "自分らしい一日を。",
    "en": "more you."
  },
  "종이에 적던 작은 계획과 하루의 기록을 한곳에.": {
    "ja": "紙に書いていた小さな計画と日々の記録を、一か所に。",
    "en": "Your paper plans and daily reflections, together."
  },
  "일주일의 흐름을 보고, 오늘에 집중해 보세요.": {
    "ja": "一週間の流れを見ながら、今日に集中しましょう。",
    "en": "See your week. Focus on today."
  },
  "나의 플래너 만들기 ↗": {
    "ja": "自分のプランナーを作る ↗",
    "en": "Create my planner ↗"
  },
  "플래너 열기 →": {
    "ja": "プランナーを開く →",
    "en": "Open planner →"
  },
  "작은 목표 하나, 짧은 메모 한 줄부터 시작해요.": {
    "ja": "小さな目標ひとつ、短いメモ一行から。",
    "en": "Start with one small goal and a short note."
  },
  "주간 시간표와 일일 기록 예시": {
    "ja": "週間予定と日別記録の例",
    "en": "Example weekly and daily planner"
  },
  "가벼운 산책": {
    "ja": "軽い散歩",
    "en": "A short walk"
  },
  "프로젝트 개발": {
    "ja": "プロジェクト開発",
    "en": "Project work"
  },
  "독서": {
    "ja": "読書",
    "en": "Reading"
  },
  "잠깐의 여유": {
    "ja": "ひと休み",
    "en": "A little break"
  },
  "01 — 한 주의 흐름": {
    "ja": "01 — 一週間の流れ",
    "en": "01 — Your week"
  },
  "오늘의 작은 목표": {
    "ja": "今日の小さな目標",
    "en": "A small goal for today"
  },
  "어제보다 조금 더 나아가기.": {
    "ja": "昨日より少し前へ。",
    "en": "A little better than yesterday."
  },
  "✓   아침 스트레칭": {
    "ja": "✓   朝のストレッチ",
    "en": "✓   Morning stretches"
  },
  "✓   책 10페이지 읽기": {
    "ja": "✓   本を10ページ読む",
    "en": "✓   Read 10 pages"
  },
  "□   오늘의 기록 남기기": {
    "ja": "□   今日の記録を書く",
    "en": "□   Write today's reflection"
  },
  "서두르지 않아도 괜찮아.": {
    "ja": "急がなくても大丈夫。",
    "en": "It's okay to take your time."
  },
  "내 속도로, 한 걸음씩.": {
    "ja": "自分のペースで、一歩ずつ。",
    "en": "One step at your own pace."
  },
  "02 — 오늘의 기록": {
    "ja": "02 — 今日の記録",
    "en": "02 — Your day"
  },
  "한눈에 보는 일주일": {
    "ja": "一目でわかる一週間",
    "en": "Your week at a glance"
  },
  "30분 단위 시간 블록으로": {
    "ja": "30分単位のブロックで",
    "en": "With 30-minute time blocks,"
  },
  "어디에 시간을 썼는지 기록해요.": {
    "ja": "時間の使い方を記録しましょう。",
    "en": "record how you spend your time."
  },
  "오늘에 집중하기": {
    "ja": "今日に集中する",
    "en": "Focus on today"
  },
  "목표와 할 일을 정리하고": {
    "ja": "目標とやることを整理して、",
    "en": "Organize your goals and tasks,"
  },
  "하나씩 완료하는 기쁨을 느껴요.": {
    "ja": "ひとつずつ完了する喜びを。",
    "en": "enjoy completing them one by one."
  },
  "나를 위한 기록": {
    "ja": "自分のための記録",
    "en": "Notes for yourself"
  },
  "스쳐 지나갈 생각과 순간을": {
    "ja": "過ぎゆく思いや瞬間を、",
    "en": "Capture passing thoughts and moments"
  },
  "날짜별 메모로 남겨두세요.": {
    "ja": "日付ごとのメモに残しましょう。",
    "en": "in a note for each day."
  },
  "매일 조금씩, 나를 알아가는 시간.": {
    "ja": "毎日少しずつ、自分を知る時間。",
    "en": "A little time to know yourself, every day."
  },
  "홈으로 돌아가기 ↗": {
    "ja": "ホームに戻る ↗",
    "en": "Back to home ↗"
  },
  "다시 펼치는": {
    "ja": "また開く、",
    "en": "A fresh page"
  },
  "나의 ": {
    "ja": "私の",
    "en": "for your "
  },
  "하루.": {
    "ja": "一日。",
    "en": "day."
  },
  "어제의 기록을 이어서,": {
    "ja": "昨日の記録の続きに、",
    "en": "Pick up where you left off,"
  },
  "오늘의 작은 계획을 시작해 볼까요?": {
    "ja": "今日の小さな計画を始めませんか？",
    "en": "and start a small plan for today."
  },
  "“완벽한 하루가 아니어도,": {
    "ja": "「完璧な一日でなくても、",
    "en": "“Even an imperfect day"
  },
  "기록할 가치는 충분하니까.”": {
    "ja": "記録する価値はあるから。」",
    "en": "is worth remembering.”"
  },
  "나만의 플래너가 기다리고 있어요.": {
    "ja": "あなたのプランナーが待っています。",
    "en": "Your planner is waiting for you."
  },
  "아이디 또는 비밀번호를 확인해 주세요.": {
    "ja": "ユーザーIDまたはパスワードを確認してください。",
    "en": "Check your username or password."
  },
  "가입이 완료되었어요. 로그인해 첫 기록을 시작하세요.": {
    "ja": "登録が完了しました。ログインして最初の記録を始めましょう。",
    "en": "Account created. Log in to start your first plan."
  },
  "로그아웃했어요. 다음에 또 만나요.": {
    "ja": "ログアウトしました。またお会いしましょう。",
    "en": "You're logged out. See you again."
  },
  "아이디": {
    "ja": "ユーザーID",
    "en": "Username"
  },
  "비밀번호": {
    "ja": "パスワード",
    "en": "Password"
  },
  "아이디를 입력해 주세요": {
    "ja": "ユーザーIDを入力してください",
    "en": "Enter your username"
  },
  "비밀번호를 입력해 주세요": {
    "ja": "パスワードを入力してください",
    "en": "Enter your password"
  },
  "비밀번호 표시": {
    "ja": "パスワードを表示",
    "en": "Show password"
  },
  "비밀번호 숨기기": {
    "ja": "パスワードを隠す",
    "en": "Hide password"
  },
  "비밀번호 확인 표시": {
    "ja": "確認用パスワードを表示",
    "en": "Show confirmation password"
  },
  "비밀번호 확인 숨기기": {
    "ja": "確認用パスワードを隠す",
    "en": "Hide confirmation password"
  },
  "보기": {
    "ja": "表示",
    "en": "Show"
  },
  "숨기기": {
    "ja": "隠す",
    "en": "Hide"
  },
  "로그인 →": {
    "ja": "ログイン →",
    "en": "Log in →"
  },
  "아직 계정이 없나요?": {
    "ja": "アカウントをお持ちでないですか？",
    "en": "Don't have an account?"
  },
  "오늘도 나의 속도로.": {
    "ja": "今日も自分のペースで。",
    "en": "At your own pace, today too."
  },
  "나만의 하루를": {
    "ja": "自分だけの一日を",
    "en": "The first page"
  },
  "채울 ": {
    "ja": "彩る",
    "en": "of your "
  },
  "첫 페이지.": {
    "ja": "最初のページ。",
    "en": "own day."
  },
  "대단한 계획이 아니어도 좋아요.": {
    "ja": "大きな計画でなくても大丈夫。",
    "en": "It doesn't have to be a grand plan."
  },
  "지금의 나에게 필요한 것부터 적어보세요.": {
    "ja": "今の自分に必要なことから書いてみましょう。",
    "en": "Start with what you need right now."
  },
  "작은 계획 하나가": {
    "ja": "小さな計画ひとつが、",
    "en": "One small plan"
  },
  "내일의 나를 바꿀 수도 있으니까.": {
    "ja": "明日の自分を変えるかもしれないから。",
    "en": "might change your tomorrow."
  },
  "기록을 시작할 나만의 공간을 만들어요.": {
    "ja": "記録を始める、自分だけの場所を作りましょう。",
    "en": "Create a space for your daily reflections."
  },
  "영문, 숫자, 밑줄 4~20자": {
    "ja": "英数字・アンダースコア4〜20文字",
    "en": "4–20 letters, numbers or underscores"
  },
  "로그인할 때 사용할 아이디예요.": {
    "ja": "ログインに使用するIDです。",
    "en": "This is the username you'll log in with."
  },
  "닉네임": {
    "ja": "ニックネーム",
    "en": "Nickname"
  },
  "나를 부를 이름, 2~20자": {
    "ja": "ニックネーム、2〜20文字",
    "en": "Your name, 2–20 characters"
  },
  "이메일": {
    "ja": "メールアドレス",
    "en": "Email"
  },
  "8자 이상 입력해 주세요": {
    "ja": "8文字以上で入力してください",
    "en": "Enter at least 8 characters"
  },
  "비밀번호 확인": {
    "ja": "パスワード確認",
    "en": "Confirm password"
  },
  "비밀번호를 한 번 더 입력해 주세요": {
    "ja": "パスワードをもう一度入力してください",
    "en": "Enter your password again"
  },
  "나의 첫 페이지 만들기 →": {
    "ja": "最初のページを作る →",
    "en": "Create my first page →"
  },
  "이미 계정이 있나요?": {
    "ja": "すでにアカウントをお持ちですか？",
    "en": "Already have an account?"
  },
  "아이디는 영문, 숫자, 밑줄로 4~20자 입력해 주세요.": {
    "ja": "IDは英数字とアンダースコアで4〜20文字にしてください。",
    "en": "Use 4–20 letters, numbers or underscores for your username."
  },
  "닉네임은 2~20자로 입력해 주세요.": {
    "ja": "ニックネームは2〜20文字にしてください。",
    "en": "Use 2–20 characters for your nickname."
  },
  "올바른 이메일 주소를 입력해 주세요.": {
    "ja": "正しいメールアドレスを入力してください。",
    "en": "Enter a valid email address."
  },
  "비밀번호는 8자 이상, UTF-8 기준 72바이트 이하로 입력해 주세요.": {
    "ja": "パスワードは8文字以上、UTF-8で72バイト以下にしてください。",
    "en": "Use at least 8 characters and no more than 72 UTF-8 bytes."
  },
  "비밀번호 확인이 일치하지 않아요.": {
    "ja": "確認用パスワードが一致しません。",
    "en": "Passwords don't match."
  },
  "이미 사용 중인 아이디예요.": {
    "ja": "このIDはすでに使われています。",
    "en": "This username is already in use."
  },
  "이미 사용 중인 닉네임이에요.": {
    "ja": "このニックネームはすでに使われています。",
    "en": "This nickname is already in use."
  },
  "이미 사용 중인 아이디 또는 닉네임이에요.": {
    "ja": "このIDまたはニックネームはすでに使われています。",
    "en": "This username or nickname is already in use."
  },
  "비밀번호는 UTF-8 기준 72바이트 이하로 입력해 주세요.": {
    "ja": "パスワードはUTF-8で72バイト以下にしてください。",
    "en": "Use no more than 72 UTF-8 bytes for your password."
  },
  "비밀번호가 일치하지 않아요.": {
    "ja": "パスワードが一致しません。",
    "en": "Passwords don't match."
  },
  "마이플래너 · 오늘의 기록": {
    "ja": "マイプランナー · 今日の記録",
    "en": "My Planner · Daily plan"
  },
  "마이플래너 · 나의 속도로 채우는 하루": {
    "ja": "マイプランナー · 自分のペースで過ごす一日",
    "en": "My Planner · A day at your own pace"
  },
  "로그인 · 마이플래너": {
    "ja": "ログイン · マイプランナー",
    "en": "Log in · My Planner"
  },
  "회원가입 · 마이플래너": {
    "ja": "新規登録 · マイプランナー",
    "en": "Sign up · My Planner"
  }
};
    Object.assign(messages, {
        '최근 기록 이름': {ja:'最近の記録名',en:'Recent record names'},
        '남은 집중 시간': {ja:'残りの集中時間',en:'Focus time remaining'},
        '남은 휴식 시간': {ja:'残りの休憩時間',en:'Break time remaining'},
        "게스트 기록은 이 브라우저에만 저장돼요. 브라우저 데이터를 지우면 삭제되며, 계정 기록과는 별개예요.": {"ja": "ゲストの記録はこのブラウザだけに保存されます。ブラウザのデータを削除すると消去され、アカウントの記録とは別です。", "en": "Guest records stay in this browser, separate from your account. Clearing browser data deletes them."},
        "로그인 없이 게스트로 시작 →": {"ja": "ログインせずゲストで始める →", "en": "Continue as guest →"},
        "브라우저 저장소를 읽을 수 없어요. 저장소 설정을 확인해 주세요.": {"ja": "ブラウザの保存設定を確認してください。", "en": "Unable to read browser storage. Check your storage settings."},
        "브라우저에 저장하지 못했어요. 저장 공간과 설정을 확인해 주세요.": {"ja": "保存できません。空き容量と保存設定を確認してください。", "en": "Unable to save in this browser. Check available storage and settings."},
        "포모도로 기록": {"ja": "ポモドーロ記録", "en": "Focus records"},
        "+ 타이머": {"ja": "+ タイマー", "en": "+ Timer"},
        "집중 시간": {"ja": "集中時間", "en": "Focus time"},
        "타이머 닫기": {"ja": "タイマーを閉じる", "en": "Close timer"},
        "창을 닫으면 기록이 종료돼요. 기록은 실제 오늘 날짜에 저장돼요.": {"ja": "画面を閉じると記録は終了します。実際の今日の日付で保存されます。", "en": "Closing this window ends the record. Time is saved against today’s actual date."},
        "기록 이름": {"ja": "記録名", "en": "Record name"},
        "예: 독서, 코딩 공부": {"ja": "例：読書、プログラミング", "en": "e.g. Reading, coding"},
        "타이머 종류": {"ja": "タイマーの種類", "en": "Timer type"},
        "포모도로": {"ja": "ポモドーロ", "en": "Pomodoro"},
        "스톱워치": {"ja": "ストップウォッチ", "en": "Stopwatch"},
        "집중 시간 (분)": {"ja": "集中時間（分）", "en": "Focus minutes"},
        "집중": {"ja": "集中", "en": "Focus"},
        "휴식": {"ja": "休憩", "en": "Break"},
        "경과 시간": {"ja": "経過時間", "en": "Elapsed time"},
        "시작": {"ja": "開始", "en": "Start"},
        "종료하고 저장": {"ja": "終了して保存", "en": "Finish and save"},
        "다른 창에서 타이머가 실행 중이에요.": {"ja": "別の画面でタイマーが動いています。", "en": "A timer is already running in another window."},
        "기록을 저장하거나 불러오지 못했어요. 다시 시도해 주세요.": {"ja": "記録を保存・取得できません。再試行してください。", "en": "Could not save or load records. Please retry."},
        "타이머로 오늘의 집중 시간을 기록해 보세요.": {"ja": "タイマーで今日の集中時間を記録しましょう。", "en": "Track today’s focus time with the timer."},
        "시간표 밖 기록": {"ja": "時間表外", "en": "Outside timetable"},
        "휴식이 끝났어요. 다음 집중을 시작해 보세요.": {"ja": "休憩終了。次の集中を始めましょう。", "en": "Break finished. Start your next focus session."},
        "집중 완료! 5분간 쉬어가세요.": {"ja": "集中完了！5分休憩しましょう。", "en": "Focus complete! Take a five-minute break."},
        "집중 기록을 저장했어요.": {"ja": "集中記録を保存しました。", "en": "Focus record saved."},
        "기록 이름과 1~180분 사이의 시간을 입력해 주세요.": {"ja": "記録名と1〜180分の時間を入力してください。", "en": "Enter a name and a duration between 1 and 180 minutes."},
        "집중 기록이 종료되었어요.": {"ja": "集中記録が終了しました。", "en": "Your focus record has ended."},
        '로그인 상태는 30일간 유지돼요. 로그아웃하면 해제됩니다.': {ja:'ログイン状態は30日間維持されます。ログアウトすると解除されます。',en:'Stay signed in for 30 days, or until you log out.'},
        '상자에 바로 입력 · 위아래 테두리로 크기 조절 · 왼쪽 손잡이로 이동': {ja:'枠内に直接入力 · 上下の端でサイズ変更 · 左のハンドルで移動',en:'Type in the block · Resize from its edges · Drag the left handle to move'},
        '일정 이동. 방향키로 날짜와 시간 변경': {ja:'予定を移動。矢印キーで日付と時刻を変更',en:'Move event. Use arrow keys to change day and time'},
        '날짜: 일일 기록 · +: 일정 추가 · 3개 표시, 나머지는 더보기': {ja:'日付：デイリー · +：予定追加 · 3件表示、残りはもっと見る',en:'Date: daily plan · +: add event · 3 shown, More for the rest'},
        'Memo':{ja:'メモ',en:'Memo'},
        '일':{ja:'日',en:'Sun'}, '월':{ja:'月',en:'Mon'}, '화':{ja:'火',en:'Tue'},
        '수':{ja:'水',en:'Wed'}, '목':{ja:'木',en:'Thu'}, '금':{ja:'金',en:'Fri'}, '토':{ja:'土',en:'Sat'}
    });
    for (const key of Object.keys(messages)) { if (key.trim() !== key) messages[key.trim()] = messages[key]; }
    let language = document.documentElement.lang;
    const locale = () => ({ko:'ko-KR', ja:'ja-JP', en:'en-US'}[language]);
    const t = (source, values = {}) => {
        const message = language === 'ko' ? source : (messages[source]?.[language] || source);
        return message.replace(/\{(\w+)\}/g, (_, key) => String(values[key] ?? `{${key}}`));
    };
    const remember = (key, value) => { try { localStorage.setItem(key, value); } catch {} };
    // Capture only server-rendered interface text, never user-entered planner content.
    const textBindings = [], attributeBindings = [];
    const walker = document.createTreeWalker(document.documentElement, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
        const node = walker.currentNode;
        if (node.parentElement?.closest('script,style,textarea,option')) continue;
        const source = node.textContent.trim();
        if (messages[source]) textBindings.push({node,source,leading:node.textContent.match(/^\s*/)[0],trailing:node.textContent.match(/\s*$/)[0]});
    }
    document.querySelectorAll('[placeholder],[aria-label]').forEach(node => {
        for (const attribute of ['placeholder','aria-label']) {
            const source = node.getAttribute(attribute);
            if (messages[source]) attributeBindings.push({node,attribute,source});
        }
    });
    const themeButton = document.getElementById('theme-setting');
    const updateTheme = () => {
        const dark = document.documentElement.dataset.theme === 'dark';
        themeButton.setAttribute('aria-pressed', String(dark));
        themeButton.setAttribute('aria-label', t(dark ? '라이트 모드' : '다크 모드'));
        themeButton.title = t(dark ? '라이트 모드' : '다크 모드');
        themeButton.textContent = dark ? '☀' : '☾';
    };
    const apply = () => {
        document.documentElement.lang = language;
        textBindings.forEach(({node,source,leading,trailing}) => { if (node.isConnected) node.textContent = leading + t(source) + trailing; });
        attributeBindings.forEach(({node,attribute,source}) => node.setAttribute(attribute,t(source)));
        updateTheme();
    };
    // Re-translate status text without touching user data or resetting unsaved inputs.
    const currentMessage = text => {
        for (const [source, translations] of Object.entries(messages)) {
            if (source.includes('{')) continue;
            if ([source,translations.ja,translations.en].includes(text)) return t(source);
        }
        return text;
    };
    window.plannerI18n = {t, locale, get language() { return language; }};
    window.plannerSavedAt = () => t('{time} 저장 완료', {time:new Intl.DateTimeFormat(locale(), {
        year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',second:'2-digit',hourCycle:'h23'
    }).format(new Date())});
    const languageSelect = document.getElementById('language-setting');
    languageSelect.value = language;
    languageSelect.addEventListener('change', () => {
        language = languageSelect.value; remember('planner.language',language); apply();
        document.querySelectorAll('[role=status]').forEach(node => { node.textContent = currentMessage(node.textContent); });
        window.dispatchEvent(new Event('planner-language-change'));
    });
    window.addEventListener('planner-country-language', event => {
        language = event.detail; languageSelect.value = language; apply();
        window.dispatchEvent(new Event('planner-language-change'));
    });
    themeButton.addEventListener('click', () => {
        document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        remember('planner.theme',document.documentElement.dataset.theme); updateTheme();
    });
    apply();
})();
