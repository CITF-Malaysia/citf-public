## Documentation for registration datasets

### File naming convention

1) `vax_malaysia.csv`: Static name; file is updated daily (time may vary)
2) `vax_state.csv`: Static name; file is updated daily (time may vary)

### Variables

1) `date`: yyyy-mm-dd format; data correct as of 2359hrs on that date
2) `state`: Name of state (for the Malaysia file, `state` = `Malaysia`)
3) `total`: Number of unique registrants, with de-duplication done based on ID
4) `phase2`: Number of unique individuals eligible for Phase 2, i.e. individuals who are _at least 1_ of `elderly`, `comorb`, `oku` (note: _not_ the sum of the 3)
5) `mysj`: Number of individuals registered via MySejahtera
6) `call`: Number of individuals registered via the call centre, who _do not have_ an existing registration via MySejahtera 
7) `web`: Number of individuals registered via the website (including on-behalf-of registrations done during outreach) who _do not have_ an existing registration via MySejahtera or the call centre
8) `children`: Number of individuals below 18yo
9) `elderly`: Number of individuals aged 60yo and above
10) `comorb`: Number of individuals self-declaring at least 1 comorbidity
11) `oku`: Number of individuals self-declaring as OKU

### Methodological choices
+ We provide cumulative rater than marginal data because the primary function of reg data is as the source for appointment generation. Consequently, cumulative numbers matter much more than marginals. However, daily registrations can easily be derived from the series by doing `X_{t} - X_{t-1}` for any of the variables `X` in the dataset.
+ The descriptions of the `mysj`, `call`, and `web` variables above imply that `mysj >> call >> web` in terms of priority during de-duplication. Why? First, MySejahtera is the mode of registration that gives a user most control over their vaccination journey. Consequently, this likely provides the highest-quality and most up-to-date information (particularly when new features are launched, e.g. registration for expectant and lactating mothers). Second, registrations via the call centre are prioritised over those via the website because a human agent is verifying information gathered via the call centre. Third, web-based registrations can be (and often are) submitted on another's behalf. 
