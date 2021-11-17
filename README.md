# Ledger live README

This README file is being updated periodically to include the current balance and other ledger outputs.

### Git messages standard

-   `fin:` for finance related updates (outflow/inflow entries)
-   `docs:` README updates

### Transactions

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

** Transactions with `[]` or `()` are [virtual postings](https://www.ledger-cli.org/3.0/doc/ledger3.html#Virtual-postings)

#### Current net worth

`$ ledger -f ./drewr3.dat balance ^Assets ^Equity ^Liabilities`

```
         $ -3,804.00  Assets
          $ 1,396.00    Checking
             $ 30.00      Business
         $ -5,200.00    Savings
         $ -1,000.00  Equity:Opening Balances
            $ -63.60  Liabilities
            $ -20.00    MasterCard
            $ 200.00    Mortgage:Principal
           $ -243.60    Tithe
--------------------
         $ -4,867.60
```

#### Current balance

`$ ledger -R -f ./drewr3.dat balance ^Assets`

```
         $ -3,804.00  Assets
          $ 1,396.00    Checking
             $ 30.00      Business
         $ -5,200.00    Savings
--------------------
         $ -3,804.00
```

#### Current budget balance

`$ ledger -f ./drewr3.dat balance ^Budget`

```
```

#### Current month expenses

`$ ledger -f ./drewr3.dat -b 2021-11-01 -e 2021-11-30 balance ^Expenses`

```
```

