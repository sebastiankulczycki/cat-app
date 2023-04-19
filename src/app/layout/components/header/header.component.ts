import { Component, ViewChild } from '@angular/core';
import { ShowListDirective } from 'src/app/shared/directives/show-list.directive';
import { AuthService } from 'src/app/shared/services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  constructor(private authService: AuthService) {}

  onLogoutClick(event: MouseEvent): void {
    event.preventDefault();
    this.authService.logoutUser();
  }
}
