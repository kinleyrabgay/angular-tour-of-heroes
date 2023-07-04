import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  permission: string | undefined;

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (this.permission !== 'Admin') {
      this.router.navigate(['/dashboard']);
      return false;
    }
    return true;
  }

  setPermission(permission: string) {
    this.permission = permission;
  }
}
