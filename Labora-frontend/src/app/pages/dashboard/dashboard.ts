
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-dashboard',
  imports: [RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {

  user: any = JSON.parse(localStorage.getItem('user') || '{}');

  userName = this.user.username || 'User';
  userRole = this.user.role || 'Student';

  stats = [
    { title: 'Total Users', value: '0', icon: '👥', color: 'blue' },
    { title: 'Students', value: '0', icon: '🎓', color: 'purple' },
    { title: 'Administrators', value: '0', icon: '🛡️', color: 'orange' },
    { title: 'Total Tasks', value: '—', icon: '📋', color: 'green' }
  ];

  constructor(
    private router: Router,
    private userService: UserService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    if (this.userRole?.toLowerCase() === 'admin') {
      this.loadStatistics();
    }
  }

  loadStatistics(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        const totalUsers = users.length;

        const students = users.filter(
          user => user.role?.toLowerCase() === 'student'
        ).length;

        const admins = users.filter(
          user => user.role?.toLowerCase() === 'admin'
        ).length;

        this.stats[0].value = totalUsers.toString();
        this.stats[1].value = students.toString();
        this.stats[2].value = admins.toString();

        console.log('Dashboard statistics:', this.stats);

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Error loading dashboard statistics:', error);
      }
    });
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    this.router.navigateByUrl('/', { replaceUrl: true });
  }
}
