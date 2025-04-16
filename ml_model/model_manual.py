import numpy as np
import skfuzzy as fuzz
import skfuzzy.control as ctrl
from flask import Flask
import dash
from dash import dcc, html
from dash.dependencies import Input, Output, State
import plotly.graph_objs as go
from datetime import datetime

# Flask app
server = Flask(__name__)

# Dash app
app = dash.Dash(__name__, server=server, routes_pathname_prefix='/')

# History buffer
history = []

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

# Dash Layout
app.layout = html.Div([
    html.H1("Smart Grid Energy Management", style={'textAlign': 'center'}),
    html.Div([
        html.Label("Energy Demand"),
        dcc.Input(id='energy_demand', type='number', min=0, max=100, step=1, value=50,
                  style={'width': '30%', 'padding': '10px', 'borderRadius': '8px',
                         'border': '2px solid #000', 'textAlign': 'center', 'fontSize': '18px'}),
        html.Label("Available Power"),
        dcc.Input(id='available_power', type='number', min=0, max=100, step=1, value=50,
                  style={'width': '30%', 'padding': '10px', 'borderRadius': '8px',
                         'border': '2px solid #000', 'textAlign': 'center', 'fontSize': '18px'}),
        html.Label("Grid Load"),
        dcc.Input(id='grid_load', type='number', min=0, max=100, step=1, value=50,
                  style={'width': '30%', 'padding': '10px', 'borderRadius': '8px',
                         'border': '2px solid #000', 'textAlign': 'center', 'fontSize': '18px'}),
        html.Button('Calculate', id='calculate-button', n_clicks=0,
                    style={'backgroundColor': '#007BFF', 'color': 'white',
                           'padding': '10px 20px', 'border': 'none',
                           'borderRadius': '8px', 'cursor': 'pointer',
                           'fontSize': '16px', 'marginTop': '10px'}),
    ], style={'display': 'flex', 'flexDirection': 'column', 'gap': '10px', 'alignItems': 'center'}),
    html.Div(id='output-container', style={'textAlign': 'center', 'marginTop': '20px', 'fontSize': '20px'}),
    dcc.Graph(id='output-graph')
])

# Callback for logic + graph
@app.callback(
    [Output('output-container', 'children'),
     Output('output-graph', 'figure')],
    [Input('calculate-button', 'n_clicks')],
    [State('energy_demand', 'value'),
     State('available_power', 'value'),
     State('grid_load', 'value')]
)
def update_output(n_clicks, ed, aps, gl):
    if n_clicks > 0:
        power_sim.input['energy_demand'] = ed
        power_sim.input['available_power'] = aps
        power_sim.input['grid_load'] = gl
        power_sim.compute()
        adjustment = power_sim.output['power_adjustment']

        timestamp = datetime.now().strftime("%H:%M:%S")
        history.append({
            'time': timestamp,
            'ed': ed,
            'aps': aps,
            'gl': gl,
            'adj': adjustment
        })

        times = [h['time'] for h in history]
        ed_vals = [h['ed'] for h in history]
        aps_vals = [h['aps'] for h in history]
        gl_vals = [h['gl'] for h in history]
        adj_vals = [h['adj'] for h in history]

        fig = go.Figure()
        fig.add_trace(go.Scatter(x=times, y=ed_vals, name='Energy Demand', mode='lines+markers', line=dict(color='royalblue')))
        fig.add_trace(go.Scatter(x=times, y=aps_vals, name='Available Power', mode='lines+markers', line=dict(color='mediumturquoise')))
        fig.add_trace(go.Scatter(x=times, y=gl_vals, name='Grid Load', mode='lines+markers', line=dict(color='orange')))
        fig.add_trace(go.Scatter(x=times, y=adj_vals, name='Power Adjustment', mode='lines+markers',
                                 line=dict(color='red', dash='dash'), marker=dict(symbol='circle')))

        fig.update_layout(
            title='Real-Time Power Demand and Prediction',
            xaxis_title='Time',
            yaxis_title='Value (%)',
            plot_bgcolor='#fff',
            legend=dict(x=0, y=1),
            height=500
        )

        return f"Recommended Power Adjustment: {adjustment:.2f}", fig

    return "", go.Figure()

# Run server
if __name__ == '__main__':
    app.run_server(debug=True, port=5000, host='localhost')
