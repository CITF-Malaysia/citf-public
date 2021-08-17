## Documentation for vaccination datasets

### File naming convention

1) `vax_malaysia.csv`: Static name; file is updated by 0200hrs daily
2) `vax_state.csv`: Static name; file is updated by 0200hrs daily

### Variables

1) `date`: yyyy-mm-dd format; data correct as of 2359hrs on that date
2) `state`: Name of state (present in state file, but not country file)
3) `daily_partial`: 1st doses (for double-dose vaccines) delivered between 0000 and 2359 on date
4) `daily_full`: 2nd doses (for single-dose vaccines) and 1-dose vaccines (e.g. Cansino) delivered between 0000 and 2359 on date.
5) `daily` = `daily_partial` + `daily_full`
6) `cumul_partial` = sum of `daily_partial` for all T <= `date`
7) `cumul_full` = sum of `daily_full` for all T <= `date`
8) `cumul` = `cumul_partial` + `cumul_full`
9) `x1`and `x2` = 1st and 2nd doses of double-dose vaccine type `x` delivered between 0000 and 2359 on date, where `x` can be `pfizer`, `sinovac` or `astra`
10) `x` = doses of single-dose vaccine type `x` delivered between 0000 and 2359 on date, where `x` can be `cansino`
11) `pending` = doses delivered that are 'quarantined' in the Vaccine Management System due to errors and/or inconsistencies in vaccine bar code, batch number, et cetera; these problems are usually resolved soon and affect ~0.1% of all records on a rolling basis. `pending` records for dates far in the past are not unresolved errors, but rather reflect backdated manual uploads, including the records of those returning from overseas and registering vaccinations locally.

### Methodological choices
+ For the purposes of reporting doses delivered, `total_cumul` = `dose1_cumul` + `dose2_cumul`. However, when counting the number of _unique individuals_ who have been vaccinated, note that `dose2_cumul` is a perfect subset of `dose1_cumul` - everyone who received a 2nd dose also shows up in the 1st dose count. As such, the total number of individuals who have received _at least_ 1 dose is exactly equal to `dose1_cumul`. 
+ With substantial outreach efforts in areas with poor internet access, vaccinations (which are normally tracked in real time) have to be documented offline (think Excel sheets and paper forms). Given that outreach programs may last days at a time, records of these vaccinations may only be uploaded and consolidated a few days after the day on which they occured. Consequently, we may revise the dataset from time to time if more data is reported for dates already contained within the datasets. These revisions will typically cause vaccination counts to increase, though minor decreases may be observed if there are corrections to dosage dates after they are recorded and published under another day's data. Thus far, revsisions have been made on:
     + [17th July](https://github.com/CITF-Malaysia/citf-public/commit/2f3100bce891e34c660471ac4dc96dddb911e6eb#diff-61b43ea1f6043e3ce51f4264320ef8907ad059425fc3bcf7cc9f4c20fac3b025)
     + [25th July](https://github.com/CITF-Malaysia/citf-public/commit/1e49d7268e546c325e83fbd9ce4ca0b3c1186756#diff-61b43ea1f6043e3ce51f4264320ef8907ad059425fc3bcf7cc9f4c20fac3b025)
     + [1st August](https://github.com/CITF-Malaysia/citf-public/commit/14c8ab854257e369b6a43f9b7ae97f58c92cef42#diff-61b43ea1f6043e3ce51f4264320ef8907ad059425fc3bcf7cc9f4c20fac3b025) - also reflecting integration of SelVAX transactions
     + [8th August](https://github.com/CITF-Malaysia/citf-public/commit/8f6b68885e82a99de6040acb1cf33adafd360c64#diff-61b43ea1f6043e3ce51f4264320ef8907ad059425fc3bcf7cc9f4c20fac3b025)
     + [15th August](https://github.com/CITF-Malaysia/citf-public/commit/f9206aed251613c3492f7b9fa01bd8aaffd2c9d5)
