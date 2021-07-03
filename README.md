# Open data on Malaysia's National Covid-​19 Immunisation Programme 

**We will continually maintain and improve the breadth and granularity of data in this repo.**
+ Documentation and data descriptions contained within subfolders. 
+ In the spirit of open sourcing, we welcome pull requests to share scripts, algorithms, and other neat tricks - these will be merged into `main/contrib/`. However, CITF does not guarantee the veracity or functionality of any code or data at that path.
+ To request more data, submit a pull request to [the public wishlist](https://github.com/CITF-Malaysia/citf-public/blob/main/WISHLIST.md).

---

**Vaccination**
1) `vax_malaysia.csv`: Daily and cumulative vaccination at country level, as at 2359 of date.
2) `vax_state.csv`: Daily and cumulative vaccination at state level, as at 2359 of date.

**Registration**
1) `vaxreg_malaysia.csv`: Cumulative registrations for vaccination at country level, as at 2359 of date.
2) `vaxreg_state.csv`: Cumulative registrations vaccination at state level, as at 2359 of date.

**Static data**

1) `population.csv`: Total, adult (18+), and elderly (60+) population at state level.

_Static data will (probably) remain unchanged for the duration of the program, barring an update from the source, e.g. if DOSM makes an update to population estimates. We provide this data here not to supersede the source, but rather to be transparent about the data we use to compute key statistics e.g. the % of the population that is vaccinated. We also hope this ensures synchronisation (across various independent analysts) of key statistics down to the Nth decimal place._
