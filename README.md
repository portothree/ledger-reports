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

`$ ledger -f drewr3.dat balance ^assets ^liabilities`

```
         $ -3,804.00  Assets
          $ 1,396.00    Checking
             $ 30.00      Business
         $ -5,200.00    Savings
            $ -63.60  Liabilities
            $ -20.00    MasterCard
            $ 200.00    Mortgage:Principal
           $ -243.60    Tithe
--------------------
         $ -3,867.60
```
#### Current balance (including virtual/budget entries

`$ ledger -f drewr3.dat balance`

```
         $ -3,804.00  Assets
          $ 1,396.00    Checking
             $ 30.00      Business
         $ -5,200.00    Savings
         $ -1,000.00  Equity:Opening Balances
          $ 6,654.00  Expenses
          $ 5,500.00    Auto
             $ 20.00    Books
            $ 300.00    Escrow
            $ 334.00    Food:Groceries
            $ 500.00    Interest:Mortgage
         $ -2,030.00  Income
         $ -2,000.00    Salary
            $ -30.00    Sales
            $ -63.60  Liabilities
            $ -20.00    MasterCard
            $ 200.00    Mortgage:Principal
           $ -243.60    Tithe
--------------------
           $ -243.60
```
#### Current real balance

`$ ledger -R -f drewr3.dat balance`

```
         $ -3,804.00  Assets
          $ 1,396.00    Checking
             $ 30.00      Business
         $ -5,200.00    Savings
         $ -1,000.00  Equity:Opening Balances
          $ 6,654.00  Expenses
          $ 5,500.00    Auto
             $ 20.00    Books
            $ 300.00    Escrow
            $ 334.00    Food:Groceries
            $ 500.00    Interest:Mortgage
         $ -2,030.00  Income
         $ -2,000.00    Salary
            $ -30.00    Sales
            $ 180.00  Liabilities
            $ -20.00    MasterCard
            $ 200.00    Mortgage:Principal
--------------------
                   0
```
#### Current month budget

`$ ledger -f drewr3.dat -b 2021-11-01 -e 2021-11-02 reg ^Budget$ --invert --subtotal`

```
```
