import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { ClientsService } from '../../services/clients.service';
import { ClientDialogComponent } from '../../dialogs/client-dialog/client-dialog.component';
import { Client, ClientFormValue } from '../../models/client.model';

@Component({
  selector: 'app-clients-page',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatDialogModule, MatIconModule],
  templateUrl: './clients-page.component.html',
  styleUrl: './clients-page.component.css',
})
export class ClientsPageComponent {
  private readonly clientsService = inject(ClientsService);
  private readonly dialog = inject(MatDialog);

  readonly clients = this.clientsService.clients;
  readonly clientCount = computed(() => this.clients().length);
  readonly filters = signal({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: '',
  });

  readonly sort = signal<{
    field: keyof Client | null;
    direction: 'asc' | 'desc';
  }>({
    field: null,
    direction: 'asc',
  });

  readonly filteredClients = computed(() => {
    const filters = this.filters();

    const clients = this.clients().filter(
      (client) =>
        client.name.toLowerCase().includes(filters.name.toLowerCase()) &&
        client.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        client.phone.toLowerCase().includes(filters.phone.toLowerCase()) &&
        client.company.toLowerCase().includes(filters.company.toLowerCase()) &&
        client.status.toLowerCase().includes(filters.status.toLowerCase()),
    );

    const { field, direction } = this.sort();

    if (!field) {
      return clients;
    }

    return [...clients].sort((a, b) => {
      const first = String(a[field]).toLowerCase();
      const second = String(b[field]).toLowerCase();

      const result = first.localeCompare(second);

      return direction === 'asc' ? result : -result;
    });
  });

  openAddClientDialog(): void {
    const ref = this.dialog.open(ClientDialogComponent, {
      width: '560px',
      maxWidth: '95vw',
      disableClose: true,
      autoFocus: false,
      data: null,
    });

    ref.afterClosed().subscribe((result: ClientFormValue | null) => {
      if (result) {
        this.clientsService.addClient(result);
      }
    });
  }

  removeClient(id: number): void {
    this.clientsService.removeClient(id);
  }

  openEditClientDialog(client: Client): void {
    const ref = this.dialog.open(ClientDialogComponent, {
      width: '560px',
      maxWidth: '95vw',
      disableClose: true,
      autoFocus: false,
      data: {
        name: client.name,
        email: client.email,
        phone: client.phone,
        company: client.company,
        status: client.status,
      },
    });

    ref.afterClosed().subscribe((result: ClientFormValue | null) => {
      if (result) {
        this.clientsService.updateClient(client.id, result);
      }
    });
  }

  updateFilter(field: keyof ReturnType<typeof this.filters>, value: string): void {
    this.filters.update((filters) => ({
      ...filters,
      [field]: value,
    }));
  }

  sortBy(field: keyof Client): void {
    this.sort.update((current) => {
      if (current.field !== field) {
        return {
          field,
          direction: 'asc',
        };
      }

      return {
        field,
        direction: current.direction === 'asc' ? 'desc' : 'asc',
      };
    });
  }
}
