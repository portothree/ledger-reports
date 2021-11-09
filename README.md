# Ledger live README

This README file is being updated periodically to include the current balance and other ledger outputs.

#### Git messages standard

`fin:` for finance related updates (outflow/inflow entries)
`docs:` README updates

#### Current balance
`ledger -f $LEDGER_FILE_PATH balance`

#### Current real* balance
* Balance without virtual transactions
`ledger -R -f $LEDGER_FILE_PATH balance`

#### Current net worth
`ledger -f $LEDGER_FILE_PATH balance ^assets ^liabilities`

```
\n\n Blablabla \n
```
