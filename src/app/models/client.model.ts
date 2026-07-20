export type ClientStatus = 'Active' | 'Inactive';

export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: ClientStatus;
}

export interface ClientFormValue {
  name: string;
  email: string;
  phone: string;
  company: string;
  status: ClientStatus;
}
