# <span style="color:lime">LINE Developers</span>のBotを使ったリマインドBot
## できること
1. 予定を登録
2. 予定を削除
3. 登録されている予定を期間を決めて確認
4. 日付を指定して予定を確認
5. 曜日ごとの時間割を確認
6. あらかじめ決まっている日付のフォーマットと曜日を変換
7. 素因数分解
---
## 全体を通して共通すること
- 日付のフォーマットは`yyyyMMdd`の形。 ( 20230416 )
- 日付は曜日1文字でも可能。 (20230412 = 水(曜日))
- コマンドキーは大文字と小文字を問わない。
- LINE Botを使うため、<span style="color:lime">LINE Developersアカウント</span>を1つ持っておく必要がある。
- 予定のデータベースにGoogleスプレッドシートを使うため、<span style="color:#3aa9ff">Googleアカウント</span>を1つ持っておく必要がある。
---
## 1.予定を登録
```
r
登録する予定の日付
登録したい予定の名称
```
スプレッドシートに
||A|B|
|:---:|:---:|:---:|
|1|日付|予定の名称|
||||

として記録される。<br>

---
## 2.予定を削除
```
n
削除する予定の日付
削除したい予定の名称
```
スプレッドシートの
||A|B|
|:---:|:---:|:---:|
|1|日付|予定の名称|
||||

の列が削除される。<br>

---
## 3.登録されている予定を期間を決めて確認
```
c
```
登録されている予定のうち、当日を含む7日分の予定が返信する。<br><br>
```
c
日付
```
当日から指定日までの予定をすべて返信する。(処理が長くなるので30日以内に制限)<br>

---
## 4.日付を指定して予定を確認
```
s
日付
```
指定日のみの予定を返信する。<br>

---
## 5.曜日ごとの時間割を確認
```
t
```
0時から15時は当日、15時から0時は翌日の時間割と予定を返信する。<br><br>
```
t
日付
```
指定日の時間割と予定を返信する。<br>

---
## 6.あらかじめ決まっている日付のフォーマットと曜日を変換
```
e
日付
```
`yyyyMMdd` (20230416) の日付を送ると対応する曜日を返信する。<br>曜日1文字を送ると1週間以内の対応する日付を返信する。

---
## 7.素因数分解
```
f
1以上の整数値
```
送られてきた整数値を素因数分解した状態で返信する。<br><br>

---
# License
The source code is licensed MIT. The website content is licensed CC BY 4.0,see LICENSE.<br>

---
<br>

###### 初めてMarkdown書いた
