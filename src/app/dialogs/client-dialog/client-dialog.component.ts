import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { ClientFormValue, ClientStatus } from '../../models/client.model';

@Component({
  selector: 'app-client-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
  ],
  templateUrl: './client-dialog.component.html',
  styleUrl: './client-dialog.component.css',
})
export class ClientDialogComponent {
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<ClientDialogComponent>);
  private data = inject<ClientFormValue | null>(MAT_DIALOG_DATA);

  readonly clientForm = this.fb.nonNullable.group({
    name: [this.data?.name ?? '', [Validators.required, Validators.minLength(2)]],
    email: [this.data?.email ?? '', [Validators.required, Validators.email]],
    phone: [this.data?.phone ?? '', [Validators.required]],
    company: [this.data?.company ?? '', [Validators.required]],
    status: [(this.data?.status ?? 'Active') as ClientStatus, [Validators.required]],
  });

  readonly isEdit = !!this.data;

  get f() {
    return this.clientForm.controls;
  }

  save(): void {
    if (this.clientForm.invalid) {
      this.clientForm.markAllAsTouched();
      return;
    }

    this.dialogRef.close(this.clientForm.getRawValue());
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
