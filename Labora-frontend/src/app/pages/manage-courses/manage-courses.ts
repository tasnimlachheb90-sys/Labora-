
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CourseService } from '../../services/course.service';

@Component({
  selector: 'app-manage-courses',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './manage-courses.html',
  styleUrl: './manage-courses.css'
})
export class ManageCourses implements OnInit {

  courses: any[] = [];

  course = {
    title: '',
    description: '',
    instructor: '',
    duration: ''
  };

  editingId: number | null = null;
  message = '';
  errorMessage = '';

  constructor(private courseService: CourseService) {}

  ngOnInit(): void {
    this.loadCourses();
  }

  // Afficher tous les cours
  loadCourses(): void {
    this.courseService.getCourses().subscribe({
      next: (response: any) => {

        this.courses = response.data || [];
        console.log('IDS DES COURS :', this.courses.map(c => c.id));

        console.log(
          'COURS REÇUS DU BACKEND :',
          this.courses
        );

        this.errorMessage = '';
      },
      error: (error) => {
        console.error('Erreur chargement des cours :', error);
        this.errorMessage = 'Unable to load courses.';
      }
    });
  }

  // Ajouter ou modifier un cours
  saveCourse(): void {
    this.message = '';
    this.errorMessage = '';

    if (
      !this.course.title.trim() ||
      !this.course.description.trim() ||
      !this.course.instructor.trim() ||
      !this.course.duration.trim()
    ) {
      this.errorMessage = 'Please fill in all fields.';
      return;
    }

    if (this.editingId === null) {

      // Ajouter un cours
      this.courseService.addCourse(this.course).subscribe({
        next: () => {
          this.message = 'Course added successfully!';
          this.resetForm();
          this.loadCourses();
        },
        error: (error) => {
          console.error('Erreur ajout :', error);
          this.errorMessage =
            error.error?.message || 'Error adding course.';
        }
      });

    } else {

      // Modifier un cours
      this.courseService.updateCourse(
        this.editingId,
        this.course
      ).subscribe({
        next: () => {
          this.message = 'Course updated successfully!';
          this.resetForm();
          this.loadCourses();
        },
        error: (error) => {
          console.error('Erreur modification :', error);
          this.errorMessage =
            error.error?.message || 'Error updating course.';
        }
      });
    }
  }

  // Préparer la modification
  editCourse(course: any): void {

    this.editingId = course.id;

    this.course = {
      title: course.title,
      description: course.description,
      instructor: course.instructor,
      duration: course.duration
    };

    this.message = '';
    this.errorMessage = '';
  }

  // Supprimer un cours
  deleteCourse(id: number): void {

    console.log('IDENTIFIANT À SUPPRIMER :', id);

    if (confirm('Are you sure you want to delete this course?')) {

      this.courseService.deleteCourse(id).subscribe({
        next: (response: any) => {

          console.log('RÉPONSE SUPPRESSION :', response);

          this.message = 'Course deleted successfully!';
          this.errorMessage = '';

          this.loadCourses();
        },
        error: (error) => {

          console.error('ERREUR SUPPRESSION :', error);

          this.errorMessage =
            error.error?.message || 'Error deleting course.';
        }
      });
    }
  }

  // Vider le formulaire
  resetForm(): void {

    this.course = {
      title: '',
      description: '',
      instructor: '',
      duration: ''
    };

    this.editingId = null;
  }
}
