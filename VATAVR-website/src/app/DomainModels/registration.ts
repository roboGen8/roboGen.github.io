/* Registration object properties - used by backend in models/users.js */
export interface Registration {
  name: string;
  email: string;
  phoneNumber: string;
  userType: string;
  username: string;
  password: string;
  doctorName: string;
}
