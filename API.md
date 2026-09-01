# Chapaa Hub API Quick Reference

All protected routes use the HTTP-only `token` cookie created by login/register.

## Auth

- `POST /auth/register` body: `username,email,password`
- `POST /auth/login` body: `email,password`
- `GET /auth/logout`

## Transactions

- `GET /expenses`
- `GET /expenses/:id`
- `GET /expenses/:category` (legacy category filter)
- `GET /expenses/user`
- `GET /expenses/income`
- `GET /expenses/total`
- `POST /expenses/newExpense` body: `description,amount,category,date?`
- `POST /expenses/topup` body: `description,amount`
- `PUT /expenses/:id` body: `description,amount,category,date?`
- `DELETE /expenses/:id`

Use category `income` for income transactions. Every other category is treated as an expense.

## Goals

- `GET /goals`
- `GET /goals/:id`
- `POST /goals` body: `name,target_amount,description?,deadline?`
- `PUT /goals/:id`
- `DELETE /goals/:id`
- `POST /goals/:id/contribute` body: `amount,note?`
- `POST /goals/:id/withdraw` body: `amount,note?`
- `GET /goals/:id/contributions`

## Budgets

- `GET /budgets?month=YYYY-MM`
- `GET /budgets/alerts?month=YYYY-MM`
- `GET /budgets/:id`
- `POST /budgets` body: `category,limit_amount,month?`
- `PUT /budgets/:id`
- `DELETE /budgets/:id`

## Analytics

- `GET /analytics/overview`
- `GET /analytics/health`
- `GET /analytics/monthly?months=6`
- `GET /analytics/categories?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /analytics/insights`

## Reports

- `GET /reports/monthly?month=YYYY-MM`
- `GET /reports/csv?month=YYYY-MM`

## Profile/settings

- `GET /profile`
- `PUT /profile` body: `username,email`
- `PUT /profile/password` body: `currentPassword,newPassword`
- `GET /settings`
- `PUT /settings`

## Recurring transactions

- `GET /recurring`
- `POST /recurring` body: `description,amount,category,transaction_type,frequency,next_run`
- `PUT /recurring/:id`
- `DELETE /recurring/:id`

## Notifications

- `GET /notifications`
- `PATCH /notifications/:id/read`
- `DELETE /notifications`
