from flask import Flask, request, jsonify
import random

app = Flask(__name__)

# Sample database (for demo purposes, use a real DB in production)
noc_applications = {}
inspections = {}
alerts = []

def ai_risk_assessment(building_data):
    # Simulating an AI-based fire risk assessment
    risk_score = random.randint(1, 100)
    return "High Risk" if risk_score > 75 else "Medium Risk" if risk_score > 40 else "Low Risk"

@app.route('/apply', methods=['POST'])
def apply_noc():
    data = request.json
    app_id = len(noc_applications) + 1
    risk_level = ai_risk_assessment(data.get('building_data', {}))
    noc_applications[app_id] = {
        'name': data['name'],
        'building_address': data['building_address'],
        'risk_level': risk_level,
        'status': 'Pending' if risk_level != "High Risk" else "Requires Review",
    }
    return jsonify({'message': 'Application submitted', 'app_id': app_id, 'risk_level': risk_level})

@app.route('/upload-docs', methods=['POST'])
def upload_docs():
    data = request.json
    app_id = data['app_id']
    if app_id in noc_applications:
        noc_applications[app_id]['documents'] = data['documents']
        return jsonify({'message': 'Documents uploaded'})
    return jsonify({'error': 'Application not found'}), 404

@app.route('/status/<int:app_id>', methods=['GET'])
def get_status(app_id):
    if app_id in noc_applications:
        return jsonify(noc_applications[app_id])
    return jsonify({'error': 'Application not found'}), 404

@app.route('/schedule-inspection', methods=['POST'])
def schedule_inspection():
    data = request.json
    app_id = data['app_id']
    if app_id in noc_applications:
        inspections[app_id] = {'date': data['date'], 'status': 'Scheduled'}
        return jsonify({'message': 'Inspection scheduled'})
    return jsonify({'error': 'Application not found'}), 404

@app.route('/alerts', methods=['GET'])
def get_alerts():
    return jsonify({'alerts': alerts})

@app.route('/iot-alert', methods=['POST'])
def iot_alert():
    data = request.json
    alert = {
        'location': data['location'],
        'severity': data['severity'],
        'time': data['time']
    }
    alerts.append(alert)
    return jsonify({'message': 'Fire alert recorded'})

if __name__ == '__main__':
    app.run(debug=True)
