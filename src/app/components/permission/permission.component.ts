import { Component } from '@angular/core';
import { AuthGuard } from 'src/app/auth-guard.guard';

@Component({
  selector: 'app-permission',
  templateUrl: './permission.component.html',
  styleUrls: ['./permission.component.css'],
})
export class PermissionComponent {
  isAdminMode = false;

  constructor(private authGuard: AuthGuard) {}

  togglePermission() {
    this.isAdminMode = !this.isAdminMode;
    const permission = this.isAdminMode ? 'Admin' : 'User';
    console.log(permission);
    this.authGuard.setPermission(permission);
  }
}
