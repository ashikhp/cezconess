import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';

const API_BASE = "https://www.hrm-app-portal.com/hrm-app-api/index.php/"

export async function callAPI(api, params) {
    const res = await AsyncStorage.getItem('sessionData');
    const ses_data = JSON.parse(res);
    const header = {
        'Content-Type': 'application/json',
        'Authtoken': ses_data && ses_data.AuthToken ? ses_data.AuthToken : null,
    }
    const response = await axios.post(`${API_BASE}${api}`,
        params, { headers: header }
    )

    return response.data;

}
