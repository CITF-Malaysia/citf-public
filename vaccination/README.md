## Documentation for vaccination datasets

### File naming convention

1) `vax_malaysia.csv`: Static name; file is updated by 0200hrs daily
2) `vax_state.csv`: Static name; file is updated by 0200hrs daily

## Variables

1) `date`: yyyy-mm-dd format; data correct as of 2359hrs on that date
2) `state`: Name of state (present in state file, but not country file)
3) `dose1_daily`: 1st doses delivered between 0000 and 2359 on date
4) `dose2_daily`: 2nd doses delivered between 0000 and 2359 on date; note that this will not equal the number of people who were fully vaccinated on a given date when Malaysia begins using single-dose vaccines (e.g. CanSino).
5) `total_daily` = `dose1_daily` + `dose2_daily`
6) `dose1_cumul` = sum of `dose1_daily` for all T <= `date`
7) `dose2_cumul` = sum of `dose2_daily` for all T <= `date`
8) `total_cumul` = `dose1_cumul` + `dose2_cumul`

**Note:** There may be occassional backseries revisions causing vaccination counts to marginally increase (never decrease) if more data is reported for dates already contained within the datasets. This is especially due to outreach efforts and/or vaccination in areas with poor internet access, which necessitates offline documentation of vaccinations delivered.
