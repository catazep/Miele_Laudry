import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-cycles-list',
  templateUrl: './cycles-list.component.html',
  styleUrls: ['./cycles-list.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CyclesListComponent {}
