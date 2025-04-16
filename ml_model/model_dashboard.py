import numpy as np
import skfuzzy as fuzz
import skfuzzy.control as ctrl
from flask import Flask
import dash
from dash import dcc, html
from dash.dependencies import Input, Output
import plotly.graph_objs as go
import random
import datetime

# Flask app
server = Flask(__name__)

# Dash app
app = dash.Dash(__name__, server=server, routes_pathname_prefix='/')

# Define fuzzy logic variables
energy_demand = ctrl.Antecedent(np.arange(0, 101, 1), 'energy_demand')
available_power = ctrl.Antecedent(np.arange(0, 101, 1), 'available_power')
grid_load = ctrl.Antecedent(np.arange(0, 101, 1), 'grid_load')
power_adjustment = ctrl.Consequent(np.arange(-50, 51, 1), 'power_adjustment')

# Membership functions
energy_demand.automf(3)
available_power.automf(3)
grid_load.automf(3)

power_adjustment['decrease'] = fuzz.trimf(power_adjustment.universe, [-50, -25, 0])
power_adjustment['maintain'] = fuzz.trimf(power_adjustment.universe, [-10, 0, 10])
power_adjustment['increase'] = fuzz.trimf(power_adjustment.universe, [0, 25, 50])

# Define fuzzy rules
rule1 = ctrl.Rule(energy_demand['good'] | available_power['poor'] | grid_load['good'], power_adjustment['increase'])
rule2 = ctrl.Rule(energy_demand['average'] | available_power['average'] | grid_load['average'], power_adjustment['maintain'])
rule3 = ctrl.Rule(energy_demand['poor'] | available_power['good'] | grid_load['poor'], power_adjustment['decrease'])

# Control system
power_ctrl = ctrl.ControlSystem([rule1, rule2, rule3])
power_sim = ctrl.ControlSystemSimulation(power_ctrl)

# History buffer
history = []

# Dash layout with updated theme
app.layout = html.Div(style={
    'backgroundColor': '#FFFFFF',
    'padding': '30px',
    'fontFamily': 'Segoe UI, sans-serif'
}, children=[
    html.H1("Smart Grid Power Forecast Dashboard", style={
        'textAlign': 'center',
        'color': '#333333',
        'fontSize': '36px',
        'marginBottom': '10px'
    }),

    html.Div("Live simulation of Energy Demand, Available Power, Grid Load, and Predicted Adjustment.",
             style={'textAlign': 'center', 'color': '#666666', 'marginBottom': '30px'}),

    dcc.Graph(id='live-update-graph'),

    dcc.Interval(
        id='interval-component',
        interval=5000,  # 5 seconds
        n_intervals=0
    )
])

# Callback for updating the graph
@app.callback(Output('live-update-graph', 'figure'), [Input('interval-component', 'n_intervals')])
def update_graph(n):
    global history

    # Generate simulated values
    ed = random.randint(0, 100)
    aps = random.randint(0, 100)
    gl = random.randint(0, 100)

    power_sim.input['energy_demand'] = ed
    power_sim.input['available_power'] = aps
    power_sim.input['grid_load'] = gl
    power_sim.compute()
    adjustment = round(power_sim.output['power_adjustment'], 2)

    timestamp = datetime.datetime.now().strftime("%H:%M:%S")

    history.append({
        'time': timestamp,
        'energy_demand': ed,
        'available_power': aps,
        'grid_load': gl,
        'adjustment': adjustment
    })

    if len(history) > 20:
        history = history[-20:]  # keep last 100 for smoothness

    fig = go.Figure()

    fig.add_trace(go.Scatter(
        x=[h['time'] for h in history],
        y=[h['energy_demand'] for h in history],
        mode='lines+markers',
        name='Energy Demand',
        line=dict(color='#4A90E2', width=2),
        marker=dict(size=4),
    ))

    fig.add_trace(go.Scatter(
        x=[h['time'] for h in history],
        y=[h['available_power'] for h in history],
        mode='lines+markers',
        name='Available Power',
        line=dict(color='#50E3C2', width=2),
        marker=dict(size=4),
    ))

    fig.add_trace(go.Scatter(
        x=[h['time'] for h in history],
        y=[h['grid_load'] for h in history],
        mode='lines+markers',
        name='Grid Load',
        line=dict(color='#F5A623', width=2),
        marker=dict(size=4),
    ))

    fig.add_trace(go.Scatter(
        x=[h['time'] for h in history],
        y=[h['adjustment'] for h in history],
        mode='lines+markers',
        name='Power Adjustment',
        line=dict(color='#D0021B', width=3, dash='dash'),
        marker=dict(size=6),
    ))

    fig.update_layout(
        title="Real-Time Power Demand and Prediction",
        xaxis_title="Time",
        yaxis_title="Value (%)",
        paper_bgcolor='#FFFFFF',
        plot_bgcolor='#FFFFFF',
        font=dict(color='#333333'),
        xaxis=dict(
            showgrid=False,
            type='category',
            rangeslider=dict(visible=True),
            showspikes=True
        ),
        yaxis=dict(showgrid=True, gridcolor='rgba(0,0,0,0.05)'),
        hovermode='x unified',
        margin=dict(t=60, l=60, r=30, b=60),
        legend=dict(bgcolor='#FFFFFF', bordercolor='lightgray')
    )

    return fig

# Run the app
if __name__ == '__main__':
    app.run_server(debug=True, port=8050, host='0.0.0.0')
