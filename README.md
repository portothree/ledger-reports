# Ledger live README

This README file is being updated periodically to include the current balance and other ledger outputs.

#### Git messages standard

-   `fin:` for finance related updates (outflow/inflow entries)
-   `docs:` README updates

#### Transactions

Here's what a single transactions might look like:

```
2021-11-10	*	Uber
	Expenses:Transportation		EUR 3.96
	[Budget:Transportation]		EUR -3.96
	Assets:N26		EUR -3.96
	[Budget]		EUR -3.96
```

Each line explained:

-   The transaction happened at `2021-11-10`, it's cleared (`*`) and the payee was `Uber`.
-   Add `3.96` EUR to transportation expenses
-   Remove `3.96` EUR from transportation budget
-   Remove `3.96` EUR from `N26` bank account
-   Remove `3.96` EUR from `Budget` account

\*\* Transactions with `[]` or `()` are [virtual postings](https://www.ledger-cli.org/3.0/doc/ledger3.html#Virtual-postings)

#### Current balance (including virtual/budget entries)

`$ ledger -f $LEDGER_FILE_PATH balance`

```

```

#### Current real balance

`$ ledger -R -f $LEDGER_FILE_PATH balance`

```

```

#### Current net worth

`$ ledger -f $LEDGER_FILE_PATH balance ^assets ^liabilities`

```

```
