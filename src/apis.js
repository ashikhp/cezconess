
import axios from 'axios';
import { Alert } from 'react-native';
import { callAPI } from './apiCallFunction'

const API = {
  LOGIN: "ess/Login/Auth",
  DASHBOARD: "ess/Dashboard/home",
  ADDTIME: "ess/Attendance/attendance_insert",
  LOGOUT: "ess/Login/logout",
  ATTENDANCE: "ess/Attendance/attendance",
  UPDATE_USER_NAME: "ess/My_account/update_username",
  UPDATE_PASSWORD: "ess/My_account/update_password",
  USER_SIGNATURE: "ess/My_account/get_user_signature",
  UPDATE_SIGNATURE: "ess/My_account/update_user_signature",
  DETAILS: "ess/Attendance/attendance_details",
  EMPLOYEE_DETAILS: "Employees/employee_details",
}

export async function Login(params) {
  return callAPI(API.LOGIN, params);
}

export async function Logout(params) {
  return callAPI(API.LOGOUT, params);
}
export async function getDashboard(params) {
  return callAPI(API.DASHBOARD, params);
}
export async function attendance_add(params) {
  return callAPI(API.ADDTIME, params);
}
export async function getAttendance(params) {
  return callAPI(API.ATTENDANCE, params);
}

export async function ChangeUserName(params) {
  return callAPI(API.UPDATE_USER_NAME, params);
}

export async function ResetPassword(params) {
  return callAPI(API.UPDATE_PASSWORD, params);
}

export async function UserSignature(params) {
  return callAPI(API.USER_SIGNATURE, params);
}

export async function UpdateSignature(params) {
  return callAPI(API.UPDATE_SIGNATURE, params);
}
export async function getDetails(params) {
  return callAPI(API.DETAILS, params);
}
export async function getEmployeeDetails(params) {
  return callAPI(API.EMPLOYEE_DETAILS, params);
}



