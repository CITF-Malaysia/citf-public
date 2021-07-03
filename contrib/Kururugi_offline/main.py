import datetime
import pytz
import os
import csv
import urllib.request
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go

# Get the current generation time in MYT timezone
timeZ_My = pytz.timezone('Asia/Kuala_Lumpur')
now = datetime.datetime.now(timeZ_My)
current_time = now.strftime("%Y-%m-%d %H:%M:%S")

# Get datapoints from official CITF Malaysia and process as CSV with Pandas
url = "https://raw.githubusercontent.com/CITF-Malaysia/citf-public/main/vaccination/vax_malaysia.csv"
df = pd.read_csv(url)

last_date_data = df['date'].iloc[-1:].item()

# Plot the graph
vaccination_rate = px.line(df, x = 'date', y = 'total_daily',  
                            labels={
                                "date": "",
                                "total_daily": "Daily doses"
                            },
                            title='Daily Vaccination Rate (Doses)')

vaccination_rate.update_traces(line_color='#1f822c')

vaccinated_total = px.line(df, x = 'date', y = 'total_cumul',
                            labels={
                                "date": "",
                                "total_cumul": "Daily doses"
                            },
                            title='Total Vaccination Dose')
vaccinated_total.update_traces(line_color='#1f822c')


single_dose_total = df['dose1_cumul'].iloc[-1:].item()
population_total = 32764602
unvaccinated = population_total - single_dose_total

progress_frame = [{'type': 'Vaccinated', 'total': single_dose_total},
                {'type': 'Unvaccinated', 'total': unvaccinated} 
                    ]

df2 = pd.DataFrame(progress_frame)
# Pie chart
progress_total = px.pie(df2, title='Vaccination Progress (at least 1 dose)', values='total', names='type', color='type',
                        color_discrete_map={
                            'Vaccinated': '#3cb64c',
                            'Unvaccinated': '#29255f'
                        }
                        )

double_dose_total = df['dose2_cumul'].iloc[-1:].item()
population_total = 32764602
unvaccinated = population_total - double_dose_total

progress2_frame = [{'type': 'Vaccinated', 'total': double_dose_total},
                {'type': 'Unvaccinated', 'total': unvaccinated} 
                    ]

df3 = pd.DataFrame(progress2_frame)
# Pie chart
progress2_total = px.pie(df3, title='Vaccination Progress (2 doses)', values='total', names='type', color='type',
                        color_discrete_map={
                            'Vaccinated': '#3cb64c',
                            'Unvaccinated': '#29255f'
                        }
                        )


# Convert plotted graph into HTML div
daily_rate_plot = vaccination_rate.to_html(full_html=False)
daily_rate_plot2 = vaccinated_total.to_html(full_html=False)
progress_plot = progress_total.to_html(full_html=False)
progress2_plot = progress2_total.to_html(full_html=False)

# Generate day name based on date
df['date'] = pd.to_datetime(df['date'])
df['day_of_week'] = df['date'].dt.day_name()

# Plot the graph
day_trend = px.bar(df, x='day_of_week', y='total_daily', 
                    category_orders={'day_of_week': ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]},
                    labels={
                        "day_of_week": "",
                        "total_daily": "Total doses administered to date"
                    },
                    title='Doses administed by day distribution')

# Convert plotted graph into HTML div
day_trend_plot = day_trend.to_html(full_html=False)

# Get datapoints for per state in Malaysia
url = "https://raw.githubusercontent.com/CITF-Malaysia/citf-public/main/vaccination/vax_state.csv"
df = pd.read_csv(url)
df_trim = df.iloc[-16:]
df_trim = df_trim.sort_values('total_cumul')

state_progress = px.bar(df_trim, x="total_cumul", y="state", 
                        labels={
                            "total_cumul": "Doses",
                            "state": "State",
                        },
                        
                        title='Doses administed by state',

                        orientation='h')
state_plot = state_progress.to_html(full_html=False)

# Crude HTML templates
HeadTemplate = '<!DOCTYPE html><html> <head><script async src="https://www.googletagmanager.com/gtag/js?id=G-JM59LT7FPT"></script><script>window.dataLayer=window.dataLayer || []; function gtag(){dataLayer.push(arguments);}gtag(\'js\', new Date()); gtag(\'config\', \'G-JM59LT7FPT\');</script> <meta name="viewport" content="width=device-width, initial-scale=1.0"><meta property="og:image" content="https://kururugi.blob.core.windows.net/kururugi/screenshot.jpg"/><meta property="og:title" content="Vaccination Statistics Malaysia"/><meta property="og:description" content="Analysis and plotting of the official vaccination statistics data from JKJAV Malaysia"/> <style>*{box-sizing: border-box;}.header{padding: 15px;}.row::after{content: ""; clear: both; display: table;}[class*="col-"]{float: left; padding: 20px; border: 1px solid rgb(60, 182, 76);}.col-1{width: 50%;}</style> </head> <body style="background-color: #E1E8EB;"> <div class="header">'
Close = '</div>'
RowOpen = '<div class="row">'
ColOpen = '<div class="col-1">'
FootClose = '</body></html>'

# Generate the static HTML page
with open("index.html", "w") as f:
    f.write(HeadTemplate)
    f.write("<h1>Vaccination Statistics Malaysia</h1>")
    f.write("<a href='https://kururugi.blob.core.windows.net/kururugi/about.html'>Technical details & about</a><br>Coded by: Amin Husni (aminhusni@gmail.com)<br><br>")
    f.write("Data refreshed: " + current_time + " (MYT)<br>")
    f.write("Latest date in data: " + last_date_data + "<br>*For mobile, please use horizontal mode (rotate)<br>")
    f.write(Close)

    f.write(RowOpen)
    f.write(ColOpen)
    f.write(daily_rate_plot)
    f.write(Close)

    #f.write("<h2>Malaysian population: 32,764,602 people<br>Target vaccination (80%): 26,211,682</h2>")
    
    f.write(ColOpen)
    f.write(daily_rate_plot2)
    f.write(Close)
    f.write(Close)

    f.write(RowOpen)
    f.write(ColOpen)
    f.write(day_trend_plot)
    f.write(Close)
    f.write(ColOpen)
    f.write(state_plot)
    f.write(Close)
    f.write(Close)

    f.write(RowOpen)
    f.write(ColOpen)
    f.write(progress_plot)
    f.write(Close)
    f.write(ColOpen)
    f.write(progress2_plot)
    f.write(Close)
    f.write(Close)

    f.write(RowOpen)
    f.write("<br>Licenses: Official datapoint: <a href='https://www.data.gov.my/p/pekeliling-data-terbuka'>Pekeliling Pelaksanaan Data Terbuka Bil.1/2015 (Appendix B)</a>")
    f.write(Close)




