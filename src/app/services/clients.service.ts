import { Injectable, signal } from '@angular/core';
import { Client, ClientFormValue } from '../models/client.model';

@Injectable({
  providedIn: 'root',
})
export class ClientsService {
  private nextId = 3;

  private readonly _clients = signal<Client[]>([
    {
      id: 1,
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 555 123 4567',
      company: 'Acme Corp',
      status: 'Active',
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      email: 'sarah.johnson@example.com',
      phone: '+1 555 987 6543',
      company: 'BlueWave Ltd',
      status: 'Inactive',
    },
  ]);

  readonly clients = this._clients.asReadonly();

  addClient(client: ClientFormValue): void {
    const newClient: Client = {
      id: this.nextId++,
      ...client,
    };

    this._clients.update((list) => [newClient, ...list]);
  }

  removeClient(id: number): void {
    this._clients.update((list) => list.filter((client) => client.id !== id));
  }

  updateClient(id: number, updated: ClientFormValue): void {
    this._clients.update((clients) =>
      clients.map((client) =>
        client.id === id
          ? {
              ...client,
              ...updated,
            }
          : client,
      ),
    );
  }
}
