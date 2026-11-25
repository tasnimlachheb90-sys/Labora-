
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnInit,
  OnDestroy,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Calendar as FC, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { Equipment as EquipmentService } from '../../services/equipment';
@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.html',
  styleUrl: './calendar.css',
})
export class Calendar implements OnInit, AfterViewInit, OnDestroy {

  private svc = inject(EquipmentService);

  @ViewChild('calEl')
  calEl!: ElementRef<HTMLElement>;

  categories: string[] = [];
  selected = '';

  private calendar!: FC;

  private allEvents: EventInput[] = [
    {
      title: 'Canon EOS',
      start: '2026-11-20',
      end: '2026-11-23',
      extendedProps: { category: 'camera' }
    },
    {
      title: 'Prusa MK4',
      start: '2026-11-24',
      end: '2026-11-26',
      extendedProps: { category: 'printer' }
    },
    {
      title: 'Arduino Kit',
      start: '2026-11-27',
      extendedProps: { category: 'lab-kit' }
    }
  ];

  ngOnInit(): void {
    this.svc.getFilters().subscribe({
      next: (o) => {
        this.categories = o.categories;
      },
      error: (err) => {
        console.error('Erreur filters:', err);
      }
    });
  }

  ngAfterViewInit(): void {

    this.calendar = new FC(this.calEl.nativeElement, {
      plugins: [dayGridPlugin, interactionPlugin],

      initialView: 'dayGridMonth',

      initialDate: '2026-11-19',

      locale: 'fr',

      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: ''
      },

      events: (info, successCallback) => {
        successCallback(this.filtered());
      },

      dateClick: (arg) => {
        alert('Date : ' + arg.dateStr);
      },

      eventClick: (arg) => {
        alert('Équipement : ' + arg.event.title);
      }
    });

    this.calendar.render();
  }

  private filtered(): EventInput[] {
    return this.selected
      ? this.allEvents.filter(
          (event) =>
            event.extendedProps?.['category'] === this.selected
        )
      : this.allEvents;
  }

  onFilter(): void {
    this.calendar.refetchEvents();
  }

  ngOnDestroy(): void {
    if (this.calendar) {
      this.calendar.destroy();
    }
  }
}
