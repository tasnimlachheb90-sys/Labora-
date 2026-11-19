import { Component } from '@angular/core';
import {
  Router,
  RouterOutlet,
  RouterLink,
  RouterLinkActive,
  NavigationEnd
} from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {

  showSidebar = false;

  userName = 'User';
  userRole = 'Student';

  constructor(private router: Router) {

    this.updateUserInfo();

    this.showSidebar = this.router.url !== '/';

    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe((event) => {
        const navigation = event as NavigationEnd;

        this.showSidebar = navigation.urlAfterRedirects !== '/';

        // Actualiser les informations après la connexion
        this.updateUserInfo();
      });
  }

  updateUserInfo(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    this.userName = user.username || 'User';
    this.userRole = user.role || 'Student';
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
